/*
 * shell.js — single-profile header and spotlight cards.
 * Keeps the User V3 chrome but replaces the old multi-job switcher
 * with a compact summary of Aaron's focus areas and artifacts.
 */
(function () {
  var ns = window.aiResume || (window.aiResume = {});

  function render(data, state) {
    renderTopbar(data, state);
    renderDirectory(data);
  }

  function renderTopbar(data, state) {
    var header = document.getElementById("program-header");
    if (!header) return;

    var currentMode = state && state.mode === "vip" ? "Endorsements on" : "Endorsements off";
    var resumeLink = data.documents && data.documents.resume
      ? '<a class="program-link-button" href="' + data.documents.resume + '" target="_blank" rel="noreferrer">Open resume PDF</a>'
      : "";
    var focus = data.directory && data.directory.role ? data.directory.role : "Investment-banking research and market analysis";

    header.innerHTML =
      '<div class="program-brand">' +
        '<p class="eyebrow">Vibe ID™</p>' +
        '<div>' +
          '<h1>' + (data.profile.shortName || data.profile.name) + '</h1>' +
          '<p class="program-brand-copy">Interactive resume focused on investment-banking research, market-signal synthesis, and AI-assisted finance workflow delivery.</p>' +
        '</div>' +
      '</div>' +
      '<div class="program-toolbar">' +
        '<div class="program-status-group">' +
          '<span class="program-status-chip" id="program-mode-chip">' + currentMode + '</span>' +
          '<span class="program-status-chip program-status-chip-soft">' + focus + '</span>' +
        '</div>' +
        resumeLink +
      '</div>';
  }

  function renderDirectory(data) {
    var directory = document.getElementById("candidate-directory");
    if (!directory) return;

    var infoCards = [];
    var highlights = data.directory && Array.isArray(data.directory.highlights) ? data.directory.highlights : [];
    var projects = Array.isArray(data.projects) ? data.projects.slice(0, 2) : [];
    var methods = Array.isArray(data.awards) ? data.awards.slice(0, 2) : [];

    if (data.directory) {
      infoCards.push(
        '<article class="candidate-card is-active">' +
          '<p class="eyebrow">Current focus</p>' +
          '<div class="candidate-card-head">' +
            '<h3>' + data.directory.role + '</h3>' +
            '<span class="candidate-card-status">Profile</span>' +
          '</div>' +
          '<p class="candidate-card-summary">' + data.directory.summary + '</p>' +
          '<div class="candidate-card-tags">' +
            highlights.map(function (item) {
              return '<span class="candidate-card-tag">' + item + '</span>';
            }).join("") +
          '</div>' +
        '</article>'
      );
    }

    projects.forEach(function (project) {
      infoCards.push(
        '<article class="candidate-card">' +
          '<p class="eyebrow">Featured project</p>' +
          '<div class="candidate-card-head">' +
            '<h3>' + project.navTitle + '</h3>' +
            '<span class="candidate-card-status">Demo</span>' +
          '</div>' +
          '<p class="candidate-card-role">' + project.navMeta + '</p>' +
          '<p class="candidate-card-summary">' + project.summary + '</p>' +
        '</article>'
      );
    });

    methods.forEach(function (method) {
      infoCards.push(
        '<article class="candidate-card">' +
          '<p class="eyebrow">Method lens</p>' +
          '<div class="candidate-card-head">' +
            '<h3>' + method.title + '</h3>' +
            '<span class="candidate-card-status">Focus</span>' +
          '</div>' +
          '<p class="candidate-card-summary">' + method.amount + '</p>' +
        '</article>'
      );
    });

    directory.innerHTML = infoCards.join("");
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
