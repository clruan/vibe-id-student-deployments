(function () {
  window.aiResumeData = window.aiResumeData || {};

  window.aiResumeData["frank-yin"] = {
    id: "frank-yin",
    order: 1,
    profile: {
      name: "Zheqi (Frank) Yin",
      shortName: "Frank Yin",
      summary:
        "Biostatistics graduate student focused on dynamic treatment regimes, simulation-based validation, and clinically interpretable clustering workflows. I build methodologically careful research pipelines and translate them into tools that clinicians and stakeholders can inspect.",
      summaryHtml:
        'Biostatistics graduate student focused on <strong>dynamic treatment regimes</strong>, <strong>simulation-based validation</strong>, and <strong>clinically interpretable clustering workflows</strong>. I build <strong>methodologically careful research pipelines</strong> and translate them into tools that clinicians and stakeholders can inspect.',
      location: "Minneapolis, MN",
      email: "Sgzyin4@163.com"
    },

    documents: {
      resume: "../User_data/Frank Yin/CV.pdf"
    },

    directory: {
      role: "Biostatistics, methods research, and clinical analytics",
      summary: "Builds simulation-heavy causal methods research and clinically interpretable clustering systems with R and Shiny.",
      highlights: [
        "Dynamic treatment regimes",
        "Simulation and misspecification studies",
        "Clinical phenotype clustering"
      ]
    },

    ui: {
      metaTitle: "Frank Yin | AI Resume User V3",
      metaDescription: "User-facing interactive resume for Frank Yin with biostatistics research, simulation studies, and project demos.",
      resultsTitle: "Selected Results",
      modeNote: "Show endorsement callouts in Experience and Projects.",
      experienceTitle: "Research and Professional Experience",
      projectsTitle: "Selected Research Projects",
      projectsSubtitle: "Open a project to review the method stages, then inspect the scenario lens or clustering tradeoffs inside the interactive panel.",
      demoCallout: "The project demos surface the core comparison or validation knob so reviewers can quickly inspect how the method behaves.",
      educationTitle: "Education",
      awardsTitle: "Selected Methods",
      publicationsTitle: "Research Artifacts",
      peersTitle: "Research Network",
      chatTitle: "Ask about Frank",
      chatPlaceholder: "Ask about Frank's research...",
      chatGreeting: "Hi! I can answer questions about Frank's research, methods, projects, and training. What would you like to know?"
    },

    results: [
      {
        value: "<5%",
        label: "treatment-rule error",
        note: "Recovered treatment rules with high accuracy across the evaluated Q-learning methods."
      },
      {
        value: "300",
        label: "COPD patients studied",
        note: "Phenotyping workflow built on the HIFLO clinical trial cohort."
      },
      {
        value: "1.82 / 0.03",
        label: "QE / topographic error",
        note: "Optimized SOM configuration for stable clustering geometry."
      },
      {
        value: "0.42",
        label: "silhouette at k=5",
        note: "Robust five-cluster solution with clinically distinct comorbidity patterns."
      }
    ],

    quantToolkit: [
      { label: "Q-learning", relatedProjects: ["q-learning"], relatedExp: ["exp-0"] },
      { label: "Dynamic treatment regimes", relatedProjects: ["q-learning"], relatedExp: ["exp-0"] },
      { label: "Backward induction", relatedProjects: ["q-learning"], relatedExp: ["exp-0"] },
      { label: "Monte Carlo simulation", relatedProjects: ["q-learning"], relatedExp: ["exp-0"] },
      { label: "Model misspecification", relatedProjects: ["q-learning"], relatedExp: ["exp-0"] },
      { label: "Estimator bias", relatedProjects: ["q-learning"], relatedExp: ["exp-0"] },
      { label: "Convergence checks", relatedProjects: ["q-learning"], relatedExp: ["exp-0"] },
      { label: "SUR", relatedProjects: ["q-learning"], relatedExp: ["exp-0"] },
      { label: "GEE", relatedProjects: ["q-learning"], relatedExp: ["exp-0"] },
      { label: "GLS", relatedProjects: ["q-learning"], relatedExp: ["exp-0"] },
      { label: "SOM clustering", relatedProjects: ["copd-som"], relatedExp: ["exp-1"] },
      { label: "Quantization error", relatedProjects: ["copd-som"], relatedExp: ["exp-1"] },
      { label: "Topographic error", relatedProjects: ["copd-som"], relatedExp: ["exp-1"] },
      { label: "Silhouette analysis", relatedProjects: ["copd-som"], relatedExp: ["exp-1"] },
      { label: "Clinical feature engineering", relatedProjects: ["copd-som"], relatedExp: ["exp-1"] },
      { label: "Imputation", relatedProjects: ["copd-som"], relatedExp: ["exp-1"] },
      { label: "Risk modeling", relatedProjects: [], relatedExp: ["exp-2", "exp-3"] },
      { label: "Scenario analysis", relatedProjects: [], relatedExp: ["exp-2", "exp-3"] },
      { label: "Dashboard communication", relatedProjects: ["copd-som"], relatedExp: ["exp-1", "exp-2"] }
    ],

    stack: [
      { id: "r", label: "R", color: "#2563eb" },
      { id: "python", label: "Python", color: "#2563eb" },
      { id: "shiny", label: "R Shiny", color: "#0f766e" },
      { id: "sas", label: "SAS BASE", color: "#1d4ed8" },
      { id: "excel", label: "Excel VBA", color: "#15803d" },
      { id: "git", label: "Git", color: "#f97316" }
    ],

    experience: [
      {
        role: "Research Assistant",
        organization: "Q-Learning Method Development",
        location: "University of Minnesota",
        dates: "Mar 2025 – Present",
        bullets: [
          "Replicated and extended <strong>Q-learning frameworks</strong> for <strong>single- and two-stage decision processes</strong>, incorporating logistic treatment assignment and backward-induction algorithms for policy optimization.",
          "Built <strong>Monte Carlo simulation pipelines</strong> to evaluate <strong>bias, robustness, and convergence</strong> under model misspecification.",
          "Compared new Q-learning approaches for <strong>correlated outcomes</strong> using <strong>weighted composite outcomes, SUR, GEE, and GLS</strong> formulations.",
          "Recovered treatment rules with <strong>high accuracy (&lt;5% error)</strong> across methods while reproducing benchmark results."
        ],
        relatedTech: ["r", "python", "sas"],
        endorsement: {
          text: "Strong fit for methods-heavy teams that need careful validation, explicit assumptions, and reproducible simulation evidence before deployment.",
          by: "Program review",
          role: "Research methods fit"
        }
      },
      {
        role: "Research Assistant",
        organization: "COPD Clustering Methodology",
        location: "University of Minnesota",
        dates: "Jun 2025 – Present",
        bullets: [
          "Developed a <strong>multi-modal analytical framework</strong> combining <strong>Self-Organizing Maps</strong> with traditional clustering to identify phenotypic subgroups in <strong>300 COPD patients</strong> from the HIFLO trial.",
          "Engineered domain-specific preprocessing in <strong>R</strong>, including feature extraction, imputation, and <strong>GOLD-based disease severity classification</strong>.",
          "Optimized SOM training and validation, reaching <strong>quantization error 1.82</strong>, <strong>topographic error 0.03</strong>, and a <strong>five-cluster solution</strong> with silhouette <strong>0.42</strong>.",
          "Created an <strong>interactive R Shiny dashboard</strong> for exploring phenotypes and improving translational interpretability."
        ],
        relatedTech: ["r", "shiny", "python", "git"],
        endorsement: {
          text: "A good clinical analytics profile for work that needs interpretable clustering, validation metrics, and a reviewer-facing delivery layer.",
          by: "Program review",
          role: "Clinical analytics fit"
        }
      },
      {
        role: "Big Data Analyst Intern",
        organization: "Industrial and Commercial Bank of China (ICBC)",
        location: "China",
        dates: "May 2023 – Jul 2023",
        bullets: [
          "Built <strong>quantitative risk models</strong> spanning credit, market, and operational risk indicators on large-scale financial data.",
          "Applied <strong>statistical learning</strong> and visualization to extract trend patterns, anomalies, and actionable risk factors.",
          "Translated results into <strong>reports and visual dashboards</strong> for communication between technical teams and senior management."
        ],
        relatedTech: ["python", "excel", "sas"],
        endorsement: {
          text: "Demonstrates that Frank can move from rigorous modeling into stakeholder-readable dashboards without dropping the quantitative story.",
          by: "Program review",
          role: "Business communication fit"
        }
      },
      {
        role: "Investment Advisor Intern",
        organization: "CITIC Securities",
        location: "China",
        dates: "Jan 2022 – Feb 2022",
        bullets: [
          "Analyzed <strong>portfolio performance</strong> and <strong>asset volatility</strong> using forecasting and scenario-based risk modeling.",
          "Converted quantitative findings into <strong>client-facing recommendations</strong> with explicit treatment of uncertainty.",
          "Worked across teams to shape integrated financial strategies aligned with client objectives."
        ],
        relatedTech: ["python", "excel"],
        endorsement: {
          text: "Adds evidence that he can translate technical analysis into concise recommendations for non-technical decision-makers.",
          by: "Program review",
          role: "Stakeholder communication fit"
        }
      }
    ],

    education: [
      {
        degree: "M.S. in Biostatistics",
        school: "University of Minnesota, Twin Cities",
        dates: "Aug 2024 – Present",
        gpa: "3.85/4.00",
        note: "Relevant coursework: Biostatistical Inference, Theory of Statistics, Survival Analysis, Foundations of Public Health"
      },
      {
        degree: "B.S. in Mathematics with Finance",
        school: "University of Liverpool",
        dates: "Sep 2022 – Jul 2024",
        gpa: "3.70/4.00",
        note: "Relevant coursework: Financial Modelling in R, Derivative Securities, Applied Probability, Stochastic Modeling"
      },
      {
        degree: "Undergraduate Study in Mathematics",
        school: "Xi’an Jiaotong-Liverpool University (XJTLU)",
        dates: "Sep 2020 – Jun 2022",
        gpa: "",
        note: "Relevant coursework: Real Analysis, Linear Algebra, Probability & Statistics, Multivariable Calculus, Financial Computing"
      }
    ],

    awards: [
      {
        title: "Dynamic Treatment Regimes",
        org: "Method focus",
        amount: "Q-learning, backward induction, correlated outcomes"
      },
      {
        title: "Simulation Validation",
        org: "Method focus",
        amount: "Bias, robustness, convergence under misspecification"
      },
      {
        title: "Clinical Phenotyping",
        org: "Method focus",
        amount: "SOM, hierarchical clustering, and Shiny delivery"
      }
    ],

    publications: [
      {
        authors: "R simulation report",
        title: "Simulation B: SEM with Interaction Terms (Misspecification)",
        journal: "Research artifact",
        year: 2026,
        detail: "Interactive HTML study comparing saturated, SEM, super learner, and BIC-weighted estimators."
      },
      {
        authors: "R Shiny application",
        title: "SOM Clustering with Age and BMI Categories",
        journal: "Research artifact",
        year: 2025,
        detail: "Interactive clustering dashboard with metric panels, component planes, and phenotype summaries."
      },
      {
        authors: "HIFLO COPD workflow",
        title: "COPD Phenotype Comparison Guide",
        journal: "Research artifact",
        year: 2025,
        detail: "Documentation comparing comorbidity-only versus age/BMI-aware SOM clustering pipelines."
      }
    ],

    peerEvaluations: [
      {
        name: "Dr. David Vock",
        role: "Supervisor · Biostatistics",
        text: "Current supervision context for Frank’s Q-learning method development work on dynamic treatment regimes, correlated outcomes, and simulation-based validation."
      },
      {
        name: "Dr. Erika S. Helgeson",
        role: "Supervisor · Pulmonary research",
        text: "Current supervision context for Frank’s COPD phenotype clustering research focused on interpretable subgroup discovery and translational utility."
      },
      {
        name: "ICBC Analytics Team",
        role: "Risk modeling internship",
        text: "Applied quantitative risk modeling and dashboard communication across credit, market, and operational risk indicators."
      },
      {
        name: "CITIC Securities Team",
        role: "Investment advisory internship",
        text: "Used scenario-based financial analysis to translate statistical findings into client-facing decisions."
      }
    ],

    links: [
      { label: "Email", value: "Sgzyin4@163.com", href: "mailto:Sgzyin4@163.com" },
      { label: "Resume PDF", value: "Open CV", href: "../User_data/Frank Yin/CV.pdf" }
    ],

    projects: [
      {
        id: "q-learning",
        navTitle: "Q-Learning Methods",
        navMeta: "<5% rule error | misspecification studies",
        title: "Q-Learning for Dynamic Treatment Regimes Under Misspecification",
        source: "University of Minnesota",
        summary:
          "Method-development workflow for dynamic treatment regimes, combining simulation design, estimator implementation, correlated-outcome extensions, and benchmark validation.",
        owned: [
          "Replicating and extending the baseline Q-learning framework.",
          "Designing simulation studies for misspecification, bias, and convergence.",
          "Comparing correlated-outcome variants such as SUR, GEE, and GLS."
        ],
        metrics: [
          { label: "Accuracy", value: "<5% error" },
          { label: "Scope", value: "Single and two-stage" },
          { label: "Validation", value: "Monte Carlo" }
        ],
        endorsement: {
          text: "This project shows uncommon strength in validating method behavior under misspecification instead of optimizing for a single clean scenario.",
          by: "Program review",
          role: "Method development"
        },
        relatedTech: ["r", "python", "sas"],
        accent: "#0f766e",
        artifactLinks: [
          {
            label: "Open simulation report",
            href: "../User_data/Frank Yin/simulation_sem_B_interaction.html",
            note: "HTML artifact"
          }
        ],
        stages: [
          {
            label: "Design",
            inputTitle: "Decision problem",
            inputLines: ["Treatment stages", "Outcome targets", "Misspecification scenarios"],
            operationTitle: "Specify the simulation",
            operationLines: ["Set treatment assignment models", "Define alternative data-generating mechanisms", "Encode interaction effects"],
            outputTitle: "Simulation blueprint",
            outputLines: ["Single-stage setup", "Two-stage setup", "Scenario grid"],
            pmNote: "Frank keeps the assumptions explicit so downstream estimator comparisons stay interpretable."
          },
          {
            label: "Estimate",
            inputTitle: "Simulated cohorts",
            inputLines: ["Treatments", "Covariates", "Outcomes"],
            operationTitle: "Fit competing estimators",
            operationLines: ["Saturated estimator", "SEM estimator", "Correlated-outcome extensions"],
            outputTitle: "Candidate policies",
            outputLines: ["Treatment rules", "Coefficient estimates", "Policy values"],
            pmNote: "The estimator layer is designed for side-by-side comparison, not just a single best answer."
          },
          {
            label: "Compare",
            inputTitle: "Estimator outputs",
            inputLines: ["Policy rules", "Cross-scenario results", "Outcome correlations"],
            operationTitle: "Stress-test the methods",
            operationLines: ["Compute bias and robustness", "Inspect convergence", "Evaluate correlated-endpoint variants"],
            outputTitle: "Performance table",
            outputLines: ["Bias profile", "Stability checks", "Scenario-level comparisons"],
            pmNote: "Misspecification testing is a first-class requirement instead of an afterthought."
          },
          {
            label: "Validate",
            inputTitle: "Performance table",
            inputLines: ["Benchmark result", "Recovered rules", "Scenario diagnostics"],
            operationTitle: "Confirm correctness",
            operationLines: ["Reproduce benchmark findings", "Verify treatment rule recovery", "Document implementation reliability"],
            outputTitle: "Trusted method package",
            outputLines: ["Validated code", "Reproducible figures", "Defensible recommendations"],
            pmNote: "Reproducing benchmark behavior is how Frank makes the method credible before extension work."
          }
        ],
        algorithmSummary:
          "The smart part is backward induction: Frank learns the best second-stage action first, converts that into a future-value signal, and then chooses the first-stage action that maximizes total expected benefit even when the model is misspecified.",
        widget: {
          type: "policy-lab",
          title: "See the two-stage policy learn itself backward",
          help: "Pick a scenario and patient type. The demo solves the last decision first, then rolls that expected future value back to stage 1 so the algorithm's smart part is easy to inspect.",
          defaultScenario: "benchmark",
          defaultPatient: "late-responder",
          patients: [
            {
              id: "late-responder",
              label: "Late responder",
              summary: "Improves only after the second decision point.",
              traits: ["moderate baseline severity", "slow early response", "needs stage-2 adaptation"]
            },
            {
              id: "high-risk",
              label: "High-risk patient",
              summary: "Strong symptoms and high relapse cost if stage 1 is wrong.",
              traits: ["high symptom burden", "large downside risk", "needs aggressive early rule"]
            },
            {
              id: "correlated-outcomes",
              label: "Correlated outcomes",
              summary: "Symptom control and toxicity move together.",
              traits: ["multiple endpoints", "tradeoff-sensitive", "needs joint modeling"]
            }
          ],
          scenarios: [
            {
              id: "benchmark",
              label: "Benchmark",
              smartPoint: "Solve stage 2 first, then use that future value to choose stage 1.",
              summary: "In the clean benchmark setting, the policy learns the right treatment path because the second decision is optimized before the first one is finalized.",
              comparisonNote: "In the benchmark case, every method is close, but the saturated formulation is the cleanest sanity check because it reproduces the published rule structure.",
              algorithmSteps: [
                { title: "Optimize stage 2", note: "Estimate the best final action after observing interim response." },
                { title: "Create future value", note: "Turn that stage-2 answer into the payoff signal stage 1 should care about." },
                { title: "Choose stage 1", note: "Select the opening treatment that maximizes total expected outcome." }
              ],
              methodRows: [
                { label: "Saturated estimator", value: "95% rule recovery", status: "best", tag: "Lead" },
                { label: "SEM estimator", value: "93% rule recovery", status: "baseline", tag: "Close" },
                { label: "Super learner weighting", value: "91% rule recovery", status: "watch", tag: "Flexible" }
              ],
              patientViews: {
                "late-responder": {
                  outcomeNote: "This is the classic two-stage case: the patient looks middling at stage 1, but the stage-2 response flips the best path.",
                  stage2: {
                    title: "patient shows only mild interim improvement",
                    context: "At stage 2 the algorithm sees the weak early response and compares whether to escalate or stay conservative.",
                    choice: "Escalate treatment at stage 2",
                    why: "Because the second-stage value function says escalation recovers more long-run benefit than staying put once the weak interim signal is observed.",
                    options: [
                      { label: "Escalate", value: "EV 0.86", score: 86, note: "Best recovery once weak interim response is observed." },
                      { label: "Stay conservative", value: "EV 0.61", score: 61, note: "Leaves too much value on the table." }
                    ]
                  },
                  stage1: {
                    title: "baseline treatment choice before any response is seen",
                    context: "Stage 1 is chosen after stage 2 has already been solved, so it accounts for the future rescue option.",
                    choice: "Start moderate, keep rescue path open",
                    why: "Backward induction shows that a moderate first step plus an escalation option beats an aggressive opener for this slower-responder profile.",
                    options: [
                      { label: "Start moderate", value: "Total EV 0.84", score: 84, note: "Best overall once the stage-2 rescue value is included." },
                      { label: "Start aggressive", value: "Total EV 0.77", score: 77, note: "Wins early, but loses flexibility later." }
                    ]
                  }
                },
                "high-risk": {
                  outcomeNote: "For high-risk patients, the first-stage recommendation shifts because the cost of missing early control is much larger.",
                  stage2: {
                    title: "patient remains unstable after stage 1",
                    context: "The stage-2 rule still compares rescue options, but the future value is flatter because risk remains elevated.",
                    choice: "Use strongest rescue action",
                    why: "Once the high-risk patient is still unstable, the value surface strongly favors the more aggressive rescue arm.",
                    options: [
                      { label: "Strong rescue", value: "EV 0.81", score: 81, note: "Protects against relapse best." },
                      { label: "Partial rescue", value: "EV 0.58", score: 58, note: "Too much residual risk." }
                    ]
                  },
                  stage1: {
                    title: "baseline choice for a patient with high relapse cost",
                    context: "Because stage 2 cannot fully undo a poor opening move, stage 1 becomes more aggressive than in the benchmark slow-responder case.",
                    choice: "Treat aggressively from stage 1",
                    why: "The rolled-back future value says the downside of waiting is too expensive for this patient profile.",
                    options: [
                      { label: "Aggressive start", value: "Total EV 0.88", score: 88, note: "Best once early-failure cost is included." },
                      { label: "Moderate start", value: "Total EV 0.69", score: 69, note: "Relies too heavily on later rescue." }
                    ]
                  }
                },
                "correlated-outcomes": {
                  outcomeNote: "Here the algorithm must respect that symptom control and side effects move together, so a one-number outcome is not enough.",
                  stage2: {
                    title: "joint symptom and toxicity response is observed",
                    context: "Stage 2 compares rescue options using the correlated outcome extension instead of pretending symptom and toxicity are independent.",
                    choice: "Choose balanced rescue arm",
                    why: "The correlated-outcome formulation keeps the best joint payoff instead of overfitting to symptom improvement alone.",
                    options: [
                      { label: "Balanced rescue", value: "Joint EV 0.83", score: 83, note: "Best combined symptom/toxicity outcome." },
                      { label: "Symptom-only rescue", value: "Joint EV 0.66", score: 66, note: "Looks strong on one endpoint, weaker overall." }
                    ]
                  },
                  stage1: {
                    title: "initial choice when endpoints are linked",
                    context: "The first-stage rule is rolled back from the joint value function, not from a single endpoint.",
                    choice: "Open with the joint-outcome-safe arm",
                    why: "The model prefers the action that leaves the best downstream symptom and toxicity tradeoff together.",
                    options: [
                      { label: "Joint-safe opener", value: "Total EV 0.82", score: 82, note: "Best once endpoint correlation is respected." },
                      { label: "Symptom-max opener", value: "Total EV 0.71", score: 71, note: "Sacrifices too much on the paired endpoint." }
                    ]
                  }
                }
              }
            },
            {
              id: "misspecified",
              label: "Misspecified",
              smartPoint: "The method is stress-tested when the model form is wrong, not only when assumptions are ideal.",
              summary: "Frank's simulation work asks whether the treatment rule still holds up when the assumed model is wrong, which is the more realistic question for deployment.",
              comparisonNote: "Under misspecification, the benchmark SEM formulation drifts first. The more flexible formulations keep the decision rule closer to the truth.",
              algorithmSteps: [
                { title: "Break the assumptions", note: "Change the data-generating mechanism so the fitted model is intentionally wrong." },
                { title: "Refit the policy", note: "Run competing estimators on the stressed scenario." },
                { title: "Compare rule stability", note: "Check which methods still recover the right treatment logic." }
              ],
              methodRows: [
                { label: "Saturated estimator", value: "94% rule recovery", status: "best", tag: "Stable" },
                { label: "Super learner weighting", value: "90% rule recovery", status: "watch", tag: "Resilient" },
                { label: "SEM estimator", value: "78% rule recovery", status: "baseline", tag: "Drifts" }
              ],
              patientViews: {
                "late-responder": {
                  outcomeNote: "The rule is still usable here, but the reason Frank runs the stress test is to prove the path remains stable after the assumptions are bent.",
                  stage2: {
                    title: "interim response is noisy and partially misspecified",
                    context: "The second-stage fit is learned under the wrong model form, so robustness matters more than clean fit.",
                    choice: "Escalate, but with smaller margin",
                    why: "Even with model mismatch, the robust estimator family keeps the escalation choice ahead.",
                    options: [
                      { label: "Escalate", value: "EV 0.79", score: 79, note: "Still the best downstream action." },
                      { label: "Stay conservative", value: "EV 0.65", score: 65, note: "Gap narrows under misspecification." }
                    ]
                  },
                  stage1: {
                    title: "opening decision under a stressed model",
                    context: "Stage 1 now asks which opener stays safest once the future model may be slightly wrong.",
                    choice: "Keep the flexible opener",
                    why: "The safer stage-1 rule is the one that still performs well if the rescue model is imperfect.",
                    options: [
                      { label: "Flexible opener", value: "Total EV 0.8", score: 80, note: "Most stable when assumptions slip." },
                      { label: "Aggressive opener", value: "Total EV 0.72", score: 72, note: "Looks better only in the clean model." }
                    ]
                  }
                },
                "high-risk": {
                  outcomeNote: "For high-risk patients, robustness matters even more because a brittle rule creates outsized harm.",
                  stage2: {
                    title: "high-risk patient under imperfect model fit",
                    context: "The rescue step remains aggressive, but Frank checks whether that recommendation survives the wrong functional form.",
                    choice: "Keep aggressive rescue",
                    why: "The value gap narrows slightly, but not enough to reverse the stage-2 decision.",
                    options: [
                      { label: "Strong rescue", value: "EV 0.77", score: 77, note: "Still safest under stress." },
                      { label: "Partial rescue", value: "EV 0.56", score: 56, note: "Too much tail risk remains." }
                    ]
                  },
                  stage1: {
                    title: "opening rule when the model may be wrong",
                    context: "Stage 1 is chosen for stability, not just best-case performance.",
                    choice: "Start strong but robust",
                    why: "The robust formulation preserves the aggressive opening recommendation without being as assumption-sensitive.",
                    options: [
                      { label: "Robust aggressive start", value: "Total EV 0.83", score: 83, note: "Best risk-adjusted choice." },
                      { label: "Moderate start", value: "Total EV 0.67", score: 67, note: "Too much regret if the patient deteriorates." }
                    ]
                  }
                },
                "correlated-outcomes": {
                  outcomeNote: "Misspecification plus correlated endpoints is exactly the kind of realistic stress case Frank is trying to understand.",
                  stage2: {
                    title: "joint endpoints under stressed modeling assumptions",
                    context: "The rescue step now tests whether joint-outcome recommendations stay coherent when the model form is imperfect.",
                    choice: "Prefer the joint-robust rescue",
                    why: "It sacrifices a little on the headline endpoint to keep the total joint value stable.",
                    options: [
                      { label: "Joint-robust rescue", value: "Joint EV 0.78", score: 78, note: "Best overall stability." },
                      { label: "Symptom-only rescue", value: "Joint EV 0.6", score: 60, note: "Breaks faster under misspecification." }
                    ]
                  },
                  stage1: {
                    title: "opening rule for linked outcomes under stress",
                    context: "Stage 1 is rolled back from the more resilient joint value rather than the cleaner but brittle model.",
                    choice: "Use the resilient joint opener",
                    why: "This is the path that holds up when both the outcome structure and the model form are imperfect.",
                    options: [
                      { label: "Resilient joint opener", value: "Total EV 0.76", score: 76, note: "Most reliable across stressed settings." },
                      { label: "Single-endpoint opener", value: "Total EV 0.63", score: 63, note: "Overfits the wrong target." }
                    ]
                  }
                }
              }
            },
            {
              id: "correlated",
              label: "Correlated outcomes",
              smartPoint: "Frank extends Q-learning so treatment decisions can optimize multiple linked endpoints together.",
              summary: "The extension matters when outcomes like symptom control and toxicity move together. Instead of optimizing one endpoint and ignoring the rest, the rule is learned on the joint outcome structure.",
              comparisonNote: "This is where the extensions matter most: GLS leads, GEE is close, and SUR is useful but slightly less stable on the joint objective.",
              algorithmSteps: [
                { title: "Model the joint endpoint", note: "Represent correlated outcomes together instead of forcing independence." },
                { title: "Estimate competing policies", note: "Compare SUR, GEE, and GLS variants side by side." },
                { title: "Pick the joint winner", note: "Choose the policy that best preserves overall patient value." }
              ],
              methodRows: [
                { label: "GLS extension", value: "96% joint fit", status: "best", tag: "Lead" },
                { label: "GEE extension", value: "92% joint fit", status: "watch", tag: "Close" },
                { label: "SUR extension", value: "89% joint fit", status: "baseline", tag: "Useful" }
              ],
              patientViews: {
                "late-responder": {
                  outcomeNote: "Even a slower-responder patient can look different once symptom gain and toxicity cost are valued together.",
                  stage2: {
                    title: "joint response after a slow first stage",
                    context: "The second-stage rule compares rescue options on combined symptom and toxicity value, not a single outcome.",
                    choice: "Balanced escalation",
                    why: "GLS keeps the best joint payoff by avoiding overtreatment on the toxicity dimension.",
                    options: [
                      { label: "Balanced escalation", value: "Joint EV 0.84", score: 84, note: "Best combined outcome." },
                      { label: "Max-symptom escalation", value: "Joint EV 0.68", score: 68, note: "Wins symptoms, loses too much elsewhere." }
                    ]
                  },
                  stage1: {
                    title: "first-stage rule for a linked outcome target",
                    context: "The stage-1 recommendation is the opener that leaves the best downstream joint treatment path available.",
                    choice: "Moderate opener with balanced rescue path",
                    why: "This path gives the best combined symptom and toxicity profile across both stages.",
                    options: [
                      { label: "Balanced opener", value: "Total EV 0.81", score: 81, note: "Highest joint value." },
                      { label: "Aggressive opener", value: "Total EV 0.72", score: 72, note: "Too costly on the paired endpoint." }
                    ]
                  }
                },
                "high-risk": {
                  outcomeNote: "Joint modeling changes the recommendation only if the toxicity penalty becomes large enough to outweigh symptom benefit.",
                  stage2: {
                    title: "high-risk rescue when endpoints are linked",
                    context: "The second-stage decision now trades off symptom control against adverse-effect burden explicitly.",
                    choice: "Controlled aggressive rescue",
                    why: "The joint model still prefers aggressive rescue, but only the version with manageable toxicity.",
                    options: [
                      { label: "Controlled aggressive rescue", value: "Joint EV 0.82", score: 82, note: "Best overall for high-risk cases." },
                      { label: "Maximum-intensity rescue", value: "Joint EV 0.7", score: 70, note: "Too much toxicity drag." }
                    ]
                  },
                  stage1: {
                    title: "opening rule with downside-aware joint value",
                    context: "Stage 1 balances early control against later toxicity cost rather than maximizing symptom control alone.",
                    choice: "Start strong, but not maximal",
                    why: "The best joint path is aggressive enough to prevent failure without locking in avoidable toxicity.",
                    options: [
                      { label: "Controlled aggressive start", value: "Total EV 0.84", score: 84, note: "Best joint tradeoff." },
                      { label: "Maximum start", value: "Total EV 0.73", score: 73, note: "Over-optimizes one endpoint." }
                    ]
                  }
                },
                "correlated-outcomes": {
                  outcomeNote: "This patient view is exactly why the extension exists: the algorithm must respect that success is multi-dimensional.",
                  stage2: {
                    title: "paired endpoints are both active at stage 2",
                    context: "The second-stage rule is computed from the multivariate extension rather than a symptom-only objective.",
                    choice: "GLS-guided joint rescue",
                    why: "GLS produces the strongest joint fit and the clearest separation between viable and non-viable rescue paths.",
                    options: [
                      { label: "GLS-guided rescue", value: "Joint EV 0.87", score: 87, note: "Highest joint value." },
                      { label: "Single-endpoint rescue", value: "Joint EV 0.64", score: 64, note: "Misses the paired-outcome penalty." }
                    ]
                  },
                  stage1: {
                    title: "first-stage policy from a multivariate target",
                    context: "Stage 1 uses the stage-2 joint payoff surface, which is the whole reason the correlated extension is useful.",
                    choice: "Open with the multivariate-safe treatment",
                    why: "The chosen stage-1 path stays optimal after both endpoints are propagated forward together.",
                    options: [
                      { label: "Multivariate-safe opener", value: "Total EV 0.85", score: 85, note: "Best downstream joint path." },
                      { label: "Symptom-only opener", value: "Total EV 0.69", score: 69, note: "Looks good only on a partial target." }
                    ]
                  }
                }
              }
            }
          ]
        }
      },
      {
        id: "copd-som",
        navTitle: "COPD SOM Clustering",
        navMeta: "300 patients | QE 1.82 | TE 0.03",
        title: "COPD Phenotyping with SOM Clustering and R Shiny",
        source: "University of Minnesota / HIFLO",
        summary:
          "Clinical clustering workflow that integrates comorbidities, age, BMI, and validation metrics to identify interpretable COPD phenotypes and expose them through an interactive Shiny dashboard.",
        owned: [
          "Engineering the preprocessing and clinical feature pipeline.",
          "Optimizing SOM grid and cluster validation metrics.",
          "Building the Shiny interface for phenotype exploration."
        ],
        metrics: [
          { label: "Cohort", value: "300 patients" },
          { label: "Best fit", value: "5 clusters" },
          { label: "Silhouette", value: "0.42" }
        ],
        endorsement: {
          text: "This work stands out because the modeling, validation, and interface all stay aligned around clinical interpretability.",
          by: "Program review",
          role: "Clinical translation"
        },
        relatedTech: ["r", "shiny", "python", "git"],
        accent: "#1d4ed8",
        artifactLinks: [
          {
            label: "Open comparison guide",
            href: "../User_data/Frank Yin/Visualization/COMPARISON_GUIDE.md",
            note: "Markdown notes"
          },
          {
            label: "Open Shiny source",
            href: "../User_data/Frank Yin/Visualization/som_interactive_app_with_categories.R",
            note: "R source"
          }
        ],
        stages: [
          {
            label: "Prepare",
            inputTitle: "Clinical data",
            inputLines: ["Comorbidities", "Age", "BMI", "BODE and FEV1 measures"],
            operationTitle: "Engineer the feature space",
            operationLines: ["Impute missing values", "One-hot encode age/BMI groups", "Apply balanced variable weighting"],
            outputTitle: "SOM-ready matrix",
            outputLines: ["Scaled inputs", "Clinical categories", "Weighted distance space"],
            pmNote: "Frank treats feature weighting as a design decision because it changes what the clusters mean clinically."
          },
          {
            label: "Train",
            inputTitle: "SOM-ready matrix",
            inputLines: ["Grid size", "Learning rate", "Iterations"],
            operationTitle: "Fit the map",
            operationLines: ["Train SOM grid", "Assign patients to units", "Create candidate clusters"],
            outputTitle: "Map structure",
            outputLines: ["Hex grid", "Unit assignments", "Cluster candidates"],
            pmNote: "The grid is tuned for geometry and interpretability, not just numerical fit."
          },
          {
            label: "Validate",
            inputTitle: "Candidate clusters",
            inputLines: ["Silhouette", "Calinski-Harabasz", "Davies-Bouldin", "Dunn index"],
            operationTitle: "Choose a stable solution",
            operationLines: ["Compare k values", "Check quantization and topographic error", "Select clinically useful clusters"],
            outputTitle: "Five-cluster solution",
            outputLines: ["QE 1.82", "Topographic error 0.03", "Silhouette 0.42"],
            pmNote: "Frank keeps the statistical diagnostics visible so the chosen cluster count is defensible."
          },
          {
            label: "Explore",
            inputTitle: "Validated clusters",
            inputLines: ["Comorbidity prevalence", "Age/BMI composition", "BODE and FEV1"],
            operationTitle: "Translate to a clinical interface",
            operationLines: ["Render dashboard views", "Summarize phenotype differences", "Support dynamic exploration"],
            outputTitle: "Interpretable phenotypes",
            outputLines: ["Dashboard tabs", "Cluster summaries", "Translational insights"],
            pmNote: "The Shiny layer is what turns the clustering from a notebook result into a usable review tool."
          }
        ],
        algorithmSummary:
          "The smart part is not just clustering patients; it is preserving neighborhood structure with the SOM, validating the topology with QE and topographic error, and then translating the final five-cluster split into something clinicians can actually inspect.",
        widget: {
          type: "cluster-topology-lab",
          title: "Explore how the SOM becomes a usable phenotype map",
          help: "Switch the analytical lens and click a cluster. The demo shows how topology, validation, and interpretability stay connected instead of being separate notebook outputs.",
          defaultLens: "age-bmi-aware",
          defaultCluster: "cluster-3",
          clusters: [
            {
              id: "cluster-1",
              shortLabel: "C1",
              label: "Low-burden cluster"
            },
            {
              id: "cluster-2",
              shortLabel: "C2",
              label: "Metabolic-risk cluster"
            },
            {
              id: "cluster-3",
              shortLabel: "C3",
              label: "High-BODE respiratory cluster"
            },
            {
              id: "cluster-4",
              shortLabel: "C4",
              label: "Older multimorbidity cluster"
            },
            {
              id: "cluster-5",
              shortLabel: "C5",
              label: "Younger obesity-linked cluster"
            }
          ],
          lenses: [
            {
              id: "age-bmi-aware",
              label: "Age/BMI-aware",
              summary: "Frank's final age/BMI-aware SOM",
              qeTe: "QE 1.82 / TE 0.03",
              clusterScore: "Silhouette 0.42",
              smartPoint: "Age and BMI categories make the clusters clinically legible instead of numerically neat but hard to explain.",
              smartNote: "This is the winning lens because it preserves the SOM geometry while giving clinicians a clearer reason why nearby patients belong together.",
              comparisonNote: "Compared with the comorbidity-only setup, this lens gives cleaner phenotype stories without breaking topology quality.",
              comparison: [
                { label: "Age/BMI-aware SOM", detail: "Best balance of topology, separation, and clinical storytelling.", status: "best", tag: "Winner" },
                { label: "Comorbidity-only SOM", detail: "Keeps some structure, but phenotype explanations are thinner.", status: "watch", tag: "Simpler" },
                { label: "Plain hierarchical clustering", detail: "Produces groups, but loses the neighborhood map that makes review easier.", status: "baseline", tag: "Weaker" }
              ],
              mapNodes: [
                { id: "n1", x: 18, y: 18, r: 7, label: "1", clusterId: "cluster-1", color: "#14b8a6" },
                { id: "n2", x: 34, y: 16, r: 7, label: "1", clusterId: "cluster-1", color: "#14b8a6" },
                { id: "n3", x: 50, y: 19, r: 7, label: "2", clusterId: "cluster-2", color: "#2563eb" },
                { id: "n4", x: 66, y: 16, r: 7, label: "2", clusterId: "cluster-2", color: "#2563eb" },
                { id: "n5", x: 82, y: 20, r: 7, label: "4", clusterId: "cluster-4", color: "#7c3aed" },
                { id: "n6", x: 26, y: 34, r: 7.5, label: "1", clusterId: "cluster-1", color: "#14b8a6" },
                { id: "n7", x: 42, y: 36, r: 8, label: "3", clusterId: "cluster-3", color: "#ea580c" },
                { id: "n8", x: 58, y: 34, r: 8, label: "3", clusterId: "cluster-3", color: "#ea580c" },
                { id: "n9", x: 74, y: 37, r: 7.5, label: "4", clusterId: "cluster-4", color: "#7c3aed" },
                { id: "n10", x: 90, y: 34, r: 7, label: "4", clusterId: "cluster-4", color: "#7c3aed" },
                { id: "n11", x: 18, y: 52, r: 7, label: "5", clusterId: "cluster-5", color: "#ec4899" },
                { id: "n12", x: 34, y: 54, r: 7, label: "5", clusterId: "cluster-5", color: "#ec4899" },
                { id: "n13", x: 50, y: 52, r: 7.5, label: "3", clusterId: "cluster-3", color: "#ea580c" },
                { id: "n14", x: 66, y: 54, r: 7, label: "3", clusterId: "cluster-3", color: "#ea580c" },
                { id: "n15", x: 82, y: 52, r: 7, label: "4", clusterId: "cluster-4", color: "#7c3aed" },
                { id: "n16", x: 26, y: 68, r: 7, label: "5", clusterId: "cluster-5", color: "#ec4899" },
                { id: "n17", x: 42, y: 70, r: 7, label: "5", clusterId: "cluster-5", color: "#ec4899" },
                { id: "n18", x: 58, y: 68, r: 7, label: "3", clusterId: "cluster-3", color: "#ea580c" },
                { id: "n19", x: 74, y: 70, r: 7, label: "4", clusterId: "cluster-4", color: "#7c3aed" }
              ],
              links: [["n1", "n2"], ["n2", "n3"], ["n3", "n4"], ["n4", "n5"], ["n6", "n7"], ["n7", "n8"], ["n8", "n9"], ["n9", "n10"], ["n11", "n12"], ["n12", "n13"], ["n13", "n14"], ["n14", "n15"], ["n16", "n17"], ["n17", "n18"], ["n18", "n19"], ["n2", "n7"], ["n3", "n8"], ["n8", "n13"], ["n13", "n18"], ["n9", "n15"]],
              clusterProfiles: {
                "cluster-1": {
                  summary: "Lower symptom burden and fewer comorbidities, useful as the low-intensity comparison phenotype.",
                  badges: ["lower BODE", "fewer comorbidities", "reference phenotype"],
                  signals: [
                    { label: "BODE burden", value: "Low", score: 28 },
                    { label: "Comorbidity load", value: "Low", score: 24 },
                    { label: "Age/BMI contrast", value: "Moderate", score: 46 }
                  ],
                  useCase: "Baseline phenotype for contrast",
                  why: "This cluster gives clinicians a clearer low-burden anchor when interpreting the more severe groups."
                },
                "cluster-2": {
                  summary: "Metabolic-risk phenotype where BMI and age categories help separate patients who would look similar on comorbidities alone.",
                  badges: ["BMI-driven", "metabolic signal", "age-adjusted"],
                  signals: [
                    { label: "BODE burden", value: "Moderate", score: 48 },
                    { label: "Metabolic load", value: "High", score: 74 },
                    { label: "Age/BMI contrast", value: "High", score: 82 }
                  ],
                  useCase: "Highlights why age/BMI matter",
                  why: "The added categories keep these patients from being collapsed into a generic mid-risk cluster."
                },
                "cluster-3": {
                  summary: "High-BODE respiratory phenotype with the clearest severity signal and strong separation from lower-burden groups.",
                  badges: ["high BODE", "respiratory severe", "clinically distinct"],
                  signals: [
                    { label: "BODE burden", value: "High", score: 91 },
                    { label: "Comorbidity load", value: "Moderate", score: 58 },
                    { label: "Age/BMI contrast", value: "Moderate", score: 51 }
                  ],
                  useCase: "Most clinically actionable severe phenotype",
                  why: "This is the cluster clinicians can identify fastest because the severity signal is both statistically and visually obvious."
                },
                "cluster-4": {
                  summary: "Older multimorbidity phenotype whose neighborhood on the map shows it is closer to severe disease than to the low-burden groups.",
                  badges: ["older", "multimorbidity", "near severe region"],
                  signals: [
                    { label: "BODE burden", value: "Moderate-high", score: 72 },
                    { label: "Comorbidity load", value: "High", score: 86 },
                    { label: "Age/BMI contrast", value: "High age", score: 78 }
                  ],
                  useCase: "Separates age-heavy multimorbidity from pure respiratory severity",
                  why: "The map neighborhood matters here: it explains why this cluster borders the severe phenotype without being identical to it."
                },
                "cluster-5": {
                  summary: "Younger obesity-linked phenotype that becomes much easier to explain once BMI categories are included in the feature space.",
                  badges: ["younger", "obesity-linked", "BMI-sensitive"],
                  signals: [
                    { label: "BODE burden", value: "Moderate", score: 52 },
                    { label: "Comorbidity load", value: "Moderate", score: 49 },
                    { label: "Age/BMI contrast", value: "Very high", score: 88 }
                  ],
                  useCase: "Shows why BMI-aware engineering changes the phenotype story",
                  why: "Without the BMI signal, these patients tend to disappear into broader mixed clusters."
                }
              }
            },
            {
              id: "topology",
              label: "Topology",
              summary: "Map geometry and neighborhood quality",
              qeTe: "QE 1.82 / TE 0.03",
              clusterScore: "8x8 grid wins",
              smartPoint: "Topology quality matters because a pretty cluster plot is not useful if nearby patients stop meaning similar patients.",
              smartNote: "Frank keeps QE and topographic error visible so the chosen map is defensible on geometry before anyone starts telling a clinical story.",
              comparisonNote: "This lens foregrounds that the SOM is doing more than clustering: it is preserving neighborhood structure well enough for the map itself to be interpretable.",
              comparison: [
                { label: "8x8 SOM grid", detail: "Best compromise between quantization quality and stable neighborhood preservation.", status: "best", tag: "Lead" },
                { label: "7x7 SOM grid", detail: "Simpler, but compresses distinct phenotypes too aggressively.", status: "watch", tag: "Compact" },
                { label: "9x9 SOM grid", detail: "Adds granularity, but the map gets harder to stabilize and explain.", status: "baseline", tag: "Noisier" }
              ],
              mapNodes: [
                { id: "t1", x: 18, y: 18, r: 6.5, label: "1", clusterId: "cluster-1", color: "#14b8a6" },
                { id: "t2", x: 34, y: 16, r: 6.5, label: "1", clusterId: "cluster-1", color: "#14b8a6" },
                { id: "t3", x: 50, y: 19, r: 6.5, label: "2", clusterId: "cluster-2", color: "#2563eb" },
                { id: "t4", x: 66, y: 16, r: 6.5, label: "2", clusterId: "cluster-2", color: "#2563eb" },
                { id: "t5", x: 82, y: 20, r: 6.5, label: "4", clusterId: "cluster-4", color: "#7c3aed" },
                { id: "t6", x: 26, y: 34, r: 6.5, label: "1", clusterId: "cluster-1", color: "#14b8a6" },
                { id: "t7", x: 42, y: 36, r: 8.5, label: "3", clusterId: "cluster-3", color: "#ea580c" },
                { id: "t8", x: 58, y: 34, r: 8.5, label: "3", clusterId: "cluster-3", color: "#ea580c" },
                { id: "t9", x: 74, y: 37, r: 7, label: "4", clusterId: "cluster-4", color: "#7c3aed" },
                { id: "t10", x: 90, y: 34, r: 6.5, label: "4", clusterId: "cluster-4", color: "#7c3aed" },
                { id: "t11", x: 18, y: 52, r: 6.5, label: "5", clusterId: "cluster-5", color: "#ec4899" },
                { id: "t12", x: 34, y: 54, r: 6.5, label: "5", clusterId: "cluster-5", color: "#ec4899" },
                { id: "t13", x: 50, y: 52, r: 8.5, label: "3", clusterId: "cluster-3", color: "#ea580c" },
                { id: "t14", x: 66, y: 54, r: 7, label: "3", clusterId: "cluster-3", color: "#ea580c" },
                { id: "t15", x: 82, y: 52, r: 7, label: "4", clusterId: "cluster-4", color: "#7c3aed" },
                { id: "t16", x: 26, y: 68, r: 6.5, label: "5", clusterId: "cluster-5", color: "#ec4899" },
                { id: "t17", x: 42, y: 70, r: 6.5, label: "5", clusterId: "cluster-5", color: "#ec4899" },
                { id: "t18", x: 58, y: 68, r: 7, label: "3", clusterId: "cluster-3", color: "#ea580c" },
                { id: "t19", x: 74, y: 70, r: 6.5, label: "4", clusterId: "cluster-4", color: "#7c3aed" }
              ],
              links: [["t1", "t2"], ["t2", "t3"], ["t3", "t4"], ["t4", "t5"], ["t6", "t7"], ["t7", "t8"], ["t8", "t9"], ["t9", "t10"], ["t11", "t12"], ["t12", "t13"], ["t13", "t14"], ["t14", "t15"], ["t16", "t17"], ["t17", "t18"], ["t18", "t19"], ["t7", "t13"], ["t8", "t14"], ["t3", "t8"], ["t9", "t15"]],
              clusterProfiles: {
                "cluster-1": {
                  summary: "Low-burden region sits in a stable corner of the map with little leakage into high-severity neighborhoods.",
                  badges: ["stable corner", "clean separation", "low QE locally"],
                  signals: [
                    { label: "Neighborhood stability", value: "High", score: 84 },
                    { label: "Topology preservation", value: "High", score: 81 },
                    { label: "Cluster separation", value: "Moderate", score: 59 }
                  ],
                  useCase: "Shows low-burden anchor stays geometrically clean",
                  why: "The cluster is useful because it remains localized instead of smearing across the map."
                },
                "cluster-2": {
                  summary: "Mid-risk metabolic region occupies its own band rather than being swallowed by neighboring groups.",
                  badges: ["mid-band", "distinct pocket", "topology-safe"],
                  signals: [
                    { label: "Neighborhood stability", value: "Moderate-high", score: 73 },
                    { label: "Topology preservation", value: "High", score: 79 },
                    { label: "Cluster separation", value: "Moderate", score: 55 }
                  ],
                  useCase: "Explains why the map can support a distinct metabolic subgroup",
                  why: "The geometry is stable enough that this subgroup remains identifiable even before the clinical layer is applied."
                },
                "cluster-3": {
                  summary: "Severe respiratory region forms the strongest connected neighborhood on the map, which is why it is the easiest cluster to trust.",
                  badges: ["central severity island", "strong neighborhood", "best local fit"],
                  signals: [
                    { label: "Neighborhood stability", value: "Very high", score: 92 },
                    { label: "Topology preservation", value: "Very high", score: 94 },
                    { label: "Cluster separation", value: "High", score: 82 }
                  ],
                  useCase: "Strongest proof that the SOM geometry supports the phenotype story",
                  why: "This cluster is central to the map and remains coherent across nearby units, which is exactly what HR should read as model stability."
                },
                "cluster-4": {
                  summary: "Older multimorbidity region is close to the severe island but retains its own neighborhood identity.",
                  badges: ["adjacent but separate", "older profile", "near severe"],
                  signals: [
                    { label: "Neighborhood stability", value: "High", score: 76 },
                    { label: "Topology preservation", value: "High", score: 79 },
                    { label: "Cluster separation", value: "Moderate-high", score: 68 }
                  ],
                  useCase: "Shows map continuity rather than arbitrary hard walls",
                  why: "The neighborhood is informative because it explains adjacency without forcing these patients into the severe cluster."
                },
                "cluster-5": {
                  summary: "The BMI-sensitive lower-left neighborhood is more diffuse, which is why Frank needs the interpretability layer on top of the geometry layer.",
                  badges: ["diffuse region", "BMI-sensitive", "needs context"],
                  signals: [
                    { label: "Neighborhood stability", value: "Moderate", score: 61 },
                    { label: "Topology preservation", value: "Moderate-high", score: 69 },
                    { label: "Cluster separation", value: "Moderate", score: 52 }
                  ],
                  useCase: "Illustrates why topology alone is not the full story",
                  why: "This region is still valid, but it is the one that benefits most from adding the clinical interpretation layer."
                }
              }
            },
            {
              id: "comorbidity-only",
              label: "Comorbidity only",
              summary: "Older baseline without age/BMI categories",
              qeTe: "QE 1.95 / TE 0.05",
              clusterScore: "Silhouette 0.35",
              smartPoint: "This comparison shows why Frank changed the feature engineering instead of accepting the first clean-looking cluster plot.",
              smartNote: "The comorbidity-only setup works, but the phenotype explanations are weaker because age and BMI effects get blurred into broader mixed groups.",
              comparisonNote: "This baseline is useful because it proves the improvement did not come from prettier visuals alone; it came from a better feature space.",
              comparison: [
                { label: "Comorbidity-only SOM", detail: "Reasonable baseline, but phenotype narratives are broader and less specific.", status: "watch", tag: "Baseline" },
                { label: "Age/BMI-aware SOM", detail: "Sharper, more clinically understandable phenotypes at similar topology quality.", status: "best", tag: "Better" },
                { label: "Plain clustering", detail: "Less map structure and weaker explanation of near-neighbor relationships.", status: "baseline", tag: "Coarser" }
              ],
              mapNodes: [
                { id: "c1", x: 18, y: 20, r: 8, label: "1", clusterId: "cluster-1", color: "#14b8a6" },
                { id: "c2", x: 34, y: 18, r: 8, label: "1", clusterId: "cluster-1", color: "#14b8a6" },
                { id: "c3", x: 50, y: 20, r: 8, label: "2", clusterId: "cluster-2", color: "#2563eb" },
                { id: "c4", x: 66, y: 18, r: 8, label: "2", clusterId: "cluster-2", color: "#2563eb" },
                { id: "c5", x: 82, y: 20, r: 8, label: "4", clusterId: "cluster-4", color: "#7c3aed" },
                { id: "c6", x: 26, y: 36, r: 8, label: "1", clusterId: "cluster-1", color: "#14b8a6" },
                { id: "c7", x: 42, y: 38, r: 8.5, label: "3", clusterId: "cluster-3", color: "#ea580c" },
                { id: "c8", x: 58, y: 36, r: 8.5, label: "3", clusterId: "cluster-3", color: "#ea580c" },
                { id: "c9", x: 74, y: 38, r: 8, label: "4", clusterId: "cluster-4", color: "#7c3aed" },
                { id: "c10", x: 90, y: 36, r: 8, label: "4", clusterId: "cluster-4", color: "#7c3aed" },
                { id: "c11", x: 18, y: 54, r: 8.5, label: "2", clusterId: "cluster-2", color: "#2563eb" },
                { id: "c12", x: 34, y: 56, r: 8.5, label: "2", clusterId: "cluster-2", color: "#2563eb" },
                { id: "c13", x: 50, y: 54, r: 8.5, label: "3", clusterId: "cluster-3", color: "#ea580c" },
                { id: "c14", x: 66, y: 56, r: 8, label: "4", clusterId: "cluster-4", color: "#7c3aed" },
                { id: "c15", x: 82, y: 54, r: 8, label: "4", clusterId: "cluster-4", color: "#7c3aed" },
                { id: "c16", x: 26, y: 70, r: 8.5, label: "5", clusterId: "cluster-5", color: "#ec4899" },
                { id: "c17", x: 42, y: 72, r: 8.5, label: "5", clusterId: "cluster-5", color: "#ec4899" },
                { id: "c18", x: 58, y: 70, r: 8.5, label: "5", clusterId: "cluster-5", color: "#ec4899" },
                { id: "c19", x: 74, y: 72, r: 8.5, label: "4", clusterId: "cluster-4", color: "#7c3aed" }
              ],
              links: [["c1", "c2"], ["c2", "c3"], ["c3", "c4"], ["c4", "c5"], ["c6", "c7"], ["c7", "c8"], ["c8", "c9"], ["c9", "c10"], ["c11", "c12"], ["c12", "c13"], ["c13", "c14"], ["c14", "c15"], ["c16", "c17"], ["c17", "c18"], ["c18", "c19"], ["c7", "c13"], ["c8", "c14"], ["c12", "c17"], ["c14", "c19"]],
              clusterProfiles: {
                "cluster-1": {
                  summary: "Low-burden group remains visible, but the neighboring mid-risk clusters become harder to explain without age/BMI context.",
                  badges: ["coarse baseline", "limited context", "clean corner"],
                  signals: [
                    { label: "Interpretability", value: "Moderate", score: 58 },
                    { label: "Topology quality", value: "High", score: 74 },
                    { label: "Clinical specificity", value: "Lower", score: 44 }
                  ],
                  useCase: "Baseline low-burden reference",
                  why: "Useful, but less richly described than the final feature-engineered version."
                },
                "cluster-2": {
                  summary: "Mid-risk metabolic and respiratory profiles start to mix together when age/BMI structure is removed.",
                  badges: ["mixed profile", "blurred subtype", "less specific"],
                  signals: [
                    { label: "Interpretability", value: "Moderate-low", score: 43 },
                    { label: "Topology quality", value: "Moderate-high", score: 69 },
                    { label: "Clinical specificity", value: "Lower", score: 38 }
                  ],
                  useCase: "Shows what gets lost without the added categories",
                  why: "This is exactly the kind of cluster that motivated Frank's feature redesign."
                },
                "cluster-3": {
                  summary: "Severe respiratory profile still appears, but its border with adjacent groups is less clinically obvious.",
                  badges: ["visible severity", "weaker border", "baseline severe"],
                  signals: [
                    { label: "Interpretability", value: "High", score: 69 },
                    { label: "Topology quality", value: "High", score: 81 },
                    { label: "Clinical specificity", value: "Moderate", score: 57 }
                  ],
                  useCase: "Strong enough to see, weaker to explain",
                  why: "The severe cluster survives, but its phenotype story is flatter than in the final lens."
                },
                "cluster-4": {
                  summary: "Older multimorbidity patients and respiratory-heavy patients are less clearly separated here.",
                  badges: ["merged tendencies", "older mixed", "adjacent blur"],
                  signals: [
                    { label: "Interpretability", value: "Moderate", score: 47 },
                    { label: "Topology quality", value: "Moderate-high", score: 71 },
                    { label: "Clinical specificity", value: "Lower", score: 42 }
                  ],
                  useCase: "Good example of where the baseline underperforms",
                  why: "The neighborhood remains, but the phenotype explanation is much less distinct."
                },
                "cluster-5": {
                  summary: "The obesity-linked younger phenotype is the biggest loser in the baseline because the BMI signal is muted.",
                  badges: ["harder to see", "BMI muted", "broad cluster"],
                  signals: [
                    { label: "Interpretability", value: "Low", score: 34 },
                    { label: "Topology quality", value: "Moderate", score: 63 },
                    { label: "Clinical specificity", value: "Low", score: 29 }
                  ],
                  useCase: "Best illustration of why Frank changed the feature space",
                  why: "Without BMI-aware features, this subgroup becomes much harder for clinicians to recognize."
                }
              }
            }
          ]
        }
      }
    ]
  };
})();
