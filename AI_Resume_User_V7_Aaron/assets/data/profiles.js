/*
 * profiles.js - local profile registry for AI Resume V7.
 * Source data stays close to the existing V3/Vibe pages; this layer only
 * adapts those sources into the shared V7 template shape.
 */
(function () {
  var registry = window.aiResumeData || (window.aiResumeData = {});
  var aliases = window.aiResumeProfileAliases || (window.aiResumeProfileAliases = {});

  registerAaronFromVibeSource();

  Object.assign(aliases, {
    aaron: "aaron-li",
    "aaron-li": "aaron-li",
    arron: "aaron-li",
    "arron-li": "aaron-li"
  });


  function registerAaronFromVibeSource() {
    var source = window.resumeContent;
    if (!source || !source.profile || source.profile.name.indexOf("Aaron") === -1) return;

    var profile = Object.assign({}, source, {
      id: "aaron-li",
      order: 3,
      targetRole: "Investment research and AI-assisted finance workflow profile",
      documents: {
        resume: rewriteAaronPath(source.profile.resume || "../User_data/Aaron Li/Aaron_Li_Resume.pdf")
      },
      profile: Object.assign({}, source.profile, {
        shortName: "Aaron Li",
        targetRole: "Investment research and AI-assisted finance workflow profile",
        photo: source.profile.photo || "User_data/Aaron Li/1775700440236.jpg",
        resume: rewriteAaronPath(source.profile.resume || "../User_data/Aaron Li/Aaron_Li_Resume.pdf")
      }),
      skillLayout: {
        primary: { group: "analytical", title: "Analytical Skills" },
        secondary: [
          { group: "stack", title: "Technical Stack" },
          { group: "certifications", title: "Certificates" }
        ],
        hideExperienceContext: true
      },
      profileMaterialsMode: "ats-only",
      atsProfile: {
        split: "Calibration set",
        targetRole: "Entry-Level Investment Banking Analyst / Investment Research Analyst",
        scoringUse: "Train finance-language Vibe ID stability and ATS keyword coverage.",
        targetKeywords: [
          "investment banking",
          "financial modeling",
          "valuation",
          "DCF",
          "M&A",
          "company research",
          "credit analysis",
          "market research",
          "Excel",
          "PowerPoint"
        ],
        parseSignals: [
          "Finance project titles stay visible in standard mode.",
          "Source links and project artifacts remain text-addressable."
        ],
        riskFlags: [
          "Do not let AI-product language bury finance keywords.",
          "Quantify research workflow outputs where source material supports it."
        ]
      },
      analyticalSkills: buildAaronAnalyticalSkills(source),
      results: [
        {
          value: "20+",
          label: "public companies analyzed",
          note: "Sector and company research covering business models, revenue drivers, and competitive positioning."
        },
        {
          value: "10+",
          label: "IPO rejection cases structured",
          note: "Cross-sector database of strategic, operational, financial, and compliance red flags."
        },
        {
          value: "3-year",
          label: "credit-spreading model",
          note: "Issuer-level Excel review template for Scotts Miracle-Gro financial statements."
        },
        {
          value: "H1-H6",
          label: "research hypotheses tested",
          note: "Research Agent workflow tracked support, counterevidence, confidence, and conclusions."
        }
      ],
      ui: {
        metaTitle: "Aaron Li | AI Resume User V7",
        metaDescription: "Local AI Resume V7 profile for Aaron Li using the Vibe ID AL finance research and AI product source.",
        resultsTitle: "Featured AI Projects",
        experienceTitle: "Finance and Research Experience",
        projectsTitle: "Selected Finance and AI Projects",
        projectsSubtitle: "Open a project to inspect the workflow, screenshots, source materials, and demo.",
        demoCallout: "Source-backed finance workflows with screenshots, artifacts, and interactive demos.",
        educationTitle: "Education",
        awardsTitle: "Capability Themes",
        publicationsTitle: "Source Artifacts",
        courseworkTitle: "Relevant Coursework & Applied Finance Projects",
        profileMaterialsTitle: "ATS Signal Layer",
        chatTitle: "Ask about Aaron",
        chatPlaceholder: "Ask about Aaron's finance projects...",
        chatGreeting: "Hi! I can answer questions about Aaron's investment research, Market Pulse Copilot, Research Agent workflow, experience, and education."
      },
      publications: [
        {
          authors: "Research Agent project",
          title: "How AI Is Redefining the Value of Entry-Level Investment Banking Analysts",
          journal: "Final research paper",
          year: 2026,
          detail: "Structured paper with H1-H6 hypotheses, evidence limitations, findings, and confidence-aware conclusions."
        },
        {
          authors: "Market Pulse Copilot project",
          title: "AI Product Innovation Worksheet",
          journal: "Product artifact",
          year: 2026,
          detail: "PRD-style worksheet documenting pain discovery, MVP choices, demo flow, blocker log, and capability-role mapping."
        },
        {
          authors: "Credit research project",
          title: "Scotts Miracle-Gro credit-spreading model",
          journal: "Finance workflow artifact",
          year: 2026,
          detail: "Three-year issuer-level financial statement review and portfolio guideline response."
        }
      ],
      peerEvaluations: [
        {
          name: "Tong Li",
          role: "Portfolio Manager",
          text: "Mentor review for Market Pulse: strong project structure with a useful agent-like direction and a suggested next step of expanding the factor model."
        },
        {
          name: "Market Pulse Worksheet",
          role: "AI Product source",
          text: "Documents pain discovery, MVP choices, demo design, Vercel proxy blocker resolution, and analyst capability mapping."
        },
        {
          name: "Research Agent Workbook",
          role: "Research workflow source",
          text: "Captures hypotheses, issue-tree logic, research questions, support/against evidence, collaboration logs, and meta-reflection."
        },
        {
          name: "Resume PDF",
          role: "Primary source",
          text: "Documents UCSD Business Economics training, J.P. Morgan Securities analytics work, One Pioneer client research, and virtual finance simulations."
        }
      ],
      links: (source.links || []).map(function (link) {
        return Object.assign({}, link, { href: rewriteAaronPath(link.href) });
      }),
      projects: (source.projects || []).map(normalizeAaronProject)
    });

    registry["aaron-li"] = profile;
  }

  function normalizeAaronProject(project) {
    var next = Object.assign({}, project);
    if (project.mentorReview && !project.endorsement) {
      next.endorsement = {
        quote: project.mentorReview.quote,
        by: project.mentorReview.mentor,
        role: project.mentorReview.role,
        company: project.mentorReview.company || "GuideStone Capital Management",
        logoText: project.mentorReview.logoText || "GuideStone",
        logoSrc: project.mentorReview.logoSrc || "https://www.guidestone.org/-/media/Brand/Images/Logos/Logo.svg",
        logoAlt: "GuideStone logo"
      };
    }
    next.artifactLinks = (project.artifactLinks || []).map(function (link) {
      return Object.assign({}, link, { href: rewriteAaronPath(link.href) });
    });
    next.screenshots = (project.screenshots || []).map(function (shot) {
      return Object.assign({}, shot, { src: rewriteAaronPath(shot.src) });
    });
    return next;
  }

  function buildAaronAnalyticalSkills(source) {
    var merged = [];
    var seen = {};

    function normalize(label) {
      return String(label || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    }

    function push(item, fallback) {
      var label = item && item.label ? item.label : fallback;
      var key = normalize(label);
      if (!key || seen[key]) return;
      seen[key] = true;
      merged.push(Object.assign({}, item || {}, { label: label }));
    }

    (source.quantToolkit || []).forEach(function (item) {
      push(item);
    });

    (source.analystKeywordGroups || []).forEach(function (group) {
      push({
        label: group.title,
        relatedProjects: [],
        relatedExp: []
      });
    });

    if (merged.length) return merged;

    return [
      { label: "Company analysis" },
      { label: "Valuation modeling" },
      { label: "Financial statement review" },
      { label: "Investment research" }
    ];
  }

  function rewriteAaronPath(path) {
    if (!path || typeof path !== "string") return path;
    return path.replace(/^(\.\.\/)+/, "");
  }
})();
