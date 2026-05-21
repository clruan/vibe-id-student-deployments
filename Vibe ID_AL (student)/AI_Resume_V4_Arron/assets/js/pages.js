(function () {
  const ns = window.aiResume || (window.aiResume = {});

  /* ── Page 1: Hero ──────────────────────────── */

  function renderPage1(data) {
    var p = data.profile;

    document.getElementById("hero-name").textContent = p.name;
    document.getElementById("hero-summary").innerHTML = p.summaryHtml || p.summary;

    function contactIcon(type) {
      var icons = {
        location: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 21s6-5.4 6-11a6 6 0 1 0-12 0c0 5.6 6 11 6 11Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="10" r="2.2" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
        phone: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7.2 4.8 9.7 4l2 4-1.7 1.4c.9 1.9 2.4 3.4 4.5 4.5l1.4-1.7 4 2-.8 2.6c-.3 1-1.2 1.7-2.3 1.6C10.6 18 6 13.4 5.6 7.2c-.1-1.1.6-2.1 1.6-2.4Z" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        email: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="4" y="6" width="16" height="12" rx="2.2" fill="none" stroke="currentColor" stroke-width="2"/><path d="m5.5 8 6.5 5 6.5-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6.8 9.6v8.2M11 17.8v-4.6c0-2.2 3.1-2.6 3.1.1v4.5M11 9.6v1.2M6.8 6.6h.1" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><rect x="3.5" y="3.5" width="17" height="17" rx="3" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
        resume: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 3.8h7l3 3V20a1.8 1.8 0 0 1-1.8 1.8H7A1.8 1.8 0 0 1 5.2 20V5.6A1.8 1.8 0 0 1 7 3.8Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M14 4v4h4M8.5 12h7M8.5 15.5h5M8.5 19h3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
        website: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3.8 12h16.4M12 3.5c2 2.2 3 5 3 8.5s-1 6.3-3 8.5M12 3.5c-2 2.2-3 5-3 8.5s1 6.3 3 8.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>'
      };

      return '<span class="contact-icon">' + (icons[type] || icons.website) + "</span>";
    }

    function contactItem(type, label, href) {
      var inner = contactIcon(type) + '<span>' + label + "</span>";
      if (href) {
        return '<a class="contact-item" href="' + href + '" target="' + (href.indexOf("mailto:") === 0 || href.indexOf("tel:") === 0 ? "_self" : "_blank") + '" rel="noreferrer">' + inner + "</a>";
      }
      return '<span class="contact-item">' + inner + "</span>";
    }

    var parts = [];
    if (p.location) parts.push(contactItem("location", p.location));
    if (p.phone) parts.push(contactItem("phone", p.phone, "tel:" + p.phone.replace(/\s+/g, "")));
    if (p.email) parts.push(contactItem("email", p.email, "mailto:" + p.email));
    if (p.linkedin) parts.push(contactItem("linkedin", "LinkedIn", p.linkedin));
    if (p.resume) parts.push(contactItem("resume", "Resume PDF", p.resume));
    if (p.website) parts.push(contactItem("website", "Website", p.website));
    document.getElementById("hero-contact").innerHTML = parts.join("");
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

    var activeExperienceId = null;
    var experienceItems = Array.from(container.querySelectorAll(".experience-item"));
    var experienceSection = document.getElementById("page-2");

    function notifyExperienceFocus(expId) {
      if (callbacks && callbacks.onExperienceFocus) {
        callbacks.onExperienceFocus(expId);
        return;
      }

      if (callbacks && callbacks.onExperienceActivate) {
        callbacks.onExperienceActivate(expId);
      }
    }

    function notifyExperienceVisibility(visible, expId) {
      if (callbacks && callbacks.onExperienceVisibilityChange) {
        callbacks.onExperienceVisibilityChange(visible, expId);
      }
    }

    function setActiveExperience(expId, options) {
      if (!expId || activeExperienceId === expId) return;

      activeExperienceId = expId;
      experienceItems.forEach(function (el) {
        var isActive = el.dataset.expId === expId;
        el.classList.toggle("is-active", isActive);

        if (!(options && options.skipAnimation)) {
          animateExperienceState(el, isActive ? "active" : "rest");
        }
      });

      notifyExperienceFocus(expId);
    }

    function resetToFirstExperience(options) {
      if (!experienceItems.length) {
        return;
      }

      setActiveExperience(experienceItems[0].dataset.expId, options || { skipAnimation: true });
    }

    function experienceSectionOwnsViewportCenter() {
      if (!experienceSection) {
        return false;
      }

      var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      var viewportCenter = viewportHeight / 2;
      var rect = experienceSection.getBoundingClientRect();

      return rect.top <= viewportCenter && rect.bottom >= viewportCenter;
    }

    function getReadableExperienceItems() {
      var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      var viewportCenter = viewportHeight / 2;
      var readingTop = viewportHeight * 0.25;
      var readingBottom = viewportHeight * 0.75;

      return experienceItems
        .map(function (item, index) {
          var rect = item.getBoundingClientRect();
          var visibleHeight = Math.max(0, Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0));
          var readingOverlap = Math.max(0, Math.min(rect.bottom, readingBottom) - Math.max(rect.top, readingTop));
          var cardCenter = rect.top + rect.height / 2;

          return {
            item: item,
            index: index,
            visibleRatio: rect.height ? visibleHeight / rect.height : 0,
            readingOverlap: readingOverlap,
            centerDistance: Math.abs(cardCenter - viewportCenter),
            isInReadingZone: rect.bottom > readingTop && rect.top < readingBottom
          };
        })
        .filter(function (entry) {
          return entry.visibleRatio >= 0.2 &&
            entry.readingOverlap > 0 &&
            entry.isInReadingZone;
        })
        .sort(function (a, b) {
          if (a.centerDistance === b.centerDistance) {
            return a.index - b.index;
          }

          return a.centerDistance - b.centerDistance;
        });
    }

    function updateReadableExperience() {
      if (!experienceSectionOwnsViewportCenter()) {
        notifyExperienceVisibility(false);
        return;
      }

      var readableItems = getReadableExperienceItems();

      if (!readableItems.length) {
        notifyExperienceVisibility(false);
        return;
      }

      var expId = readableItems[0].item.dataset.expId;
      notifyExperienceVisibility(true, expId);
      setActiveExperience(expId);
    }

    // Bind interaction events
    experienceItems.forEach(function(item) {
      item.addEventListener("mouseenter", function() {
        if (!item.classList.contains("is-active")) {
          animateExperienceState(item, "hover");
        }
        if (experienceSectionOwnsViewportCenter()) {
          notifyExperienceVisibility(true, item.dataset.expId);
          if (callbacks && callbacks.onExperienceHover) callbacks.onExperienceHover(item.dataset.expId);
        }
      });
      item.addEventListener("mouseleave", function() {
        if (!item.classList.contains("is-active")) {
          animateExperienceState(item, "rest");
        }
        if (callbacks && callbacks.onExperienceLeave) callbacks.onExperienceLeave();
      });
      item.addEventListener("click", function() {
        var expId = item.dataset.expId;
        if (experienceSectionOwnsViewportCenter()) {
          notifyExperienceVisibility(true, expId);
          setActiveExperience(expId);
        } else {
          notifyExperienceVisibility(false);
        }
      });
    });

    if (experienceItems.length) {
      resetToFirstExperience({ skipAnimation: true });
      notifyExperienceVisibility(false);
    }

    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(function () {
        updateReadableExperience();
      }, {
        root: null,
        rootMargin: "0px",
        threshold: [0, 0.28, 0.45, 0.7]
      });

      experienceItems.forEach(function (item) {
        observer.observe(item);
      });
    }

    var readableUpdateQueued = false;

    function scheduleReadableExperienceUpdate() {
      if (readableUpdateQueued) {
        return;
      }

      readableUpdateQueued = true;
      window.requestAnimationFrame(function () {
        readableUpdateQueued = false;
        updateReadableExperience();
      });
    }

    window.addEventListener("scroll", scheduleReadableExperienceUpdate, { passive: true });
    window.addEventListener("resize", scheduleReadableExperienceUpdate);

    window.addEventListener("pagechange", function (event) {
      var detail = event.detail || {};

      if (detail.page === 2) {
        if (detail.previousPage === 1) {
          resetToFirstExperience({ skipAnimation: true });
          notifyExperienceVisibility(false);
        }

        scheduleReadableExperienceUpdate();
        return;
      }

      scheduleReadableExperienceUpdate();
    });

    window.addEventListener("experience:resetToFirst", function () {
      resetToFirstExperience({ skipAnimation: true });
      notifyExperienceVisibility(false);
      scheduleReadableExperienceUpdate();
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
  }

  function renderMentorReview(data) {
    var container = document.getElementById("mentor-review");
    var review = data.mentorReview;
    if (!container || !review) return;

    container.innerHTML =
      '<article class="mentor-card">' +
        '<div class="mentor-review-block">' +
          '<p class="mentor-label">Mentor Review</p>' +
          '<blockquote class="mentor-quote">' + review.quote + '</blockquote>' +
          '<p class="mentor-attribution">' + review.mentor + ', ' + review.role + '</p>' +
        '</div>' +
        '<div class="mentor-feedback-block">' +
          '<p class="mentor-label">Mentor Feedback</p>' +
          '<p class="mentor-feedback">' + review.feedback + '</p>' +
        '</div>' +
      '</article>';
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
          if (Number(dot.dataset.target) === 2) {
            window.dispatchEvent(new CustomEvent("experience:resetToFirst"));
            var heading = target.querySelector(".exp-section h2");
            var firstExperience = target.querySelector(".experience-item");

            if (firstExperience) {
              var firstRect = firstExperience.getBoundingClientRect();
              var firstCenteredTop = window.scrollY + firstRect.top + firstRect.height / 2 - window.innerHeight / 2;

              if (heading) {
                var headingRect = heading.getBoundingClientRect();
                var headingVisibleTop = window.scrollY + headingRect.top - 24;
                firstCenteredTop = Math.min(firstCenteredTop, headingVisibleTop);
              }

              window.scrollTo({ top: Math.max(0, firstCenteredTop), behavior: "smooth" });
              return;
            }
          }

          target.scrollIntoView({ behavior: "smooth", block: "start" });
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
    renderMentorReview: renderMentorReview,
    renderAwards: renderAwards,
    setupScrollAnimations: setupScrollAnimations,
    detectCurrentPage: detectCurrentPage
  };
})();
