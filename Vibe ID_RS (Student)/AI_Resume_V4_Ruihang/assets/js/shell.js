(function () {
  const ns = window.aiResume || (window.aiResume = {});

  function render(data) {
    renderTopbar(data);
    renderSnapshot(data);
  }

  function renderTopbar(data) {
    var header = document.getElementById("program-header");
    if (!header) return;

    var ui = data.ui || {};
    var profile = data.profile || {};
    var resumeLink = getResumeHref(data)
      ? '<a class="program-link-button" href="' + getResumeHref(data) + '" target="_blank" rel="noreferrer">Open resume PDF</a>'
      : "";

    header.innerHTML =
      '<div class="program-brand">' +
        '<p class="eyebrow">' + (ui.programEyebrow || "Vibe ID User V3") + '</p>' +
        '<div>' +
          '<h1>' + (profile.shortName || profile.name || "Candidate") + '</h1>' +
          '<p class="program-brand-copy">' + (ui.programBrandCopy || "Single-profile interactive resume with project evidence and selected results.") + '</p>' +
        '</div>' +
      '</div>' +
      '<div class="program-toolbar">' +
        '<div class="program-status-group">' +
          '<span class="program-status-chip">Single profile</span>' +
          '<span class="program-status-chip program-status-chip-soft">' + getFocusLabel(data) + '</span>' +
        '</div>' +
        resumeLink +
      '</div>';
  }

  function renderSnapshot(data) {
    var shellNote = document.getElementById("program-shell-note");
    var directory = document.getElementById("candidate-directory");
    var ui = data.ui || {};

    if (shellNote) {
      shellNote.textContent = ui.programShellNote || "A focused Web ID view: profile, evidence, projects, and artifacts in one page.";
    }

    if (!directory) return;

    var cards = [];
    var directoryData = data.directory || {};
    var highlights = Array.isArray(directoryData.highlights) ? directoryData.highlights : [];

    if (directoryData.role || directoryData.summary) {
      cards.push(
        '<article class="candidate-card is-active">' +
          '<p class="eyebrow">Current focus</p>' +
          '<div class="candidate-card-head">' +
            '<h3>' + (directoryData.role || getFocusLabel(data)) + '</h3>' +
            '<span class="candidate-card-status">Profile</span>' +
          '</div>' +
          '<p class="candidate-card-summary">' + (directoryData.summary || "") + '</p>' +
          '<div class="candidate-card-tags">' +
            highlights.map(function (item) {
              return '<span class="candidate-card-tag">' + item + '</span>';
            }).join("") +
          '</div>' +
        '</article>'
      );
    }

    (data.projects || []).slice(0, 2).forEach(function (project) {
      cards.push(
        '<article class="candidate-card">' +
          '<p class="eyebrow">Featured project</p>' +
          '<div class="candidate-card-head">' +
            '<h3>' + (project.navTitle || project.title) + '</h3>' +
            '<span class="candidate-card-status">Case</span>' +
          '</div>' +
          '<p class="candidate-card-role">' + (project.navMeta || project.source || "") + '</p>' +
          '<p class="candidate-card-summary">' + (project.summary || project.tagline || "") + '</p>' +
        '</article>'
      );
    });

    directory.innerHTML = cards.join("");
  }

  function getResumeHref(data) {
    return data.documents && data.documents.resume
      ? data.documents.resume
      : data.profile && data.profile.resume;
  }

  function getFocusLabel(data) {
    return data.directory && data.directory.role
      ? data.directory.role
      : data.profile && data.profile.positioning
        ? data.profile.positioning
        : "Focused Web ID";
  }

  ns.shell = {
    render: render
  };
})();
