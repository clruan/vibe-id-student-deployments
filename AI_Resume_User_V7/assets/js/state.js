(function () {
  const ns = window.aiResume || (window.aiResume = {});

  function create(data) {
    var activeStageByProject = {};
    var policyScenarioByProject = {};
    var policyPatientByProject = {};
    var clusterLensByProject = {};
    var clusterFocusByProject = {};
    var tradeoffRunByProject = {};
    var evidenceViewByProject = {};
    var marketScenarioByProject = {};
    var marketTickerByProject = {};
    var researchHypothesisByProject = {};
    var nd2ChannelByProject = {};
    var nd2ThresholdByProject = {};
    var survivalCohortByProject = {};
    var causalConceptByProject = {};
    var timelinePatternByProject = {};
    var nlpSampleByProject = {};
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

      if (w.type === "policy-lab") {
        policyScenarioByProject[project.id] = w.defaultScenario || (w.scenarios && w.scenarios[0] && w.scenarios[0].id);
        policyPatientByProject[project.id] = w.defaultPatient || (w.patients && w.patients[0] && w.patients[0].id);
      }

      if (w.type === "cluster-topology-lab") {
        clusterLensByProject[project.id] = w.defaultLens || (w.lenses && w.lenses[0] && w.lenses[0].id);
        clusterFocusByProject[project.id] = w.defaultCluster || (w.clusters && w.clusters[0] && w.clusters[0].id);
      }

      if (w.type === "tradeoff-frontier" && w.runs && w.runs.length) {
        tradeoffRunByProject[project.id] = w.winner || w.runs[0].id;
      }

      if (w.type === "evidence-path" && w.views && w.views.length) {
        evidenceViewByProject[project.id] = w.views[w.views.length - 1].id;
      }

      if (w.type === "market-pulse-lab") {
        marketScenarioByProject[project.id] = w.defaultScenario || (w.scenarios && w.scenarios[0] && w.scenarios[0].id);
        marketTickerByProject[project.id] = w.defaultTicker || (w.tickers && w.tickers[0] && w.tickers[0].id);
      }

      if (w.type === "research-agent-lab") {
        researchHypothesisByProject[project.id] = w.defaultHypothesis || (w.hypotheses && w.hypotheses[0] && w.hypotheses[0].id);
      }

      if (w.type === "nd2-agent-lab") {
        nd2ChannelByProject[project.id] = w.defaultChannel || (w.channels && w.channels[0] && w.channels[0].id);
        nd2ThresholdByProject[project.id] = typeof w.defaultThreshold === "number" ? w.defaultThreshold : (w.min || 0);
      }

      if (w.type === "survival-causal-lab") {
        survivalCohortByProject[project.id] = w.defaultCohort || (w.cohorts && w.cohorts[0] && w.cohorts[0].id);
      }

      if (w.type === "causal-companion-lab") {
        causalConceptByProject[project.id] = w.defaultConcept || (w.concepts && w.concepts[0] && w.concepts[0].id);
      }

      if (w.type === "timeline-pattern-lab") {
        timelinePatternByProject[project.id] = w.defaultPattern || (w.patterns && w.patterns[0] && w.patterns[0].id);
      }

      if (w.type === "nlp-extraction-lab") {
        nlpSampleByProject[project.id] = w.defaultSample || (w.samples && w.samples[0] && w.samples[0].id);
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
      showAllProjects: false,
      selectedSkillIds: [],
      expandedSkillGroups: {},
      activeStageByProject: activeStageByProject,
      policyScenarioByProject: policyScenarioByProject,
      policyPatientByProject: policyPatientByProject,
      clusterLensByProject: clusterLensByProject,
      clusterFocusByProject: clusterFocusByProject,
      tradeoffRunByProject: tradeoffRunByProject,
      evidenceViewByProject: evidenceViewByProject,
      marketScenarioByProject: marketScenarioByProject,
      marketTickerByProject: marketTickerByProject,
      researchHypothesisByProject: researchHypothesisByProject,
      nd2ChannelByProject: nd2ChannelByProject,
      nd2ThresholdByProject: nd2ThresholdByProject,
      survivalCohortByProject: survivalCohortByProject,
      causalConceptByProject: causalConceptByProject,
      timelinePatternByProject: timelinePatternByProject,
      nlpSampleByProject: nlpSampleByProject,
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
