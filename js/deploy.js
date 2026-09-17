/* ============================================================
   DEPLOY - form + Discord Webhook
============================================================ */

// >>> BURAYA_KENDI_WEBHOOK_URL_NI_YAPIŞTIR <<<
const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1550219555547390055/TDPqP26BNStollmoZevXvvQ1UvHaDEq-rr4WdXfGMUi7jRcKIteFasEP063OOmrk2nyq";

function openDeploy() {
  document.getElementById("deployModal").classList.add("active");
  document.body.classList.add("modal-open");
}

function closeDeploy() {
  document.getElementById("deployModal").classList.remove("active");
  document.body.classList.remove("modal-open");
}

async function submit() {
  const name = document.getElementById("dName").value.trim();
  const cat = document.getElementById("dCat").value;
  const disc = document.getElementById("dDiscord").value.trim();
  const contact = document.getElementById("dContact").value.trim();
  const owner = document.getElementById("dOwner").checked;

  if (!name || !contact) {
    return toast(t("name_contact_required"));
  }

  if (!owner) {
    return toast(t("confirm_ownership"));
  }

  // Client-side duplicate check (against currently loaded nodes)
  if (nodes().some(function (n) {
    return n.name.toLowerCase() === name.toLowerCase();
  })) {
    return toast(t("already_exists"));
  }

  // Basic URL validation for discord if provided
  if (disc && !disc.startsWith("https://discord.gg/") && !disc.startsWith("https://discord.com/")) {
    // soft warning, still allow
  }

  const payload = {
    content: null,
    embeds: [
      {
        title: "🆕 New Node Submission",
        color: 0x22d3a0,
        fields: [
          { name: "Server Name", value: name, inline: true },
          { name: "Category", value: cat, inline: true },
          { name: "Contact", value: contact, inline: true },
          { name: "Discord Invite", value: disc || "_not provided_", inline: false },
          { name: "Owner Confirmed", value: "Yes ✅", inline: true },
          { name: "Submitted At", value: new Date().toISOString(), inline: true }
        ],
        footer: { text: "SRV Hub Deploy Form" },
        timestamp: new Date().toISOString()
      }
    ]
  };

  // If webhook is still placeholder, just simulate success for development
  if (!DISCORD_WEBHOOK || DISCORD_WEBHOOK === "BURAYA_YAPIŞTIR") {
    log("[agent] new submission (dev mode): " + name);
    toast(t("webhook_success"));
    closeDeploy();
    clearForm();
    return;
  }

  try {
    const res = await fetch(DISCORD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error("Webhook HTTP " + res.status);
    }

    log("[agent] new submission: " + name);
    toast(t("webhook_success"));
    closeDeploy();
    clearForm();
  } catch (err) {
    console.error("Webhook error:", err);
    log("[agent] webhook failed");
    toast(t("webhook_error"));
  }
}

function clearForm() {
  document.getElementById("dName").value = "";
  document.getElementById("dDiscord").value = "";
  document.getElementById("dContact").value = "";
  document.getElementById("dOwner").checked = false;
}

// Modal click outside
document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("deployModal");
  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeDeploy();
    });
  }
});

window.openDeploy = openDeploy;
window.closeDeploy = closeDeploy;
window.submit = submit;