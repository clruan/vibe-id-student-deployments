(function () {
  var MAX_FILE_BYTES = 4.2 * 1024 * 1024;
  var MAX_TEXT_CHARS = 18000;
  var state = {
    selectedJdId: "duke_data_scientist",
    resume: null,
    materials: [],
    variants: [],
    suggestions: []
  };

  var BUILT_IN_JDS = [
    {
      id: "duke_data_scientist",
      label: "Duke DS",
      targetRole: "Data Scientist - Product and Platform Analytics",
      text: [
        "Data Scientist - Chrome Product and Platform Analytics",
        "",
        "Minimum qualifications:",
        "- Master's degree in Statistics, Data Science, Mathematics, Physics, Economics, Operations Research, Engineering, or a related quantitative field.",
        "- 3 years of work experience using analytics to solve product or business problems, coding (e.g., Python, R, SQL), querying databases or statistical analysis, or a PhD degree.",
        "",
        "Responsibilities:",
        "- Leverage advanced statistical methods on massive datasets to extract insights from billions of events and thousands of features.",
        "- Analyze product and platform usage patterns and translate data-driven insights into product strategy and engineering decisions.",
        "- Collaborate with stakeholders to identify and clarify business or product questions.",
        "- Translate business questions into tractable analysis, evaluation metrics, or mathematical models.",
        "- Make clear product and engineering recommendations.",
        "",
        "Required keywords and skills:",
        "- Python, R, SQL, machine learning, predictive modeling, model evaluation",
        "- Advanced statistics, experimentation, forecasting, exploratory analysis",
        "- Product analytics, platform usage patterns, massive datasets, feature gating",
        "- Stakeholder communication, engineering recommendations, data-informed product strategy"
      ].join("\n")
    },
    {
      id: "duke_ai_analytics",
      label: "AI Analytics",
      targetRole: "AI Analytics Manager",
      text: [
        "AI Analytics Manager",
        "",
        "What you will do:",
        "- Lead and mentor a high-performing team of data scientists, AI engineers, and data analysts.",
        "- Partner to define and refine AI and analytics strategy aligned with business needs and product vision.",
        "- Use AI methodologies to drive development, implementation, ownership, and health of solutions.",
        "- Communicate to product stakeholders, driving strategic alignment, AI education, and impact-based decisions.",
        "- Ensure scalability, reliability, and robustness through model development, system design, deployment, and monitoring.",
        "",
        "Qualifications:",
        "- 7-10 years progressive data science / AI roles depending on degree.",
        "- Experience with full lifecycle data science product development, business stakeholders, Python, and team portfolios.",
        "- Preferred: Azure, Databricks, PowerBI, DevOps, git, Snowflake, distributed compute, LLM APIs, agent workflows.",
        "",
        "Source-bound caution: do not invent people management, director ownership, Azure, Databricks, Snowflake, or 7-10 years unless present."
      ].join("\n")
    },
    {
      id: "duke_biostat",
      label: "NHLBI BioStat",
      targetRole: "Mathematical Statistician / Biostatistician",
      text: [
        "Mathematical Statistician / Biostatistician - NHLBI",
        "",
        "Responsibilities:",
        "- Collaborate with investigators on design, conduct, interpretation, and analysis of heart, lung, and blood disease projects.",
        "- Prepare data and results for presentation or publication.",
        "- Apply established statistical approaches and develop new analytical techniques.",
        "- Select methods for study design, data collection, summary, and analysis in biological and medical sciences.",
        "- Apply ANOVA, probability, regression, contingency tables, survival analysis, tests of significance, confidence intervals, and sample size methods.",
        "- Turn research objectives into testable statistical hypotheses and evaluate validity and reliability.",
        "",
        "Required keywords and skills:",
        "- R, Python, SAS, regression analysis, ANOVA, contingency tables",
        "- Survival analysis, tests of significance, confidence intervals, sample size",
        "- Clinical data, biomedical data, study design, quality control",
        "- Publication collaboration, investigator consultation, statistical hypotheses"
      ].join("\n")
    },
    {
      id: "kailin_google_apmm",
      label: "Google APMM",
      targetRole: "Associate Product Marketing Manager - Early Career",
      text: [
        "Role: Associate Product Marketing Manager, Early Career",
        "Company: Google",
        "Location: New York, NY",
        "",
        "Responsibilities:",
        "- Assist in defining and executing go-to-market strategies and campaigns for new product or feature launches and measure efficacy against KPIs.",
        "- Develop programs for customer acquisition, business strategies, messaging, collateral, events, engagement, and program measurement.",
        "- Support product and feature improvements, assess product readiness, and communicate developments to users.",
        "- Develop client and executive narratives, presentations, case studies, and content.",
        "",
        "Role lens: product marketing, early-career marketing, AI product interest, user insights, GTM, growth marketing, campaign measurement, product readiness, presentations, cross-functional communication, program management, strategy."
      ].join("\n")
    },
    {
      id: "kailin_tiktok_measurement",
      label: "TikTok PMM",
      targetRole: "Product Marketing Manager - Measurement and Data Solutions",
      text: [
        "Role: Product Marketing Manager, Measurement and Data Solutions",
        "Company: TikTok",
        "",
        "Responsibilities:",
        "- Own measurement and data collaboration solutions in TikTok's Measurement suite.",
        "- Define go-to-market strategy for measurement and data solutions.",
        "- Develop thought leadership around product launches and market developments.",
        "- Enable adoption of measurement and data products, identify blockers, and resolve them cross-functionally.",
        "- Partner with Sales, Marketing Science, Product, Legal, and other teams to understand user pain points and prioritize solutions.",
        "- Translate complex capabilities into clear customer value for advertisers, agencies, and partners.",
        "",
        "Role lens: measurement product marketing, ads analytics, GTM strategy, advertiser outcomes, data products, experimentation, attribution, technical narratives, cross-functional execution."
      ].join("\n")
    },
    {
      id: "kailin_pangle",
      label: "Pangle PSO",
      targetRole: "Product Strategy and Operations - Pangle North America GTM",
      text: [
        "Role: Product Strategy and Operations / Product Marketing, TikTok Pangle North America GTM",
        "Company: TikTok Pangle",
        "",
        "Responsibilities:",
        "- Own and evolve North America go-to-market strategy, positioning, messaging, competitive differentiation, and value propositions.",
        "- Translate complex product capabilities into market-relevant narratives for advertisers and partners.",
        "- Plan end-to-end GTM programs for key launches at global scale.",
        "- Partner with HQ product and vertical solution teams for localization and rollout.",
        "- Create sales decks, case studies, one-pagers, and thought leadership for adoption.",
        "- Define Pangle sales enablement strategy with cross-functional and regional partners.",
        "- Monitor business performance and key GTM metrics.",
        "",
        "Role lens: Pangle, Ad Network, performance marketing, North America GTM, product positioning, sales enablement, global rollout, localization, brand health, adoption, revenue impact."
      ].join("\n")
    },
    {
      id: "aaron_ib",
      label: "IB Analyst",
      targetRole: "Entry-Level Investment Banking Analyst",
      text: [
        "Entry-Level Investment Banking Analyst",
        "",
        "We are seeking an entry-level investment banking analyst to support company research, financial statement analysis, comparable-company benchmarking, valuation, M&A screening, credit review, and client-ready presentation materials.",
        "",
        "Required keywords and skills:",
        "- Financial modeling, valuation, DCF, comparable companies, M&A, credit analysis",
        "- Company research, revenue drivers, financial statements, market catalysts",
        "- Excel, PowerPoint, research memo, client presentation, attention to detail",
        "- Ability to synthesize evidence and explain recommendations with clear support"
      ].join("\n")
    },
    {
      id: "clinical_data",
      label: "Clinical Data",
      targetRole: "Biostatistics / Clinical Data Analyst",
      text: [
        "Biostatistics / Clinical Data Analyst",
        "",
        "We are seeking a biostatistics or clinical data analyst to clean biomedical datasets, build predictive models, evaluate performance, and create interpretable reports for clinical collaborators.",
        "",
        "Required keywords and skills:",
        "- Python, R, SAS, Tableau, biostatistics, predictive modeling",
        "- ROC, PR-AUC, regression, hypothesis testing, ANOVA, clustering",
        "- Clinical data, data cleaning, missing data, imputation, dashboards",
        "- Interpretable reporting, reproducible analysis, collaborator communication"
      ].join("\n")
    },
    {
      id: "custom",
      label: "Custom JD",
      targetRole: "",
      text: ""
    }
  ];

  var els = {};

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    els.form = document.getElementById("generator-form");
    els.resumeInput = document.getElementById("resume-input");
    els.materialsInput = document.getElementById("materials-input");
    els.resumeDrop = document.getElementById("resume-drop");
    els.materialsDrop = document.getElementById("materials-drop");
    els.fileList = document.getElementById("file-list");
    els.resumeState = document.getElementById("resume-state");
    els.materialCount = document.getElementById("material-count");
    els.jdGrid = document.getElementById("jd-grid");
    els.jdText = document.getElementById("jd-text");
    els.targetRole = document.getElementById("target-role");
    els.runCount = document.getElementById("run-count");
    els.resultPanel = document.getElementById("result-panel");
    els.apiStatus = document.getElementById("api-status");
    els.generateButton = document.getElementById("generate-button");
    els.loadDemo = document.getElementById("load-demo");

    renderJdOptions();
    selectJd(state.selectedJdId);
    bindDropZone(els.resumeDrop, handleResumeFiles);
    bindDropZone(els.materialsDrop, handleMaterialFiles);
    els.resumeInput.addEventListener("change", function () { handleResumeFiles(els.resumeInput.files); });
    els.materialsInput.addEventListener("change", function () { handleMaterialFiles(els.materialsInput.files); });
    els.form.addEventListener("submit", onSubmit);
    els.loadDemo.addEventListener("click", loadSamplePacket);
    els.jdText.addEventListener("input", function () {
      if (state.selectedJdId !== "custom" && els.jdText.value !== getSelectedJd().text) {
        markCustomJd();
      }
    });

    if (window.lucide) window.lucide.createIcons();
    setStage(0, "ready");
    dispatchMotionState();
  }

  function renderJdOptions() {
    els.jdGrid.innerHTML = BUILT_IN_JDS.map(function (jd) {
      return '<button class="jd-option" type="button" data-jd-id="' + escapeAttr(jd.id) + '">' + escapeHtml(jd.label) + '</button>';
    }).join("");

    els.jdGrid.querySelectorAll(".jd-option").forEach(function (button) {
      button.addEventListener("click", function () {
        selectJd(button.dataset.jdId);
      });
    });
  }

  function selectJd(id) {
    state.selectedJdId = id;
    var jd = getSelectedJd();
    els.jdText.value = jd.text || "";
    if (!els.targetRole.value && jd.targetRole) els.targetRole.value = jd.targetRole;
    els.jdGrid.querySelectorAll(".jd-option").forEach(function (button) {
      button.classList.toggle("is-active", button.dataset.jdId === id);
    });
  }

  function markCustomJd() {
    state.selectedJdId = "custom";
    els.jdGrid.querySelectorAll(".jd-option").forEach(function (button) {
      button.classList.toggle("is-active", button.dataset.jdId === "custom");
    });
  }

  function getSelectedJd() {
    return BUILT_IN_JDS.filter(function (jd) { return jd.id === state.selectedJdId; })[0] || BUILT_IN_JDS[0];
  }

  function bindDropZone(zone, handler) {
    ["dragenter", "dragover"].forEach(function (eventName) {
      zone.addEventListener(eventName, function (event) {
        event.preventDefault();
        zone.classList.add("is-over");
      });
    });

    ["dragleave", "drop"].forEach(function (eventName) {
      zone.addEventListener(eventName, function (event) {
        event.preventDefault();
        zone.classList.remove("is-over");
      });
    });

    zone.addEventListener("drop", function (event) {
      handler(event.dataTransfer.files);
    });
  }

  async function handleResumeFiles(fileList) {
    var file = fileList && fileList[0];
    if (!file) return;
    setBusyLabel(els.resumeState, "Reading");
    try {
      state.resume = await buildFilePayload(file, "resume");
      els.resumeState.textContent = trimMiddle(file.name, 28);
      animatePaperToSlot();
      dispatchMotionState();
    } catch (error) {
      els.resumeState.textContent = "Read failed";
      renderError(error.message || "Resume could not be read.");
    }
  }

  async function handleMaterialFiles(fileList) {
    var files = Array.prototype.slice.call(fileList || []);
    if (!files.length) return;
    setBusyLabel(els.materialCount, "Reading");
    try {
      var payloads = [];
      for (var i = 0; i < files.length; i += 1) {
        payloads.push(await buildFilePayload(files[i], "material"));
      }
      state.materials = state.materials.concat(payloads).slice(0, 16);
      renderFileList();
      animateMaterialPackets(payloads.length);
      dispatchMotionState();
    } catch (error) {
      renderError(error.message || "Materials could not be read.");
    }
  }

  async function buildFilePayload(file, kind) {
    var extension = getExtension(file.name);
    var text = "";
    var base64 = "";
    var parseMode = "inventory";
    var textLike = /^(txt|md|csv|tsv|json|js|jsx|ts|tsx|py|ipynb|html|css|scss|sql|r)$/i.test(extension);
    var serverParsed = /^(pdf|doc|docx|xls|xlsx|ppt|pptx)$/i.test(extension);
    var imageAsset = /^(png|jpg|jpeg|webp)$/i.test(extension);

    if (textLike) {
      text = (await file.text()).slice(0, MAX_TEXT_CHARS);
      parseMode = "client-text";
    }

    if ((kind === "resume" || serverParsed || imageAsset) && file.size <= MAX_FILE_BYTES) {
      base64 = await fileToBase64(file);
      parseMode = imageAsset ? "image-asset" : (serverParsed ? "server-parse" : parseMode);
    }

    return {
      name: file.name,
      type: file.type || "",
      size: file.size,
      kind: kind,
      extension: extension,
      parseMode: parseMode,
      text: text,
      base64: base64
    };
  }

  function fileToBase64(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () {
        var result = String(reader.result || "");
        resolve(result.split(",")[1] || "");
      };
      reader.onerror = function () { reject(reader.error || new Error("File read failed")); };
      reader.readAsDataURL(file);
    });
  }

  function renderFileList() {
    els.materialCount.textContent = state.materials.length + (state.materials.length === 1 ? " file" : " files");
    if (els.materialsDrop) els.materialsDrop.classList.toggle("has-files", state.materials.length > 0);
    els.fileList.innerHTML = state.materials.map(function (file, index) {
      return [
        '<div class="file-chip">',
        '<i>' + escapeHtml(file.extension || "file").slice(0, 3).toUpperCase() + '</i>',
        '<div><strong>' + escapeHtml(trimMiddle(file.name, 34)) + '</strong><small>' + formatBytes(file.size) + " / " + escapeHtml(file.parseMode) + '</small></div>',
        '<button class="copy-button" type="button" data-remove-file="' + index + '" aria-label="Remove file"><i data-lucide="x"></i></button>',
        '</div>'
      ].join("");
    }).join("");

    els.fileList.querySelectorAll("[data-remove-file]").forEach(function (button) {
      button.addEventListener("click", function () {
        state.materials.splice(Number(button.dataset.removeFile), 1);
        renderFileList();
        dispatchMotionState();
      });
    });
    if (window.lucide) window.lucide.createIcons();
  }

  async function onSubmit(event) {
    event.preventDefault();
    if (!state.resume) {
      renderError("Upload a resume before generating a Vibe ID.");
      pulseNode(els.resumeDrop);
      return;
    }

    var jdText = els.jdText.value.trim();
    if (!jdText) {
      renderError("Select a built-in JD or paste a custom job description.");
      pulseNode(els.jdText);
      return;
    }

    els.generateButton.disabled = true;
    if (els.loadDemo) els.loadDemo.disabled = true;
    state.suggestions = [];
    setStage(1, "busy");
    await wait(260);
    setStage(2, "busy");
    await wait(260);
    setStage(2, "busy");

    try {
      var request = buildRequestPayload(jdText);
      var response = await fetch("../api/generate-vibe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request)
      });
      var payload = await response.json().catch(function () { return {}; });
      if (!response.ok) throw new Error(payload.error || "DeepSeek generation failed.");

      state.variants = payload.variants || [];
      updateAtsStateFromVariant(state.variants[0]);
      setStage(3, "busy");
      await wait(180);
      setStage(4, "busy");
      await wait(180);
      setStage(5, "busy");
      await wait(180);
      renderResults(payload);
      setStage(6, "done");
      dispatchMotionState();
    } catch (error) {
      setStage(0, "error");
      renderError(error.message || "Generation failed.");
    } finally {
      els.generateButton.disabled = false;
      if (els.loadDemo) els.loadDemo.disabled = false;
    }
  }

  function buildRequestPayload(jdText) {
    var jd = getSelectedJd();
    var runCount = Math.max(1, Math.min(3, Number(els.runCount.value || 1)));
    return {
      runs: runCount,
      student: {
        name: valueOf("student-name"),
        email: valueOf("student-email"),
        phone: valueOf("student-phone"),
        linkedin: valueOf("student-linkedin"),
        github: valueOf("student-github"),
        targetRole: valueOf("target-role"),
        notes: valueOf("source-notes")
      },
      job: {
        id: jd.id,
        label: jd.label,
        targetRole: valueOf("target-role") || jd.targetRole,
        text: jdText,
        builtIn: jd.id !== "custom"
      },
      files: [state.resume].concat(state.materials).filter(Boolean)
    };
  }

  function renderResults(payload) {
    var variants = payload.variants || [];
    var runErrors = payload.runErrors || [];
    if (!variants.length) {
      renderError("DeepSeek returned no V7 variants.");
      return;
    }

    els.resultPanel.innerHTML = [
      '<div class="result-head">',
      '<div><p class="eyebrow">Generation Complete</p><h2>' + escapeHtml(variants.length + " V7 variant" + (variants.length === 1 ? "" : "s")) + '</h2></div>',
      '<span class="status-pill">' + escapeHtml(payload.model || "DeepSeek") + '</span>',
      '</div>',
      runErrors.length ? renderRunWarnings(runErrors) : "",
      '<div class="variant-grid">',
      variants.map(renderVariant).join(""),
      '</div>'
    ].join("");

    els.resultPanel.querySelectorAll("[data-download-html]").forEach(function (button) {
      button.addEventListener("click", function () {
        var run = Number(button.dataset.downloadHtml);
        var variant = variants.filter(function (item) { return item.run === run; })[0];
        downloadText(variant.html || "", variant.htmlFileName || buildHtmlDownloadName(variant), "text/html");
      });
    });

    els.resultPanel.querySelectorAll("[data-download-json]").forEach(function (button) {
      button.addEventListener("click", function () {
        var run = Number(button.dataset.downloadJson);
        var variant = variants.filter(function (item) { return item.run === run; })[0];
        downloadText(JSON.stringify(variant.payload, null, 2), buildJsonDownloadName(variant), "application/json");
      });
    });

    if (window.lucide) window.lucide.createIcons();
  }

  function renderRunWarnings(runErrors) {
    return [
      '<div class="result-warning">',
      '<strong>Some runs were skipped</strong>',
      '<p>' + escapeHtml(runErrors.map(function (item) {
        return "Run " + item.run + ": " + item.error;
      }).join("  ")) + '</p>',
      '</div>'
    ].join("");
  }

  function renderVariant(variant) {
    var payload = variant.payload || {};
    var profile = payload.profile || {};
    var ats = payload.atsProfile || {};
    var projects = payload.projects || [];
    var skills = getThumbnailSkills(payload, ats);
    var screenshotCount = projects.reduce(function (sum, project) {
      return sum + ((project.screenshots || []).filter(function (shot) { return shot && shot.src; }).length);
    }, 0);

    return [
      '<article class="variant-card">',
      '<div class="variant-thumb" aria-label="Generated V7 thumbnail">',
      '<div class="variant-thumb-top">',
      '<div><p class="eyebrow">Run ' + escapeHtml(String(variant.run || "")) + '</p><h3>' + escapeHtml(profile.name || "Generated Vibe ID") + '</h3></div>',
      '<div class="v7-ready-badge" title="Downloadable V7 HTML"><i data-lucide="file-code-2"></i></div>',
      '</div>',
      '<div class="thumb-skill-row">' + skills.slice(0, 6).map(function (kw) { return '<span class="duke-skill-bubble">' + escapeHtml(kw) + '</span>'; }).join("") + '</div>',
      '<div class="thumb-section-lines"><span class="thumb-line"></span><span class="thumb-line"></span><span class="thumb-line"></span></div>',
      '<div class="thumb-foot"><span>' + escapeHtml(projects.length + " projects") + '</span><span>' + escapeHtml(screenshotCount + " screenshots") + '</span></div>',
      '</div>',
      '<div class="download-row">',
      '<button class="primary-button" type="button" data-download-html="' + escapeAttr(variant.run) + '"><i data-lucide="download"></i><span>Download HTML</span></button>',
      '<button class="copy-button" type="button" data-download-json="' + escapeAttr(variant.run) + '"><i data-lucide="braces"></i><span>JSON</span></button>',
      '</div>',
      '</article>'
    ].join("");
  }

  function getThumbnailSkills(payload, ats) {
    var out = [];
    function add(label) {
      label = String(label || "").trim();
      if (!label) return;
      var key = label.toLowerCase().replace(/[^a-z0-9]+/g, "");
      if (!key || out.some(function (existing) { return existing.toLowerCase().replace(/[^a-z0-9]+/g, "") === key; })) return;
      out.push(label);
    }
    (payload.analyticalSkills || []).forEach(function (item) { add(item.label || item.name); });
    (payload.quantToolkit || []).forEach(function (item) { add(item.label || item.name); });
    (payload.stack || []).forEach(function (item) { add(item.label || item.name); });
    (ats.targetKeywords || []).forEach(add);
    return out;
  }

  function collectReadMorePlan(payload) {
    return (payload.experience || []).map(function (exp) {
      return {
        role: exp.role || exp.organization || "Experience",
        keywords: (exp.readMoreKeywords || []).filter(Boolean)
      };
    }).filter(function (item) {
      return item.keywords.length;
    });
  }

  function renderError(message) {
    els.resultPanel.innerHTML = '<div class="error-box"><strong>Generation stopped</strong><p>' + escapeHtml(message) + '</p></div>';
  }

  function loadSamplePacket() {
    selectJd("duke_data_scientist");
    document.getElementById("student-name").value = "Conglin (Duke) Ruan";
    document.getElementById("student-email").value = "ruanx070@umn.edu";
    document.getElementById("student-phone").value = "+1 651-280-7402";
    document.getElementById("student-linkedin").value = "https://www.linkedin.com/in/conglin-ruan-6587b8126/";
    document.getElementById("student-github").value = "https://github.com/ruan";
    document.getElementById("target-role").value = "Data Scientist - Product and Platform Analytics";
    document.getElementById("source-notes").value = [
      "Sample source packet from existing V7 test data.",
      "Projects: nd2-analysis-pipeline, deep learning microscopy segmentation, VTE survival analysis, semantic resume matching.",
      "Constraints: keep GPA 3.78/4.00, do not invent web-scale product analytics or management scope."
    ].join("\n");
    state.resume = {
      name: "CV_Conglin_Ruan.pdf",
      type: "application/pdf",
      size: 155883,
      kind: "resume",
      extension: "pdf",
      parseMode: "sample-text",
      text: [
        "Conglin (Duke) Ruan. M.S. Biostatistics, University of Minnesota, GPA 3.78/4.00.",
        "Experience includes AI engineering, biomedical image analysis, survival analysis, FastAPI + React tools, Python, R, SQL, PyTorch, and stakeholder-facing research systems.",
        "Built nd2-analysis-pipeline for multi-channel microscopy threshold exploration, cached previews, statistical tests, and Excel/PNG reporting.",
        "Automated cell classification with CNN workflows reaching 97% accuracy on 20,000+ microscopy samples.",
        "Conducted recurrent VTE survival analyses using Kaplan-Meier estimators, Cox models, and competing-risks models."
      ].join("\n")
    };
    state.materials = [
      {
        name: "nd2-analysis-pipeline README.md",
        type: "text/markdown",
        size: 4200,
        kind: "material",
        extension: "md",
        parseMode: "sample-text",
        text: "FastAPI + React agent for ND2 microscopy image analysis with thresholds, metadata reporting, cached previews, statistical tests, and exportable reports."
      },
      {
        name: "Research worksheet.xlsx",
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        size: 38000,
        kind: "material",
        extension: "xlsx",
        parseMode: "sample-inventory",
        text: "Worksheet inventory: project goals, algorithm stages, evidence notes, metrics, screenshots."
      }
    ];
    els.resumeState.textContent = state.resume.name;
    renderFileList();
    animatePaperToSlot();
    animateMaterialPackets(state.materials.length);
    setStage(0, "sample");
    dispatchMotionState();
  }

  function setStage(stage, label) {
    setVisualStatus(label);
    dispatchMotionState({ stage: stage });
  }

  function setVisualStatus(label) {
    if (!els.apiStatus) return;
    var stateName = String(label || "ready").toLowerCase();
    var readable = {
      ready: "Ready",
      busy: "Working",
      done: "Generated",
      error: "Needs attention",
      sample: "Sample loaded"
    }[stateName] || "Working";
    els.apiStatus.textContent = "";
    els.apiStatus.classList.remove("is-idle", "is-busy", "is-done", "is-error", "is-sample");
    els.apiStatus.classList.add(
      stateName === "ready" ? "is-idle" :
      stateName === "done" ? "is-done" :
      stateName === "error" ? "is-error" :
      stateName === "sample" ? "is-sample" :
      "is-busy"
    );
    els.apiStatus.setAttribute("aria-label", readable);
    els.apiStatus.title = readable;
  }

  function dispatchMotionState(extra) {
    var variant = state.variants && state.variants[0];
    var payload = variant && variant.payload || {};
    var profile = payload.profile || {};
    var detail = Object.assign({
      stage: 0,
      fileCount: (state.resume ? 1 : 0) + state.materials.length,
      variantCount: state.variants.length,
      resumeName: state.resume && state.resume.name || "",
      studentName: valueOf("student-name") || profile.name || "",
      targetRole: valueOf("target-role") || profile.targetRole || (getSelectedJd() && getSelectedJd().targetRole) || "",
      materialNames: state.materials.map(function (file) { return file.name; }).slice(0, 8),
      experienceLines: getExperienceLines(payload),
      keywordChips: getMotionKeywords(payload),
      suggestions: state.suggestions
    }, extra || {});
    window.dispatchEvent(new CustomEvent("vibe-generator-stage", { detail: detail }));
  }

  function getMotionKeywords(payload) {
    var out = [];
    var blocked = /^(resume|identity|role|ats|score|current|suggestion|materials?|files?|uploaded|download|html|pdf|docx?|xlsx?|csv|png|jpg|jpeg)$/i;
    var known = [
      "data scientist", "product analytics", "platform analytics", "python", "sql", "r",
      "finance", "valuation", "dcf", "m&a", "excel", "google analytics", "a/b testing",
      "conversion analysis", "forecasting", "machine learning", "nlp", "biostatistics",
      "survival analysis", "clinical data", "dashboard", "tableau", "fastapi", "react",
      "pytorch", "gtm", "product marketing", "market research", "user research"
    ];

    function add(value) {
      var text = String(value || "")
        .replace(/\.[A-Za-z0-9]+$/g, "")
        .replace(/[_/|]+/g, " ")
        .replace(/[^A-Za-z0-9+#&.\s-]/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();
      if (!text || text.length < 2 || text.length > 34 || blocked.test(text)) return;
      if (text.split(/\s+/).length > 3) return;
      var key = text.replace(/[^a-z0-9]+/g, "");
      if (!key || out.some(function (item) { return item.replace(/[^a-z0-9]+/g, "") === key; })) return;
      out.push(text);
    }

    function addKnownFromText(text) {
      var haystack = String(text || "").toLowerCase();
      known.forEach(function (keyword) {
        if (haystack.indexOf(keyword.toLowerCase()) !== -1) add(keyword);
      });
    }

    var ats = payload.atsProfile || {};
    (payload.stack || []).forEach(function (item) { add(item.label || item.name); });
    (payload.analyticalSkills || []).forEach(function (item) { add(item.label || item.name); });
    (payload.quantToolkit || []).forEach(function (item) { add(item.label || item.name); });
    (ats.targetKeywords || []).forEach(add);
    addKnownFromText([
      valueOf("target-role"),
      getSelectedJd().text,
      state.resume && state.resume.text,
      valueOf("source-notes"),
      state.materials.map(function (file) { return file.name + " " + (file.text || ""); }).join(" ")
    ].join(" "));
    known.forEach(add);
    return out.slice(0, 18);
  }

  function getExperienceLines(payload) {
    var generated = (payload.experience || []).map(function (item) {
      return [item.role, item.organization].filter(Boolean).join(" at ");
    }).filter(Boolean);
    if (generated.length) return generated.slice(0, 6);

    var text = [state.resume && state.resume.text, valueOf("source-notes")].filter(Boolean).join("\n");
    var lines = text.split(/\n|\. /).map(function (line) {
      return line.replace(/\s+/g, " ").trim();
    }).filter(function (line) {
      return line.length > 24 && /\b(experience|intern|assistant|analyst|engineer|research|built|conducted|optimized|project|workflow)\b/i.test(line);
    });
    return lines.slice(0, 6);
  }

  function updateAtsStateFromVariant(variant) {
    var payload = variant && variant.payload || {};
    var ats = payload.atsProfile || {};
    state.suggestions = (ats.suggestions || ats.recommendations || []).filter(Boolean).slice(0, 5);
    dispatchMotionState();
  }

  function animatePaperToSlot() {
    if (!window.gsap || !els.resumeDrop) return;
    var rect = els.resumeDrop.getBoundingClientRect();
    var slot = els.resumeDrop.querySelector(".mail-slot").getBoundingClientRect();
    var paper = document.createElement("div");
    paper.className = "flying-paper";
    paper.style.left = rect.left + rect.width * 0.28 + "px";
    paper.style.top = rect.top + rect.height * 0.56 + "px";
    document.body.appendChild(paper);
    window.gsap.set(paper, {
      rotationX: 58,
      rotationY: -22,
      rotationZ: -10,
      transformPerspective: 780,
      z: 36
    });
    window.gsap.to(paper, {
      left: slot.left + slot.width / 2 - 39,
      top: slot.top + slot.height / 2 - 48,
      scale: 0.12,
      rotationX: 78,
      rotationY: 0,
      rotationZ: 1,
      z: -12,
      opacity: 0.25,
      duration: 0.82,
      ease: "power3.inOut",
      onComplete: function () { paper.remove(); }
    });
  }

  function animateMaterialPackets(count) {
    if (!window.gsap || !els.materialsDrop) return;
    var rect = els.materialsDrop.getBoundingClientRect();
    var targetNode = els.fileList.querySelector(".file-chip") || els.materialCount;
    var target = targetNode.getBoundingClientRect();
    var packetCount = Math.max(1, Math.min(5, Number(count || 1)));
    for (var i = 0; i < packetCount; i += 1) {
      var packet = document.createElement("div");
      packet.className = "material-packet-card";
      packet.style.left = rect.left + rect.width * (0.28 + i * 0.08) + "px";
      packet.style.top = rect.top + rect.height * (0.5 + (i % 2) * 0.12) + "px";
      document.body.appendChild(packet);
      window.gsap.set(packet, {
        rotationX: 62,
        rotationY: -28 + i * 8,
        rotationZ: -8 + i * 4,
        transformPerspective: 760,
        z: 42
      });
      window.gsap.to(packet, {
        left: target.left + Math.min(180, target.width * 0.58) + i * 4,
        top: target.top + target.height * 0.5 + i * 2,
        scale: 0.28,
        rotationX: 76,
        rotationY: 8,
        rotationZ: 0,
        z: -16,
        opacity: 0.12,
        delay: i * 0.06,
        duration: 0.7,
        ease: "power3.inOut",
        onComplete: function () { this.targets()[0].remove(); }
      });
    }
  }

  function pulseNode(node) {
    if (!window.gsap || !node) return;
    window.gsap.fromTo(node, { x: -6 }, { x: 0, duration: 0.08, repeat: 5, yoyo: true });
  }

  function setBusyLabel(node, text) {
    node.textContent = text;
    if (window.gsap) window.gsap.fromTo(node, { opacity: 0.4 }, { opacity: 1, duration: 0.18 });
  }

  function valueOf(id) {
    var node = document.getElementById(id);
    return node ? node.value.trim() : "";
  }

  function getExtension(name) {
    var match = String(name || "").toLowerCase().match(/\.([a-z0-9]+)$/);
    return match ? match[1] : "file";
  }

  function formatBytes(bytes) {
    if (!bytes) return "0 B";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return Math.round(bytes / 102.4) / 10 + " KB";
    return Math.round(bytes / 1024 / 102.4) / 10 + " MB";
  }

  function trimMiddle(value, length) {
    var text = String(value || "");
    if (text.length <= length) return text;
    var keep = Math.max(4, Math.floor((length - 3) / 2));
    return text.slice(0, keep) + "..." + text.slice(-keep);
  }

  function downloadText(text, name, type) {
    var blob = new Blob([text], { type: type || "text/plain" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function buildHtmlDownloadName(variant) {
    if (variant.htmlFileName) return variant.htmlFileName;
    return baseDownloadStem(variant) + ".html";
  }

  function buildJsonDownloadName(variant) {
    return baseDownloadStem(variant) + ".json";
  }

  function baseDownloadStem(variant) {
    var payload = variant.payload || {};
    var profile = payload.profile || {};
    var stem = (profile.shortName || profile.name || "vibe-id").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    return stem + "-v7-run-" + String(variant.run || 1).padStart(2, "0");
  }

  function wait(ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/`/g, "&#96;");
  }
})();
