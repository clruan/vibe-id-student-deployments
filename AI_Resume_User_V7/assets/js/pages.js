(function () {
  const ns = window.aiResume || (window.aiResume = {});

  /* ── Page 1: Hero ──────────────────────────── */

  function renderPage1(data) {
    var ui = data.ui || {};

    renderHeroIdentity(data);
    document.getElementById("results-title").textContent = ui.resultsTitle || "Featured AI Projects";
    document.getElementById("experience-title").textContent = ui.experienceTitle || "Experience";
    document.getElementById("projects-title").textContent = ui.projectsTitle || "Selected AI Projects";
    document.getElementById("education-title").textContent = ui.educationTitle || "Education";
    document.getElementById("awards-title").textContent = ui.awardsTitle || "Awards";
    document.getElementById("publications-title").textContent = ui.publicationsTitle || "Publications";
    document.getElementById("coursework-title").textContent = ui.courseworkTitle || "Relevant Coursework & Applied Projects";
    document.getElementById("profile-materials-title").textContent = ui.profileMaterialsTitle || "Profile Materials";

    document.getElementById("hero-contact").innerHTML = buildContactMarkup(data);
    renderSelectedResults(data);
  }

  function renderSelectedResults(data) {
    var grid = document.getElementById("results-grid");
    if (!grid) return;

    var projects = getSelectedResultProjects(data);
    grid.innerHTML = projects.map(function (project) {
      var proof = renderResultEndorsementBadge(project, "proof");
      return '<article class="result-project-card" style="--project-accent:' + (project.accent || "#4f46e5") + '">' +
        '<div class="result-project-top">' +
          '<div class="result-project-skill-wrap">' + renderProjectSkillStrip(data, project, 6, { hideOverflow: true }) + '</div>' +
          proof +
        '</div>' +
        '<div class="result-project-main">' +
          '<h3>' + (project.navTitle || project.title) + '</h3>' +
          '<p class="result-project-meta">' + (project.navMeta || project.source || "Project") + '</p>' +
          '<p class="result-project-summary">' + summarizeText(project.summary || project.algorithmSummary || "", 180) + '</p>' +
        '</div>' +
        '<div class="result-project-footer">' +
          '<button class="result-demo-button" type="button" data-result-project="' + project.id + '">Check demo</button>' +
        '</div>' +
      '</article>';
    }).join("");

    grid.querySelectorAll("[data-result-project]").forEach(function (button) {
      button.addEventListener("click", function () {
        openProjectFromResult(button.dataset.resultProject);
      });
    });
  }

  function renderResultEndorsementBadge(project, placement) {
    var endorsement = project && project.endorsement;
    if (!endorsement) return "";

    var source = endorsement.company || endorsement.institution || endorsement.organization || endorsement.role || "Expert";
    var person = endorsement.by || endorsement.name || "";
    var isProof = placement === "proof";
    var className = "result-endorsement-badge" + (placement === "proof" ? " result-endorsement-proof" : "");
    var copy = isProof
      ? '<strong>Expert endorsement</strong>' +
        '<span class="result-endorsement-person">' + escapeHtml(stripTags(person || source)) + '</span>' +
        (person && source ? '<span class="result-endorsement-source">' + escapeHtml(compactEndorsementSource(source)) + '</span>' : "")
      : '<strong>Expert endorsement</strong>' +
        '<span>' + escapeHtml(stripTags(person ? person + " · " + source : source)) + '</span>';

    return '<div class="' + className + '" aria-label="Expert endorsement">' +
      renderResultEndorsementLogo(endorsement) +
      '<span class="result-endorsement-badge-copy">' +
        copy +
      '</span>' +
    '</div>';
  }

  function compactEndorsementSource(value) {
    return stripTags(value)
      .replace(/\bCapital Management\b/g, "Capital Mgmt")
      .replace(/\bGuideStone Capital Mgmt\b/g, "GuideStone CM")
      .replace(/\bManagement\b/g, "Mgmt")
      .replace(/\bUniversity\b/g, "Univ.")
      .replace(/\bMinnesota\b/g, "MN")
      .trim();
  }

  function renderResultEndorsementLogo(endorsement) {
    if (endorsement.logoSrc) {
      return '<span class="result-endorsement-logo">' +
        '<img src="' + endorsement.logoSrc + '" alt="' + (resultEndorsementLogoAlt(endorsement)) + '" loading="lazy" onerror="this.remove();this.parentElement.classList.add(\'is-placeholder\');">' +
        '<span class="result-endorsement-logo-fallback">' + resultEndorsementLogoText(endorsement) + '</span>' +
      '</span>';
    }

    return '<span class="result-endorsement-logo is-placeholder" aria-hidden="true">' +
      '<span class="result-endorsement-logo-fallback">' + resultEndorsementLogoText(endorsement) + '</span>' +
    '</span>';
  }

  function resultEndorsementLogoAlt(endorsement) {
    return stripTags(endorsement.logoAlt || endorsement.company || endorsement.institution || endorsement.organization || "Company logo");
  }

  function resultEndorsementLogoText(endorsement) {
    var source = endorsement.logoText || endorsement.company || endorsement.institution || endorsement.organization || endorsement.by || "Expert";
    var words = stripTags(source).split(/\s+/).filter(Boolean);
    if (!words.length) return "EX";
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  }

  function getSelectedResultProjects(data) {
    var projects = data.projects || [];
    var seen = {};
    var ordered = projects.filter(function (project) {
      return project.endorsement;
    }).concat(projects).filter(function (project) {
      if (!project || seen[project.id]) return false;
      seen[project.id] = true;
      return true;
    });
    return ordered.slice(0, 2);
  }

  function renderProjectSkillStrip(data, project, limit, options) {
    if (!ns.skills || !ns.skills.getProjectSkillItems || !ns.skills.renderSkillPills) return "";
    return ns.skills.renderSkillPills(
      ns.skills.getProjectSkillItems(data, project),
      Object.assign({ limit: limit || 5 }, options || {})
    );
  }

  function summarizeText(value, maxLength) {
    var text = stripTags(value).replace(/\s+/g, " ").trim();
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 1).replace(/\s+\S*$/, "") + "...";
  }

  function openProjectFromResult(projectId) {
    var item = document.querySelector('.project-accordion-item[data-project-id="' + projectId + '"]');
    if (!item) {
      var page = document.getElementById("page-2");
      if (page) page.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    var header = item.querySelector(".project-accordion-header");
    if (header && !item.classList.contains("is-expanded")) header.click();
    settleScrollToProject(item);
  }

  function settleScrollToProject(item) {
    if (!item) return;
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        item.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  function renderHeroIdentity(data) {
    var p = data.profile || {};
    var identity = document.querySelector(".hero-identity");
    var role = p.targetRole || data.targetRole || (data.directory && data.directory.role) || "";
    var summary = p.summaryHtml || p.summary || "";
    var initials = getInitials(p.shortName || p.name || "");
    var photo = getProfilePhoto(data);

    if (!identity) {
      document.getElementById("hero-name").textContent = p.name || "";
      document.getElementById("hero-summary").innerHTML = summary;
      attachHeroSummaryToggle(document.getElementById("hero-summary"));
      document.getElementById("hero-contact").innerHTML = buildContactMarkup(data);
      return;
    }

    identity.innerHTML = '<article class="linkedin-profile-card">' +
      '<div class="linkedin-cover" aria-hidden="true">' +
        '<span>Vibe ID</span>' +
      '</div>' +
      '<div class="linkedin-profile-body">' +
        '<div class="linkedin-avatar-row">' +
          '<div class="linkedin-avatar" aria-hidden="true">' +
            (photo ? '<img src="' + photo + '" alt="" onerror="this.remove(); this.parentElement.classList.remove(\'has-photo\');">' : "") +
            '<span>' + initials + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="hero-text">' +
          '<div class="hero-title-row">' +
            '<h1 id="hero-name">' + (p.name || "") + '</h1>' +
          '</div>' +
          (role ? '<p class="hero-headline">' + role + '</p>' : "") +
          '<p class="hero-summary" id="hero-summary">' + summary + '</p>' +
          '<div class="hero-contact" id="hero-contact">' + buildContactMarkup(data) + '</div>' +
        '</div>' +
      '</div>' +
    '</article>';

    attachHeroSummaryToggle(document.getElementById("hero-summary"));
  }

  function attachHeroSummaryToggle(summaryEl) {
    if (!summaryEl || summaryEl.dataset.toggleBound === "1") return;

    function evaluate() {
      summaryEl.classList.remove("is-expanded");
      var truncated = summaryEl.scrollHeight - summaryEl.clientHeight > 1;
      var existingToggle = summaryEl.parentElement && summaryEl.parentElement.querySelector(".hero-summary-toggle");

      if (!truncated) {
        if (existingToggle) existingToggle.remove();
        return;
      }

      if (existingToggle) return;

      var toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "hero-summary-toggle";
      toggle.setAttribute("aria-expanded", "false");
      toggle.textContent = "Read more";
      toggle.addEventListener("click", function () {
        var expanded = summaryEl.classList.toggle("is-expanded");
        toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
        toggle.textContent = expanded ? "Show less" : "Read more";
      });
      summaryEl.insertAdjacentElement("afterend", toggle);
    }

    summaryEl.dataset.toggleBound = "1";
    evaluate();
    window.addEventListener("resize", function () { window.requestAnimationFrame(evaluate); });
  }

  function getInitials(name) {
    var parts = String(name || "").replace(/\([^)]*\)/g, " ").trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return "AI";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  function getProfilePhoto(data) {
    var p = data.profile || {};
    if (p.photo || p.image || p.headshot) return p.photo || p.image || p.headshot;
    if (data.id === "aaron-li") return "../AI_Resume_User_V6_Aaron/User_data/Aaron Li/1775700440236.jpg";
    return "";
  }

  function buildContactMarkup(data) {
    var p = data.profile || {};
    var items = [];

    if (p.location) {
      items.push('<span>' + p.location + '</span>');
    }

    if (p.phone) {
      items.push('<span>' + p.phone + '</span>');
    }

    if (Array.isArray(data.links) && data.links.length) {
      data.links.forEach(function (link) {
        if (!link || !link.href || !link.value) return;
        items.push('<a href="' + link.href + '" target="_blank" rel="noreferrer">' + link.value + '</a>');
      });
      return items.join("");
    }

    if (p.email) {
      items.push('<a href="mailto:' + p.email + '">' + p.email + '</a>');
    }

    if (p.website) {
      items.push('<a href="' + p.website + '" target="_blank" rel="noreferrer">Website</a>');
    }

    if (p.github) {
      items.push('<a href="' + p.github + '" target="_blank" rel="noreferrer">GitHub</a>');
    }

    if (p.linkedin) {
      items.push('<a href="' + p.linkedin + '" target="_blank" rel="noreferrer">LinkedIn</a>');
    }

    if (p.scholar) {
      items.push('<a href="' + p.scholar + '" target="_blank" rel="noreferrer">Google Scholar</a>');
    }

    return items.join("");
  }

  /* ── Page 3: Experience ────────────────────── */

  function renderExperience(data, callbacks) {
    var container = document.getElementById("experience-list");
    var experiences = ns.skills && ns.skills.getFilteredExperience
      ? ns.skills.getFilteredExperience(data, window.aiResumeState || {})
      : data.experience;

    if (!experiences.length) {
      container.innerHTML = '<div class="filter-empty-state">' +
        '<h3>No experiences match the selected skills.</h3>' +
        '<p>Clear one filter or choose a broader skill combination.</p>' +
      '</div>';
      return;
    }

    container.innerHTML = experiences
      .map(function (item, index) {
        var expId = item.id || getExperienceId(data, item, index);
        var endorsement = ns.modes && ns.modes.renderVipEndorsement
          ? ns.modes.renderVipEndorsement(item.endorsement, {
              eyebrow: "Endorsement",
              variant: "experience"
            })
          : "";
        var relatedProjects = renderExperienceProjects(data, item);
        return '<article class="experience-item" data-exp-id="' + expId + '">' +
          '<div class="experience-head">' +
            '<div class="experience-title-row">' +
              renderOrgLogo(item.organization, item.location) +
              '<div>' +
                '<h3>' + item.role + '</h3>' +
                '<p class="experience-org">' + item.organization + (item.location ? " \u00b7 " + item.location : "") + '</p>' +
              '</div>' +
            '</div>' +
            '<p class="experience-dates">' + item.dates + '</p>' +
          '</div>' +
          renderExperiencePreview(item) +
          renderExperienceKeywordRail(data, item, expId) +
          renderExperienceDrawer(data, item, expId) +
          renderExperienceSkillStrip(data, item, expId) +
          renderExperienceContext(data, item) +
          relatedProjects +
          endorsement +
        '</article>';
      })
      .join("");

    function animateExperienceState(item, mode) {
      if (typeof gsap === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      if (mode === "hover") {
        gsap.to(item, {
          y: -5,
          scale: 1.006,
          duration: 0.42,
          ease: "power3.out"
        });
        return;
      }

      if (mode === "active") {
        gsap.to(item, {
          y: -4,
          scale: 1.01,
          duration: 0.58,
          ease: "back.out(1.3)"
        });
        return;
      }

      gsap.to(item, {
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: "expo.out"
      });
    }

    // Bind interaction events
    container.querySelectorAll(".experience-item").forEach(function(item) {
      item.addEventListener("mouseenter", function() {
        if (!item.classList.contains("is-active")) {
          animateExperienceState(item, "hover");
        }
        if (callbacks && callbacks.onExperienceHover) callbacks.onExperienceHover(item.dataset.expId);
      });
      item.addEventListener("mouseleave", function() {
        if (!item.classList.contains("is-active")) {
          animateExperienceState(item, "rest");
        }
        if (callbacks && callbacks.onExperienceLeave) callbacks.onExperienceLeave();
      });
      item.addEventListener("click", function() {
        var expId = item.dataset.expId;
        var isActive = item.classList.contains("is-active");

        container.querySelectorAll(".experience-item").forEach(function(el) {
          el.classList.remove("is-active");
          if (el !== item) {
            animateExperienceState(el, "rest");
          }
        });

        if (!isActive) {
          item.classList.add("is-active");
          animateExperienceState(item, "active");
          if (callbacks && callbacks.onExperienceActivate) callbacks.onExperienceActivate(expId);
        } else {
          animateExperienceState(item, "rest");
          if (callbacks && callbacks.onExperienceDeactivate) callbacks.onExperienceDeactivate();
        }
      });
    });

    container.querySelectorAll(".experience-detail-drawer").forEach(function (drawer) {
      drawer.addEventListener("click", function (event) {
        event.stopPropagation();
      });

      var summary = drawer.querySelector("summary");
      var item = drawer.closest(".experience-item");
      if (!summary || !item) return;

      summary.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        toggleExperienceDrawer(item, drawer);
      });
    });
  }

  function getExperienceId(data, item, fallbackIndex) {
    var index = (data.experience || []).indexOf(item);
    return "exp-" + (index === -1 ? fallbackIndex : index);
  }

  function renderOrgLogo(name, meta) {
    if (ns.icons && ns.icons.renderOrgLogo) {
      return ns.icons.renderOrgLogo(name, meta);
    }
    return '<span class="org-logo is-placeholder"><span>' + getInitials(name || "Organization") + '</span></span>';
  }

  function renderExperiencePreview(item) {
    var first = Array.isArray(item.bullets) && item.bullets.length ? item.bullets[0] : "";
    if (!first) return "";
    return '<ul class="experience-preview-list">' +
      '<li>' + first + '</li>' +
    '</ul>';
  }

  function renderExperienceKeywordRail(data, item, expId) {
    var bullets = getHiddenBulletModels(data, item);
    if (!bullets.length) return "";

    return '<div class="experience-keyword-rail" aria-label="Hidden bullet keywords">' +
      bullets.map(function (bullet, index) {
        return '<span class="exp-keyword-token" data-exp-keyword="' + expId + '" data-keyword-index="' + index + '">' + bullet.keyword + '</span>';
      }).join("") +
    '</div>';
  }

  function renderExperienceDrawer(data, item, expId) {
    var bullets = getHiddenBulletModels(data, item);
    if (!bullets.length) return "";

    return '<details class="experience-detail-drawer" data-exp-drawer="' + expId + '">' +
      '<summary>Read more</summary>' +
      '<ul class="compact-list experience-extra-list">' +
        bullets.map(function (bullet, index) {
          return '<li>' + renderExpandedBulletText(bullet, expId, index) + '</li>';
        }).join("") +
      '</ul>' +
    '</details>';
  }

  function getHiddenBulletModels(data, item) {
    var bullets = Array.isArray(item.bullets) ? item.bullets.slice(1) : [];
    return bullets.map(function (bullet, index) {
      var model = extractBulletKeyword(data, bullet, index);
      return {
        text: stripTags(bullet),
        keyword: model.keyword,
        matchText: model.matchText,
        index: index,
        score: ns.skills && ns.skills.scoreTextForJob
          ? ns.skills.scoreTextForJob(data, model.keyword + " " + stripTags(bullet))
          : 0
      };
    }).sort(function (a, b) {
      if (b.score !== a.score) return b.score - a.score;
      return a.index - b.index;
    });
  }

  function extractBulletKeyword(data, value, fallbackIndex) {
    var html = String(value || "");
    var plain = stripTags(html);
    var matches = ns.skills && ns.skills.getJobKeywordMatches
      ? ns.skills.getJobKeywordMatches(data, html)
      : [];
    var adjacentMatches = findAdjacentKeywordMatch(plain, matches);
    if (adjacentMatches) return adjacentMatches;

    for (var i = 0; i < matches.length; i += 1) {
      var match = findTextMatch(plain, matches[i]);
      if (match) {
        return {
          keyword: polishKeywordLabel(matches[i]),
          matchText: plain.slice(match.start, match.end)
        };
      }
    }

    var strongMatch = html.match(/<strong[^>]*>(.*?)<\/strong>/i);
    var preferred = strongMatch ? stripTags(strongMatch[1]) : "";
    var text = stripTags(preferred || html);
    var stop = {
      and: true, the: true, for: true, with: true, from: true, into: true,
      using: true, across: true, through: true, that: true, this: true,
      developed: true, built: true, created: true, conducted: true, performed: true,
      implemented: true, designed: true, analyzed: true, supported: true
    };

    var words = text.split(/[^A-Za-z0-9+.-]+/).filter(function (word) {
      return word && word.length > 2 && !stop[word.toLowerCase()];
    });

    if (!words.length) {
      return {
        keyword: "Signal" + (fallbackIndex + 1),
        matchText: ""
      };
    }
    words.sort(function (a, b) {
      return b.length - a.length;
    });
    return {
      keyword: polishKeywordLabel(words[0]),
      matchText: words[0]
    };
  }

  function findAdjacentKeywordMatch(text, matches) {
    if (!matches || matches.length < 2) return null;

    var top = matches.slice(0, 2);
    var label = top.map(polishKeywordLabel).join(" + ");
    var match = findTextMatch(text, label);
    if (!match) return null;

    return {
      keyword: label,
      matchText: text.slice(match.start, match.end)
    };
  }

  function renderExpandedBulletText(bullet, expId, index) {
    var text = bullet.text || "";
    var match = findTextMatch(text, bullet.matchText || bullet.keyword);
    var token = '<span class="experience-expanded-keyword" data-expanded-keyword="' + expId + '" data-keyword-index="' + index + '">' + bullet.keyword + '</span>';

    if (!match) {
      return token + ' <span>' + escapeHtml(text) + '</span>';
    }

    return '<span>' + escapeHtml(text.slice(0, match.start)) + '</span>' +
      token +
      '<span>' + escapeHtml(text.slice(match.end)) + '</span>';
  }

  function findTextMatch(text, query) {
    var source = String(text || "");
    var needle = String(query || "").trim();
    if (!source || !needle) return null;

    if (normalizeKeywordComparable(needle).length <= 2) {
      return findShortTokenMatch(source, needle);
    }

    var direct = source.toLowerCase().indexOf(needle.toLowerCase());
    if (direct !== -1) return { start: direct, end: direct + needle.length };

    return findNormalizedTextMatch(source, needle);
  }

  function findShortTokenMatch(text, query) {
    var normalized = normalizeKeywordComparable(query);
    if (!normalized) return null;

    var pattern = new RegExp("(^|[^A-Za-z0-9])(" + escapeRegex(query) + ")(?=$|[^A-Za-z0-9])", "i");
    var match = pattern.exec(text);
    if (!match) return null;

    var start = match.index + match[1].length;
    return { start: start, end: start + match[2].length };
  }

  function findNormalizedTextMatch(text, query) {
    var source = buildComparableIndex(text);
    var needle = normalizeKeywordComparable(query);
    if (!needle) return null;

    var start = source.normalized.indexOf(needle);
    if (start === -1) return null;

    var end = start + needle.length - 1;
    return {
      start: source.map[start],
      end: source.map[end] + 1
    };
  }

  function buildComparableIndex(text) {
    var normalized = "";
    var map = [];
    String(text || "").split("").forEach(function (char, index) {
      if (!/[A-Za-z0-9]/.test(char)) return;
      normalized += char.toLowerCase();
      map.push(index);
    });
    return { normalized: normalized, map: map };
  }

  function normalizeKeywordComparable(value) {
    return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
  }

  function escapeRegex(value) {
    return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function polishKeywordLabel(value) {
    var text = String(value || "")
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    var acronym = {
      ai: true, ats: true, auc: true, cnn: true, cox: true, dcf: true,
      ehr: true, etl: true, gee: true, git: true, html: true, iou: true,
      jd: true, kg: true, lbo: true, llm: true, mna: true, nd2: true,
      nlp: true, png: true, pr: true, qc: true, rag: true, redcap: true,
      roc: true, sas: true, sql: true, ui: true, unet: true, ux: true,
      vte: true
    };

    text = text.split(" ").map(function (word) {
      var lower = word.toLowerCase();
      if (acronym[lower]) return word.toUpperCase();
      if (/^[A-Z0-9.+/]+$/.test(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(" ");

    text = text
      .replace(/\bKaplan Meier\b/g, "Kaplan-Meier")
      .replace(/\bMed SAM\b/g, "Med-SAM")
      .replace(/\bDeepLabv3\b/g, "DeepLabV3")
      .replace(/\bQ Learning\b/g, "Q-learning");

    return text.length > 28 ? text.slice(0, 27).replace(/\s+\S*$/, "") + "..." : text;
  }

  function toggleExperienceDrawer(item, drawer) {
    var opening = !drawer.open;
    if (!window.gsap || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      drawer.open = opening;
      item.classList.toggle("is-detail-open", opening);
      return;
    }

    animateExperienceKeywords(item, drawer, opening);
  }

  function animateExperienceKeywords(item, drawer, opening) {
    var sourceTokens = Array.prototype.slice.call(item.querySelectorAll(".exp-keyword-token"));
    var targetTokens = Array.prototype.slice.call(drawer.querySelectorAll(".experience-expanded-keyword"));

    if (!sourceTokens.length || !targetTokens.length) {
      drawer.open = opening;
      item.classList.toggle("is-detail-open", opening);
      return;
    }

    var fromTokens;
    var toTokens;

    if (opening) {
      fromTokens = sourceTokens;
      drawer.open = true;
      item.classList.add("is-detail-open");
      toTokens = targetTokens;
    } else {
      fromTokens = targetTokens;
      toTokens = sourceTokens;
    }

    requestAnimationFrame(function () {
      var flights = [];
      fromTokens.forEach(function (fromToken, index) {
        var toToken = toTokens[index];
        if (!toToken) return;

        var fromRect = fromToken.getBoundingClientRect();
        var toRect = toToken.getBoundingClientRect();
        var clone = fromToken.cloneNode(true);
        clone.className = "experience-keyword-flight " + (clone.className || "");
        clone.style.position = "fixed";
        clone.style.left = fromRect.left + "px";
        clone.style.top = fromRect.top + "px";
        clone.style.width = fromRect.width + "px";
        clone.style.height = fromRect.height + "px";
        clone.style.zIndex = "10030";
        clone.style.pointerEvents = "none";
        document.body.appendChild(clone);
        flights.push({ clone: clone, rect: toRect });
      });

      sourceTokens.concat(targetTokens).forEach(function (token) {
        token.style.visibility = "hidden";
      });

      var remaining = flights.length;
      if (!remaining) {
        finishExperienceKeywordAnimation();
        return;
      }

      flights.forEach(function (flight, index) {
        window.gsap.to(flight.clone, Object.assign(buildKeywordMotion(opening, index, flight.rect), {
          onComplete: function () {
            flight.clone.remove();
            remaining -= 1;
            if (!remaining) {
              finishExperienceKeywordAnimation();
            }
          }
        }));
      });

      function finishExperienceKeywordAnimation() {
        sourceTokens.concat(targetTokens).forEach(function (token) {
          token.style.visibility = "";
        });

        if (!opening) {
          drawer.open = false;
          item.classList.remove("is-detail-open");
        }
      }
    });
  }

  function buildKeywordMotion(opening, index, rect) {
    return {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
      scale: opening ? 1.03 : 0.98,
      duration: 0.42 + index * 0.025,
      ease: "power2.inOut"
    };
  }

  function renderExperienceSkillStrip(data, item, expId) {
    if (!ns.skills || !ns.skills.getExperienceSkillItems || !ns.skills.renderSkillPills) return "";
    return ns.skills.renderSkillPills(ns.skills.getExperienceSkillItems(data, item, expId), { limit: 8 });
  }

  function stripTags(value) {
    return String(value || "").replace(/<[^>]*>/g, "");
  }

  function renderExperienceContext(data, item) {
    if (data.skillLayout && data.skillLayout.hideExperienceContext) return "";

    var skills = Array.isArray(item.contextualSkills) ? item.contextualSkills : [];
    var tools = Array.isArray(item.contextualTools) ? item.contextualTools : [];
    if (!skills.length && !tools.length) return "";

    return '<div class="experience-context-grid">' +
      (skills.length
        ? '<section class="experience-context-card">' +
            '<span class="experience-projects-label">Analyst skills</span>' +
            '<div class="quant-grid">' +
              skills.map(function (skill) {
                return '<span class="skill-token">' + skill + '</span>';
              }).join("") +
            '</div>' +
          '</section>'
        : "") +
      (tools.length
        ? '<section class="experience-context-card">' +
            '<span class="experience-projects-label">Tools and outputs</span>' +
            '<div class="tag-list">' +
              tools.map(function (tool) {
                return '<span class="skill-token">' + (tool.label || tool.id || tool) + '</span>';
              }).join("") +
            '</div>' +
          '</section>'
        : "") +
    '</div>';
  }

  function renderExperienceProjects(data, item) {
    if (!Array.isArray(item.relatedProjects) || !item.relatedProjects.length) return "";
    var projectById = {};
    data.projects.forEach(function (project) {
      projectById[project.id] = project;
    });

    var chips = item.relatedProjects
      .map(function (projectId) { return projectById[projectId]; })
      .filter(Boolean)
      .slice(0, 4)
      .map(function (project) {
        return '<span class="experience-project-chip">' + project.navTitle + '</span>';
      })
      .join("");

    if (!chips) return "";
    return '<div class="experience-projects">' +
      '<span class="experience-projects-label">Related projects</span>' +
      '<div class="experience-project-chip-row">' + chips + '</div>' +
    '</div>';
  }

  /* ── Page 4: Education ─────────────────────── */

  function renderEducation(data) {
    var section = document.querySelector(".edu-section");
    var list = document.getElementById("education-list");
    if (!list) return;
    section.hidden = !Array.isArray(data.education) || !data.education.length;
    list.innerHTML = data.education
      .map(function (item) {
        var school = item.school || item.institution || item.organization || "";
        var note = item.note || item.details || item.location || "";
        var dates = item.dates || item.date || "";
        var degree = item.degree || item.program || "";
        return '<article class="education-item">' +
          '<div class="education-head">' +
            renderOrgLogo(school) +
            '<div>' +
              (degree ? '<h3>' + escapeHtml(degree) + '</h3>' : "") +
              (school ? '<p>' + escapeHtml(school) + '</p>' : "") +
              (dates || item.gpa ? '<p class="muted-line">' + escapeHtml(dates) + (item.gpa ? " \u2022 GPA: " + escapeHtml(item.gpa) : "") + '</p>' : "") +
              (note ? '<p class="muted-line">' + escapeHtml(note) + '</p>' : "") +
            '</div>' +
          '</div>' +
        '</article>';
      })
      .join("");
  }

  function renderAwards(data) {
    var section = document.querySelector(".awards-section");
    var list = document.getElementById("awards-list");
    if (!list) return;
    section.hidden = !Array.isArray(data.awards) || !data.awards.length;
    list.innerHTML = data.awards
      .map(function (a) {
        var title = a.title || a.name || "Award";
        var org = a.org || a.issuer || a.organization || a.detail || "";
        var amount = a.amount || a.year || a.date || "";
        return '<div class="award-card">' +
          '<div>' +
            '<span class="award-title">' + escapeHtml(title) + '</span>' +
            (org ? '<span class="award-org"> \u2014 ' + escapeHtml(org) + '</span>' : "") +
          '</div>' +
          (amount ? '<span class="award-amount">' + escapeHtml(amount) + '</span>' : "") +
        '</div>';
      })
      .join("");
  }

  function renderPublications(data) {
    var section = document.querySelector(".pub-section");
    var list = document.getElementById("publications-list");
    if (!list) return;
    section.hidden = !Array.isArray(data.publications) || !data.publications.length;
    list.innerHTML = data.publications
      .map(function (pub) {
        return '<div class="pub-item">' +
          '<div class="pub-title">' + pub.title + '</div>' +
          '<div class="pub-authors">' + pub.authors + '</div>' +
          '<div class="pub-detail">' + pub.journal + ' \u2014 ' + pub.detail + '</div>' +
        '</div>';
      })
      .join("");
  }

  function renderCoursework(data) {
    var section = document.getElementById("coursework-section");
    var list = document.getElementById("coursework-list");
    if (!section || !list) return;

    var coursework = Array.isArray(data.coursework) ? data.coursework : [];
    section.hidden = coursework.length === 0;
    list.innerHTML = coursework
      .map(function (item) {
        return '<article class="coursework-item">' +
          '<h3>' + item.title + '</h3>' +
          '<ul class="compact-list">' +
            (item.bullets || []).map(function (b) { return '<li>' + b + '</li>'; }).join("") +
          '</ul>' +
        '</article>';
      })
      .join("");
  }

  function renderProfileMaterials(data) {
    var section = document.getElementById("profile-materials-section");
    var grid = document.getElementById("profile-materials-grid");
    if (!section || !grid) return;

    var cards = [];
    var certs = Array.isArray(data.licensesCertifications) ? data.licensesCertifications : [];
    var skillDetails = Array.isArray(data.technicalSkillDetails) ? data.technicalSkillDetails : [];
    var keywordGroups = Array.isArray(data.analystKeywordGroups) ? data.analystKeywordGroups : [];
    var links = Array.isArray(data.links) ? data.links : [];
    var atsProfile = data.atsProfile || data.atsSignals || null;
    var atsKeywords = buildAtsKeywords(data);
    var atsOnly = data.profileMaterialsMode === "ats-only";
    var visibleCardCount = 0;

    if (certs.length && !atsOnly) {
      cards.push('<article class="profile-material-card">' +
        '<h3>Licenses & Certifications</h3>' +
        '<div class="tag-list profile-material-tags">' +
          certs.map(function (item) {
            return ns.icons.renderTechChip(item, false);
          }).join("") +
        '</div>' +
      '</article>');
      visibleCardCount += 1;
    }

    if (skillDetails.length && !atsOnly) {
      cards.push('<article class="profile-material-card">' +
        '<h3>Technical Skill Details</h3>' +
        '<div class="quant-grid profile-material-tags">' +
          skillDetails.map(function (item) {
            return '<span class="quant-tag">' + item + '</span>';
          }).join("") +
        '</div>' +
      '</article>');
      visibleCardCount += 1;
    }

    if (keywordGroups.length && !atsOnly) {
      cards.push('<article class="profile-material-card profile-material-card-wide">' +
        '<h3>Analyst Keyword Groups</h3>' +
        '<div class="keyword-group-grid">' +
          keywordGroups.map(function (group) {
            return '<section class="keyword-group-card">' +
              '<h4>' + group.title + '</h4>' +
              '<p>' + (group.keywords || []).join(" · ") + '</p>' +
            '</section>';
          }).join("") +
        '</div>' +
      '</article>');
      visibleCardCount += 1;
    }

    if (links.length && !data.hideProfileSourceLinks) {
      cards.push('<article class="profile-material-card">' +
        '<h3>Source Links</h3>' +
        '<div class="project-artifact-row profile-material-links">' +
          links.map(function (link) {
            return '<a class="project-artifact-link" href="' + link.href + '" target="_blank" rel="noreferrer">' +
              '<span>' + link.label + '</span>' +
              '<small>' + link.value + '</small>' +
            '</a>';
          }).join("") +
        '</div>' +
      '</article>');
      visibleCardCount += 1;
    }

    if (atsProfile) {
      cards.push(renderAtsReadinessCard(atsProfile));
      visibleCardCount += 1;
    }

    if (atsKeywords.length && !data.hideAtsKeywordLayer) {
      cards.push('<article class="profile-material-card profile-material-card-wide ats-module">' +
        '<h3>Keyword Coverage</h3>' +
        '<p>' + atsKeywords.join(" · ") + '</p>' +
      '</article>');
    }

    section.hidden = cards.length === 0;
    section.classList.toggle("is-ats-hidden-only", cards.length > 0 && visibleCardCount === 0);
    grid.innerHTML = cards.join("");
  }

  function renderAtsReadinessCard(atsProfile) {
    var keywords = Array.isArray(atsProfile.targetKeywords) ? atsProfile.targetKeywords : [];
    var parseSignals = Array.isArray(atsProfile.parseSignals) ? atsProfile.parseSignals : [];
    var split = atsProfile.split || atsProfile.cohortRole || "";
    var role = atsProfile.targetRole || atsProfile.roleFamily || "";
    var title = atsProfile.title || "ATS Readiness";
    var hideNotes = Boolean(atsProfile.hideDiagnosticNotes);

    return '<article class="profile-material-card profile-material-card-wide ats-readiness-module">' +
      '<div class="ats-readiness-head">' +
        '<h3>' + stripTags(title) + '</h3>' +
        (split ? '<span>' + stripTags(split) + '</span>' : "") +
      '</div>' +
      '<div class="ats-readiness-grid">' +
        renderAtsReadinessBlock("Target", role || "Role-specific keyword scan") +
      '</div>' +
      (keywords.length ? '<div class="ats-chip-row">' + keywords.slice(0, 16).map(renderAtsChip).join("") + '</div>' : "") +
      (!hideNotes && parseSignals.length ? '<div class="ats-note-grid">' +
        (parseSignals.length ? renderAtsNoteList("Parse signals", parseSignals) : "") +
      '</div>' : "") +
    '</article>';
  }

  function renderAtsReadinessBlock(label, value) {
    return '<section class="ats-readiness-block">' +
      '<span>' + label + '</span>' +
      '<strong>' + stripTags(value) + '</strong>' +
    '</section>';
  }

  function renderAtsChip(value) {
    return '<span class="ats-chip">' + stripTags(value) + '</span>';
  }

  function renderAtsNoteList(title, items) {
    return '<section class="ats-note-list">' +
      '<h4>' + title + '</h4>' +
      '<ul>' + items.slice(0, 4).map(function (item) {
        return '<li>' + stripTags(item) + '</li>';
      }).join("") + '</ul>' +
    '</section>';
  }

  function buildAtsKeywords(data) {
    var keywords = [];

    function push(value) {
      if (!value) return;
      var text = String(value).trim();
      if (!text || keywords.indexOf(text) !== -1) return;
      keywords.push(text);
    }

    (data.quantToolkit || []).forEach(function (item) { push(item.label); });
    (data.stack || []).forEach(function (item) { push(item.label); });
    (data.analyticalSkills || []).forEach(function (item) { push(item.label); });
    (data.licensesCertifications || []).forEach(function (item) { push(item.label); });
    (data.technicalSkillDetails || []).forEach(push);
    (data.analystKeywordGroups || []).forEach(function (group) {
      push(group.title);
      (group.keywords || []).forEach(push);
    });
    var atsProfile = data.atsProfile || data.atsSignals || {};
    (atsProfile.targetKeywords || []).forEach(push);
    (atsProfile.parseSignals || []).forEach(push);
    (data.projects || []).forEach(function (project) {
      push(project.title);
      push(project.navTitle);
    });

    return keywords.slice(0, 220);
  }

  /* ── GSAP scroll-driven page transitions ──── */

  function setupScrollAnimations(state) {
    if (!window.gsap || !window.ScrollTrigger) {
      document.querySelectorAll(".page-dot").forEach(function (dot) {
        dot.addEventListener("click", function () {
          var target = document.getElementById("page-" + dot.dataset.target);
          if (target) target.scrollIntoView({ behavior: "smooth" });
        });
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    var pages = document.querySelectorAll(".page-section");
    var dots = document.querySelectorAll(".page-dot");

    pages.forEach(function (page, i) {
      /* Fade-in entrance for each page */
      gsap.from(page.querySelector(".page-inner"), {
        scrollTrigger: {
          trigger: page,
          start: "top 80%",
          end: "top 30%",
          scrub: 1
        },
        y: 60,
        opacity: 0,
        duration: 1
      });

      /* Track which page is current */
      ScrollTrigger.create({
        trigger: page,
        start: "top center",
        end: "bottom center",
        onEnter: function () { setActivePage(i + 1, state, dots); },
        onEnterBack: function () { setActivePage(i + 1, state, dots); }
      });
    });

    /* Dot navigation */
    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        var target = document.getElementById("page-" + dot.dataset.target);
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      });
    });

    /* Update Three.js camera based on scroll */
    ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      onUpdate: function (self) {
        if (ns.setScrollProgress) {
          ns.setScrollProgress(self.progress);
        }
      }
    });
  }

  function detectCurrentPage() {
    var pages = document.querySelectorAll(".page-section");
    var viewportCenter = window.innerHeight / 2;
    var fallbackPage = 1;
    var smallestDistance = Infinity;

    pages.forEach(function (page, index) {
      var rect = page.getBoundingClientRect();
      var pageNum = Number(page.dataset.page || index + 1);
      var pageCenter = rect.top + rect.height / 2;
      var distance = Math.abs(pageCenter - viewportCenter);

      if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
        fallbackPage = pageNum;
        smallestDistance = -1;
        return;
      }

      if (smallestDistance !== -1 && distance < smallestDistance) {
        smallestDistance = distance;
        fallbackPage = pageNum;
      }
    });

    return fallbackPage;
  }

  function setActivePage(pageNum, state, dots) {
    var previousPage = state.currentPage;
    var pageChanged = state.currentPage !== pageNum;
    state.currentPage = pageNum;
    document.body.setAttribute("data-current-page", String(pageNum));
    dots.forEach(function (d) {
      d.classList.toggle("active", Number(d.dataset.target) === pageNum);
    });

    /* Dispatch custom event for skill panel positioning */
    if (pageChanged) {
      window.dispatchEvent(new CustomEvent("pagechange", { detail: { page: pageNum, previousPage: previousPage } }));
    }
  }

  ns.pages = {
    renderPage1: renderPage1,
    renderExperience: renderExperience,
    renderEducation: renderEducation,
    renderAwards: renderAwards,
    renderPublications: renderPublications,
    renderCoursework: renderCoursework,
    renderProfileMaterials: renderProfileMaterials,
    setupScrollAnimations: setupScrollAnimations,
    detectCurrentPage: detectCurrentPage
  };
})();
