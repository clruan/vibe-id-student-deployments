/*
 * content.js — candidate bootstrap.
 * Loads Aaron's profile from the local registry and exposes it as
 * `window.resumeContent` so the shared page renderers can stay unchanged.
 */
(function () {
  var registry = window.aiResumeData || {};
  var defaultCandidateId = "arron-li";

  function normalizeCandidateId(value) {
    return registry[value] ? value : null;
  }

  function getCandidateIdFromUrl() {
    try {
      var url = new URL(window.location.href);
      return normalizeCandidateId(url.searchParams.get("candidate"));
    } catch (error) {
      return null;
    }
  }

  var activeCandidateId = getCandidateIdFromUrl() || normalizeCandidateId(defaultCandidateId) || Object.keys(registry)[0];
  var activeCandidate = activeCandidateId ? registry[activeCandidateId] : null;

  window.resumeProgram = {
    kind: "single-candidate",
    candidates: registry,
    activeCandidateId: activeCandidateId,
    getCandidateIdFromUrl: getCandidateIdFromUrl
  };

  window.resumeCandidateId = activeCandidateId;
  window.resumeContent = activeCandidate;
})();
