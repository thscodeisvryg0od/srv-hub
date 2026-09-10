# SRV Hub

**SRV // Core Hub — Server Routing & Network Cluster Web Interface**

SRV Hub is a lightweight server discovery and routing hub designed to list,
monitor, verify, and provide quick access to multiplayer game servers and
network nodes.

The interface provides a centralized view of available nodes, their status,
latency, uptime, verification state, and related community links.

---

## ✦ Features

- **Server Discovery**
  - Browse available game servers and network nodes
  - View server type, latency, uptime, and current status

- **Verified Nodes**
  - Verified servers are clearly marked
  - Verification information is available through an accessible tooltip

- **Server Status**
  - Online/offline state
  - Latency information
  - Uptime information
  - Last scan information

- **Featured Servers**
  - Highlight important or recommended nodes

- **Quick Actions**
  - Open the server website
  - Open the associated Discord/community
  - Report a server or node

- **Filtering**
  - Filter servers by category
  - Filter by status and other available properties

- **Responsive Interface**
  - Optimized for desktop, tablet, and mobile devices
  - Mobile navigation support
  - Responsive tooltips and dialogs

- **Accessibility**
  - Keyboard navigation
  - Visible focus states
  - Accessible buttons and links
  - Screen-reader friendly labels
  - `Escape` support for menus and dialogs
  - Reduced-motion support

- **Internationalization**
  - Translatable interface
  - Language-specific UI strings
  - No hardcoded user-facing translations where possible

---

## ◈ Interface

SRV Hub uses a dark, terminal-inspired interface focused on network
monitoring and server discovery.

The visual language combines:

- Terminal / CLI aesthetics
- Monospace typography
- Network-grid backgrounds
- Status indicators
- Minimal cards
- Neon-inspired accents
- Responsive layouts

---

## ⚙️ Server Information

Each server/node can provide information such as:

| Property | Description |
| --- | --- |
| Name | Server or node hostname |
| Category | Game or service category |
| Status | Current availability |
| Latency | Network response time |
| Uptime | Reported availability |
| Verification | Whether the node has been verified |
| Website | Main server website |
| Discord | Community/server link |

---

## 🔐 Verification

A verified node indicates that the server has been manually reviewed by
SRV Hub.

Verification does not necessarily guarantee permanent availability or
performance. Server information may change over time and should be
considered a snapshot of the latest available status.

---

## 📱 Mobile Support

The interface is designed to remain usable on small screens.

Responsive behavior includes:

- Collapsible navigation
- Flexible server cards
- Mobile-friendly buttons
- Viewport-safe tooltips
- Responsive dialogs
- Touch-friendly controls
- No intentional horizontal overflow

---

## ♿ Accessibility

SRV Hub aims to follow modern accessibility practices.

The interface includes:

- Semantic HTML where appropriate
- Keyboard-accessible controls
- Visible focus indicators
- Accessible names for interactive elements
- ARIA attributes where required
- Keyboard-accessible tooltips
- `Escape` handling for dismissible UI
- Reduced-motion support through `prefers-reduced-motion`
- Sufficient text/background contrast
- Touch-friendly interaction targets

Accessibility improvements should not change the core visual identity of
the interface.

---

## 🧩 Project Structure

A typical deployment can be structured as:

```text
srv-hub/
├── index.html
├── assets/
│   ├── css/
│   ├── js/
│   └── images/
└── README.md