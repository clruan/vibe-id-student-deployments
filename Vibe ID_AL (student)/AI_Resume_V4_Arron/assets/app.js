(function () {
  const ns = window.aiResume;
  const data = window.resumeContent;
  const state = ns.state.create(data);

  if (ns.shell && ns.shell.render) {
    ns.shell.render(data, state);
  }

  /* ── Render all static sections ────────────── */
  ns.pages.renderPage1(data);
  ns.pages.renderExperience(data, {
    onExperienceFocus: function (expId) {
      state.activeExpId = expId;
      ns.skills.updateHighlights(data, state);
    },
    onExperienceVisibilityChange: function (visible, expId) {
      state.experienceSidebarVisible = visible;
      if (visible && expId) {
        state.activeExpId = expId;
      } else if (!visible) {
        state.activeExpId = null;
        state.hoverExpId = null;
      }
      ns.skills.updateHighlights(data, state);
    },
    onExperienceActivate: function (expId) {
      state.activeExpId = expId;
      state.experienceSidebarVisible = true;
      ns.skills.updateHighlights(data, state);
    },
    onExperienceDeactivate: function () {
      state.activeExpId = null;
      state.experienceSidebarVisible = false;
      ns.skills.updateHighlights(data, state);
    },
    onExperienceHover: function (expId) {
      state.hoverExpId = expId;
      state.experienceSidebarVisible = true;
      ns.skills.updateHighlights(data, state);
    },
    onExperienceLeave: function () {
      state.hoverExpId = null;
      ns.skills.updateHighlights(data, state);
    }
  });
  ns.pages.renderEducation(data);
  ns.pages.renderCoursework(data);

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
})();
