(function () {
  const ns = window.aiResume || (window.aiResume = {});

  var currentData = null;
  var currentState = null;
  var filterChangeCallback = null;
  var DEFAULT_VISIBLE_SKILLS = 10;

  function getIntroSkillRoot() {
    return document.getElementById("intro-skills");
  }

  function getContainer(group, slot) {
    return document.querySelector('[data-skill-group="' + group + '"][data-skill-slot="' + slot + '"]');
  }

  function getSkillLayout(data) {
    var layout = data.skillLayout || {};
    var primary = layout.primary || { group: "quant", title: "Quantitative Toolkit" };
    var secondary = Array.isArray(layout.secondary) && layout.secondary.length
      ? layout.secondary
      : [{ group: "stack", title: "Technical Stack" }];

    return {
      primary: primary,
      secondary: secondary,
      hideExperienceContext: Boolean(layout.hideExperienceContext)
    };
  }

  function getLayoutPanels(data) {
    var layout = getSkillLayout(data);
    return [Object.assign({ tier: "primary" }, layout.primary)]
      .concat(layout.secondary.map(function (panel) {
        return Object.assign({ tier: "secondary" }, panel);
      }));
  }

  function isTechPanel(group) {
    return group === "stack" || group === "certifications";
  }

  function normalizeToken(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function getMeaningfulTokens(value) {
    var stop = {
      a: true, an: true, and: true, are: true, as: true, at: true, by: true,
      for: true, from: true, in: true, into: true, of: true, on: true, or: true,
      the: true, to: true, with: true, using: true, profile: true, role: true,
      analyst: true, assistant: true, engineer: true, scientist: true
    };

    return normalizeToken(value).split("-").filter(function (token) {
      return token && token.length > 1 && !stop[token];
    });
  }

  function getAtsProfile(data) {
    return (data && (data.atsProfile || data.atsSignals)) || {};
  }

  function getJobSources(data) {
    var ats = getAtsProfile(data);
    var profile = (data && data.profile) || {};
    var directory = (data && data.directory) || {};
    var sources = [];

    [
      ats.targetRole,
      ats.jobTitle,
      ats.jdTitle,
      ats.jobDescription,
      ats.jdText,
      data && data.targetRole,
      profile.targetRole,
      directory.role,
      directory.summary
    ].forEach(function (value) {
      if (value) sources.push({ value: value, isKeyword: false });
    });

    if (Array.isArray(ats.targetKeywords)) {
      ats.targetKeywords.forEach(function (value) {
        if (value) sources.push({ value: value, isKeyword: true });
      });
    }

    if (Array.isArray(ats.keywordGroups)) {
      ats.keywordGroups.forEach(function (group) {
        (group.keywords || []).forEach(function (value) {
          if (value) sources.push({ value: value, isKeyword: true });
        });
      });
    }

    return sources;
  }

  function getJobTermModels(data) {
    var seen = {};
    return getJobSources(data).map(function (source) {
      var label = String(source.value || "").replace(/<[^>]*>/g, "").trim();
      var normalized = normalizeToken(label);
      if (!label || !normalized || seen[normalized]) return null;
      seen[normalized] = true;
      return {
        label: label,
        normalized: normalized,
        tokens: getMeaningfulTokens(label),
        isKeyword: source.isKeyword
      };
    }).filter(Boolean);
  }

  function scoreTextForJob(data, value) {
    var terms = getJobTermModels(data);
    if (!terms.length) return 0;

    var normalized = normalizeToken(value);
    var tokens = getMeaningfulTokens(value);
    var rawTokens = normalizeToken(value).split("-").filter(Boolean);
    if (!normalized || !rawTokens.length) return 0;

    var tokenSet = {};
    tokens.forEach(function (token) { tokenSet[token] = true; });
    var rawTokenSet = {};
    rawTokens.forEach(function (token) { rawTokenSet[token] = true; });

    return terms.reduce(function (score, term) {
      var weight = term.isKeyword ? 1 : 0.35;
      if (normalized === term.normalized) return score + 1000 * weight;

      if (term.normalized.length <= 2) {
        if (rawTokenSet[term.normalized]) score += 720 * weight;
        return score;
      }

      if (normalized.indexOf(term.normalized) !== -1 || term.normalized.indexOf(normalized) !== -1) {
        score += 720 * weight;
      }

      var overlap = term.tokens.filter(function (token) { return tokenSet[token]; }).length;
      if (overlap) {
        var coverage = overlap / Math.max(term.tokens.length, 1);
        score += (overlap * 90 + coverage * 180) * weight;
      }
      return score;
    }, 0);
  }

  function rankSkillEntriesForJob(data, entries) {
    if (!getJobTermModels(data).length) return entries;

    return entries.map(function (entry, index) {
      var text = [
        entry.label,
        entry.item && entry.item.id,
        entry.item && entry.item.label
      ].filter(Boolean).join(" ");
      return {
        entry: entry,
        index: index,
        score: scoreTextForJob(data, text)
      };
    }).sort(function (a, b) {
      if (b.score !== a.score) return b.score - a.score;
      return a.index - b.index;
    }).map(function (item) {
      return item.entry;
    });
  }

  function getJobKeywordMatches(data, value) {
    var normalized = normalizeToken(value);
    if (!normalized) return [];
    var rawTokenSet = {};
    normalized.split("-").filter(Boolean).forEach(function (token) {
      rawTokenSet[token] = true;
    });

    return getJobTermModels(data)
      .filter(function (term) {
        if (!term.isKeyword) return false;
        if (term.normalized.length <= 2) return rawTokenSet[term.normalized] || normalized === term.normalized;
        return normalized.indexOf(term.normalized) !== -1;
      })
      .sort(function (a, b) {
        return b.normalized.length - a.normalized.length;
      })
      .map(function (term) { return term.label; });
  }

  function itemKey(group, item) {
    return group + ":" + normalizeToken(item.id || item.label);
  }

  function ensureSkillPanels(data, slot) {
    var root = document.querySelector("#intro-skills .intro-skills-grid");
    if (!root || slot !== "intro") return;

    var signature = getLayoutPanels(data).map(function (panel) {
      return panel.tier + ":" + panel.group + ":" + panel.title;
    }).join("|");

    if (root.dataset.skillLayoutSignature === signature) return;

    root.innerHTML = getLayoutPanels(data).map(function (panel) {
      var className = "skill-panel skill-panel-" + panel.tier;
      var itemClass = "skill-token-list";
      return '<div class="' + className + '" data-skill-panel-group="' + panel.group + '">' +
        '<div class="skill-panel-title-row">' +
          '<h3>' + panel.title + '</h3>' +
          '<span class="skill-panel-count" data-skill-count="' + panel.group + '"></span>' +
        '</div>' +
        '<div class="' + itemClass + '" data-skill-group="' + panel.group + '" data-skill-slot="' + slot + '"></div>' +
        '<button class="skill-panel-expand" type="button" data-skill-expand="' + panel.group + '" hidden></button>' +
      '</div>';
    }).join("");

    root.dataset.skillLayoutSignature = signature;
  }

  function getGroupItems(data, group, includeProjectOnly) {
    if (group === "quant") return data.quantToolkit || [];
    if (group === "stack") {
      return (data.stack || []).filter(function (tech) {
        return includeProjectOnly || !tech.projectOnly;
      });
    }
    if (group === "certifications") return data.licensesCertifications || [];
    if (group === "analytical") return data.analyticalSkills || [];
    return [];
  }

  function getAllSkillItems(data) {
    var seen = {};
    var groups = ["quant", "analytical", "stack", "certifications"];
    var items = [];

    groups.forEach(function (group) {
      getGroupItems(data, group, true).forEach(function (item) {
        var key = itemKey(group, item);
        if (seen[key]) return;
        seen[key] = true;
        items.push({ key: key, group: group, item: item, label: item.label || item.id || key });
      });
    });

    return items;
  }

  function getIntroSkillItems(data, group) {
    var all = getAllSkillItems(data).filter(function (entry) { return entry.group === group; });
    var related = all.filter(function (entry) {
      return hasProjectRelation(data, entry) || hasExperienceRelation(data, entry);
    });
    return rankSkillEntriesForJob(data, related);
  }

  function hasProjectRelation(data, entry) {
    if (Array.isArray(entry.item.relatedProjects) && entry.item.relatedProjects.length) return true;
    if (entry.group !== "stack") return false;
    return (data.projects || []).some(function (project) {
      return Array.isArray(project.relatedTech) && project.relatedTech.indexOf(entry.item.id) !== -1;
    });
  }

  function hasExperienceRelation(data, entry) {
    if (Array.isArray(entry.item.relatedExp) && entry.item.relatedExp.length) return true;
    if (entry.group !== "stack") return false;
    return (data.experience || []).some(function (exp) {
      return Array.isArray(exp.relatedTech) && exp.relatedTech.indexOf(entry.item.id) !== -1;
    });
  }

  function getSelectedKeys(state) {
    return Array.isArray(state.selectedSkillIds) ? state.selectedSkillIds : [];
  }

  function isSelected(state, key) {
    return getSelectedKeys(state).indexOf(key) !== -1;
  }

  function toggleSelected(state, key) {
    var selected = getSelectedKeys(state).slice();
    var index = selected.indexOf(key);
    if (index === -1) selected.push(key);
    else selected.splice(index, 1);
    state.selectedSkillIds = selected;
  }

  function clearSelected(state) {
    state.selectedSkillIds = [];
  }

  function renderIntroPanels(data, state) {
    currentData = data;
    currentState = state;
    ensureSkillPanels(data, "intro");

    getLayoutPanels(data).forEach(function (panel) {
      var container = getContainer(panel.group, "intro");
      if (!container) return;

      var entries = getIntroSkillItems(data, panel.group);
      var limit = getVisibleSkillLimit(data, panel.group);
      var expanded = isSkillGroupExpanded(state, panel.group);
      var visibleEntries = expanded ? entries : entries.slice(0, limit);

      container.innerHTML = visibleEntries.map(function (entry) {
        return renderFilterButton(entry, isSelected(state, entry.key));
      }).join("");

      var panelNode = container.closest(".skill-panel");
      if (panelNode) {
        panelNode.classList.toggle("is-empty", entries.length === 0);
        var count = panelNode.querySelector("[data-skill-count]");
        var expand = panelNode.querySelector("[data-skill-expand]");
        if (count) count.textContent = entries.length ? visibleEntries.length + "/" + entries.length : "";
        if (expand) {
          expand.hidden = entries.length <= limit;
          expand.textContent = expanded ? "Show fewer" : "Show all " + entries.length;
          expand.setAttribute("aria-expanded", expanded ? "true" : "false");
        }
      }
    });

    renderFilterResults(data, state);
    bindIntroFilterEvents();
  }

  function renderFilterButton(entry, selected) {
    var item = entry.item;
    var color = item.color || "#4f46e5";

    return '<button class="skill-filter-chip ' + (selected ? "is-active" : "") + '" type="button" data-skill-filter="' + entry.key + '" aria-pressed="' + (selected ? "true" : "false") + '" style="--skill-color:' + color + '">' +
      renderSkillToken(entry, selected) +
    '</button>';
  }

  function renderFilterResults(data, state) {
    var root = document.getElementById("skill-filter-results");
    if (!root) return;

    var selected = getSelectedKeys(state);
    var projects = getFilteredProjects(data, state);
    var experiences = getFilteredExperience(data, state);
    document.querySelectorAll("[data-skill-clear]").forEach(function (clear) {
      clear.hidden = selected.length === 0;
    });
    syncGlobalClearButton(selected.length > 0);

    if (!selected.length) {
      root.innerHTML = '<div class="skill-filter-empty">' +
        '<strong>All projects and experiences are visible.</strong>' +
        '<span>Select skills above to narrow the portfolio, then jump directly to the matched cards.</span>' +
      '</div>';
      return;
    }

    root.innerHTML = '<div class="skill-filter-summary">' +
      '<div>' +
        '<strong>' + selected.length + ' skill' + (selected.length === 1 ? "" : "s") + ' selected</strong>' +
        '<span>' + projects.length + ' project' + (projects.length === 1 ? "" : "s") + ' and ' + experiences.length + ' experience' + (experiences.length === 1 ? "" : "s") + ' match at least one selected skill. The sections below are already filtered.</span>' +
      '</div>' +
      '<button class="skill-filter-clear skill-filter-clear-inline" type="button" data-skill-clear>Clear filters</button>' +
    '</div>';
  }

  function bindIntroFilterEvents() {
    var root = getIntroSkillRoot();
    if (!root) return;
    if (root.dataset.skillFilterEventsBound === "true") return;
    root.dataset.skillFilterEventsBound = "true";

    root.addEventListener("click", function (event) {
      var filterButton = event.target.closest("[data-skill-filter]");
      if (filterButton && root.contains(filterButton)) {
        toggleSelected(currentState, filterButton.dataset.skillFilter);
        renderIntroPanels(currentData, currentState);
        if (filterChangeCallback) filterChangeCallback();
        return;
      }

      var clearButton = event.target.closest("[data-skill-clear]");
      if (clearButton && root.contains(clearButton)) {
        event.preventDefault();
        event.stopPropagation();
        clearActiveFilters();
        return;
      }

      var expandButton = event.target.closest("[data-skill-expand]");
      if (expandButton && root.contains(expandButton)) {
        var group = expandButton.dataset.skillExpand;
        currentState.expandedSkillGroups = currentState.expandedSkillGroups || {};
        currentState.expandedSkillGroups[group] = !currentState.expandedSkillGroups[group];
        renderIntroPanels(currentData, currentState);
      }
    });

    if (document.documentElement.dataset.skillClearEventsBound !== "true") {
      document.documentElement.dataset.skillClearEventsBound = "true";
      document.addEventListener("click", function (event) {
        var clearButton = event.target.closest("[data-skill-clear]");
        if (!clearButton) return;
        var skillRoot = getIntroSkillRoot();
        if (skillRoot && skillRoot.contains(clearButton)) return;
        event.preventDefault();
        clearActiveFilters();
      });
    }
  }

  function clearActiveFilters() {
    var data = currentData || window.resumeContent;
    var state = currentState || window.aiResumeState;
    if (!data || !state) return;
    clearSelected(state);
    renderIntroPanels(data, state);
    if (filterChangeCallback) filterChangeCallback();
  }

  function syncGlobalClearButton(active) {
    var button = document.querySelector("[data-global-skill-clear]");
    if (!button) {
      button = document.createElement("button");
      button.type = "button";
      button.className = "filter-clear-floating";
      button.dataset.skillClear = "";
      button.dataset.globalSkillClear = "";
      button.textContent = "Clear filters";
      document.body.appendChild(button);
    }
    button.hidden = !active;
  }

  function getVisibleSkillLimit(data, group) {
    var limits = data.skillLayout && data.skillLayout.introLimits;
    if (limits && typeof limits[group] === "number") return Math.max(1, limits[group]);
    return DEFAULT_VISIBLE_SKILLS;
  }

  function isSkillGroupExpanded(state, group) {
    return Boolean(state.expandedSkillGroups && state.expandedSkillGroups[group]);
  }

  function getSelectedEntries(data, state) {
    var selected = getSelectedKeys(state);
    if (!selected.length) return [];
    var byKey = {};
    getAllSkillItems(data).forEach(function (entry) { byKey[entry.key] = entry; });
    return selected.map(function (key) { return byKey[key]; }).filter(Boolean);
  }

  function getProjectSkillItems(data, project) {
    var matches = getAllSkillItems(data).filter(function (entry) {
      return entryMatchesProject(entry, project);
    });
    return rankSkillEntriesForJob(data, matches);
  }

  function getExperienceSkillItems(data, exp, expId) {
    var matches = getAllSkillItems(data).filter(function (entry) {
      return entryMatchesExperience(data, entry, exp, expId);
    });
    return rankSkillEntriesForJob(data, matches);
  }

  function entryMatchesProject(entry, project) {
    if (!project) return false;
    if (Array.isArray(entry.item.relatedProjects) && entry.item.relatedProjects.indexOf(project.id) !== -1) return true;
    if (entry.group === "stack" && Array.isArray(project.relatedTech) && project.relatedTech.indexOf(entry.item.id) !== -1) return true;
    return false;
  }

  function entryMatchesExperience(data, entry, exp, expId) {
    if (!exp) return false;
    if (Array.isArray(entry.item.relatedExp) && entry.item.relatedExp.indexOf(expId) !== -1) return true;
    if (entry.group === "stack" && Array.isArray(exp.relatedTech) && exp.relatedTech.indexOf(entry.item.id) !== -1) return true;
    if (entry.group === "analytical" && Array.isArray(exp.contextualSkills)) {
      return exp.contextualSkills.some(function (label) {
        return normalizeToken(label) === normalizeToken(entry.label);
      });
    }
    return false;
  }

  function getFilteredProjects(data, state) {
    var selected = getSelectedEntries(data, state);
    if (!selected.length) return data.projects || [];
    return (data.projects || []).filter(function (project) {
      return selected.some(function (entry) {
        return entryMatchesProject(entry, project);
      });
    });
  }

  function getFilteredExperience(data, state) {
    var selected = getSelectedEntries(data, state);
    if (!selected.length) return data.experience || [];
    return (data.experience || []).filter(function (exp, index) {
      var expId = exp.id || "exp-" + index;
      return selected.some(function (entry) {
        return entryMatchesExperience(data, entry, exp, expId);
      });
    });
  }

  function renderSkillPills(items, options) {
    var limit = options && options.limit ? options.limit : 10;
    var selectedKeys = getActiveSelectedKeys(options);
    var uniqueItems = orderSkillItemsForFilter(uniqueByLabel(items || []), selectedKeys);
    var selectedVisibleCount = uniqueItems.filter(function (entry) {
      return selectedKeys.indexOf(entry.key) !== -1;
    }).length;
    var visibleLimit = selectedKeys.length ? Math.max(limit, selectedVisibleCount) : limit;
    var visible = uniqueItems.slice(0, visibleLimit);
    var hidden = uniqueItems.slice(visibleLimit);
    if (!visible.length) return "";

    var showOverflow = hidden.length && !(options && options.hideOverflow);

    return '<div class="project-skill-strip" aria-label="Related skills">' +
      visible.map(function (entry) {
        return renderSkillToken(entry, selectedKeys.indexOf(entry.key) !== -1, "project-skill-pill");
      }).join("") +
      (showOverflow ? hidden.map(function (entry) {
        return renderSkillToken(entry, selectedKeys.indexOf(entry.key) !== -1, "project-skill-pill project-skill-pill-extra");
      }).join("") : "") +
      (showOverflow ? '<button class="project-skill-pill project-skill-pill-more" type="button" data-skill-strip-expand data-skill-overflow-count="' + hidden.length + '" aria-expanded="false">+' + hidden.length + '</button>' : "") +
    '</div>';
  }

  function getActiveSelectedKeys(options) {
    if (options && Array.isArray(options.selectedKeys)) return options.selectedKeys;
    var state = (options && options.state) || currentState || window.aiResumeState || {};
    return getSelectedKeys(state);
  }

  function orderSkillItemsForFilter(items, selectedKeys) {
    if (!selectedKeys.length) return items;
    var selectedIndex = {};
    selectedKeys.forEach(function (key, index) {
      selectedIndex[key] = index;
    });

    return items.map(function (entry, index) {
      return { entry: entry, index: index };
    }).sort(function (a, b) {
      var aSelected = selectedIndex[a.entry.key];
      var bSelected = selectedIndex[b.entry.key];
      var aHas = typeof aSelected === "number";
      var bHas = typeof bSelected === "number";
      if (aHas && bHas) return aSelected - bSelected;
      if (aHas) return -1;
      if (bHas) return 1;
      return a.index - b.index;
    }).map(function (item) {
      return item.entry;
    });
  }

  document.addEventListener("click", function (event) {
    var button = event.target.closest("[data-skill-strip-expand]");
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();

    var strip = button.closest(".project-skill-strip");
    if (!strip) return;

    var expanded = !strip.classList.contains("is-expanded");
    strip.classList.toggle("is-expanded", expanded);
    button.setAttribute("aria-expanded", expanded ? "true" : "false");
    button.textContent = expanded ? "Show fewer" : "+" + button.dataset.skillOverflowCount;
  }, true);

  function renderSkillToken(entry, selected, extraClass) {
    var color = entry.item.color || "#4f46e5";
    var className = "skill-token" + (extraClass ? " " + extraClass : "") + (selected ? " is-highlighted" : "");
    var icon = entry.group === "stack" && ns.icons && ns.icons.renderTechIcon
      ? '<span class="skill-token-icon">' + ns.icons.renderTechIcon(entry.item.id, entry.label) + '</span>'
      : "";
    return '<span class="' + className + '" style="--skill-color:' + color + '">' + icon + '<span>' + entry.label + '</span></span>';
  }

  function uniqueByLabel(items) {
    var seen = {};
    return items.filter(function (entry) {
      var key = normalizeToken(entry.label);
      if (seen[key]) return false;
      seen[key] = true;
      return true;
    });
  }

  function renderSkillPanels(data, state, options) {
    currentData = data;
    currentState = state;
    filterChangeCallback = options && options.onFilterChange ? options.onFilterChange : null;
    renderIntroPanels(data, state);
  }

  function updateHighlights(data, state) {
    currentData = data;
    currentState = state;
    renderFilterResults(data, state);
  }

  function syncToPage(page) {
    if (!currentState) return;
    currentState.currentPage = page;
    document.body.setAttribute("data-current-page", String(page));
  }

  window.addEventListener("pagechange", function (e) {
    syncToPage(e.detail.page);
  });

  ns.skills = {
    renderSkillPanels: renderSkillPanels,
    updateHighlights: updateHighlights,
    syncToPage: syncToPage,
    getFilteredProjects: getFilteredProjects,
    getFilteredExperience: getFilteredExperience,
    getProjectSkillItems: getProjectSkillItems,
    getExperienceSkillItems: getExperienceSkillItems,
    renderSkillPills: renderSkillPills,
    scoreTextForJob: scoreTextForJob,
    getJobKeywordMatches: getJobKeywordMatches
  };
})();
