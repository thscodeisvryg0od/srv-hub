/* ============================================================
   APP - initialization & event wiring
============================================================ */

document.addEventListener("DOMContentLoaded", async function () {
  // Theme
  if (localStorage.getItem("srv_theme") === "light") {
    document.body.classList.add("light");
    updateThemeIcon(true);
  }

  // Language label
  const langLabel = languageLabels[window.currentLang] || "English";
  document.getElementById("currentLang").textContent = langLabel;

  // Mark active language in dropdown
  document.querySelectorAll(".lang-dropdown div").forEach(function (d) {
    d.classList.toggle("active", d.getAttribute("data-lang") === window.currentLang);
  });

  applyTranslations();

  // Close lang dropdown on outside click
  document.addEventListener("click", function (e) {
    const sel = document.getElementById("langSelector");
    if (sel && !sel.contains(e.target)) {
      sel.classList.remove("open");
    }
  });

  // Tooltip mobile tap
  document.addEventListener("click", function (e) {
    const badge = e.target.closest(".badge.verified, .verified-terminal");
    document
      .querySelectorAll(".badge.verified.tooltip-open, .verified-terminal.tooltip-open")
      .forEach(function (el) {
        if (el !== badge) el.classList.remove("tooltip-open");
      });
    if (badge) badge.classList.toggle("tooltip-open");
  });

  // Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeDeploy();
      closeMenu();
      document.querySelectorAll(".tooltip-open").forEach(function (el) {
        el.classList.remove("tooltip-open");
      });
      showMain();
    }
  });

  // Load data
  await loadNodes();
  render();
  updateUI();
  typeTitle();
  log("[agent] node agent online · verification active");

  // Agent heartbeat (simulated)
  setInterval(function () {
    const msgs = [
      "[agent] heartbeat from starzone.se",
      "[agent] quantum.gg verified",
      "[agent] cluster health ok",
      "[agent] scanning voidlink.io...",
      "[agent] security sweep done"
    ];
    log(msgs[Math.floor(Math.random() * msgs.length)]);
    lastScan(Date.now());
  }, 11000);

  // Time updater
  setInterval(updateTime, 3000);
});