/* =============================================
   notification_pop_up.js — Pravas Notification Popup Scripts
   ============================================= */

/* ── Tailwind Config ── */
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "error-container":              "#ffdad6",
        "tertiary-fixed":               "#ffdbcb",
        "secondary-container":          "#cbe7f5",
        "primary":                      "#00327d",
        "on-primary-container":         "#a5bdff",
        "tertiary-fixed-dim":           "#ffb692",
        "on-secondary-container":       "#4e6874",
        "error":                        "#ba1a1a",
        "primary-fixed":                "#dae2ff",
        "inverse-surface":              "#2c3134",
        "surface-container-high":       "#e4e9ed",
        "secondary-fixed":              "#cbe7f5",
        "surface-container":            "#eaeef2",
        "on-primary-fixed":             "#001946",
        "on-tertiary-fixed-variant":    "#7a3000",
        "on-tertiary":                  "#ffffff",
        "on-tertiary-container":        "#ffaa80",
        "primary-container":            "#0047ab",
        "on-primary":                   "#ffffff",
        "on-surface":                   "#171c1f",
        "inverse-on-surface":           "#edf1f5",
        "background":                   "#f6fafe",
        "surface-tint":                 "#2559bd",
        "surface-container-highest":    "#dfe3e7",
        "secondary-fixed-dim":          "#afcbd8",
        "on-surface-variant":           "#434653",
        "outline":                      "#737784",
        "on-secondary-fixed":           "#021f29",
        "primary-fixed-dim":            "#b1c5ff",
        "outline-variant":              "#c3c6d5",
        "surface-variant":              "#dfe3e7",
        "surface-container-low":        "#f0f4f8",
        "on-error-container":           "#93000a",
        "surface-dim":                  "#d6dade",
        "surface":                      "#f6fafe",
        "on-tertiary-fixed":            "#341100",
        "on-primary-fixed-variant":     "#00419e",
        "inverse-primary":              "#b1c5ff",
        "on-background":                "#171c1f",
        "surface-bright":               "#f6fafe",
        "secondary":                    "#48626e",
        "tertiary-container":           "#843500",
        "tertiary":                     "#602400",
        "on-error":                     "#ffffff",
        "on-secondary-fixed-variant":   "#304a55",
        "surface-container-lowest":     "#ffffff",
        "on-secondary":                 "#ffffff"
      },
      fontFamily: {
        "headline": ["Plus Jakarta Sans"],
        "body":     ["Inter"],
        "label":    ["Inter"]
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg":      "0.5rem",
        "xl":      "0.75rem",
        "full":    "9999px"
      }
    }
  }
};

/* ── Close notification dropdown ── */
function closeNotifications() {
  const dropdown = document.getElementById("notificationDropdown");
  if (dropdown) dropdown.classList.add("hidden");
}

/* ── Mark all notifications as read ── */
function markAllRead() {
  const unreadItems = document.querySelectorAll("#notificationDropdown .unread-dot");
  unreadItems.forEach(dot => dot.remove());

  const btn = document.querySelector("[onclick='markAllRead()']");
  if (btn) {
    btn.textContent = "All caught up ✓";
    btn.disabled = true;
    btn.classList.add("opacity-50", "cursor-default");
  }
}