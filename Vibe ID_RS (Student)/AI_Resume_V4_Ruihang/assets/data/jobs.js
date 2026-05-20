(function () {
  var base = window.aiResumeUserBase;
  if (!base) return;

  window.aiResumeUser = window.aiResumeUser || {};
  window.aiResumeUser["marketing-strategy"] = Object.assign({}, base, {
    id: "marketing-strategy",
    order: 1,
    track: base.track,
    targetRole: base.targetRole,
    level: base.level
  });
})();
