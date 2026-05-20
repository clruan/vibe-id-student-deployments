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
  var DEFAULT_ANALYST_TOOLKIT_COUNT = 8;
  var INTRO_PIN_TOP = 14;
  var INTRO_PIN_GAP = 18;
  var EXPERIENCE_COLLISION_GAP = 56;
  var TOOLKIT_MODAL_ID = "full-toolkit-modal";
  var toolkitHandlersBound = false;
  var lastToolkitTrigger = null;

  function getSkillRoot() {
    return document.getElementById("skill-panels");
  }

  function getIntroSkillRoot() {
    return document.getElementById("intro-skills");
  }

  function getContainer(group, slot) {
    return document.querySelector('[data-skill-group="' + group + '"][data-skill-slot="' + slot + '"]');
  }

  function getFocusedExperienceId(data, state) {
    var firstExp = data && data.experience && data.experience[0];
    return state.hoverExpId || state.activeExpId || (firstExp && (firstExp.id || "exp-0")) || null;
  }

  function getFocusedProjectId(state) {
    return state.hoverProjectId || state.activeProjectId || null;
  }

  function capabilityIcon(label) {
    var text = (label || "").toLowerCase();
    var icons = {
      company: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 20h16M7 20V7.2L14 4v16M14 9h3.5V20M9.5 10h1M9.5 13.5h1M9.5 17h1M16.5 12.5h1M16.5 16h1" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      statements: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 3.8h7l3 3V20a1.8 1.8 0 0 1-1.8 1.8H7A1.8 1.8 0 0 1 5.2 20V5.6A1.8 1.8 0 0 1 7 3.8Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M14 4v4h4M8.5 11h7M8.5 14.5h7M8.5 18h4.6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
      chart: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 18h14M7 15l3-3 2.2 1.8 4.8-6.3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 8h2.4M15.7 15h2.4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
      lbo: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 4v16M6 8h12M8 8l-3 7h6L8 8ZM16 8l-3 7h6l-3-7Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      benchmark: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="4" y="5" width="16" height="14" rx="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4 10h16M9 5v14M15 5v14M7 15h2M11 13h2M16 11h2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
      pitch: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="4" y="5" width="16" height="12" rx="2.4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 20h8M12 17v3M8 13l2.2-2.2 2.1 1.7 3.7-4.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      research: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="10.5" cy="10.5" r="4.6" fill="none" stroke="currentColor" stroke-width="2"/><path d="m14 14 4.3 4.3M8.4 10.7l1.4 1.4 3-3.2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      workflow: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="6" cy="7" r="2.2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="18" cy="7" r="2.2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="17" r="2.2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8.1 8.5 10.4 15M15.9 8.5 13.6 15M8.5 7h7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
      defaultIcon: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 19h14M7 16V9M12 16V5M17 16v-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
    };

    var icon = icons.defaultIcon;
    if (/ai|workflow|custom/.test(text)) icon = icons.workflow;
    else if (/source|research|evidence|quality|confidence|judgment|hypothesis/.test(text)) icon = icons.research;
    else if (/pitch|presentation|deck|communication/.test(text)) icon = icons.pitch;
    else if (/peer|benchmark|comparable|table/.test(text)) icon = icons.benchmark;
    else if (/lbo|leverage|debt|buyout/.test(text)) icon = icons.lbo;
    else if (/dcf|valuation|market|price|portfolio|capm|flow|model/.test(text)) icon = icons.chart;
    else if (/statement|filing|report|disclosure|review/.test(text)) icon = icons.statements;
    else if (/company|sector|industry|business/.test(text)) icon = icons.company;

    return '<span class="quant-icon">' + icon + "</span>";
  }

  function renderQuantTag(item, highlighted) {
    return '<span class="quant-tag ' + (highlighted ? "is-highlighted" : "") + '">' +
      capabilityIcon(item.label) +
      '<span class="quant-label">' + item.label + "</span>" +
    "</span>";
  }

  function renderSkillTag(label) {
    return renderQuantTag({ label: label }, true);
  }

  function renderKeywordChip(label) {
    return '<span class="analyst-keyword-chip">' + label + "</span>";
  }

  function renderToolDetailChip(label) {
    return '<span class="toolkit-detail-chip">' + label + "</span>";
  }

  function renderToolkitTrigger() {
    return [
      '<button class="toolkit-modal-trigger" type="button" data-toolkit-open aria-expanded="false" aria-controls="' + TOOLKIT_MODAL_ID + '">',
      "View Full Toolkit +",
      "</button>"
    ].join("");
  }

  function renderToolDetailBank(data) {
    if (!data.technicalSkillDetails || !data.technicalSkillDetails.length) {
      return "";
    }

    return '<div class="toolkit-detail-bank">' + renderToolkitTrigger() + "</div>";
  }

  function getAnalystKeywordGroups(data, defaultItems) {
    if (!data.analystKeywordGroups || !data.analystKeywordGroups.length) {
      return "";
    }

    var defaultLabels = defaultItems.reduce(function (labels, item) {
      labels[item.label] = true;
      return labels;
    }, {});

    return data.analystKeywordGroups
      .map(function (group) {
        var keywords = group.keywords.filter(function (label) {
          return !defaultLabels[label];
        });

        if (!keywords.length) return "";

        return [
          '<section class="analyst-keyword-group">',
          '<h4 class="analyst-keyword-label">' + group.title + "</h4>",
          '<div class="analyst-keyword-chip-row">',
          keywords.map(renderKeywordChip).join(""),
          "</div>",
          "</section>"
        ].join("");
      })
      .join("");
  }

  function renderAnalystKeywordBank(data) {
    if (!data.analystKeywordGroups || !data.analystKeywordGroups.length) {
      return "";
    }

    return '<div class="analyst-keyword-bank">' + renderToolkitTrigger() + "</div>";
  }

  function setToolkitTriggerState(expanded) {
    Array.from(document.querySelectorAll("[data-toolkit-open]")).forEach(function (trigger) {
      trigger.setAttribute("aria-expanded", expanded ? "true" : "false");
    });
  }

  function getToolkitModal() {
    return document.getElementById(TOOLKIT_MODAL_ID);
  }

  function openToolkitModal(trigger) {
    var modal = getToolkitModal();
    if (!modal) return;

    lastToolkitTrigger = trigger || document.activeElement;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("toolkit-modal-open");
    setToolkitTriggerState(true);

    var panel = modal.querySelector(".toolkit-modal-panel");
    if (panel) panel.focus();
  }

  function closeToolkitModal() {
    var modal = getToolkitModal();
    if (!modal) return;

    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("toolkit-modal-open");
    setToolkitTriggerState(false);

    if (lastToolkitTrigger && document.contains(lastToolkitTrigger)) {
      lastToolkitTrigger.focus();
    }

    lastToolkitTrigger = null;
  }

  function handleToolkitClick(event) {
    var openTrigger = event.target.closest("[data-toolkit-open]");
    if (openTrigger) {
      event.preventDefault();
      openToolkitModal(openTrigger);
      return;
    }

    if (event.target.closest("[data-toolkit-close]")) {
      event.preventDefault();
      closeToolkitModal();
    }
  }

  function handleToolkitKeydown(event) {
    if (event.key === "Escape" && getToolkitModal() && getToolkitModal().classList.contains("is-open")) {
      closeToolkitModal();
    }
  }

  function bindToolkitModalHandlers() {
    if (toolkitHandlersBound) return;

    document.addEventListener("click", handleToolkitClick);
    document.addEventListener("keydown", handleToolkitKeydown);
    toolkitHandlersBound = true;
  }

  function renderFullToolkitModal(data, defaultItems) {
    var analystGroups = getAnalystKeywordGroups(data, defaultItems);
    var technicalDetails = (data.technicalSkillDetails || []).map(renderToolDetailChip).join("");
    var modal = getToolkitModal();

    if (!analystGroups && !technicalDetails) {
      if (modal) modal.remove();
      return;
    }

    var modalMarkup = [
      '<div class="toolkit-modal" id="' + TOOLKIT_MODAL_ID + '" role="dialog" aria-modal="true" aria-labelledby="full-toolkit-title" aria-hidden="true">',
      '<button class="toolkit-modal-backdrop" type="button" aria-label="Close full toolkit" data-toolkit-close></button>',
      '<section class="toolkit-modal-panel" tabindex="-1">',
      '<div class="toolkit-modal-head">',
      '<div>',
      '<p class="eyebrow">Capabilities Map</p>',
      '<h3 id="full-toolkit-title">Full Investment Analysis Toolkit</h3>',
      "</div>",
      '<button class="toolkit-modal-close" type="button" aria-label="Close full toolkit" data-toolkit-close>&times;</button>',
      "</div>",
      '<p class="toolkit-modal-note">Expanded finance, research, modeling, presentation, and AI-workflow capabilities grouped for review.</p>',
      '<div class="toolkit-modal-body">',
      analystGroups ? '<div class="analyst-keyword-groups toolkit-modal-groups">' + analystGroups + "</div>" : "",
      technicalDetails ? [
        '<section class="toolkit-modal-section">',
        '<h4 class="analyst-keyword-label">Tools / Technical Workflow</h4>',
        '<div class="toolkit-detail-chip-row">',
        technicalDetails,
        "</div>",
        "</section>"
      ].join("") : "",
      "</div>",
      "</section>",
      "</div>"
    ].join("");

    if (modal) {
      modal.outerHTML = modalMarkup;
    } else {
      document.body.insertAdjacentHTML("beforeend", modalMarkup);
    }

    bindToolkitModalHandlers();
  }

  function findToolById(data, id) {
    var stackMatch = (data.stack || []).find(function (tech) {
      return tech.id === id;
    });

    if (stackMatch) return stackMatch;

    return (data.licensesCertifications || []).find(function (certification) {
      return certification.id === id;
    });
  }

  function resolveContextTool(data, tool) {
    if (typeof tool === "string") {
      var byId = findToolById(data, tool);
      return byId || { id: tool.toLowerCase().replace(/[^a-z0-9]+/g, "-"), label: tool, color: "#475569" };
    }

    var existing = tool.id ? findToolById(data, tool.id) : null;
    return Object.assign({ color: "#475569" }, existing || {}, tool);
  }

  function mapContextSkills(skills) {
    return (skills || []).slice(0, 8).map(function (label) {
      return { label: label };
    });
  }

  function renderIntroPanels(data) {
    var introQuant = getContainer("quant", "intro");
    var introStack = getContainer("stack", "intro");
    var introCertifications = getContainer("certifications", "intro");

    if (!introQuant || !introStack) return;

    var defaultQuantItems = data.quantToolkit.slice(0, DEFAULT_ANALYST_TOOLKIT_COUNT);

    introQuant.innerHTML = defaultQuantItems
      .map(function (item) {
        return renderQuantTag(item, false);
      })
      .join("") + renderAnalystKeywordBank(data);

    introStack.innerHTML = data.stack
      .filter(function (tech) { return !tech.projectOnly; })
      .map(function (tech) {
        return ns.icons.renderTechChip(tech, false);
      })
      .join("");

    if (introCertifications) {
      introCertifications.innerHTML = (data.licensesCertifications || [])
        .map(function (item) {
          return ns.icons.renderTechChip(item, false);
        })
        .join("");
    }

    renderFullToolkitModal(data, defaultQuantItems);
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

  function getExperienceSidebarBoundaryState() {
    var root = getSkillRoot();
    var intro = getIntroSkillRoot();
    var experienceSection = document.getElementById("page-2");

    if (!root || !intro || !experienceSection) {
      return { blocked: false, exiting: false };
    }

    var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    var viewportCenter = viewportHeight / 2;
    var experienceRect = experienceSection.getBoundingClientRect();
    var experienceOwnsViewportCenter =
      experienceRect.top <= viewportCenter &&
      experienceRect.bottom >= viewportCenter;

    if (!experienceOwnsViewportCenter) {
      return { blocked: false, exiting: false };
    }

    var rootRect = root.getBoundingClientRect();
    var introRect = intro.getBoundingClientRect();
    var verticalOverlap = introRect.bottom > rootRect.top + 4 && introRect.top < rootRect.bottom - 4;
    var horizontalOverlap = introRect.right > rootRect.left + 4 && introRect.left < rootRect.right - 4;
    var nearIntroBoundary = introRect.bottom > rootRect.top - 96 && introRect.top < rootRect.bottom - 4;

    return {
      blocked: verticalOverlap && horizontalOverlap,
      exiting: !verticalOverlap && horizontalOverlap && nearIntroBoundary
    };
  }

  function setSidebarVisibility(visible, options) {
    var root = getSkillRoot();
    if (!root) return;

    var boundaryBlocked = Boolean(visible && options && options.boundaryBlocked);
    var boundaryExiting = Boolean(visible && options && options.boundaryExiting);
    var shouldShow = visible && !boundaryBlocked;

    root.classList.add("is-ready");
    root.classList.toggle("is-boundary-blocked", boundaryBlocked);
    root.classList.toggle("is-boundary-exiting", boundaryExiting && shouldShow);
    root.classList.toggle("is-visible", shouldShow);
    root.classList.toggle("has-focus", shouldShow && !boundaryExiting);
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

    if (state.experienceSidebarVisible) {
      var expId = getFocusedExperienceId(data, state);
      if (!expId) return null;

      var exp = data.experience.find(function (item, index) {
        return (item.id || "exp-" + index) === expId;
      });

      if (!exp) return null;

      if (exp.contextualSkills && exp.contextualTools) {
        return {
          key: "exp:" + expId,
          quantItems: mapContextSkills(exp.contextualSkills),
          techItems: exp.contextualTools.slice(0, 5).map(function (tool) {
            return resolveContextTool(data, tool);
          })
        };
      }

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

    if ((introTransitionActive || introBurstInProgress) && !(state.experienceSidebarVisible && state.activeExpId)) {
      setSidebarVisibility(false);
      return;
    }

    var context = getSidebarContext(data, state);

    if (!context) {
      clearSidebarPanels();
      return;
    }

    var isExperienceContext = context.key.indexOf("exp:") === 0;
    var boundaryState = isExperienceContext ?
      getExperienceSidebarBoundaryState() :
      { blocked: false, exiting: false };
    var signature =
      context.key +
      "::" +
      context.quantItems.map(function (item) { return item.label; }).join("|") +
      "::" +
      context.techItems.map(function (item) { return item.id; }).join("|");

    if (signature === lastSidebarSignature && !(options && options.force)) {
      setSidebarVisibility(true, {
        boundaryBlocked: boundaryState.blocked,
        boundaryExiting: boundaryState.exiting
      });
      return;
    }

    sidebarQuant.innerHTML = context.quantItems
      .map(function (item) {
        return renderSkillTag(item.label);
      })
      .join("");

    sidebarStack.innerHTML = context.techItems
      .map(function (tech) {
        return ns.icons.renderTechChip(tech, true);
      })
      .join("");

    setPanelEmpty(sidebarQuant, context.quantItems.length === 0);
    setPanelEmpty(sidebarStack, context.techItems.length === 0);
    setSidebarVisibility(context.quantItems.length > 0 || context.techItems.length > 0, {
      boundaryBlocked: boundaryState.blocked,
      boundaryExiting: boundaryState.exiting
    });

    if (!boundaryState.blocked && !boundaryState.exiting) {
      animateSidebarEntry(
        Array.from(sidebarStack.children).concat(Array.from(sidebarQuant.children))
      );
    }

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
    Array.from(layer.querySelectorAll(".analyst-keyword-bank, .toolkit-detail-bank")).forEach(function (node) {
      node.remove();
    });
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
    if (introExperienceTrigger && introExperienceTrigger.kill) {
      introExperienceTrigger.kill();
      introExperienceTrigger = null;
    }
    clearHeldIntroLayer();
    introBurstInProgress = false;
    setIntroTransitionActive(false);
    setIntroGhosted(false);
    renderSidebarPanels(data, state, { force: true });
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

    if (page === 1) {
      currentState.experienceSidebarVisible = false;
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
