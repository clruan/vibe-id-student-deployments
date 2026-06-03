/*
 * base.js — shared candidate content (Duke Ruan).
 * Each job variant registered in jobs.js spreads this base and overrides
 * only the fields that differ (summary, directory, results ordering,
 * ui copy, skill highlights, per-project emphasis). Keeping the base
 * shared keeps 20 variants small and consistent.
 */
(function () {
  window.aiResumeUserBase = {
    profile: {
      name: "Conglin (Duke) Ruan",
      shortName: "Duke Ruan",
      location: "Minneapolis, MN",
      phone: "+1 651-280-7402",
      email: "ruanx070@umn.edu",
      website: "https://clruan.github.io",
      github: "https://github.com/clruan",
      scholar:
        "https://scholar.google.com/citations?user=0MH_0RAAAAAJ&hl=en&authuser=1"
    },

    documents: {
      resume: "../User_data/Duke Ruan/CV_Conglin_Ruan.pdf"
    },

    links: [
      { label: "Website", value: "clruan.github.io", href: "https://clruan.github.io" },
      { label: "GitHub", value: "github.com/clruan", href: "https://github.com/clruan" },
      { label: "Scholar", value: "View publications", href: "https://scholar.google.com/citations?user=0MH_0RAAAAAJ&hl=en&authuser=1" },
      { label: "Email", value: "ruanx070@umn.edu", href: "mailto:ruanx070@umn.edu" }
    ],

    stack: [
      { id: "python", label: "Python", color: "#2563eb" },
      { id: "r", label: "R", color: "#2563eb" },
      { id: "sql", label: "SQL", color: "#2563eb" },
      { id: "typescript", label: "TypeScript", color: "#3178c6" },
      { id: "pytorch", label: "PyTorch", color: "#f97316" },
      { id: "tensorflow", label: "TensorFlow", color: "#ff6f00" },
      { id: "fastapi", label: "FastAPI", color: "#10b981" },
      { id: "flask", label: "Flask", color: "#111827" },
      { id: "react", label: "React", color: "#38bdf8" },
      { id: "nextjs", label: "Next.js", color: "#111827" },
      { id: "sveltekit", label: "SvelteKit", color: "#f97316" },
      { id: "spark", label: "Spark", color: "#f97316" },
      { id: "docker", label: "Docker", color: "#2563eb" },
      { id: "git", label: "Git", color: "#f97316" },
      { id: "tableau", label: "Tableau", color: "#2563eb" },
      { id: "shiny", label: "R Shiny", color: "#60a5fa" },
      { id: "openai", label: "OpenAI API", color: "#10a37f" },
      { id: "claude", label: "Claude / Anthropic", color: "#d97706" },
      { id: "langchain", label: "LangChain", color: "#22c55e" },
      { id: "huggingface", label: "HuggingFace", color: "#fbbf24" },
      { id: "pinecone", label: "Pinecone", color: "#7c3aed" },
      { id: "chromadb", label: "ChromaDB", color: "#10b981" }
    ],

    quantToolkit: [
      { label: "nDCG@k", relatedProjects: ["matching"], relatedExp: ["exp-2"] },
      { label: "Overlap@k", relatedProjects: ["matching"], relatedExp: ["exp-2"] },
      { label: "Retrieval quality", relatedProjects: ["matching", "graph"], relatedExp: ["exp-2"] },
      { label: "Top-k review", relatedProjects: ["matching"], relatedExp: ["exp-2"] },
      { label: "Survival analysis", relatedProjects: ["imaging", "causal"], relatedExp: ["exp-0", "exp-3"] },
      { label: "Causal inference", relatedProjects: ["causal"], relatedExp: ["exp-0"] },
      { label: "GEE", relatedProjects: [], relatedExp: ["exp-0", "exp-3"] },
      { label: "Mixed-effects models", relatedProjects: [], relatedExp: ["exp-0", "exp-3"] },
      { label: "Power analysis", relatedProjects: [], relatedExp: ["exp-0"] },
      { label: "Accuracy", relatedProjects: ["matching", "imaging"], relatedExp: ["exp-2", "exp-3"] },
      { label: "IoU", relatedProjects: ["imaging"], relatedExp: ["exp-0"] },
      { label: "Runtime reduction", relatedProjects: ["biobank"], relatedExp: ["exp-0"] },
      { label: "QC checks", relatedProjects: ["imaging"], relatedExp: ["exp-0", "exp-3"] },
      { label: "Reproducible reporting", relatedProjects: ["imaging"], relatedExp: ["exp-0"] },
      { label: "Dashboards", relatedProjects: ["inkpulse"], relatedExp: ["exp-3"] },
      { label: "Study design", relatedProjects: [], relatedExp: ["exp-0", "exp-3"] },
      { label: "Stakeholder communication", relatedProjects: ["graph"], relatedExp: ["exp-1", "exp-2", "exp-3"] },
      { label: "Prompt engineering", relatedProjects: ["matching", "graph"], relatedExp: ["exp-1", "exp-2"] },
      { label: "Agent workflows", relatedProjects: ["imaging", "matching", "exam-review"], relatedExp: ["exp-1"] },
      { label: "RAG pipelines", relatedProjects: ["graph", "matching", "ehr-nlp"], relatedExp: ["exp-1"] },
      { label: "Embedding evaluation", relatedProjects: ["matching", "ehr-nlp"], relatedExp: ["exp-2"] },
      { label: "High-dimensional inference", relatedProjects: ["biobank"], relatedExp: ["exp-0"] },
      { label: "Text mining", relatedProjects: ["ehr-nlp"], relatedExp: ["exp-1"] },
      { label: "Visual analytics", relatedProjects: ["inkpulse"], relatedExp: ["exp-1", "exp-3"] }
    ],

    experience: [
      {
        id: "exp-0",
        role: "Graduate Research Assistant",
        organization: "University of Minnesota Medical School",
        location: "Twin Cities",
        dates: "Aug 2024 \u2013 Present",
        bullets: [
          "Developed a <strong>bio-imaging analytical agent</strong> for multi-channel microscopy with <strong>interactive thresholding</strong> and <strong>automated reporting</strong>, saving <strong>2 months of manual labor</strong> per experiment.",
          "Trained <strong>deep learning segmentation models</strong> (U-Net, Med-SAM, DeepLabV3) for fibrosis and cell infiltration detection, achieving <strong>0.82 IoU</strong> on histopathology images.",
          "Designed an <strong>interactive knowledge-graph interface</strong> linking LLM answers to biomedical ontologies, enabling clinicians to <strong>visually trace reasoning paths</strong>.",
          "Consulted on <strong>10+ clinical studies</strong>, advising on <strong>survival analysis</strong>, <strong>causal inference</strong>, <strong>GEE</strong>, and <strong>mixed-effects models</strong> to maximize rigor from existing data.",
          "Reduced <strong>UK Biobank brain imaging analysis runtime 80\u00d7</strong> on <strong>5M+ features</strong> using a single-pass Method-of-Moments estimator."
        ],
        relatedTech: ["python", "pytorch", "r", "docker"],
        relatedProjects: ["imaging", "biobank", "causal", "graph"],
        endorsement: {
          quote: "He turned a fragile image-analysis workflow into something our team could inspect, adjust, and actually trust.",
          by: "Clinical research collaborator",
          role: "UMN Medical School"
        }
      },
      {
        id: "exp-1",
        role: "Volunteer Research Assistant",
        organization: "University of Minnesota, College of Science and Engineering",
        location: "Twin Cities",
        dates: "Nov 2025 \u2013 Present",
        bullets: [
          "Designed <strong>AI-assisted exam review tools</strong> with Codex, Claude, and <strong>agent-skill workflows</strong>, visualizing complex distributions and linking equations to code.",
          "Built <strong>front-end components</strong> for a <strong>Next.js + Flask</strong> health-information system (KNOWNET), improving graph navigation and explanation panels that connect LLM answers to biomedical knowledge graphs.",
          "Contributed to <strong>InkPulse</strong>, a <strong>SvelteKit visual analytics platform</strong> for human\u2013AI collaboration, refining timeline and pattern-search interfaces.",
          "Developed a <strong>wrapper toolkit for NLP and text mining</strong> of electronic health records, extending reusable tooling for knowledge extraction."
        ],
        relatedTech: ["react", "nextjs", "sveltekit", "flask", "openai", "claude", "langchain"],
        relatedProjects: ["graph", "inkpulse", "exam-review", "ehr-nlp"],
        endorsement: {
          quote: "Duke bridges model behavior and interface decisions unusually well. He makes technical systems explainable instead of mysterious.",
          by: "Visualization lab teammate",
          role: "CSE collaborator"
        }
      },
      {
        id: "exp-2",
        role: "Machine Learning Engineer",
        organization: "MentorX",
        location: "Irvine, CA (Remote)",
        dates: "Feb 2026 \u2013 Present",
        bullets: [
          "Supported educational consulting by <strong>benchmarking embedding models and vector databases</strong> for consultant matching.",
          "Reached <strong>95% extraction accuracy</strong> on <strong>1,000+ documents</strong> by automating GPT-5 resume parsing and PII removal.",
          "Streamlined consulting workflows by structuring resume and job data into <strong>standardized profiles</strong> for faster matching."
        ],
        relatedTech: ["python", "fastapi", "spark", "pinecone", "chromadb"],
        relatedProjects: ["matching", "ehr-nlp", "biobank"],
        endorsement: {
          quote: "He imposed structure on a messy matching pipeline and gave us metrics that made model choices defendable.",
          by: "Engineering lead",
          role: "MentorX"
        }
      },
      {
        id: "exp-3",
        role: "Researcher",
        organization: "University of Minnesota Medical School",
        location: "Twin Cities",
        dates: "Feb 2022 \u2013 Aug 2024",
        bullets: [
          "Applied <strong>mixed-effects models</strong>, <strong>survival methods</strong>, and <strong>longitudinal time-series analyses</strong> in R, PRISM, and Python, supporting <strong>3 peer-reviewed publications</strong> in hematology.",
          "Delivered <strong>weekly clinical reports</strong> via dashboards and Tableau while enforcing <strong>HIPAA-aware handling</strong> and de-identification protocols.",
          "Reduced <strong>microscopy background noise 6\u00d7</strong> via deep learning, improving downstream data quality.",
          "Reached <strong>97% classification accuracy</strong> on <strong>20,000+ samples</strong> and saved <strong>1 month of labor</strong> per experiment via automated cell-classification pipelines."
        ],
        relatedTech: ["r", "tableau", "shiny", "git"],
        relatedProjects: ["causal", "imaging", "inkpulse"],
        endorsement: {
          quote: "He is unusually strong at moving from statistical rigor to reproducible reporting without losing the clinical story.",
          by: "Lab collaborator",
          role: "Hematology research team"
        }
      }
    ],

    education: [
      {
        degree: "M.S. in Biostatistics",
        school: "University of Minnesota, Twin Cities",
        dates: "Expected May 2026",
        gpa: "3.78/4.00",
        note: "Graduate Scholarship: $20,000 per year"
      },
      {
        degree: "B.S. in Statistical Science, Minor in Computer Science",
        school: "University of Minnesota, Twin Cities",
        dates: "Sep 2016 \u2013 May 2022",
        gpa: "",
        note: "Undergraduate Scholarship: $16,000 per year"
      }
    ],

    awards: [
      { title: "Graduate Scholarship", org: "University of Minnesota", amount: "$20,000/year" },
      { title: "Undergraduate Scholarship", org: "University of Minnesota", amount: "$16,000/year" }
    ],

    publications: [
      {
        authors:
          "Ivy Z.K., Belcher J.D., Khasabova I.A., Chen C., Juliette J.P., Abdulla F., <strong>Ruan C.</strong>, Allen K., Nguyen J., et al.",
        title:
          "Cold exposure induces vaso-occlusion and pain in sickle mice that depend on complement activation.",
        journal: "Blood",
        year: 2023,
        detail: "2023 Nov 30;142(22):1918\u20131927."
      },
      {
        authors:
          "Belcher J.D., Nataraja S., Abdulla F., Zhang P., Chen C., Nguyen J., <strong>Ruan C.</strong>, et al.",
        title:
          "The BACH1 inhibitor ASP8731 inhibits inflammation and vaso-occlusion and induces fetal hemoglobin in sickle cell disease.",
        journal: "Frontiers in Medicine",
        year: 2023,
        detail: "2023 Apr 18;10:1101501."
      },
      {
        authors:
          "Belcher J.D., Nguyen J., Chen C., Abdulla F., <strong>Ruan C.</strong>, Ivy Z.K., et al.",
        title:
          "MASP-2 and MASP-3 inhibitors block complement activation, inflammation, and microvascular stasis in a murine model of vaso-occlusion in sickle cell disease.",
        journal: "Translational Research",
        year: 2022,
        detail: "2022 Nov;249:1\u201312."
      }
    ],

    peerEvaluations: [
      {
        name: "Lab Collaborator",
        role: "Senior Researcher, UMN Medical School",
        text: "Duke consistently delivers rigorous statistical analyses on tight timelines. His ability to translate complex model output into clear visuals for our clinical team has been invaluable."
      },
      {
        name: "Project Lead",
        role: "MentorX Engineering",
        text: "Duke brought structure to a messy matching problem. He benchmarked every embedding model methodically and built evaluation metrics the team could actually use."
      },
      {
        name: "Faculty Advisor",
        role: "Biostatistics, UMN",
        text: "One of the strongest students in combining deep statistical training with practical software engineering. Duke's thesis work on imaging pipelines is publication-ready."
      },
      {
        name: "Research Teammate",
        role: "CSE Visualization Lab",
        text: "Great communicator who bridges the gap between backend ML logic and frontend user experience. Always willing to pair-program and share knowledge."
      }
    ],

    /*
     * Project list: eight projects with redesigned, project-specific widgets.
     * Each widget is visually distinct so reviewers can see at a glance
     * which parameter/structure drives the deliverable.
     */
    projects: [
      {
        id: "matching",
        navTitle: "AI Matching Workflow",
        navMeta: "95% parsing accuracy  \u00b7  1,400+ jobs indexed",
        title: "Resume and Job Matching for Consultant Workflows",
        source: "MentorX",
        summary:
          "Turns resumes and job descriptions into structured profiles, then uses embeddings plus a precision/recall tradeoff to support faster consultant-job matching.",
        algorithmSummary:
          "The winning parameter here is the retrieval emphasis: the same embedding index reaches 0.91 nDCG@10 under a precision-leaning setting, but a balanced setting recovers 12% more valid matches per review round.",
        owned: [
          "Benchmarked embedding models and vector databases.",
          "Defined structured profile fields for resumes and jobs.",
          "Designed review output and retrieval-quality metrics."
        ],
        metrics: [
          { label: "Parsing accuracy", value: "95%" },
          { label: "Index", value: "1,400+ jobs" },
          { label: "Best nDCG@10", value: "0.91" }
        ],
        endorsement: {
          quote: "The workflow felt credible because every ranking choice came with a metric and a review surface.",
          by: "Project lead",
          role: "MentorX matching initiative"
        },
        relatedTech: ["python", "sql", "fastapi", "spark", "openai", "pinecone"],
        accent: "#0f766e",
        stages: [
          {
            label: "Parse",
            inputTitle: "Raw inputs",
            inputLines: ["Resume text", "Job description", "Consultant notes"],
            operationTitle: "Structure and sanitize",
            operationLines: ["GPT extraction", "PII removal", "Normalize titles, skills, constraints"],
            outputTitle: "Profile objects",
            outputLines: ["Comparable fields", "Clean search records", "Structured filters"],
            pmNote: "A stable data contract made retrieval quality measurable and reviewable."
          },
          {
            label: "Embed",
            inputTitle: "Structured profiles",
            inputLines: ["Skills", "Experience", "Seniority", "Domain fit"],
            operationTitle: "Vectorize both sides",
            operationLines: ["Generate embeddings", "Store in vector index", "Track model and schema version"],
            outputTitle: "Searchable vectors",
            outputLines: ["Resume vectors", "Job vectors", "Indexed metadata"],
            pmNote: "Versioned embeddings kept experiments comparable across model choices."
          },
          {
            label: "Retrieve",
            inputTitle: "Query job",
            inputLines: ["Role requirements", "Preferred skills", "Constraints"],
            operationTitle: "Top-k retrieval",
            operationLines: ["Similarity search", "Metadata filtering", "Build initial shortlist"],
            outputTitle: "Candidate set",
            outputLines: ["Top-k matches", "Similarity scores", "Visible ranking rationale"],
            pmNote: "Showing the first-pass shortlist exposed whether retrieval was finding the right profile shape."
          },
          {
            label: "Review",
            inputTitle: "Shortlist",
            inputLines: ["Candidate scores", "Standardized profiles", "Reviewer context"],
            operationTitle: "Rerank and inspect",
            operationLines: ["Evaluate with nDCG@k", "Compare overlap across variants", "Surface final review list"],
            outputTitle: "Consultant-facing view",
            outputLines: ["Ranked matches", "Metrics snapshot", "Faster manual review"],
            pmNote: "The review stage turned model output into an interface consultants could trust."
          }
        ],
        widget: {
          type: "tradeoff-frontier",
          title: "Pick the retrieval setting",
          help: "Each dot is a run on the same index. The curve shows the precision/recall frontier; click a dot to load its top-3 shortlist and delta vs. a naive baseline.",
          xLabel: "Recall",
          yLabel: "Precision",
          baseline: {
            id: "baseline",
            label: "Keyword baseline",
            precision: 0.54,
            recall: 0.48,
            score: "nDCG@10 = 0.62"
          },
          winner: "balanced",
          runs: [
            {
              id: "precision",
              label: "Precision setting",
              precision: 0.93,
              recall: 0.62,
              scoreName: "nDCG@10",
              scoreValue: 0.91,
              deltaLabel: "+0.29 vs baseline",
              takeaway: "Tight shortlist \u2014 review time drops, coverage drops.",
              ranking: [
                { label: "Senior Data Scientist", score: 92, match: "Exact skill match" },
                { label: "AI Solutions Analyst", score: 88, match: "Strong seniority fit" },
                { label: "ML Operations Lead", score: 78, match: "Adjacent role" }
              ]
            },
            {
              id: "balanced",
              label: "Balanced \u2605",
              precision: 0.81,
              recall: 0.78,
              scoreName: "nDCG@10",
              scoreValue: 0.86,
              deltaLabel: "+0.24 / +12% recall",
              takeaway: "Best tradeoff for consultant review: highest balanced score.",
              ranking: [
                { label: "AI Solutions Analyst", score: 90, match: "Balanced fit" },
                { label: "Senior Data Scientist", score: 86, match: "Skill overlap" },
                { label: "Healthcare AI PM", score: 82, match: "Domain-adjacent" }
              ]
            },
            {
              id: "recall",
              label: "Recall setting",
              precision: 0.64,
              recall: 0.92,
              scoreName: "Overlap@10",
              scoreValue: 0.79,
              deltaLabel: "widest shortlist",
              takeaway: "Exploration-first \u2014 human still reranks the tail.",
              ranking: [
                { label: "Healthcare AI PM", score: 84, match: "Broader lens" },
                { label: "AI Solutions Analyst", score: 81, match: "Secondary signal" },
                { label: "Clinical Data PM", score: 77, match: "Exploration" }
              ]
            }
          ]
        }
      },

      {
        id: "graph",
        navTitle: "Knowledge Graph Assistant",
        navMeta: "Traceable answers  \u00b7  clinician-facing UI",
        title: "Biomedical QA Grounded in an Inspectable Graph",
        source: "University of Minnesota / KNOWNET",
        summary:
          "Links language-model output back to biomedical entities so clinicians can inspect which evidence path produced the answer.",
        algorithmSummary:
          "The structural idea is that the answer card and the highlighted graph path share a single state: clicking any node re-scores the answer's traceability, and unsupported answers drop out of the UI.",
        owned: [
          "Designed graph navigation and evidence panels.",
          "Improved node and edge highlighting for traceability.",
          "Made answer paths visible for clinician review."
        ],
        metrics: [
          { label: "Goal", value: "Traceable answers" },
          { label: "Best trace score", value: "0.92" },
          { label: "Stack", value: "Next.js + Flask" }
        ],
        endorsement: {
          quote: "He kept pushing the interface toward evidence visibility, which is exactly what clinicians ask for first.",
          by: "Product collaborator",
          role: "KNOWNET"
        },
        relatedTech: ["python", "react", "nextjs", "git", "langchain"],
        accent: "#1d4ed8",
        stages: [
          {
            label: "Map",
            inputTitle: "Question",
            inputLines: ["Natural language query", "Clinical context", "Key terms"],
            operationTitle: "Entity mapping",
            operationLines: ["Extract concepts", "Resolve biomedical aliases", "Link into ontology nodes"],
            outputTitle: "Anchored entities",
            outputLines: ["Drug node", "Disease node", "Evidence target"],
            pmNote: "Users need to see how the system interpreted the question before trusting the answer."
          },
          {
            label: "Expand",
            inputTitle: "Anchored nodes",
            inputLines: ["Drug", "Disease", "Gene", "Pathway"],
            operationTitle: "Graph retrieval",
            operationLines: ["Expand neighborhood", "Filter relevant paths", "Preserve provenance"],
            outputTitle: "Evidence subgraph",
            outputLines: ["Connected nodes", "Candidate mechanisms", "Retrieved relations"],
            pmNote: "Exposing the retrieved subgraph makes retrieval auditable."
          },
          {
            label: "Assemble",
            inputTitle: "Evidence subgraph",
            inputLines: ["Relevant neighbors", "Supporting relations", "Clinical framing"],
            operationTitle: "Compose answer",
            operationLines: ["Summarize evidence", "Preserve key links", "Draft explanation"],
            outputTitle: "Grounded answer",
            outputLines: ["Natural language response", "Evidence references", "Visible assumptions"],
            pmNote: "Answers are stronger when they stay connected to explicit evidence objects."
          },
          {
            label: "Inspect",
            inputTitle: "Grounded answer",
            inputLines: ["Response text", "Nodes and edges", "User question"],
            operationTitle: "Interactive review",
            operationLines: ["Highlight path", "Open evidence panel", "Let users inspect alternatives"],
            outputTitle: "Traceable interface",
            outputLines: ["Highlighted graph path", "Explanation panel", "More trustworthy QA flow"],
            pmNote: "Trust improved when users could inspect the path, not just read the answer."
          }
        ],
        widget: {
          type: "evidence-path",
          title: "Pick a reasoning focus",
          help: "Each focus loads a different evidence path. The drafted answer card updates, and the traceability score shows how many answer claims are supported by the lit-up edges.",
          nodes: [
            { id: "query", label: "Query", x: 12, y: 50 },
            { id: "drug", label: "Drug", x: 34, y: 22 },
            { id: "disease", label: "Disease", x: 66, y: 22 },
            { id: "gene", label: "Gene", x: 55, y: 68 },
            { id: "trial", label: "Trial", x: 86, y: 50 },
            { id: "answer", label: "Answer", x: 34, y: 82 }
          ],
          edges: [
            ["query", "drug"],
            ["query", "disease"],
            ["drug", "gene"],
            ["disease", "gene"],
            ["gene", "trial"],
            ["gene", "answer"],
            ["trial", "answer"]
          ],
          views: [
            {
              id: "drug",
              label: "Drug focus",
              note: "Mechanism-first path: starts from the intervention.",
              highlightNodes: ["query", "drug", "gene", "answer"],
              highlightEdges: ["query-drug", "drug-gene", "gene-answer"],
              traceScore: 0.78,
              citations: 3,
              answer: "Drug X appears to act on Gene G, whose downstream effects match the reported phenotype.",
              claims: [
                { text: "Drug X targets Gene G", supported: true },
                { text: "Gene G is implicated in Disease D", supported: true },
                { text: "Trial T confirms clinical efficacy", supported: false }
              ]
            },
            {
              id: "disease",
              label: "Disease focus",
              note: "Phenotype-first path: anchors on the disease before reasoning outward.",
              highlightNodes: ["query", "disease", "gene", "answer"],
              highlightEdges: ["query-disease", "disease-gene", "gene-answer"],
              traceScore: 0.74,
              citations: 3,
              answer: "Disease D shares pathway G with the intervention of interest.",
              claims: [
                { text: "Disease D involves Gene G", supported: true },
                { text: "Gene G is druggable", supported: true },
                { text: "Trial evidence is clinical-grade", supported: false }
              ]
            },
            {
              id: "evidence",
              label: "Evidence-first \u2605",
              note: "Surfaces the trial/citation path \u2014 highest traceability.",
              highlightNodes: ["gene", "trial", "answer"],
              highlightEdges: ["gene-trial", "trial-answer"],
              traceScore: 0.92,
              citations: 5,
              answer: "Based on Trial T\u2019s arm comparison, Drug X has a statistically meaningful effect via Gene G.",
              claims: [
                { text: "Trial T compared Drug X and control", supported: true },
                { text: "Effect size exceeds noise floor", supported: true },
                { text: "Mechanism is Gene-G mediated", supported: true }
              ]
            }
          ]
        }
      },

      {
        id: "imaging",
        navTitle: "Microscopy Analysis Agent",
        navMeta: "0.82 IoU  \u00b7  2 months of labor saved",
        title: "Microscopy Segmentation with Threshold Sweeps",
        source: "University of Minnesota Medical School",
        summary:
          "Combines preprocessing, deep-learning segmentation, threshold sweeps, and reporting so scientists can inspect stability before exporting a result.",
        algorithmSummary:
          "The key insight is that the same segmentation model has a narrow stable operating range. Threshold 44\u201352 maximizes IoU while holding false-positive area under 8% \u2014 the sweet spot the UI exposes visually.",
        owned: [
          "Designed the image-to-report workflow.",
          "Built threshold exploration for scientist review.",
          "Combined model outputs with QC and reporting."
        ],
        metrics: [
          { label: "Impact", value: "2 months saved" },
          { label: "Model IoU", value: "0.82" },
          { label: "Stable range", value: "44\u201352" }
        ],
        endorsement: {
          quote: "The threshold sweeps changed the conversation from 'trust the model' to 'inspect the evidence and pick the operating range.'",
          by: "Wet-lab partner",
          role: "Microscopy workflow stakeholder"
        },
        relatedTech: ["python", "pytorch", "r", "react", "docker"],
        accent: "#b45309",
        stages: [
          {
            label: "Ingest",
            inputTitle: "Raw image set",
            inputLines: ["Multi-channel microscopy", "Replicates", "Metadata"],
            operationTitle: "Normalize inputs",
            operationLines: ["Load channels", "Register metadata", "Prepare image stack"],
            outputTitle: "Analysis-ready images",
            outputLines: ["Consistent input format", "Linked sample metadata", "Reusable study setup"],
            pmNote: "Reliable ingestion mattered because downstream comparison depended on consistent sample handling."
          },
          {
            label: "Segment",
            inputTitle: "Analysis-ready images",
            inputLines: ["Signal channel", "Background channel", "Region masks"],
            operationTitle: "Denoise and segment",
            operationLines: ["Apply preprocessing", "Run U-Net or related model", "Generate candidate masks"],
            outputTitle: "Candidate structures",
            outputLines: ["Predicted regions", "Noise-reduced image", "Mask overlays"],
            pmNote: "Showing candidate masks made it easier to discuss failure modes with domain experts."
          },
          {
            label: "Sweep",
            inputTitle: "Candidate masks",
            inputLines: ["Threshold range", "Replicate curves", "Overlay previews"],
            operationTitle: "Threshold exploration",
            operationLines: ["Sweep threshold values", "Track IoU / precision / recall", "Highlight stable range"],
            outputTitle: "Stability view",
            outputLines: ["Dial triplet", "Suggested operating range", "QC note"],
            pmNote: "Interactive threshold sweeps converted a single opaque cutoff into a transparent decision."
          },
          {
            label: "Report",
            inputTitle: "Stable threshold choice",
            inputLines: ["Selected cutoff", "Replicate stats", "QC annotations"],
            operationTitle: "Compute and export",
            operationLines: ["Summarize features", "Compare groups", "Export report and figures"],
            outputTitle: "Shareable output",
            outputLines: ["Report package", "Figures", "Reproducible settings"],
            pmNote: "The reporting layer turned the analysis from a model output into a reusable workflow product."
          }
        ],
        widget: {
          type: "neural-workbench",
          title: "Draw signal - watch the CNN respond",
          help: "A live project demo for the microscopy workflow: draw or load a sample, inspect layer activations, hide layers, and see the output confidence change in real time.",
          note: "The interaction mirrors the project decision path: raw image signal, learned filters, pooled features, dense evidence, then an export gate that makes model confidence reviewable before reporting.",
          min: 35,
          max: 85,
          value: 52,
          defaultPreset: "fibrosis",
          layers: [
            { id: "input", label: "Input", defaultVisible: true },
            { id: "conv1", label: "Conv 1", defaultVisible: true },
            { id: "pool1", label: "Pool 1", defaultVisible: true },
            { id: "conv2", label: "Conv 2", defaultVisible: true },
            { id: "fc1", label: "Dense", defaultVisible: true },
            { id: "output", label: "Output", defaultVisible: true }
          ],
          classes: [
            { id: "fibrosis", label: "Fibrosis mask", color: "#b45309" },
            { id: "cells", label: "Cell infiltration", color: "#1d4ed8" },
            { id: "background", label: "Background", color: "#0f766e" },
            { id: "artifact", label: "Artifact", color: "#dc2626" }
          ],
          presets: [
            { id: "fibrosis", label: "Fibrosis band", note: "Dense diagonal signal." },
            { id: "cells", label: "Cell clusters", note: "Multiple nuclei-like blobs." },
            { id: "artifact", label: "Edge artifact", note: "Noisy border and ring." },
            { id: "sparse", label: "Sparse signal", note: "Low-confidence sample." }
          ]
        }
      },

      {
        id: "causal",
        navTitle: "Causal & Survival Analysis",
        navMeta: "MIMIC-IV  \u00b7  doubly robust estimator",
        title: "Causal and Survival Analysis in Venous Thromboembolism",
        source: "University of Minnesota / MIMIC-IV",
        summary:
          "End-to-end ICU cohort study on anticoagulation therapy: cohort extraction, propensity-score adjustment, doubly robust estimator, and competing-risks survival.",
        algorithmSummary:
          "The parameter that matters is the estimator. Switching from an unadjusted hazard ratio (0.84) to the doubly robust estimator (0.68) changes the clinical recommendation \u2014 and the confidence interval narrows, not widens.",
        owned: [
          "Cohort definition and SQL extraction from MIMIC-IV.",
          "Propensity score and doubly robust estimation.",
          "Time-to-event modeling (KM, Cox, competing risks)."
        ],
        metrics: [
          { label: "Data", value: "MIMIC-IV" },
          { label: "Best HR", value: "0.68" },
          { label: "CI width", value: "narrowest (DR)" }
        ],
        endorsement: {
          quote: "He kept the causal analysis grounded in clinical interpretation instead of letting it stop at the model output.",
          by: "Clinical analytics advisor",
          role: "Outcome study reviewer"
        },
        relatedTech: ["r", "python", "sql"],
        accent: "#7c3aed",
        stages: [
          {
            label: "Extract",
            inputTitle: "Clinical database",
            inputLines: ["MIMIC-IV tables", "ICD codes", "Medication records"],
            operationTitle: "Cohort definition",
            operationLines: ["SQL extraction", "Inclusion/exclusion", "Variable harmonization"],
            outputTitle: "Analysis cohort",
            outputLines: ["Patient-level dataset", "Treatment indicators", "Outcome variables"],
            pmNote: "Clear cohort definitions prevent selection bias from propagating through the analysis."
          },
          {
            label: "Adjust",
            inputTitle: "Analysis cohort",
            inputLines: ["Covariates", "Treatment assignment", "Confounders"],
            operationTitle: "Causal adjustment",
            operationLines: ["Propensity score", "Doubly robust estimator", "Balance diagnostics"],
            outputTitle: "Adjusted estimates",
            outputLines: ["Treatment effect", "Confidence intervals", "Balance tables"],
            pmNote: "Doubly robust estimation protects against model misspecification."
          },
          {
            label: "Model",
            inputTitle: "Adjusted data",
            inputLines: ["Time-to-event outcomes", "Censoring indicators", "Competing events"],
            operationTitle: "Survival modeling",
            operationLines: ["Kaplan\u2013Meier", "Cox PH regression", "Competing risks"],
            outputTitle: "Survival estimates",
            outputLines: ["Hazard ratios", "Survival curves", "Subgroup comparisons"],
            pmNote: "Competing risks matter because death before recurrence changes treatment-effect interpretation."
          },
          {
            label: "Report",
            inputTitle: "Model output",
            inputLines: ["Effect estimates", "Diagnostics", "Clinical context"],
            operationTitle: "Communicate findings",
            operationLines: ["Forest plots", "Summary tables", "Sensitivity analyses"],
            outputTitle: "Clinical report",
            outputLines: ["Treatment recommendations", "Risk stratification", "Reproducible code"],
            pmNote: "The report bridges statistical output and clinical decision-making."
          }
        ],
        widget: {
          type: "estimator-forest",
          title: "Compare estimators on the same cohort",
          help: "Same 3,100-patient cohort. Each row is an estimator; the dot is the point estimate of the hazard ratio, the bar is its 95% CI. The dashed line is HR = 1 (no effect).",
          refLine: 1.0,
          xMin: 0.4,
          xMax: 1.2,
          winner: "doubly-robust",
          rows: [
            {
              id: "naive",
              label: "Unadjusted",
              hr: 0.84,
              ciLow: 0.66,
              ciHigh: 1.08,
              pValue: "0.18",
              note: "Confounded by indication bias \u2014 crosses 1.0."
            },
            {
              id: "ipw",
              label: "IPW",
              hr: 0.72,
              ciLow: 0.59,
              ciHigh: 0.88,
              pValue: "0.002",
              note: "Propensity weighting balances treatment groups."
            },
            {
              id: "doubly-robust",
              label: "Doubly robust \u2605",
              hr: 0.68,
              ciLow: 0.58,
              ciHigh: 0.80,
              pValue: "<0.001",
              note: "Tightest CI, clinically meaningful effect."
            }
          ],
          subgroups: [
            { id: "low", label: "Low-risk subgroup", hr: 0.78, ciLow: 0.62, ciHigh: 0.98 },
            { id: "mod", label: "Moderate-risk subgroup", hr: 0.68, ciLow: 0.55, ciHigh: 0.84 },
            { id: "high", label: "High-risk subgroup", hr: 0.55, ciLow: 0.42, ciHigh: 0.72 }
          ]
        }
      },

      {
        id: "biobank",
        navTitle: "UK Biobank Scale-Up",
        navMeta: "5M+ features  ·  80x runtime reduction",
        title: "Single-Pass Method-of-Moments Analysis for UK Biobank Imaging",
        source: "University of Minnesota Medical School",
        summary:
          "Reworked a high-dimensional brain-imaging analysis so 5M+ features could be screened in one pass instead of repeated model fits.",
        algorithmSummary:
          "The project is driven by estimator choice: replacing repeated regressions with a single-pass Method-of-Moments estimator cut runtime by 80x while preserving reviewable effect estimates.",
        owned: [
          "Translated the analysis plan into a memory-aware Python/R workflow.",
          "Designed feature batching and result checks for 5M+ imaging-derived variables.",
          "Compared single-pass estimates against slower baselines before release."
        ],
        metrics: [
          { label: "Features", value: "5M+" },
          { label: "Runtime", value: "80x faster" },
          { label: "Method", value: "MoM" }
        ],
        endorsement: {
          quote: "The scale-up made a biobank analysis practical without giving up statistical checks.",
          by: "Imaging analytics collaborator",
          role: "UMN Medical School"
        },
        relatedTech: ["python", "r", "sql", "git"],
        accent: "#475569",
        stages: [
          {
            label: "Stream",
            inputTitle: "High-dimensional imaging table",
            inputLines: ["5M+ features", "Subject covariates", "Outcome definitions"],
            operationTitle: "Accumulate statistics once",
            operationLines: ["Single-pass Method-of-Moments", "Memory-aware batching", "Checkpoint QC summaries"],
            outputTitle: "Estimator-ready summaries",
            outputLines: ["Sufficient statistics", "Batch logs", "QC counts"],
            pmNote: "Batch logs made the speed-up auditable instead of just faster."
          },
          {
            label: "Validate",
            inputTitle: "Fast estimates",
            inputLines: ["MoM output", "Sampled baseline fits", "QC flags"],
            operationTitle: "Compare to slower baseline",
            operationLines: ["Spot-check coefficients", "Compare standard errors", "Flag unstable features"],
            outputTitle: "Biobank analysis package",
            outputLines: ["Ranked findings", "Runtime comparison", "Reusable workflow"],
            pmNote: "The fast path only mattered because it could be checked against the slow path."
          }
        ],
        widget: {
          type: "estimator-forest",
          title: "Compare scaling strategies",
          help: "Each row compares the same high-dimensional analysis under a different estimator strategy.",
          refLine: 1.0,
          xMin: 0.7,
          xMax: 1.2,
          winner: "mom",
          rows: [
            { id: "full-fit", label: "Repeated full fits", hr: 1.00, ciLow: 0.98, ciHigh: 1.02, pValue: "baseline", note: "Most familiar, but impractical at 5M+ features." },
            { id: "sampled", label: "Sampled validation", hr: 0.96, ciLow: 0.91, ciHigh: 1.05, pValue: "check", note: "Useful for validation, not a complete screen." },
            { id: "mom", label: "Single-pass MoM ★", hr: 0.99, ciLow: 0.97, ciHigh: 1.02, pValue: "80x", note: "Matches baseline closely while making the run feasible." }
          ],
          subgroups: [
            { id: "cortical", label: "Cortical features", hr: 0.98, ciLow: 0.95, ciHigh: 1.03 },
            { id: "subcortical", label: "Subcortical features", hr: 1.01, ciLow: 0.97, ciHigh: 1.06 },
            { id: "qc", label: "QC-passing subset", hr: 0.99, ciLow: 0.97, ciHigh: 1.02 }
          ]
        }
      },

      {
        id: "ehr-nlp",
        navTitle: "EHR Text Mining Toolkit",
        navMeta: "clinical notes  ·  reusable NLP wrapper",
        title: "Reusable NLP Toolkit for Electronic Health Record Text",
        source: "University of Minnesota / CSE",
        summary:
          "Wrapped common clinical NLP steps into reusable extraction, normalization, and review utilities for health-record text mining.",
        algorithmSummary:
          "The winning knob is review strictness: high-confidence extraction reduces false positives, while a balanced setting keeps enough recall for clinical concept discovery.",
        owned: [
          "Built wrapper functions for note ingestion, concept extraction, and normalized outputs.",
          "Connected LLM-assisted extraction to reviewable fields and provenance notes.",
          "Structured reusable text-mining utilities for downstream research workflows."
        ],
        metrics: [
          { label: "Input", value: "EHR notes" },
          { label: "Output", value: "concept tables" },
          { label: "Use", value: "clinical NLP" }
        ],
        endorsement: {
          quote: "The wrapper made NLP experiments easier to repeat and easier to review.",
          by: "Research collaborator",
          role: "Health NLP project"
        },
        relatedTech: ["python", "openai", "langchain", "sql"],
        accent: "#0891b2",
        stages: [
          {
            label: "Extract",
            inputTitle: "Clinical text",
            inputLines: ["Notes", "Metadata", "Study concept list"],
            operationTitle: "Run extraction",
            operationLines: ["Section splitting", "LLM-assisted extraction", "Confidence scoring"],
            outputTitle: "Candidate concepts",
            outputLines: ["Concept table", "Evidence spans", "Scores"],
            pmNote: "Evidence spans made the output reviewable, not just machine-generated."
          },
          {
            label: "Export",
            inputTitle: "Accepted concepts",
            inputLines: ["Labels", "Study IDs", "Provenance"],
            operationTitle: "Package analysis table",
            operationLines: ["Standardize fields", "Join covariates", "Export reusable files"],
            outputTitle: "Research-ready dataset",
            outputLines: ["Analysis table", "Codebook", "QC summary"],
            pmNote: "The final dataset could feed statistics work without re-parsing notes."
          }
        ],
        widget: {
          type: "tradeoff-frontier",
          title: "Pick the extraction strictness",
          help: "Strict extraction improves precision; balanced extraction is usually better when reviewers still inspect evidence spans.",
          xLabel: "Recall",
          yLabel: "Precision",
          baseline: { id: "baseline", label: "Keyword baseline", precision: 0.57, recall: 0.52, score: "F1 = 0.54" },
          winner: "balanced",
          runs: [
            { id: "strict", label: "Strict", precision: 0.91, recall: 0.58, scoreName: "Precision", scoreValue: 0.91, deltaLabel: "fewest false positives", takeaway: "Best when review time is scarce.", ranking: [{ label: "Medication mention", score: 91, match: "exact evidence span" }, { label: "Outcome event", score: 84, match: "high-confidence phrase" }, { label: "Comorbidity", score: 76, match: "review recommended" }] },
            { id: "balanced", label: "Balanced ★", precision: 0.82, recall: 0.77, scoreName: "F1", scoreValue: 0.79, deltaLabel: "+0.25 vs baseline", takeaway: "Best default for concept discovery with review.", ranking: [{ label: "Outcome event", score: 89, match: "balanced evidence" }, { label: "Medication mention", score: 86, match: "strong span" }, { label: "Lab abnormality", score: 81, match: "needs context" }] },
            { id: "explore", label: "Explore", precision: 0.66, recall: 0.90, scoreName: "Recall", scoreValue: 0.90, deltaLabel: "broadest sweep", takeaway: "Useful for early ontology expansion.", ranking: [{ label: "Lab abnormality", score: 83, match: "broad signal" }, { label: "Comorbidity", score: 79, match: "weak phrase" }, { label: "Symptom mention", score: 75, match: "exploratory" }] }
          ]
        }
      },

      {
        id: "inkpulse",
        navTitle: "InkPulse Visual Analytics",
        navMeta: "SvelteKit  ·  human-AI collaboration",
        title: "InkPulse Timeline and Pattern Search for Human-AI Review",
        source: "University of Minnesota / Visualization Lab",
        summary:
          "Improved timeline and pattern-search interfaces for a visual analytics platform studying how people collaborate with AI-generated artifacts.",
        algorithmSummary:
          "The structure that matters is the evidence trace: timeline selections, pattern clusters, and explanation panels share state so reviewers can inspect why an AI-assisted pattern was surfaced.",
        owned: [
          "Refined SvelteKit timeline interactions and pattern-search panels.",
          "Connected AI-surfaced patterns to visible evidence in the review interface.",
          "Improved state transitions so analysts could move between overview and detail."
        ],
        metrics: [
          { label: "Stack", value: "SvelteKit" },
          { label: "Surface", value: "timeline" },
          { label: "Focus", value: "review UX" }
        ],
        endorsement: {
          quote: "He made the visual analysis flow easier to inspect and easier to explain to collaborators.",
          by: "Visualization lab teammate",
          role: "InkPulse project"
        },
        relatedTech: ["typescript", "sveltekit", "react", "git"],
        accent: "#dc2626",
        stages: [
          {
            label: "Surface",
            inputTitle: "Session model",
            inputLines: ["Event groups", "Pattern candidates", "Analyst filters"],
            operationTitle: "Rank visible patterns",
            operationLines: ["Filter by behavior", "Cluster similar episodes", "Score review relevance"],
            outputTitle: "Pattern shortlist",
            outputLines: ["Ranked motifs", "Timeline highlights", "Explanation hooks"],
            pmNote: "The interface needed a reason for each surfaced pattern."
          },
          {
            label: "Inspect",
            inputTitle: "Pattern shortlist",
            inputLines: ["Selected motif", "Linked timeline spans", "AI rationale"],
            operationTitle: "Bind evidence to UI",
            operationLines: ["Highlight timeline", "Open explanation panel", "Show related episodes"],
            outputTitle: "Inspectable pattern",
            outputLines: ["Linked spans", "Rationale", "Reviewer notes"],
            pmNote: "Shared state between timeline and explanation reduced context switching."
          }
        ],
        widget: {
          type: "evidence-path",
          title: "Pick a pattern trace",
          help: "Each view links an AI-surfaced pattern back to timeline evidence and reviewer actions.",
          nodes: [
            { id: "events", label: "Events", x: 12, y: 50 },
            { id: "cluster", label: "Cluster", x: 34, y: 22 },
            { id: "timeline", label: "Timeline", x: 65, y: 22 },
            { id: "rationale", label: "Rationale", x: 54, y: 69 },
            { id: "review", label: "Review", x: 86, y: 50 },
            { id: "report", label: "Report", x: 34, y: 82 }
          ],
          edges: [["events", "cluster"], ["cluster", "timeline"], ["timeline", "rationale"], ["rationale", "review"], ["review", "report"], ["events", "report"]],
          views: [
            { id: "timeline", label: "Timeline", note: "Focuses on temporal evidence before explanation.", highlightNodes: ["events", "timeline", "rationale"], highlightEdges: ["cluster-timeline", "timeline-rationale"], traceScore: 0.76, citations: 4, answer: "The selected pattern is concentrated around revision bursts after AI suggestions.", claims: [{ text: "Pattern has visible timeline spans", supported: true }, { text: "Reviewer actions follow the cluster", supported: true }, { text: "All sessions show the same pattern", supported: false }] },
            { id: "review", label: "Review ★", note: "Highest traceability because it connects event, rationale, and reviewer decision.", highlightNodes: ["timeline", "rationale", "review", "report"], highlightEdges: ["timeline-rationale", "rationale-review", "review-report"], traceScore: 0.90, citations: 5, answer: "The accepted pattern is supported by timeline evidence, model rationale, and reviewer confirmation.", claims: [{ text: "Timeline span supports the pattern", supported: true }, { text: "Rationale links to the selected span", supported: true }, { text: "Reviewer confirmed the finding", supported: true }] }
          ]
        }
      },

      {
        id: "exam-review",
        navTitle: "AI Exam Review Skills",
        navMeta: "Codex + Claude  ·  skill workflows",
        title: "Agent-Skill Workflows for AI-Assisted Exam Review",
        source: "University of Minnesota / CSE",
        summary:
          "Built AI-assisted study tools that convert lecture material into visual explanations, equation-code links, flashcards, and review-ready outputs.",
        algorithmSummary:
          "The useful setting is automation strictness: too loose creates noisy study material; too strict misses concepts. The stable band keeps generated explanations reviewable.",
        owned: [
          "Designed Codex and Claude workflows for lecture-to-study-guide transformation.",
          "Linked equations, code, and distribution visuals into interactive review materials.",
          "Packaged repeatable instructions as agent skills with explicit validation steps."
        ],
        metrics: [
          { label: "Agents", value: "Codex + Claude" },
          { label: "Output", value: "study tools" },
          { label: "Pattern", value: "skills" }
        ],
        endorsement: {
          quote: "He turned recurring study-guide generation into a repeatable workflow instead of a one-off prompt.",
          by: "Course collaborator",
          role: "AI-assisted review tools"
        },
        relatedTech: ["openai", "claude", "python", "react"],
        accent: "#16a34a",
        stages: [
          {
            label: "Generate",
            inputTitle: "Concept map",
            inputLines: ["Topics", "Formula links", "Prompt instructions"],
            operationTitle: "Run agent workflow",
            operationLines: ["Draft explanations", "Create flashcards", "Build quizzes"],
            outputTitle: "Study artifacts",
            outputLines: ["Guides", "Cards", "Quiz items"],
            pmNote: "Explicit task boundaries kept the agent output consistent across lectures."
          },
          {
            label: "Validate",
            inputTitle: "Study artifacts",
            inputLines: ["Generated answers", "Source references", "Known formulas"],
            operationTitle: "Check correctness",
            operationLines: ["Compare to source", "Run code snippets", "Mark low-confidence items"],
            outputTitle: "Review queue",
            outputLines: ["Accepted items", "Needs-review items", "Fixed examples"],
            pmNote: "Validation was the difference between a demo and a study tool people could trust."
          }
        ],
        widget: {
          type: "threshold-dials",
          title: "Set the automation strictness",
          help: "The stable band balances concept coverage with review quality before publishing a study guide.",
          min: 20,
          max: 80,
          value: 52,
          stableMin: 46,
          stableMax: 58,
          metrics: [
            { id: "quality", label: "Quality", target: 0.88, peakAt: 52, sharpness: 420, floor: 0.48, winner: true },
            { id: "coverage", label: "Coverage", peakAt: 30, sharpness: 260, floor: 0.45, monotonic: "down" },
            { id: "review", label: "Review load", peakAt: 70, sharpness: 260, floor: 0.42, monotonic: "up" }
          ],
          presets: [
            { id: "loose", value: 34, label: "Loose (0.34)", note: "More concepts, noisy explanations." },
            { id: "stable", value: 52, label: "Stable ★ (0.52)", note: "Best review-ready output." },
            { id: "strict", value: 70, label: "Strict (0.70)", note: "High polish, misses edge concepts." }
          ]
        }
      }
    ]
  };
})();
