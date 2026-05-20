/*
 * content.js — job router.
 * Reads `?job=<id>` from the URL, picks the matching variant from
 * window.aiResumeUser, and exposes it as window.resumeContent so the
 * rest of the app (pages.js, projects.js, skills.js, ...) renders the
 * right job version without knowing anything about job switching.
 */
(function () {
  var registry = window.aiResumeUser || {};
  var jobOrder = Object.keys(registry).sort(function (a, b) {
    var ra = typeof registry[a].order === "number" ? registry[a].order : 999;
    var rb = typeof registry[b].order === "number" ? registry[b].order : 999;
    if (ra !== rb) return ra - rb;
    return a.localeCompare(b);
  });

  function normalizeJobId(value) {
    return registry[value] ? value : null;
  }

  function getJobIdFromUrl() {
    try {
      var url = new URL(window.location.href);
      return normalizeJobId(url.searchParams.get("job"));
    } catch (e) {
      return null;
    }
  }

  function getActiveJobId() {
    return getJobIdFromUrl() || jobOrder[0];
  }

  function buildJobUrl(jobId) {
    var nextId = normalizeJobId(jobId) || getActiveJobId();
    try {
      var url = new URL(window.location.href);
      url.searchParams.set("job", nextId);
      return url.pathname + url.search + url.hash;
    } catch (e) {
      return "?job=" + encodeURIComponent(nextId);
    }
  }

  /* Group jobs by track for the sidebar switcher. */
  function buildTracks() {
    var seen = {};
    var tracks = [];
    jobOrder.forEach(function (jobId) {
      var job = registry[jobId];
      var track = job.track || "Other";
      if (!seen[track]) {
        seen[track] = { name: track, jobs: [] };
        tracks.push(seen[track]);
      }
      seen[track].jobs.push({ id: jobId, job: job });
    });
    return tracks;
  }

  var activeJobId = getActiveJobId();

  window.resumeProgram = {
    kind: "user-jobs",
    jobOrder: jobOrder,
    jobs: registry,
    activeJobId: activeJobId,
    tracks: buildTracks(),
    normalizeJobId: normalizeJobId,
    buildJobUrl: buildJobUrl,
    getJobIdFromUrl: getJobIdFromUrl
  };

  window.resumeJobId = activeJobId;
  window.resumeContent = registry[activeJobId];
})();
