/*
 * multi-user-slider.js — Shopify Editions-style user switching
 * Floating pill nav, clean GSAP crossfade, no SplitType dependency
 */
(function () {
  const ns = window.aiResume || (window.aiResume = {});
  let isTransitioning = false;
  let lastScrollY = 0;
  let pillHideTimer = null;

  function init() {
    const pill = document.getElementById('user-pill');
    const buttons = pill ? pill.querySelectorAll('.pill-btn') : [];
    if (!buttons.length) return;

    // Set initial user theme class
    const initialUser = window.resumeCandidateId || 'duke';
    const shortName = resolveShortName(initialUser);
    setBodyUserTheme(shortName, initialUser);

    // Set correct active pill button
    buttons.forEach(function (btn) {
      var isActive = btn.getAttribute('data-user') === shortName;
      btn.classList.toggle('active', isActive);
    });

    // Click handlers
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (isTransitioning) return;
        var targetUser = btn.getAttribute('data-user');
        if (btn.classList.contains('active')) return;

        pill.querySelector('.pill-btn.active').classList.remove('active');
        btn.classList.add('active');
        switchUser(targetUser);
      });
    });

    // Auto-hide pill on scroll down, show on scroll up
    setupPillAutoHide(pill);

    // Initial entrance animation for hero
    animateHeroEntrance();
  }

  function resolveShortName(id) {
    if (!id) return 'duke';
    var name = id.split('-')[0].toLowerCase();
    // Map arron -> aaron
    if (name === 'arron') name = 'aaron';
    return name;
  }

  function setBodyUserTheme(shortName, canonicalId) {
    Array.prototype.slice.call(document.body.classList).forEach(function (className) {
      if (className.indexOf('user-') === 0) {
        document.body.classList.remove(className);
      }
    });
    document.body.classList.add('user-' + shortName);
    if (canonicalId) {
      document.body.setAttribute('data-profile', canonicalId);
    }
  }

  function setupPillAutoHide(pill) {
    var ticking = false;

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(function () {
        var currentY = window.scrollY;
        var delta = currentY - lastScrollY;

        // Hide when scrolling down past 200px, show when scrolling up
        if (delta > 8 && currentY > 200) {
          pill.classList.add('hidden');
        } else if (delta < -8) {
          pill.classList.remove('hidden');
        }

        lastScrollY = currentY;
        ticking = false;
      });
    }, { passive: true });

    // Also show pill on mouse near bottom of viewport
    document.addEventListener('mousemove', function (e) {
      if (e.clientY > window.innerHeight - 100) {
        pill.classList.remove('hidden');
        clearTimeout(pillHideTimer);
        pillHideTimer = setTimeout(function () {
          if (window.scrollY > 200) {
            pill.classList.add('hidden');
          }
        }, 3000);
      }
    });
  }

  function switchUser(userId) {
    isTransitioning = true;
    var program = window.resumeProgram;
    if (!program) { isTransitioning = false; return; }

    var canonicalId = program.normalizeProfileId(userId);
    var data = program.profiles[canonicalId];
    if (!data) { isTransitioning = false; return; }

    window.dispatchEvent(new CustomEvent('ag:user-switch-start', {
      detail: { user: userId, profileId: canonicalId }
    }));

    if (!window.gsap) {
      try {
        renderSwitchedUser(userId, canonicalId, data);
        window.dispatchEvent(new CustomEvent('ag:user-switch', {
          detail: { user: userId, profileId: canonicalId }
        }));
      } finally {
        isTransitioning = false;
      }
      return;
    }

    // Phase 1: Fade out current content
    var tl = gsap.timeline();

    tl.to('.page-inner', {
      opacity: 0,
      y: 70,
      scale: 0.94,
      rotateX: -8,
      duration: 0.34,
      stagger: 0.035,
      ease: 'power4.in'
    });

    tl.add(function () {
      try {
        renderSwitchedUser(userId, canonicalId, data);
      } catch (error) {
        console.error('V7_AG user switch failed', error);
        document.querySelectorAll('.page-inner').forEach(function (el) {
          el.style.opacity = '1';
          el.style.transform = '';
          el.style.filter = '';
        });
        document.body.classList.remove('is-ag-switching');
        isTransitioning = false;
        tl.kill();
      }
    });

    // Phase 3: Fade in new content
    tl.fromTo('.page-inner',
      { opacity: 0, y: -54, scale: 1.06, rotateX: 8 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotateX: 0,
        duration: 0.72,
        stagger: 0.055,
        ease: 'expo.out'
      }
    );

    // Phase 4: Animate hero name entrance
    tl.add(function () {
      animateHeroEntrance();
      window.dispatchEvent(new CustomEvent('ag:user-switch', {
        detail: { user: userId, profileId: canonicalId }
      }));
      isTransitioning = false;
    });
  }

  function animateHeroEntrance() {
    var heroName = document.getElementById('hero-name');
    if (!heroName || !window.gsap) return;

    gsap.fromTo(heroName,
      { y: 34 },
      { y: 0, duration: 1.2, ease: 'power3.out' }
    );

    // Animate hero summary
    var summary = document.getElementById('hero-summary');
    if (summary) {
      gsap.fromTo(summary,
        { y: 20 },
        { y: 0, duration: 0.8, delay: 0.3, ease: 'power2.out' }
      );
    }

    // Animate hero contact
    var contact = document.getElementById('hero-contact');
    if (contact) {
      gsap.fromTo(contact,
        { y: 16 },
        { y: 0, duration: 0.6, delay: 0.5, ease: 'power2.out' }
      );
    }
  }

  function renderSwitchedUser(userId, canonicalId, data) {
    // Phase 2: Update data and DOM
    window.resumeContent = data;
    window.resumeCandidateId = canonicalId;
    window.resumeProfileId = canonicalId;
    var state = ns.state.create(data);
    window.aiResumeState = state;

    // Update body theme
    setBodyUserTheme(userId, canonicalId);
    applyDocumentMeta(data);

    // Scroll to top without browser-specific scroll behavior strings.
    window.scrollTo(0, 0);

    // Kill previous ScrollTriggers
    if (window.ScrollTrigger) {
      ScrollTrigger.getAll().forEach(function (st) { st.kill(); });
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

    // Re-render all sections
    if (ns.pages) {
      ns.pages.renderPage1(data);
      ns.pages.renderEducation(data);
      ns.pages.renderAwards(data);
      ns.pages.renderPublications(data);
      ns.pages.renderCoursework(data);
      ns.pages.renderProfileMaterials(data);
    }
    if (ns.skills) {
      ns.skills.renderSkillPanels(data, state, {
        onFilterChange: function () {
          state.activeProjectId = null;
          state.hoverProjectId = null;
          state.activeExpId = null;
          state.hoverExpId = null;
          state.showAllProjects = false;
          renderFilteredSections();
          ns.skills.updateHighlights(data, state);
          window.dispatchEvent(new CustomEvent('ag:content-rendered', {
            detail: { user: userId, profileId: canonicalId }
          }));
        }
      });
      if (ns.skills.syncToPage) ns.skills.syncToPage(1, { immediate: true });
    }
    renderFilteredSections();

    if (ns.pages.setupScrollAnimations) {
      ns.pages.setupScrollAnimations(state);
    }
    if (window.gsap) {
      window.gsap.set('.page-section .page-inner', { opacity: 1, y: 0, clearProps: 'transform' });
    }
    if (window.ScrollTrigger && window.ScrollTrigger.refresh) {
      window.ScrollTrigger.refresh(true);
    }

    if (window.change3DTheme) {
      window.change3DTheme(userId);
    }

    window.dispatchEvent(new CustomEvent('ag:content-rendered', {
      detail: { user: userId, profileId: canonicalId }
    }));
  }

  function applyDocumentMeta(data) {
    var ui = data.ui || {};
    var meta = document.querySelector('meta[name="description"]');
    document.title = ui.metaTitle || (data.profile.name + ' | AI Resume User V7_AG');
    if (meta && ui.metaDescription) {
      meta.setAttribute('content', ui.metaDescription);
    }
  }

  // Initialize after DOM load
  document.addEventListener('DOMContentLoaded', function () {
    setTimeout(init, 100);
  });
})();
