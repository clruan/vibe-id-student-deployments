(function () {
  const ns = window.aiResume || (window.aiResume = {});

  var currentData = null;
  var currentState = null;
  var lastSidebarSignature = "";
  var burstCleanupTimer = null;
  var heldIntroLayer = null;
  var introExperienceTrigger = null;
  var introTransitionActive = false;
  var introBurstInProgress = false;
  var INTRO_PIN_TOP = 14;
  var INTRO_PIN_GAP = 18;
  var EXPERIENCE_COLLISION_GAP = 56;

  function getSkillRoot() {
    return document.getElementById("skill-panels");
  }

  function getIntroSkillRoot() {
    return document.getElementById("intro-skills");
  }

  function getContainer(group, slot) {
    return document.querySelector('[data-skill-group="' + group + '"][data-skill-slot="' + slot + '"]');
  }

  function getFocusedExperienceId(state) {
    return state.hoverExpId || state.activeExpId || null;
  }

  function getFocusedProjectId(state) {
    return state.hoverProjectId || state.activeProjectId || null;
  }

  function renderQuantTag(item, highlighted) {
    return '<span class="quant-tag ' + (highlighted ? "is-highlighted" : "") + '">' + item.label + "</span>";
  }

  function renderIntroPanels(data) {
    var introQuant = getContainer("quant", "intro");
    var introStack = getContainer("stack", "intro");

    if (!introQuant || !introStack) return;

    introQuant.innerHTML = data.quantToolkit
      .map(function (item) {
        return renderQuantTag(item, false);
      })
      .join("");

    introStack.innerHTML = data.stack
      .map(function (tech) {
        return ns.icons.renderTechChip(tech, false);
      })
      .join("");
  }

  function clearSidebarPanels() {
    var sidebarQuant = getContainer("quant", "sidebar");
    var sidebarStack = getContainer("stack", "sidebar");

    if (sidebarQuant) sidebarQuant.innerHTML = "";
    if (sidebarStack) sidebarStack.innerHTML = "";

    setPanelEmpty(sidebarQuant, true);
    setPanelEmpty(sidebarStack, true);
    setSidebarVisibility(false);
    lastSidebarSignature = "";
  }

  function setPanelEmpty(container, isEmpty) {
    if (!container) return;
    var panel = container.closest(".skill-panel");
    if (panel) {
      panel.classList.toggle("is-empty", isEmpty);
    }
  }

  function setSidebarVisibility(visible) {
    var root = getSkillRoot();
    if (!root) return;

    root.classList.add("is-ready");
    root.classList.toggle("is-visible", visible);
    root.classList.toggle("has-focus", visible);
  }

  function setIntroGhosted(ghosted) {
    var intro = getIntroSkillRoot();
    if (!intro) return;

    intro.classList.toggle("is-transition-ghosted", ghosted);
  }

  function refreshSidebar(options) {
    if (!currentData || !currentState) return;
    renderSidebarPanels(currentData, currentState, options || { force: true });
  }

  function setIntroTransitionActive(active) {
    introTransitionActive = active;

    if (active) {
      setSidebarVisibility(false);
    } else {
      refreshSidebar({ force: true });
    }
  }

  function getSidebarContext(data, state) {
    var page = state.currentPage || 1;

    if (page === 2) {
      var expId = getFocusedExperienceId(state);
      if (!expId) return null;

      var exp = data.experience.find(function (item, index) {
        return (item.id || "exp-" + index) === expId;
      });

      return {
        key: "exp:" + expId,
        quantItems: data.quantToolkit.filter(function (item) {
          return item.relatedExp && item.relatedExp.indexOf(expId) !== -1;
        }),
        techItems: data.stack.filter(function (tech) {
          return exp && exp.relatedTech && exp.relatedTech.indexOf(tech.id) !== -1;
        })
      };
    }

    if (page === 3) {
      var projectId = getFocusedProjectId(state);
      if (!projectId) return null;

      var project = ns.state.getProjectById(data, projectId);

      return {
        key: "project:" + projectId,
        quantItems: data.quantToolkit.filter(function (item) {
          return item.relatedProjects && item.relatedProjects.indexOf(projectId) !== -1;
        }),
        techItems: data.stack.filter(function (tech) {
          return project && project.relatedTech && project.relatedTech.indexOf(tech.id) !== -1;
        })
      };
    }

    return null;
  }

  function animateSidebarEntry(nodes) {
    if (!nodes.length || typeof gsap === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    gsap.fromTo(
      nodes,
      { opacity: 0, x: -18, scale: 0.94 },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.34,
        ease: "power2.out",
        stagger: 0.03,
        clearProps: "opacity,transform"
      }
    );
  }

  function renderSidebarPanels(data, state, options) {
    var sidebarQuant = getContainer("quant", "sidebar");
    var sidebarStack = getContainer("stack", "sidebar");

    if (!sidebarQuant || !sidebarStack) return;

    if (introTransitionActive || introBurstInProgress) {
      setSidebarVisibility(false);
      return;
    }

    var context = getSidebarContext(data, state);

    if (!context) {
      clearSidebarPanels();
      return;
    }

    var signature =
      context.key +
      "::" +
      context.quantItems.map(function (item) { return item.label; }).join("|") +
      "::" +
      context.techItems.map(function (item) { return item.id; }).join("|");

    if (signature === lastSidebarSignature && !(options && options.force)) {
      setSidebarVisibility(true);
      return;
    }

    sidebarQuant.innerHTML = context.quantItems
      .map(function (item) {
        return renderQuantTag(item, true);
      })
      .join("");

    sidebarStack.innerHTML = context.techItems
      .map(function (tech) {
        return ns.icons.renderTechChip(tech, true);
      })
      .join("");

    setPanelEmpty(sidebarQuant, context.quantItems.length === 0);
    setPanelEmpty(sidebarStack, context.techItems.length === 0);
    setSidebarVisibility(context.quantItems.length > 0 || context.techItems.length > 0);

    animateSidebarEntry(
      Array.from(sidebarStack.children).concat(Array.from(sidebarQuant.children))
    );

    lastSidebarSignature = signature;
  }

  function clearBurstOverlay() {
    if (burstCleanupTimer) {
      window.clearTimeout(burstCleanupTimer);
      burstCleanupTimer = null;
    }
  }

  function clearHeldIntroLayer() {
    clearBurstOverlay();

    if (heldIntroLayer) {
      heldIntroLayer.remove();
      heldIntroLayer = null;
    }
  }

  function createHeldIntroLayer() {
    var intro = getIntroSkillRoot();
    if (!intro) return null;

    clearHeldIntroLayer();

    var rect = intro.getBoundingClientRect();
    var layer = intro.cloneNode(true);

    layer.removeAttribute("id");
    layer.classList.remove("is-transition-ghosted");
    layer.classList.add("intro-skills-hold-layer");
    layer.style.left = rect.left + "px";
    layer.style.top = INTRO_PIN_TOP + "px";
    layer.style.width = rect.width + "px";

    document.body.appendChild(layer);
    heldIntroLayer = layer;
    setIntroGhosted(true);
    setIntroTransitionActive(true);

    return layer;
  }

  function getBurstTargetRect() {
    var experienceSection = document.querySelector("#page-2 .exp-section");
    var heading = experienceSection ? experienceSection.querySelector("h2") : null;
    var firstExperience = experienceSection ? experienceSection.querySelector(".experience-item") : null;
    var sectionRect = experienceSection ? experienceSection.getBoundingClientRect() : null;

    if (!sectionRect) {
      return null;
    }

    if (!heading || !firstExperience) {
      return sectionRect;
    }

    var headingRect = heading.getBoundingClientRect();
    var firstRect = firstExperience.getBoundingClientRect();
    var targetTop = Math.max(headingRect.bottom + 8, firstRect.top - 44);
    var height = Math.max(18, firstRect.top - targetTop - 10);

    return {
      left: firstRect.left + Math.min(32, firstRect.width * 0.06),
      top: targetTop,
      width: Math.max(firstRect.width * 0.84, 220),
      height: height
    };
  }

  function playIntroToExperienceBurst() {
    if (typeof gsap === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      clearHeldIntroLayer();
      setIntroGhosted(true);
      setIntroTransitionActive(false);
      return false;
    }

    if (!heldIntroLayer) {
      createHeldIntroLayer();
    }

    if (!heldIntroLayer) {
      setIntroTransitionActive(false);
      return false;
    }

    var sourceNodes = Array.from(
      heldIntroLayer.querySelectorAll(".quant-tag, .tech-chip")
    );
    var headingNodes = Array.from(heldIntroLayer.querySelectorAll("h3"));
    var targetRect = getBurstTargetRect();

    if (!sourceNodes.length || !targetRect) {
      clearHeldIntroLayer();
      setIntroTransitionActive(false);
      return false;
    }

    introBurstInProgress = true;
    var longestDuration = 0;
    var columnCount = Math.min(7, Math.ceil(Math.sqrt(sourceNodes.length * 1.8)));
    var rowCount = Math.max(1, Math.ceil(sourceNodes.length / columnCount));

    if (headingNodes.length) {
      gsap.to(headingNodes, {
        opacity: 0,
        y: -8,
        duration: 0.18,
        ease: "power2.out"
      });
    }

    sourceNodes.forEach(function (node, index) {
      var rect = node.getBoundingClientRect();
      var columnIndex = index % columnCount;
      var rowIndex = Math.floor(index / columnCount);
      var endX = targetRect.left + targetRect.width * ((columnIndex + 0.5) / columnCount);
      var endY = targetRect.top + targetRect.height * ((rowIndex + 0.5) / rowCount);
      var duration = 0.82;
      var delay = index * 0.012;
      var destinationX = endX - rect.left;
      var destinationY = endY - rect.top;

      longestDuration = Math.max(longestDuration, duration + delay);

      gsap.to(node, {
        x: destinationX,
        y: destinationY,
        scale: 0.24,
        opacity: 0,
        rotation: 0,
        filter: "blur(8px)",
        duration: duration,
        delay: delay,
        ease: "power3.inOut"
      });
    });

    burstCleanupTimer = window.setTimeout(function () {
      clearHeldIntroLayer();
      introBurstInProgress = false;
      setIntroTransitionActive(false);
    }, Math.ceil((longestDuration + 0.08) * 1000));

    return true;
  }

  function getIntroPinEndOffset() {
    var intro = getIntroSkillRoot();
    if (!intro) return INTRO_PIN_TOP + INTRO_PIN_GAP;

    return INTRO_PIN_TOP + intro.offsetHeight + EXPERIENCE_COLLISION_GAP;
  }

  function getExperienceCollisionTarget() {
    return document.querySelector("#page-2 .page-2-inner") ||
      document.querySelector("#page-2 .exp-section");
  }

  function experienceIsNearHeldIntro() {
    var target = getExperienceCollisionTarget();
    var intro = heldIntroLayer || getIntroSkillRoot();

    if (!target || !intro) return false;

    return target.getBoundingClientRect().top <= INTRO_PIN_TOP + intro.offsetHeight + EXPERIENCE_COLLISION_GAP;
  }

  function setupIntroExperienceTransition() {
    var intro = getIntroSkillRoot();
    var experiencePanel = getExperienceCollisionTarget();

    if (!intro || !experiencePanel || introExperienceTrigger || typeof ScrollTrigger === "undefined") {
      return;
    }

    if (typeof gsap !== "undefined" && gsap.registerPlugin) {
      gsap.registerPlugin(ScrollTrigger);
    }

    introExperienceTrigger = ScrollTrigger.create({
      trigger: intro,
      start: function () {
        return "top top+=" + INTRO_PIN_TOP;
      },
      endTrigger: experiencePanel,
      end: function () {
        return "top top+=" + getIntroPinEndOffset();
      },
      invalidateOnRefresh: true,
      onEnter: function () {
        createHeldIntroLayer();
      },
      onUpdate: function (self) {
        if (self.direction > 0 && !introBurstInProgress && heldIntroLayer && (self.progress >= 0.985 || experienceIsNearHeldIntro())) {
          playIntroToExperienceBurst();
        }
      },
      onLeave: function () {
        if (!introBurstInProgress && heldIntroLayer) {
          playIntroToExperienceBurst();
        } else if (!heldIntroLayer) {
          setIntroGhosted(true);
        }
      },
      onEnterBack: function () {
        introBurstInProgress = false;
        createHeldIntroLayer();
      },
      onLeaveBack: function () {
        introBurstInProgress = false;
        clearHeldIntroLayer();
        setIntroGhosted(false);
        setIntroTransitionActive(false);
      }
    });
  }

  function renderSkillPanels(data, state) {
    currentData = data;
    currentState = state;
    renderIntroPanels(data);
    clearSidebarPanels();
    renderSidebarPanels(data, state, { force: true });
    setupIntroExperienceTransition();
  }

  function updateHighlights(data, state) {
    currentData = data;
    currentState = state;
    renderSidebarPanels(data, state);
  }

  function syncToPage(page, options) {
    if (!currentState || !currentData) return;

    currentState.currentPage = page;

    if (page === 1 && !introTransitionActive && !introBurstInProgress) {
      setIntroGhosted(false);
    }

    renderSidebarPanels(currentData, currentState, { force: true });
  }

  window.addEventListener("pagechange", function (e) {
    syncToPage(e.detail.page, { previousPage: e.detail.previousPage });
  });

  ns.skills = {
    renderSkillPanels: renderSkillPanels,
    updateHighlights: updateHighlights,
    syncToPage: syncToPage
  };
})();
