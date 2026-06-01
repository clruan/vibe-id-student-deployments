/*
 * template-engine.js - AI Resume V7 local router.
 * Selects one profile from the local registry and exposes window.resumeContent
 * to the existing V3 renderers. This is intentionally local-only: no Vercel,
 * no online Vibe ID routing, and no job-variant branching.
 */
(function () {
  var registry = window.aiResumeData || {};
  var aliases = window.aiResumeProfileAliases || {};

  function orderedProfileIds() {
    return Object.keys(registry)
      .filter(function (id) { return registry[id] && registry[id].profile; })
      .sort(function (a, b) {
        var oa = typeof registry[a].order === "number" ? registry[a].order : 999;
        var ob = typeof registry[b].order === "number" ? registry[b].order : 999;
        if (oa !== ob) return oa - ob;
        return a.localeCompare(b);
      });
  }

  function normalizeProfileId(value) {
    if (!value) return null;
    var key = String(value).toLowerCase();
    var canonical = aliases[key] || aliases[value] || value;
    return registry[canonical] ? canonical : null;
  }

  function getProfileIdFromUrl() {
    try {
      var url = new URL(window.location.href);
      return normalizeProfileId(url.searchParams.get("profile")) ||
        normalizeProfileId(url.searchParams.get("candidate"));
    } catch (error) {
      return null;
    }
  }

  function buildProfileUrl(profileId) {
    var nextId = normalizeProfileId(profileId) || activeProfileId;
    try {
      var url = new URL(window.location.href);
      url.searchParams.set("profile", nextId);
      url.searchParams.delete("candidate");
      return url.pathname + url.search + url.hash;
    } catch (error) {
      return "?profile=" + encodeURIComponent(nextId);
    }
  }

  function normalizeData(data, id) {
    data.id = data.id || id;
    data.profile = data.profile || {};
    data.profile.shortName = data.profile.shortName || data.profile.name;
    data.results = Array.isArray(data.results) ? data.results : [];
    data.stack = Array.isArray(data.stack) ? data.stack : [];
    data.quantToolkit = Array.isArray(data.quantToolkit) ? data.quantToolkit : [];
    data.experience = Array.isArray(data.experience) ? data.experience : [];
    data.education = Array.isArray(data.education) ? data.education : [];
    data.awards = Array.isArray(data.awards) ? data.awards : [];
    data.publications = Array.isArray(data.publications) ? data.publications : [];
    data.peerEvaluations = Array.isArray(data.peerEvaluations) ? data.peerEvaluations : [];
    data.projects = Array.isArray(data.projects) ? data.projects : [];

    data.experience.forEach(function (item, index) {
      item.id = item.id || "exp-" + index;
      item.relatedTech = Array.isArray(item.relatedTech) ? item.relatedTech : [];
      item.relatedProjects = Array.isArray(item.relatedProjects) ? item.relatedProjects : [];
    });

    data.projects.forEach(function (project, index) {
      project.id = project.id || "project-" + index;
      project.navTitle = project.navTitle || project.title || ("Project " + (index + 1));
      project.navMeta = project.navMeta || project.source || "Project";
      project.source = project.source || "Project source";
      project.summary = project.summary || "";
      project.owned = Array.isArray(project.owned) ? project.owned : [];
      project.metrics = Array.isArray(project.metrics) ? project.metrics : [];
      project.relatedTech = Array.isArray(project.relatedTech) ? project.relatedTech : [];
      project.stages = Array.isArray(project.stages) && project.stages.length ? project.stages : fallbackStages(project);
      project.accent = project.accent || "#0f766e";
    });

    return data;
  }

  function fallbackStages(project) {
    return [
      {
        label: "Frame",
        inputTitle: "Project input",
        inputLines: [project.summary || "Project context"],
        operationTitle: "Core logic",
        operationLines: project.owned.length ? project.owned.slice(0, 3) : ["Define the problem", "Build the workflow", "Review the output"],
        outputTitle: "Project output",
        outputLines: project.metrics.length ? project.metrics.map(function (m) { return m.label + ": " + m.value; }) : ["Reviewable project artifact"],
        pmNote: project.algorithmSummary || project.summary || "The project is presented as a structured workflow."
      }
    ];
  }

  var profileIds = orderedProfileIds();
  var activeProfileId = getProfileIdFromUrl() || normalizeProfileId("aaron") || profileIds[0];
  var activeProfile = activeProfileId ? normalizeData(registry[activeProfileId], activeProfileId) : null;

  window.resumeProgram = {
    kind: "local-template-v7",
    profileOrder: profileIds,
    profiles: registry,
    activeProfileId: activeProfileId,
    normalizeProfileId: normalizeProfileId,
    getProfileIdFromUrl: getProfileIdFromUrl,
    buildProfileUrl: buildProfileUrl
  };

  window.resumeCandidateId = activeProfileId;
  window.resumeProfileId = activeProfileId;
  window.resumeContent = activeProfile;
})();
