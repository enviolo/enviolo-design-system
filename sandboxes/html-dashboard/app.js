(function () {
  "use strict";

  var SVG_NS = "http://www.w3.org/2000/svg";

  function el(name, attrs) {
    var node = document.createElementNS(SVG_NS, name);
    for (var key in attrs) {
      var value = attrs[key];
      // route CSS-custom-property colors through the style property so var()
      // resolves the same way it does for stylesheet rules, not as a raw
      // presentation-attribute string
      if (typeof value === "string" && value.indexOf("var(") === 0) {
        node.style.setProperty(key, value);
      } else {
        node.setAttribute(key, value);
      }
    }
    return node;
  }

  function formatNumber(n) {
    return Math.round(n).toLocaleString("en-US");
  }

  // Charts use flat fills from the Enviolo ramp (--chart-1 .. --chart-5). The sparklines are
  // single-series, so they use --chart-3, the first step that clears 3:1 in both modes
  // (design.md 4.2). Gradients are reserved for brand moments.

  // --- Sample data ----------------------------------------------------------------
  // Seven months of daily history, generated deterministically so the filters have real
  // ranges to work on. "Today" is fixed so the page looks the same on every visit.

  var DAYS = 210;
  var END = new Date(2026, 7, 18); // Aug 18, 2026
  var WEEKDAY_FACTOR = [0.93, 0.96, 0.98, 1.0, 1.12, 1.22, 1.05]; // Mon .. Sun
  var WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  function dayAt(i) {
    var d = new Date(END);
    d.setDate(END.getDate() - (DAYS - 1 - i));
    return d;
  }
  function weekdayOf(d) {
    return (d.getDay() + 6) % 7; // Monday = 0
  }
  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }
  function iso(d) {
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }
  function fmtDay(d) {
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  function fmtDayYear(d) {
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  var HISTORY = [];
  (function build() {
    for (var i = 0; i < DAYS; i++) {
      var date = dayAt(i);
      var trend = 5200 + i * 22;
      var wobble = 1 + 0.025 * Math.sin(i * 1.3) + 0.015 * Math.sin(i * 0.37 + 1);
      HISTORY.push({
        idx: i,
        date: date,
        weekday: weekdayOf(date),
        total: Math.round(trend * WEEKDAY_FACTOR[weekdayOf(date)] * wobble / 10) * 10,
        hubs: Math.round(118000 + i * 52 + 400 * Math.sin(i * 0.21)),
        cycle: 3.9 - i * 0.0028 + 0.08 * Math.sin(i * 0.9),
        alerts: Math.max(0, Math.round(2 + i * 0.004 + 0.9 * Math.sin(i * 0.7) + 0.8 * Math.sin(i * 1.9))),
      });
    }
  })();

  // --- Segments: the Enviolo ramp as chart series ---------------------------------
  // design.md 4.2: series follow the ramp order, lightest first (--chart-1 .. --chart-5),
  // and every series is labelled, because the pale steps are weak on their own.

  var SEGMENTS = [
    { name: "Cargo", share: 0.38 },
    { name: "Speed pedelec", share: 0.26 },
    { name: "SUV", share: 0.18 },
    { name: "City", share: 0.11 },
    { name: "Other", share: 0.07 },
  ];

  function seriesColor(k) {
    return "var(--chart-" + (k + 1) + ")";
  }

  // Split a daily total across the segments. A small deterministic wobble keeps the
  // lines from running parallel; the parts always add back up to the total.
  function splitTotal(total, i) {
    var weights = SEGMENTS.map(function (s, k) {
      return s.share * (1 + 0.06 * Math.sin(i * 1.7 + k * 2.3));
    });
    var sum = weights.reduce(function (a, b) { return a + b; }, 0);
    var parts = weights.map(function (w) { return Math.round(total * w / sum); });
    var drift = total - parts.reduce(function (a, b) { return a + b; }, 0);
    parts[parts.length - 1] += drift;
    return parts;
  }

  function sum(list) {
    return list.reduce(function (a, b) { return a + b; }, 0);
  }

  // A tidy axis: the smallest step on a 1 / 2 / 2.5 / 5 / 10 scale that needs at most six gridlines.
  function niceAxis(max) {
    max = Math.max(max, 1);
    var base = Math.pow(10, Math.floor(Math.log10(max / 6)));
    var multipliers = [1, 2, 2.5, 5, 10];
    for (var i = 0; i < multipliers.length; i++) {
      var step = multipliers[i] * base;
      if (Math.ceil(max / step) <= 6) return { max: Math.ceil(max / step) * step, step: step };
    }
    return { max: max, step: max / 4 };
  }

  // --- Sparklines -----------------------------------------------------------

  function renderSparkline(svg, values) {
    svg.textContent = "";
    if (values.length < 2) return;
    var min = Math.min.apply(null, values);
    var max = Math.max.apply(null, values);
    var range = max - min || 1;
    var w = 100, h = 32, pad2 = 3;

    function point(value, i) {
      var x = (i / (values.length - 1)) * w;
      var y = pad2 + (1 - (value - min) / range) * (h - pad2 * 2);
      return [x, y];
    }

    var points = values.map(point);
    svg.appendChild(el("polyline", {
      points: points.map(function (p) { return p.join(","); }).join(" "),
      fill: "none",
      stroke: "var(--muted-foreground)",
      "stroke-width": "1.5",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
    }));
    svg.appendChild(el("polyline", {
      points: points.slice(-3).map(function (p) { return p.join(","); }).join(" "),
      fill: "none",
      stroke: "var(--chart-3)",
      "stroke-width": "2",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
    }));
    var lastPoint = points[points.length - 1];
    svg.appendChild(el("circle", { cx: lastPoint[0], cy: lastPoint[1], r: "2.4", fill: "var(--chart-3)" }));
  }

  // --- Legend and tooltip -------------------------------------------------------

  function renderLegend(list) {
    SEGMENTS.forEach(function (s, k) {
      var item = document.createElement("li");
      var swatch = document.createElement("span");
      swatch.className = "chart-swatch";
      swatch.style.setProperty("--chart-indicator-color", seriesColor(k));
      item.appendChild(swatch);
      item.appendChild(document.createTextNode(s.name));
      list.appendChild(item);
    });
  }

  function tooltipRow(name, value, color, isTotal) {
    var row = document.createElement("div");
    row.className = "chart-tooltip-item" + (isTotal ? " chart-tooltip-total" : "");
    if (color) {
      var swatch = document.createElement("span");
      swatch.className = "chart-swatch";
      swatch.style.setProperty("--chart-indicator-color", color);
      row.appendChild(swatch);
    }
    var label = document.createElement("span");
    label.textContent = name;
    row.appendChild(label);
    if (value !== null) {
      var amount = document.createElement("span");
      amount.className = "chart-tooltip-value";
      amount.textContent = formatNumber(value);
      row.appendChild(amount);
    }
    return row;
  }

  function fillTooltip(tooltip, point) {
    tooltip.querySelector(".chart-tooltip-label").textContent = point.label;
    var items = tooltip.querySelector(".chart-tooltip-items");
    items.textContent = "";
    if (point.empty) {
      items.appendChild(tooltipRow("No days in this range", null, null, false));
      return;
    }
    SEGMENTS.forEach(function (s, k) {
      items.appendChild(tooltipRow(s.name, point.parts[k], seriesColor(k), false));
    });
    items.appendChild(tooltipRow("Total", point.total, null, true));
  }

  function positionTooltip(tooltip, svg, viewBoxW, viewBoxH, xSvg, ySvg) {
    var rect = svg.getBoundingClientRect();
    var scaleX = rect.width / viewBoxW;
    var scaleY = rect.height / viewBoxH;
    tooltip.style.left = rect.left + xSvg * scaleX + "px";
    tooltip.style.top = rect.top + ySvg * scaleY + "px";
  }

  // --- Line chart: one line per segment -----------------------------------------

  function renderLineChart(config) {
    var svg = config.svg;
    var tooltip = config.tooltip;
    var data = config.data; // [{ label, total, parts }]
    var axisMax = config.axisMax;
    var axisStep = config.axisStep;

    svg.textContent = "";
    tooltip.hidden = true;

    var viewBoxW = 640, viewBoxH = 280;
    var margin = { top: 16, right: 24, bottom: 30, left: 46 };
    var innerW = viewBoxW - margin.left - margin.right;
    var innerH = viewBoxH - margin.top - margin.bottom;
    var n = data.length;

    function xAt(i) {
      return n === 1 ? margin.left + innerW / 2 : margin.left + (i / (n - 1)) * innerW;
    }
    function yAt(value) {
      return margin.top + innerH - (value / axisMax) * innerH;
    }

    // Gridlines + y-axis labels
    var ticks = Math.round(axisMax / axisStep);
    for (var t = 0; t <= ticks; t++) {
      var value = t * axisStep;
      var y = yAt(value);
      svg.appendChild(el("line", {
        x1: margin.left, x2: viewBoxW - margin.right, y1: y, y2: y,
        class: "chart-grid-line",
      }));
      var label = el("text", {
        x: margin.left - 10, y: y + 4, "text-anchor": "end", class: "chart-axis-label",
      });
      label.textContent = formatNumber(value);
      svg.appendChild(label);
    }

    // One polyline per segment, plus a dot on the last point
    SEGMENTS.forEach(function (s, k) {
      var pts = data.map(function (d, i) { return [xAt(i), yAt(d.parts[k])]; });
      if (n > 1) {
        svg.appendChild(el("polyline", {
          points: pts.map(function (p) { return p.join(","); }).join(" "),
          fill: "none", stroke: seriesColor(k), "stroke-width": "2.5",
          "stroke-linecap": "round", "stroke-linejoin": "round",
        }));
      }
      var last = pts[pts.length - 1];
      svg.appendChild(el("circle", { cx: last[0], cy: last[1], r: "3.5", fill: seriesColor(k), stroke: "var(--card)", "stroke-width": "2" }));
    });

    // x-axis labels: about seven, evenly spread, never doubled up
    var shown = {};
    var labelCount = Math.min(n, 7);
    for (var j = 0; j < labelCount; j++) {
      var at = labelCount === 1 ? 0 : Math.round(j * (n - 1) / (labelCount - 1));
      if (shown[at]) continue;
      shown[at] = true;
      var xl = el("text", {
        x: xAt(at), y: viewBoxH - margin.bottom + 20, "text-anchor": "middle", class: "chart-axis-label",
      });
      xl.textContent = data[at].label;
      svg.appendChild(xl);
    }

    // Crosshair
    var crosshair = el("line", {
      x1: 0, x2: 0, y1: margin.top, y2: viewBoxH - margin.bottom, class: "chart-crosshair",
    });
    svg.appendChild(crosshair);

    // Hover targets (one column per point)
    var colWidth = innerW / n;
    data.forEach(function (d, i) {
      var target = el("rect", {
        x: margin.left + i * colWidth, y: margin.top, width: colWidth, height: innerH,
        class: "chart-hover-target",
      });
      target.addEventListener("mouseenter", function () {
        var cx = xAt(i);
        crosshair.setAttribute("x1", cx);
        crosshair.setAttribute("x2", cx);
        crosshair.style.opacity = "1";
        fillTooltip(tooltip, d);
        tooltip.hidden = false;
        positionTooltip(tooltip, svg, viewBoxW, viewBoxH, cx, yAt(Math.max.apply(null, d.parts)));
      });
      target.addEventListener("mouseleave", function () {
        crosshair.style.opacity = "0";
        tooltip.hidden = true;
      });
      svg.appendChild(target);
    });
  }

  // --- Stacked bar chart: one block per segment, lightest at the bottom -----------

  function renderBarChart(config) {
    var svg = config.svg;
    var tooltip = config.tooltip;
    var data = config.data; // [{ label, total, parts, empty }]
    var axisMax = config.axisMax;
    var axisStep = config.axisStep;

    svg.textContent = "";
    tooltip.hidden = true;

    var viewBoxW = 640, viewBoxH = 280;
    var margin = { top: 24, right: 16, bottom: 30, left: 46 };
    var innerW = viewBoxW - margin.left - margin.right;
    var innerH = viewBoxH - margin.top - margin.bottom;
    var barMax = 24;

    function yAt(value) {
      return margin.top + innerH - (value / axisMax) * innerH;
    }

    var ticks = Math.round(axisMax / axisStep);
    for (var t = 0; t <= ticks; t++) {
      var value = t * axisStep;
      var y = yAt(value);
      svg.appendChild(el("line", {
        x1: margin.left, x2: viewBoxW - margin.right, y1: y, y2: y, class: "chart-grid-line",
      }));
      var label = el("text", {
        x: margin.left - 10, y: y + 4, "text-anchor": "end", class: "chart-axis-label",
      });
      label.textContent = formatNumber(value);
      svg.appendChild(label);
    }

    var slot = innerW / data.length;
    var barWidth = Math.min(barMax, slot * 0.5);
    var peakTotal = Math.max.apply(null, data.map(function (d) { return d.total; }));

    data.forEach(function (d, i) {
      var cx = margin.left + slot * i + slot / 2;
      var stacked = 0;
      if (!d.empty) {
        d.parts.forEach(function (part, k) {
          var top = yAt(stacked + part);
          var bottom = yAt(stacked);
          // 1px card-coloured stroke separates neighbouring segments
          svg.appendChild(el("rect", {
            x: cx - barWidth / 2, y: top, width: barWidth, height: Math.max(bottom - top, 0),
            fill: seriesColor(k), stroke: "var(--card)", "stroke-width": "1",
          }));
          stacked += part;
        });
      }
      var barTop = yAt(d.total);

      if (!d.empty && d.total === peakTotal) {
        var peakLabel = el("text", {
          x: cx, y: barTop - 8, "text-anchor": "middle", class: "chart-value-label",
        });
        peakLabel.textContent = formatNumber(d.total);
        svg.appendChild(peakLabel);
      }

      var xl = el("text", {
        x: cx, y: viewBoxH - margin.bottom + 20, "text-anchor": "middle", class: "chart-axis-label",
      });
      xl.textContent = d.label;
      svg.appendChild(xl);

      var target = el("rect", {
        x: margin.left + slot * i, y: margin.top, width: slot, height: innerH,
        class: "chart-hover-target",
      });
      target.addEventListener("mouseenter", function () {
        fillTooltip(tooltip, d);
        tooltip.hidden = false;
        positionTooltip(tooltip, svg, viewBoxW, viewBoxH, cx, barTop);
      });
      target.addEventListener("mouseleave", function () {
        tooltip.hidden = true;
      });
      svg.appendChild(target);
    });
  }

  // --- Filters: time range ---------------------------------------------------------

  var range = { i0: DAYS - 14, i1: DAYS - 1 };
  var presetDays = 14;

  var presetButtons = [].slice.call(document.querySelectorAll("[data-range]"));
  var rangeText = document.getElementById("range-text");
  var resetButton = document.getElementById("range-reset");
  var summary = document.getElementById("range-summary");

  function clampIndex(i) {
    return Math.max(0, Math.min(DAYS - 1, i));
  }

  function setRange(i0, i1, preset) {
    range.i0 = clampIndex(Math.min(i0, i1));
    range.i1 = clampIndex(Math.max(i0, i1));
    presetDays = preset;
    syncControls();
    update();
  }

  function syncControls() {
    rangeText.textContent = fmtDayYear(HISTORY[range.i0].date) + " – " + fmtDayYear(HISTORY[range.i1].date);
    presetButtons.forEach(function (b) {
      b.setAttribute("aria-pressed", String(presetDays === Number(b.dataset.range)));
    });
  }

  function initFilters() {
    presetButtons.forEach(function (b) {
      b.addEventListener("click", function () {
        var n = Number(b.dataset.range);
        setRange(DAYS - n, DAYS - 1, n);
      });
    });

    resetButton.addEventListener("click", function () {
      setRange(DAYS - 14, DAYS - 1, 14);
    });
  }

  // --- Rendering for the selected range ---------------------------------------------

  function setStat(key, valueText, pct, goodWhenUp, caption, values) {
    var card = document.querySelector('[data-stat="' + key + '"]');
    card.querySelector(".stat-value").textContent = valueText;
    var pill = card.querySelector(".pill");
    if (pct === null || !isFinite(pct)) {
      pill.hidden = true;
    } else if (Math.abs(pct) < 0.05) {
      // no real change: a neutral pill, not a status colour
      pill.hidden = false;
      delete pill.dataset.variant;
      pill.textContent = "0.0%";
    } else {
      var up = pct >= 0;
      pill.hidden = false;
      pill.dataset.variant = up === goodWhenUp ? "success" : "error";
      pill.textContent = (up ? "▲ " : "▼ ") + Math.abs(pct).toFixed(1) + "%";
    }
    card.querySelector(".stat-caption").textContent = caption;
    renderSparkline(card.querySelector(".sparkline"), values);
  }

  function pct(current, previous) {
    return previous ? (current - previous) / previous * 100 : null;
  }

  function renderStats(slice, days) {
    var prevStart = range.i0 - days;
    var prev = prevStart >= 0 ? HISTORY.slice(prevStart, range.i0) : null;
    var vsPrev = days === 1 ? "vs previous day" : "vs previous " + days + " days";

    var first = slice[0], last = slice[slice.length - 1];
    setStat("hubs", formatNumber(last.hubs),
      slice.length > 1 ? pct(last.hubs, first.hubs) : null, true,
      "vs start of period", slice.map(function (d) { return d.hubs; }));

    setStat("rides", formatNumber(sum(slice.map(function (d) { return d.total; }))),
      prev ? pct(sum(slice.map(function (d) { return d.total; })), sum(prev.map(function (d) { return d.total; }))) : null, true,
      prev ? vsPrev : "no earlier period", slice.map(function (d) { return d.total; }));

    var cycle = sum(slice.map(function (d) { return d.cycle; })) / slice.length;
    setStat("cycle", cycle.toFixed(1) + " days",
      prev ? pct(cycle, sum(prev.map(function (d) { return d.cycle; })) / prev.length) : null, false,
      prev ? "faster " + vsPrev : "no earlier period", slice.map(function (d) { return d.cycle; }));

    var alerts = sum(slice.map(function (d) { return d.alerts; }));
    setStat("alerts", formatNumber(alerts),
      prev ? pct(alerts, sum(prev.map(function (d) { return d.alerts; }))) : null, false,
      prev ? vsPrev : "no earlier period", slice.map(function (d) { return d.alerts; }));
  }

  function renderCharts(slice) {
    var rangeText = fmtDay(slice[0].date) + " – " + fmtDay(slice[slice.length - 1].date);

    // Daily lines
    var lineData = slice.map(function (d) {
      return { label: fmtDay(d.date), total: d.total, parts: splitTotal(d.total, d.idx) };
    });
    var maxPart = Math.max.apply(null, lineData.map(function (d) { return Math.max.apply(null, d.parts); }));
    var lineAxis = niceAxis(maxPart * 1.05);
    var lineSvg = document.getElementById("line-chart");
    renderLineChart({
      svg: lineSvg, tooltip: document.getElementById("line-tooltip"),
      axisMax: lineAxis.max, axisStep: lineAxis.step, data: lineData,
    });
    var totals = slice.map(function (d) { return d.total; });
    lineSvg.setAttribute("aria-label",
      "Line chart of daily rides by segment from " + rangeText + ", one line each for " +
      SEGMENTS.map(function (s) { return s.name; }).join(", ") + ". Total daily rides range from " +
      formatNumber(Math.min.apply(null, totals)) + " to " + formatNumber(Math.max.apply(null, totals)) + ".");
    document.getElementById("line-desc").textContent = "Daily completed rides, split by hub segment · " + rangeText;

    // Average per weekday
    var barData = WEEKDAYS.map(function (name, w) {
      var days = slice.filter(function (d) { return d.weekday === w; });
      if (!days.length) return { label: name, total: 0, parts: SEGMENTS.map(function () { return 0; }), empty: true };
      var parts = SEGMENTS.map(function (s, k) {
        return sum(days.map(function (d) { return splitTotal(d.total, d.idx)[k]; })) / days.length;
      });
      return { label: name, total: sum(parts), parts: parts };
    });
    var barAxis = niceAxis(Math.max.apply(null, barData.map(function (d) { return d.total; })) * 1.05);
    var barSvg = document.getElementById("bar-chart");
    renderBarChart({
      svg: barSvg, tooltip: document.getElementById("bar-tooltip"),
      axisMax: barAxis.max, axisStep: barAxis.step, data: barData,
    });
    var peak = barData.reduce(function (a, b) { return b.total > a.total ? b : a; });
    barSvg.setAttribute("aria-label",
      "Stacked bar chart of average rides per day by weekday and segment, " + rangeText +
      ". The busiest weekday is " + peak.label + " with about " + formatNumber(peak.total) + " rides.");
    document.getElementById("bar-desc").textContent = "Average per day, by weekday and segment · " + rangeText;
  }

  function update() {
    var slice = HISTORY.slice(range.i0, range.i1 + 1);
    var days = slice.length;
    renderStats(slice, days);
    renderCharts(slice);
    // the date field already shows the range, so the summary only counts the days
    summary.textContent = days + (days === 1 ? " day" : " days");
    document.dispatchEvent(new CustomEvent("dashboard:range", { detail: currentRange() }));
  }

  function currentRange() {
    return {
      from: HISTORY[range.i0].date, to: HISTORY[range.i1].date,
      start: HISTORY[0].date, end: HISTORY[DAYS - 1].date,
    };
  }

  function indexOfDate(d) {
    var day = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    return DAYS - 1 - Math.round((END - day) / 86400000);
  }

  // Bridge for the React calendar test at the bottom of the page: it reads the range,
  // listens for "dashboard:range" and sets a new one.
  window.EnvioloDashboard = {
    getRange: currentRange,
    setRange: function (from, to) {
      setRange(indexOfDate(from), indexOfDate(to), null);
    },
  };

  // --- Boot -----------------------------------------------------------------

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".chart-legend").forEach(renderLegend);
    initFilters();
    setRange(DAYS - 14, DAYS - 1, 14);
  });
})();
