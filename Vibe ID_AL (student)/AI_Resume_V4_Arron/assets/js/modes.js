(function () {
  const ns = window.aiResume || (window.aiResume = {});
  var STORAGE_KEY = "ai-resume-display-mode";

  function getSavedMode() {
    try {
      var savedMode = window.localStorage.getItem(STORAGE_KEY);
      return savedMode === "vip" ? "vip" : "standard";
    } catch (error) {
      return "standard";
    }
  }

  function isVip(state) {
    return Boolean(state && state.mode === "vip");
  }

  function applyMode(mode) {
    var isVipMode = mode === "vip";
    document.body.classList.toggle("mode-vip", isVipMode);
    document.body.classList.toggle("mode-standard", !isVipMode);
    document.body.setAttribute("data-mode", mode);

    var toggle = document.getElementById("mode-toggle");
    var label = document.getElementById("mode-toggle-label");
    var subtitle = document.getElementById("mode-toggle-subtitle");

    if (toggle) {
      toggle.setAttribute("aria-pressed", isVipMode ? "true" : "false");
    }

    if (label) {
      label.textContent = isVipMode ? "VIP endorsements on" : "Standard review";
    }

    if (subtitle) {
      subtitle.textContent = isVipMode
        ? "Experience and project endorsements are visible"
        : "Show endorsement callouts";
    }
  }

  function persistMode(mode) {
    try {
      window.localStorage.setItem(STORAGE_KEY, mode);
    } catch (error) {
      return;
    }
  }

  function setMode(state, mode) {
    var nextMode = mode === "vip" ? "vip" : "standard";
    state.mode = nextMode;
    persistMode(nextMode);
    applyMode(nextMode);
    window.dispatchEvent(new CustomEvent("modechange", { detail: { mode: nextMode } }));
  }

  function bindToggle(state) {
    var toggle = document.getElementById("mode-toggle");
    if (!toggle || toggle.dataset.bound === "true") return;

    toggle.addEventListener("click", function () {
      setMode(state, isVip(state) ? "standard" : "vip");
    });
    toggle.dataset.bound = "true";
  }

  function renderVipEndorsement(endorsement, options) {
    if (!endorsement) return "";

    var variant = options && options.variant ? " vip-endorsement-" + options.variant : "";
    var eyebrow = options && options.eyebrow ? options.eyebrow : "VIP endorsement";
    var message = endorsement.text || endorsement.quote || endorsement.summary || "";
    var metaParts = [endorsement.by, endorsement.role].filter(Boolean);

    if (!message) return "";

    return '<aside class="vip-endorsement vip-only' + variant + '">' +
      '<span class="vip-endorsement-mark">VIP</span>' +
      '<div class="vip-endorsement-body">' +
        '<p class="vip-endorsement-eyebrow">' + eyebrow + '</p>' +
        '<p class="vip-endorsement-quote">' + message + '</p>' +
        '<p class="vip-endorsement-meta">' + metaParts.join(" · ") + '</p>' +
      '</div>' +
    '</aside>';
  }

  function init(state) {
    var initialMode = state && state.mode ? state.mode : getSavedMode();
    if (state) {
      state.mode = initialMode;
    }
    applyMode(initialMode);
    bindToggle(state);
  }

  ns.modes = {
    getSavedMode: getSavedMode,
    init: init,
    isVip: isVip,
    setMode: setMode,
    renderVipEndorsement: renderVipEndorsement
  };
})();
