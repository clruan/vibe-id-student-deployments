(function () {
  const ns = window.aiResume || (window.aiResume = {});

  /* ── Page 1: Hero ──────────────────────────── */

  function renderPage1(data) {
    var p = data.profile;
    var ui = data.ui || {};

    document.getElementById("hero-name").textContent = p.name;
    document.getElementById("hero-summary").innerHTML = p.summaryHtml || p.summary;
    document.getElementById("results-title").textContent = ui.resultsTitle || "Selected Results";
    document.getElementById("mode-card-note").textContent = ui.modeNote || "VIP mode reveals endorsement callouts in Experience and Projects only.";
    document.getElementById("experience-title").textContent = ui.experienceTitle || "Experience";
    document.getElementById("projects-title").textContent = ui.projectsTitle || "Selected AI Projects";
    document.getElementById("projects-subtitle").textContent = ui.projectsSubtitle || "Hover or open a project, then use the highlighted Check Demo badge to inspect the interaction.";
    document.getElementById("demo-callout").textContent = ui.demoCallout || "Each project row includes a stronger Check Demo entry point so reviewers know where to open the live algorithm walkthrough.";
    document.getElementById("education-title").textContent = ui.educationTitle || "Education";
    document.getElementById("awards-title").textContent = ui.awardsTitle || "Awards";
    document.getElementById("publications-title").textContent = ui.publicationsTitle || "Publications";
    document.getElementById("peers-title").textContent = ui.peersTitle || "What Peers Say";

    document.getElementById("hero-contact").innerHTML = buildContactMarkup(data);

    document.getElementById("results-grid").innerHTML = data.results
      .map(function (r) {
        return '<article class="result-card">' +
          '<p class="result-value">' + r.value + '</p>' +
          '<p class="result-label">' + r.label + '</p>' +
          '<p class="result-note">' + r.note + '</p>' +
        '</article>';
      })
      .join("");
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

    if (p.scholar) {
      items.push('<a href="' + p.scholar + '" target="_blank" rel="noreferrer">Google Scholar</a>');
    }

    return items.join("");
  }

  /* ── Page 2: Experience ────────────────────── */

  function renderExperience(data, callbacks) {
    var container = document.getElementById("experience-list");
    container.innerHTML = data.experience
      .map(function (item, index) {
        var expId = item.id || "exp-" + index;
        var endorsement = ns.modes && ns.modes.renderVipEndorsement
          ? ns.modes.renderVipEndorsement(item.endorsement, {
              eyebrow: "VIP endorsement",
              variant: "experience"
            })
          : "";
        var relatedProjects = renderExperienceProjects(data, item);
        return '<article class="experience-item" data-exp-id="' + expId + '">' +
          '<div class="experience-head">' +
            '<div>' +
              '<h3>' + item.role + '</h3>' +
              '<p class="experience-org">' + item.organization + (item.location ? " \u00b7 " + item.location : "") + '</p>' +
            '</div>' +
            '<p class="experience-dates">' + item.dates + '</p>' +
          '</div>' +
          '<ul class="compact-list">' +
            item.bullets.map(function (b) { return '<li>' + b + '</li>'; }).join("") +
          '</ul>' +
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

  /* ── Page 3: Education ─────────────────────── */

  function renderEducation(data) {
    document.getElementById("education-list").innerHTML = data.education
      .map(function (item) {
        return '<article class="education-item">' +
          '<h3>' + item.degree + '</h3>' +
          '<p>' + item.school + '</p>' +
          '<p class="muted-line">' + item.dates + (item.gpa ? " \u2022 GPA: " + item.gpa : "") + '</p>' +
          '<p class="muted-line">' + item.note + '</p>' +
        '</article>';
      })
      .join("");
  }

  function renderAwards(data) {
    document.getElementById("awards-list").innerHTML = data.awards
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
    document.getElementById("publications-list").innerHTML = data.publications
      .map(function (pub) {
        return '<div class="pub-item">' +
          '<div class="pub-title">' + pub.title + '</div>' +
          '<div class="pub-authors">' + pub.authors + '</div>' +
          '<div class="pub-detail">' + pub.journal + ' \u2014 ' + pub.detail + '</div>' +
        '</div>';
      })
      .join("");
  }

  function renderPeers(data) {
    document.getElementById("peers-carousel").innerHTML = data.peerEvaluations
      .map(function (peer) {
        return '<div class="peer-card">' +
          '<div class="peer-text">' + peer.text + '</div>' +
          '<div class="peer-footer">' +
            '<div class="peer-avatar-placeholder"></div>' +
            '<div class="peer-info">' +
              '<div class="peer-name">' + peer.name + '</div>' +
              '<div class="peer-role">' + peer.role + '</div>' +
            '</div>' +
          '</div>' +
        '</div>';
      })
      .join("");
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
    renderPeers: renderPeers,
    setupScrollAnimations: setupScrollAnimations,
    detectCurrentPage: detectCurrentPage
  };
})();
