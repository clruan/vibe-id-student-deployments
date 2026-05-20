(function () {
  const ns = window.aiResume || (window.aiResume = {});

  function create(data) {
    var marketScenarioByProject = {};
    var marketTickerByProject = {};
    var researchHypothesisByProject = {};
    var rankingModeByProject = {};
    var graphViewByProject = {};
    var thresholdByProject = {};

    data.projects.forEach(function (project) {
      if (!project.widget) return;
      var w = project.widget;
      if (w.type === "market-pulse-lab") {
        marketScenarioByProject[project.id] = w.defaultScenario || (w.scenarios && w.scenarios[0] && w.scenarios[0].id);
        marketTickerByProject[project.id] = w.defaultTicker || (w.tickers && w.tickers[0] && w.tickers[0].id);
      }
      if (w.type === "research-agent-lab") {
        researchHypothesisByProject[project.id] = w.defaultHypothesis || (w.hypotheses && w.hypotheses[0] && w.hypotheses[0].id);
      }
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
      activeProjectId: null,
      hoverProjectId: null,
      activeExpId: null,
      hoverExpId: null,
      activeStageByProject: Object.fromEntries(data.projects.map(function (p) { return [p.id, 0]; })),
      marketScenarioByProject: marketScenarioByProject,
      marketTickerByProject: marketTickerByProject,
      researchHypothesisByProject: researchHypothesisByProject,
      rankingModeByProject: rankingModeByProject,
      graphViewByProject: graphViewByProject,
      thresholdByProject: thresholdByProject
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
