(function () {
  const ns = window.aiResume || (window.aiResume = {});

  const DEVICON_BASE = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";
  const SIMPLE_ICONS_BASE = "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons";

  const iconMap = {
    python: `${DEVICON_BASE}/python/python-original.svg`,
    r: `${DEVICON_BASE}/r/r-original.svg`,
    spark: `${DEVICON_BASE}/apachespark/apachespark-original.svg`,
    sql: `${DEVICON_BASE}/azuresqldatabase/azuresqldatabase-original.svg`,
    typescript: `${DEVICON_BASE}/typescript/typescript-original.svg`,
    fastapi: `${DEVICON_BASE}/fastapi/fastapi-original.svg`,
    flask: `${DEVICON_BASE}/flask/flask-original.svg`,
    react: `${DEVICON_BASE}/react/react-original.svg`,
    nextjs: `${DEVICON_BASE}/nextjs/nextjs-original.svg`,
    sveltekit: `${DEVICON_BASE}/svelte/svelte-original.svg`,
    pytorch: `${DEVICON_BASE}/pytorch/pytorch-original.svg`,
    tensorflow: `${DEVICON_BASE}/tensorflow/tensorflow-original.svg`,
    docker: `${DEVICON_BASE}/docker/docker-original.svg`,
    git: `${DEVICON_BASE}/git/git-original.svg`,
    excel: `${SIMPLE_ICONS_BASE}/microsoftexcel.svg`,
    powerpoint: `${SIMPLE_ICONS_BASE}/microsoftpowerpoint.svg`,
    word: `${SIMPLE_ICONS_BASE}/microsoftword.svg`,
    tableau: `${SIMPLE_ICONS_BASE}/tableau.svg`,
    "power-bi": `${SIMPLE_ICONS_BASE}/powerbi.svg`,
    github: `${SIMPLE_ICONS_BASE}/github.svg`,
    openai: `${SIMPLE_ICONS_BASE}/openai.svg`,
    claude: `${SIMPLE_ICONS_BASE}/anthropic.svg`,
    anthropic: `${SIMPLE_ICONS_BASE}/anthropic.svg`,
    langchain: `${SIMPLE_ICONS_BASE}/langchain.svg`,
    huggingface: `${SIMPLE_ICONS_BASE}/huggingface.svg`,
    vercel: `${SIMPLE_ICONS_BASE}/vercel.svg`,
    vite: `${DEVICON_BASE}/vitejs/vitejs-original.svg`,
    html: `${SIMPLE_ICONS_BASE}/html5.svg`,
    css: `${SIMPLE_ICONS_BASE}/css.svg`,
    javascript: `${DEVICON_BASE}/javascript/javascript-original.svg`,
    shiny: null,
    pinecone: null,
    chromadb: null
  };

  const customIconMap = {
    "license-life": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.3 19 6v5.4c0 4.4-2.8 7.5-7 9.3-4.2-1.8-7-4.9-7-9.3V6l7-2.7Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8.2 12.1 10.7 14.6 16 9.4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    "license-sie": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4h10a2 2 0 0 1 2 2v14l-4-2-3 2-3-2-4 2V6a2 2 0 0 1 2-2Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8.5 9h7M8.5 13h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    certificate: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="9" r="4.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="m9.4 13.1-1.2 6 3.8-2 3.8 2-1.2-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>'
  };

  const orgLogoMap = [
    { pattern: /university of minnesota|umn/i, domain: "umn.edu", initials: "UMN" },
    { pattern: /university of california, san diego|uc san diego|ucsd/i, domain: "ucsd.edu", initials: "UCSD" },
    { pattern: /university of liverpool/i, domain: "liverpool.ac.uk", initials: "UL" },
    { pattern: /xi.?an jiaotong-liverpool|xjtlu/i, domain: "xjtlu.edu.cn", initials: "XJTLU" },
    { pattern: /j\.?p\.?\s*morgan|jpmorgan/i, domain: "jpmorganchase.com", initials: "JPM" },
    { pattern: /industrial and commercial bank of china|icbc/i, domain: "icbc.com.cn", initials: "ICBC" },
    { pattern: /citic/i, domain: "", initials: "CITIC" },
    { pattern: /rbc/i, domain: "rbc.com", initials: "RBC" },
    { pattern: /pgim/i, domain: "pgim.com", initials: "PGIM" },
    { pattern: /forage/i, domain: "theforage.com", initials: "FG" }
  ];

  function escapeAttr(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function makeInitials(label, maxLength) {
    return String(label || "")
      .replace(/&/g, " ")
      .split(/\s+/)
      .filter(Boolean)
      .map(function (part) { return part[0]; })
      .join("")
      .slice(0, maxLength || 2)
      .toUpperCase();
  }

  function fallbackMark(label) {
    const initials = makeInitials(label, 2);

    return '<span class="fallback-mark">' + (initials || "AI") + '</span>';
  }

  function renderTechIcon(id, label) {
    if (customIconMap[id]) {
      return customIconMap[id];
    }

    var src = iconMap[id];
    if (src) {
      return '<img src="' + src + '" alt="' + label + '" loading="lazy">';
    }
    return fallbackMark(label);
  }

  function renderTechChip(tech, highlighted, options) {
    var style = '--tech-color:' + tech.color;
    if (options && typeof options.order === "number") {
      style += ';order:' + options.order;
    }

    return '<span class="tech-chip ' + (highlighted ? "is-highlighted" : "") + '" data-tech-id="' + tech.id + '" style="' + style + '">' +
      '<span class="tech-icon">' + renderTechIcon(tech.id, tech.label) + '</span>' +
      '<span class="tech-label">' + tech.label + '</span>' +
    '</span>';
  }

  function renderOrgLogo(name, meta) {
    var source = [name, meta].filter(Boolean).join(" ");
    var match = orgLogoMap.find(function (item) {
      return item.pattern.test(source);
    });
    var initials = (match && match.initials) || makeInitials(name, 4) || "ORG";
    var src = match && match.domain ? "https://www.google.com/s2/favicons?domain=" + match.domain + "&sz=96" : "";
    var label = escapeAttr(name || "Organization");
    var img = src
      ? "<img src=\"" + src + "\" alt=\"" + label + " logo\" loading=\"lazy\" onerror=\"this.remove();this.parentElement.classList.add('is-placeholder');\">"
      : "";

    return '<span class="org-logo' + (src ? " has-logo" : " is-placeholder") + '" aria-label="' + label + ' logo">' +
      img +
      '<span>' + initials + '</span>' +
    '</span>';
  }

  ns.icons = {
    renderTechChip: renderTechChip,
    renderTechIcon: renderTechIcon,
    renderOrgLogo: renderOrgLogo
  };
})();
