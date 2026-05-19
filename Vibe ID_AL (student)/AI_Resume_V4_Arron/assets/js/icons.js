(function () {
  const ns = window.aiResume || (window.aiResume = {});

  const DEVICON_BASE = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

  const iconMap = {
    python: `${DEVICON_BASE}/python/python-original.svg`,
    r: `${DEVICON_BASE}/r/r-original.svg`,
    typescript: `${DEVICON_BASE}/typescript/typescript-original.svg`,
    flask: `${DEVICON_BASE}/flask/flask-original.svg`,
    react: `${DEVICON_BASE}/react/react-original.svg`,
    nextjs: `${DEVICON_BASE}/nextjs/nextjs-original.svg`,
    github: `${DEVICON_BASE}/github/github-original.svg`,
    html: `${DEVICON_BASE}/html5/html5-original.svg`,
    css: `${DEVICON_BASE}/css3/css3-original.svg`,
    javascript: `${DEVICON_BASE}/javascript/javascript-original.svg`
  };

  const svgIconMap = {
    excel:
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="4" y="4" width="16" height="16" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 9h8M8 13h8M8 17h8M12 7v12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    powerpoint:
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="4" y="5" width="16" height="12" rx="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 20h8M12 17v3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M12 8v6h5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 8a4 4 0 1 0 4 4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    word:
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 3.8h7l3 3V20a1.8 1.8 0 0 1-1.8 1.8H7A1.8 1.8 0 0 1 5.2 20V5.6A1.8 1.8 0 0 1 7 3.8Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M14 4v4h4M8.4 11h7.2M8.4 14.5h7.2M8.4 18h4.4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    sql:
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><ellipse cx="12" cy="6.5" rx="6.5" ry="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M5.5 6.5v7.8c0 1.7 2.9 3.1 6.5 3.1s6.5-1.4 6.5-3.1V6.5M5.5 10.4c0 1.7 2.9 3.1 6.5 3.1s6.5-1.4 6.5-3.1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    stata:
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 18h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><rect x="7" y="11" width="2.8" height="7" rx="1" fill="currentColor"/><rect x="11" y="7" width="2.8" height="11" rx="1" fill="currentColor"/><rect x="15" y="4" width="2.8" height="14" rx="1" fill="currentColor"/></svg>',
    tableau:
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 4v4M12 16v4M4 12h4M16 12h4M6.8 6.8l2.8 2.8M14.4 14.4l2.8 2.8M17.2 6.8l-2.8 2.8M9.6 14.4l-2.8 2.8" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg>',
    "power-bi":
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="5" y="11" width="3.2" height="7" rx="1.1" fill="currentColor" opacity="0.55"/><rect x="10.4" y="7" width="3.2" height="11" rx="1.1" fill="currentColor" opacity="0.75"/><rect x="15.8" y="4" width="3.2" height="14" rx="1.1" fill="currentColor"/><path d="M4.5 19.5h15.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    "ai-agents":
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="6" cy="7" r="2.4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="18" cy="7" r="2.4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="17" r="2.4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8.1 8.6 10.2 15M15.9 8.6 13.8 15M8.4 7h7.2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    "custom-ai-skills":
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m12 3 7 4-7 4-7-4 7-4Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="m5 12 7 4 7-4M5 17l7 4 7-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M17.5 3.5 18 2l.5 1.5L20 4l-1.5.5L18 6l-.5-1.5L16 4l1.5-.5Z" fill="currentColor"/></svg>',
    vite:
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M13 2 4 13h6l-1 9 11-13h-6l-1-7Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    vercel:
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m12 5 8 14H4L12 5Z" fill="currentColor"/></svg>',
    "license-life":
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 3.8h10A1.8 1.8 0 0 1 18.8 5.6V20L16 18.5 13.2 20 10.4 18.5 7.6 20 5.2 18.7V5.6A1.8 1.8 0 0 1 7 3.8Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="m8.5 11.5 2.2 2.2 4.8-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    "license-sie":
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 3.5 18.5 6v5.2c0 4.1-2.6 7.6-6.5 9.3-3.9-1.7-6.5-5.2-6.5-9.3V6L12 3.5Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="m8.8 12 2.1 2.1 4.4-4.6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    ,
    "public-reports":
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 3.8h7l3 3V20a1.8 1.8 0 0 1-1.8 1.8H7A1.8 1.8 0 0 1 5.2 20V5.6A1.8 1.8 0 0 1 7 3.8Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M14 4v4h4M8.5 11h7M8.5 14.5h7M8.5 18h4.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    "research-database":
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><ellipse cx="12" cy="6.4" rx="6.8" ry="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M5.2 6.4v9.2c0 1.7 3 3 6.8 3s6.8-1.3 6.8-3V6.4M5.2 10.9c0 1.7 3 3 6.8 3s6.8-1.3 6.8-3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M9 17.8l1.6 1.6 3.5-3.8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    "peer-benchmarking-tables":
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="4" y="4.5" width="16" height="15" rx="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4 9h16M4 14h16M9 4.5v15M15 4.5v15" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M7 16.8h1.2M11.4 11.8h1.2M16.4 7h1.2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    "sector-research-notes":
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 3.8h9.2A1.8 1.8 0 0 1 18 5.6V20a1.8 1.8 0 0 1-1.8 1.8H7A1.8 1.8 0 0 1 5.2 20V5.6A1.8 1.8 0 0 1 7 3.8Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M8.5 8.5h6.8M8.5 12h5.2M8.5 15.5h3.2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="m14 17.7 1.8 1.8 3.2-3.6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    "financial-statement-data":
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="4" y="4" width="16" height="16" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 9h8M8 13h8M8 17h5M8 7v12M12 7v12M16 7v8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    "financial-modeling":
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 18h14M7 15l3-3 3 2 4-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="5" y="5" width="14" height="14" rx="2.5" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    "presentation-materials":
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="4" y="5" width="16" height="12" rx="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 20h8M12 17v3M8 13l2-2 2 1.5 3.5-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    "client-facing-materials":
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM16 8a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM3.8 19c.7-2.2 2.2-3.5 4.2-3.5s3.5 1.3 4.2 3.5M12.8 18.6c.6-1.7 1.8-2.7 3.2-2.7 1.6 0 2.8 1 3.4 2.7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    "credit-review-template":
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 3.8h7l3 3V20a1.8 1.8 0 0 1-1.8 1.8H7A1.8 1.8 0 0 1 5.2 20V5.6A1.8 1.8 0 0 1 7 3.8Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M14 4v4h4M8.4 11.5l1.3 1.3 2.4-2.5M8.4 16l1.3 1.3 2.4-2.5M13.8 12h1.8M13.8 16.5h1.8" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    "credit-metrics":
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 19h16M7 16v-5M12 16V7M17 16v-8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M6 7.5c1.6-2 3.6-3 6-3s4.4 1 6 3M9.5 9.5c.7-.7 1.5-1.1 2.5-1.1s1.8.4 2.5 1.1" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="12" cy="12.5" r="1.2" fill="currentColor"/></svg>',
    "portfolio-guideline-response":
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 3.5 18.5 6v5.2c0 4.1-2.6 7.6-6.5 9.3-3.9-1.7-6.5-5.2-6.5-9.3V6L12 3.5Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="m8.7 12 2 2 4.6-4.7M8 18.8h8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    "client-facing-communication":
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 5.5h14a2 2 0 0 1 2 2v7.2a2 2 0 0 1-2 2h-6.2L8.2 20v-3.3H5a2 2 0 0 1-2-2V7.5a2 2 0 0 1 2-2Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M7.5 9.5h9M7.5 13h5.8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    "follow-up-tracker":
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="4" y="5" width="16" height="15" rx="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 3.5v3M16 3.5v3M4 9h16M8 13.2l1.6 1.6 3.2-3.4M8 17.2h7.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    "research-summaries":
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 3.8h10A1.8 1.8 0 0 1 18.8 5.6V20A1.8 1.8 0 0 1 17 21.8H7A1.8 1.8 0 0 1 5.2 20V5.6A1.8 1.8 0 0 1 7 3.8Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8.5 8h7M8.5 11.5h7M8.5 15h4.6M15.5 18.2l2 2 3.2-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    "seminar-materials":
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="4" y="5" width="16" height="12" rx="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 20h8M12 17v3M8 9h8M8 12h5M16.5 12.2l1.6 1.6 2.5-3" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    "client-recommendation":
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 5.5h14v9H8.5L5 18V5.5Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="m8 10.2 2.1 2.1L15.8 7M16.5 12.5h1.2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    "product-comparison-slides":
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="4" y="5" width="16" height="12" rx="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 20h8M12 17v3M9 9v5M15 9v5M7.5 11.5h3M13.5 11.5h3" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    "market-monitoring":
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="4" y="5" width="16" height="13" rx="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M7.5 14.5 10 12l2.2 1.8 4.3-5.3M8 21h8M12 18v3" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    "catalyst-tracking":
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 3.5v3M12 17.5v3M4.5 12h3M16.5 12h3M7.2 7.2l2.1 2.1M14.7 14.7l2.1 2.1M16.8 7.2l-2.1 2.1M9.3 14.7l-2.1 2.1" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="12" r="3.4" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    "price-context":
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 18h14M7 15l3-3 2.5 2 4.5-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 8h2.7M15 15h2.7" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    "technical-levels":
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 7h14M5 12h14M5 17h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M8 5v4M16 10v4M11 15v4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    "fund-flow-context":
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 7h9.5c2.5 0 4.5 2 4.5 4.5S17 16 14.5 16H7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="m9 12-4 4 4 4M15 4l4 3-4 3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    "analyst-briefing":
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 3.8h10A1.8 1.8 0 0 1 18.8 5.6V20A1.8 1.8 0 0 1 17 21.8H7A1.8 1.8 0 0 1 5.2 20V5.6A1.8 1.8 0 0 1 7 3.8Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8.5 8.5h7M8.5 12h7M8.5 15.5h4.8M15 18.2l1.4 1.4 2.8-3.2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    "source-review":
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 4h8l3 3v12.5A1.5 1.5 0 0 1 16.5 21h-9A1.5 1.5 0 0 1 6 19.5v-14A1.5 1.5 0 0 1 7.5 4Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M15 4v4h4M9 11h6M9 14.5h4M14.5 18l1.4 1.4 2.6-3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    "hypothesis-driven-research":
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="10.5" cy="10.5" r="4.8" fill="none" stroke="currentColor" stroke-width="2"/><path d="m14.2 14.2 4.1 4.1M8.4 10.6l1.5 1.5 3-3.3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    "evidence-tables":
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="4" y="4.5" width="16" height="15" rx="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4 9h16M4 14h16M9 4.5v15M15 4.5v15" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    "counterevidence-review":
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 3.5 18.5 6v5.2c0 4.1-2.6 7.6-6.5 9.3-3.9-1.7-6.5-5.2-6.5-9.3V6L12 3.5Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M12 8.5v4.2M12 16.4h.1" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"/></svg>',
    "source-quality-review":
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 3.8h7l3 3V13a6 6 0 0 0-8.7 7H7A1.8 1.8 0 0 1 5.2 18.2V5.6A1.8 1.8 0 0 1 7 3.8Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M14 4v4h4M17.2 17.2l3.1 3.1" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><circle cx="14.7" cy="14.7" r="3.3" fill="none" stroke="currentColor" stroke-width="1.9"/></svg>',
    "confidence-scoring":
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5.2 15.8a7.2 7.2 0 1 1 13.6 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M12 12.8 15.2 9M8 16h8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="16" r="1.2" fill="currentColor"/></svg>',
    "analyst-judgment":
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 4v16M6 8h12M8 8l-3 7h6L8 8ZM16 8l-3 7h6l-3-7Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    "research-memo":
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 3.8h7l3 3V20a1.8 1.8 0 0 1-1.8 1.8H7A1.8 1.8 0 0 1 5.2 20V5.6A1.8 1.8 0 0 1 7 3.8Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M14 4v4h4M8.5 11.2h7M8.5 14.7h7M8.5 18.2h4.2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    "investment-banking-workflow":
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8 7V5.8A1.8 1.8 0 0 1 9.8 4h4.4A1.8 1.8 0 0 1 16 5.8V7M5.8 7h12.4A1.8 1.8 0 0 1 20 8.8v8.4a1.8 1.8 0 0 1-1.8 1.8H5.8A1.8 1.8 0 0 1 4 17.2V8.8A1.8 1.8 0 0 1 5.8 7Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M4 12h16M10 12v1.2h4V12" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    "ai-agent-workflow":
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="6" cy="7" r="2.2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="18" cy="7" r="2.2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="17" r="2.2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8.1 8.5 10.4 15M15.9 8.5 13.6 15M8.5 7h7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'
  };

  function genericToolIcon(label) {
    var text = (label || "").toLowerCase();
    if (/research|source|memo|note|report|disclosure|document|paper|review/.test(text)) {
      return svgIconMap["research-memo"];
    }
    if (/table|benchmark|comparison|data/.test(text)) {
      return svgIconMap["evidence-tables"];
    }
    if (/risk|counter|quality|shield|compliance/.test(text)) {
      return svgIconMap["counterevidence-review"];
    }
    if (/score|metric|gauge|rating|confidence/.test(text)) {
      return svgIconMap["confidence-scoring"];
    }
    if (/judgment|valuation|scale|fit|rationale/.test(text)) {
      return svgIconMap["analyst-judgment"];
    }
    if (/workflow|banking|m&a|deal|client|recommendation/.test(text)) {
      return svgIconMap["investment-banking-workflow"];
    }
    if (/ai|agent|skill|automation/.test(text)) {
      return svgIconMap["ai-agent-workflow"];
    }
    return "";
  }

  function renderTechIcon(id, label) {
    var svg = svgIconMap[id];
    if (svg) {
      return svg;
    }

    var src = iconMap[id];
    if (src) {
      return '<img src="' + src + '" alt="" loading="lazy" onerror="this.parentNode.remove()">';
    }

    return genericToolIcon(label);
  }

  function renderTechChip(tech, highlighted, options) {
    var style = "--tech-color:" + tech.color;
    if (options && typeof options.order === "number") {
      style += ";order:" + options.order;
    }

    var icon = renderTechIcon(tech.id, tech.label);

    return '<span class="tech-chip ' + (highlighted ? "is-highlighted" : "") + '" data-tech-id="' + tech.id + '" style="' + style + '">' +
      (icon ? '<span class="tech-icon">' + icon + "</span>" : "") +
      '<span class="tech-label">' + tech.label + "</span>" +
    "</span>";
  }

  ns.icons = { renderTechChip };
})();
