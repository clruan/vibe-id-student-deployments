(function () {
  const ns = window.aiResume || (window.aiResume = {});

  /* ── Page 1: Hero ──────────────────────────── */

  function renderPage1(data) {
    var p = data.profile;

    document.getElementById("hero-name").textContent = p.name;
    document.getElementById("hero-positioning").textContent = p.positioning || "";
    document.getElementById("hero-summary").innerHTML = p.summaryHtml || p.summary;

    var parts = [];
    if (p.location) parts.push('<span>' + p.location + '</span>');
    if (p.phone) parts.push('<span>' + p.phone + '</span>');
    if (p.email) parts.push('<a href="mailto:' + p.email + '">' + p.email + '</a>');
    if (p.linkedin) parts.push('<a href="' + p.linkedin + '" target="_blank" rel="noreferrer">LinkedIn</a>');
    if (p.resume) parts.push('<a href="' + p.resume + '" target="_blank" rel="noreferrer">Resume PDF</a>');
    if (p.website) parts.push('<a href="' + p.website + '" target="_blank" rel="noreferrer">Website</a>');
    document.getElementById("hero-contact").innerHTML = parts.join("");

    var bringGrid = document.getElementById("what-bring-grid");
    if (bringGrid && Array.isArray(data.whatIBring)) {
      bringGrid.innerHTML = data.whatIBring
        .map(function (item) {
          return '<article class="what-card">' +
            '<h3>' + item.title + '</h3>' +
            '<p>' + item.detail + '</p>' +
          '</article>';
        })
        .join("");
    }
  }

  /* ── Page 2: Experience ────────────────────── */

  function renderExperience(data, callbacks) {
    var container = document.getElementById("experience-list");
    container.innerHTML = data.experience
      .map(function (item, index) {
        var expId = item.id || "exp-" + index;
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

  function renderCoursework(data) {
    var container = document.getElementById("coursework-list");
    if (!container || !Array.isArray(data.coursework)) return;
    container.innerHTML = data.coursework
      .map(function (item) {
        return '<article class="coursework-item">' +
          '<h3>' + item.title + '</h3>' +
          '<ul class="compact-list">' +
            item.bullets.map(function (b) { return '<li>' + b + '</li>'; }).join("") +
          '</ul>' +
        '</article>';
      })
      .join("");

    renderCta(data);
  }

  function renderCta(data) {
    var container = document.getElementById("cta-section");
    var cta = data.cta;
    if (!container || !cta) return;

    container.innerHTML =
      '<div class="cta-copy">' +
        '<h2>' + cta.title + '</h2>' +
        '<p>' + cta.text + '</p>' +
      '</div>' +
      '<div class="cta-actions">' +
        (cta.actions || [])
          .map(function (action) {
            return '<a class="cta-button" href="' + action.href + '" target="_blank" rel="noreferrer">' + action.label + '</a>';
          })
          .join("") +
      '</div>';
  }

  /* ── GSAP scroll-driven page transitions ──── */

  function setupScrollAnimations(state) {
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
    renderCoursework: renderCoursework,
    renderAwards: renderAwards,
    setupScrollAnimations: setupScrollAnimations,
    detectCurrentPage: detectCurrentPage
  };
})();
