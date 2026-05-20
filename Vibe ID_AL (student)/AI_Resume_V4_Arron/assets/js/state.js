(function () {
  const ns = window.aiResume || (window.aiResume = {});

  function create(data) {
    var activeStageByProject = {};
    var tradeoffRunByProject = {};
    var evidenceViewByProject = {};
    var thresholdByProject = {};
    var estimatorRowByProject = {};
    var neuralWorkbenchByProject = {};
    /* Legacy widget state — kept so old V5/HR widgets keep working if reused. */
    var rankingModeByProject = {};
    var graphViewByProject = {};

    data.projects.forEach(function (project) {
      activeStageByProject[project.id] = 0;

      if (!project.widget) return;
      var w = project.widget;

      if (w.type === "tradeoff-frontier" && w.runs && w.runs.length) {
        tradeoffRunByProject[project.id] = w.winner || w.runs[0].id;
      }

      if (w.type === "evidence-path" && w.views && w.views.length) {
        evidenceViewByProject[project.id] = w.views[w.views.length - 1].id;
      }

      if (w.type === "threshold-dials") {
        thresholdByProject[project.id] = typeof w.value === "number" ? w.value : w.min;
      }

      if (w.type === "estimator-forest" && w.rows && w.rows.length) {
        estimatorRowByProject[project.id] = w.winner || w.rows[0].id;
      }

      if (w.type === "neural-workbench") {
        neuralWorkbenchByProject[project.id] = {
          preset: w.defaultPreset || (w.presets && w.presets[0] && w.presets[0].id) || "fibrosis",
          threshold: typeof w.value === "number" ? w.value : 48,
          brushSize: 3,
          visibleLayers: (w.layers || []).reduce(function (acc, layer) {
            acc[layer.id] = layer.defaultVisible !== false;
            return acc;
          }, {}),
          matrix: null
        };
      }

      /* Legacy compat */
      if (w.type === "ranking" && w.modes && w.modes.length) {
        rankingModeByProject[project.id] = w.defaultMode || w.modes[0].id;
      }
      if (w.type === "graph" && w.views && w.views.length) {
        graphViewByProject[project.id] = w.defaultView || w.views[0].id;
      }
      if (w.type === "roi-structure") {
        thresholdByProject[project.id] = typeof w.value === "number" ? w.value : w.min;
      }
    });

    return {
      currentPage: 1,
      mode: window.aiResume && window.aiResume.modes ? window.aiResume.modes.getSavedMode() : "standard",
      activeProjectId: null,
      hoverProjectId: null,
      activeExpId: null,
      hoverExpId: null,
      activeStageByProject: activeStageByProject,
      tradeoffRunByProject: tradeoffRunByProject,
      evidenceViewByProject: evidenceViewByProject,
      thresholdByProject: thresholdByProject,
      estimatorRowByProject: estimatorRowByProject,
      neuralWorkbenchByProject: neuralWorkbenchByProject,
      rankingModeByProject: rankingModeByProject,
      graphViewByProject: graphViewByProject
    };
  }

  function getProjectById(data, projectId) {
    return data.projects.find(function (p) { return p.id === projectId; });
  }

  function getActiveProject(data, state) {
    return getProjectById(data, state.activeProjectId);
  }

  function getHighlightedTechIds(data, state) {
    var projectId = state.hoverProjectId || state.activeProjectId;
    var project = getProjectById(data, projectId);
    var pTech = project && project.relatedTech ? project.relatedTech : [];

    var expId = state.hoverExpId || state.activeExpId;
    var exp = data.experience.find(function(e, i) { return (e.id || 'exp-'+i) === expId; });
    var eTech = exp && exp.relatedTech ? exp.relatedTech : [];

    return new Set(pTech.concat(eTech));
  }

  ns.state = {
    create: create,
    getProjectById: getProjectById,
    getActiveProject: getActiveProject,
    getHighlightedTechIds: getHighlightedTechIds
  };
})();
