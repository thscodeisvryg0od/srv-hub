/* ============================================================
   UTILS - escape, toast, logging helpers
============================================================ */

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function toast(msg) {
  const w = document.getElementById("toasts");
  if (!w) return;

  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  w.appendChild(t);

  requestAnimationFrame(function () {
    t.classList.add("show");
  });

  setTimeout(function () {
    t.classList.remove("show");
    setTimeout(function () {
      t.remove();
    }, 300);
  }, 2600);
}

function log(msg) {
  const el = document.getElementById("log");
  if (!el) return;

  const time = new Date().toLocaleTimeString("en-GB", { hour12: false });
  const safeMsg = escapeHtml(msg);

  el.innerHTML = "[" + time + "] " + safeMsg + "<br>" + el.innerHTML;

  const lines = el.innerHTML.split("<br>");
  if (lines.length > 5) {
    el.innerHTML = lines.slice(0, 5).join("<br>");
  }
}

window.escapeHtml = escapeHtml;
window.toast = toast;
window.log = log;