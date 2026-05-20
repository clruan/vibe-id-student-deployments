(function () {
  var base = window.aiResumeUserBase;
  if (!base) return;

  window.aiResumeUser = window.aiResumeUser || {};
  window.aiResumeUser["investment-analyst"] = Object.assign({}, base, {
    id: "investment-analyst",
    order: 1,
    track: base.track,
    targetRole: base.targetRole,
    level: base.level
  });
})();
