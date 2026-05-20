/*
 * shell.js — User V3 candidate shell.
 * Keeps the Duke V3 header/directory structure, while allowing a one-role
 * Web ID to provide candidate-specific copy through data.ui.
 */
(function () {
  var ns = window.aiResume || (window.aiResume = {});

  function render(data, state) {
    renderTopbar(data, state);
    renderDirectory(data);
  }

  function renderTopbar(data, state) {
    var header = document.getElementById("program-header");
    if (!header || !window.resumeProgram) return;

    var program = window.resumeProgram;
    var ui = data.ui || {};
    var currentMode = state && state.mode === "vip" ? "Endorsements on" : "Endorsements off";
    var resumeLink = data.documents && data.documents.resume
      ? '<a class="program-link-button" href="' + data.documents.resume + '" target="_blank" rel="noreferrer">Open resume PDF</a>'
      : "";

    var options = program.tracks.map(function (track) {
      var opts = track.jobs.map(function (entry) {
        var selected = entry.id === program.activeJobId ? ' selected' : "";
        return '<option value="' + entry.id + '"' + selected + '>' + entry.job.targetRole + '</option>';
      }).join("");
      return '<optgroup label="' + track.name + '">' + opts + '</optgroup>';
    }).join("");

    header.innerHTML =
      '<div class="program-brand">' +
        '<p class="eyebrow">' + (ui.programEyebrow || "AI Resume User V3") + '</p>' +
        '<div>' +
          '<h1>' + (ui.programTitle || "Candidate Web ID in User V3") + '</h1>' +
          '<p class="program-brand-copy">' + (ui.programCopy || "Current resume, projects, and source materials fitted into the User V3 interaction system.") + '</p>' +
        '</div>' +
      '</div>' +
      '<div class="program-toolbar">' +
        '<label class="program-select-field" for="job-switcher">' +
          '<span class="program-field-label">Target role</span>' +
          '<select id="job-switcher" class="program-select">' + options + '</select>' +
        '</label>' +
        '<div class="program-status-group">' +
          '<span class="program-status-chip" id="program-mode-chip">' + currentMode + '</span>' +
          '<span class="program-status-chip program-status-chip-soft">' + data.track + ' \u00b7 ' + data.level + '</span>' +
        '</div>' +
        resumeLink +
      '</div>';

    var switcher = document.getElementById("job-switcher");
    if (switcher) {
      switcher.addEventListener("change", function () {
        window.location.href = window.resumeProgram.buildJobUrl(switcher.value);
      });
    }
  }

  function renderDirectory(data) {
    var directory = document.getElementById("candidate-directory");
    if (!directory || !window.resumeProgram) return;

    var program = window.resumeProgram;
    var activeId = program.activeJobId;
    var ui = data.ui || {};

    var eyebrow = document.querySelector(".program-shell .eyebrow");
    var title = document.getElementById("program-shell-title");
    var note = document.querySelector(".program-shell-note");
    if (eyebrow) eyebrow.textContent = ui.shellEyebrow || "Target role";
    if (title) title.textContent = ui.shellTitle || "Current Web ID profile";
    if (note) note.innerHTML = ui.shellNote || 'Current target: <strong id="program-active-title"></strong>.';

    directory.innerHTML = program.tracks
      .map(function (track) {
        var cards = track.jobs.map(function (entry) {
          var job = entry.job;
          var isActive = entry.id === activeId;
          var highlights = (job.directory && job.directory.highlights) || [];

          return '<a class="candidate-card ' + (isActive ? "is-active" : "") + '" href="' + program.buildJobUrl(entry.id) + '">' +
            '<p class="eyebrow">' + (isActive ? "Viewing now" : "Switch to") + '</p>' +
            '<div class="candidate-card-head">' +
              '<h3>' + job.targetRole + '</h3>' +
              '<span class="candidate-card-status">' + (isActive ? "Current" : "Open") + '</span>' +
            '</div>' +
            '<p class="candidate-card-role">' + job.directory.role + '</p>' +
            '<p class="candidate-card-summary">' + job.directory.summary + '</p>' +
            '<div class="candidate-card-tags">' +
              highlights.map(function (h) { return '<span class="candidate-card-tag">' + h + '</span>'; }).join("") +
            '</div>' +
          '</a>';
        }).join("");

        return '<section class="job-track">' +
          '<header class="job-track-head">' +
            '<h3 class="job-track-title">' + track.name + '</h3>' +
            '<span class="job-track-count">' + track.jobs.length + ' ' + (track.jobs.length === 1 ? "role" : "roles") + '</span>' +
          '</header>' +
          '<div class="job-track-grid">' + cards + '</div>' +
        '</section>';
      })
      .join("");

    var activeTitle = document.getElementById("program-active-title");
    if (activeTitle) {
      activeTitle.textContent = data.targetRole;
    }
  }

  function syncMode(state) {
    var chip = document.getElementById("program-mode-chip");
    if (!chip) return;
    chip.textContent = state && state.mode === "vip" ? "Endorsements on" : "Endorsements off";
  }

  ns.shell = {
    render: render,
    syncMode: syncMode
  };
})();
