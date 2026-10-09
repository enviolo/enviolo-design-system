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
    return n.toLocaleString("en-US");
  }

  // Charts use flat fills from the Enviolo ramp (--chart-1 .. --chart-5). The sparklines are
  // single-series, so they use --chart-3, the first step that clears 3:1 in both modes
  // (design.md 4.2). Gradients are reserved for brand moments.

  // --- Theme toggle -------------------------------------------------------

  function initThemeToggle() {
    var toggle = document.getElementById("theme-toggle");
    var root = document.documentElement;

    function sync() {
      var isDark = root.classList.contains("dark");
      toggle.setAttribute("aria-pressed", String(isDark));
    }

    toggle.addEventListener("click", function () {
      var isDark = root.classList.toggle("dark");
      localStorage.setItem("enviolo-theme", isDark ? "dark" : "light");
      sync();
    });

    sync();
  }

  // --- Sparklines -----------------------------------------------------------

  function renderSparkline(svg) {
    var values = svg.dataset.points.split(",").map(Number);
    var min = Math.min.apply(null, values);
    var max = Math.max.apply(null, values);
    var range = max - min || 1;
    var w = 100, h = 32, pad = 3;

    function point(value, i) {
      var x = (i / (values.length - 1)) * w;
      var y = pad + (1 - (value - min) / range) * (h - pad * 2);
      return [x, y];
    }

    var points = values.map(point);
    var base = el("polyline", {
      points: points.map(function (p) { return p.join(","); }).join(" "),
      fill: "none",
      stroke: "var(--muted-foreground)",
      "stroke-width": "1.5",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
    });
    var recent = el("polyline", {
      points: points.slice(-3).map(function (p) { return p.join(","); }).join(" "),
      fill: "none",
      stroke: "var(--chart-3)",
      "stroke-width": "2",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
    });
    var lastPoint = points[points.length - 1];
    var dot = el("circle", {
      cx: lastPoint[0],
      cy: lastPoint[1],
      r: "2.4",
      fill: "var(--chart-3)",
    });

    svg.appendChild(base);
    svg.appendChild(recent);
    svg.appendChild(dot);
  }

  // --- Shared tooltip positioning ------------------------------------------

  function positionTooltip(tooltip, svg, viewBoxW, viewBoxH, xSvg, ySvg) {
    var rect = svg.getBoundingClientRect();
    var scaleX = rect.width / viewBoxW;
    var scaleY = rect.height / viewBoxH;
    tooltip.style.left = rect.left + xSvg * scaleX + "px";
    tooltip.style.top = rect.top + ySvg * scaleY + "px";
  }

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
    var amount = document.createElement("span");
    amount.className = "chart-tooltip-value";
    amount.textContent = formatNumber(value);
    row.appendChild(label);
    row.appendChild(amount);
    return row;
  }

  function fillTooltip(tooltip, point) {
    tooltip.querySelector(".chart-tooltip-label").textContent = point.label;
    var items = tooltip.querySelector(".chart-tooltip-items");
    items.textContent = "";
    SEGMENTS.forEach(function (s, k) {
      items.appendChild(tooltipRow(s.name, point.parts[k], seriesColor(k), false));
    });
    items.appendChild(tooltipRow("Total", point.total, null, true));
  }

  // --- Line chart: one line per segment -----------------------------------------

  function renderLineChart(config) {
    var svg = config.svg;
    var tooltip = config.tooltip;
    var data = config.data; // [{ label, total, parts }]
    var axisMax = config.axisMax;
    var axisStep = config.axisStep;

    var viewBoxW = 640, viewBoxH = 280;
    var margin = { top: 16, right: 24, bottom: 30, left: 46 };
    var innerW = viewBoxW - margin.left - margin.right;
    var innerH = viewBoxH - margin.top - margin.bottom;

    function xAt(i) {
      return margin.left + (i / (data.length - 1)) * innerW;
    }
    function yAt(value) {
      return margin.top + innerH - (value / axisMax) * innerH;
    }

    // Gridlines + y-axis labels
    var ticks = axisMax / axisStep;
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
      svg.appendChild(el("polyline", {
        points: pts.map(function (p) { return p.join(","); }).join(" "),
        fill: "none", stroke: seriesColor(k), "stroke-width": "2.5",
        "stroke-linecap": "round", "stroke-linejoin": "round",
      }));
      var last = pts[pts.length - 1];
      svg.appendChild(el("circle", { cx: last[0], cy: last[1], r: "3.5", fill: seriesColor(k), stroke: "var(--card)", "stroke-width": "2" }));
    });

    // x-axis labels (sparse)
    data.forEach(function (d, i) {
      if (i % 3 !== 0 && i !== data.length - 1) return;
      var xl = el("text", {
        x: xAt(i), y: viewBoxH - margin.bottom + 20, "text-anchor": "middle", class: "chart-axis-label",
      });
      xl.textContent = d.label;
      svg.appendChild(xl);
    });

    // Crosshair
    var crosshair = el("line", {
      x1: 0, x2: 0, y1: margin.top, y2: viewBoxH - margin.bottom, class: "chart-crosshair",
    });
    svg.appendChild(crosshair);

    // Hover targets (one column per point)
    var colWidth = innerW / data.length;
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
    var data = config.data; // [{ label, total, parts }]
    var axisMax = config.axisMax;
    var axisStep = config.axisStep;

    var viewBoxW = 640, viewBoxH = 280;
    var margin = { top: 24, right: 16, bottom: 30, left: 46 };
    var innerW = viewBoxW - margin.left - margin.right;
    var innerH = viewBoxH - margin.top - margin.bottom;
    var baselineY = margin.top + innerH;
    var barMax = 24;

    function yAt(value) {
      return margin.top + innerH - (value / axisMax) * innerH;
    }

    var ticks = axisMax / axisStep;
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
      var barTop = yAt(d.total);

      if (d.total === peakTotal) {
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

  // --- Boot -----------------------------------------------------------------

  function withParts(rows) {
    return rows.map(function (r, i) {
      return { label: r[0], total: r[1], parts: splitTotal(r[1], i) };
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initThemeToggle();

    document.querySelectorAll(".sparkline").forEach(renderSparkline);
    document.querySelectorAll(".chart-legend").forEach(renderLegend);

    renderLineChart({
      svg: document.getElementById("line-chart"),
      tooltip: document.getElementById("line-tooltip"),
      axisMax: 4000,
      axisStep: 1000,
      data: withParts([
        ["Aug 5", 6120], ["Aug 6", 6480], ["Aug 7", 6300], ["Aug 8", 6900], ["Aug 9", 7200],
        ["Aug 10", 7050], ["Aug 11", 7480], ["Aug 12", 7300], ["Aug 13", 7900], ["Aug 14", 8100],
        ["Aug 15", 7950], ["Aug 16", 8400], ["Aug 17", 8700], ["Aug 18", 9840],
      ]),
    });

    renderBarChart({
      svg: document.getElementById("bar-chart"),
      tooltip: document.getElementById("bar-tooltip"),
      axisMax: 12000,
      axisStep: 3000,
      data: withParts([
        ["Mon", 8200], ["Tue", 8600], ["Wed", 8900], ["Thu", 9100],
        ["Fri", 10400], ["Sat", 11240], ["Sun", 9700],
      ]),
    });
  });
})();
