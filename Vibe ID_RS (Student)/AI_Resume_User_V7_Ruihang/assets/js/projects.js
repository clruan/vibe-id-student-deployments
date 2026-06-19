(function () {
  const ns = window.aiResume || (window.aiResume = {});

  function renderProjectsAccordion(data, state, callbacks) {
    var container = document.getElementById("projects-accordion");
    var projects = ns.skills && ns.skills.getFilteredProjects
      ? ns.skills.getFilteredProjects(data, state)
      : data.projects;

    if (!projects.length) {
      container.innerHTML = '<div class="filter-empty-state">' +
        '<h3>No projects match the selected skills.</h3>' +
        '<p>Clear one filter or choose a broader skill combination.</p>' +
      '</div>';
      return;
    }

    var projectLimit = 4;
    var visibleProjects = state.showAllProjects ? projects : projects.slice(0, projectLimit);

    container.innerHTML = visibleProjects
      .map(function (project, index) {
        var isLead = index === 0;
        return '<div class="project-accordion-item ' + (isLead ? "is-lead" : "") + '" data-project-id="' + project.id + '" style="--project-accent:' + project.accent + '">' +
          '<div class="project-accordion-header" role="button" tabindex="0">' +
            '<div>' +
              renderProjectSkillStrip(data, project) +
              (isLead ? '<span class="project-lead-flag">Featured project</span>' : "") +
              '<div class="project-accordion-title">' + project.navTitle + '</div>' +
              '<div class="project-accordion-meta">' + project.navMeta + '</div>' +
            '</div>' +
            '<div class="demo-badge-wrap">' +
              '<div class="demo-badge">' +
                '<span class="demo-badge-copy">' +
                  '<span class="demo-badge-title">Click to learn more</span>' +
                  '<span class="demo-badge-meta">Open project story</span>' +
                '</span>' +
                '<span class="demo-badge-arrow">\u25BC</span>' +
              '</div>' +
            '</div>' +
          '</div>' +
          renderProjectEndorsement(project, "summary") +
          '<div class="project-accordion-body">' +
            '<div class="project-body-inner" data-project-id="' + project.id + '"></div>' +
          '</div>' +
        '</div>';
      })
      .join("") +
      renderProjectListToggle(projects.length, projectLimit, state.showAllProjects);

    container.querySelectorAll(".project-accordion-header").forEach(function (header) {
      function toggleProject() {
        var item = header.closest(".project-accordion-item");
        var projectId = item.dataset.projectId;
        var isExpanded = item.classList.contains("is-expanded");

        container.querySelectorAll(".project-accordion-item").forEach(function (el) {
          el.classList.remove("is-expanded");
        });

        if (!isExpanded) {
          item.classList.add("is-expanded");
          state.activeProjectId = projectId;
          renderProjectDetail(data, state, projectId, callbacks);
          if (callbacks.onProjectActivate) callbacks.onProjectActivate(projectId);
        } else {
          state.activeProjectId = null;
          if (callbacks.onProjectDeactivate) callbacks.onProjectDeactivate();
        }

        container.querySelectorAll(".project-accordion-header").forEach(function (btn) {
          btn.setAttribute("aria-expanded", btn.closest(".project-accordion-item").classList.contains("is-expanded") ? "true" : "false");
        });
      }

      header.addEventListener("click", function () {
        toggleProject();
      });

      header.addEventListener("keydown", function (event) {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        toggleProject();
      });

      header.addEventListener("mouseenter", function () {
        var projectId = header.closest(".project-accordion-item").dataset.projectId;
        state.hoverProjectId = projectId;
        if (callbacks.onProjectHover) callbacks.onProjectHover(projectId);
      });

      header.addEventListener("mouseleave", function () {
        state.hoverProjectId = null;
        if (callbacks.onProjectLeave) callbacks.onProjectLeave();
      });

      header.setAttribute("aria-expanded", "false");
    });

    var toggle = container.querySelector("[data-project-list-toggle]");
    if (toggle) {
      toggle.addEventListener("click", function () {
        state.showAllProjects = !state.showAllProjects;
        renderProjectsAccordion(data, state, callbacks);
      });
    }
  }

  function renderProjectListToggle(total, limit, expanded) {
    if (total <= limit) return "";
    return '<button class="project-list-toggle" type="button" data-project-list-toggle aria-expanded="' + (expanded ? "true" : "false") + '">' +
      (expanded ? "Show fewer projects" : "Show more projects") +
    '</button>';
  }

  function renderProjectSkillStrip(data, project) {
    if (!ns.skills || !ns.skills.getProjectSkillItems || !ns.skills.renderSkillPills) return "";
    return ns.skills.renderSkillPills(ns.skills.getProjectSkillItems(data, project), { limit: 9 });
  }

  function renderProjectEndorsement(project, placement) {
    if (!project.endorsement || !ns.modes || !ns.modes.renderVipEndorsement) return "";
    var eyebrow = "Expert Endorsement";
    if (placement === "after") eyebrow = "Expert Endorsement";
    if (placement === "before") eyebrow = "Expert Endorsement";

    return ns.modes.renderVipEndorsement(project.endorsement, {
      eyebrow: eyebrow,
      variant: "project project-" + placement,
      force: true
    });
  }

  function isAaronProfile(data) {
    return data && data.id === "aaron-li";
  }

  function renderProjectDetail(data, state, projectId, callbacks) {
    var project = ns.state.getProjectById(data, projectId);
    var stages = Array.isArray(project.stages) ? project.stages : [];
    var stageIndex = state.activeStageByProject[project.id] || 0;
    var stage = stages[stageIndex];
    var projectSummary = project.summary || project.tagline || project.algorithmSummary || "";
    var artifactLinks = renderArtifactLinks(project);
    var screenshotBlock = renderScreenshotStrip(project, "Screenshots", artifactLinks);

    var inner = document.querySelector('.project-body-inner[data-project-id="' + projectId + '"]');

    inner.innerHTML = data.preserveOriginalProjectText
      ? renderOriginalProjectDetail(data, project, projectSummary, screenshotBlock, artifactLinks)
      : '<article class="project-view" style="--project-accent:' + project.accent + '">' +
          (projectSummary ? '<p class="project-detail-summary project-detail-summary-' + project.id + '">' + projectSummary + '</p>' : "") +
          screenshotBlock +
          (screenshotBlock ? "" : artifactLinks) +
          renderProjectNotes(project) +
          renderSourceStory(data, project) +
          renderCheckDemoSection(data, project, state, stageIndex, stage) +
        '</article>';

    inner.querySelectorAll(".stage-button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.activeStageByProject[projectId] = Number(btn.dataset.stageIndex);
        renderProjectDetail(data, state, projectId, callbacks);
      });
    });

    inner.querySelectorAll("[data-screenshot-index]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        openScreenshotDialog(project, Number(btn.dataset.screenshotIndex));
      });
    });

    var type = project.widget && project.widget.type;

    if (type === "policy-lab") {
      inner.querySelectorAll("[data-policy-scenario]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          state.policyScenarioByProject[projectId] = btn.dataset.policyScenario;
          renderProjectDetail(data, state, projectId, callbacks);
        });
      });
      inner.querySelectorAll("[data-policy-patient]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          state.policyPatientByProject[projectId] = btn.dataset.policyPatient;
          renderProjectDetail(data, state, projectId, callbacks);
        });
      });
    }

    if (type === "cluster-topology-lab") {
      inner.querySelectorAll("[data-cluster-lens]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          state.clusterLensByProject[projectId] = btn.dataset.clusterLens;
          renderProjectDetail(data, state, projectId, callbacks);
        });
      });
      inner.querySelectorAll("[data-cluster-focus]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          state.clusterFocusByProject[projectId] = btn.dataset.clusterFocus;
          renderProjectDetail(data, state, projectId, callbacks);
        });
      });
    }

    if (type === "tradeoff-frontier") {
      inner.querySelectorAll("[data-tradeoff-run]").forEach(function (el) {
        el.addEventListener("click", function () {
          state.tradeoffRunByProject[projectId] = el.dataset.tradeoffRun;
          renderProjectDetail(data, state, projectId, callbacks);
        });
      });
    }

    if (type === "market-pulse-lab") {
      inner.querySelectorAll("[data-market-scenario]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          state.marketScenarioByProject[projectId] = btn.dataset.marketScenario;
          renderProjectDetail(data, state, projectId, callbacks);
        });
      });
      inner.querySelectorAll("[data-market-ticker]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          state.marketTickerByProject[projectId] = btn.dataset.marketTicker;
          renderProjectDetail(data, state, projectId, callbacks);
        });
      });
    }

    if (type === "research-agent-lab") {
      inner.querySelectorAll("[data-research-hypothesis]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          state.researchHypothesisByProject[projectId] = btn.dataset.researchHypothesis;
          renderProjectDetail(data, state, projectId, callbacks);
        });
      });
    }

    if (type === "nd2-agent-lab") {
      var nd2Slider = inner.querySelector("[data-nd2-threshold]");
      if (nd2Slider) {
        nd2Slider.addEventListener("input", function () {
          state.nd2ThresholdByProject[projectId] = Number(nd2Slider.value);
          renderProjectDetail(data, state, projectId, callbacks);
        });
      }
      inner.querySelectorAll("[data-nd2-channel]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          state.nd2ChannelByProject[projectId] = btn.dataset.nd2Channel;
          renderProjectDetail(data, state, projectId, callbacks);
        });
      });
    }

    if (type === "survival-causal-lab") {
      inner.querySelectorAll("[data-survival-cohort]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          state.survivalCohortByProject[projectId] = btn.dataset.survivalCohort;
          renderProjectDetail(data, state, projectId, callbacks);
        });
      });
    }

    if (type === "causal-companion-lab") {
      inner.querySelectorAll("[data-causal-concept]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          state.causalConceptByProject[projectId] = btn.dataset.causalConcept;
          renderProjectDetail(data, state, projectId, callbacks);
        });
      });
    }

    if (type === "timeline-pattern-lab") {
      inner.querySelectorAll("[data-timeline-pattern]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          state.timelinePatternByProject[projectId] = btn.dataset.timelinePattern;
          renderProjectDetail(data, state, projectId, callbacks);
        });
      });
    }

    if (type === "nlp-extraction-lab") {
      inner.querySelectorAll("[data-nlp-sample]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          state.nlpSampleByProject[projectId] = btn.dataset.nlpSample;
          renderProjectDetail(data, state, projectId, callbacks);
        });
      });
    }

    if (type === "evidence-path") {
      inner.querySelectorAll("[data-evidence-view]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          state.evidenceViewByProject[projectId] = btn.dataset.evidenceView;
          renderProjectDetail(data, state, projectId, callbacks);
        });
      });
    }

    if (type === "threshold-dials") {
      var slider = inner.querySelector(".threshold-input");
      if (slider) {
        slider.addEventListener("input", function () {
          state.thresholdByProject[projectId] = Number(slider.value);
          renderProjectDetail(data, state, projectId, callbacks);
        });
      }
      inner.querySelectorAll("[data-threshold-value]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          state.thresholdByProject[projectId] = Number(btn.dataset.thresholdValue);
          renderProjectDetail(data, state, projectId, callbacks);
        });
      });
    }

    if (type === "estimator-forest") {
      inner.querySelectorAll("[data-estimator-row]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          state.estimatorRowByProject[projectId] = btn.dataset.estimatorRow;
          renderProjectDetail(data, state, projectId, callbacks);
        });
      });
    }

    if (type === "neural-workbench" && ns.widgets && ns.widgets.bindNeuralWorkbench) {
      ns.widgets.bindNeuralWorkbench(project, state, inner);
    }
  }

  function renderOriginalProjectDetail(data, project, projectSummary, screenshotBlock, artifactLinks) {
    var visualEvidence = renderScreenshotStrip(project, "Visual evidence", "");
    return '<article class="project-view project-view-original" style="--project-accent:' + project.accent + '">' +
      '<header class="project-view-head star-head">' +
        '<h3>' + project.title + '</h3>' +
        (project.tagline ? '<p class="project-tagline">' + project.tagline + '</p>' : "") +
      '</header>' +
      renderOriginalProjectMeta(data, project, artifactLinks) +
      renderProjectEvidence(project) +
      visualEvidence +
      renderSourceContext(data, project) +
    '</article>';
  }

  function renderOriginalProjectMeta(data, project, artifactLinks) {
    var chips = (project.relatedTech || []).map(function (techId) {
      var tech = (data.stack || []).filter(function (s) { return s.id === techId; })[0];
      return tech ? '<span class="skill-token project-skill-pill" style="--skill-color:' + (tech.color || project.accent || "#4f46e5") + '">' + (tech.label || tech.id) + '</span>' : "";
    }).join("");

    if (!chips && !artifactLinks) return "";
    return '<div class="project-meta-row">' +
      (chips ? '<div class="project-tech-row">' + chips + '</div>' : "") +
      artifactLinks +
    '</div>';
  }

  function renderWidgetPanel(project, state, stageIndex) {
    if (!project.widget) return "";
    return '<div class="widget-panel widget-panel-' + (project.widget.type || "base") + '">' +
      ns.widgets.renderWidget(project, state, stageIndex) +
    '</div>';
  }

  function renderCheckDemoSection(data, project, state, stageIndex, stage) {
    var hasStages = Array.isArray(project.stages) && project.stages.length;
    var hasWidget = project.widget && project.widget.type;
    if (!hasStages && !hasWidget) return "";

    return '<div class="algorithm-view">' +
      renderCheckDemoContent(data, project, state, stageIndex, stage) +
    '</div>';
  }

  function renderCheckDemoContent(data, project, state, stageIndex, stage) {
    var stages = Array.isArray(project.stages) ? project.stages : [];
    return '<div class="algorithm-stage-row">' +
        stages.map(function (s, i) {
          return '<button class="stage-button ' + (i === stageIndex ? "active" : "") + '" type="button" data-stage-index="' + i + '">' + s.label + '</button>';
        }).join("") +
      '</div>' +

      renderStageFlow(stage) +

      renderPmNote(stage.pmNote) +

      renderWidgetPanel(project, state, stageIndex);
  }

  function renderProjectNotes(project) {
    var owned = Array.isArray(project.owned) ? project.owned.slice(0, 2) : [];
    var methodText = project.algorithmSummary && project.algorithmSummary !== project.summary
      ? project.algorithmSummary
      : "";

    if (!owned.length && !methodText) return "";

    return '<div class="project-note-grid project-note-grid-compact">' +
      (owned.length
        ? '<div class="note-card">' +
            '<h4>Role</h4>' +
            '<ul class="compact-list">' +
              owned.map(function (item) { return '<li>' + item + '</li>'; }).join("") +
            '</ul>' +
          '</div>'
        : "") +
      (methodText
        ? '<div class="note-card note-card-lead">' +
            '<h4>Logic</h4>' +
            '<p>' + methodText + '</p>' +
          '</div>'
        : "") +
    '</div>';
  }

  function renderStageFlow(stage) {
    if (!stage) return "";

    return '<div class="aaron-flow-map">' +
      renderFlowNode("input", "Input", stage.inputTitle, stage.inputLines) +
      '<div class="aaron-flow-arrow" aria-hidden="true">→</div>' +
      renderFlowNode("logic", "Logic", stage.operationTitle, stage.operationLines) +
      '<div class="aaron-flow-arrow" aria-hidden="true">→</div>' +
      renderFlowNode("output", "Output", stage.outputTitle, stage.outputLines) +
    '</div>';
  }

  function renderFlowNode(kind, label, title, lines) {
    return '<article class="aaron-flow-node aaron-flow-node-' + kind + '">' +
      '<span class="card-label">' + label + '</span>' +
      '<h4>' + clipText(title, 42) + '</h4>' +
      '<ul class="compact-list">' + clipLines(lines, 2, 48).map(function (line) { return '<li>' + line + '</li>'; }).join("") + '</ul>' +
    '</article>';
  }

  function renderPmNote(note) {
    var text = clipText(note, 110);
    if (!text) return "";
    return '<div class="pm-note pm-note-compact"><p>' + text + '</p></div>';
  }

  function clipLines(lines, count, max) {
    return (lines || []).filter(Boolean).slice(0, count).map(function (line) {
      return clipText(line, max);
    });
  }

  function clipText(value, max) {
    var text = String(value || "").replace(/\s+/g, " ").trim();
    if (!text || text.length <= max) return text;
    return text.slice(0, Math.max(4, max - 1)).replace(/\s+\S*$/, "") + "…";
  }

  function renderArtifactLinks(project) {
    if (!Array.isArray(project.artifactLinks) || !project.artifactLinks.length) return "";
    var hasLiveDemo = false;
    var links = project.artifactLinks.filter(function (link) {
      var isLiveDemo = /open live demo|live demo|demo/i.test(link.label || "");
      if (!isLiveDemo) return true;
      if (hasLiveDemo) return false;
      hasLiveDemo = true;
      return true;
    });
    if (!links.length) return "";

    return '<div class="project-artifact-row">' +
      links.map(function (link) {
        return '<a class="' + getArtifactLinkClass(link) + '" href="' + link.href + '" target="_blank" rel="noreferrer">' +
          '<span>' + link.label + '</span>' +
          '<small>' + (link.note || "Artifact") + '</small>' +
        '</a>';
      }).join("") +
    '</div>';
  }

  function getArtifactLinkClass(link) {
    var isLiveDemo = /open live demo|live demo|demo/i.test(link.label || "");
    return "project-artifact-link" + (isLiveDemo ? " project-artifact-link-live" : "");
  }

  function renderSourceStory(data, project) {
    if (isAaronProfile(data)) return "";

    var context = [
      renderProblemStatement(project),
      renderApproach(data, project)
    ].filter(Boolean);
    var evidence = renderProjectEvidence(project);

    if (!context.length && !evidence) return "";
    return (context.length ? '<div class="source-story-grid">' + context.join("") + '</div>' : "") + evidence;
  }

  function renderSourceContext(data, project) {
    if (isAaronProfile(data)) return "";

    var blocks = [
      renderProblemStatement(project),
      renderApproach(data, project)
    ].filter(Boolean);

    if (!blocks.length) return "";
    return '<div class="source-story-grid source-story-grid-context">' + blocks.join("") + '</div>';
  }

  function renderProblemStatement(project) {
    var p = project.problemStatement;
    if (!p) return "";

    var body;
    if (p.narrative) {
      body = '<p>' + p.narrative + '</p>';
    } else {
      var sentences = [];
      if (p.who && p.tension) sentences.push("For " + p.who + " facing " + p.tension + ".");
      else if (p.who) sentences.push("For " + p.who + ".");
      else if (p.tension) sentences.push(p.tension + ".");
      if (p.question) sentences.push('<strong>Unanswered question:</strong> ' + p.question);
      body = '<p>' + sentences.join(" ") + '</p>';
    }

    return '<section class="source-story-card">' +
      '<h4>Problem statement</h4>' +
      body +
    '</section>';
  }

  function renderApproach(data, project) {
    var a = project.approach;
    if (!a) return "";

    return '<section class="source-story-card">' +
      '<h4>Approach</h4>' +
      (a.description ? '<p>' + a.description + '</p>' : "") +
    '</section>';
  }

  function renderProjectEvidence(project) {
    var r = Array.isArray(project.result) ? project.result : [];
    if (!r.length) return "";

    return '<div class="source-story-grid source-story-grid-evidence">' +
      '<section class="source-story-card source-story-card-dark source-story-card-wide source-story-card-evidence">' +
      '<h4>Evidence</h4>' +
      '<ul class="compact-list">' +
        r.map(function (item) { return '<li>' + item + '</li>'; }).join("") +
      '</ul>' +
      '</section>' +
    '</div>';
  }

  function renderScreenshotStrip(project, title, actions) {
    var shots = Array.isArray(project.screenshots) ? project.screenshots : [];
    var html = shots.map(function (shot, idx) {
      if (!shot || !shot.src) return "";
      return '<button class="screenshot-thumb" type="button" data-screenshot-index="' + idx + '" aria-label="Open screenshot: ' + (shot.caption || shot.alt || "image " + (idx + 1)) + '">' +
        '<span class="screenshot-frame"><img src="' + shot.src + '" alt="' + (shot.alt || "") + '" loading="eager" onerror="this.closest(\'.screenshot-thumb\').classList.add(\'is-missing\')"></span>' +
        '<span class="screenshot-caption">' + (shot.caption || ("Screenshot " + (idx + 1))) + '</span>' +
      '</button>';
    }).join("");

    if (!html) return "";
    return '<section class="source-story-card source-story-card-wide">' +
      '<div class="source-story-card-head">' +
        '<h4>' + (title || "Visual evidence") + '</h4>' +
        (actions || "") +
      '</div>' +
      '<div class="screenshot-strip">' + html + '</div>' +
    '</section>';
  }

  function ensureScreenshotDialog() {
    var dlg = document.getElementById("screenshot-dialog");
    if (dlg) return dlg;

    dlg = document.createElement("dialog");
    dlg.id = "screenshot-dialog";
    dlg.className = "screenshot-dialog";
    dlg.innerHTML =
      '<button class="screenshot-dialog-nav screenshot-dialog-prev" type="button" aria-label="Previous">‹</button>' +
      '<figure class="screenshot-dialog-figure">' +
        '<button class="screenshot-dialog-close" type="button" aria-label="Close">×</button>' +
        '<img class="screenshot-dialog-img" alt="">' +
        '<figcaption class="screenshot-dialog-caption"></figcaption>' +
      '</figure>' +
      '<button class="screenshot-dialog-nav screenshot-dialog-next" type="button" aria-label="Next">›</button>';

    document.body.appendChild(dlg);

    dlg.addEventListener("click", function (event) {
      if (event.target === dlg) dlg.close();
    });
    dlg.querySelector(".screenshot-dialog-close").addEventListener("click", function () { dlg.close(); });
    dlg.querySelector(".screenshot-dialog-prev").addEventListener("click", function () { stepDialog(-1); });
    dlg.querySelector(".screenshot-dialog-next").addEventListener("click", function () { stepDialog(1); });
    document.addEventListener("keydown", function (event) {
      if (!dlg.open) return;
      if (event.key === "ArrowLeft") stepDialog(-1);
      if (event.key === "ArrowRight") stepDialog(1);
      if (event.key === "Escape" && typeof dlg.close === "function") dlg.close();
    });

    return dlg;
  }

  function openScreenshotDialog(project, index) {
    var shots = Array.isArray(project.screenshots) ? project.screenshots.filter(function (s) { return s && s.src; }) : [];
    if (!shots.length) return;
    var dlg = ensureScreenshotDialog();
    dlg._shots = shots;
    dlg._index = Math.max(0, Math.min(index, shots.length - 1));
    paintDialog(dlg);
    if (typeof dlg.showModal === "function") dlg.showModal();
    else dlg.setAttribute("open", "");
  }

  function stepDialog(delta) {
    var dlg = document.getElementById("screenshot-dialog");
    if (!dlg || !dlg._shots) return;
    var n = dlg._shots.length;
    dlg._index = (dlg._index + delta + n) % n;
    paintDialog(dlg);
  }

  function paintDialog(dlg) {
    var shot = dlg._shots[dlg._index];
    var img = dlg.querySelector(".screenshot-dialog-img");
    var cap = dlg.querySelector(".screenshot-dialog-caption");
    img.src = shot.src;
    img.alt = shot.alt || "";
    cap.textContent = shot.caption || "";
    dlg.querySelectorAll(".screenshot-dialog-nav").forEach(function (button) {
      button.style.display = dlg._shots.length > 1 ? "" : "none";
    });
  }

  ns.projects = { renderProjectsAccordion: renderProjectsAccordion };
})();
