(function () {
  const ns = window.aiResume || (window.aiResume = {});

  /* ── Page 1: Hero ──────────────────────────── */

  function renderPage1(data) {
    var ui = data.ui || {};

    renderHeroIdentity(data);
    document.getElementById("results-title").textContent = ui.resultsTitle || "Selected Results";
    document.getElementById("experience-title").textContent = ui.experienceTitle || "Experience";
    document.getElementById("projects-title").textContent = ui.projectsTitle || "Selected AI Projects";
    document.getElementById("projects-subtitle").textContent = ui.projectsSubtitle || "Hover or open a project, then use the highlighted Check Demo badge to inspect the interaction.";
    document.getElementById("demo-callout").textContent = ui.demoCallout || "Each project row includes a stronger Check Demo entry point so reviewers know where to open the live algorithm walkthrough.";
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
      var metric = getProjectMetric(project);
      return '<article class="result-project-card" style="--project-accent:' + (project.accent || "#4f46e5") + '">' +
        '<div class="result-project-main">' +
          renderProjectSkillStrip(data, project, 5) +
          '<h3>' + (project.navTitle || project.title) + '</h3>' +
          '<p class="result-project-meta">' + (project.navMeta || project.source || "Project") + '</p>' +
          '<p class="result-project-summary">' + summarizeText(project.summary || project.algorithmSummary || "", 180) + '</p>' +
        '</div>' +
        '<div class="result-project-action">' +
          (metric ? '<div class="result-project-metric"><strong>' + metric.value + '</strong><span>' + metric.label + '</span></div>' : "") +
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

  function getSelectedResultProjects(data) {
    var withMetrics = (data.projects || []).filter(function (project) {
      return Array.isArray(project.metrics) && project.metrics.length;
    });
    return (withMetrics.length ? withMetrics : (data.projects || [])).slice(0, 2);
  }

  function getProjectMetric(project) {
    var metrics = Array.isArray(project.metrics) ? project.metrics : [];
    if (!metrics.length) return null;
    return metrics.find(function (metric) {
      return /%|\\+|x|mo|m|k|[0-9]/i.test(String(metric.value || ""));
    }) || metrics[0];
  }

  function renderProjectSkillStrip(data, project, limit) {
    if (!ns.skills || !ns.skills.getProjectSkillItems || !ns.skills.renderSkillPills) return "";
    return ns.skills.renderSkillPills(ns.skills.getProjectSkillItems(data, project), { limit: limit || 5 });
  }

  function summarizeText(value, maxLength) {
    var text = stripTags(value).replace(/\s+/g, " ").trim();
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 1).replace(/\s+\S*$/, "") + "...";
  }

  function openProjectFromResult(projectId) {
    var page = document.getElementById("page-2");
    if (page) page.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(function () {
      var item = document.querySelector('.project-accordion-item[data-project-id="' + projectId + '"]');
      if (!item) return;
      var header = item.querySelector(".project-accordion-header");
      if (header && !item.classList.contains("is-expanded")) header.click();
      item.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 220);
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
      document.getElementById("hero-contact").innerHTML = buildContactMarkup(data);
      return;
    }

    identity.innerHTML = '<article class="linkedin-profile-card">' +
      '<div class="linkedin-cover" aria-hidden="true">' +
        '<span>AI Resume</span>' +
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
          renderExperienceSkillStrip(data, item, expId) +
          renderExperienceDrawer(item) +
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
    return '<p class="experience-preview">' + stripTags(first) + '</p>';
  }

  function renderExperienceDrawer(item) {
    var bullets = Array.isArray(item.bullets) ? item.bullets.slice(1) : [];
    if (!bullets.length) return "";
    return '<details class="experience-detail-drawer">' +
      '<summary>Read more</summary>' +
      '<ul class="compact-list experience-extra-list">' +
        bullets.map(function (b) { return '<li>' + stripTags(b) + '</li>'; }).join("") +
      '</ul>' +
    '</details>';
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
        return '<article class="education-item">' +
          '<div class="education-head">' +
            renderOrgLogo(item.school) +
            '<div>' +
              '<h3>' + item.degree + '</h3>' +
              '<p>' + item.school + '</p>' +
              '<p class="muted-line">' + item.dates + (item.gpa ? " \u2022 GPA: " + item.gpa : "") + '</p>' +
              '<p class="muted-line">' + item.note + '</p>' +
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
        return '<div class="award-card">' +
          '<div>' +
            '<span class="award-title">' + a.title + '</span>' +
            '<span class="award-org"> \u2014 ' + a.org + '</span>' +
          '</div>' +
          '<span class="award-amount">' + a.amount + '</span>' +
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

    if (links.length) {
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

    if (atsKeywords.length) {
      cards.push('<article class="profile-material-card profile-material-card-wide ats-module">' +
        '<h3>ATS Signal Layer</h3>' +
        '<p>' + atsKeywords.join(" · ") + '</p>' +
      '</article>');
    }

    section.hidden = cards.length === 0;
    section.classList.toggle("is-ats-hidden-only", cards.length > 0 && visibleCardCount === 0);
    grid.innerHTML = cards.join("");
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
