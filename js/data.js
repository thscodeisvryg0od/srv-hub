/* ============================================================
   DATA - load servers.json, state, render helpers
============================================================ */

let nodes = [];
let filter = "all";
let lastScan = Date.now();
let isLoading = false;
let loadError = false;

async function loadNodes() {
  isLoading = true;
  loadError = false;

  const grid = document.getElementById("grid");
  if (grid) {
    grid.innerHTML =
      '<div style="text-align:center;padding:40px;color:var(--muted);font-family:var(--font);">' +
      escapeHtml(t("loading_nodes")) +
      "</div>";
  }

  try {
    const res = await fetch("data/servers.json", {
      cache: "no-cache",
      headers: { Accept: "application/json" }
    });

    if (!res.ok) {
      throw new Error("HTTP " + res.status);
    }

    const data = await res.json();

    if (!Array.isArray(data)) {
      throw new Error("Invalid data format");
    }

    // Basic sanitization & validation
    nodes = data
      .filter(function (n) {
        return n && typeof n === "object" && n.id && n.name;
      })
      .map(function (n) {
        return {
          id: String(n.id).slice(0, 64),
          name: String(n.name).slice(0, 128),
          avatar: String(n.avatar || n.name.slice(0, 2)).toUpperCase().slice(0, 4),
          status: n.status === "online" ? "online" : "offline",
          verified: Boolean(n.verified),
          pending: Boolean(n.pending),
          ping: typeof n.ping === "number" ? n.ping : null,
          uptime: typeof n.uptime === "number" ? Math.min(100, Math.max(0, n.uptime)) : 0,
          category: String(n.category || "other").slice(0, 32),
          site: typeof n.site === "string" && n.site.startsWith("http") ? n.site : "#",
          discord: typeof n.discord === "string" && n.discord.startsWith("http") ? n.discord : "#",
          added: typeof n.added === "number" ? n.added : Date.now(),
          about: String(n.about || "").slice(0, 2000),
          legal: String(n.legal || "").slice(0, 2000)
        };
      });

    isLoading = false;
    log("[agent] nodes loaded · " + nodes.length + " entries");
    return nodes;
  } catch (err) {
    console.error("Failed to load servers.json:", err);
    isLoading = false;
    loadError = true;
    nodes = [];
    log("[agent] error loading nodes");
    if (grid) {
      grid.innerHTML =
        '<div style="text-align:center;padding:40px;color:var(--danger);font-family:var(--font);">' +
        escapeHtml(t("load_error")) +
        "</div>";
    }
    toast(t("load_error"));
    return [];
  }
}

function getOnlineNodes() {
  return nodes.filter(function (n) {
    return n.status === "online" && !n.pending;
  });
}

window.nodes = function () { return nodes; };
window.filter = function (v) {
  if (typeof v !== "undefined") filter = v;
  return filter;
};
window.lastScan = function (v) {
  if (typeof v !== "undefined") lastScan = v;
  return lastScan;
};
window.loadNodes = loadNodes;
window.getOnlineNodes = getOnlineNodes;
window.isLoading = function () { return isLoading; };
window.loadError = function () { return loadError; };