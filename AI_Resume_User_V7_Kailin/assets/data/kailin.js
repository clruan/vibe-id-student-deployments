/*
 * Kailin Liu standalone V7 profile.
 * Source boundary: provided Kailin resume PDF and provided Lumina screenshots.
 * The wording is lightly tailored for PMM, APMM, GTM, and measurement roles
 * without adding unsupported seniority, ownership, tools, or metrics.
 */
(function () {
  var registry = window.aiResumeData || (window.aiResumeData = {});
  var aliases = window.aiResumeProfileAliases || (window.aiResumeProfileAliases = {});

  registry["kailin-liu"] = {
    id: "kailin-liu",
    order: 1,
    targetRole: "Product marketing, AI product strategy, and growth analytics",
    profile: {
      name: "Kailin Liu",
      shortName: "Kailin",
      title: "Product Marketing & Growth Analytics Candidate",
      location: "New York, NY",
      phone: "(805) 331-8021",
      email: "kailinliu06@gmail.com",
      linkedin: "https://www.linkedin.com/in/kailinliu1105/",
      photo: "assets/media/kailin/Kailin_Liu_portrait.jpeg",
      summary: "Columbia MS Marketing Science candidate with source-backed experience in AI product marketing, creator acquisition, user research, analytics, and early-stage product validation. Her Vibe ID foregrounds GTM execution, measurement thinking, and concise AI product evidence."
    },
    documents: {
      resume: "assets/media/kailin/Kailin_Liu_Resume.pdf"
    },
    links: [
      { label: "Email", value: "kailinliu06@gmail.com", href: "mailto:kailinliu06@gmail.com" },
      { label: "LinkedIn", value: "linkedin.com/in/kailinliu1105", href: "https://www.linkedin.com/in/kailinliu1105/" },
      { label: "Resume PDF", value: "Open resume", href: "assets/media/kailin/Kailin_Liu_Resume.pdf" }
    ],
    skillLayout: {
      primary: { group: "analytical", title: "Marketing & Product Skills" },
      secondary: [
        { group: "stack", title: "Tools & Analytics Stack" },
        { group: "certifications", title: "Credentials" }
      ],
      hideExperienceContext: false,
      introLimits: {
        analytical: 12,
        stack: 8,
        certifications: 4
      }
    },
    profileMaterialsMode: "role-alignment",
    hideProfileSourceLinks: true,
    hideAtsKeywordLayer: true,
    atsProfile: {
      title: "ATS",
      split: "Kailin",
      targetRole: "APMM / Product Marketing Manager / Product Strategy & Operations",
      hideDiagnosticNotes: true,
      targetKeywords: [
        "product marketing",
        "go-to-market strategy",
        "growth marketing",
        "AI product",
        "user insights",
        "campaign measurement",
        "KPI tracking",
        "A/B testing",
        "market research",
        "product positioning",
        "marketing analytics",
        "Google Analytics",
        "YouTube Analytics",
        "Excel",
        "models",
        "visibility",
        "35% increase",
        "SWOT",
        "validation",
        "Figma",
        "SQL",
        "cross-functional collaboration",
        "storytelling",
        "sales enablement",
        "advertiser outcomes"
      ],
      parseSignals: [
        "Uses Gmail contact field: kailinliu06@gmail.com",
        "Education includes Columbia MS Marketing Science and UCSB GPA 3.75/4",
        "Experience bullets expose GA, YouTube Analytics, A/B testing, creator acquisition, CTR, CPM, conversion, and user research terms",
        "Project section is intentionally limited to two selected projects: Lumina AI Product and AI Travel Planner",
        "No unsupported management, revenue ownership, or platform-scale claims are added"
      ],
      riskFlags: [
        "Senior PMM, AdTech platform ownership, and sales enablement leadership are not claimed because the source resume does not state them",
        "AI Travel Planner is presented as a founder project and prototype, not a launched commercial product",
        "Lumina is presented as AI product evidence from provided screenshots, not as paid work experience"
      ]
    },
    analyticalSkills: [
      { id: "product-marketing", label: "Product marketing", relatedProjects: ["lumina-ai-product", "ai-travel-planner"], relatedExp: ["exp-cocosoft", "exp-cardlo"] },
      { id: "ai-product", label: "AI product", relatedProjects: ["lumina-ai-product", "ai-travel-planner"], relatedExp: ["exp-cocosoft", "exp-marketing-analytics"] },
      { id: "go-to-market-strategy", label: "Go-to-market strategy", relatedProjects: ["ai-travel-planner"], relatedExp: ["exp-cocosoft", "exp-cardlo", "exp-raveival"] },
      { id: "growth-marketing", label: "Growth marketing", relatedProjects: ["ai-travel-planner"], relatedExp: ["exp-cocosoft", "exp-cardlo"] },
      { id: "campaign-measurement", label: "Campaign measurement", relatedProjects: ["ai-travel-planner"], relatedExp: ["exp-cocosoft", "exp-cardlo"] },
      { id: "marketing-analytics", label: "Marketing analytics", relatedProjects: ["lumina-ai-product"], relatedExp: ["exp-marketing-analytics", "exp-cocosoft"] },
      { id: "user-insights", label: "User insights", relatedProjects: ["lumina-ai-product", "ai-travel-planner"], relatedExp: ["exp-raveival", "exp-boundary"] },
      { id: "market-research", label: "Market research", relatedProjects: ["ai-travel-planner"], relatedExp: ["exp-raveival", "exp-cardlo"] },
      { id: "product-positioning", label: "Product positioning", relatedProjects: ["lumina-ai-product", "ai-travel-planner"], relatedExp: ["exp-cardlo", "exp-raveival"] },
      { id: "a-b-testing", label: "A/B testing", relatedProjects: ["ai-travel-planner"], relatedExp: ["exp-cocosoft"] },
      { id: "kpi-tracking", label: "KPI tracking", relatedProjects: ["ai-travel-planner"], relatedExp: ["exp-cocosoft", "exp-cardlo"] },
      { id: "cross-functional-collaboration", label: "Cross-functional collaboration", relatedProjects: ["lumina-ai-product"], relatedExp: ["exp-boundary", "exp-babanana"] },
      { id: "storytelling", label: "Storytelling", relatedProjects: ["lumina-ai-product"], relatedExp: ["exp-cardlo", "exp-babanana"] },
      { id: "pricing-analysis", label: "Pricing analysis", relatedProjects: ["ai-travel-planner"], relatedExp: ["exp-cocosoft", "exp-cardlo"] },
      { id: "llm-assisted-nlp", label: "LLM-assisted NLP", relatedProjects: ["lumina-ai-product"], relatedExp: ["exp-marketing-analytics"] },
      { id: "customer-interviews", label: "Customer interviews", relatedProjects: ["ai-travel-planner"], relatedExp: ["exp-raveival"] }
    ],
    stack: [
      { id: "google-analytics", label: "Google Analytics" },
      { id: "youtube-analytics", label: "YouTube Analytics" },
      { id: "excel", label: "Excel" },
      { id: "powerpoint", label: "PowerPoint" },
      { id: "sql", label: "SQL" },
      { id: "figma", label: "Figma" },
      { id: "cursor", label: "Cursor" },
      { id: "photoshop", label: "Photoshop" },
      { id: "capcut", label: "CapCut" },
      { id: "llm-nlp", label: "LLM-assisted NLP" }
    ],
    licensesCertifications: [
      { id: "technology-management", label: "Technology Management Certificate" },
      { id: "columbia-ms", label: "Columbia MS Marketing Science" }
    ],
    results: [
      {
        id: "result-lumina",
        label: "AI Product Evidence",
        value: "Lumina",
        meta: "Screenshots + product narrative"
      },
      {
        id: "result-travel",
        label: "Founder Project",
        value: "AI Travel",
        meta: "Surveys, interviews, MVP, pricing"
      },
      {
        id: "result-cocosoft",
        label: "Growth Campaign",
        value: "650k+ views",
        meta: "2,500+ registrations, CPM under $15"
      }
    ],
    experience: [
      {
        id: "exp-cocosoft",
        role: "Overseas Influencer Marketing Intern",
        organization: "Cocosoft Technology Pte. Ltd. / Shenzhen Jiuling Technology",
        location: "Shenzhen, China",
        dates: "Jul 2024 - Oct 2024",
        bullets: [
          "Sourced and built partnerships with 70+ YouTube influencers for AI products such as LoudMe.Ai, leading influencer selection, pricing negotiation, and content briefing.",
          "Used Google Analytics to analyze traffic sources, user behavior, and registration conversion by influencer; paired creator reporting with A/B testing on content framing and posting timing.",
          "Built Excel tables comparing CTR, CPM, and conversion across creators to summarize test results.",
          "Built creator performance models to support budget allocation and reduce CPM to below $15 while generating 2,500+ registrations and 650,000+ views."
        ],
        relatedTech: ["product-marketing", "growth-marketing", "campaign-measurement", "a-b-testing", "kpi-tracking", "pricing-analysis", "google-analytics", "youtube-analytics", "excel"],
        relatedProjects: ["ai-travel-planner"]
      },
      {
        id: "exp-cardlo",
        role: "International Sales & Marketing Assistant",
        organization: "Guangdong Cardlo Biotechnology Co., Ltd.",
        location: "Guangzhou, China",
        dates: "Jul 2023 - Aug 2023",
        bullets: [
          "Optimized B2B product listings on YiXuan and Alibaba using keyword analysis, traffic analysis, competitor benchmarking, and pricing adjustment.",
          "Created digital marketing materials, product videos, and Twitter content to strengthen brand visibility and drive a 24% traffic increase.",
          "Translated competitor and traffic findings into product messaging changes, contributing to a roughly 35% increase in page views and more customer inquiries."
        ],
        relatedTech: ["product-marketing", "market-research", "product-positioning", "campaign-measurement", "kpi-tracking", "pricing-analysis", "excel", "photoshop", "capcut"],
        relatedProjects: []
      },
      {
        id: "exp-raveival",
        role: "Startup Business Development Intern / Market Research Intern",
        organization: "Raveival",
        location: "Santa Barbara, CA",
        dates: "Nov 2022 - May 2023",
        bullets: [
          "Conducted 100+ structured customer interviews to identify unmet needs in the festival apparel market and refine the value proposition.",
          "Designed early demand validation experiments through event activations, scaling waitlist sign-ups from 0 to 400+ in one month.",
          "Built competitor research and SWOT reports for top festival apparel brands, shaping market positioning and launch assumptions."
        ],
        relatedTech: ["user-insights", "market-research", "go-to-market-strategy", "product-positioning", "customer-interviews", "excel", "powerpoint"],
        relatedProjects: ["ai-travel-planner"]
      },
      {
        id: "exp-marketing-analytics",
        role: "Marketing Analytics & Predictive Modeling Project",
        organization: "Columbia Business School",
        location: "New York, NY",
        dates: "Fall 2025",
        bullets: [
          "Transformed 7,950 unstructured fragrance reviews into a 10-dimension evaluation framework using LLM-assisted NLP, clustering, and regression modeling.",
          "Identified perceived complexity as the strongest rating driver with coefficient +0.18, producing product positioning and attribute-prioritization insights."
        ],
        relatedTech: ["marketing-analytics", "llm-assisted-nlp", "product-positioning", "llm-nlp", "excel"],
        relatedProjects: ["lumina-ai-product"]
      },
      {
        id: "exp-boundary",
        role: "Boundary Management Research Project - Lead Researcher",
        organization: "University of California, Santa Barbara",
        location: "Santa Barbara, CA",
        dates: "Fall 2023 - Spring 2024",
        bullets: [
          "Collaborated with a research team to analyze a 13-year healthcare IT Slack dataset across 20+ channels using qualitative coding.",
          "Built a coding framework with open and axial coding, codebook development, and inter-coder reliability checks to support data validity."
        ],
        relatedTech: ["user-insights", "cross-functional-collaboration", "storytelling", "excel"],
        relatedProjects: []
      },
      {
        id: "exp-babanana",
        role: "Producer / Music Director",
        organization: "Babanana Drama Club",
        location: "Santa Barbara, CA",
        dates: "Fall 2023 - Spring 2025",
        bullets: [
          "Directed end-to-end execution of two large-scale productions by defining scope, setting milestones, allocating resources, and managing budget and licensing constraints.",
          "Led a 30+ member cross-functional team to deliver performances to 400+ attendees annually."
        ],
        relatedTech: ["cross-functional-collaboration", "storytelling", "powerpoint"],
        relatedProjects: []
      }
    ],
    education: [
      {
        degree: "M.S. in Marketing Science",
        school: "Columbia Business School",
        institution: "Columbia Business School",
        location: "New York, NY",
        dates: "Expected Dec 2026",
        note: "Technology Club, Artificial Intelligence Club, Columbia Entrepreneurs Organization",
        details: "Relevant coursework: Advanced Marketing Analytics, Statistical Modeling & Decision Making, Product Management, Database for Business, Growth Hacking, Marketing Intelligence, Managing Brands, Media Planning & Growth Marketing"
      },
      {
        degree: "B.A. in Communication & Economics",
        school: "University of California, Santa Barbara",
        institution: "University of California, Santa Barbara",
        location: "Santa Barbara, CA",
        dates: "2021 - 2025",
        note: "GPA: 3.75/4",
        details: "Study abroad: Copenhagen Business School and University of Hong Kong; Technology Management Certificate"
      }
    ],
    coursework: [
      {
        id: "coursework-marketing",
        title: "Marketing Science Coursework",
        subtitle: "Columbia Business School",
        bullets: [
          "Advanced Marketing Analytics; Statistical Modeling & Decision Making; Product Management",
          "Database for Business; Growth Hacking; Marketing Intelligence; Managing Brands; Media Planning & Growth Marketing"
        ]
      },
      {
        id: "coursework-tech-management",
        title: "Technology Management Certificate",
        subtitle: "University of California, Santa Barbara",
        bullets: [
          "Business Strategy and Managing Technology Organizations"
        ]
      }
    ],
    awards: [],
    publications: [],
    ui: {
      resultsTitle: "Featured AI Projects",
      projectsTitle: "Selected Product & AI Projects",
      experienceTitle: "Experience",
      educationTitle: "Education",
      awardsTitle: "Highlights",
      publicationsTitle: "Source",
      courseworkTitle: "Relevant Coursework",
      profileMaterialsTitle: "ATS"
    },
    projects: [
      {
        id: "lumina-ai-product",
        navTitle: "Lumina AI Product",
        navMeta: "AI product concept with screenshot evidence",
        title: "Lumina AI Product",
        source: "Provided product screenshots",
        summary: "AI personal insight product concept that turns fragmented life notes into classified themes, memory patterns, and reflection prompts.",
        accent: "#0f766e",
        relatedTech: ["product-marketing", "ai-product", "user-insights", "product-positioning", "marketing-analytics", "llm-assisted-nlp", "figma", "cursor"],
        screenshots: [
          { src: "assets/media/kailin/Kailin_product_img1.png", alt: "Lumina capture interface with tabs for recording and digital life library", caption: "Capture flow" },
          { src: "assets/media/kailin/Kailin_product_img2.png", alt: "Lumina digital life library with structured insight archive", caption: "Insight archive" },
          { src: "assets/media/kailin/Kailin_product_img3.png", alt: "Lumina theme classification view", caption: "Theme classification" },
          { src: "assets/media/kailin/Kailin_product_img4.png", alt: "Lumina influence network view connecting people and themes", caption: "Influence map" }
        ],
        problemStatement: {
          narrative: "Users capture scattered thoughts but often lose the larger pattern behind people, emotions, and recurring decisions."
        },
        approach: {
          description: "Framed the product around low-friction capture, AI theme classification, structured archives, and reflection loops that can support positioning for an AI memory and growth tool."
        },
        result: [
          "Clear product story from capture to classification to reflection.",
          "Useful visual proof for AI product thinking, user insight structure, and PMM narrative framing."
        ],
        stages: [
          {
            label: "Product Story",
            inputTitle: "User input",
            inputLines: ["Fragmented notes", "People and event memories", "Recurring emotional themes"],
            operationTitle: "AI organization",
            operationLines: ["Classify themes", "Group repeated patterns", "Map people and influence signals"],
            outputTitle: "User value",
            outputLines: ["Digital life library", "Behavior pattern view", "Reflection-ready insight surface"],
            pmNote: "The strongest PMM signal is the translation from an abstract AI capability into a user-facing value proposition."
          },
          {
            label: "Positioning",
            inputTitle: "Market tension",
            inputLines: ["Generic note tools store information", "Users need higher-order reflection"],
            operationTitle: "Product angle",
            operationLines: ["Position around personal insight", "Use screenshots as proof of feature coherence"],
            outputTitle: "Launch message",
            outputLines: ["Capture your thoughts", "See the patterns", "Turn memory into growth"],
            pmNote: "This is framed honestly as product evidence, not a shipped commercial result."
          }
        ]
      },
      {
        id: "ai-travel-planner",
        navTitle: "AI Travel Planner",
        navMeta: "Founder project - short analysis",
        title: "AI Travel Planning App",
        source: "Resume-listed founder project",
        summary: "Founder project focused on target segment definition, user research, MVP prototyping, pricing assumptions, and early acquisition experiments.",
        accent: "#b45309",
        relatedTech: ["go-to-market-strategy", "growth-marketing", "user-insights", "market-research", "pricing-analysis", "customer-interviews", "figma", "cursor", "excel"],
        problemStatement: {
          narrative: "Travel planning users need faster itinerary decisions, clearer constraints, and enough personalization to trust an AI-assisted planning flow."
        },
        approach: {
          description: "Used 100+ surveys and 15+ interviews to define the segment, prioritize the roadmap, build an MVP prototype with vibe coding, and model subscription pricing in Excel."
        },
        result: [
          "Concise evidence of user research, MVP iteration, pricing analysis, and acquisition-test thinking.",
          "Best fit for APMM and PMM roles asking for strategy, customer insight, and product launch judgment."
        ],
        stages: [
          {
            label: "Short Analysis",
            inputTitle: "Research input",
            inputLines: ["100+ surveys", "15+ interviews", "Structured user testing feedback"],
            operationTitle: "Product and GTM logic",
            operationLines: ["Prioritize feature roadmap", "Model pricing tiers and ARPU assumptions", "Define acquisition experiments"],
            outputTitle: "PMM signal",
            outputLines: ["Segment clarity", "MVP story", "Monetization assumptions"],
            pmNote: "This stays short because the resume already carries the core evidence; the Vibe ID should make it easy to scan."
          }
        ]
      }
    ]
  };

  aliases.kailin = "kailin-liu";
  aliases["kailin-liu"] = "kailin-liu";
  aliases["kailinliu"] = "kailin-liu";
})();
