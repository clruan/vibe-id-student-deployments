/*
 * profiles.js - Ruihang-focused V7 profile registry.
 * The source content is adapted from the historical V4 student page without
 * inventing new claims. This layer adds the V7 presentation contract.
 */
(function () {
  var registry = window.aiResumeData || (window.aiResumeData = {});
  var aliases = window.aiResumeProfileAliases || (window.aiResumeProfileAliases = {});

  registerRuihangFromVibeSource();

  Object.assign(aliases, {
    ruihang: "ruihang-shen",
    "ruihang-shen": "ruihang-shen",
    rs: "ruihang-shen"
  });

  function registerRuihangFromVibeSource() {
    var source = window.resumeContent;
    if (!source || !source.profile || source.profile.name.indexOf("Ruihang") === -1) return;

    var profile = Object.assign({}, source, {
      id: "ruihang-shen",
      order: 1,
      targetRole: "Account strategist and digital marketing coordination profile",
      disableAutoProjectStages: true,
      preserveOriginalProjectText: true,
      preserveOriginalExperienceText: true,
      experienceSkillHighlights: {
        "exp-0": [
          "Partner Outreach",
          "CRM-style Pipeline Tracking",
          "Partner-facing Materials",
          "Deliverable Coordination",
          "Stakeholder Communication"
        ],
        "exp-1": [
          "Campaign Content Strategy",
          "Asset & Timeline Alignment",
          "Performance-driven Optimization",
          "KOL Creator Briefing",
          "Audience Segmentation"
        ],
        "exp-2": [
          "Survey & Interview Analysis",
          "Personas & Customer Journeys",
          "Positioning & USP",
          "MVP Go-to-market Plan"
        ],
        "exp-3": [
          "Client-facing Reports",
          "Paid-media Performance",
          "CTR / CVR / CPA Analysis",
          "Behavioral Segmentation",
          "Excel Reporting Automation"
        ]
      },
      documents: {
        resume: rewriteRuihangPath(source.profile.resume || "../User_data/Ruihang Shen/Ruihang_Shen_Account_Strategist_Resume.pdf")
      },
      profile: Object.assign({}, source.profile, {
        shortName: "Ruihang Shen",
        targetRole: "Account strategist and digital marketing coordination profile",
        photo: "User_data/Ruihang Shen/1777085001887.jpg",
        resume: rewriteRuihangPath(source.profile.resume || "../User_data/Ruihang Shen/Ruihang_Shen_Account_Strategist_Resume.pdf")
      }),
      skillLayout: {
        primary: { group: "quant", title: "Marketing Toolkit" },
        secondary: [
          { group: "stack", title: "Tools & Workflow Signals" }
        ]
      },
      profileMaterialsMode: "ats-only",
      atsProfile: {
        split: "Source-backed V7 conversion",
        targetRole: "Account Strategist / Client Communication / Campaign Reporting / Digital Marketing Coordination",
        scoringUse: "Use as a reviewable Ruihang V7 profile calibrated from the Account Strategist resume source.",
        targetKeywords: [
          "account management",
          "client communication",
          "partner communication",
          "campaign reporting",
          "KPI tracking",
          "Excel dashboards",
          "CRM-style pipeline",
          "performance analysis",
          "deliverable coordination",
          "stakeholder communication",
          "digital marketing coordination",
          "Excel",
          "PowerPoint",
          "Canva"
        ],
        parseSignals: [
          "New resume adds Me2You partnership outreach, CRM-style pipeline tracking, and partner-facing materials.",
          "Campaign reporting and client-facing performance reports are now first-class experience signals.",
          "AI projects expose worksheet, paper, and screenshot evidence as source links."
        ],
        riskFlags: [
          "Keep account strategy claims tied to partner outreach, reporting, coordination, and campaign evidence.",
          "Do not overstate technical engineering depth beyond the provided source files."
        ]
      },
      results: buildResults(),
      ui: {
        metaTitle: "Ruihang Shen | AI Resume User V7",
        metaDescription: "Local AI Resume V7 profile for Ruihang Shen using account strategy, client communication, campaign reporting, and digital marketing coordination sources.",
        resultsTitle: "Featured Account & Campaign Proof",
        experienceTitle: "Account Strategy and Marketing Experience",
        projectsTitle: "Selected Marketing AI Projects",
        projectsSubtitle: "Click any project's Click to learn more badge to open the full project story.",
        demoCallout: "Click to learn more",
        educationTitle: "Education",
        awardsTitle: "Awards",
        publicationsTitle: "Source Artifacts",
        courseworkTitle: "Relevant Coursework & Applied Projects",
        profileMaterialsTitle: "ATS Signal Layer",
        chatTitle: "Ask about Ruihang",
        chatPlaceholder: "Ask about Ruihang's account strategy experience...",
        chatGreeting: "Hi! I can answer questions about Ruihang's account strategy, partner outreach, campaign reporting, AI product workflow, Research Agent project, education, and source artifacts."
      },
      awards: source.awards || [],
      publications: buildSourceArtifacts(),
      peerEvaluations: buildEvidenceNotes(),
      links: (source.links || []).map(function (link) {
        return Object.assign({}, link, { href: rewriteRuihangPath(link.href) });
      }),
      projects: (source.projects || []).map(normalizeRuihangProject)
    });

    profile.coursework = (source.coursework || []).concat([
      {
        title: "Source-backed AI marketing project work",
        bullets: [
          "AI Product worksheet documents pain, target users, MVP scope, bilingual UI proof, and capability mapping for creative brief automation.",
          "Research Agent worksheet and paper document a hypothesis-driven review of how AI is reshaping entry-level marketing work."
        ]
      }
    ]);
    profile.experience = (profile.experience || []).map(addRuihangReadMoreKeywords);

    registry["ruihang-shen"] = profile;
  }

  function addRuihangReadMoreKeywords(item) {
    var keywordMap = {
      "exp-0": [
        { keyword: "100+ Partner Qualification", matchText: "100+ prospective partners" },
        { keyword: "CRM-style Partnership Pipeline", matchText: "CRM-style partnership pipeline" },
        { keyword: "Partner-facing Materials", matchText: "partner-facing materials in Canva" },
        { keyword: "Partner Deliverable Coordination", matchText: "partner deliverables, logo placement, shoutouts, activations, timelines, and messaging" }
      ],
      "exp-1": [
        { keyword: "Asset & Timeline Alignment", matchText: "align assets, approvals, timelines, and placements" },
        { keyword: "Performance-driven Optimization", matchText: "performance-driven optimization" },
        {
          keywords: [
            { keyword: "38% CTR", matchText: "38% CTR" },
            { keyword: "RMB 1.5M GMV", matchText: "RMB 1.5M GMV" }
          ]
        },
        { keyword: "40K Creator Onboarding", matchText: "40K creators" }
      ],
      "exp-2": [
        { keyword: "Survey & Interview Analysis", matchText: "114 survey responses" },
        { keyword: "Personas & Customer Journeys", matchText: "personas, customer journeys" },
        {
          keywords: [
            { keyword: "Positioning & USP", matchText: "positioning and USP" },
            { keyword: "MVP Go-to-market Plan", matchText: "MVP go-to-market plan" }
          ]
        }
      ],
      "exp-3": [
        { keyword: "CTR / CVR / CPA Analysis", matchText: "CTR, CVR, CPA, and CPC" },
        { keyword: "Behavioral Audience Insights", matchText: "audience segmentation and behavioral insights" },
        { keyword: "External Data Coordination", matchText: "external data providers" }
      ]
    };

    if (!item || !keywordMap[item.id]) return item;
    return Object.assign({}, item, { readMoreKeywords: keywordMap[item.id] });
  }

  function buildResults() {
    return [
      {
        value: "100+",
        label: "prospective partners qualified",
        note: "Me2You outreach work built a prioritized partner target list across nonprofits, brands, schools, and local agencies."
      },
      {
        value: "CRM",
        label: "partnership pipeline",
        note: "Tracked contacts, decision-makers, status, next steps, and weekly reporting for active outreach conversations."
      },
      {
        value: "38%",
        label: "campaign CTR",
        note: "JD.com Lunar New Year Stock-Up campaign result from the Account Strategist resume source."
      },
      {
        value: "30%",
        label: "reporting time reduction",
        note: "PHD Media reporting workflow automated cleaning, PivotTables, and calculated fields for weekly client-facing reports."
      }
    ];
  }

  function buildSourceArtifacts() {
    return [
      {
        authors: "AI Product project",
        title: "Creative Brief Automation worksheet and bilingual screenshots",
        journal: "Product artifact",
        year: 2026,
        detail: "Documents pain framing, MVP flow, bilingual design-strategy interface, and marketing-to-design handoff logic."
      },
      {
        authors: "Research Agent project",
        title: "How Generative AI Is Reshaping Entry-Level Marketing Work",
        journal: "Research paper and evidence workbook",
        year: 2026,
        detail: "Hypothesis-driven workflow with support/counterevidence, public-source boundaries, findings, and implications."
      },
      {
        authors: "Resume PDF",
        title: "Ruihang Shen resume source",
        journal: "Primary profile source",
        year: 2026,
        detail: "Documents Me2You, JD.com, BRIEF Lab, PHD Media, University of Minnesota, Northwestern, and GWU background."
      }
    ];
  }

  function buildEvidenceNotes() {
    return [
      {
        name: "AI Product Worksheet",
        role: "Source artifact",
        text: "Supports the creative-brief automation story; worksheet rows are treated as audit anchors, not public copy."
      },
      {
        name: "Research Agent Workbook",
        role: "Source artifact",
        text: "Supports the hypothesis, evidence, and confidence-aware research workflow."
      },
      {
        name: "Resume PDF",
        role: "Primary source",
        text: "Anchors Ruihang's account strategy, partner outreach, campaign reporting, marketing roles, education, and contact details."
      }
    ];
  }

  function normalizeRuihangProject(project) {
    var next = Object.assign({}, project);
    next.artifactLinks = (project.artifactLinks || []).map(function (link) {
      return Object.assign({}, link, { href: rewriteRuihangPath(fixKnownFilename(link.href)) });
    });
    next.screenshots = (project.screenshots || []).map(function (shot) {
      return Object.assign({}, shot, { src: rewriteRuihangPath(fixKnownFilename(shot.src)) });
    });
    next.stages = Array.isArray(project.stages) ? project.stages : [];
    next.metrics = Array.isArray(project.metrics) ? project.metrics : [];
    return next;
  }

  function fixKnownFilename(path) {
    if (!path || typeof path !== "string") return path;
    return path.replace(
      "AI产品创新实验室_Worksheet_RS.xlsx",
      "AI浜у搧鍒涙柊瀹為獙瀹Worksheet_RS.xlsx"
    ).replace(
      "AI_Marketing_Entry_Level_Research_Report_EN_页面_1.jpg",
      "AI_Marketing_Entry_Level_Research_Report_EN_椤甸潰_1.jpg"
    ).replace(
      "AI_Marketing_Entry_Level_Research_Report_EN_页面_2.jpg",
      "AI_Marketing_Entry_Level_Research_Report_EN_椤甸潰_2.jpg"
    ).replace(
      "AI_Marketing_Entry_Level_Research_Report_EN_页面_3.jpg",
      "AI_Marketing_Entry_Level_Research_Report_EN_椤甸潰_3.jpg"
    );
  }

  function rewriteRuihangPath(path) {
    if (!path || typeof path !== "string") return path;
    return path.replace(/^(\.\.\/)+/, "");
  }
})();
