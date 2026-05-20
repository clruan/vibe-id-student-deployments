/*
 * widgets.js — project-specific demos.
 *
 * Each widget is visually distinct so the "which parameter or structure
 * drives the deliverable" question is answered at a glance:
 *
 *   tradeoff-frontier   matching project   precision/recall scatter + top-3 + delta
 *   evidence-path       graph project      animated path + draft-answer claim check
 *   neural-workbench    imaging project    draw input + 3D CNN activations + export gate
 *   threshold-dials     exam project       live dial triplet + stable band
 *   estimator-forest    causal project     HR forest plot + subgroup panel
 */
(function () {
  const ns = window.aiResume || (window.aiResume = {});

  function renderWidget(project, state, stageIndex) {
    var w = project.widget;
    if (!w) return "";
    if (w.type === "tradeoff-frontier") return renderTradeoff(project, state);
    if (w.type === "evidence-path") return renderEvidence(project, state);
    if (w.type === "threshold-dials") return renderThresholdDials(project, state, stageIndex);
    if (w.type === "estimator-forest") return renderEstimatorForest(project, state);
    if (w.type === "neural-workbench") return renderNeuralWorkbench(project, state);

    /* Legacy fallbacks for V5 widgets (graph/ranking/roi-structure). */
    if (w.type === "ranking") return renderLegacyRanking(project, state);
    if (w.type === "graph") return renderLegacyGraph(project, state);
    if (w.type === "roi-structure") return renderThresholdDials(project, state, stageIndex);
    return "";
  }

  /* ───────── 1. Precision/recall tradeoff frontier ───────── */

  function renderTradeoff(project, state) {
    var w = project.widget;
    var runId = state.tradeoffRunByProject[project.id] || w.winner || w.runs[0].id;
    var active = w.runs.find(function (r) { return r.id === runId; }) || w.runs[0];
    var baseline = w.baseline;

    var toggle = '<div class="toggle-row">' +
      w.runs.map(function (run) {
        var isActive = run.id === active.id;
        return '<button class="widget-toggle-button ' + (isActive ? "active" : "") + '" type="button" data-tradeoff-run="' + run.id + '">' +
          run.label +
        '</button>';
      }).join("") +
    '</div>';

    var scatterPoints = w.runs.map(function (run) {
      var isActive = run.id === active.id;
      var cx = pct(run.recall);
      var cy = 100 - pct(run.precision);
      return '<g class="frontier-dot ' + (isActive ? "is-active" : "") + '" data-tradeoff-run="' + run.id + '">' +
        '<circle cx="' + cx + '" cy="' + cy + '" r="3.2"></circle>' +
        '<text x="' + (cx + 3) + '" y="' + (cy - 3) + '">' + run.label.replace(/ \u2605$/, "") + '</text>' +
      '</g>';
    }).join("");

    var baselineCx = pct(baseline.recall);
    var baselineCy = 100 - pct(baseline.precision);
    var baselineDot = '<g class="frontier-dot is-baseline">' +
      '<circle cx="' + baselineCx + '" cy="' + baselineCy + '" r="2.6"></circle>' +
      '<text x="' + (baselineCx + 3) + '" y="' + (baselineCy + 5) + '">baseline</text>' +
    '</g>';

    var curvePath = buildFrontierPath(w.runs.concat([baseline]));
    var svg = '<svg class="frontier-svg" viewBox="0 0 100 100" aria-hidden="true">' +
      '<line class="frontier-axis" x1="8" y1="92" x2="98" y2="92"/>' +
      '<line class="frontier-axis" x1="8" y1="4" x2="8" y2="92"/>' +
      '<text class="frontier-axis-label" x="54" y="99">' + w.xLabel + '</text>' +
      '<text class="frontier-axis-label" x="2" y="50" transform="rotate(-90 2,50)">' + w.yLabel + '</text>' +
      '<path class="frontier-curve" d="' + curvePath + '"/>' +
      baselineDot +
      scatterPoints +
    '</svg>';

    var ranking = active.ranking.map(function (row) {
      return '<div class="ranking-row">' +
        '<span class="ranking-name">' + row.label + '</span>' +
        '<div class="ranking-bar-track">' +
          '<div class="ranking-bar-fill" style="width:' + row.score + '%"></div>' +
        '</div>' +
        '<span class="ranking-score">' + row.score + '</span>' +
        '<span class="ranking-match">' + row.match + '</span>' +
      '</div>';
    }).join("");

    return '<div class="widget-head">' +
        '<div>' +
          '<h4>' + w.title + '</h4>' +
          '<p>' + w.help + '</p>' +
        '</div>' +
        toggle +
      '</div>' +

      '<div class="tradeoff-grid">' +
        '<div class="frontier-panel">' +
          svg +
          '<p class="widget-note">Upper-left is better. Each labeled dot is a retrieval run; dashed curve is the frontier the project actually operates on.</p>' +
        '</div>' +
        '<div class="frontier-callout">' +
          '<div class="frontier-winner">' +
            '<span class="score-label">' + active.scoreName + '</span>' +
            '<strong class="frontier-score">' + active.scoreValue + '</strong>' +
            '<span class="frontier-delta">' + active.deltaLabel + '</span>' +
          '</div>' +
          '<p class="frontier-takeaway">' + active.takeaway + '</p>' +
        '</div>' +
      '</div>' +

      '<div class="ranking-list frontier-ranking">' + ranking + '</div>';
  }

  function buildFrontierPath(runs) {
    var pts = runs.slice().sort(function (a, b) { return a.recall - b.recall; });
    return pts.map(function (p, i) {
      var cmd = i === 0 ? "M" : "L";
      return cmd + " " + pct(p.recall).toFixed(1) + " " + (100 - pct(p.precision)).toFixed(1);
    }).join(" ");
  }

  function pct(v) { return 8 + v * 86; }

  /* ───────── 2. Evidence-path graph + claim check ───────── */

  function renderEvidence(project, state) {
    var w = project.widget;
    var viewId = state.evidenceViewByProject[project.id] || w.views[w.views.length - 1].id;
    var active = w.views.find(function (v) { return v.id === viewId; }) || w.views[0];

    var supported = active.claims.filter(function (c) { return c.supported; }).length;
    var total = active.claims.length;
    var scorePct = Math.round(active.traceScore * 100);

    var toggle = '<div class="toggle-row">' +
      w.views.map(function (v) {
        var isActive = v.id === active.id;
        return '<button class="widget-toggle-button ' + (isActive ? "active" : "") + '" type="button" data-evidence-view="' + v.id + '">' +
          v.label +
        '</button>';
      }).join("") +
    '</div>';

    return '<div class="widget-head">' +
        '<div>' +
          '<h4>' + w.title + '</h4>' +
          '<p>' + w.help + '</p>' +
        '</div>' +
        toggle +
      '</div>' +

      '<div class="evidence-grid">' +
        '<div class="evidence-graph-wrap">' +
          renderEvidenceSvg(w.nodes, w.edges, active) +
          '<p class="widget-note">' + active.note + '</p>' +
        '</div>' +
        '<div class="evidence-answer">' +
          '<div class="evidence-trace">' +
            '<div class="trace-dial" data-score="' + scorePct + '" style="--score:' + scorePct + '%">' +
              '<span class="trace-dial-value">' + scorePct + '</span>' +
              '<span class="trace-dial-unit">traceability</span>' +
            '</div>' +
            '<div class="trace-meta">' +
              '<div class="trace-meta-row"><span>Claims supported</span><strong>' + supported + '/' + total + '</strong></div>' +
              '<div class="trace-meta-row"><span>Citations lit</span><strong>' + active.citations + '</strong></div>' +
            '</div>' +
          '</div>' +
          '<article class="evidence-answer-card">' +
            '<p class="evidence-answer-label">Draft answer</p>' +
            '<p class="evidence-answer-text">' + active.answer + '</p>' +
            '<ul class="evidence-claim-list">' +
              active.claims.map(function (c) {
                return '<li class="evidence-claim ' + (c.supported ? "is-supported" : "is-unsupported") + '">' +
                  '<span class="evidence-claim-mark">' + (c.supported ? "\u2713" : "!") + '</span>' +
                  '<span>' + c.text + '</span>' +
                '</li>';
              }).join("") +
            '</ul>' +
          '</article>' +
        '</div>' +
      '</div>';
  }

  function renderEvidenceSvg(nodes, edges, active) {
    var edgeMarkup = edges.map(function (pair) {
      var from = pair[0], to = pair[1];
      var start = nodes.find(function (n) { return n.id === from; });
      var end = nodes.find(function (n) { return n.id === to; });
      var edgeId = from + "-" + to;
      var reverseId = to + "-" + from;
      var highlighted = active.highlightEdges.indexOf(edgeId) !== -1 || active.highlightEdges.indexOf(reverseId) !== -1;
      return '<line x1="' + start.x + '" y1="' + start.y + '" x2="' + end.x + '" y2="' + end.y + '" class="graph-edge ' + (highlighted ? "highlighted" : "") + '"/>';
    }).join("");

    var nodeMarkup = nodes.map(function (node) {
      var highlighted = active.highlightNodes.indexOf(node.id) !== -1;
      return '<g class="graph-node-group ' + (highlighted ? "highlighted" : "") + '">' +
        '<circle cx="' + node.x + '" cy="' + node.y + '" r="7.5"></circle>' +
        '<text x="' + node.x + '" y="' + (node.y + 15) + '" text-anchor="middle">' + node.label + '</text>' +
      '</g>';
    }).join("");

    return '<svg class="graph-svg evidence-svg" viewBox="0 0 100 100" aria-hidden="true">' +
      edgeMarkup + nodeMarkup +
    '</svg>';
  }

  /* ───────── 3. Threshold dials for imaging ───────── */

  function renderThresholdDials(project, state, stageIndex) {
    var w = project.widget;
    if (!w.metrics) {
      /* Fallback if we ever get the legacy roi-structure shape. */
      return renderLegacyRoi(project, state, stageIndex);
    }

    var value = typeof state.thresholdByProject[project.id] === "number"
      ? state.thresholdByProject[project.id]
      : w.value;
    var marker = ((value - w.min) / (w.max - w.min)) * 100;
    var stableStart = ((w.stableMin - w.min) / (w.max - w.min)) * 100;
    var stableEnd = ((w.stableMax - w.min) / (w.max - w.min)) * 100;
    var inBand = value >= w.stableMin && value <= w.stableMax;

    var metricValues = w.metrics.map(function (m) { return computeMetric(m, value); });
    var leading = metricValues.filter(function (m) { return m.winner; })[0] || metricValues[0];

    var dials = metricValues.map(function (m) {
      return '<div class="dial ' + (m.winner ? "is-winner" : "") + '">' +
        '<div class="dial-ring" style="--dial:' + Math.round(m.value * 100) + '%">' +
          '<span class="dial-reading">' + m.value.toFixed(2) + '</span>' +
          '<span class="dial-label">' + m.label + '</span>' +
        '</div>' +
      '</div>';
    }).join("");

    var presets = w.presets.map(function (p) {
      var isActive = Math.abs(p.value - value) < 0.5;
      return '<button class="preset-button ' + (isActive ? "active" : "") + '" type="button" data-threshold-value="' + p.value + '">' +
        '<span class="preset-label">' + p.label + '</span>' +
        '<span class="preset-note">' + p.note + '</span>' +
      '</button>';
    }).join("");

    var deliverableStatus = inBand ? "Stable \u2014 export OK" : (value < w.stableMin ? "Too loose \u2014 noise bleeds into report" : "Too strict \u2014 small lesions dropped");
    var recommendation = inBand ? "Use " + value + " as the operating threshold." : "Move threshold into the green band (" + w.stableMin + "\u2013" + w.stableMax + ").";

    return '<div class="widget-head">' +
        '<div>' +
          '<h4>' + w.title + '</h4>' +
          '<p>' + w.help + '</p>' +
        '</div>' +
      '</div>' +

      '<label class="slider-label" for="threshold-input">Threshold <strong>' + value + '</strong></label>' +
      '<div class="threshold-rail">' +
        '<div class="threshold-band" style="left:' + stableStart + '%; width:' + (stableEnd - stableStart) + '%"></div>' +
        '<input id="threshold-input" class="threshold-input" type="range" min="' + w.min + '" max="' + w.max + '" value="' + value + '">' +
        '<div class="threshold-marker" style="left:' + marker + '%"></div>' +
      '</div>' +

      '<div class="dial-row">' + dials + '</div>' +

      '<div class="preset-row">' + presets + '</div>' +

      '<div class="deliverable-card ' + (inBand ? "is-stable" : "is-warning") + '">' +
        '<div class="deliverable-head">' +
          '<span class="deliverable-label">Report preview</span>' +
          '<span class="deliverable-status">' + deliverableStatus + '</span>' +
        '</div>' +
        '<div class="deliverable-body">' +
          '<div class="deliverable-metric">' +
            '<span>Leading metric</span>' +
            '<strong>' + leading.label + ' ' + leading.value.toFixed(2) + '</strong>' +
          '</div>' +
          '<div class="deliverable-metric">' +
            '<span>Recommendation</span>' +
            '<strong>' + recommendation + '</strong>' +
          '</div>' +
        '</div>' +
      '</div>' +

      '<p class="widget-note">Moving the slider changes IoU, precision, and recall in different directions. The stable band is where the exported report maximizes IoU while staying defensible.</p>';
  }

  function computeMetric(metric, value) {
    var raw;
    if (typeof metric.peakAt === "number") {
      var distance = value - metric.peakAt;
      var falloff = Math.exp(-(distance * distance) / (metric.sharpness || 400));
      var peak = metric.target || 0.88;
      raw = metric.floor + (peak - metric.floor) * falloff;
    } else if (metric.monotonic === "up") {
      raw = metric.floor + (0.92 - metric.floor) * ((value - 20) / 60);
    } else if (metric.monotonic === "down") {
      raw = metric.floor + (0.92 - metric.floor) * (1 - (value - 20) / 60);
    } else {
      raw = 0.7;
    }
    return {
      id: metric.id,
      label: metric.label,
      value: clamp(raw, 0.05, 0.98),
      winner: !!metric.winner
    };
  }

  /* ───────── 4. Estimator forest plot ───────── */

  function renderEstimatorForest(project, state) {
    var w = project.widget;
    var rowId = state.estimatorRowByProject[project.id] || w.winner || w.rows[0].id;
    var active = w.rows.find(function (r) { return r.id === rowId; }) || w.rows[0];

    var rows = w.rows.map(function (row) {
      var isActive = row.id === active.id;
      var xRange = w.xMax - w.xMin;
      var leftPct = Math.max(0, (row.ciLow - w.xMin) / xRange) * 100;
      var widthPct = Math.max(1, (row.ciHigh - row.ciLow) / xRange * 100);
      var dotPct = Math.max(0, (row.hr - w.xMin) / xRange) * 100;

      return '<button class="forest-row ' + (isActive ? "is-active" : "") + ' ' + (row.id === w.winner ? "is-winner" : "") + '" type="button" data-estimator-row="' + row.id + '">' +
        '<span class="forest-label">' + row.label + '</span>' +
        '<span class="forest-track">' +
          '<span class="forest-ci" style="left:' + leftPct + '%; width:' + widthPct + '%"></span>' +
          '<span class="forest-dot" style="left:' + dotPct + '%"></span>' +
        '</span>' +
        '<span class="forest-hr"><strong>' + row.hr.toFixed(2) + '</strong><span class="forest-ci-text">[' + row.ciLow.toFixed(2) + ', ' + row.ciHigh.toFixed(2) + ']</span></span>' +
      '</button>';
    }).join("");

    var refPct = ((w.refLine - w.xMin) / (w.xMax - w.xMin)) * 100;

    var subgroupBars = w.subgroups.map(function (sg) {
      var xRange = w.xMax - w.xMin;
      var leftPct = Math.max(0, (sg.ciLow - w.xMin) / xRange) * 100;
      var widthPct = Math.max(1, (sg.ciHigh - sg.ciLow) / xRange * 100);
      var dotPct = Math.max(0, (sg.hr - w.xMin) / xRange) * 100;
      return '<div class="subgroup-row">' +
        '<span class="subgroup-label">' + sg.label + '</span>' +
        '<span class="subgroup-track">' +
          '<span class="subgroup-ci" style="left:' + leftPct + '%; width:' + widthPct + '%"></span>' +
          '<span class="subgroup-dot" style="left:' + dotPct + '%"></span>' +
        '</span>' +
        '<span class="subgroup-hr">' + sg.hr.toFixed(2) + '</span>' +
      '</div>';
    }).join("");

    return '<div class="widget-head">' +
        '<div>' +
          '<h4>' + w.title + '</h4>' +
          '<p>' + w.help + '</p>' +
        '</div>' +
      '</div>' +

      '<div class="forest-wrap">' +
        '<div class="forest-axis">' +
          '<span class="forest-axis-min">' + w.xMin.toFixed(1) + '</span>' +
          '<span class="forest-axis-mid">HR = ' + w.refLine.toFixed(1) + '</span>' +
          '<span class="forest-axis-max">' + w.xMax.toFixed(1) + '</span>' +
        '</div>' +
        '<div class="forest-track-wrap">' +
          '<div class="forest-ref" style="left:' + refPct + '%"></div>' +
          rows +
        '</div>' +
      '</div>' +

      '<div class="forest-callout">' +
        '<div class="forest-callout-head">' +
          '<span class="score-label">' + active.label + '</span>' +
          '<strong>HR ' + active.hr.toFixed(2) + '</strong>' +
          '<span class="forest-pvalue">p ' + active.pValue + '</span>' +
        '</div>' +
        '<p>' + active.note + '</p>' +
      '</div>' +

      '<div class="subgroup-panel">' +
        '<h5 class="subgroup-title">Subgroup effects (doubly robust)</h5>' +
        subgroupBars +
        '<p class="widget-note">Choosing the doubly robust estimator narrows the CI without moving the point estimate toward no-effect. High-risk patients benefit most.</p>' +
      '</div>';
  }

  /* ───────── 5. CNN-style neural workbench ───────── */

  function renderNeuralWorkbench(project, state) {
    var w = project.widget;
    var model = getNeuralWorkbenchState(project, state);
    var layers = getNeuralLayers(w);
    var classes = getNeuralClasses(w);
    var presets = w.presets || [];

    var presetButtons = presets.map(function (preset) {
      return '<button class="neural-preset-button ' + (model.preset === preset.id ? "active" : "") + '" type="button" data-neural-preset="' + preset.id + '">' +
        '<span class="neural-preset-label">' + preset.label + '</span>' +
        '<span class="neural-preset-note">' + preset.note + '</span>' +
      '</button>';
    }).join("");

    var layerControls = layers.map(function (layer) {
      var checked = model.visibleLayers[layer.id] !== false ? " checked" : "";
      return '<label class="neural-layer-toggle">' +
        '<input type="checkbox" data-neural-layer="' + layer.id + '"' + checked + '>' +
        '<span>' + layer.label + '</span>' +
      '</label>';
    }).join("");

    var scoreRows = classes.map(function (item) {
      return '<div class="neural-score-row" data-neural-score="' + item.id + '" style="--class-color:' + item.color + '">' +
        '<span class="neural-score-name">' + item.label + '</span>' +
        '<span class="neural-score-track"><span class="neural-score-fill" data-neural-score-bar="' + item.id + '"></span></span>' +
        '<strong data-neural-score-value="' + item.id + '">0%</strong>' +
      '</div>';
    }).join("");

    return '<div class="widget-head">' +
        '<div>' +
          '<h4>' + w.title + '</h4>' +
          '<p>' + w.help + '</p>' +
        '</div>' +
      '</div>' +

      '<div class="neural-workbench" data-neural-workbench data-project-id="' + project.id + '">' +
        '<section class="neural-input-panel">' +
          '<div class="neural-panel-head">' +
            '<span>Input image</span>' +
            '<strong>28 x 28 signal</strong>' +
          '</div>' +
          '<canvas class="neural-draw-canvas" width="280" height="280" data-neural-input-canvas aria-label="Draw microscopy signal"></canvas>' +
          '<div class="neural-tool-row">' +
            '<button class="neural-icon-button" type="button" data-neural-clear>Clear</button>' +
            '<label class="neural-brush-label">Brush <input type="range" min="1" max="6" value="' + model.brushSize + '" data-neural-brush></label>' +
          '</div>' +
          '<div class="neural-preset-grid">' + presetButtons + '</div>' +
        '</section>' +

        '<section class="neural-scene-panel">' +
          '<div class="neural-panel-head">' +
            '<span>Layer field</span>' +
            '<strong>Live 3D activations</strong>' +
          '</div>' +
          '<canvas class="neural-scene-canvas" data-neural-scene-canvas aria-label="Three dimensional neural network activation view"></canvas>' +
          '<div class="neural-layer-controls">' + layerControls + '</div>' +
        '</section>' +

        '<section class="neural-output-panel">' +
          '<div class="neural-panel-head">' +
            '<span>Output layer</span>' +
            '<strong data-neural-top-label>Waiting</strong>' +
          '</div>' +
          '<div class="neural-score-list">' + scoreRows + '</div>' +
          '<label class="neural-threshold-label">Export confidence <strong data-neural-threshold-value>' + model.threshold + '</strong></label>' +
          '<input class="neural-threshold-input" type="range" min="' + w.min + '" max="' + w.max + '" value="' + model.threshold + '" data-neural-threshold>' +
          '<div class="neural-report-card" data-neural-report>' +
            '<span class="neural-report-status" data-neural-report-status>Pending</span>' +
            '<p data-neural-report-text>Draw a signal or choose a preset to run the layer view.</p>' +
          '</div>' +
        '</section>' +
      '</div>' +

      '<div class="neural-probe-grid">' +
        '<article class="neural-probe-card">' +
          '<span>Input image</span>' +
          '<div class="neural-mini-grid" data-neural-grid="input"></div>' +
        '</article>' +
        '<article class="neural-probe-card">' +
          '<span>Filter</span>' +
          '<div class="neural-mini-grid neural-mini-grid-5" data-neural-grid="filter"></div>' +
        '</article>' +
        '<article class="neural-probe-card">' +
          '<span>Weighted input</span>' +
          '<div class="neural-mini-grid neural-mini-grid-5" data-neural-grid="weighted"></div>' +
        '</article>' +
        '<article class="neural-probe-card">' +
          '<span>Calculation</span>' +
          '<div class="neural-mini-grid neural-mini-grid-3" data-neural-grid="calculation"></div>' +
          '<p class="neural-calc-text" data-neural-calc-text></p>' +
        '</article>' +
        '<article class="neural-probe-card">' +
          '<span>Output</span>' +
          '<div class="neural-mini-grid neural-mini-grid-2" data-neural-grid="output"></div>' +
          '<p class="neural-calc-text"><strong data-neural-first-guess></strong><br><span data-neural-second-guess></span></p>' +
        '</article>' +
      '</div>' +

      '<p class="widget-note">' + w.note + '</p>';
  }

  function bindNeuralWorkbench(project, state, root) {
    var shell = root.querySelector("[data-neural-workbench]");
    if (!shell) return;

    var w = project.widget;
    var model = getNeuralWorkbenchState(project, state);
    var layers = getNeuralLayers(w);
    var classes = getNeuralClasses(w);
    var inputCanvas = shell.querySelector("[data-neural-input-canvas]");
    var brushInput = shell.querySelector("[data-neural-brush]");
    var thresholdInput = shell.querySelector("[data-neural-threshold]");
    var scene = safeInitNeuralScene(shell, layers);
    var isDrawing = false;

    function refresh() {
      var activations = computeNeuralActivations(model.matrix, model.threshold, classes);
      drawInputCanvas(inputCanvas, model.matrix);
      paintNeuralProbeGrids(root, activations);
      syncNeuralScores(shell, activations, model, classes);
      try {
        scene.update(activations, model);
      } catch (e) {
        scene = initNeuralFallbackScene(shell.querySelector("[data-neural-scene-canvas]"), layers);
        scene.update(activations, model);
      }
      shell.querySelectorAll("[data-neural-preset]").forEach(function (button) {
        button.classList.toggle("active", button.dataset.neuralPreset === model.preset);
      });
      shell.querySelectorAll("[data-neural-layer]").forEach(function (toggle) {
        toggle.checked = model.visibleLayers[toggle.dataset.neuralLayer] !== false;
      });
    }

    function drawAtEvent(event) {
      if (!inputCanvas) return;
      var rect = inputCanvas.getBoundingClientRect();
      var x = Math.floor((event.clientX - rect.left) / rect.width * 28);
      var y = Math.floor((event.clientY - rect.top) / rect.height * 28);
      applyBrush(model.matrix, x, y, model.brushSize, event.buttons === 2 ? -0.85 : 0.92);
      model.preset = "custom";
      event.preventDefault();
      refresh();
    }

    if (inputCanvas) {
      inputCanvas.addEventListener("contextmenu", function (event) { event.preventDefault(); });
      inputCanvas.addEventListener("pointerdown", function (event) {
        isDrawing = true;
        inputCanvas.setPointerCapture(event.pointerId);
        drawAtEvent(event);
      });
      inputCanvas.addEventListener("pointermove", function (event) {
        if (isDrawing) drawAtEvent(event);
      });
      inputCanvas.addEventListener("pointerup", function () { isDrawing = false; });
      inputCanvas.addEventListener("pointercancel", function () { isDrawing = false; });
    }

    shell.querySelectorAll("[data-neural-preset]").forEach(function (button) {
      button.addEventListener("click", function () {
        var presetId = button.dataset.neuralPreset;
        model.preset = presetId;
        model.matrix = generateNeuralPreset(presetId);
        refresh();
      });
    });

    var clear = shell.querySelector("[data-neural-clear]");
    if (clear) {
      clear.addEventListener("click", function () {
        model.preset = "custom";
        model.matrix = createBlankMatrix();
        refresh();
      });
    }

    if (brushInput) {
      brushInput.addEventListener("input", function () {
        model.brushSize = Number(brushInput.value);
      });
    }

    if (thresholdInput) {
      thresholdInput.addEventListener("input", function () {
        model.threshold = Number(thresholdInput.value);
        refresh();
      });
    }

    shell.querySelectorAll("[data-neural-layer]").forEach(function (toggle) {
      toggle.addEventListener("change", function () {
        model.visibleLayers[toggle.dataset.neuralLayer] = toggle.checked;
        refresh();
      });
    });

    refresh();
  }

  function safeInitNeuralScene(shell, layers) {
    try {
      return initNeuralScene(shell, layers);
    } catch (e) {
      return initNeuralFallbackScene(shell.querySelector("[data-neural-scene-canvas]"), layers);
    }
  }

  function getNeuralWorkbenchState(project, state) {
    state.neuralWorkbenchByProject = state.neuralWorkbenchByProject || {};
    var w = project.widget || {};
    var model = state.neuralWorkbenchByProject[project.id];
    if (!model) {
      model = {
        preset: w.defaultPreset || (w.presets && w.presets[0] && w.presets[0].id) || "fibrosis",
        threshold: typeof w.value === "number" ? w.value : 48,
        brushSize: 3,
        visibleLayers: {},
        matrix: null
      };
      state.neuralWorkbenchByProject[project.id] = model;
    }

    getNeuralLayers(w).forEach(function (layer) {
      if (typeof model.visibleLayers[layer.id] !== "boolean") {
        model.visibleLayers[layer.id] = layer.defaultVisible !== false;
      }
    });

    if (!model.matrix) {
      model.matrix = generateNeuralPreset(model.preset);
    }

    return model;
  }

  function getNeuralLayers(w) {
    return w.layers || [
      { id: "input", label: "Input", defaultVisible: true },
      { id: "conv1", label: "Conv 1", defaultVisible: true },
      { id: "pool1", label: "Pool 1", defaultVisible: true },
      { id: "conv2", label: "Conv 2", defaultVisible: true },
      { id: "fc1", label: "Dense", defaultVisible: true },
      { id: "output", label: "Output", defaultVisible: true }
    ];
  }

  function getNeuralClasses(w) {
    return w.classes || [
      { id: "fibrosis", label: "Fibrosis mask", color: "#b45309" },
      { id: "cells", label: "Cell infiltration", color: "#1d4ed8" },
      { id: "background", label: "Background", color: "#0f766e" },
      { id: "artifact", label: "Artifact", color: "#dc2626" }
    ];
  }

  function createBlankMatrix() {
    var values = [];
    for (var i = 0; i < 28 * 28; i++) values.push(0);
    return values;
  }

  function generateNeuralPreset(id) {
    var values = createBlankMatrix();
    var preset = id || "fibrosis";

    for (var y = 0; y < 28; y++) {
      for (var x = 0; x < 28; x++) {
        var v = 0;
        if (preset === "fibrosis") {
          var d1 = Math.abs(y - (0.58 * x + 5));
          var d2 = Math.abs(y - (-0.45 * x + 24));
          v = Math.max(Math.exp(-(d1 * d1) / 8), 0.7 * Math.exp(-(d2 * d2) / 10));
          v += 0.2 * Math.sin(x * 1.7 + y * 0.6);
        } else if (preset === "cells") {
          v = blob(x, y, 8, 8, 3.2) + blob(x, y, 18, 9, 2.8) + blob(x, y, 12, 18, 3.4) + blob(x, y, 21, 20, 2.5);
        } else if (preset === "artifact") {
          var edge = x < 3 || y < 3 || x > 24 || y > 24 ? 0.72 : 0;
          var ring = Math.abs(Math.sqrt((x - 14) * (x - 14) + (y - 14) * (y - 14)) - 8);
          v = edge + Math.exp(-(ring * ring) / 3) * 0.55 + ((x * 13 + y * 7) % 11 === 0 ? 0.42 : 0);
        } else if (preset === "sparse") {
          v = blob(x, y, 6, 21, 1.6) + blob(x, y, 15, 14, 1.4) + blob(x, y, 23, 7, 1.8);
        } else {
          v = 0;
        }
        values[y * 28 + x] = clamp(v, 0, 1);
      }
    }

    return values;
  }

  function blob(x, y, cx, cy, sigma) {
    var dx = x - cx;
    var dy = y - cy;
    return Math.exp(-(dx * dx + dy * dy) / (2 * sigma * sigma));
  }

  function applyBrush(matrix, x, y, size, delta) {
    if (x < 0 || y < 0 || x >= 28 || y >= 28) return;
    var radius = Math.max(1, size);
    for (var yy = Math.max(0, y - radius); yy <= Math.min(27, y + radius); yy++) {
      for (var xx = Math.max(0, x - radius); xx <= Math.min(27, x + radius); xx++) {
        var dx = xx - x;
        var dy = yy - y;
        var distance = Math.sqrt(dx * dx + dy * dy);
        if (distance <= radius) {
          var falloff = 1 - distance / (radius + 0.01);
          var idx = yy * 28 + xx;
          matrix[idx] = clamp(matrix[idx] + delta * falloff, 0, 1);
        }
      }
    }
  }

  function drawInputCanvas(canvas, matrix) {
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var size = canvas.width / 28;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#111827";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (var y = 0; y < 28; y++) {
      for (var x = 0; x < 28; x++) {
        var v = matrix[y * 28 + x];
        var alpha = 0.08 + v * 0.92;
        ctx.fillStyle = "rgba(245, 158, 11, " + alpha.toFixed(3) + ")";
        ctx.fillRect(x * size, y * size, size + 0.2, size + 0.2);
      }
    }

    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1;
    for (var i = 0; i <= 28; i += 4) {
      ctx.beginPath();
      ctx.moveTo(i * size, 0);
      ctx.lineTo(i * size, canvas.height);
      ctx.moveTo(0, i * size);
      ctx.lineTo(canvas.width, i * size);
      ctx.stroke();
    }
  }

  function computeNeuralActivations(matrix, threshold, classes) {
    var input = downsample(matrix, 28, 28, 16, 16);
    var conv1 = computeConv1(matrix);
    var pool1 = maxPoolMaps(conv1, 4, 8, 8, 2);
    var conv2 = computeConv2(pool1);
    var features = summarizeMatrix(matrix);
    var fc1 = [];

    for (var i = 0; i < 16; i++) {
      var seed = features.mass * (i + 1) * 2.1 + features.center * (i % 5 + 1) + features.texture * 6 + features.diagonal * 3;
      fc1.push(clamp((0.42 + 0.42 * Math.sin(seed + i * 0.73)) * (0.72 + features.mass * 1.2), 0, 1));
    }

    var logits = [
      -0.75 + features.mass * 2.5 + features.diagonal * 3.2 + features.texture * 0.8 - features.edge * 1.3,
      -0.55 + features.spots * 3.6 + features.center * 1.7 + features.texture * 0.7 - features.diagonal * 0.6,
      1.3 - features.mass * 3.2 - features.texture * 1.4 - features.spots * 0.5,
      -0.85 + features.edge * 3.0 + features.texture * 1.6 + features.asymmetry * 1.5
    ];
    var probs = softmax(logits);
    var predictions = classes.map(function (item, index) {
      return {
        id: item.id,
        label: item.label,
        color: item.color,
        score: probs[index] || 0
      };
    }).sort(function (a, b) {
      return b.score - a.score;
    });

    var filterGrid = [
      -0.10, 0.05, 0.12, 0.05, -0.10,
      0.06, 0.18, 0.34, 0.18, 0.06,
      0.12, 0.34, 0.58, 0.34, 0.12,
      0.06, 0.18, 0.34, 0.18, 0.06,
      -0.10, 0.05, 0.12, 0.05, -0.10
    ];
    var hotspot = findHotspot(matrix);
    var patch = readPatch(matrix, hotspot.x, hotspot.y, 5);
    var weighted = patch.map(function (value, index) { return value * filterGrid[index]; });
    var calcGrid = computeCalcGrid(matrix, hotspot.x, hotspot.y, filterGrid);

    return {
      layers: {
        input: input,
        conv1: conv1,
        pool1: pool1,
        conv2: conv2,
        fc1: fc1,
        output: probs
      },
      features: features,
      predictions: predictions,
      filterGrid: filterGrid,
      weightedGrid: weighted,
      calcGrid: calcGrid.values,
      calcValue: calcGrid.center,
      outputGrid: probs,
      threshold: threshold
    };
  }

  function computeConv1(matrix) {
    var values = [];
    for (var channel = 0; channel < 4; channel++) {
      for (var y = 0; y < 8; y++) {
        for (var x = 0; x < 8; x++) {
          var sx = Math.round((x + 0.5) / 8 * 27);
          var sy = Math.round((y + 0.5) / 8 * 27);
          var center = sampleMatrix(matrix, sx, sy);
          var left = sampleMatrix(matrix, sx - 1, sy);
          var right = sampleMatrix(matrix, sx + 1, sy);
          var up = sampleMatrix(matrix, sx, sy - 1);
          var down = sampleMatrix(matrix, sx, sy + 1);
          var avg = (center + left + right + up + down) / 5;
          var gx = Math.abs(right - left);
          var gy = Math.abs(down - up);
          var v = channel === 0 ? avg : channel === 1 ? gx : channel === 2 ? gy : clamp(avg * 0.45 + (gx + gy) * 0.8, 0, 1);
          values.push(clamp(v, 0, 1));
        }
      }
    }
    return values;
  }

  function maxPoolMaps(values, maps, width, height, stride) {
    var pooled = [];
    var outW = Math.floor(width / stride);
    var outH = Math.floor(height / stride);
    for (var map = 0; map < maps; map++) {
      var offset = map * width * height;
      for (var y = 0; y < outH; y++) {
        for (var x = 0; x < outW; x++) {
          var m = 0;
          for (var yy = 0; yy < stride; yy++) {
            for (var xx = 0; xx < stride; xx++) {
              m = Math.max(m, values[offset + (y * stride + yy) * width + (x * stride + xx)]);
            }
          }
          pooled.push(m);
        }
      }
    }
    return pooled;
  }

  function computeConv2(pool1) {
    var values = [];
    for (var channel = 0; channel < 6; channel++) {
      for (var y = 0; y < 3; y++) {
        for (var x = 0; x < 3; x++) {
          var a = poolAt(pool1, channel % 4, x, y);
          var b = poolAt(pool1, (channel + 1) % 4, Math.min(3, x + 1), y);
          var c = poolAt(pool1, (channel + 2) % 4, x, Math.min(3, y + 1));
          var mix = a * 0.52 + b * 0.28 + c * 0.20 + channel * 0.015;
          values.push(clamp(Math.pow(mix, 0.85), 0, 1));
        }
      }
    }
    return values;
  }

  function poolAt(values, map, x, y) {
    return values[map * 16 + y * 4 + x] || 0;
  }

  function summarizeMatrix(matrix) {
    var mass = 0;
    var center = 0;
    var edge = 0;
    var texture = 0;
    var diagonal = 0;
    var left = 0;
    var right = 0;
    var spots = 0;

    for (var y = 0; y < 28; y++) {
      for (var x = 0; x < 28; x++) {
        var v = matrix[y * 28 + x];
        mass += v;

        var dx = x - 13.5;
        var dy = y - 13.5;
        var centerWeight = Math.exp(-(dx * dx + dy * dy) / 150);
        center += v * centerWeight;

        if (x < 4 || y < 4 || x > 23 || y > 23) edge += v;
        if (x < 14) left += v; else right += v;

        var d1 = Math.abs(y - (0.58 * x + 5));
        var d2 = Math.abs(y - (-0.45 * x + 24));
        diagonal += v * Math.max(Math.exp(-(d1 * d1) / 18), Math.exp(-(d2 * d2) / 18));

        var n = sampleMatrix(matrix, x + 1, y) + sampleMatrix(matrix, x, y + 1);
        texture += Math.abs(v - n / 2);
        if (v > 0.68 && v > sampleMatrix(matrix, x - 1, y) && v > sampleMatrix(matrix, x + 1, y) && v > sampleMatrix(matrix, x, y - 1) && v > sampleMatrix(matrix, x, y + 1)) {
          spots += 1;
        }
      }
    }

    return {
      mass: mass / 784,
      center: center / 240,
      edge: edge / 272,
      texture: texture / 784,
      diagonal: diagonal / 150,
      asymmetry: Math.abs(left - right) / Math.max(1, left + right),
      spots: clamp(spots / 10, 0, 1)
    };
  }

  function sampleMatrix(matrix, x, y) {
    if (x < 0 || y < 0 || x > 27 || y > 27) return 0;
    return matrix[y * 28 + x] || 0;
  }

  function downsample(values, fromW, fromH, toW, toH) {
    var result = [];
    for (var y = 0; y < toH; y++) {
      for (var x = 0; x < toW; x++) {
        var x0 = Math.floor(x / toW * fromW);
        var x1 = Math.max(x0 + 1, Math.floor((x + 1) / toW * fromW));
        var y0 = Math.floor(y / toH * fromH);
        var y1 = Math.max(y0 + 1, Math.floor((y + 1) / toH * fromH));
        var sum = 0;
        var count = 0;
        for (var yy = y0; yy < y1; yy++) {
          for (var xx = x0; xx < x1; xx++) {
            sum += values[yy * fromW + xx] || 0;
            count += 1;
          }
        }
        result.push(count ? sum / count : 0);
      }
    }
    return result;
  }

  function findHotspot(matrix) {
    var best = { x: 14, y: 14, value: -1 };
    for (var y = 2; y < 26; y++) {
      for (var x = 2; x < 26; x++) {
        var patch = readPatch(matrix, x, y, 3);
        var avg = patch.reduce(function (sum, value) { return sum + value; }, 0) / patch.length;
        if (avg > best.value) best = { x: x, y: y, value: avg };
      }
    }
    return best;
  }

  function readPatch(matrix, cx, cy, size) {
    var radius = Math.floor(size / 2);
    var values = [];
    for (var y = cy - radius; y <= cy + radius; y++) {
      for (var x = cx - radius; x <= cx + radius; x++) {
        values.push(sampleMatrix(matrix, x, y));
      }
    }
    return values;
  }

  function computeCalcGrid(matrix, cx, cy, filter) {
    var values = [];
    var center = 0;
    for (var y = cy - 1; y <= cy + 1; y++) {
      for (var x = cx - 1; x <= cx + 1; x++) {
        var patch = readPatch(matrix, x, y, 5);
        var sum = 0;
        for (var i = 0; i < patch.length; i++) sum += patch[i] * filter[i];
        var activated = 1 / (1 + Math.exp(-(sum - 0.35) * 2.8));
        if (x === cx && y === cy) center = activated;
        values.push(activated);
      }
    }
    return { values: values, center: center };
  }

  function softmax(logits) {
    var max = Math.max.apply(null, logits);
    var exps = logits.map(function (value) { return Math.exp(value - max); });
    var sum = exps.reduce(function (acc, value) { return acc + value; }, 0);
    return exps.map(function (value) { return value / sum; });
  }

  function paintNeuralProbeGrids(root, activations) {
    paintMiniGrid(root.querySelector('[data-neural-grid="input"]'), activations.layers.input, 16, "positive");
    paintMiniGrid(root.querySelector('[data-neural-grid="filter"]'), activations.filterGrid, 5, "signed");
    paintMiniGrid(root.querySelector('[data-neural-grid="weighted"]'), activations.weightedGrid, 5, "signed");
    paintMiniGrid(root.querySelector('[data-neural-grid="calculation"]'), activations.calcGrid, 3, "positive");
    paintMiniGrid(root.querySelector('[data-neural-grid="output"]'), activations.outputGrid, 2, "class");

    var calcText = root.querySelector("[data-neural-calc-text]");
    if (calcText) calcText.textContent = "sigma(w*x+b) = " + activations.calcValue.toFixed(2);

    var first = root.querySelector("[data-neural-first-guess]");
    var second = root.querySelector("[data-neural-second-guess]");
    if (first && activations.predictions[0]) {
      first.textContent = "First: " + activations.predictions[0].label + " " + Math.round(activations.predictions[0].score * 100) + "%";
    }
    if (second && activations.predictions[1]) {
      second.textContent = "Second: " + activations.predictions[1].label + " " + Math.round(activations.predictions[1].score * 100) + "%";
    }
  }

  function paintMiniGrid(container, values, columns, mode) {
    if (!container) return;
    var maxAbs = values.reduce(function (max, value) { return Math.max(max, Math.abs(value)); }, 0.001);
    container.style.gridTemplateColumns = "repeat(" + columns + ", 1fr)";
    container.innerHTML = values.map(function (value, index) {
      var color;
      if (mode === "signed") {
        color = value < 0
          ? "rgba(29, 78, 216, " + (0.18 + Math.abs(value) / maxAbs * 0.72).toFixed(3) + ")"
          : "rgba(180, 83, 9, " + (0.12 + Math.abs(value) / maxAbs * 0.78).toFixed(3) + ")";
      } else if (mode === "class") {
        var palette = ["#b45309", "#1d4ed8", "#0f766e", "#dc2626"];
        color = hexToRgba(palette[index] || "#0f766e", 0.12 + value * 0.78);
      } else {
        color = "rgba(15, 118, 110, " + (0.08 + clamp(value, 0, 1) * 0.82).toFixed(3) + ")";
      }
      return '<span style="background:' + color + '"></span>';
    }).join("");
  }

  function syncNeuralScores(shell, activations, model) {
    var threshold = model.threshold / 100;
    var thresholdValue = shell.querySelector("[data-neural-threshold-value]");
    if (thresholdValue) thresholdValue.textContent = model.threshold;

    activations.predictions.forEach(function (item) {
      var row = shell.querySelector('[data-neural-score="' + item.id + '"]');
      var bar = shell.querySelector('[data-neural-score-bar="' + item.id + '"]');
      var value = shell.querySelector('[data-neural-score-value="' + item.id + '"]');
      if (row) row.classList.toggle("is-top", item === activations.predictions[0]);
      if (bar) {
        bar.style.width = Math.round(item.score * 100) + "%";
        bar.style.background = item.color;
      }
      if (value) value.textContent = Math.round(item.score * 100) + "%";
    });

    var top = activations.predictions[0];
    var topLabel = shell.querySelector("[data-neural-top-label]");
    var status = shell.querySelector("[data-neural-report-status]");
    var text = shell.querySelector("[data-neural-report-text]");
    var report = shell.querySelector("[data-neural-report]");
    var accepted = top && top.score >= threshold;

    if (topLabel && top) topLabel.textContent = top.label;
    if (status) status.textContent = accepted ? "QC pass" : "Needs review";
    if (text && top) {
      text.textContent = accepted
        ? top.label + " clears the selected threshold; export the mask with the visible layer trace."
        : top.label + " is the current top class, but confidence is below the export threshold.";
    }
    if (report) {
      report.classList.toggle("is-pass", accepted);
      report.classList.toggle("is-review", !accepted);
    }
  }

  function initNeuralScene(shell, layers) {
    var canvas = shell.querySelector("[data-neural-scene-canvas]");
    if (!canvas) return { update: function () {} };
    if (!window.THREE) return initNeuralFallbackScene(canvas, layers);

    var THREE = window.THREE;
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 4.8, 17);

    var root = new THREE.Group();
    root.rotation.x = -0.3;
    root.rotation.y = 0.36;
    scene.add(root);

    scene.add(new THREE.AmbientLight(0xffffff, 0.72));
    var light = new THREE.PointLight(0xffffff, 0.9);
    light.position.set(3, 8, 8);
    scene.add(light);

    var specs = getSceneLayerSpecs();
    var objects = {};
    specs.forEach(function (spec) {
      var group = new THREE.Group();
      group.position.x = spec.x;

      var plane = new THREE.Mesh(
        new THREE.PlaneGeometry(spec.planeW, spec.planeH),
        new THREE.MeshBasicMaterial({
          color: spec.color,
          transparent: true,
          opacity: 0.055,
          side: THREE.DoubleSide
        })
      );
      plane.rotation.y = Math.PI / 2;
      group.add(plane);

      var nodeGeometry = new THREE.BoxGeometry(spec.node, spec.node, spec.node);
      var material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.42,
        metalness: 0.05,
        vertexColors: true
      });
      var mesh = new THREE.InstancedMesh(nodeGeometry, material, spec.count);
      var matrix = new THREE.Matrix4();
      for (var i = 0; i < spec.count; i++) {
        var pos = getLayerNodePosition(spec, i);
        matrix.makeTranslation(0, pos.y, pos.z);
        mesh.setMatrixAt(i, matrix);
        mesh.setColorAt(i, new THREE.Color(0xdbe4ef));
      }
      group.add(mesh);
      root.add(group);
      objects[spec.id] = { group: group, mesh: mesh, spec: spec };
    });

    addSceneConnections(root, THREE, specs);

    function resize() {
      var width = canvas.clientWidth || 620;
      var height = canvas.clientHeight || 360;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    function update(activations, model) {
      resize();
      specs.forEach(function (spec) {
        var object = objects[spec.id];
        var values = activations.layers[spec.id] || [];
        object.group.visible = model.visibleLayers[spec.id] !== false;
        for (var i = 0; i < spec.count; i++) {
          object.mesh.setColorAt(i, activationColor(THREE, values[i] || 0, spec.color));
        }
        if (object.mesh.instanceColor) object.mesh.instanceColor.needsUpdate = true;
      });
    }

    function animate() {
      if (!canvas.isConnected) {
        renderer.dispose();
        return;
      }
      requestAnimationFrame(animate);
      root.rotation.y += 0.0025;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    }

    resize();
    animate();

    return { update: update };
  }

  function initNeuralFallbackScene(canvas, layers) {
    if (!canvas) return { update: function () {} };
    return {
      update: function (activations, model) {
        drawFallbackNeuralScene(canvas, layers, activations, model);
      }
    };
  }

  function drawFallbackNeuralScene(canvas, layers, activations, model) {
    var ratio = Math.min(window.devicePixelRatio || 1, 2);
    var width = canvas.clientWidth || 620;
    var height = canvas.clientHeight || 360;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    var ctx = canvas.getContext("2d");
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, width, height);

    var specs = getSceneLayerSpecs();
    specs.forEach(function (spec, layerIndex) {
      if (model.visibleLayers[spec.id] === false) return;
      var values = activations.layers[spec.id] || [];
      var baseX = 52 + layerIndex * ((width - 110) / Math.max(1, specs.length - 1));
      var baseY = height * 0.5;
      var size = Math.max(2, Math.min(6, 140 / Math.max(spec.width, spec.height)));
      ctx.strokeStyle = hexToRgba(spec.color, 0.45);
      ctx.strokeRect(baseX - spec.width * size * 0.5 - 10, baseY - spec.height * size * 0.5 - 10, spec.width * size + 20, spec.height * size + 20);
      for (var i = 0; i < Math.min(spec.count, 180); i++) {
        var p = getLayerNodePosition(spec, i);
        var x = baseX + p.z * size * 2.1;
        var y = baseY - p.y * size * 2.1;
        ctx.fillStyle = hexToRgba(spec.color, 0.1 + clamp(values[i] || 0, 0, 1) * 0.8);
        ctx.fillRect(x, y, size, size);
      }
    });
  }

  function getSceneLayerSpecs() {
    return [
      { id: "input", count: 256, width: 16, height: 16, maps: 1, x: -7.2, planeW: 3.2, planeH: 3.2, node: 0.07, color: "#0f766e" },
      { id: "conv1", count: 256, width: 8, height: 8, maps: 4, x: -4.2, planeW: 2.8, planeH: 2.8, node: 0.08, color: "#1d4ed8" },
      { id: "pool1", count: 64, width: 4, height: 4, maps: 4, x: -1.5, planeW: 2.3, planeH: 2.3, node: 0.11, color: "#16a34a" },
      { id: "conv2", count: 54, width: 3, height: 3, maps: 6, x: 1.0, planeW: 2.4, planeH: 2.4, node: 0.12, color: "#b45309" },
      { id: "fc1", count: 16, width: 4, height: 4, maps: 1, x: 3.8, planeW: 1.8, planeH: 1.8, node: 0.14, color: "#7c3aed" },
      { id: "output", count: 4, width: 1, height: 4, maps: 1, x: 6.2, planeW: 1.0, planeH: 2.2, node: 0.18, color: "#dc2626" }
    ];
  }

  function getLayerNodePosition(spec, index) {
    var perMap = spec.width * spec.height;
    var map = Math.floor(index / perMap);
    var local = index % perMap;
    var col = local % spec.width;
    var row = Math.floor(local / spec.width);
    var spacing = spec.maps > 1 ? 0.19 : 0.2;
    var mapOffset = (map - (spec.maps - 1) / 2) * 0.38;
    return {
      y: ((spec.height - 1) / 2 - row) * spacing + Math.floor(map / 3) * 0.08,
      z: (col - (spec.width - 1) / 2) * spacing + mapOffset
    };
  }

  function addSceneConnections(root, THREE, specs) {
    var positions = [];
    for (var i = 0; i < specs.length - 1; i++) {
      for (var j = 0; j < 24; j++) {
        var a = getLayerNodePosition(specs[i], Math.floor(j / 24 * specs[i].count));
        var b = getLayerNodePosition(specs[i + 1], Math.floor(((j * 7) % 24) / 24 * specs[i + 1].count));
        positions.push(specs[i].x, a.y, a.z, specs[i + 1].x, b.y, b.z);
      }
    }
    var geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    var material = new THREE.LineBasicMaterial({
      color: 0x94a3b8,
      transparent: true,
      opacity: 0.16
    });
    root.add(new THREE.LineSegments(geometry, material));
  }

  function activationColor(THREE, value, hex) {
    var low = new THREE.Color(0xdbe4ef);
    var high = new THREE.Color(hex);
    return low.lerp(high, Math.pow(clamp(value, 0, 1), 0.7));
  }

  function hexToRgba(hex, alpha) {
    var clean = hex.replace("#", "");
    var value = parseInt(clean, 16);
    var r = (value >> 16) & 255;
    var g = (value >> 8) & 255;
    var b = value & 255;
    return "rgba(" + r + ", " + g + ", " + b + ", " + clamp(alpha, 0, 1).toFixed(3) + ")";
  }

  /* ───────── Legacy fallback (kept tiny) ───────── */

  function renderLegacyRanking(project, state) {
    var w = project.widget;
    var modeId = state.rankingModeByProject[project.id] || (w.modes && w.modes[0] && w.modes[0].id);
    var mode = (w.modes || []).find(function (m) { return m.id === modeId; }) || (w.modes && w.modes[0]);
    if (!mode) return "";
    return '<div class="widget-head"><div><h4>' + w.title + '</h4><p>' + w.help + '</p></div></div>' +
      '<p class="widget-note">' + mode.note + '</p>' +
      '<div class="ranking-list">' +
        mode.ranking.map(function (r) {
          return '<div class="ranking-row">' +
            '<span class="ranking-name">' + r.label + '</span>' +
            '<div class="ranking-bar-track"><div class="ranking-bar-fill" style="width:' + r.value + '%"></div></div>' +
            '<span class="ranking-score">' + r.value + '</span>' +
          '</div>';
        }).join("") +
      '</div>';
  }

  function renderLegacyGraph(project, state) {
    var w = project.widget;
    var viewId = state.graphViewByProject[project.id] || (w.views && w.views[0] && w.views[0].id);
    var view = (w.views || []).find(function (v) { return v.id === viewId; }) || (w.views && w.views[0]);
    if (!view) return "";
    return '<div class="widget-head"><div><h4>' + w.title + '</h4><p>' + w.help + '</p></div></div>' +
      renderEvidenceSvg(w.nodes, w.edges, view) +
      '<p class="widget-note">' + view.note + '</p>';
  }

  function renderLegacyRoi(project, state, stageIndex) {
    /* Older V5 roi-structure — we do not re-render it here; the new
     * threshold-dials widget covers the imaging project now.
     */
    return '<p class="widget-note">Legacy widget type; upgrade project.widget to threshold-dials.</p>';
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  ns.widgets = { renderWidget: renderWidget, bindNeuralWorkbench: bindNeuralWorkbench };
})();
