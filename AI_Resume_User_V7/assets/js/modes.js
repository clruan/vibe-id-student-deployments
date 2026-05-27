(function () {
  const ns = window.aiResume || (window.aiResume = {});

  function getSavedMode() {
    return "standard";
  }

  function isVip(state) {
    return false;
  }

  function applyMode(mode) {
    document.body.classList.remove("mode-vip");
    document.body.classList.add("mode-standard");
    document.body.setAttribute("data-mode", "standard");
  }

  function setMode(state, mode) {
    if (state) state.mode = "standard";
    applyMode("standard");
  }

  function renderVipEndorsement(endorsement, options) {
    if (!options || !options.force) {
      if (!document.body.classList.contains("mode-vip")) return "";
    }
    if (!endorsement) return "";

    var variant = options && options.variant ? " vip-endorsement-" + options.variant : "";
    var eyebrow = options && options.eyebrow ? options.eyebrow : "Endorsement";
    var quote = endorsement.quote || endorsement.text || endorsement.summary || "";
    var detail = endorsement.text && endorsement.text !== quote ? endorsement.text : "";
    var personName = endorsement.by || endorsement.name || "";
    var personRole = endorsement.role || "";
    var company = endorsement.company || endorsement.institution || endorsement.organization || "";

    if (!quote && !detail) return "";

    return '<aside class="vip-endorsement' + variant + '">' +
      '<div class="vip-endorsement-body">' +
        '<p class="vip-endorsement-eyebrow">' + eyebrow + '</p>' +
        (quote ? '<blockquote class="vip-endorsement-quote">' + quote + '</blockquote>' : "") +
        (detail ? '<p class="vip-endorsement-text">' + detail + '</p>' : "") +
        renderEndorsementAttribution(endorsement, personName, personRole, company) +
      '</div>' +
    '</aside>';
  }

  function renderEndorsementAttribution(endorsement, personName, personRole, company) {
    if (!personName && !personRole && !company) return "";

    return '<div class="vip-endorsement-attribution">' +
      renderEndorsementLogo(endorsement) +
      '<p class="vip-endorsement-meta">' +
        (personName ? '<strong>' + personName + '</strong>' : "") +
        (personRole ? '<span>' + personRole + '</span>' : "") +
        (company ? '<span>' + company + '</span>' : "") +
      '</p>' +
    '</div>';
  }

  function renderEndorsementLogo(endorsement) {
    if (endorsement.logoSrc) {
      var logoClass = /guidestone/i.test(endorsement.logoText || endorsement.company || endorsement.logoAlt || "")
        ? " vip-endorsement-guidestone"
        : "";
      return '<span class="vip-endorsement-logo' + logoClass + '">' +
        '<img src="' + endorsement.logoSrc + '" alt="' + endorsementLogoAlt(endorsement) + '" loading="lazy" onerror="this.remove();this.parentElement.classList.add(\'is-placeholder\');">' +
        '<span class="vip-endorsement-logo-fallback">' + endorsementLogoText(endorsement) + '</span>' +
      '</span>';
    }

    var source = endorsement.logoText ||
      endorsement.company ||
      endorsement.institution ||
      endorsement.organization ||
      endorsement.role ||
      endorsement.by ||
      "EV";

    var letters = String(source)
      .replace(/&/g, " ")
      .split(/\s+/)
      .filter(Boolean)
      .map(function (part) { return part[0]; })
      .join("")
      .slice(0, 2)
      .toUpperCase();

    if (/guidestone/i.test(source)) {
      return '<span class="vip-endorsement-logo vip-endorsement-guidestone" aria-label="GuideStone Capital Management logo">' +
        '<span class="guidestone-mark" aria-hidden="true"></span>' +
        '<span class="guidestone-wordmark">GuideStone</span>' +
      '</span>';
    }

    return '<span class="vip-endorsement-logo" aria-label="Endorsement source logo">' + (letters || "EV") + '</span>';
  }

  function endorsementLogoAlt(endorsement) {
    return endorsement.logoAlt || "Company logo";
  }

  function endorsementLogoText(endorsement) {
    return endorsement.logoText || endorsement.company || endorsement.institution || endorsement.organization || "Logo";
  }

  function init(state) {
    if (state) {
      state.mode = "standard";
    }
    applyMode("standard");
  }

  ns.modes = {
    getSavedMode: getSavedMode,
    init: init,
    isVip: isVip,
    setMode: setMode,
    renderVipEndorsement: renderVipEndorsement
  };
})();
