(function () {
  const ns = window.aiResume || (window.aiResume = {});

  function renderProjectsAccordion(data, state, callbacks) {
    var container = document.getElementById("projects-accordion");

    container.innerHTML = data.projects
      .map(function (project) {
        return '<div class="project-accordion-item" data-project-id="' + project.id + '">' +
          '<button class="project-accordion-header" type="button">' +
            '<div>' +
              '<div class="project-accordion-title">' + project.navTitle + '</div>' +
              '<div class="project-accordion-meta">' + project.navMeta + '</div>' +
            '</div>' +
            '<div class="demo-badge-wrap">' +
              '<div class="demo-badge">' +
                '<span class="demo-badge-copy">' +
                  '<span class="demo-badge-title">Click to learn more</span>' +
                  '<span class="demo-badge-meta">Open project story</span>' +
                '</span>' +
                '<span class="demo-badge-arrow">\u25BC</span>' +
              '</div>' +
            '</div>' +
          '</button>' +
          '<div class="project-accordion-body">' +
            '<div class="project-body-inner" data-project-id="' + project.id + '"></div>' +
          '</div>' +
        '</div>';
      })
      .join("");

    /* Bind accordion toggle */
    container.querySelectorAll(".project-accordion-header").forEach(function (header) {
      header.addEventListener("click", function () {
        var item = header.closest(".project-accordion-item");
        var projectId = item.dataset.projectId;
        var isExpanded = item.classList.contains("is-expanded");

        /* Close all */
        container.querySelectorAll(".project-accordion-item").forEach(function (el) {
          el.classList.remove("is-expanded");
        });

        if (!isExpanded) {
          item.classList.add("is-expanded");
          state.activeProjectId = projectId;

          /* Render the detail inside */
          renderProjectDetail(data, state, projectId, callbacks);

          /* Update skill highlights */
          if (callbacks.onProjectActivate) {
            callbacks.onProjectActivate(projectId);
          }
        } else {
          state.activeProjectId = null;
          if (callbacks.onProjectDeactivate) {
            callbacks.onProjectDeactivate();
          }
        }

        container.querySelectorAll(".project-accordion-header").forEach(function (button) {
          button.setAttribute("aria-expanded", button.closest(".project-accordion-item").classList.contains("is-expanded") ? "true" : "false");
        });
      });

      /* Hover highlights */
      header.addEventListener("mouseenter", function () {
        var projectId = header.closest(".project-accordion-item").dataset.projectId;
        state.hoverProjectId = projectId;
        if (callbacks.onProjectHover) callbacks.onProjectHover(projectId);
      });

      header.addEventListener("mouseleave", function () {
        state.hoverProjectId = null;
        if (callbacks.onProjectLeave) callbacks.onProjectLeave();
      });

      header.setAttribute("aria-expanded", "false");
    });
  }

  function renderProjectDetail(data, state, projectId, callbacks) {
    var project = ns.state.getProjectById(data, projectId);
    var stageIndex = state.activeStageByProject[project.id];

    var inner = document.querySelector('.project-body-inner[data-project-id="' + projectId + '"]');

    inner.innerHTML =
      '<article class="project-view" style="--project-accent:' + project.accent + '">' +
        '<header class="project-view-head star-head">' +
          '<h3>' + project.title + '</h3>' +
          (project.tagline ? '<p class="project-tagline">' + project.tagline + '</p>' : '') +
        '</header>' +

        '<div class="project-meta-row">' +
          '<div class="project-tech-row">' +
            (project.relatedTech || []).map(function (techId) {
              var tech = data.stack.find(function (s) { return s.id === techId; });
              return tech ? ns.icons.renderTechChip(tech, true) : "";
            }).join("") +
          '</div>' +
          renderArtifactLinks(project) +
        '</div>' +

        renderProblemStatement(project) +
        renderApproach(project) +
        renderResult(project) +
        renderScreenshotStrip(project) +
      '</article>';

    /* GSAP entrance animation */
    gsap.from(inner.querySelector(".project-view"), {
      opacity: 0,
      y: 20,
      duration: 0.4,
      ease: "power2.out"
    });

    /* Bind screenshot thumbnails -> lightbox */
    inner.querySelectorAll("[data-screenshot-index]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var idx = Number(btn.dataset.screenshotIndex);
        openScreenshotDialog(project, idx);
      });
    });

    /* Widget panels removed in V4_Arron redesign — STAR-style cards now carry the story. */
  }

  function renderArtifactLinks(project) {
    if (!Array.isArray(project.artifactLinks) || !project.artifactLinks.length) return "";
    return '<div class="project-artifact-row">' +
      project.artifactLinks.map(function (link) {
        return '<a class="project-artifact-link" href="' + link.href + '" target="_blank" rel="noreferrer">' +
          '<span>' + link.label + '</span>' +
          '<small>' + (link.note || "Artifact") + '</small>' +
        '</a>';
      }).join("") +
    '</div>';
  }

  /* ── STAR-style content blocks ───────────── */

  function renderProblemStatement(project) {
    var p = project.problemStatement;
    if (!p) return "";
    var body;
    if (p.narrative) {
      body = '<p class="problem-narrative">' + p.narrative + '</p>';
    } else {
      var sentences = [];
      if (p.who && p.tension) sentences.push("For " + p.who + " facing " + p.tension + ".");
      else if (p.who) sentences.push("For " + p.who + ".");
      else if (p.tension) sentences.push(p.tension + ".");
      if (p.question) sentences.push('<strong>Unanswered question:</strong> ' + p.question);
      body = '<p class="problem-narrative">' + sentences.join(" ") + '</p>';
    }
    return '<section class="star-card problem-card">' +
      '<header class="star-card-head"><h4>Problem statement</h4></header>' +
      body +
    '</section>';
  }

  function renderApproach(project) {
    var a = project.approach;
    if (!a) return "";
    var description = a.description ? '<p class="approach-description">' + a.description + '</p>' : "";
    var aiChips = (a.aiStack || []).map(function (label) {
      return '<span class="ai-keyword">' + label + '</span>';
    }).join("");

    return '<section class="star-card approach-card">' +
      '<header class="star-card-head"><h4>Approach</h4></header>' +
      description +
      (aiChips
        ? '<div class="approach-stack-row">' +
            '<div class="approach-stack-group"><span class="approach-stack-label">AI stack</span><div class="approach-stack-chips">' + aiChips + '</div></div>' +
          '</div>'
        : "") +
    '</section>';
  }

  function renderResult(project) {
    var r = project.result;
    if (!Array.isArray(r) || !r.length) return "";
    return '<section class="star-card result-card-block">' +
      '<header class="star-card-head star-card-head-dark"><h4>Result</h4></header>' +
      '<ul class="result-list">' +
        r.map(function (item) { return '<li>' + item + '</li>'; }).join("") +
      '</ul>' +
    '</section>';
  }

  function renderScreenshotStrip(project) {
    var shots = Array.isArray(project.screenshots)
      ? project.screenshots.filter(function (shot) { return shot && shot.src; }).slice(0, 3)
      : [];

    if (!shots.length) return "";

    var html = shots.map(function (shot, idx) {
      return '<button class="screenshot-thumb" type="button" data-screenshot-index="' + idx + '" aria-label="Open screenshot: ' + (shot.caption || shot.alt || "image " + (idx + 1)) + '">' +
        '<span class="screenshot-frame">' +
          '<img src="' + shot.src + '" alt="' + (shot.alt || "") + '" loading="lazy" onerror="this.closest(\'.screenshot-thumb\').classList.add(\'is-missing\')">' +
        '</span>' +
        '<span class="screenshot-caption">' + (shot.caption || ("Screenshot " + (idx + 1))) + '</span>' +
      '</button>';
    }).join("");

    return '<section class="screenshot-strip-section screenshot-count-' + shots.length + '">' +
      '<header class="star-card-head"><h4>Visual evidence</h4></header>' +
      '<div class="screenshot-strip">' + html + '</div>' +
    '</section>';
  }

  /* ── Lightbox dialog (zero-dependency native dialog) ─ */

  function ensureScreenshotDialog() {
    var dlg = document.getElementById("screenshot-dialog");
    if (dlg) return dlg;

    dlg = document.createElement("dialog");
    dlg.id = "screenshot-dialog";
    dlg.className = "screenshot-dialog";
    dlg.innerHTML =
      '<button class="screenshot-dialog-close" type="button" aria-label="Close">×</button>' +
      '<button class="screenshot-dialog-nav screenshot-dialog-prev" type="button" aria-label="Previous">‹</button>' +
      '<figure class="screenshot-dialog-figure">' +
        '<img class="screenshot-dialog-img" alt="">' +
        '<figcaption class="screenshot-dialog-caption"></figcaption>' +
      '</figure>' +
      '<button class="screenshot-dialog-nav screenshot-dialog-next" type="button" aria-label="Next">›</button>';

    document.body.appendChild(dlg);

    dlg.addEventListener("click", function (event) {
      if (event.target === dlg) dlg.close();
    });
    dlg.querySelector(".screenshot-dialog-close").addEventListener("click", function () { dlg.close(); });
    dlg.querySelector(".screenshot-dialog-prev").addEventListener("click", function () { stepDialog(-1); });
    dlg.querySelector(".screenshot-dialog-next").addEventListener("click", function () { stepDialog(1); });
    document.addEventListener("keydown", function (event) {
      if (!dlg.open) return;
      if (event.key === "ArrowLeft") stepDialog(-1);
      if (event.key === "ArrowRight") stepDialog(1);
    });

    return dlg;
  }

  function openScreenshotDialog(project, index) {
    var shots = Array.isArray(project.screenshots) ? project.screenshots.filter(function (s) { return s && s.src; }) : [];
    if (!shots.length) return;
    var dlg = ensureScreenshotDialog();
    dlg._shots = shots;
    dlg._index = Math.max(0, Math.min(index, shots.length - 1));
    paintDialog(dlg);
    if (typeof dlg.showModal === "function") dlg.showModal();
    else dlg.setAttribute("open", "");
  }

  function stepDialog(delta) {
    var dlg = document.getElementById("screenshot-dialog");
    if (!dlg || !dlg._shots) return;
    var n = dlg._shots.length;
    dlg._index = (dlg._index + delta + n) % n;
    paintDialog(dlg);
  }

  function paintDialog(dlg) {
    var shot = dlg._shots[dlg._index];
    var img = dlg.querySelector(".screenshot-dialog-img");
    var cap = dlg.querySelector(".screenshot-dialog-caption");
    img.src = shot.src;
    img.alt = shot.alt || "";
    cap.textContent = shot.caption || "";
    var nav = dlg.querySelectorAll(".screenshot-dialog-nav");
    nav.forEach(function (b) { b.style.display = dlg._shots.length > 1 ? "" : "none"; });
  }

  ns.projects = {
    renderProjectsAccordion: renderProjectsAccordion
  };
})();
