(function () {
  const ns = window.aiResume;
  const data = window.resumeContent;

  if (!data) {
    throw new Error("AI Resume V7 could not find an active profile. Check assets/data/profiles.js and the profile query string.");
  }

  const state = ns.state.create(data);
  window.aiResumeState = state;

  applyDocumentMeta(data);
  var candidateId = window.resumeCandidateId || data.id || "";
  document.body.setAttribute("data-profile", candidateId);

  // Apply initial user theme class for Shopify Editions-style visuals
  var shortName = candidateId.split("-")[0].toLowerCase();
  if (shortName === "arron") shortName = "aaron";
  document.body.classList.add("user-" + shortName);

  // Set 3D background to match user theme
  if (window.change3DTheme) {
    window.change3DTheme(shortName);
  }


  if (ns.modes && ns.modes.init) {
    ns.modes.init(state);
  }

  if (ns.shell && ns.shell.render) {
    ns.shell.render(data, state);
    ns.shell.syncMode(state);
  }

  var experienceCallbacks = {
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
  };

  var projectCallbacks = {
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
  };

  function renderFilteredSections() {
    if (ns.projects && ns.projects.renderProjectsAccordion) {
      ns.projects.renderProjectsAccordion(data, state, projectCallbacks);
    }
    if (ns.pages && ns.pages.renderExperience) {
      ns.pages.renderExperience(data, experienceCallbacks);
    }
  }

  /* ── Render all static sections ────────────── */
  ns.pages.renderPage1(data);

  /* ── Render skill filters before dependent lists ─ */
  ns.skills.renderSkillPanels(data, state, {
    onFilterChange: function () {
      state.activeProjectId = null;
      state.hoverProjectId = null;
      state.activeExpId = null;
      state.hoverExpId = null;
      state.showAllProjects = false;
      renderFilteredSections();
      ns.skills.updateHighlights(data, state);
    }
  });

  renderFilteredSections();
  ns.pages.renderEducation(data);
  ns.pages.renderAwards(data);
  ns.pages.renderPublications(data);
  ns.pages.renderCoursework(data);
  ns.pages.renderProfileMaterials(data);

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
  document.body.setAttribute("data-current-page", String(initialPage));
  document.querySelectorAll(".page-dot").forEach(function (dot) {
    dot.classList.toggle("active", Number(dot.dataset.target) === initialPage);
  });
  if (ns.skills.syncToPage) {
    ns.skills.syncToPage(initialPage, { immediate: true });
  }

  /* ── Setup GSAP scroll animations ──────────── */
  ns.pages.setupScrollAnimations(state);

  function applyDocumentMeta(candidateData) {
    var ui = candidateData.ui || {};
    var description = ui.metaDescription || "";
    var meta = document.querySelector('meta[name="description"]');

    document.title = ui.metaTitle || (candidateData.profile.name + " | AI Resume User V7");

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
