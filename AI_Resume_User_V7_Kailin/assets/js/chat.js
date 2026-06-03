(function () {
  const ns = window.aiResume || (window.aiResume = {});
  const data = window.resumeContent;
  const ui = data.ui || {};
  const displayName = data.profile.shortName || data.profile.name;

  var SYSTEM_CONTEXT = buildContext();

  function buildContext() {
    var p = data.profile;
    var exp = data.experience.map(function (e) {
      return e.role + " at " + e.organization + " (" + e.dates + "): " + e.bullets.join(" ");
    }).join("\n");
    var edu = data.education.map(function (e) {
      return e.degree + ", " + e.school + " (" + e.dates + ")";
    }).join("; ");
    var projects = data.projects.map(function (proj) {
      return proj.title + " (" + proj.source + "): " + proj.summary;
    }).join("\n");
    var stack = data.stack.map(function (s) { return s.label; }).join(", ");
    var pubs = data.publications.map(function (pub) {
      return pub.title + " — " + pub.journal + " " + pub.year;
    }).join("\n");

    return [
      "You are an assistant embedded on " + p.name + "'s portfolio page.",
      "Answer questions about their background concisely and helpfully.",
      "If a question is unrelated, politely redirect to resume topics.",
      "\n--- Profile ---",
      p.summary,
      "\n--- Experience ---",
      exp,
      "\n--- Education ---",
      edu,
      "\n--- Projects ---",
      projects,
      "\n--- Tech Stack ---",
      stack,
      "\n--- Publications ---",
      pubs
    ].join("\n");
  }

  var GREETING = ui.chatGreeting || ("Hi! I can answer questions about " + displayName + "'s background, projects, publications, and skills. What would you like to know?");
  var messages = [];
  var isOpen = false;

  function inject() {
    /* FAB */
    var fab = document.createElement("button");
    fab.className = "chat-fab";
    fab.setAttribute("aria-label", "Open AI chat");
    fab.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
    document.body.appendChild(fab);

    /* Chat window */
    var win = document.createElement("div");
    win.className = "chat-window";
    win.id = "chat-window";
    win.innerHTML =
      '<div class="chat-header">' +
        '<span class="chat-header-title">' + (ui.chatTitle || ("Ask about " + displayName)) + '</span>' +
        '<button class="chat-close" aria-label="Close chat">&times;</button>' +
      '</div>' +
      '<div class="chat-messages" id="chat-messages"></div>' +
      '<form class="chat-input-row" id="chat-form">' +
        '<input class="chat-input" id="chat-input" type="text" placeholder="' + (ui.chatPlaceholder || "Ask a question...") + '" autocomplete="off">' +
        '<button class="chat-send" type="submit">Send</button>' +
      '</form>';
    document.body.appendChild(win);

    fab.addEventListener("click", toggle);
    win.querySelector(".chat-close").addEventListener("click", toggle);
    document.getElementById("chat-form").addEventListener("submit", handleSubmit);

    messages = [{ role: "assistant", content: GREETING }];
    renderMessages();
  }

  function toggle() {
    isOpen = !isOpen;
    document.getElementById("chat-window").classList.toggle("is-open", isOpen);
    if (isOpen) document.getElementById("chat-input").focus();
  }

  function renderMessages() {
    var container = document.getElementById("chat-messages");
    container.innerHTML = messages.map(function (msg) {
      return '<div class="chat-bubble ' + msg.role + '">' + escapeHtml(msg.content) + '</div>';
    }).join("");
    container.scrollTop = container.scrollHeight;
  }

  function showTyping() {
    var container = document.getElementById("chat-messages");
    container.innerHTML += '<div class="chat-bubble typing" id="typing-indicator">Thinking...</div>';
    container.scrollTop = container.scrollHeight;
  }

  function hideTyping() {
    var el = document.getElementById("typing-indicator");
    if (el) el.remove();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    var input = document.getElementById("chat-input");
    var text = input.value.trim();
    if (!text) return;

    messages.push({ role: "user", content: text });
    input.value = "";
    renderMessages();
    showTyping();

    var reply = await getReply(text);
    hideTyping();
    messages.push({ role: "assistant", content: reply });
    renderMessages();
  }

  async function getReply(userText) {
    var timeoutId = null;
    try {
      var controller = typeof AbortController !== "undefined" ? new AbortController() : null;
      timeoutId = controller ? window.setTimeout(function () {
        controller.abort();
      }, 8000) : null;
      var res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller ? controller.signal : undefined,
        body: JSON.stringify({
          context: SYSTEM_CONTEXT,
          messages: messages.filter(function (m) {
            return m.role === "user" || (m.role === "assistant" && m.content !== GREETING);
          }).concat([{ role: "user", content: userText }]).slice(-10)
        })
      });
      if (timeoutId) window.clearTimeout(timeoutId);
      if (res.ok) {
        var json = await res.json();
        if (json && json.reply) return json.reply;
      }
    } catch (_) { /* fall through */ }
    if (timeoutId) window.clearTimeout(timeoutId);

    return localFallback(userText);
  }

  function localFallback(text) {
    var lower = text.toLowerCase();

    if (lower.includes("experience") || lower.includes("work") || lower.includes("job"))
      return data.experience.map(function (e) { return e.role + " at " + e.organization + " (" + e.dates + ")"; }).join("\n");

    if (lower.includes("education") || lower.includes("degree") || lower.includes("school"))
      return data.education.map(function (e) { return e.degree + " \u2014 " + e.school + " (" + e.dates + ")"; }).join("\n");

    if (lower.includes("project"))
      return data.projects.map(function (p) { return p.navTitle + ": " + p.summary; }).join("\n\n");

    if (lower.includes("publication") || lower.includes("paper"))
      return data.publications.map(function (p) { return p.title + " \u2014 " + p.journal + " (" + p.year + ")"; }).join("\n\n");

    if (lower.includes("skill") || lower.includes("tech") || lower.includes("stack") || lower.includes("tool"))
      return "Tech stack: " + data.stack.map(function (s) { return s.label; }).join(", ") + ".";

    if (lower.includes("contact") || lower.includes("email") || lower.includes("phone"))
      return [
        data.profile.email ? "Email: " + data.profile.email : null,
        data.profile.phone ? "Phone: " + data.profile.phone : null,
        data.profile.website ? "Website: " + data.profile.website : null
      ].filter(Boolean).join(" | ");

    if (lower.includes("strength") || lower.includes("about"))
      return data.profile.summary;

      return "I can answer questions about " + displayName + "'s experience, education, projects, publications, skills, and contact info. What would you like to know?";
  }

  function escapeHtml(text) {
    var div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML.replace(/\n/g, "<br>");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }

  ns.chat = { toggle: toggle };
})();
