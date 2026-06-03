(function () {
  const ns = window.aiResume || (window.aiResume = {});
  const reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const interactiveSelector = [
    ".pill-btn",
    ".page-dot",
    ".result-demo-button",
    ".project-accordion-header",
    ".project-list-toggle",
    ".skill-filter-chip",
    ".skill-filter-clear",
    ".experience-item",
    ".project-artifact-link",
    "a[href]",
    "button"
  ].join(",");

  let cursor;
  let cursorDot;
  let cursorLabel;
  let lens;
  let hudFrame;
  let hudScene;
  let hudCandidate;
  let progressBar;
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;
  let started = false;

  function init() {
    if (started) return;
    started = true;

    buildChrome();
    bindPointer();
    refresh();
    startFrameLoop();

    window.addEventListener("scroll", updateHud, { passive: true });
    window.addEventListener("resize", updateHud, { passive: true });
    window.addEventListener("pagechange", updateHud);
    window.addEventListener("ag:user-switch-start", function (event) {
      document.body.classList.add("is-ag-switching");
      if (window.triggerAgBurst) window.triggerAgBurst();
      fireSwitchFlash(event.detail && event.detail.user);
    });
    window.addEventListener("ag:user-switch", function () {
      window.setTimeout(function () {
        document.body.classList.remove("is-ag-switching");
        refresh();
        updateHud();
      }, 80);
    });
    window.addEventListener("ag:content-rendered", function () {
      window.setTimeout(refresh, 40);
    });
  }

  function buildChrome() {
    if (!document.querySelector(".ag-noise")) {
      const noise = document.createElement("div");
      noise.className = "ag-noise";
      document.body.appendChild(noise);
    }

    if (!document.querySelector(".ag-marquee")) {
      const marquee = document.createElement("div");
      marquee.className = "ag-marquee";
      marquee.setAttribute("aria-hidden", "true");
      marquee.innerHTML =
        '<div class="ag-marquee-track">' +
          '<span>V7_AG</span><span>PRETEXT</span><span>GSAP</span><span>REMOTION FRAME 000</span><span>THREE.JS</span><span>CURSOR LIVE</span>' +
          '<span>V7_AG</span><span>PRETEXT</span><span>GSAP</span><span>REMOTION FRAME 000</span><span>THREE.JS</span><span>CURSOR LIVE</span>' +
        "</div>";
      document.body.appendChild(marquee);
    }

    if (!document.querySelector(".ag-hud")) {
      const hud = document.createElement("aside");
      hud.className = "ag-hud";
      hud.setAttribute("aria-hidden", "true");
      hud.innerHTML =
        '<div class="ag-hud-cell"><span>FRAME</span><strong data-ag-frame>000</strong></div>' +
        '<div class="ag-hud-cell"><span>SCENE</span><strong data-ag-scene>INTRO</strong></div>' +
        '<div class="ag-hud-cell"><span>CANDIDATE</span><strong data-ag-candidate>DUKE</strong></div>' +
        '<div class="ag-progress"><i data-ag-progress></i></div>';
      document.body.appendChild(hud);
    }

    if (!document.querySelector(".ag-cursor")) {
      cursor = document.createElement("div");
      cursor.className = "ag-cursor";
      cursor.setAttribute("aria-hidden", "true");
      cursor.innerHTML = '<span class="ag-cursor-corners"></span><span class="ag-cursor-label"></span>';
      document.body.appendChild(cursor);

      cursorDot = document.createElement("div");
      cursorDot.className = "ag-cursor-dot";
      cursorDot.setAttribute("aria-hidden", "true");
      document.body.appendChild(cursorDot);
    } else {
      cursor = document.querySelector(".ag-cursor");
      cursorDot = document.querySelector(".ag-cursor-dot");
    }

    if (!document.querySelector(".ag-lens")) {
      lens = document.createElement("div");
      lens.className = "ag-lens";
      lens.setAttribute("aria-hidden", "true");
      document.body.appendChild(lens);
    } else {
      lens = document.querySelector(".ag-lens");
    }

    cursorLabel = cursor.querySelector(".ag-cursor-label");
    hudFrame = document.querySelector("[data-ag-frame]");
    hudScene = document.querySelector("[data-ag-scene]");
    hudCandidate = document.querySelector("[data-ag-candidate]");
    progressBar = document.querySelector("[data-ag-progress]");
  }

  function bindPointer() {
    document.addEventListener("pointermove", function (event) {
      mouseX = event.clientX;
      mouseY = event.clientY;
      document.documentElement.style.setProperty("--cursor-x", mouseX + "px");
      document.documentElement.style.setProperty("--cursor-y", mouseY + "px");

      const target = event.target.closest(interactiveSelector);
      updateCursorTarget(target);
    }, { passive: true });

    document.addEventListener("pointerleave", function () {
      document.body.classList.add("ag-cursor-out");
    }, { passive: true });

    document.addEventListener("pointerenter", function () {
      document.body.classList.remove("ag-cursor-out");
    }, { passive: true });

    document.addEventListener("pointerdown", function () {
      document.body.classList.add("ag-pointer-down");
    }, { passive: true });

    document.addEventListener("pointerup", function () {
      document.body.classList.remove("ag-pointer-down");
    }, { passive: true });
  }

  function updateCursorTarget(target) {
    if (!cursorLabel) return;
    document.body.classList.toggle("ag-hovering", Boolean(target));
    if (!target) {
      cursorLabel.textContent = "";
      return;
    }

    if (target.classList.contains("pill-btn")) {
      cursorLabel.textContent = target.textContent.trim().toUpperCase();
    } else if (target.classList.contains("project-accordion-header")) {
      cursorLabel.textContent = "OPEN";
    } else if (target.classList.contains("experience-item")) {
      cursorLabel.textContent = "EXPAND";
    } else if (target.classList.contains("skill-filter-chip")) {
      cursorLabel.textContent = "FILTER";
    } else {
      cursorLabel.textContent = "GO";
    }
  }

  function refresh() {
    applyPretext();
    bindMagnetics();
    setupGsapReveals();
    updateHud();
    document.body.classList.add("ag-ready");
  }

  function applyPretext() {
    const heroName = document.getElementById("hero-name");
    if (!heroName) return;

    const text = heroName.textContent.replace(/\s+/g, " ").trim();
    if (!text || heroName.dataset.pretextValue === text) return;

    heroName.dataset.pretextValue = text;
    heroName.setAttribute("aria-label", text);
    heroName.innerHTML = "";

    text.split(" ").forEach(function (word, wordIndex, words) {
      const wordSpan = document.createElement("span");
      wordSpan.className = "pretext-word";
      wordSpan.setAttribute("aria-hidden", "true");

      Array.from(word).forEach(function (char, charIndex) {
        const charSpan = document.createElement("span");
        charSpan.className = "pretext-char";
        charSpan.textContent = char;
        charSpan.style.setProperty("--char-index", String(charIndex + wordIndex * 8));
        wordSpan.appendChild(charSpan);
      });

      heroName.appendChild(wordSpan);
      if (wordIndex < words.length - 1) {
        heroName.appendChild(document.createTextNode(" "));
      }
    });

    if (window.gsap && !reducedMotion && window.innerWidth > 760) {
      gsap.fromTo(heroName.querySelectorAll(".pretext-char"), {
        y: function (index) { return index % 2 ? 10 : -10; },
        rotateX: function (index) { return index % 2 ? -18 : 18; },
        rotateZ: function (index) { return index % 2 ? 5 : -5; }
      }, {
        y: 0,
        rotateX: 0,
        rotateZ: 0,
        duration: 0.92,
        stagger: { amount: 0.58, from: "random" },
        ease: "expo.out"
      });
    }
  }

  function bindMagnetics() {
    if (!window.gsap || reducedMotion) return;
    document.querySelectorAll(".pill-btn, .result-demo-button, .project-accordion-header, .experience-item, .skill-filter-chip").forEach(function (el) {
      if (el.dataset.agMagnetic === "true") return;
      el.dataset.agMagnetic = "true";

      el.addEventListener("pointermove", function (event) {
        const rect = el.getBoundingClientRect();
        const relX = event.clientX - rect.left - rect.width / 2;
        const relY = event.clientY - rect.top - rect.height / 2;
        const power = el.classList.contains("experience-item") ? 0.025 : 0.075;
        gsap.to(el, {
          x: relX * power,
          y: relY * power,
          rotateX: -relY * 0.018,
          rotateY: relX * 0.018,
          transformPerspective: 800,
          duration: 0.32,
          ease: "power3.out"
        });
      });

      el.addEventListener("pointerleave", function () {
        gsap.to(el, {
          x: 0,
          y: 0,
          rotateX: 0,
          rotateY: 0,
          duration: 0.55,
          ease: "elastic.out(1, 0.55)"
        });
      });
    });
  }

  function setupGsapReveals() {
    if (!window.gsap || !window.ScrollTrigger || reducedMotion) return;
    gsap.registerPlugin(ScrollTrigger);

    document.querySelectorAll(".result-project-card, .project-accordion-item, .experience-item, .skill-panel, .award-card, .education-item, .profile-material-card").forEach(function (el, index) {
      if (el.dataset.agReveal === "true") return;
      el.dataset.agReveal = "true";

      gsap.fromTo(el, {
        y: 42,
        rotateX: -9
      }, {
        scrollTrigger: {
          trigger: el,
          start: "top 92%",
          once: true
        },
        y: 0,
        rotateX: 0,
        duration: 0.82,
        delay: Math.min(index * 0.025, 0.18),
        ease: "expo.out"
      });
    });
  }

  function startFrameLoop() {
    function frame() {
      cursorX += (mouseX - cursorX) * 0.18;
      cursorY += (mouseY - cursorY) * 0.18;

      if (cursor) {
        cursor.style.transform = "translate3d(" + (cursorX - 24) + "px, " + (cursorY - 24) + "px, 0)";
      }
      if (cursorDot) {
        cursorDot.style.transform = "translate3d(" + (mouseX - 3) + "px, " + (mouseY - 3) + "px, 0)";
      }
      if (lens) {
        lens.style.transform = "translate3d(" + (cursorX - 115) + "px, " + (cursorY - 115) + "px, 0) rotate(" + ((cursorX + cursorY) * 0.02) + "deg)";
      }

      updateHud();
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function updateHud() {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.max(0, Math.min(1, window.scrollY / maxScroll));
    const frame = Math.round(progress * 720);
    const page = document.body.getAttribute("data-current-page") || "1";
    const profile = document.body.getAttribute("data-profile") || window.resumeCandidateId || "duke";
    const sceneLabel = page === "1" ? "INTRO" : page === "2" ? "PROJECTS" : page === "3" ? "EXPERIENCE" : "DETAILS";

    if (hudFrame) hudFrame.textContent = String(frame).padStart(3, "0");
    if (hudScene) hudScene.textContent = sceneLabel;
    if (hudCandidate) hudCandidate.textContent = profile.split("-")[0].toUpperCase();
    if (progressBar) progressBar.style.transform = "scaleX(" + progress + ")";

    document.documentElement.style.setProperty("--scroll-progress", String(progress));
  }

  function fireSwitchFlash(user) {
    if (reducedMotion) return;
    const flash = document.createElement("div");
    flash.className = "ag-switch-flash";
    flash.setAttribute("aria-hidden", "true");
    flash.textContent = String(user || "V7_AG").toUpperCase();
    document.body.appendChild(flash);

    if (window.gsap) {
      gsap.fromTo(flash, {
        opacity: 0,
        scaleX: 0.3,
        filter: "blur(12px)"
      }, {
        opacity: 1,
        scaleX: 1,
        filter: "blur(0px)",
        duration: 0.16,
        ease: "power4.out",
        onComplete: function () {
          gsap.to(flash, {
            opacity: 0,
            yPercent: -60,
            duration: 0.42,
            ease: "power3.in",
            onComplete: function () { flash.remove(); }
          });
        }
      });
    } else {
      window.setTimeout(function () { flash.remove(); }, 500);
    }
  }

  ns.agDirector = {
    refresh: refresh,
    updateHud: updateHud
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    window.setTimeout(init, 0);
  }
})();
