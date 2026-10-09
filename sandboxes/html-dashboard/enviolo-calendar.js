/*
  <enviolo-calendar>: a range calendar as a plain web component. No React, no dependencies.

  Test build in the dashboard sandbox. It renders into the light DOM, so the page's tokens apply
  directly (see enviolo-calendar.css).

  Attributes
    months      1 or 2 visible months (default 2)
    week-start  0 = Sunday, 1 = Monday (default 1)
    locale      BCP 47 tag for month and weekday names (default: the page language, then en-US)
    min, max    ISO dates (yyyy-mm-dd); days outside are disabled
    today       ISO date to mark as today (default: the real today)

  Property
    range       { from: Date | null, to: Date | null }. Setting it never fires "change".

  Event
    change      fires when a complete range is picked; detail = { from: Date, to: Date }

  Behaviour (WAI-ARIA grid pattern for a date picker)
    Click or Enter: the first pick starts a range, the second ends it (an earlier second pick swaps).
    Arrows move by a day or a week, Home / End to the week's first / last day, Page Up / Down by a
    month, Shift + Page Up / Down by a year, Esc cancels a half-picked range.
*/
(function () {
  "use strict";

  // ---- date helpers: always local midnight, so daylight saving can't shift a day ----------------

  function parseIso(s) {
    if (!s) return null;
    var p = String(s).split("-").map(Number);
    return new Date(p[0], p[1] - 1, p[2]);
  }
  function toIso(d) {
    function pad(n) { return n < 10 ? "0" + n : String(n); }
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }
  function atMidnight(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }
  function addDays(d, n) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  }
  function startOfMonth(d) {
    return new Date(d.getFullYear(), d.getMonth(), 1);
  }
  function addMonths(d, n) {
    var target = new Date(d.getFullYear(), d.getMonth() + n, 1);
    var daysInTarget = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
    target.setDate(Math.min(d.getDate(), daysInTarget)); // Jan 31 + 1 month = Feb 28/29
    return target;
  }
  function sameDay(a, b) {
    return !!a && !!b && a.getTime() === b.getTime();
  }

  var uid = 0;

  class EnvioloCalendar extends HTMLElement {
    static get observedAttributes() {
      return ["months", "week-start", "locale", "min", "max", "today"];
    }

    constructor() {
      super();
      this._from = null;
      this._to = null;
      this._pending = false; // a start is picked, the end is not
      this._before = null; // the range to restore when a half-picked range is cancelled
      this._hover = null;
      this._view = null; // first day of the first visible month
      this._focus = null; // the date that holds the roving tabindex
      this._id = "ec" + ++uid;
      this._ready = false;
    }

    // ---- attributes -----------------------------------------------------------------------

    get _months() {
      return this.getAttribute("months") === "1" ? 1 : 2;
    }
    get _weekStart() {
      return this.getAttribute("week-start") === "0" ? 0 : 1;
    }
    get _locale() {
      return this.getAttribute("locale") || document.documentElement.lang || "en-US";
    }
    get _min() {
      return parseIso(this.getAttribute("min"));
    }
    get _max() {
      return parseIso(this.getAttribute("max"));
    }
    get _today() {
      return parseIso(this.getAttribute("today")) || atMidnight(new Date());
    }

    // ---- public API ----------------------------------------------------------------------

    get range() {
      return { from: this._from, to: this._to };
    }
    set range(r) {
      r = r || {};
      this._from = r.from ? atMidnight(r.from) : null;
      this._to = r.to ? atMidnight(r.to) : null;
      this._pending = false;
      this._hover = null;
      var anchor = this._to || this._from;
      if (anchor) {
        this._focus = this._from || anchor;
        if (!this._isVisible(anchor)) this._view = startOfMonth(addMonths(anchor, -(this._months - 1)));
      }
      if (this._ready) this._render(false);
    }

    connectedCallback() {
      if (!this.hasAttribute("role")) this.setAttribute("role", "group");
      if (!this.hasAttribute("aria-label")) this.setAttribute("aria-label", "Date range calendar");
      if (!this._listening) {
        this._listening = true;
        this.addEventListener("click", this._onClick.bind(this));
        this.addEventListener("keydown", this._onKeydown.bind(this));
        this.addEventListener("mouseover", this._onHover.bind(this));
        this.addEventListener("mouseleave", this._onLeave.bind(this));
      }
      if (!this._view) this._view = startOfMonth(addMonths(this._to || this._from || this._today, -(this._months - 1)));
      if (!this._focus) this._focus = this._to || this._from || this._today;
      this._ready = true;
      this._render(false);
    }

    attributeChangedCallback() {
      if (this._ready) this._render(false);
    }

    // ---- state helpers ---------------------------------------------------------------------

    _isVisible(d) {
      var start = this._view;
      var end = addMonths(start, this._months); // first day after the visible months
      return d >= start && d < new Date(end.getFullYear(), end.getMonth(), 1);
    }

    _inBounds(d) {
      var min = this._min, max = this._max;
      return (!min || d >= min) && (!max || d <= max);
    }

    _clamp(d) {
      var min = this._min, max = this._max;
      if (min && d < min) return min;
      if (max && d > max) return max;
      return d;
    }

    _announce(text) {
      var live = this.querySelector(".ec-live");
      if (live) live.textContent = text;
    }

    _fmt(d, opts) {
      return new Intl.DateTimeFormat(this._locale, opts).format(d);
    }

    // ---- rendering -------------------------------------------------------------------------

    _render(keepFocus) {
      var months = [];
      for (var i = 0; i < this._months; i++) months.push(this._monthHtml(addMonths(this._view, i), i));
      this.innerHTML = '<div class="ec-live" aria-live="polite"></div><div class="ec-months">' + months.join("") + "</div>";
      if (keepFocus) {
        var btn = this.querySelector('.ec-day[data-date="' + toIso(this._focus) + '"]');
        if (btn) btn.focus();
      }
      this._paintPreview();
    }

    _monthHtml(first, index) {
      var self = this;
      var label = this._fmt(first, { month: "long", year: "numeric" });
      var titleId = this._id + "-title-" + index;
      var firstVisible = index === 0, lastVisible = index === this._months - 1;

      var prevDisabled = this._min && startOfMonth(first) <= startOfMonth(this._min);
      var lastShown = addMonths(this._view, this._months - 1);
      var nextDisabled = this._max && startOfMonth(lastShown) >= startOfMonth(this._max);

      var chevron = function (d) {
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + d + '"/></svg>';
      };
      var prev = firstVisible
        ? '<button type="button" class="ec-nav" data-nav="-1" aria-label="Previous month"' + (prevDisabled ? " disabled" : "") + ">" + chevron("m15 18-6-6 6-6") + "</button>"
        : '<span class="ec-nav-spacer"></span>';
      var next = lastVisible
        ? '<button type="button" class="ec-nav" data-nav="1" aria-label="Next month"' + (nextDisabled ? " disabled" : "") + ">" + chevron("m9 18 6-6-6-6") + "</button>"
        : '<span class="ec-nav-spacer"></span>';

      // weekday headers
      var weekStart = this._weekStart;
      var heads = "";
      for (var w = 0; w < 7; w++) {
        var dow = (weekStart + w) % 7;
        var ref = new Date(2024, 0, 7 + dow); // 7 Jan 2024 is a Sunday
        heads += '<th scope="col" abbr="' + this._fmt(ref, { weekday: "long" }) + '">' + this._fmt(ref, { weekday: "short" }) + "</th>";
      }

      // day cells
      var offset = (first.getDay() - weekStart + 7) % 7;
      var daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
      var weeks = Math.ceil((offset + daysInMonth) / 7);
      var focusInMonth = this._focus && this._focus.getFullYear() === first.getFullYear() && this._focus.getMonth() === first.getMonth();
      var rows = "";
      for (var r = 0; r < weeks; r++) {
        var cells = "";
        for (var c = 0; c < 7; c++) {
          var dayNumber = r * 7 + c - offset + 1;
          if (dayNumber < 1 || dayNumber > daysInMonth) {
            cells += '<td class="ec-cell" role="presentation"></td>';
            continue;
          }
          cells += self._cellHtml(new Date(first.getFullYear(), first.getMonth(), dayNumber), focusInMonth);
        }
        rows += "<tr>" + cells + "</tr>";
      }

      return (
        '<div class="ec-month">' +
        '<div class="ec-caption">' + prev + '<span class="ec-title" id="' + titleId + '" aria-live="polite">' + label + "</span>" + next + "</div>" +
        '<table class="ec-grid" role="grid" aria-labelledby="' + titleId + '"><thead><tr>' + heads + "</tr></thead><tbody>" + rows + "</tbody></table>" +
        "</div>"
      );
    }

    _cellHtml(d, focusInMonth) {
      var from = this._from, to = this._to;
      var isStart = sameDay(d, from);
      var isEnd = sameDay(d, to);
      var inRange = !!(from && to && d > from && d < to);
      var selected = isStart || isEnd || inRange;
      var disabled = !this._inBounds(d);

      // roving tabindex: exactly one day in the whole calendar is a tab stop
      var isFocus = sameDay(d, this._focus) && !disabled;
      var label = this._fmt(d, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
      if (isStart && !to) label += ", range start";
      else if (isStart) label += ", range start, selected";
      else if (isEnd) label += ", range end, selected";
      else if (inRange) label += ", selected";

      var attrs = ' data-date="' + toIso(d) + '"';
      if (isStart) attrs += " data-start";
      if (isEnd) attrs += " data-end";
      if (inRange) attrs += " data-inrange";
      if (isStart && !to) attrs += " data-single";
      return (
        '<td class="ec-cell" role="gridcell" aria-selected="' + selected + '"' + attrs + (sameDay(d, this._today) ? " data-today" : "") + ">" +
        '<button type="button" class="ec-day" tabindex="' + (isFocus ? 0 : -1) + '" aria-label="' + label + '"' +
        (disabled ? " disabled" : "") + ' data-date="' + toIso(d) + '">' + d.getDate() + "</button></td>"
      );
    }

    // the hover preview while a start is picked: updated in place so the hovered button isn't replaced
    _paintPreview() {
      var from = this._from, hover = this._hover, active = this._pending && from && hover;
      var lo = null, hi = null;
      if (active) { lo = from < hover ? from : hover; hi = from < hover ? hover : from; }
      this.querySelectorAll("td[data-date]").forEach(function (td) {
        var d = parseIso(td.dataset.date);
        if (active && d >= lo && d <= hi) td.setAttribute("data-preview", ""); else td.removeAttribute("data-preview");
      });
    }

    // ---- interaction ---------------------------------------------------------------------

    _select(d) {
      if (!this._pending) {
        this._before = { from: this._from, to: this._to };
        this._from = d;
        this._to = null;
        this._pending = true;
        this._focus = d;
        this._render(true);
        this._announce("Start date " + this._fmt(d, { dateStyle: "long" }) + ". Choose an end date.");
        return;
      }
      var a = this._from, b = d;
      if (b < a) { var t = a; a = b; b = t; }
      this._from = a;
      this._to = b;
      this._pending = false;
      this._hover = null;
      this._focus = d;
      this._render(true);
      this._announce("Range selected: " + this._fmt(a, { dateStyle: "long" }) + " to " + this._fmt(b, { dateStyle: "long" }));
      this.dispatchEvent(new CustomEvent("change", { bubbles: true, detail: { from: a, to: b } }));
    }

    _moveFocus(d) {
      d = this._clamp(d);
      this._focus = d;
      if (!this._isVisible(d)) {
        this._view = d < this._view ? startOfMonth(d) : startOfMonth(addMonths(d, -(this._months - 1)));
      }
      this._render(true);
    }

    _shiftView(direction) {
      this._view = startOfMonth(addMonths(this._view, direction));
      // keep a valid tab stop inside the visible months
      if (!this._isVisible(this._focus)) this._focus = this._clamp(direction > 0 ? this._view : addDays(addMonths(this._view, this._months), -1));
      this._render(false);
      var first = this._view, last = addMonths(this._view, this._months - 1);
      this._announce(this._months === 1 ? this._fmt(first, { month: "long", year: "numeric" })
        : this._fmt(first, { month: "long", year: "numeric" }) + " and " + this._fmt(last, { month: "long", year: "numeric" }));
      var nav = this.querySelector('[data-nav="' + direction + '"]');
      if (nav && !nav.disabled) nav.focus(); // keep the keyboard on the button just used
    }

    _onClick(e) {
      var nav = e.target.closest("[data-nav]");
      if (nav && this.contains(nav)) { this._shiftView(Number(nav.dataset.nav)); return; }
      var day = e.target.closest(".ec-day");
      if (day && !day.disabled) this._select(parseIso(day.dataset.date));
    }

    _onHover(e) {
      if (!this._pending) return;
      var day = e.target.closest(".ec-day");
      if (!day || day.disabled) return;
      this._hover = parseIso(day.dataset.date);
      this._paintPreview();
    }

    _onLeave() {
      if (!this._pending) return;
      this._hover = null;
      this._paintPreview();
    }

    _onKeydown(e) {
      if (e.key === "Escape" && this._pending) {
        e.preventDefault();
        this._from = this._before && this._before.from;
        this._to = this._before && this._before.to;
        this._pending = false;
        this._hover = null;
        this._render(true);
        this._announce("Selection cancelled.");
        return;
      }
      var day = e.target.closest(".ec-day");
      if (!day) return;
      var d = parseIso(day.dataset.date), next = null, ws = this._weekStart;
      switch (e.key) {
        case "ArrowLeft": next = addDays(d, -1); break;
        case "ArrowRight": next = addDays(d, 1); break;
        case "ArrowUp": next = addDays(d, -7); break;
        case "ArrowDown": next = addDays(d, 7); break;
        case "Home": next = addDays(d, -((d.getDay() - ws + 7) % 7)); break;
        case "End": next = addDays(d, 6 - ((d.getDay() - ws + 7) % 7)); break;
        case "PageUp": next = addMonths(d, e.shiftKey ? -12 : -1); break;
        case "PageDown": next = addMonths(d, e.shiftKey ? 12 : 1); break;
        default: return;
      }
      e.preventDefault();
      this._moveFocus(next);
      if (this._pending) { this._hover = this._focus; this._paintPreview(); }
    }
  }

  if (!customElements.get("enviolo-calendar")) customElements.define("enviolo-calendar", EnvioloCalendar);
})();
