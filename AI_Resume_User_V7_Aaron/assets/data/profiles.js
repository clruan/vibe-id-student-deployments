/*
 * profiles.js - local profile registry for AI Resume V7.
 * Source data stays close to the existing V3/Vibe pages; this layer only
 * adapts those sources into the shared V7 template shape.
 */
(function () {
  var registry = window.aiResumeData || (window.aiResumeData = {});
  var aliases = window.aiResumeProfileAliases || (window.aiResumeProfileAliases = {});

  registerDuke();
  registerFrankMetadata();
  registerAaronFromVibeSource();

  Object.assign(aliases, {
    duke: "duke-ruan",
    "duke-ruan": "duke-ruan",
    frank: "frank-yin",
    "frank-yin": "frank-yin",
    aaron: "aaron-li",
    "aaron-li": "aaron-li",
    arron: "aaron-li",
    "arron-li": "aaron-li"
  });

  function registerDuke() {
    var base = window.aiResumeUserBase;
    if (!base) return;

    registry["duke-ruan"] = Object.assign({}, base, {
      id: "duke-ruan",
      order: 1,
      targetRole: "AI, data systems, and biostatistics profile",
      profile: Object.assign({}, base.profile, {
        targetRole: "AI, data systems, and biostatistics profile",
        summary:
          "Biostatistics and AI engineer building reviewable ML systems, clinical analytics workflows, and interactive data products. I connect statistical rigor, model evaluation, and product-facing interfaces so stakeholders can inspect how technical decisions were made.",
        summaryHtml:
          'Biostatistics and <strong>AI engineer</strong> building <strong>reviewable ML systems</strong>, clinical analytics workflows, and interactive data products. I connect <strong>statistical rigor</strong>, model evaluation, and product-facing interfaces so stakeholders can inspect how technical decisions were made.'
      }),
      skillLayout: {
        primary: { group: "quant", title: "Quantitative Toolkit" },
        secondary: [
          { group: "stack", title: "Technical Stack" }
        ]
      },
      directory: {
        role: "AI engineering, clinical analytics, and explainable data products",
        summary: "Builds ML workflows, biomedical analytics systems, and reviewer-facing project demos.",
        highlights: ["Reviewable ML", "Clinical analytics", "Interactive AI tools"]
      },
      results: [
        {
          value: "97%",
          label: "cell-classification accuracy",
          note: "CNN workflow on 20,000+ microscopy samples from the CV."
        },
        {
          value: "0-4095",
          label: "interactive threshold range",
          note: "ND2 pipeline exposes real-time sliders across microscopy channels."
        },
        {
          value: "5",
          label: "analysis channels",
          note: "RGB plus Green/Blue and Red/Blue ratio views in the ND2 analysis repo."
        },
        {
          value: "2 mo",
          label: "manual counting labor saved",
          note: "Automated microscopy classification reduced repetitive cell counting."
        }
      ],
      stack: buildDukeStack(base),
      quantToolkit: buildDukeQuantToolkit(),
      experience: buildDukeExperience(base),
      projects: buildDukeProjects(base),
      ui: {
        metaTitle: "Duke Ruan | AI Resume User V7",
        metaDescription: "Local AI Resume V7 profile for Duke Ruan with reviewable AI, biostatistics, and clinical analytics projects.",
        resultsTitle: "Selected Results",
        experienceTitle: "Research and Professional Experience",
        projectsTitle: "Selected AI and Analytics Projects",
        projectsSubtitle: "Open a project to inspect the method stages and a purpose-built demo. The ND2 agent and deep-learning microscopy work are intentionally split.",
        demoCallout: "Duke V7 now treats each project like a full product or research system: ownership, logic, metrics, source links, and an interactive inspection surface.",
        educationTitle: "Education",
        awardsTitle: "Awards",
        publicationsTitle: "Publications",
        chatTitle: "Ask about Duke",
        chatPlaceholder: "Ask about Duke's projects...",
        chatGreeting: "Hi! I can answer questions about Duke's AI, analytics, biostatistics, projects, and experience."
      }
    });
  }

  function buildDukeStack(base) {
    var seen = {};
    return (base.stack || []).concat([
      { id: "d3", label: "D3", color: "#d97706" },
      { id: "plotly", label: "Plotly", color: "#3b82f6" },
      { id: "tailwind", label: "Tailwind CSS", color: "#38bdf8" },
      { id: "powerbi", label: "Power BI", color: "#d9a300" },
      { id: "redcap", label: "REDCap", color: "#b91c1c" },
      { id: "java", label: "Java / JPype", color: "#b45309" }
    ]).filter(function (item) {
      if (seen[item.id]) return false;
      seen[item.id] = true;
      return true;
    });
  }

  function buildDukeQuantToolkit() {
    return [
      { label: "ND2 metadata extraction", relatedProjects: ["nd2-agent"], relatedExp: ["exp-0"] },
      { label: "0-4095 threshold sweeps", relatedProjects: ["nd2-agent"], relatedExp: ["exp-0"] },
      { label: "Replicate-aware statistics", relatedProjects: ["nd2-agent"], relatedExp: ["exp-0"] },
      { label: "Excel / PNG reporting", relatedProjects: ["nd2-agent"], relatedExp: ["exp-0"] },
      { label: "CNN classification", relatedProjects: ["deep-imaging"], relatedExp: ["exp-3"] },
      { label: "U-Net segmentation", relatedProjects: ["deep-imaging"], relatedExp: ["exp-0"] },
      { label: "Med-SAM / DeepLabV3", relatedProjects: ["deep-imaging"], relatedExp: ["exp-0"] },
      { label: "IoU / accuracy review", relatedProjects: ["deep-imaging"], relatedExp: ["exp-0", "exp-3"] },
      { label: "Kaplan-Meier curves", relatedProjects: ["vte-causal"], relatedExp: ["exp-0"] },
      { label: "Cox models", relatedProjects: ["vte-causal"], relatedExp: ["exp-0"] },
      { label: "Competing risks", relatedProjects: ["vte-causal"], relatedExp: ["exp-0"] },
      { label: "Propensity scores", relatedProjects: ["vte-causal"], relatedExp: ["exp-0"] },
      { label: "Doubly robust estimation", relatedProjects: ["vte-causal"], relatedExp: ["exp-0"] },
      { label: "Causal diagrams", relatedProjects: ["causal-companion"], relatedExp: [] },
      { label: "Effect definitions", relatedProjects: ["causal-companion"], relatedExp: [] },
      { label: "Assumption navigation", relatedProjects: ["causal-companion"], relatedExp: [] },
      { label: "nDCG@k", relatedProjects: ["matching"], relatedExp: ["exp-2"] },
      { label: "Overlap@k", relatedProjects: ["matching"], relatedExp: ["exp-2"] },
      { label: "Embedding evaluation", relatedProjects: ["matching"], relatedExp: ["exp-2"] },
      { label: "Evidence-path tracing", relatedProjects: ["knownet"], relatedExp: ["exp-1"] },
      { label: "Biomedical KG grounding", relatedProjects: ["knownet"], relatedExp: ["exp-1"] },
      { label: "Timeline pattern search", relatedProjects: ["inkpulse"], relatedExp: ["exp-1"] },
      { label: "Human-AI episode comparison", relatedProjects: ["inkpulse"], relatedExp: ["exp-1"] },
      { label: "Semantic object extraction", relatedProjects: ["pynile"], relatedExp: ["exp-1"] },
      { label: "Dictionary validation", relatedProjects: ["pynile"], relatedExp: ["exp-1"] },
      { label: "Certainty / negation parsing", relatedProjects: ["pynile"], relatedExp: ["exp-1"] }
    ];
  }

  function buildDukeExperience(base) {
    var experience = clone(base.experience || []);

    var exp0 = experience[0] || {};
    exp0.id = "exp-0";
    exp0.bullets = [
      "Implemented <strong>state-of-the-art segmentation models</strong> (U-Net, Med-SAM, DeepLabV3) for fibrosis and cell-infiltration detection in histopathology images.",
      "Developed a <strong>robust microscopy data-processing pipeline</strong> across multiple devices and formats, adding interactive parameters that made imaging decisions easier for domain scientists to inspect.",
      "Designed and maintained the open-source <strong>nd2-analysis-pipeline</strong>, an agent-based FastAPI + React system for multi-channel microscopy threshold exploration, cached previews, statistical tests, and configuration-metadata reporting.",
      "Conducted recurrent VTE survival analyses with <strong>Kaplan-Meier estimators</strong>, <strong>Cox proportional hazards models</strong>, and <strong>competing-risks models</strong> to identify high-risk subgroups."
    ];
    exp0.relatedTech = ["python", "pytorch", "fastapi", "react", "r", "sql"];
    exp0.relatedProjects = ["nd2-agent", "deep-imaging", "vte-causal"];

    var exp1 = experience[1] || {};
    exp1.id = "exp-1";
    exp1.role = "Research Assistant";
    exp1.organization = "University of Minnesota, College of Science and Engineering";
    exp1.dates = "Sep 2025 - Present";
    exp1.bullets = [
      "Contribute to <strong>InkPulse</strong>, a Svelte/SvelteKit visual analytics system for human-AI co-writing, by refining timeline and pattern-search views that help analysts compare key human and AI editing episodes.",
      "Implement focused front-end components and bug fixes for <strong>KNOWNET</strong>, a Next.js + Flask system for guided health information seeking with biomedical knowledge-graph integration.",
      "Translate user-study feedback into UI/UX improvements and prototype interaction patterns that balance statistical rigor with usability for patients, clinicians, and visualization researchers.",
      "Develop reusable NLP tooling around <strong>PyNILE</strong> to make medical text extraction, dictionary validation, and semantic-object review easier to run from Python workflows."
    ];
    exp1.relatedTech = ["react", "nextjs", "sveltekit", "flask", "python", "java", "d3"];
    exp1.relatedProjects = ["knownet", "inkpulse", "pynile", "causal-companion"];

    var exp2 = experience[2] || {};
    exp2.id = "exp-2";
    exp2.relatedProjects = ["matching"];

    var exp3 = experience[3] || {};
    exp3.id = "exp-3";
    exp3.bullets = [
      "Automated cell classification using <strong>convolutional neural networks</strong>, reaching <strong>97% accuracy</strong> on <strong>20,000+ samples</strong> and saving approximately <strong>two months</strong> of manual cell-counting labor.",
      "Performed statistical analyses and visualizations using PRISM, R, and Python to support academic posters and peer-reviewed publications in hematology and vascular biology.",
      "Optimized bio-image collection workflows and communicated results to clinicians through dashboards and visualizations, improving data quality and experimental design decisions."
    ];
    exp3.relatedTech = ["python", "tensorflow", "pytorch", "r", "tableau"];
    exp3.relatedProjects = ["deep-imaging", "nd2-agent"];

    return experience;
  }

  function buildDukeProjects(base) {
    var deepImaging = clone(baseProject(base, "imaging"));
    deepImaging.id = "deep-imaging";
    deepImaging.navTitle = "Deep Learning Microscopy";
    deepImaging.navMeta = "U-Net / Med-SAM / DeepLabV3 | CNN classification";
    deepImaging.title = "Deep Learning for Microscopy Segmentation and Cell Classification";
    deepImaging.source = "UMN Medical School imaging research";
    deepImaging.summary =
      "This is the deep-learning project: model comparison and CNN-based microscopy interpretation for fibrosis, cell infiltration, noise reduction, and automated cell classification.";
    deepImaging.algorithmSummary =
      "The core decision is model behavior under image noise and biological variability: compare candidate segmentation masks, inspect learned activations, and keep export confidence visible before reporting.";
    deepImaging.owned = [
      "Implemented U-Net, Med-SAM, and DeepLabV3 style segmentation workflows for histopathology review.",
      "Built CNN-based cell classification that reached 97% accuracy on 20,000+ samples in earlier lab work.",
      "Connected model outputs to visual QC so wet-lab collaborators could inspect failures instead of receiving a black-box label."
    ];
    deepImaging.metrics = [
      { label: "Classification", value: "97%" },
      { label: "Samples", value: "20,000+" },
      { label: "Models", value: "U-Net / Med-SAM / DeepLabV3" }
    ];
    deepImaging.relatedTech = ["python", "pytorch", "tensorflow", "r", "docker"];
    deepImaging.stages = [
      {
        label: "Curate",
        inputTitle: "Raw microscopy images",
        inputLines: ["Histopathology image sets", "Multi-channel signal", "Domain labels and QC notes"],
        operationTitle: "Normalize and prepare training data",
        operationLines: ["Register channels", "Standardize intensity and metadata", "Separate training, validation, and review sets"],
        outputTitle: "Model-ready image set",
        outputLines: ["Aligned images", "Candidate labels", "Reviewable metadata"],
        pmNote: "The deep-learning workflow starts with data discipline because small imaging differences can dominate downstream model behavior."
      },
      {
        label: "Model",
        inputTitle: "Prepared image tensors",
        inputLines: ["Fibrosis regions", "Cell infiltration patterns", "Noise and artifacts"],
        operationTitle: "Train and compare CNN models",
        operationLines: ["Run U-Net / Med-SAM / DeepLabV3 style segmentation", "Train CNN classifiers", "Track accuracy, IoU, and failure modes"],
        outputTitle: "Candidate model outputs",
        outputLines: ["Segmentation masks", "Class probabilities", "Activation traces"],
        pmNote: "The model is not treated as a single winner; it is compared through operating behavior and failure surfaces."
      },
      {
        label: "Inspect",
        inputTitle: "Candidate outputs",
        inputLines: ["Predicted masks", "Confidence scores", "Layer activations"],
        operationTitle: "Review evidence before export",
        operationLines: ["Inspect activation fields", "Check confidence threshold", "Compare against domain expectations"],
        outputTitle: "Defensible model decision",
        outputLines: ["Accepted masks", "Flagged failures", "Confidence-gated result"],
        pmNote: "This is why the live CNN workbench belongs here: the viewer can inspect learned evidence, not only read a model name."
      },
      {
        label: "Report",
        inputTitle: "Reviewed model output",
        inputLines: ["Validated masks", "Classification results", "QC annotations"],
        operationTitle: "Translate to study evidence",
        operationLines: ["Summarize groups", "Prepare figures", "Document settings and uncertainty"],
        outputTitle: "Research-ready analysis",
        outputLines: ["Figures", "Statistics", "Reusable settings"],
        pmNote: "The reporting layer connects deep learning to the scientific workflow instead of leaving it as an isolated prediction."
      }
    ];
    deepImaging.widget.title = "Inspect the deep-learning microscopy workbench";
    deepImaging.widget.help = "Draw or load a microscopy-like signal, inspect layer activations, hide layers, and see how export confidence changes. This is the deep-learning project, not the ND2 agent.";
    deepImaging.widget.note = "The workbench mirrors the deep-learning decision path: image signal, learned filters, pooled features, dense evidence, and a confidence-gated output.";

    var matching = clone(baseProject(base, "matching"));
    matching.title = "Resume-Job Matching Evaluation System";
    matching.summary =
      "A candidate-job matching evaluation system with parsing, PII removal, embeddings, vector-database comparisons, and reviewer-facing ranked results.";
    matching.source = "MentorX / resume-job matching system";
    matching.artifactLinks = [
      { label: "GitHub profile", href: "https://github.com/clruan", note: "Related code portfolio" }
    ];

    var knownet = clone(baseProject(base, "graph"));
    knownet.id = "knownet";
    knownet.navTitle = "KNOWNET Graph QA";
    knownet.navMeta = "IEEE VIS 2024 | Best Paper Honorable Mention system";
    knownet.title = "KNOWNET Guided Health Information Seeking Interface";
    knownet.source = "KNOWNET / UMN Visual Intelligence";
    knownet.summary =
      "A Next.js + Flask health-information interface that connects LLM answers to biomedical knowledge-graph nodes, edges, and explanation panels.";
    knownet.artifactLinks = [
      { label: "Open GitHub repo", href: "https://github.com/clruan/KNOWNET", note: "Public repository" },
      { label: "Open project docs", href: "https://visual-intelligence-umn.github.io/KNOWNET/", note: "Documentation" }
    ];
    knownet.relatedTech = ["react", "nextjs", "flask", "python", "d3"];

    var vte = {
      id: "vte-causal",
      navTitle: "VTE Causal Survival Lab",
      navMeta: "Kaplan-Meier | Cox PH | competing risks | propensity scores",
      title: "Causal and Survival Analysis in Recurrent Venous Thromboembolism",
      source: "UMN Medical School clinical analytics",
      summary:
        "End-to-end causal and survival workflow for anticoagulation therapy and thrombotic outcomes, from cohort definition and SQL extraction to interpretable time-to-event results.",
      algorithmSummary:
        "The key logic is a three-layer check: balance the treatment groups, estimate survival and competing-risk behavior, then compare estimators before making subgroup claims.",
      owned: [
        "Defined analysis cohorts and extraction logic for ICU and clinical-event data.",
        "Used propensity scores, doubly robust estimators, Kaplan-Meier curves, Cox models, and competing-risks methods.",
        "Translated high-risk subgroup findings into clinician-readable curves and risk summaries."
      ],
      metrics: [
        { label: "Methods", value: "KM / Cox / CR" },
        { label: "Adjustment", value: "PS + DR" },
        { label: "Output", value: "Risk subgroups" }
      ],
      endorsement: {
        text: "The value is not just running survival models; it is making confounding checks, time-to-event assumptions, and subgroup interpretation visible.",
        by: "Clinical analytics source",
        role: "CV-backed project"
      },
      relatedTech: ["r", "python", "sql", "redcap"],
      accent: "#7c3aed",
      stages: [
        {
          label: "Cohort",
          inputTitle: "Clinical event data",
          inputLines: ["Anticoagulation exposure", "Thrombotic outcomes", "Competing events"],
          operationTitle: "Define an analysis cohort",
          operationLines: ["Apply inclusion/exclusion rules", "Extract covariates", "Align index dates"],
          outputTitle: "Analysis table",
          outputLines: ["Treatment groups", "Event times", "Confounder matrix"],
          pmNote: "The cohort stage determines whether later causal estimates are interpretable."
        },
        {
          label: "Balance",
          inputTitle: "Observed treatment groups",
          inputLines: ["Baseline risk factors", "Treatment assignment", "Missingness profile"],
          operationTitle: "Adjust for confounding",
          operationLines: ["Estimate propensity scores", "Check covariate balance", "Prepare doubly robust estimators"],
          outputTitle: "Balanced comparison",
          outputLines: ["Weighted cohort", "Balance diagnostics", "Estimator-ready data"],
          pmNote: "Balance diagnostics are presented as part of the project because they are the trust gate."
        },
        {
          label: "Estimate",
          inputTitle: "Balanced comparison",
          inputLines: ["Event times", "Censoring", "Competing events"],
          operationTitle: "Run time-to-event models",
          operationLines: ["Kaplan-Meier estimates", "Cox proportional hazards", "Competing-risks checks"],
          outputTitle: "Risk estimates",
          outputLines: ["Survival curves", "Hazard ratios", "Subgroup contrasts"],
          pmNote: "The method choice is visible so reviewers can distinguish descriptive curves from adjusted estimates."
        },
        {
          label: "Explain",
          inputTitle: "Risk estimates",
          inputLines: ["Curve separation", "Adjusted HRs", "High-risk strata"],
          operationTitle: "Translate for collaborators",
          operationLines: ["Summarize uncertainty", "Flag assumption limits", "Prepare decision-facing visuals"],
          outputTitle: "Clinical story",
          outputLines: ["High-risk subgroup view", "Treatment-risk summary", "Reusable analysis notes"],
          pmNote: "The output is designed for scientific discussion, not only statistical completion."
        }
      ],
      widget: {
        type: "survival-causal-lab",
        title: "Compare estimators and survival curves",
        help: "Switch the risk stratum. The balance meter, survival curves, and estimator table update together so the causal reasoning remains inspectable.",
        defaultCohort: "high-risk",
        cohorts: [
          {
            id: "high-risk",
            label: "High-risk VTE",
            balance: 86,
            separation: 22,
            note: "Largest curve separation after adjustment.",
            curves: { treated: [98, 94, 90, 84, 78, 71], control: [97, 90, 82, 72, 62, 51] },
            estimators: [
              { label: "Unadjusted KM", value: "Visible separation", score: 62, tag: "descriptive" },
              { label: "Cox PH", value: "HR 0.68", score: 78, tag: "adjusted" },
              { label: "Doubly robust", value: "HR 0.63", score: 88, tag: "lead" }
            ]
          },
          {
            id: "moderate-risk",
            label: "Moderate-risk",
            balance: 79,
            separation: 13,
            note: "Moderate benefit signal with narrower separation.",
            curves: { treated: [99, 96, 92, 88, 83, 78], control: [98, 94, 88, 81, 75, 68] },
            estimators: [
              { label: "Unadjusted KM", value: "Small gap", score: 58, tag: "screen" },
              { label: "Cox PH", value: "HR 0.81", score: 70, tag: "adjusted" },
              { label: "Doubly robust", value: "HR 0.76", score: 76, tag: "lead" }
            ]
          },
          {
            id: "competing-risk",
            label: "Competing-risk check",
            balance: 82,
            separation: 9,
            note: "Competing events reduce naive curve separation.",
            curves: { treated: [99, 95, 91, 86, 80, 73], control: [98, 93, 87, 80, 72, 64] },
            estimators: [
              { label: "Naive KM", value: "Overstates gap", score: 48, tag: "watch" },
              { label: "Cause-specific Cox", value: "HR 0.79", score: 73, tag: "check" },
              { label: "Competing-risk model", value: "sHR 0.84", score: 80, tag: "lead" }
            ]
          }
        ]
      }
    };

    var causalCompanion = {
      id: "causal-companion",
      navTitle: "Causal Textbook Companion",
      navMeta: "What If companion | DAGs | layered summaries | code modules",
      title: "Interactive Causal Inference Textbook Companion",
      source: "Selected CV project",
      summary:
        "A multi-phase workflow to transform Hernan and Robins' What If into an interactive causal-inference companion with chapter summaries, causal knowledge graphs, visualizations, and reusable code modules.",
      algorithmSummary:
        "The project turns static causal-inference text into navigable learning objects: assumptions, diagrams, estimands, examples, and code all stay linked.",
      owned: [
        "Structured the ingestion-to-deployment workflow for chapter summaries and layered explanations.",
        "Organized prompts and outputs for causal knowledge graphs, effect definitions, and reusable code modules.",
        "Designed artifacts that help learners navigate assumptions, diagrams, and effect definitions more intuitively."
      ],
      metrics: [
        { label: "Layers", value: "Text / DAG / code" },
        { label: "Focus", value: "Assumptions" },
        { label: "Output", value: "Interactive companion" }
      ],
      endorsement: {
        text: "This project is a strong teaching artifact because it makes assumptions and estimands navigable instead of burying them in prose.",
        by: "CV project source",
        role: "Causal learning"
      },
      relatedTech: ["python", "react", "typescript", "d3", "openai"],
      accent: "#b45309",
      stages: [
        {
          label: "Ingest",
          inputTitle: "Causal inference chapters",
          inputLines: ["Core concepts", "Examples", "Assumptions and notation"],
          operationTitle: "Structure learning objects",
          operationLines: ["Chunk content", "Tag estimands", "Extract assumptions and examples"],
          outputTitle: "Chapter graph",
          outputLines: ["Concept nodes", "Assumption tags", "Example links"],
          pmNote: "The first challenge is preserving conceptual context when turning a textbook into an interface."
        },
        {
          label: "Map",
          inputTitle: "Structured concepts",
          inputLines: ["Treatment", "Outcome", "Confounders", "Selection"],
          operationTitle: "Build causal diagrams",
          operationLines: ["Create DAG views", "Link assumptions to edges", "Show identification path"],
          outputTitle: "Inspectable DAG",
          outputLines: ["Node/edge graph", "Backdoor logic", "Effect definition"],
          pmNote: "The DAG layer is the bridge between text, math, and code."
        },
        {
          label: "Code",
          inputTitle: "Example and estimand",
          inputLines: ["Data scenario", "Identification rule", "Estimator choice"],
          operationTitle: "Attach reusable modules",
          operationLines: ["Generate code scaffold", "Annotate assumptions", "Compare estimators"],
          outputTitle: "Runnable learning module",
          outputLines: ["R/Python snippets", "Interpretation notes", "Failure checks"],
          pmNote: "Code is useful only when it remains connected to the causal question it answers."
        },
        {
          label: "Explore",
          inputTitle: "Linked chapter artifacts",
          inputLines: ["Summary", "DAG", "Code", "Quiz-style prompts"],
          operationTitle: "Design the companion interface",
          operationLines: ["Layer explanations", "Add concept navigation", "Expose assumptions before answers"],
          outputTitle: "Interactive companion",
          outputLines: ["Chapter navigator", "Assumption inspector", "Reusable examples"],
          pmNote: "The interface rewards causal reasoning rather than memorizing formulas."
        }
      ],
      widget: {
        type: "causal-companion-lab",
        title: "Navigate the causal learning stack",
        help: "Choose a concept. The DAG, assumption checklist, and code-output layer update as one connected learning object.",
        defaultConcept: "confounding",
        concepts: [
          {
            id: "confounding",
            label: "Confounding",
            estimand: "ATE under exchangeability",
            assumptions: ["Consistency", "Exchangeability", "Positivity"],
            nodes: ["Treatment", "Confounder", "Outcome"],
            code: "fit <- glm(Y ~ A + L, family=binomial)",
            risk: "Backdoor path is open until L is adjusted."
          },
          {
            id: "selection",
            label: "Selection bias",
            estimand: "Effect among observed cohort",
            assumptions: ["Sampling mechanism known", "No collider conditioning", "Transport target clear"],
            nodes: ["Treatment", "Selection", "Outcome"],
            code: "weights <- 1 / p_observed",
            risk: "Conditioning on selection can open a noncausal path."
          },
          {
            id: "time-varying",
            label: "Time-varying treatment",
            estimand: "Sequential regime contrast",
            assumptions: ["Sequential exchangeability", "Correct time order", "No immortal time bias"],
            nodes: ["A0", "L1", "A1", "Y"],
            code: "ipw <- prod(1 / p_A_t)",
            risk: "Naive adjustment can block part of the treatment pathway."
          }
        ]
      }
    };

    var inkpulse = clone(baseProject(base, "inkpulse"));
    inkpulse.widget = {
      type: "timeline-pattern-lab",
      title: "Replay the human-AI writing timeline",
      help: "Select a pattern. The timeline, evidence bars, and analyst note update together to show how InkPulse turns event streams into reviewable episodes.",
      defaultPattern: "revision-burst",
      patterns: [
        {
          id: "revision-burst",
          label: "Revision burst",
          score: 90,
          note: "Human revision spikes after AI suggestions, then stabilizes into accepted text.",
          phases: [
            { label: "Draft", value: 34 },
            { label: "AI suggestion", value: 72 },
            { label: "Human edit", value: 92 },
            { label: "Accept", value: 76 }
          ],
          evidence: ["Dense edit cluster", "Suggestion accepted after rewrite", "Short latency to final text"]
        },
        {
          id: "search-review",
          label: "Search review",
          score: 82,
          note: "Analyst searches surrounding events before deciding whether the AI contribution is useful.",
          phases: [
            { label: "Query", value: 64 },
            { label: "Filter", value: 80 },
            { label: "Compare", value: 74 },
            { label: "Annotate", value: 68 }
          ],
          evidence: ["Pattern-search interaction", "Neighbor event comparison", "Manual annotation"]
        },
        {
          id: "rejected-ai",
          label: "Rejected AI",
          score: 71,
          note: "The AI contribution appears, but the human editor rejects it after local context review.",
          phases: [
            { label: "AI suggestion", value: 76 },
            { label: "Inspect", value: 70 },
            { label: "Reject", value: 88 },
            { label: "Rewrite", value: 64 }
          ],
          evidence: ["Suggestion deleted", "Human replacement follows", "Rationale panel flags mismatch"]
        }
      ]
    };

    var pynile = {
      id: "pynile",
      navTitle: "PyNILE Medical NLP",
      navMeta: "Python wrapper | semantic objects | dictionary validation",
      title: "PyNILE: Python Interface for Medical Text Information Extraction",
      source: "GitHub: clruan/PyNile",
      summary:
        "A Python wrapper around the NILE Java library that exposes medical concept extraction, semantic roles, certainty, dictionary management, batch processing, and export workflows.",
      algorithmSummary:
        "The useful layer is the bridge: Java NLP output becomes a Pythonic, inspectable workflow with dictionary validation, certainty filters, semantic roles, and batch statistics.",
      owned: [
        "Wrapped NILE Java functionality through a Python API with context managers and detailed validation.",
        "Exposed semantic object extraction, certainty and negation review, dictionary statistics, and custom dictionary entries.",
        "Added batch processing, export formats, text complexity analysis, and role-based filters for medical text workflows."
      ],
      metrics: [
        { label: "Interface", value: "Python + Java" },
        { label: "Outputs", value: "CSV / dict / codes" },
        { label: "Review", value: "Role + certainty" }
      ],
      endorsement: {
        text: "This project shows a practical software-engineering layer around medical NLP: make a specialized Java library usable and auditable from Python.",
        by: "GitHub README source",
        role: "Medical NLP tooling"
      },
      relatedTech: ["python", "java", "git"],
      accent: "#0f766e",
      artifactLinks: [
        { label: "Open GitHub repo", href: "https://github.com/clruan/PyNile", note: "Public repository" }
      ],
      stages: [
        {
          label: "Load",
          inputTitle: "Medical dictionaries",
          inputLines: ["Standard dictionaries", "MDD files", "Custom phrases"],
          operationTitle: "Validate dictionary setup",
          operationLines: ["Batch load dictionaries", "Check conflicts", "Expose dictionary statistics"],
          outputTitle: "Ready NLP engine",
          outputLines: ["Loaded dictionaries", "Entry counts", "Validation report"],
          pmNote: "Dictionary quality is a first-class dependency for clinical NLP."
        },
        {
          label: "Extract",
          inputTitle: "Clinical text",
          inputLines: ["Sentences", "Medical phrases", "Uncertainty and negation"],
          operationTitle: "Run semantic extraction",
          operationLines: ["Process text", "Extract semantic objects", "Attach roles, codes, and certainty"],
          outputTitle: "Semantic object list",
          outputLines: ["Concept text", "Codes", "Roles and certainty"],
          pmNote: "The wrapper makes extraction inspectable instead of hiding it behind a Java call."
        },
        {
          label: "Filter",
          inputTitle: "Semantic objects",
          inputLines: ["Roles", "Certainty levels", "Text positions"],
          operationTitle: "Review and refine outputs",
          operationLines: ["Filter by role", "Find negated or uncertain concepts", "Compare text/code overlap"],
          outputTitle: "Reviewable concepts",
          outputLines: ["Accepted objects", "Flagged uncertainty", "Comparison stats"],
          pmNote: "Filtering is what turns raw NLP extraction into a useful review workflow."
        },
        {
          label: "Export",
          inputTitle: "Reviewed objects",
          inputLines: ["Concept rows", "Codes", "Metadata"],
          operationTitle: "Prepare downstream formats",
          operationLines: ["Export detailed dictionaries", "Create simple/code-only views", "Generate CSV-ready data"],
          outputTitle: "Reusable NLP output",
          outputLines: ["CSV", "Detailed JSON-like dict", "Code lists"],
          pmNote: "The output formats are designed for downstream analysis and reproducible review."
        }
      ],
      widget: {
        type: "nlp-extraction-lab",
        title: "Inspect semantic extraction and certainty",
        help: "Choose a clinical text sample. The semantic objects, certainty mix, dictionary coverage, and export preview update together.",
        defaultSample: "vte-note",
        samples: [
          {
            id: "vte-note",
            label: "VTE note",
            text: "History of recurrent VTE; no active bleeding; anticoagulation considered.",
            coverage: 88,
            objects: [
              { text: "recurrent VTE", role: "OBSERVATION", certainty: "YES", score: 92 },
              { text: "active bleeding", role: "OBSERVATION", certainty: "NEGATED", score: 78 },
              { text: "anticoagulation", role: "TREATMENT", certainty: "POSSIBLE", score: 74 }
            ]
          },
          {
            id: "family-history",
            label: "Family history",
            text: "Mother had thrombosis; patient denies chest pain today.",
            coverage: 81,
            objects: [
              { text: "thrombosis", role: "FAMILY_HISTORY", certainty: "YES", score: 85 },
              { text: "chest pain", role: "SYMPTOM", certainty: "NEGATED", score: 82 }
            ]
          },
          {
            id: "uncertain",
            label: "Uncertain finding",
            text: "Possible pulmonary embolism; imaging pending and symptoms unclear.",
            coverage: 76,
            objects: [
              { text: "pulmonary embolism", role: "DIAGNOSIS", certainty: "UNCLEAR", score: 79 },
              { text: "imaging", role: "PROCEDURE", certainty: "PENDING", score: 71 },
              { text: "symptoms", role: "OBSERVATION", certainty: "UNCLEAR", score: 68 }
            ]
          }
        ]
      }
    };

    return [
      nd2AgentProject(),
      deepImaging,
      matching,
      knownet,
      vte,
      causalCompanion,
      inkpulse,
      pynile
    ];
  }

  function nd2AgentProject() {
    return {
      id: "nd2-agent",
      navTitle: "ND2 Imaging Analysis Agent",
      navMeta: "FastAPI + React | 0-4095 sliders | stats + exports",
      title: "ND2-Analysis-Pipeline and Imaging Analysis Agent",
      source: "GitHub: clruan/nd2-analysis-pipeline",
      summary:
        "This is the agent project: an open-source, cross-platform system for multi-channel ND2 microscopy analysis with real-time threshold exploration, cached previews, statistical testing, and transparent reporting.",
      algorithmSummary:
        "The smart part is precomputing threshold curves and metadata once, then letting scientists interactively inspect all groups, replicates, channels, and statistical tests without rerunning the heavy image pipeline.",
      owned: [
        "Built an agent-based FastAPI + React workflow for interactive threshold analysis across ND2 microscopy files.",
        "Standardized scanning, 3D tiling, coordinate mapping, metadata extraction, and sample-aware replicate organization.",
        "Exposed 0-4095 channel sliders, synchronized overlays, real-time boxplots, statistical tests, and Excel/PNG/JSON-style outputs.",
        "Documented installation, user guide, upgrade path, traditional CLI mode, and interactive web mode for collaborators."
      ],
      metrics: [
        { label: "Threshold range", value: "0-4095" },
        { label: "Channels", value: "3 + ratios" },
        { label: "Modes", value: "CLI + web" }
      ],
      endorsement: {
        text: "This is the correct agent project: it makes threshold selection and statistical reporting inspectable for scientists instead of hard-coding a single cutoff.",
        by: "GitHub and CV source",
        role: "ND2 analysis agent"
      },
      relatedTech: ["python", "fastapi", "react", "typescript", "plotly", "r", "git"],
      accent: "#0f766e",
      artifactLinks: [
        { label: "Open GitHub repo", href: "https://github.com/clruan/nd2-analysis-pipeline", note: "Public repository" }
      ],
      stages: [
        {
          label: "Scan",
          inputTitle: "Study directory",
          inputLines: ["ND2 files", "Study config", "Marker and treatment labels"],
          operationTitle: "Parse image and metadata",
          operationLines: ["Read ND2 metadata", "Map channels and coordinates", "Organize mice, groups, and replicates"],
          outputTitle: "Study index",
          outputLines: ["File manifest", "Channel map", "Replicate-aware metadata"],
          pmNote: "The agent needs reliable study structure before any threshold slider can be trusted."
        },
        {
          label: "Precompute",
          inputTitle: "Indexed microscopy data",
          inputLines: ["RGB channels", "Green/Blue ratio", "Red/Blue ratio"],
          operationTitle: "Generate threshold curves",
          operationLines: ["Sweep 0-4095 thresholds", "Cache preview statistics", "Prepare boxplot-ready values"],
          outputTitle: "Instant response cache",
          outputLines: ["Threshold curves", "Group summaries", "Preview overlays"],
          pmNote: "Precomputation turns a slow image-analysis loop into real-time exploration."
        },
        {
          label: "Inspect",
          inputTitle: "Cached threshold curves",
          inputLines: ["Channel sliders", "Treatment groups", "Replicate hover data"],
          operationTitle: "Interactive review agent",
          operationLines: ["Move sliders", "Compare groups", "Inspect sample-level effects"],
          outputTitle: "Threshold decision",
          outputLines: ["Stable threshold", "Visible uncertainty", "Reviewer-ready rationale"],
          pmNote: "The reviewer sees why a threshold works across groups instead of accepting a static cutoff."
        },
        {
          label: "Report",
          inputTitle: "Accepted threshold settings",
          inputLines: ["Configuration metadata", "Statistical tests", "Figures and tables"],
          operationTitle: "Export transparent results",
          operationLines: ["Run parametric/nonparametric tests", "Export Excel/PNG/JSON views", "Record settings"],
          outputTitle: "Reproducible package",
          outputLines: ["Figures", "Statistics", "Config trace"],
          pmNote: "The reporting layer is the agent's product value: reproducible output plus visible choices."
        }
      ],
      widget: {
        type: "nd2-agent-lab",
        title: "Operate the ND2 threshold agent",
        help: "Switch channels and move the threshold. The preview, replicate distribution, statistical signal, and export status update together.",
        defaultChannel: "green",
        defaultThreshold: 1840,
        min: 0,
        max: 4095,
        channels: [
          {
            id: "green",
            label: "Green channel",
            color: "#16a34a",
            signal: 83,
            groups: [
              { label: "Control", value: 34 },
              { label: "Treatment A", value: 58 },
              { label: "Treatment B", value: 72 },
              { label: "Treatment C", value: 66 }
            ],
            note: "Strong biological signal with visible group separation."
          },
          {
            id: "red",
            label: "Red channel",
            color: "#dc2626",
            signal: 68,
            groups: [
              { label: "Control", value: 28 },
              { label: "Treatment A", value: 44 },
              { label: "Treatment B", value: 51 },
              { label: "Treatment C", value: 49 }
            ],
            note: "Moderate signal; useful after checking replicate consistency."
          },
          {
            id: "ratio",
            label: "Green/Blue ratio",
            color: "#2563eb",
            signal: 76,
            groups: [
              { label: "Control", value: 31 },
              { label: "Treatment A", value: 54 },
              { label: "Treatment B", value: 65 },
              { label: "Treatment C", value: 59 }
            ],
            note: "Ratio view stabilizes intensity differences across images."
          }
        ]
      }
    };
  }

  function baseProject(base, id) {
    var project = (base.projects || []).find(function (item) { return item.id === id; });
    return project || {};
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value || {}));
  }

  function registerFrankMetadata() {
    var frank = registry["frank-yin"];
    if (!frank) return;

    frank.order = 2;
    frank.targetRole = frank.targetRole || "Biostatistics methods and clinical analytics profile";
    frank.ui = Object.assign({
      metaTitle: "Frank Yin | AI Resume User V7",
      metaDescription: "Local AI Resume V7 profile for Frank Yin with Q-learning, simulation, and clinical clustering demos."
    }, frank.ui || {});
  }

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
    return path.replace("../User_data/Aaron Li/", "User_data/Aaron Li/");
  }
})();
