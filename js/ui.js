/* ============================================================
   UI - theme, menu, detail view, render, filters
============================================================ */

function toggleTheme() {
  document.body.classList.toggle("light");
  const isLight = document.body.classList.contains("light");
  localStorage.setItem("srv_theme", isLight ? "light" : "dark");
  updateThemeIcon(isLight);
}

function updateThemeIcon(isLight) {
  const icon = document.getElementById("themeIcon");
  if (!icon) return;

  if (isLight) {
    icon.innerHTML = '<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>';
  } else {
    icon.innerHTML =
      '<circle cx="12" cy="12" r="5"/>' +
      '<path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>';
  }
}

function toggleMenu() {
  document.getElementById("menuToggle").classList.toggle("active");
  document.getElementById("navLinks").classList.toggle("active");
}

function closeMenu() {
  document.getElementById("menuToggle").classList.remove("active");
  document.getElementById("navLinks").classList.remove("active");
}

function toggleLang() {
  document.getElementById("langSelector").classList.toggle("open");
}

function setLang(lang, label, e) {
  e.stopPropagation();
  window.currentLang = lang;
  localStorage.setItem("srv_lang", lang);

  document.getElementById("currentLang").textContent = label;

  document.querySelectorAll(".lang-dropdown div").forEach(function (d) {
    d.classList.remove("active");
  });
  e.target.classList.add("active");

  document.getElementById("langSelector").classList.remove("open");

  applyTranslations();
  render();
  updateUI();

  if (document.getElementById("detailView").classList.contains("active")) {
    const title = document.getElementById("detailName").textContent;
    const node = nodes().find(function (n) { return n.name === title; });
    if (node) showDetail(node.id, false);
  }

  toast("Language → " + label);
}

function showMain() {
  document.getElementById("mainView").style.display = "block";
  document.getElementById("detailView").classList.remove("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function typeDetailTitle(name) {
  const el = document.getElementById("detailTitle");
  el.innerHTML = "";
  let i = 0;
  const full = "./" + name;

  function tick() {
    if (i <= full.length) {
      const current = full.slice(0, i);
      if (current.endsWith(name)) {
        el.innerHTML = "./<span>" + escapeHtml(name) + "</span>";
      } else {
        el.textContent = current;
      }
      i++;
      setTimeout(tick, 40);
    }
  }
  tick();
}

function showDetail(id, shouldScroll = true) {
  const node = nodes().find(function (n) { return n.id === id; });
  if (!node) return;

  document.getElementById("mainView").style.display = "none";
  document.getElementById("detailView").classList.add("active");

  typeDetailTitle(node.name);
  document.getElementById("detailAvatar").textContent = node.avatar;
  document.getElementById("detailName").textContent = node.name;
  document.getElementById("detailCat").textContent = node.category;

  let meta = "";
  meta +=
    "<div>Status: <strong>" +
    escapeHtml(node.status === "online" ? t("status_online") : t("status_offline")) +
    "</strong></div>";
  meta +=
    "<div>Ping: <strong>" +
    (node.ping != null ? escapeHtml(node.ping) + "ms" : "—") +
    "</strong></div>";
  meta +=
    "<div>Uptime: <strong>" +
    escapeHtml(node.uptime) +
    "%</strong></div>";

  if (node.verified) {
    meta +=
      '<div class="verified-terminal" data-tooltip="' +
      escapeHtml(t("verify_tooltip")) +
      '">' +
      escapeHtml(t("verified")) +
      "</div>";
  }

  document.getElementById("detailMeta").innerHTML = meta;
  document.getElementById("detailAbout").innerHTML =
    "<p>" + escapeHtml(node.about || "No description available yet.") + "</p>";
  document.getElementById("detailLegal").innerHTML =
    "<p>" + escapeHtml(node.legal || "No additional legal information.") + "</p>";

  let actions = "";
  if (node.site && node.site !== "#") {
    actions +=
      '<a href="' +
      escapeHtml(node.site) +
      '" target="_blank" rel="noopener noreferrer" class="btn primary">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
      '<path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>' +
      "</svg>" +
      escapeHtml(t("visit")) +
      "</a>";
  }

  if (node.discord && node.discord !== "#") {
    actions +=
      '<a href="' +
      escapeHtml(node.discord) +
      '" target="_blank" rel="noopener noreferrer" class="btn discord">' +
      '<svg viewBox="0 0 24 24" fill="currentColor">' +
      '<path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>' +
      "</svg>" +
      escapeHtml(t("discord")) +
      "</a>";
  }

  document.getElementById("detailActions").innerHTML = actions;
  renderDetailDiscover(node.id);

  if (shouldScroll) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function renderDetailDiscover(currentId) {
  const online = getOnlineNodes().filter(function (n) {
    return n.id !== currentId;
  });

  if (!online.length) {
    document.getElementById("detailDiscover").innerHTML = "";
    return;
  }

  const featured =
    online
      .filter(function (n) { return n.verified; })
      .sort(function (a, b) { return b.uptime - a.uptime; })[0] || online[0];

  const lowest = online.slice().sort(function (a, b) {
    return (a.ping || 999) - (b.ping || 999);
  })[0];

  let html = "";
  html +=
    '<div class="featured">' +
    '<div class="tag">' + escapeHtml(t("featured")) + "</div>" +
    "<h3>" + escapeHtml(featured.name) + "</h3>" +
    '<div class="meta">' +
    escapeHtml(featured.category) + " · " +
    escapeHtml(featured.ping) + "ms · " +
    escapeHtml(featured.uptime) + "% uptime</div>" +
    '<div class="btns">' +
    '<a href="#" class="btn primary" onclick="showDetail(\'' +
    escapeHtml(featured.id) +
    '\'); return false;">' +
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
    '<path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>' +
    "</svg>" +
    escapeHtml(t("visit")) +
    "</a></div></div>";

  html +=
    '<div class="side">' +
    '<div class="mini" onclick="showDetail(\'' + escapeHtml(lowest.id) + '\')">' +
    '<div class="label">' + escapeHtml(t("lowest_ping")) + "</div>" +
    '<div class="name">' + escapeHtml(lowest.name) + "</div>" +
    '<div class="sub">' + escapeHtml(lowest.ping) + "ms · " + escapeHtml(lowest.category) + "</div>" +
    "</div>" +
    '<div class="mini" onclick="randomNode()">' +
    '<div class="label">' + escapeHtml(t("feeling_lucky")) + "</div>" +
    '<div class="name">' + escapeHtml(t("random_node")) + "</div>" +
    '<div class="sub">' + escapeHtml(t("tap_discover")) + "</div>" +
    "</div></div>";

  document.getElementById("detailDiscover").innerHTML = html;
}

function updateUI() {
  const list = nodes();
  document.getElementById("sTotal").textContent = list.length;
  document.getElementById("sOnline").textContent = list.filter(function (n) {
    return n.status === "online";
  }).length;
  document.getElementById("sVerified").textContent = list.filter(function (n) {
    return n.verified;
  }).length;

  const online = getOnlineNodes();
  if (!online.length) return;

  const featured =
    online
      .filter(function (n) { return n.verified; })
      .sort(function (a, b) { return b.uptime - a.uptime; })[0] || online[0];

  document.getElementById("fName").textContent = featured.name;
  document.getElementById("fMeta").textContent =
    featured.category + " · " + featured.ping + "ms · " + featured.uptime + "% uptime";

  document.getElementById("fVisit").href =
    featured.site && featured.site !== "#" ? featured.site : "#";
  document.getElementById("fDiscord").href =
    featured.discord && featured.discord !== "#" ? featured.discord : "#";

  const lowest = online.slice().sort(function (a, b) {
    return (a.ping || 999) - (b.ping || 999);
  })[0];

  document.getElementById("lowName").textContent = lowest.name;
  document.getElementById("lowSub").textContent = lowest.ping + "ms · " + lowest.category;

  const newest = list.slice().sort(function (a, b) {
    return (b.added || 0) - (a.added || 0);
  })[0];

  document.getElementById("newName").textContent = newest.name;
  document.getElementById("newSub").textContent =
    newest.category + (newest.pending ? " · " + t("pending") : "");
}

function randomNode() {
  const online = getOnlineNodes();
  if (!online.length) return;

  const pick = online[Math.floor(Math.random() * online.length)];
  toast(t("discovered", { name: pick.name }));
  showDetail(pick.id);
}

function render() {
  if (isLoading() || loadError()) return;

  const q = document.getElementById("search").value.toLowerCase().trim();
  const cat = document.getElementById("cat").value;
  const sort = document.getElementById("sort").value;
  const currentFilter = filter();

  let list = nodes().filter(function (n) {
    const matchQ =
      n.name.toLowerCase().includes(q) || n.id.toLowerCase().includes(q);
    const matchC = cat === "all" || n.category === cat;
    let matchF = true;
    if (currentFilter === "online") matchF = n.status === "online";
    if (currentFilter === "verified") matchF = n.verified;
    if (currentFilter === "pending") matchF = n.pending;
    return matchQ && matchC && matchF;
  });

  if (sort === "ping") {
    list.sort(function (a, b) { return (a.ping || 999) - (b.ping || 999); });
  }
  if (sort === "uptime") {
    list.sort(function (a, b) { return (b.uptime || 0) - (a.uptime || 0); });
  }
  if (sort === "name") {
    list.sort(function (a, b) { return a.name.localeCompare(b.name); });
  }

  document.getElementById("count").textContent = "(" + list.length + ")";

  const grid = document.getElementById("grid");
  if (!list.length) {
    grid.innerHTML =
      '<div style="text-align:center;padding:40px;color:var(--muted);font-family:var(--font);">' +
      escapeHtml(t("no_nodes")) +
      "</div>";
    return;
  }

  let html = "";
  list.forEach(function (n) {
    const off = n.status === "offline";
    const siteOff = !n.site || n.site === "#" || off;
    const discOff = !n.discord || n.discord === "#" || off;

    let badges = "";
    if (n.category) {
      badges += '<span class="badge cat">' + escapeHtml(n.category) + "</span>";
    }
    if (n.verified) {
      badges +=
        '<span class="badge verified" data-tooltip="' +
        escapeHtml(t("verify_tooltip")) +
        '">' +
        escapeHtml(t("verified")) +
        "</span>";
    }
    if (n.pending) {
      badges += '<span class="badge pending">' + escapeHtml(t("pending")) + "</span>";
    }
    badges +=
      '<span class="badge ' +
      (off ? "offline" : "online") +
      '">' +
      escapeHtml(off ? t("status_offline") : t("status_online")) +
      "</span>";

    html += '<div class="card' + (off ? " offline" : "") + '">';
    html += '<div class="card-head">';
    html += '<div class="card-left">';
    html += '<div class="avatar">' + escapeHtml(n.avatar) + "</div>";
    html +=
      '<a class="card-title" href="#" onclick="showDetail(\'' +
      escapeHtml(n.id) +
      '\'); return false;">' +
      escapeHtml(n.name) +
      "</a>";
    html += "</div>";
    html += '<div class="badges">' + badges + "</div>";
    html += "</div>";

    html +=
      '<div class="info">ping: ' +
      (n.ping != null ? escapeHtml(n.ping) + "ms" : "—") +
      " · protocol: " +
      (off ? "—" : escapeHtml(t("secure"))) +
      " · uptime: " +
      escapeHtml(n.uptime) +
      "%</div>";

    html += '<div class="actions">';
    html +=
      '<a class="btn primary' +
      (siteOff ? " disabled" : "") +
      '" href="' +
      (siteOff ? "#" : escapeHtml(n.site)) +
      '" target="_blank" rel="noopener noreferrer">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
      '<path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>' +
      "</svg>" +
      escapeHtml(t("visit")) +
      "</a>";

    html +=
      '<a class="btn discord' +
      (discOff ? " disabled" : "") +
      '" href="' +
      (discOff ? "#" : escapeHtml(n.discord)) +
      '" target="_blank" rel="noopener noreferrer">' +
      '<svg viewBox="0 0 24 24" fill="currentColor">' +
      '<path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>' +
      "</svg>" +
      escapeHtml(t("discord")) +
      "</a>";

    html +=
      '<button class="btn-report" onclick="report(\'' +
      escapeHtml(n.name.replace(/\\/g, "\\\\").replace(/'/g, "\\'")) +
      '\')">report</button>';

    html += "</div></div>";
  });

  grid.innerHTML = html;
}

function setFilter(f, btn) {
  filter(f);
  document.querySelectorAll(".tab").forEach(function (t) {
    t.classList.remove("active");
  });
  btn.classList.add("active");
  render();
}

function report(name) {
  if (!confirm(t("report_confirm", { name: name }))) return;
  log("[agent] report received: " + name);
  toast(t("report_submitted"));
}

function typeTitle() {
  const text = "./cluster_nodes";
  const el = document.getElementById("heroTitle");
  let i = 0;

  function tick() {
    if (i <= text.length) {
      const value = text.slice(0, i);
      el.innerHTML =
        value.endsWith("nodes")
          ? "./cluster_<span>nodes</span>"
          : escapeHtml(value);
      i++;
      setTimeout(tick, 55);
    }
  }
  tick();
}

function updateTime() {
  const d = Math.floor((Date.now() - lastScan()) / 1000);
  const el = document.getElementById("lastScan");
  if (!el) return;

  if (d < 5) {
    el.textContent = t("last_sweep_just_now");
  } else if (d < 60) {
    el.textContent = "last sweep: " + d + "s ago";
  } else {
    el.textContent = "last sweep: " + Math.floor(d / 60) + "m ago";
  }
}

function rescan() {
  const btn = document.getElementById("rescanBtn");
  btn.disabled = true;
  btn.textContent = t("scanning");
  log(t("rescan_triggered"));

  setTimeout(function () {
    // Simulated rescan (no real network)
    nodes().forEach(function (n) {
      if (n.status !== "online" || n.pending) return;
      n.ping = Math.max(8, Math.min(130, (n.ping || 30) + Math.floor(Math.random() * 7) - 3));
      n.uptime = Math.min(99.9, Math.max(95, +(n.uptime + (Math.random() * 0.05 - 0.025)).toFixed(1)));
    });

    render();
    updateUI();
    lastScan(Date.now());
    log(t("verification_completed"));
    btn.disabled = false;
    btn.textContent = t("rescan");
    toast(t("rescan_completed"));
  }, 1000);
}

// Expose
window.toggleTheme = toggleTheme;
window.updateThemeIcon = updateThemeIcon;
window.toggleMenu = toggleMenu;
window.closeMenu = closeMenu;
window.toggleLang = toggleLang;
window.setLang = setLang;
window.showMain = showMain;
window.showDetail = showDetail;
window.randomNode = randomNode;
window.render = render;
window.setFilter = setFilter;
window.report = report;
window.updateUI = updateUI;
window.typeTitle = typeTitle;
window.updateTime = updateTime;
window.rescan = rescan;