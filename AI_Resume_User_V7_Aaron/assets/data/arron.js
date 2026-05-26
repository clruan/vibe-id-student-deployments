(function () {
  window.aiResumeData = window.aiResumeData || {};

  window.aiResumeData["arron-li"] = {
    id: "arron-li",
    order: 1,
    targetRole: "IB analyst and market research roles",
    profile: {
      name: "Mingxuan (Aaron) Li",
      shortName: "Aaron Li",
      summary:
        "Business Economics student at UC San Diego focused on investment-banking research, market analysis, and AI-assisted finance workflows. I turn fragmented company, market, and product information into structured snapshots, pitch materials, and demo-ready tools.",
      summaryHtml:
        'Business Economics student at <strong>UC San Diego</strong> focused on <strong>investment-banking research</strong>, <strong>market analysis</strong>, and <strong>AI-assisted finance workflows</strong>. I turn fragmented company, market, and product information into structured snapshots, pitch materials, and demo-ready tools.',
      location: "San Diego, CA",
      phone: "+1 626-877-5905",
      email: "limingxuan513@gmail.com",
      linkedin: "https://www.linkedin.com/in/mingxuanaaronli"
    },

    documents: {
      resume: "../User_data/Arron Li/Aaron_Li_Resume.pdf"
    },

    directory: {
      role: "Investment-banking research, market analysis, and AI product execution",
      summary: "Combines finance fundamentals, source-backed research, and lightweight AI product delivery for analyst-style workflows.",
      highlights: [
        "Financial statement snapshots",
        "Market signal synthesis",
        "AI-assisted research validation"
      ]
    },

    ui: {
      metaTitle: "Aaron Li | AI Resume User V3",
      metaDescription: "User-facing interactive resume for Aaron Li with investment-banking research, Market Pulse Copilot, and Research Agent project demos.",
      resultsTitle: "Selected Results",
      modeNote: "Show source-backed fit notes in Experience and Projects.",
      experienceTitle: "Research and Professional Experience",
      projectsTitle: "Selected Finance and AI Projects",
      projectsSubtitle: "Open a project to inspect the actual workflow logic: market-signal synthesis for Market Pulse, and hypothesis-to-evidence control for Research Agent.",
      demoCallout: "The demos are customized around Aaron's artifacts: ticker analysis, three-part market briefs, evidence tables, confidence ratings, and source-quality checks.",
      educationTitle: "Education",
      awardsTitle: "Capability Themes",
      publicationsTitle: "Source Artifacts",
      peersTitle: "Evidence Notes",
      chatTitle: "Ask about Aaron",
      chatPlaceholder: "Ask about Aaron's finance projects...",
      chatGreeting: "Hi! I can answer questions about Aaron's investment-banking research, Market Pulse Copilot, Research Agent workflow, experience, and education. What would you like to know?"
    },

    results: [
      {
        value: "10-15m -> 1-3m",
        label: "market-analysis compression",
        note: "Market Pulse worksheet targets faster first-pass stock or index analysis from fragmented sources."
      },
      {
        value: "30s",
        label: "demo success target",
        note: "Product success standard: generate a structured three-part analysis within 30 seconds."
      },
      {
        value: "6",
        label: "M&A targets screened",
        note: "JPMorgan Chase Forage simulation screened six acquisition targets for Asian-market expansion."
      },
      {
        value: "H1-H6",
        label: "research hypotheses tested",
        note: "Research Agent workflow tracked support, counterevidence, confidence, and conclusions for six hypotheses."
      }
    ],

    quantToolkit: [
      { label: "Financial statement snapshots", relatedProjects: ["ib-research"], relatedExp: ["exp-0"] },
      { label: "Revenue driver analysis", relatedProjects: ["ib-research"], relatedExp: ["exp-0"] },
      { label: "Peer benchmarking", relatedProjects: ["ib-research"], relatedExp: ["exp-0"] },
      { label: "Corporate structure research", relatedProjects: ["ib-research"], relatedExp: ["exp-0"] },
      { label: "DCF valuation", relatedProjects: ["ib-research"], relatedExp: ["exp-1"] },
      { label: "M&A target screening", relatedProjects: ["ib-research"], relatedExp: ["exp-1"] },
      { label: "Insurance product comparison", relatedProjects: ["insurance-analysis"], relatedExp: ["exp-2"] },
      { label: "Market catalyst synthesis", relatedProjects: ["market-pulse"], relatedExp: [] },
      { label: "Technical level framing", relatedProjects: ["market-pulse"], relatedExp: [] },
      { label: "Funds-flow framing", relatedProjects: ["market-pulse"], relatedExp: [] },
      { label: "MVP scoping", relatedProjects: ["market-pulse"], relatedExp: [] },
      { label: "AI prompt iteration", relatedProjects: ["market-pulse", "research-agent"], relatedExp: [] },
      { label: "Issue-tree design", relatedProjects: ["research-agent"], relatedExp: [] },
      { label: "Support/against evidence", relatedProjects: ["research-agent"], relatedExp: [] },
      { label: "Confidence-aware conclusions", relatedProjects: ["research-agent"], relatedExp: [] },
      { label: "Source-quality control", relatedProjects: ["research-agent"], relatedExp: [] }
    ],

    stack: [
      { id: "excel", label: "Excel", color: "#15803d" },
      { id: "powerpoint", label: "PowerPoint", color: "#d97706" },
      { id: "word", label: "Word", color: "#2563eb" },
      { id: "python", label: "Python", color: "#2563eb" },
      { id: "r", label: "R", color: "#2563eb" },
      { id: "sql", label: "SQL", color: "#0f766e" },
      { id: "stata", label: "Stata", color: "#1d4ed8" },
      { id: "react", label: "React", color: "#38bdf8" },
      { id: "typescript", label: "TypeScript", color: "#3178c6" },
      { id: "vite", label: "Vite", color: "#ea580c" },
      { id: "vercel", label: "Vercel", color: "#111827" },
      { id: "finance", label: "Financial Modeling", color: "#0f766e" },
      { id: "research", label: "Market Research", color: "#7c3aed" }
    ],

    experience: [
      {
        id: "exp-0",
        role: "Corporate & Research - Analytics Associate Program",
        organization: "J.P. Morgan Securities",
        location: "",
        dates: "Jun 2025 - Aug 2025",
        bullets: [
          "Analyzed public companies using <strong>standardized internal templates</strong>, summarizing business models, revenue drivers, product segments, and industry positioning from reports and disclosures.",
          "Extracted and organized financial data from <strong>income statements, balance sheets, and cash flow statements</strong>, compiling revenue, operating income, assets, and margins into structured comparison snapshots.",
          "Conducted industry benchmarking across production capacity, operational scale, and market positioning to identify above- or below-average peer companies.",
          "Researched corporate structures, subsidiaries, and <strong>2024 IPO rejection cases</strong>, summarizing strategic roles, operational scope, and financial or compliance risks for analyst decision support."
        ],
        relatedTech: ["excel", "powerpoint", "word", "research", "finance"],
        relatedProjects: ["research-agent", "ib-research"],
        endorsement: {
          text: "Direct evidence of analyst-style work: company screens, financial snapshots, peer benchmarking, and risk summaries built for internal comparison.",
          by: "Resume source",
          role: "Experience evidence"
        }
      },
      {
        id: "exp-1",
        role: "Investment Banking Job Simulation",
        organization: "JPMorgan Chase - Forage",
        location: "",
        dates: "Project simulation",
        bullets: [
          "Screened <strong>six potential acquisition targets</strong> for a North American beverage company seeking expansion into Asian markets.",
          "Researched regional market conditions, consumer segments, operational models, product offerings, and distribution strategies to assess strategic fit.",
          "Developed a <strong>DCF valuation model</strong> for the preferred acquisition target, projecting financial performance and free cash flows to estimate enterprise value.",
          "Converted target-screening and valuation work into a mock client recommendation for preliminary cross-border M&A discussions."
        ],
        relatedTech: ["excel", "powerpoint", "finance", "research"],
        relatedProjects: ["ib-research"],
        endorsement: {
          text: "Useful for IB recruiting because it shows the whole junior workflow: screen targets, research the market, model value, and communicate a recommendation.",
          by: "Project source",
          role: "Simulation evidence"
        }
      },
      {
        id: "exp-2",
        role: "Client Service & Research Assistant",
        organization: "One Pioneer",
        location: "",
        dates: "Jun 2024 - Mar 2025",
        bullets: [
          "Supported client service operations by helping managers onboard prospective clients during marketing events and organize client information, lead lists, follow-up opportunities, and structured records.",
          "Prepared PowerPoint materials for internal training and client seminars explaining insurance products, company offerings, policy structures, features, and coverage options.",
          "Conducted comparative research on insurance products across providers, analyzing pricing, coverage terms, product positioning, and preliminary quotations.",
          "Produced clear comparison slides to support client-facing education and product discussions."
        ],
        relatedTech: ["excel", "powerpoint", "word", "research"],
        relatedProjects: ["insurance-analysis"],
        endorsement: {
          text: "Shows client-facing finance communication: translating product terms, riders, pricing, and comparisons into usable presentation material.",
          by: "Resume source",
          role: "Client research evidence"
        }
      }
    ],

    education: [
      {
        degree: "B.A. in Business Economics",
        school: "University of California, San Diego",
        dates: "Expected Jun 2026",
        gpa: "3.6/4.00",
        note: "Course and project focus: finance, business economics, market research, valuation, and structured analysis."
      }
    ],

    awards: [
      {
        title: "Analyst Research",
        org: "Capability theme",
        amount: "Company snapshots, financial statements, benchmarking, IPO-risk research"
      },
      {
        title: "AI Product Execution",
        org: "Capability theme",
        amount: "Pain discovery, MVP scoping, React/TypeScript demo, Vercel proxy deployment"
      },
      {
        title: "Evidence Discipline",
        org: "Capability theme",
        amount: "Hypotheses, issue trees, support/against evidence, confidence-aware conclusions"
      }
    ],

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
        authors: "Market Pulse Copilot demo",
        title: "React / TypeScript / Vite Market Signal Demo",
        journal: "Live demo artifact",
        year: 2026,
        detail: "Deployed on Vercel with ticker input and structured price, company, news, technical, funds-flow, and integrated judgment panels."
      }
    ],

    peerEvaluations: [
      {
        name: "Resume PDF",
        role: "Primary source",
        text: "Documents Aaron's UCSD Business Economics background, J.P. Morgan Securities analytics program, One Pioneer research role, IB simulations, and project portfolio."
      },
      {
        name: "Market Pulse Worksheet",
        role: "AI Product source",
        text: "Shows the actual product reasoning: fragmented market information, three-feature MVP, demo design, Vercel proxy blocker resolution, and role-capability mapping."
      },
      {
        name: "Research Agent Workbook",
        role: "Research workflow source",
        text: "Captures hypotheses, issue-tree logic, research questions, support/against evidence, collaboration logs, iteration history, and meta-reflection."
      },
      {
        name: "Research Paper",
        role: "Final artifact",
        text: "Synthesizes AI's impact on junior investment-banking work without overstating the evidence, keeping finance fundamentals and human review central."
      }
    ],

    links: [
      { label: "Email", value: "limingxuan513@gmail.com", href: "mailto:limingxuan513@gmail.com" },
      { label: "LinkedIn", value: "linkedin.com/in/mingxuanaaronli", href: "https://www.linkedin.com/in/mingxuanaaronli" },
      { label: "Market Pulse Demo", value: "Live demo", href: "https://market-pulse-copilot-8wrk1wtvq-limingxuan513-commits-projects.vercel.app/" },
      { label: "Resume PDF", value: "Open resume", href: "../User_data/Arron Li/Aaron_Li_Resume.pdf" }
    ],

    projects: [
      {
        id: "market-pulse",
        navTitle: "Market Pulse Copilot",
        navMeta: "React/TypeScript demo | ticker -> three-part market brief",
        title: "Market Pulse Copilot for Fast Stock and Index Analysis",
        source: "AI Product Innovation Worksheet",
        summary:
          "A working product concept for high-frequency US-market watchers who need to combine news catalysts, technical position, and funds-flow signals into a short structured view.",
        owned: [
          "Defined the pain point around fragmented market signals across news, charts, and funds-flow pages.",
          "Scoped the MVP to three required functions: key-news discovery, technical-position labeling, and a three-dimensional brief.",
          "Built a React / TypeScript / Vite web demo and moved from GitHub Pages to a Vercel API proxy after static hosting could not support the Yahoo Finance data path.",
          "Documented the blocker log, demo flow, success standards, and capability-role mapping for IB analyst recruiting."
        ],
        metrics: [
          { label: "Time target", value: "10-15m -> 1-3m" },
          { label: "Output target", value: "30 sec" },
          { label: "Core modules", value: "3" }
        ],
        endorsement: {
          text: "This project is strongest when read as an analyst productivity demo: Aaron identified a real workflow bottleneck, cut non-MVP features, shipped the demo, and explained the finance judgment layer.",
          by: "Source-artifact review",
          role: "AI product evidence"
        },
        relatedTech: ["react", "typescript", "vite", "vercel", "python", "finance", "research"],
        accent: "#0f766e",
        artifactLinks: [
          {
            label: "Open live demo",
            href: "https://market-pulse-copilot-8wrk1wtvq-limingxuan513-commits-projects.vercel.app/",
            note: "Vercel deployment"
          },
          {
            label: "Open product worksheet",
            href: "../User_data/Arron Li/AI Product/Market Pulse Copilot - Completed.xlsx",
            note: "XLSX source"
          },
          {
            label: "Open project deck",
            href: "../User_data/Arron Li/AI Product/Market Pulse Copilot.pptx",
            note: "PPTX source"
          }
        ],
        stages: [
          {
            label: "Discover",
            inputTitle: "Repeated market-analysis friction",
            inputLines: ["News, charts, and funds-flow signals split across pages", "Open, intraday, and after-close review contexts", "Missed or late market signal discovery"],
            operationTitle: "Turn the pain into a concrete user problem",
            operationLines: ["Named the target user as frequent US-market watchers", "Separated information discovery from judgment formation", "Rejected the idea that simply checking more pages fixes the issue"],
            outputTitle: "Problem statement",
            outputLines: ["Fragmented signals", "Fast updates", "Delayed structured conclusion"],
            pmNote: "The worksheet is credible because it starts from a specific opportunity-cost story instead of a broad 'AI stock assistant' idea."
          },
          {
            label: "Scope",
            inputTitle: "User problem and constraints",
            inputLines: ["Time pressure", "Information overload", "Need for clear signal priority"],
            operationTitle: "Cut to the MVP chain",
            operationLines: ["Keep key-news discovery", "Keep technical-position labeling", "Keep three-dimensional brief", "Cut stock-universe scanning and direct buy/sell advice"],
            outputTitle: "Three-feature MVP",
            outputLines: ["Key messages", "Technical location", "Integrated market brief"],
            pmNote: "The important product judgment is the cut log: Aaron avoided overbuilding alerts and direct trade recommendations before validating the core brief."
          },
          {
            label: "Build",
            inputTitle: "Prompt brief and demo spec",
            inputLines: ["Ticker or index input", "Market scenario selector", "News, technicals, funds-flow modules"],
            operationTitle: "Implement a runnable web demo",
            operationLines: ["Built React / TypeScript / Vite interface", "Added price, company, news, technical, funds-flow, and integrated judgment panels", "Replaced static GitHub Pages plan with Vercel API proxy for real-time data access"],
            outputTitle: "Online demo",
            outputLines: ["Ticker input", "Structured outputs", "Vercel deployment"],
            pmNote: "The deployment blocker is a strong evidence point: the project moved from a broken static-data path to a working proxy architecture."
          },
          {
            label: "Pitch",
            inputTitle: "Working product and role target",
            inputLines: ["Demo status", "Capability map", "IB analyst expectations"],
            operationTitle: "Translate the product into hiring evidence",
            operationLines: ["Mapped project to market sensitivity and structured analysis", "Prepared a 30-second project pitch", "Connected AI engineering collaboration to finance-analysis output"],
            outputTitle: "Recruiting-ready story",
            outputLines: ["User insight", "MVP execution", "Market-analysis communication"],
            pmNote: "The final story is not 'I made an app'; it is 'I structured market information faster and showed the judgment chain.'"
          }
        ],
        algorithmSummary:
          "The smart part is the three-signal compression loop: the product does not stop at news retrieval. It asks what changed, where price sits technically, whether participation supports the move, and then turns those three lenses into a short analyst-style brief.",
        widget: {
          type: "market-pulse-lab",
          title: "Run the market-signal compression demo",
          help: "Choose a market context and ticker. This is a resume-safe reconstruction of the product logic: discover catalysts, mark technical location, check participation, and generate a concise brief.",
          defaultScenario: "intraday",
          defaultTicker: "now",
          scenarios: [
            {
              id: "pre-market",
              label: "Pre-market",
              prompt: "Before open: what changed overnight, and what level matters first?",
              weightLabel: "News leads; technicals define the first checkpoint."
            },
            {
              id: "intraday",
              label: "Intraday",
              prompt: "During movement: is this a real signal or noise?",
              weightLabel: "Funds-flow and technical confirmation carry more weight."
            },
            {
              id: "after-close",
              label: "After close",
              prompt: "After session: what should be carried into tomorrow's watchlist?",
              weightLabel: "Briefing quality matters more than speed alone."
            }
          ],
          tickers: [
            {
              id: "now",
              label: "NOW",
              company: "ServiceNow",
              context: "Worksheet example: funds moved quickly before the user caught the signal.",
              scenarioViews: {
                "pre-market": {
                  catalyst: { title: "Overnight enterprise-software signal", stance: "Watchlist", score: 72, detail: "Flag whether enterprise-software news is material enough to affect first-hour positioning." },
                  technical: { title: "Opening level map", stance: "Confirm support first", score: 65, detail: "Mark strong support, weak support, resistance, and break status before reacting." },
                  flow: { title: "Participation check", stance: "Wait for confirmation", score: 58, detail: "Pre-market interest is useful but not enough without session participation." },
                  weights: [
                    { label: "News", value: 44 },
                    { label: "Technical", value: 34 },
                    { label: "Funds", value: 22 }
                  ],
                  brief: "NOW goes on the active watchlist: catalyst quality matters first, but the tradeable read depends on whether opening price respects the marked support/resistance zone."
                },
                intraday: {
                  catalyst: { title: "Signal already moving", stance: "Time-sensitive", score: 82, detail: "The worksheet's ServiceNow example is exactly the missed-signal case the product is built to reduce." },
                  technical: { title: "Break and continuation check", stance: "Track pressure zone", score: 78, detail: "The demo forces the user to see whether the move is breaking, rejecting, or pausing at a key level." },
                  flow: { title: "Funds-flow acceleration", stance: "Confirming", score: 86, detail: "Rapid participation is treated as a separate confirmation lens, not a substitute for news or technical context." },
                  weights: [
                    { label: "News", value: 30 },
                    { label: "Technical", value: 32 },
                    { label: "Funds", value: 38 }
                  ],
                  brief: "NOW is treated as a high-priority intraday signal: funds-flow confirmation plus technical context matters more than a headline alone. The next step is focused tracking, not broad page switching."
                },
                "after-close": {
                  catalyst: { title: "Post-session catalyst log", stance: "Summarize", score: 70, detail: "Carry only the material news and discard low-signal headlines." },
                  technical: { title: "Tomorrow's level plan", stance: "Prepare watch zones", score: 74, detail: "Convert today's action into support, resistance, and break/retest checkpoints." },
                  flow: { title: "Participation memory", stance: "Keep on radar", score: 76, detail: "A strong participation day should shape the next watchlist, not disappear after close." },
                  weights: [
                    { label: "News", value: 30 },
                    { label: "Technical", value: 40 },
                    { label: "Funds", value: 30 }
                  ],
                  brief: "NOW remains a next-session watch item. The after-close read should preserve the catalyst, the technical zones, and whether participation was strong enough to justify continued attention."
                }
              }
            },
            {
              id: "ai-infra",
              label: "AI Infra",
              company: "AI infrastructure basket",
              context: "Worksheet example: missed commentary around AI infrastructure expectations.",
              scenarioViews: {
                "pre-market": {
                  catalyst: { title: "Key-person infrastructure commentary", stance: "Catalyst scan", score: 80, detail: "The product is designed to surface major-person commentary before it becomes stale." },
                  technical: { title: "Basket-level position", stance: "Map broad levels", score: 63, detail: "For sector themes, technical context should be read across leaders rather than a single ticker only." },
                  flow: { title: "Theme participation", stance: "Needs breadth", score: 59, detail: "One strong name is weaker than broad participation across the theme." },
                  weights: [
                    { label: "News", value: 50 },
                    { label: "Technical", value: 28 },
                    { label: "Funds", value: 22 }
                  ],
                  brief: "AI infrastructure starts as a news-led watch. The useful output is a concise catalyst summary plus the first technical levels to confirm whether the theme is spreading."
                },
                intraday: {
                  catalyst: { title: "Theme catalyst still active", stance: "Monitor", score: 76, detail: "If the commentary keeps circulating, the product keeps it tied to affected names rather than a generic headline." },
                  technical: { title: "Leader/follower check", stance: "Confirm breadth", score: 72, detail: "Track whether the move is narrow leadership or broad sector confirmation." },
                  flow: { title: "Participation breadth", stance: "Critical", score: 83, detail: "Funds-flow breadth is the strongest intraday test for a theme move." },
                  weights: [
                    { label: "News", value: 32 },
                    { label: "Technical", value: 30 },
                    { label: "Funds", value: 38 }
                  ],
                  brief: "AI infrastructure is worth tracking only if the theme has breadth. The product turns commentary, technical confirmation, and participation into one compact sector-read."
                },
                "after-close": {
                  catalyst: { title: "Theme narrative summary", stance: "Archive and carry", score: 74, detail: "The end-of-day use case is to save the narrative and connect it to the next watchlist." },
                  technical: { title: "Next-session setup", stance: "Prepare", score: 70, detail: "Create levels for leading tickers before the next open." },
                  flow: { title: "Money confirmation", stance: "Rank names", score: 78, detail: "Rank which names actually attracted participation rather than only attention." },
                  weights: [
                    { label: "News", value: 34 },
                    { label: "Technical", value: 30 },
                    { label: "Funds", value: 36 }
                  ],
                  brief: "AI infrastructure becomes a structured watchlist item: keep the catalyst, rank participating names, and define next-session technical checkpoints."
                }
              }
            }
          ]
        }
      },
      {
        id: "research-agent",
        navTitle: "Research Agent Workflow",
        navMeta: "H1-H6 evidence map | confidence-aware IB research",
        title: "Research Agent: How AI Is Redefining Entry-Level Investment Banking Analysts",
        source: "Research Agent Workbook and Paper",
        summary:
          "A structured research workflow that turns a broad career question into hypotheses, an issue tree, research questions, evidence tables, confidence ratings, and a final paper.",
        owned: [
          "Defined the research mission around entry-level investment-banking analyst value rather than generic AI labor-market speculation.",
          "Maintained six testable hypotheses and a rejected-hypothesis boundary to avoid overstating that finance fundamentals disappear.",
          "Collected support and counterevidence from role descriptions, workflow benchmarks, consulting reports, practitioner commentary, and finance media.",
          "Produced a final paper that preserves evidence limitations instead of turning preliminary findings into overconfident claims."
        ],
        metrics: [
          { label: "Hypotheses", value: "H1-H6" },
          { label: "RQs", value: "5" },
          { label: "Workflow steps", value: "0-8" }
        ],
        endorsement: {
          text: "The strongest part is control of uncertainty: Aaron keeps support evidence, counterevidence, source limitations, and confidence ratings visible throughout the research workflow.",
          by: "Source-artifact review",
          role: "Research evidence"
        },
        relatedTech: ["excel", "word", "research", "finance"],
        accent: "#1d4ed8",
        artifactLinks: [
          {
            label: "Open research paper",
            href: "../User_data/Arron Li/Research Agent/research_paper.docx",
            note: "DOCX source"
          },
          {
            label: "Open research workbook",
            href: "../User_data/Arron Li/Research Agent/Research_Agent_Worksheet_v2.xlsx",
            note: "XLSX source"
          }
        ],
        stages: [
          {
            label: "Frame",
            inputTitle: "Career research question",
            inputLines: ["AI and entry-level IB analyst value", "Finance students and early-career audience", "Need to avoid broad future-of-work claims"],
            operationTitle: "Constrain the mission",
            operationLines: ["Define target audience", "Write core question", "Set the rejected-hypothesis boundary"],
            outputTitle: "Research mission",
            outputLines: ["Role-value lens", "Practical career lens", "Finance-fundamentals boundary"],
            pmNote: "The project is strong because the scope is narrow enough to research: junior IB tasks, skills, workflow, and replacement risk."
          },
          {
            label: "Structure",
            inputTitle: "Initial hypotheses",
            inputLines: ["H1-H6", "Task compression", "Skill shift", "Workflow redesign", "Replacement risk"],
            operationTitle: "Build the issue tree",
            operationLines: ["Split into Task Value Shift", "Split into Skill Differentiation", "Split into Workflow Redesign"],
            outputTitle: "MECE research plan",
            outputLines: ["5 research questions", "Evidence collection plan", "Traceable hypothesis links"],
            pmNote: "Aaron used the issue tree to prevent overlap between automation, skills, workflow, and hiring pressure."
          },
          {
            label: "Evidence",
            inputTitle: "Source candidates",
            inputLines: ["Bank role pages", "Workflow benchmarks", "Vendor and consulting sources", "Finance media"],
            operationTitle: "Collect support and against evidence",
            operationLines: ["Triangulate each hypothesis", "Flag vendor and media limitations", "Keep counterevidence visible"],
            outputTitle: "Evidence table",
            outputLines: ["Support rows", "Against rows", "Source limitations"],
            pmNote: "The research agent is not only a writing assistant; it is a control system for source quality and uncertainty."
          },
          {
            label: "Conclude",
            inputTitle: "Evidence table and insights",
            inputLines: ["8 final insights", "H1-H6 status", "Open evidence gaps"],
            operationTitle: "Write confidence-aware findings",
            operationLines: ["Separate strong from preliminary", "Preserve caveats", "Explain so-what for candidates and firms"],
            outputTitle: "Final paper",
            outputLines: ["Integrated conclusion", "Source limitations", "Open questions"],
            pmNote: "The final answer is balanced: AI reshapes junior analyst work, but execution and finance fundamentals remain the control layer."
          }
        ],
        algorithmSummary:
          "The smart part is evidence governance: the workflow treats each hypothesis as a claim that needs support, counterevidence, source-quality notes, and confidence ratings before it can enter the final paper.",
        widget: {
          type: "research-agent-lab",
          title: "Inspect the hypothesis-to-evidence control loop",
          help: "Click a hypothesis to see how the research agent kept support evidence, counterevidence, confidence, and candidate implications tied together.",
          defaultHypothesis: "h2",
          issueTree: [
            {
              title: "Task Value Shift",
              questions: ["Which junior tasks are accelerated?", "Which tasks still need context or judgment?", "How does repetitive execution change in value?"]
            },
            {
              title: "Skill Differentiation",
              questions: ["Which skills become more important?", "How important are verification and synthesis?", "What separates top analysts from average analysts?"]
            },
            {
              title: "Workflow Redesign",
              questions: ["Where should AI support the workflow?", "Where must human review remain?", "What risks block full automation?"]
            }
          ],
          workflow: [
            "Init", "Hypothesize", "Issue Tree", "Research Questions", "Plan", "Evidence", "Insights", "Conclusion", "Report"
          ],
          hypotheses: [
            {
              id: "h1",
              label: "H1",
              title: "Repetitive task value compression",
              status: "Stronger but preliminary",
              confidence: 68,
              support: "FactSet Pitch Creator evidence suggests AI can automate model analysis, presentation building, search, formatting, and source-linked data transfer.",
              against: "BankerToolBench found junior-banker AI outputs were not client-ready, supporting continued review and quality-control needs.",
              conclusion: "AI reduces the durable value of repetitive first-pass tasks, but the claim should be framed as task compression rather than full task removal.",
              soWhat: "Candidates should pair AI-enabled speed with review discipline and finance judgment."
            },
            {
              id: "h2",
              label: "H2",
              title: "Shift toward judgment, verification, synthesis, and communication",
              status: "Strongest current finding",
              confidence: 84,
              support: "Survey-backed workflow evidence says junior bankers spend substantial time gathering data and formatting rather than higher-value analysis.",
              against: "Official analyst specifications still emphasize execution, modeling, attention to detail, multitasking, and Microsoft Office fluency.",
              conclusion: "Junior analyst value is shifting toward judgment and communication, but this is additive; execution and modeling remain essential.",
              soWhat: "The strongest candidate profile is finance fundamentals plus structured AI-assisted review and synthesis."
            },
            {
              id: "h3",
              label: "H3",
              title: "AI-output verification as a practical skill",
              status: "Stronger but partially validated",
              confidence: 72,
              support: "Workflow benchmark evidence shows AI-generated models, decks, and reports still need human correction before professional use.",
              against: "Some formal analyst-program pages do not yet name AI verification as an explicit entry-level requirement.",
              conclusion: "Verification is becoming important in practice before it is fully visible in recruiting language.",
              soWhat: "Students should practice fact-checking, error diagnosis, and finance-grounded output refinement."
            },
            {
              id: "h4",
              label: "H4",
              title: "Changing differentiators for top analysts",
              status: "Directionally supported",
              confidence: 64,
              support: "Finance-industry analysis links AI automation of junior work to a higher premium on critical thinking, challenge, interpretation, and communication.",
              against: "Traditional differentiators such as modeling, execution speed, and attention to detail remain central in job specifications.",
              conclusion: "Disciplined AI use may become a differentiator, but it does not replace core finance and execution skills.",
              soWhat: "Do not market AI fluency as a substitute for analyst fundamentals; frame it as a productivity and judgment multiplier."
            },
            {
              id: "h5",
              label: "H5",
              title: "Workflow redesign around AI-assisted first pass",
              status: "Stronger but preliminary",
              confidence: 70,
              support: "Consulting evidence describes pitchbook-drafting workflows where analysts direct AI tools and save meaningful first-draft time.",
              against: "Risk, governance, confidentiality, validation, and integration constraints keep full automation unrealistic.",
              conclusion: "Junior workflow is likely to be redesigned around AI first drafts plus human orchestration and quality control.",
              soWhat: "Use AI for speed, but preserve review gates, accountability, and source traceability."
            },
            {
              id: "h6",
              label: "H6",
              title: "Augmentation versus replacement",
              status: "Balanced and preliminary",
              confidence: 61,
              support: "Expert commentary points to deliberate adoption and continued need for compliance, confidentiality, and human control.",
              against: "Media reporting and bank commentary show credible pressure on low-value task demand and potential analyst-class size.",
              conclusion: "Near-term evidence leans toward augmentation and role evolution, not full replacement, but hiring-pressure risk remains real.",
              soWhat: "Prepare for a more demanding analyst role where low-value manual work matters less and review/synthesis matters more."
            }
          ]
        }
      },
      {
        id: "ib-research",
        navTitle: "IB Research Simulations",
        navMeta: "six targets | DCF | pitch materials",
        title: "Investment Banking Simulation and RBC Virtual Banking Projects",
        source: "Resume project section",
        summary:
          "Analyst-style simulation work covering target screening, market and macro analysis, company evaluation, DCF valuation, and client-ready presentation materials.",
        owned: [
          "Screened six potential acquisition targets for a North American beverage company expanding into Asian markets.",
          "Researched regional conditions, consumer segments, product portfolios, operating models, and distribution strategies.",
          "Built a DCF valuation model for the preferred target and translated financial analysis into a mock client recommendation.",
          "Prepared RBC-style pitch materials summarizing industry insights, transaction rationale, and company analysis."
        ],
        metrics: [
          { label: "Targets", value: "6" },
          { label: "Valuation", value: "DCF" },
          { label: "Output", value: "Pitch" }
        ],
        endorsement: {
          text: "Relevant IB evidence because it maps directly to junior analyst tasks: market scan, company screen, valuation, and presentation synthesis.",
          by: "Resume source",
          role: "Project evidence"
        },
        relatedTech: ["excel", "powerpoint", "finance", "research"],
        accent: "#d97706",
        stages: [
          {
            label: "Screen",
            inputTitle: "Potential acquisition targets",
            inputLines: ["Asian-market expansion objective", "Business profiles", "Product portfolios"],
            operationTitle: "Assess strategic fit",
            operationLines: ["Compare market positioning", "Review operating models", "Check distribution compatibility"],
            outputTitle: "Target shortlist",
            outputLines: ["Six companies screened", "Preferred target selected", "Fit rationale"],
            pmNote: "The simulation demonstrates first-pass target screening rather than claiming live transaction experience."
          },
          {
            label: "Research",
            inputTitle: "Industry and market information",
            inputLines: ["Regional market conditions", "Consumer segments", "Competitive landscape"],
            operationTitle: "Build investment context",
            operationLines: ["Identify growth drivers", "Compare sector trends", "Summarize market rationale"],
            outputTitle: "Industry view",
            outputLines: ["Macro context", "Competitive positioning", "Transaction narrative"],
            pmNote: "This is the analyst translation step: turning raw market context into a usable transaction story."
          },
          {
            label: "Value",
            inputTitle: "Financial projections",
            inputLines: ["Revenue assumptions", "Free cash flow", "Enterprise value logic"],
            operationTitle: "Develop DCF valuation",
            operationLines: ["Project performance", "Estimate free cash flows", "Support recommendation"],
            outputTitle: "Valuation model",
            outputLines: ["DCF output", "Value estimate", "Recommendation support"],
            pmNote: "The resume supports valuation basics and DCF modeling; the demo does not invent transaction metrics beyond that."
          },
          {
            label: "Pitch",
            inputTitle: "Screening and valuation outputs",
            inputLines: ["Industry insight", "Company analysis", "Transaction rationale"],
            operationTitle: "Create client-ready materials",
            operationLines: ["Condense analysis", "Structure recommendation", "Prepare presentation slides"],
            outputTitle: "Pitch materials",
            outputLines: ["Executive story", "Supporting analysis", "Simulated recommendation"],
            pmNote: "The final deliverable mirrors junior analyst communication: concise, structured, and decision-oriented."
          }
        ],
        algorithmSummary:
          "The analytical logic is a deal funnel: screen targets, test strategic fit, model the preferred company, and convert the result into pitch materials."
      },
      {
        id: "insurance-analysis",
        navTitle: "Insurance Product Comparison",
        navMeta: "Allianz | National Life Group | Corebridge",
        title: "Insurance Product Comparative Analysis",
        source: "One Pioneer and resume project section",
        summary:
          "Comparison of insurance products across providers, focusing on structure, riders, index options, participation rates, caps, floors, fees, cost efficiency, protection, and growth potential.",
        owned: [
          "Compared Allianz, National Life Group, and Corebridge Financial insurance products.",
          "Evaluated structure, riders, index options, participation rates, caps, floors, and fees.",
          "Assessed cost efficiency, protection, growth potential, pricing, coverage terms, and positioning.",
          "Produced clear comparison slides and reports for client education and product discussions."
        ],
        metrics: [
          { label: "Providers", value: "3" },
          { label: "Factors", value: "Caps/floors/fees" },
          { label: "Output", value: "Report + slides" }
        ],
        endorsement: {
          text: "This project shows product-level financial communication: comparing terms clearly enough to support client education.",
          by: "Resume source",
          role: "Product research evidence"
        },
        relatedTech: ["excel", "powerpoint", "word", "research"],
        accent: "#7c3aed",
        stages: [
          {
            label: "Collect",
            inputTitle: "Provider product materials",
            inputLines: ["Allianz", "National Life Group", "Corebridge Financial"],
            operationTitle: "Standardize product terms",
            operationLines: ["Capture policy structure", "Record riders and index options", "Compile preliminary quotations"],
            outputTitle: "Comparable product table",
            outputLines: ["Structures", "Riders", "Quoted terms"],
            pmNote: "The value is in normalization: product details become comparable instead of scattered across provider material."
          },
          {
            label: "Compare",
            inputTitle: "Standardized product table",
            inputLines: ["Participation rates", "Caps", "Floors", "Fees"],
            operationTitle: "Evaluate client value",
            operationLines: ["Compare protection features", "Assess growth potential", "Review cost efficiency"],
            outputTitle: "Tradeoff view",
            outputLines: ["Protection", "Upside", "Cost"],
            pmNote: "Aaron's contribution is not selling a product; it is making the comparison understandable."
          },
          {
            label: "Explain",
            inputTitle: "Comparison findings",
            inputLines: ["Pricing", "Coverage terms", "Product positioning"],
            operationTitle: "Prepare client-facing materials",
            operationLines: ["Build PowerPoint slides", "Write comparison report", "Translate policy details into plain language"],
            outputTitle: "Client education materials",
            outputLines: ["Slides", "Report", "Seminar support"],
            pmNote: "The communication layer matters because insurance terms are easy for clients to misread."
          }
        ],
        algorithmSummary:
          "The comparison logic is a structured tradeoff table: standardize provider terms, compare protection and upside mechanics, then translate the differences into client-readable material."
      }
    ]
  };
})();
