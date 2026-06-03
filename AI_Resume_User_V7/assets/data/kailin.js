/*
 * Kailin Liu - V7 source-backed profile.
 * Source boundary: provided Kailin resume PDF and Lumina screenshots.
 */
(function () {
  var registry = window.aiResumeData || (window.aiResumeData = {});
  var aliases = window.aiResumeProfileAliases || (window.aiResumeProfileAliases = {});

  registry["kailin-liu"] = {
    id: "kailin-liu",
    order: 4,
    targetRole: "Product marketing, AI product strategy, and growth analytics profile",
    profile: {
      name: "Kailin Liu",
      shortName: "Kailin Liu",
      location: "New York, NY",
      phone: "(805) 331-8021",
      email: "kailinliu06@gmail.com",
      linkedin: "https://www.linkedin.com/in/kailinliu1105/",
      photo: "assets/media/kailin/Kailin_Liu_portrait.jpeg",
      targetRole: "Product marketing, AI product strategy, and growth analytics profile",
      summary:
        "Marketing Science graduate student at Columbia Business School with source-backed experience in AI product marketing, user research, growth analytics, and GTM execution. I connect customer insight, campaign measurement, product positioning, and AI-assisted prototyping into projects that are concrete enough to inspect.",
      summaryHtml:
        '<strong>Marketing Science</strong> graduate student at <strong>Columbia Business School</strong> with source-backed experience in <strong>AI product marketing</strong>, user research, growth analytics, and GTM execution. I connect customer insight, campaign measurement, product positioning, and <strong>AI-assisted prototyping</strong> into projects that are concrete enough to inspect.'
    },

    documents: {
      resume: "../User_data/Kailin/Kailin Liu_Resume.pdf"
    },

    links: [
      { label: "Email", value: "kailinliu06@gmail.com", href: "mailto:kailinliu06@gmail.com" },
      { label: "LinkedIn", value: "linkedin.com/in/kailinliu1105", href: "https://www.linkedin.com/in/kailinliu1105/" },
      { label: "Resume PDF", value: "Open resume", href: "../User_data/Kailin/Kailin Liu_Resume.pdf" }
    ],

    skillLayout: {
      primary: { group: "analytical", title: "Marketing & Product Skills" },
      secondary: [
        { group: "stack", title: "Tools" },
        { group: "certifications", title: "Credentials" }
      ],
      hideExperienceContext: true
    },
    profileMaterialsMode: "role-alignment",
    hideProfileSourceLinks: true,
    hideAtsKeywordLayer: true,

    analyticalSkills: [
      { label: "Go-to-market strategy", relatedProjects: ["lumina-ai-product", "ai-travel-app", "cocosoft-growth"], relatedExp: ["exp-cocosoft", "exp-raveival"] },
      { label: "Product positioning", relatedProjects: ["lumina-ai-product", "marketing-analytics", "raveival-validation"], relatedExp: ["exp-cardlo", "exp-raveival"] },
      { label: "User research", relatedProjects: ["lumina-ai-product", "ai-travel-app", "raveival-validation"], relatedExp: ["exp-raveival", "exp-boundary"] },
      { label: "Customer interviews", relatedProjects: ["ai-travel-app", "raveival-validation"], relatedExp: ["exp-raveival"] },
      { label: "Campaign measurement", relatedProjects: ["cocosoft-growth"], relatedExp: ["exp-cocosoft"] },
      { label: "A/B testing", relatedProjects: ["cocosoft-growth"], relatedExp: ["exp-cocosoft"] },
      { label: "Influencer partnerships", relatedProjects: ["cocosoft-growth"], relatedExp: ["exp-cocosoft"] },
      { label: "KPI tracking", relatedProjects: ["cocosoft-growth", "ai-travel-app"], relatedExp: ["exp-cocosoft"] },
      { label: "Market research", relatedProjects: ["raveival-validation", "marketing-analytics"], relatedExp: ["exp-raveival"] },
      { label: "Competitive benchmarking", relatedProjects: ["raveival-validation", "cardlo-content"], relatedExp: ["exp-cardlo", "exp-raveival"] },
      { label: "Predictive modeling", relatedProjects: ["marketing-analytics"], relatedExp: [] },
      { label: "LLM-assisted NLP", relatedProjects: ["marketing-analytics"], relatedExp: [] },
      { label: "Information architecture", relatedProjects: ["lumina-ai-product"], relatedExp: ["exp-boundary"] },
      { label: "MVP scoping", relatedProjects: ["lumina-ai-product", "ai-travel-app"], relatedExp: [] },
      { label: "Program management", relatedProjects: ["babanana-production", "ai-travel-app"], relatedExp: ["exp-babanana"] },
      { label: "Cross-functional leadership", relatedProjects: ["babanana-production"], relatedExp: ["exp-babanana"] },
      { label: "Content strategy", relatedProjects: ["cocosoft-growth", "cardlo-content"], relatedExp: ["exp-cardlo"] },
      { label: "Presentation storytelling", relatedProjects: ["lumina-ai-product", "raveival-validation"], relatedExp: ["exp-babanana"] }
    ],

    stack: [
      { id: "sql", label: "SQL", color: "#2563eb" },
      { id: "google-analytics", label: "Google Analytics", color: "#f59e0b" },
      { id: "youtube-analytics", label: "YouTube Analytics", color: "#ef4444" },
      { id: "excel", label: "Excel", color: "#16a34a" },
      { id: "powerpoint", label: "PowerPoint", color: "#ea580c" },
      { id: "figma", label: "Figma", color: "#a855f7" },
      { id: "photoshop", label: "Photoshop", color: "#2563eb" },
      { id: "capcut", label: "CapCut", color: "#111827" },
      { id: "cursor", label: "Cursor / AI Tools", color: "#0f766e" },
      { id: "llm-nlp", label: "LLM-assisted NLP", color: "#7c3aed" }
    ],

    licensesCertifications: [
      { id: "tech-management", label: "Technology Management Certificate", color: "#0f766e" },
      { id: "columbia-ai-club", label: "Columbia AI Club", color: "#7c3aed" },
      { id: "columbia-tech-club", label: "Columbia Technology Club", color: "#2563eb" }
    ],

    atsProfile: {
      title: "ATS",
      split: "Kailin",
      targetRole: "Associate Product Marketing Manager / Product Marketing Manager / Product Strategy and Operations",
      hideDiagnosticNotes: true,
      targetKeywords: [
        "product marketing",
        "go-to-market",
        "GTM strategy",
        "AI products",
        "user insights",
        "growth marketing",
        "campaign measurement",
        "KPI tracking",
        "A/B testing",
        "Google Analytics",
        "Excel",
        "models",
        "visibility",
        "35% increase",
        "SWOT",
        "validation",
        "market research",
        "competitive benchmarking",
        "product positioning",
        "measurement",
        "analytics",
        "cross-functional collaboration"
      ],
      parseSignals: [
        "Gmail, LinkedIn, education, GPA, and source resume are visible in plain text.",
        "Project screenshots are attached to the Lumina AI product project and remain accessible in project detail.",
        "Marketing, GTM, measurement, and user-research keywords appear in skills, experience, and project titles."
      ],
      riskFlags: [
        "Most professional experience is internship or project-based, so senior PMM roles should keep risk flags visible.",
        "Do not claim direct AdTech platform ownership unless the JD only needs adjacent measurement and growth analytics evidence."
      ]
    },

    results: [
      {
        value: "70+",
        label: "influencer partnerships sourced",
        note: "COCOSOFT AI product marketing internship for products such as LoudMe.Ai."
      },
      {
        value: "650K+",
        label: "campaign views generated",
        note: "Influencer marketing workflow also generated 2,500+ registrations."
      },
      {
        value: "7,950",
        label: "reviews modeled",
        note: "Marketing analytics project transformed reviews into a 10-dimension perception framework."
      },
      {
        value: "100+",
        label: "survey/interview inputs",
        note: "AI Travel and Raveival projects used surveys, interviews, and demand validation."
      }
    ],

    experience: [
      {
        id: "exp-cocosoft",
        role: "Overseas Influencer Marketing Intern",
        organization: "COCOSOFT Technology Pte. Ltd. / Shenzhen Jiuling Technology",
        location: "Shenzhen, China",
        dates: "Jul 2024 - Oct 2024",
        bullets: [
          "Sourced and built partnerships with <strong>70+ YouTube influencers</strong> for AI products such as LoudMe.Ai, leading creator selection, multi-round pricing negotiations, and content briefing.",
          "Used <strong>Google Analytics</strong> to analyze traffic sources, user behavior, and registration conversion by influencer; paired creator reporting with <strong>A/B testing</strong> on content framing and posting timing.",
          "Built <strong>Excel</strong> tables comparing CTR, CPM, and conversion across creators to summarize test results.",
          "Built creator performance models to support budget allocation and reduce CPM to <strong>under $15</strong> while generating <strong>2,500+ registrations</strong> and <strong>650,000+ views</strong>."
        ],
        relatedTech: ["google-analytics", "youtube-analytics", "excel"],
        relatedProjects: ["cocosoft-growth"]
      },
      {
        id: "exp-cardlo",
        role: "International Sales & Marketing Assistant",
        organization: "Guangdong Cardlo Biotechnology Co., Ltd.",
        location: "Guangzhou, China",
        dates: "Jul 2023 - Aug 2023",
        bullets: [
          "Optimized B2B product listings on YiXuan and Alibaba through keyword analysis, traffic data analysis, competitor benchmarking, and strategic pricing adjustment, boosting page views by about <strong>35%</strong>.",
          "Created digital marketing content by designing promotional materials, producing product videos, and managing the company Twitter account, driving a <strong>24%</strong> traffic increase."
        ],
        relatedTech: ["photoshop", "capcut", "excel"],
        relatedProjects: ["cardlo-content"]
      },
      {
        id: "exp-raveival",
        role: "Market Research & Business Development Intern",
        originalRole: "Startup Business Development Intern / Market Research Intern",
        organization: "Raveival",
        location: "Santa Barbara, CA",
        dates: "Nov 2022 - May 2023",
        bullets: [
          "Conducted <strong>100+ structured customer interviews</strong> to identify unmet needs in the festival apparel market and synthesize insights into product repositioning.",
          "Designed early-stage demand validation experiments through event activations, scaling waitlist sign-ups from <strong>0 to 400+</strong> in one month.",
          "Conducted competitor research on top festival apparel brands, compiled market reports, and performed SWOT analysis."
        ],
        relatedTech: ["excel", "powerpoint"],
        relatedProjects: ["raveival-validation"]
      },
      {
        id: "exp-boundary",
        role: "Lead Researcher",
        organization: "Boundary Management Research Project",
        location: "Santa Barbara, CA",
        dates: "Fall 2023 - Spring 2024",
        bullets: [
          "Collaborated with a research team to analyze a <strong>13-year healthcare IT Slack dataset</strong>, applying open and axial coding, codebook development, and inter-coder reliability checks.",
          "Built a coding framework and systematically coded thousands of messages from <strong>20+ Slack channels</strong> to support data validity."
        ],
        relatedTech: ["excel"],
        relatedProjects: ["boundary-management"]
      },
      {
        id: "exp-babanana",
        role: "Producer / Music Director",
        organization: "Babanana Drama Club",
        location: "Santa Barbara, CA",
        dates: "Fall 2023 - Spring 2025",
        bullets: [
          "Directed end-to-end execution of two large-scale productions by defining scope, setting milestone roadmap, allocating resources, and leading a <strong>30+ member cross-functional team</strong>.",
          "Balanced creative vision with budget and licensing constraints while mitigating operational risks to deliver performances to <strong>400+ attendees annually</strong>."
        ],
        relatedTech: ["powerpoint"],
        relatedProjects: ["babanana-production"]
      }
    ],

    education: [
      {
        id: "edu-columbia",
        institution: "Columbia Business School",
        school: "Columbia Business School",
        location: "New York, NY",
        degree: "M.S. in Marketing Science",
        dates: "Expected Dec 2026",
        details: "Member of Technology Club, Artificial Intelligence Club, and Columbia Entrepreneurs Organization."
      },
      {
        id: "edu-ucsb",
        institution: "University of California, Santa Barbara",
        school: "University of California, Santa Barbara",
        location: "Santa Barbara, CA",
        degree: "B.A. in Communication & Economics, Double Major",
        dates: "2021 - 2025",
        gpa: "3.75/4",
        details: "Technology Management Certificate; study abroad at Copenhagen Business School and University of Hong Kong."
      }
    ],

    coursework: [
      {
        id: "coursework-marketing-science",
        title: "Marketing Science and Product Coursework",
        bullets: [
          "Advanced Marketing Analytics, Statistical Modeling and Decision Making, Product Management, Database for Business, Growth Hacking, Marketing Intelligence, Managing Brands, and Media Planning & Growth Marketing.",
          "Applied coursework and projects connect user research, product definition, MVP design, marketing analytics, and KPI-based measurement."
        ]
      }
    ],

    awards: [
      {
        title: "Technology Management Certificate",
        org: "University of California, Santa Barbara",
        amount: "Business Strategy · Managing Technology Organizations"
      },
      {
        title: "AI Product Innovation Lab",
        org: "Project artifact",
        amount: "Lumina product notes and provided screenshots"
      }
    ],

    publications: [],

    peerEvaluations: [
      {
        name: "Resume PDF",
        role: "Primary source",
        text: "Documents Columbia Marketing Science training, UCSB GPA, internships, research/project experience, and technical skills."
      },
      {
        name: "Lumina screenshots",
        role: "Product evidence",
        text: "Shows the capture workflow, digital library, AI-classified themes, and influence-network views."
      },
      {
        name: "AI Product notes",
        role: "Product source",
        text: "Captures user problem, MVP choices, blocker log, demo status, and capability-role mapping."
      }
    ],

    ui: {
      metaTitle: "Kailin Liu | AI Resume User V7",
      metaDescription: "Local AI Resume V7 profile for Kailin Liu with AI product, product marketing, growth analytics, and user research evidence.",
      resultsTitle: "Featured AI Projects",
      experienceTitle: "Marketing, Research, and Product Experience",
      projectsTitle: "Selected Marketing and AI Product Projects",
      projectsSubtitle: "Open a project to inspect the workflow, screenshots, source artifacts, metrics, and source-backed reasoning.",
      demoCallout: "Kailin V7 presents each project as hiring evidence: user insight, GTM logic, analytics method, screenshots, and measurable outcomes.",
      educationTitle: "Education",
      awardsTitle: "Capability Themes",
      publicationsTitle: "Source",
      courseworkTitle: "Relevant Coursework & Applied Projects",
      profileMaterialsTitle: "ATS",
      chatTitle: "Ask about Kailin",
      chatPlaceholder: "Ask about Kailin's product marketing projects...",
      chatGreeting: "Hi! I can answer questions about Kailin's AI product work, marketing analytics, GTM experience, education, and projects."
    },

    projects: [
      {
        id: "lumina-ai-product",
        navTitle: "Lumina AI Product",
        navMeta: "AI product innovation lab - insight capture, theme library, behavior patterns, and growth reflection",
        title: "Lumina AI Growth Insight Companion",
        source: "AI Product Innovation Lab notes and provided screenshots",
        tagline: "AI-driven growth journal that turns fragmented thoughts into personal insight archives, themes, patterns, and reflection prompts.",
        problemStatement: {
          narrative: "Kailin identified a specific user problem: ambitious students and young professionals often produce valuable self-reflections after networking, projects, videos, conversations, or emotional moments, but those insights stay scattered across notes, screenshots, saved posts, and memory. Lumina frames the problem as a product opportunity: help users capture short-lived thoughts, connect them over time, and make recurring emotional and behavioral patterns visible."
        },
        approach: {
          description: "The product design uses a low-friction capture flow, an AI-classified digital library, theme grouping, influence mapping, and growth-reflection views. Kailin's product notes document user evidence, first-version problem framing, simplified product definition, MVP feature choices, cut features, blocker log, demo state, and role-capability mapping."
        },
        result: [
          "Defined a focused AI product around capture, classification, behavior-pattern analysis, and growth reflection rather than a broad life-advice tool.",
          "Built a screenshot-backed product interface showing the recording flow, digital life library, theme categories, and influence network.",
          "Mapped the project to user insight, product design, information architecture, and AI-assisted prototyping capabilities."
        ],
        screenshots: [
          { src: "../User_data/Kailin/Kailin_product_img1.png", alt: "Lumina capture interface with tabs for instant recording, digital library, behavior patterns, growth insights, and growth biography", caption: "Capture Flow: Instant Thought Recording" },
          { src: "../User_data/Kailin/Kailin_product_img2.png", alt: "Lumina digital life library showing core themes and structured insight archive", caption: "Insight Archive: Digital Life Library" },
          { src: "../User_data/Kailin/Kailin_product_img3.png", alt: "Lumina theme classification view with relationship, career, expression, and value creation categories", caption: "AI Theme Classification" },
          { src: "../User_data/Kailin/Kailin_product_img4.png", alt: "Lumina influence network view showing people and recurring themes tied to emotional patterns", caption: "Influence Network: People, Themes, and Emotions" }
        ],
        summary:
          "AI product concept that helps users capture fragmented thoughts, classify themes, discover recurring patterns, and generate growth reflections.",
        owned: [
          "Defined the target user as 20-30 year-old students and young professionals navigating information overload, career exploration, and self-reflection.",
          "Scoped the MVP to capture thoughts, analyze patterns, and generate reflection instead of overbuilding direct life advice.",
          "Designed the product evidence flow: screenshots show the capture interface, digital library, category structure, and influence-network view.",
          "Documented cut features, blocker log, demo status, and capability-role mapping in product notes."
        ],
        metrics: [
          { label: "Core modules", value: "5", category: "Product" },
          { label: "Worksheet evidence layers", value: "5", category: "Process" },
          { label: "Target users", value: "20-30", category: "Segment" }
        ],
        relatedTech: ["cursor", "figma", "llm-nlp"],
        relatedExp: ["exp-boundary"],
        accent: "#f97316",
        artifactLinks: [],
        stages: [
          {
            label: "Discover",
            inputTitle: "Fragmented insight moments",
            inputLines: ["Networking reflections", "Saved videos and quotes", "Emotional triggers and recurring doubts"],
            operationTitle: "Convert lived friction into a product problem",
            operationLines: ["Named the target user", "Separated memory loss from deeper pattern confusion", "Captured evidence from personal use and observed peers"],
            outputTitle: "Problem statement",
            outputLines: ["Fragmented thoughts", "Repeated emotional patterns", "Need for long-term self-understanding"],
            pmNote: "The strongest product decision is that the pain is not only note-taking. The product framing treats it as a pattern-recognition and reflection problem."
          },
          {
            label: "Scope",
            inputTitle: "Broad product idea",
            inputLines: ["Capture thoughts", "Analyze patterns", "Generate reflection", "Potential advice and relationship analysis"],
            operationTitle: "Cut to a credible MVP",
            operationLines: ["Kept low-friction recording", "Kept pattern analysis", "Kept growth summaries", "Cut direct life advice from the MVP"],
            outputTitle: "Three-feature MVP",
            outputLines: ["Record moments", "Analyze behavior patterns", "Generate reflections"],
            pmNote: "The cut log is important hiring evidence: Kailin narrowed a broad AI-life assistant into a focused product loop."
          },
          {
            label: "Design",
            inputTitle: "User stories and demo flow",
            inputLines: ["Thought input", "Theme and emotion classification", "Longitudinal archive"],
            operationTitle: "Design a reviewable interface",
            operationLines: ["Created capture screen", "Built digital library taxonomy", "Mapped influence sources and high-frequency themes"],
            outputTitle: "Screenshot-backed prototype",
            outputLines: ["Capture flow", "Theme library", "Influence network"],
            pmNote: "The screenshots matter because they show product information architecture, not just a written product idea."
          },
          {
            label: "Translate",
            inputTitle: "Product artifact and role target",
            inputLines: ["Worksheet", "Screenshots", "APMM / PMM expectations"],
            operationTitle: "Convert project into hiring evidence",
            operationLines: ["Mapped user insight to product design", "Named AI product and information architecture skills", "Prepared a concise project pitch"],
            outputTitle: "Recruiting-ready story",
            outputLines: ["User problem", "MVP tradeoffs", "AI product evidence"],
            pmNote: "The final story is not just 'I made a chatbot'; it is 'I identified a user need, scoped the MVP, and made the product logic inspectable.'"
          }
        ],
        algorithmSummary:
          "The smart part is the classification loop: capture a thought, assign emotion and theme labels, store it in a long-term archive, then surface recurring people, topics, and behavioral patterns as reflection prompts."
      },
      {
        id: "ai-travel-app",
        navTitle: "AI Travel Planner",
        navMeta: "Founder project - segment definition, MVP prototype, user testing, pricing, and acquisition assumptions",
        title: "AI Travel Planning App Founder Project",
        source: "Resume project",
        tagline: "AI-assisted travel planning product with user research, MVP iteration, and monetization assumptions.",
        problemStatement: {
          narrative: "The project targeted travel-planning users who need a more structured way to turn preferences, constraints, and itinerary choices into usable plans. Kailin treated the project like a founder workflow: define the segment, test needs, prototype the experience, and model early pricing and acquisition assumptions."
        },
        approach: {
          description: "Kailin defined the target segment through 100+ surveys and 15+ interviews, prioritized the feature roadmap, built an MVP prototype using vibe coding, iterated UX flows from user testing feedback, and modeled subscription pricing tiers and usage scenarios in Excel."
        },
        result: [
          "Defined target segment and feature priorities from survey and interview evidence.",
          "Built an MVP prototype and iterated UX flows based on structured user testing feedback.",
          "Modeled ARPU, unit economics, and early acquisition experiments to validate monetization assumptions."
        ],
        summary:
          "Founder project using surveys, interviews, vibe-coded MVP prototyping, UX iteration, and pricing analysis for an AI travel-planning product.",
        owned: [
          "Defined target segment through 100+ surveys and 15+ interviews.",
          "Prioritized feature roadmap and built an MVP prototype using vibe coding.",
          "Modeled subscription pricing tiers, ARPU, unit economics, and early acquisition experiments in Excel."
        ],
        metrics: [
          { label: "Surveys", value: "100+", category: "Research" },
          { label: "Interviews", value: "15+", category: "Research" },
          { label: "Modeling", value: "ARPU / unit economics", category: "Business" }
        ],
        relatedTech: ["figma", "cursor", "excel"],
        relatedExp: [],
        accent: "#2563eb",
        stages: [
          {
            label: "Research",
            inputTitle: "Travel-planning segment assumptions",
            inputLines: ["Target travelers", "Preferences and constraints", "Monetization hypothesis"],
            operationTitle: "Collect user evidence",
            operationLines: ["Ran 100+ surveys", "Conducted 15+ interviews", "Translated feedback into segment and roadmap choices"],
            outputTitle: "Target segment",
            outputLines: ["Prioritized needs", "Roadmap inputs", "Validation evidence"],
            pmNote: "The project uses research volume as a decision input rather than jumping directly to an app concept."
          },
          {
            label: "Prototype",
            inputTitle: "Roadmap and user feedback",
            inputLines: ["Feature priorities", "UX assumptions", "Structured testing notes"],
            operationTitle: "Build and iterate MVP",
            operationLines: ["Built prototype with vibe coding", "Tested UX flows", "Adjusted plan from user feedback"],
            outputTitle: "MVP prototype",
            outputLines: ["Reviewable flow", "Iteration evidence", "Product learning"],
            pmNote: "The prototype is framed as a learning loop: build enough to test the travel-planning experience."
          },
          {
            label: "Model",
            inputTitle: "Product usage scenarios",
            inputLines: ["Subscription tiers", "Usage assumptions", "Acquisition experiments"],
            operationTitle: "Estimate business logic",
            operationLines: ["Modeled ARPU", "Estimated unit economics", "Defined early acquisition tests"],
            outputTitle: "Monetization model",
            outputLines: ["Pricing tiers", "ARPU assumptions", "Experiment plan"],
            pmNote: "The business model makes the project closer to product marketing and founder thinking than a pure UX exercise."
          }
        ],
        algorithmSummary:
          "The product logic moves from segment evidence to MVP scope to monetization assumptions, keeping research, UX, and business viability connected."
      },
      {
        id: "cocosoft-growth",
        navTitle: "AI Influencer Growth",
        navMeta: "AI SaaS campaign measurement - creator sourcing, A/B testing, analytics, and budget optimization",
        title: "AI Product Influencer Growth Analytics",
        source: "COCOSOFT marketing internship",
        tagline: "Influencer campaign workflow for AI products such as LoudMe.Ai.",
        problemStatement: {
          narrative: "COCOSOFT needed influencer partnerships and campaign measurement for AI software products serving global users. Kailin's work connected creator sourcing, content briefing, analytics tracking, A/B testing, and budget optimization into a measurable growth workflow."
        },
        approach: {
          description: "The work used Google Analytics and YouTube Analytics to compare traffic, behavior, and conversion by influencer. Kailin paired that with Excel-based CTR, CPM, and conversion models to support creator selection and budget allocation."
        },
        result: [
          "Built partnerships with 70+ YouTube influencers for AI products.",
          "Reduced CPM below $15 through creator comparison and campaign optimization.",
          "Generated 2,500+ registrations and 650,000+ views."
        ],
        summary:
          "AI SaaS campaign workflow combining influencer sourcing, content briefing, analytics, A/B testing, and budget optimization.",
        owned: [
          "Sourced and built partnerships with 70+ YouTube influencers.",
          "Analyzed traffic sources, user behavior, and registration conversion by influencer.",
          "Built Excel models to compare CTR, CPM, and conversion across creators."
        ],
        metrics: [
          { label: "Influencers sourced", value: "70+", category: "Scale" },
          { label: "Registrations", value: "2,500+", category: "Outcome" },
          { label: "Views", value: "650K+", category: "Outcome" },
          { label: "CPM", value: "<$15", category: "Efficiency" }
        ],
        relatedTech: ["google-analytics", "youtube-analytics", "excel"],
        relatedExp: ["exp-cocosoft"],
        accent: "#0f766e",
        stages: [
          {
            label: "Source",
            inputTitle: "AI product campaign goal",
            inputLines: ["Creator universe", "AI product positioning", "Cost efficiency target"],
            operationTitle: "Build creator pipeline",
            operationLines: ["Sourced 70+ influencers", "Compared fit and audience", "Managed pricing negotiation and content briefing"],
            outputTitle: "Partnership set",
            outputLines: ["Creator shortlist", "Content briefs", "Negotiated campaign inputs"],
            pmNote: "The work is credible because it combines partnership execution with measurement, not only outreach."
          },
          {
            label: "Measure",
            inputTitle: "Campaign performance data",
            inputLines: ["Traffic sources", "User behavior", "Registration conversion"],
            operationTitle: "Analyze performance by creator",
            operationLines: ["Used Google Analytics", "Used YouTube Analytics", "Ran content framing and timing tests"],
            outputTitle: "Performance comparison",
            outputLines: ["Creator-level conversion", "CTR / CPM analysis", "A/B testing readout"],
            pmNote: "The analytics layer makes the internship relevant to product marketing and measurement roles."
          },
          {
            label: "Optimize",
            inputTitle: "Creator and conversion readout",
            inputLines: ["CTR", "CPM", "Registration conversion"],
            operationTitle: "Support budget allocation",
            operationLines: ["Built Excel comparison models", "Summarized test results", "Recommended spend allocation"],
            outputTitle: "Campaign outcome",
            outputLines: ["CPM under $15", "2,500+ registrations", "650,000+ views"],
            pmNote: "The strongest result is the combination of efficiency and conversion scale."
          }
        ],
        algorithmSummary:
          "The growth loop compares creator fit, content framing, timing, cost, and downstream conversion before recommending budget allocation."
      },
      {
        id: "marketing-analytics",
        navTitle: "Predictive Marketing Analytics",
        navMeta: "LLM-assisted NLP, clustering, regression, and product-positioning insights from 7,950 reviews",
        title: "Marketing Analytics and Predictive Modeling Project",
        source: "Columbia applied analytics project",
        tagline: "Market perception modeling from unstructured fragrance reviews.",
        problemStatement: {
          narrative: "Product positioning decisions often depend on subjective customer language. This project turned unstructured fragrance reviews into a structured perception framework so attributes could be compared and linked to rating behavior."
        },
        approach: {
          description: "Kailin transformed 7,950 unstructured fragrance reviews into a 10-dimension evaluation framework using LLM-assisted NLP, clustering, and regression modeling. The analysis identified perceived complexity as the strongest rating driver."
        },
        result: [
          "Structured 7,950 reviews into a 10-dimension perception framework.",
          "Used LLM-assisted NLP, clustering, and regression modeling.",
          "Identified perceived complexity as the strongest driver of ratings, with beta +0.18."
        ],
        summary:
          "Transforms unstructured fragrance reviews into structured product-positioning insight through LLM-assisted NLP, clustering, and regression modeling.",
        owned: [
          "Led market perception analysis using 7,950 unstructured fragrance reviews.",
          "Built a 10-dimension evaluation framework with LLM-assisted NLP and clustering.",
          "Used regression modeling to identify perceived complexity as the strongest rating driver."
        ],
        metrics: [
          { label: "Reviews analyzed", value: "7,950", category: "Scale" },
          { label: "Framework", value: "10 dimensions", category: "Method" },
          { label: "Top driver", value: "complexity beta +0.18", category: "Insight" }
        ],
        relatedTech: ["llm-nlp", "excel"],
        relatedExp: [],
        accent: "#7c3aed",
        stages: [
          {
            label: "Structure",
            inputTitle: "Unstructured review text",
            inputLines: ["Fragrance review corpus", "Subjective product language", "Rating outcomes"],
            operationTitle: "Build perception framework",
            operationLines: ["Use LLM-assisted NLP", "Cluster review language", "Map reviews to 10 dimensions"],
            outputTitle: "Structured dataset",
            outputLines: ["Dimension scores", "Review clusters", "Positioning attributes"],
            pmNote: "The work converts fuzzy consumer language into a product-marketing analysis surface."
          },
          {
            label: "Model",
            inputTitle: "Structured perception features",
            inputLines: ["10 dimensions", "Ratings", "Cluster signals"],
            operationTitle: "Estimate rating drivers",
            operationLines: ["Run regression modeling", "Compare attribute strength", "Identify strongest driver"],
            outputTitle: "Driver insight",
            outputLines: ["Complexity beta +0.18", "Attribute prioritization", "Positioning implication"],
            pmNote: "The output is useful because it links product perception to customer value, not just text classification."
          }
        ],
        algorithmSummary:
          "The analytics chain turns natural-language reviews into structured dimensions, then tests which perception attributes best explain rating behavior."
      },
      {
        id: "raveival-validation",
        navTitle: "Demand Validation",
        navMeta: "Startup market research - interviews, activations, waitlist growth, competitor research, and SWOT",
        title: "Raveival Demand Validation and Market Research",
        source: "Startup business development internship",
        tagline: "Early-stage validation for a festival apparel concept.",
        problemStatement: {
          narrative: "The startup needed clearer evidence about customer needs and demand signals in the festival apparel market. Kailin used interviews, event activations, market reports, and SWOT analysis to refine the value proposition and reposition the concept."
        },
        approach: {
          description: "The project combined 100+ structured customer interviews, early-stage event activations, competitor research, market reports, and SWOT analysis."
        },
        result: [
          "Synthesized 100+ customer interviews into unmet-need and value-proposition insights.",
          "Scaled waitlist sign-ups from 0 to 400+ in one month through demand validation experiments.",
          "Built competitor and SWOT research to support product repositioning."
        ],
        summary:
          "Early-stage startup validation workflow using customer interviews, event activations, competitor research, and SWOT analysis.",
        owned: [
          "Conducted 100+ structured customer interviews.",
          "Designed event-activation demand tests that scaled waitlist sign-ups from 0 to 400+.",
          "Compiled market reports and SWOT analysis on top festival apparel competitors."
        ],
        metrics: [
          { label: "Customer interviews", value: "100+", category: "Research" },
          { label: "Waitlist", value: "0 -> 400+", category: "Demand" }
        ],
        relatedTech: ["excel", "powerpoint"],
        relatedExp: ["exp-raveival"],
        accent: "#db2777",
        stages: [
          {
            label: "Learn",
            inputTitle: "Festival apparel concept",
            inputLines: ["Early value proposition", "Customer assumptions", "Competitor landscape"],
            operationTitle: "Collect market evidence",
            operationLines: ["Interview 100+ customers", "Research top brands", "Compile SWOT analysis"],
            outputTitle: "Insight base",
            outputLines: ["Unmet needs", "Competitive positioning", "Repositioning inputs"],
            pmNote: "The project shows practical market research under startup ambiguity."
          },
          {
            label: "Validate",
            inputTitle: "Demand hypotheses",
            inputLines: ["Event context", "Waitlist target", "Positioning changes"],
            operationTitle: "Run activation experiments",
            operationLines: ["Design event activations", "Track waitlist response", "Synthesize demand signal"],
            outputTitle: "Validation result",
            outputLines: ["0 to 400+ waitlist sign-ups", "Refined concept", "Market report"],
            pmNote: "The waitlist result is a concrete adoption signal, not only a research note."
          }
        ],
        algorithmSummary:
          "The validation loop compares what customers say in interviews with what they do during activation tests."
      },
      {
        id: "boundary-management",
        navTitle: "Healthcare IT Research",
        navMeta: "Team research - 13-year Slack dataset, qualitative coding, codebook, and reliability checks",
        title: "Boundary Management Research Project",
        source: "Resume research project",
        tagline: "Collaborative qualitative research on a healthcare IT communication dataset.",
        summary:
          "Team research project analyzing a 13-year healthcare IT Slack dataset with qualitative coding, codebook development, and inter-coder reliability checks.",
        owned: [
          "Collaborated with a research team to analyze a 13-year healthcare IT Slack dataset.",
          "Applied open and axial coding, codebook development, and inter-coder reliability checks.",
          "Systematically coded thousands of messages from 20+ Slack channels."
        ],
        metrics: [
          { label: "Dataset", value: "13 years", category: "Scale" },
          { label: "Channels", value: "20+", category: "Scale" }
        ],
        relatedTech: ["excel"],
        relatedExp: ["exp-boundary"],
        accent: "#0f766e",
        stages: [
          {
            label: "Code",
            inputTitle: "Healthcare IT Slack dataset",
            inputLines: ["13-year dataset", "20+ channels", "Team research context"],
            operationTitle: "Build qualitative coding framework",
            operationLines: ["Develop codebook", "Apply open and axial coding", "Run inter-coder reliability checks"],
            outputTitle: "Research coding output",
            outputLines: ["Systematic message coding", "Validity checks", "Collaboration evidence"],
            pmNote: "This project is useful for PMM roles because it demonstrates qualitative sensemaking and collaboration on messy user/community data."
          }
        ],
        algorithmSummary:
          "The research method makes qualitative signals more reliable through codebook structure and inter-coder checks."
      }
    ]
  };

  aliases.kailin = "kailin-liu";
  aliases["kailin-liu"] = "kailin-liu";
  aliases["kailinliu"] = "kailin-liu";
})();
