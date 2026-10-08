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

  // --- Gradients --------------------------------------------------------------
  // --chart-gradient-a/-b (tokens.css) hold the theme's pair: coral/dusk in
  // light mode, ivory/gold in dark. "a" is the brighter stop, "b" the deeper
  // one, so both modes read as the same dark-to-bright motion.

  function stop(offsetPct, colorVar, opacity) {
    var s = el("stop", { offset: offsetPct + "%" });
    s.style.setProperty("stop-color", colorVar);
    if (opacity !== undefined) s.style.setProperty("stop-opacity", opacity);
    return s;
  }

  function addLinearGradient(svg, id, stops, direction) {
    var coords = direction === "vertical-up"
      ? { x1: "0%", y1: "100%", x2: "0%", y2: "0%" } // bottom -> top
      : { x1: "0%", y1: "0%", x2: "0%", y2: "100%" }; // top -> bottom
    var gradient = el("linearGradient", Object.assign({ id: id }, coords));
    stops.forEach(function (s) { gradient.appendChild(s); });
    var defs = el("defs", {});
    defs.appendChild(gradient);
    svg.appendChild(defs);
  }

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
      stroke: "var(--chart-1)",
      "stroke-width": "2",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
    });
    var lastPoint = points[points.length - 1];
    var dot = el("circle", {
      cx: lastPoint[0],
      cy: lastPoint[1],
      r: "2.4",
      fill: "var(--chart-1)",
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

  // --- Line chart -----------------------------------------------------------

  function renderLineChart(config) {
    var svg = config.svg;
    var tooltip = config.tooltip;
    var data = config.data; // [{ label, value }]
    var axisMax = config.axisMax;
    var axisStep = config.axisStep;

    var viewBoxW = 640, viewBoxH = 280;
    var margin = { top: 16, right: 54, bottom: 30, left: 46 };
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

    // Area + line
    addLinearGradient(svg, "line-area-gradient", [
      stop(0, "var(--chart-gradient-a)", 0.28),
      stop(100, "var(--chart-gradient-b)", 0),
    ], "vertical-down");

    var linePoints = data.map(function (d, i) { return [xAt(i), yAt(d.value)]; });
    var areaPath = "M" + linePoints.map(function (p) { return p.join(","); }).join("L") +
      "L" + xAt(data.length - 1) + "," + yAt(0) + "L" + xAt(0) + "," + yAt(0) + "Z";

    svg.appendChild(el("path", { d: areaPath, fill: "url(#line-area-gradient)", stroke: "none" }));
    svg.appendChild(el("polyline", {
      points: linePoints.map(function (p) { return p.join(","); }).join(" "),
      fill: "none", stroke: "var(--chart-1)", "stroke-width": "2",
      "stroke-linecap": "round", "stroke-linejoin": "round",
    }));

    // x-axis labels (sparse)
    data.forEach(function (d, i) {
      if (i % 3 !== 0 && i !== data.length - 1) return;
      var xl = el("text", {
        x: xAt(i), y: viewBoxH - margin.bottom + 20, "text-anchor": "middle", class: "chart-axis-label",
      });
      xl.textContent = d.label;
      svg.appendChild(xl);
    });

    // End marker + direct label (value at the end)
    var last = linePoints[linePoints.length - 1];
    svg.appendChild(el("circle", { cx: last[0], cy: last[1], r: "4", fill: "var(--chart-1)", stroke: "var(--card)", "stroke-width": "2" }));
    var endLabel = el("text", {
      x: last[0] + 10, y: last[1] + 4, "text-anchor": "start", class: "chart-value-label",
    });
    endLabel.textContent = formatNumber(data[data.length - 1].value);
    svg.appendChild(endLabel);

    // Crosshair
    var crosshair = el("line", {
      x1: 0, x2: 0, y1: margin.top, y2: viewBoxH - margin.bottom, class: "chart-crosshair",
    });
    svg.appendChild(crosshair);

    // Hover targets (one column per point)
    var tooltipLabel = tooltip.querySelector(".chart-tooltip-label");
    var tooltipValue = tooltip.querySelector(".chart-tooltip-value");
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
        tooltipLabel.textContent = d.label;
        tooltipValue.textContent = formatNumber(d.value);
        tooltip.hidden = false;
        positionTooltip(tooltip, svg, viewBoxW, viewBoxH, cx, yAt(d.value));
      });
      target.addEventListener("mouseleave", function () {
        crosshair.style.opacity = "0";
        tooltip.hidden = true;
      });
      svg.appendChild(target);
    });
  }

  // --- Bar chart --------------------------------------------------------------

  function renderBarChart(config) {
    var svg = config.svg;
    var tooltip = config.tooltip;
    var data = config.data; // [{ label, value }]
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

    addLinearGradient(svg, "bar-gradient", [
      stop(0, "var(--chart-gradient-a)"),
      stop(100, "var(--chart-gradient-b)"),
    ], "vertical-down");

    var slot = innerW / data.length;
    var barWidth = Math.min(barMax, slot * 0.5);
    var peakValue = Math.max.apply(null, data.map(function (d) { return d.value; }));

    var tooltipLabel = tooltip.querySelector(".chart-tooltip-label");
    var tooltipValue = tooltip.querySelector(".chart-tooltip-value");

    data.forEach(function (d, i) {
      var cx = margin.left + slot * i + slot / 2;
      var barTop = yAt(d.value);
      var barHeight = baselineY - barTop;

      svg.appendChild(el("rect", {
        x: cx - barWidth / 2, y: barTop, width: barWidth, height: barHeight,
        rx: "4", fill: "url(#bar-gradient)",
      }));
      // square the baseline corners: cover the bottom rounded corners with a flat
      // patch in the gradient's bottom-most stop — solid, not url(#bar-gradient),
      // since objectBoundingBox would re-stretch the full gradient across this
      // 4px sliver instead of continuing the main rect's gradient
      svg.appendChild(el("rect", {
        x: cx - barWidth / 2, y: baselineY - 4, width: barWidth, height: "4", fill: "var(--chart-gradient-b)",
      }));

      if (d.value === peakValue) {
        var peakLabel = el("text", {
          x: cx, y: barTop - 8, "text-anchor": "middle", class: "chart-value-label",
        });
        peakLabel.textContent = formatNumber(d.value);
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
        tooltipLabel.textContent = d.label;
        tooltipValue.textContent = formatNumber(d.value);
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

  document.addEventListener("DOMContentLoaded", function () {
    initThemeToggle();

    document.querySelectorAll(".sparkline").forEach(renderSparkline);

    renderLineChart({
      svg: document.getElementById("line-chart"),
      tooltip: document.getElementById("line-tooltip"),
      axisMax: 10000,
      axisStep: 2000,
      data: [
        { label: "Aug 5", value: 6120 },
        { label: "Aug 6", value: 6480 },
        { label: "Aug 7", value: 6300 },
        { label: "Aug 8", value: 6900 },
        { label: "Aug 9", value: 7200 },
        { label: "Aug 10", value: 7050 },
        { label: "Aug 11", value: 7480 },
        { label: "Aug 12", value: 7300 },
        { label: "Aug 13", value: 7900 },
        { label: "Aug 14", value: 8100 },
        { label: "Aug 15", value: 7950 },
        { label: "Aug 16", value: 8400 },
        { label: "Aug 17", value: 8700 },
        { label: "Aug 18", value: 9840 },
      ],
    });

    renderBarChart({
      svg: document.getElementById("bar-chart"),
      tooltip: document.getElementById("bar-tooltip"),
      axisMax: 12000,
      axisStep: 3000,
      data: [
        { label: "Mon", value: 8200 },
        { label: "Tue", value: 8600 },
        { label: "Wed", value: 8900 },
        { label: "Thu", value: 9100 },
        { label: "Fri", value: 10400 },
        { label: "Sat", value: 11240 },
        { label: "Sun", value: 9700 },
      ],
    });
  });
})();
