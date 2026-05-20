(function () {
  const ns = window.aiResume || (window.aiResume = {});

  function renderProjectsAccordion(data, state, callbacks) {
    var container = document.getElementById("projects-accordion");

    container.innerHTML = data.projects
      .map(function (project, index) {
        var isLead = index === 0;
        return '<div class="project-accordion-item ' + (isLead ? "is-lead" : "") + '" data-project-id="' + project.id + '">' +
          '<button class="project-accordion-header" type="button">' +
            '<div>' +
              (isLead ? '<span class="project-lead-flag">Lead project for ' + (data.targetRole || "this role") + '</span>' : "") +
              '<div class="project-accordion-title">' + project.navTitle + '</div>' +
              '<div class="project-accordion-meta">' + project.navMeta + '</div>' +
            '</div>' +
            '<div class="demo-badge-wrap">' +
              '<div class="demo-badge">' +
                '<span class="demo-badge-copy">' +
                  '<span class="demo-badge-title">Check Demo</span>' +
                  '<span class="demo-badge-meta">' + demoLabel(project) + '</span>' +
                '</span>' +
                '<span class="demo-badge-arrow">\u25BC</span>' +
              '</div>' +
            '</div>' +
          '</button>' +
          '<div class="project-accordion-body">' +
            '<div class="project-body-inner" data-project-id="' + project.id + '"></div>' +
          '</div>' +
        '</div>';
      })
      .join("");

    container.querySelectorAll(".project-accordion-header").forEach(function (header) {
      header.addEventListener("click", function () {
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
  }

  function demoLabel(project) {
    var type = project.widget && project.widget.type;
    switch (type) {
      case "tradeoff-frontier": return "Precision / recall frontier";
      case "evidence-path": return "Evidence-path trace";
      case "threshold-dials": return "Threshold dials + report";
      case "estimator-forest": return "Forest plot of estimators";
      case "neural-workbench": return "Interactive 3D CNN";
      default: return "Live algo walkthrough";
    }
  }

  function renderProjectDetail(data, state, projectId, callbacks) {
    var project = ns.state.getProjectById(data, projectId);
    var stageIndex = state.activeStageByProject[project.id];
    var stage = project.stages[stageIndex];
    var vipEndorsement = ns.modes && ns.modes.renderVipEndorsement
      ? ns.modes.renderVipEndorsement(project.endorsement, { eyebrow: "VIP endorsement", variant: "project" })
      : "";

    var inner = document.querySelector('.project-body-inner[data-project-id="' + projectId + '"]');

    inner.innerHTML =
      '<article class="project-view" style="--project-accent:' + project.accent + '">' +
        '<div class="project-view-head">' +
          '<div>' +
            '<p class="eyebrow">' + project.source + '</p>' +
            '<h3>' + project.title + '</h3>' +
            '<p class="project-summary">' + project.summary + '</p>' +
          '</div>' +
          '<div class="project-metric-row">' +
            project.metrics.map(function (m) {
              return '<div class="mini-metric">' +
                '<span class="mini-metric-label">' + m.label + '</span>' +
                '<strong>' + m.value + '</strong>' +
              '</div>';
            }).join("") +
          '</div>' +
        '</div>' +

        '<div class="project-tech-row">' +
          project.relatedTech.map(function (techId) {
            var tech = data.stack.find(function (s) { return s.id === techId; });
            return tech ? ns.icons.renderTechChip(tech, true) : "";
          }).join("") +
        '</div>' +

        '<div class="project-note-grid">' +
          '<div class="note-card">' +
            '<h4>What I owned</h4>' +
            '<ul class="compact-list">' +
              project.owned.map(function (item) { return '<li>' + item + '</li>'; }).join("") +
            '</ul>' +
          '</div>' +
          '<div class="note-card note-card-lead">' +
            '<h4>Driving parameter</h4>' +
            '<p>' + (project.algorithmSummary || project.summary) + '</p>' +
          '</div>' +
        '</div>' +

        vipEndorsement +

        '<div class="algorithm-view">' +
          '<div class="algorithm-stage-row">' +
            project.stages.map(function (s, i) {
              return '<button class="stage-button ' + (i === stageIndex ? "active" : "") + '" type="button" data-stage-index="' + i + '">' + s.label + '</button>';
            }).join("") +
          '</div>' +

          '<div class="algorithm-card-grid">' +
            '<article class="algorithm-card">' +
              '<p class="card-label">Input</p>' +
              '<h4>' + stage.inputTitle + '</h4>' +
              '<ul class="compact-list">' + stage.inputLines.map(function (l) { return '<li>' + l + '</li>'; }).join("") + '</ul>' +
            '</article>' +
            '<article class="algorithm-card emphasis">' +
              '<p class="card-label">Logic</p>' +
              '<h4>' + stage.operationTitle + '</h4>' +
              '<ul class="compact-list">' + stage.operationLines.map(function (l) { return '<li>' + l + '</li>'; }).join("") + '</ul>' +
            '</article>' +
            '<article class="algorithm-card">' +
              '<p class="card-label">Output</p>' +
              '<h4>' + stage.outputTitle + '</h4>' +
              '<ul class="compact-list">' + stage.outputLines.map(function (l) { return '<li>' + l + '</li>'; }).join("") + '</ul>' +
            '</article>' +
          '</div>' +

          '<div class="pm-note">' +
            '<span class="pm-note-label">Product lens</span>' +
            '<p>' + stage.pmNote + '</p>' +
          '</div>' +

          '<div class="widget-panel widget-panel-' + (project.widget && project.widget.type ? project.widget.type : "base") + '">' +
            ns.widgets.renderWidget(project, state, stageIndex) +
          '</div>' +
        '</div>' +
      '</article>';

    if (window.gsap) {
      gsap.from(inner.querySelector(".project-view"), {
        opacity: 0, y: 20, duration: 0.4, ease: "power2.out"
      });
    }

    inner.querySelectorAll(".stage-button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.activeStageByProject[projectId] = Number(btn.dataset.stageIndex);
        renderProjectDetail(data, state, projectId, callbacks);
      });
    });

    var type = project.widget && project.widget.type;

    if (type === "tradeoff-frontier") {
      inner.querySelectorAll("[data-tradeoff-run]").forEach(function (el) {
        el.addEventListener("click", function () {
          state.tradeoffRunByProject[projectId] = el.dataset.tradeoffRun;
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

  ns.projects = { renderProjectsAccordion: renderProjectsAccordion };
})();
