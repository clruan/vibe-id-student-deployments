(function () {
  const ns = window.aiResume;
  const data = window.resumeContent;
  const state = ns.state.create(data);

  applyDocumentMeta(data);
  document.body.setAttribute("data-job", window.resumeJobId || data.id || "");

  if (ns.modes && ns.modes.init) {
    ns.modes.init(state);
  }

  if (ns.shell && ns.shell.render) {
    ns.shell.render(data, state);
    ns.shell.syncMode(state);
  }

  /* ── Render all static sections ────────────── */
  ns.pages.renderPage1(data);
  ns.pages.renderExperience(data, {
    onExperienceActivate: function (expId) {
      state.activeExpId = expId;
      ns.skills.updateHighlights(data, state);
    },
    onExperienceDeactivate: function () {
      state.activeExpId = null;
      ns.skills.updateHighlights(data, state);
    },
    onExperienceHover: function (expId) {
      state.hoverExpId = expId;
      ns.skills.updateHighlights(data, state);
    },
    onExperienceLeave: function () {
      state.hoverExpId = null;
      ns.skills.updateHighlights(data, state);
    }
  });
  ns.pages.renderEducation(data);
  ns.pages.renderAwards(data);
  ns.pages.renderPublications(data);
  ns.pages.renderPeers(data);

  /* ── Render skill panels ───────────────────── */
  ns.skills.renderSkillPanels(data, state);

  /* ── Render projects accordion ─────────────── */
  ns.projects.renderProjectsAccordion(data, state, {
    onProjectActivate: function (projectId) {
      state.activeProjectId = projectId;
      ns.skills.updateHighlights(data, state);
    },
    onProjectDeactivate: function () {
      state.activeProjectId = null;
      ns.skills.updateHighlights(data, state);
    },
    onProjectHover: function (projectId) {
      state.hoverProjectId = projectId;
      ns.skills.updateHighlights(data, state);
    },
    onProjectLeave: function () {
      state.hoverProjectId = null;
      ns.skills.updateHighlights(data, state);
    }
  });

  var initialProjectId = getInitialProjectId(data);
  if (initialProjectId) {
    var initialProjectHeader = document.querySelector('.project-accordion-item[data-project-id="' + initialProjectId + '"] .project-accordion-header');
    if (initialProjectHeader) {
      initialProjectHeader.click();
      setTimeout(function () {
        var projectPage = document.getElementById("page-3");
        if (projectPage) projectPage.scrollIntoView({ block: "start" });
      }, 50);
    }
  }

  var initialPage = ns.pages.detectCurrentPage ? ns.pages.detectCurrentPage() : 1;
  state.currentPage = initialPage;
  document.querySelectorAll(".page-dot").forEach(function (dot) {
    dot.classList.toggle("active", Number(dot.dataset.target) === initialPage);
  });
  if (ns.skills.syncToPage) {
    ns.skills.syncToPage(initialPage, { immediate: true });
  }

  /* ── Setup GSAP scroll animations ──────────── */
  ns.pages.setupScrollAnimations(state);

  window.addEventListener("modechange", function () {
    if (ns.shell && ns.shell.syncMode) {
      ns.shell.syncMode(state);
    }
  });

  function applyDocumentMeta(candidateData) {
    var ui = candidateData.ui || {};
    var description = ui.metaDescription || "";
    var meta = document.querySelector('meta[name="description"]');

    document.title = ui.metaTitle || (candidateData.profile.name + " | AI Resume User V3");

    if (meta && description) {
      meta.setAttribute("content", description);
    }
  }

  function getInitialProjectId(candidateData) {
    var projectIds = candidateData.projects.map(function (project) { return project.id; });
    var projectId = null;
    try {
      var url = new URL(window.location.href);
      projectId = url.searchParams.get("project");
      if (!projectId && url.hash.indexOf("project-") === 1) {
        projectId = url.hash.replace("#project-", "");
      }
    } catch (e) {
      projectId = null;
    }
    return projectIds.indexOf(projectId) !== -1 ? projectId : null;
  }
})();
