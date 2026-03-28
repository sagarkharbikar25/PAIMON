/* =============================================
   navigation_drawer.js — Pravas Dashboard Page Scripts
   ============================================= */

/* ── Tailwind Config ── */
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "surface":                      "#f6fafe",
        "secondary-fixed-dim":          "#afcbd8",
        "outline-variant":              "#c3c6d5",
        "on-secondary-container":       "#4e6874",
        "surface-tint":                 "#2559bd",
        "surface-container":            "#eaeef2",
        "on-surface-variant":           "#434653",
        "background":                   "#f6fafe",
        "surface-container-high":       "#e4e9ed",
        "inverse-on-surface":           "#edf1f5",
        "surface-bright":               "#f6fafe",
        "on-primary-fixed":             "#001946",
        "on-background":                "#171c1f",
        "secondary-container":          "#cbe7f5",
        "on-surface":                   "#171c1f",
        "surface-dim":                  "#d6dade",
        "on-tertiary-fixed":            "#341100",
        "on-primary-container":         "#a5bdff",
        "tertiary-fixed-dim":           "#ffb692",
        "surface-container-lowest":     "#ffffff",
        "surface-container-low":        "#f0f4f8",
        "on-secondary":                 "#ffffff",
        "secondary-fixed":              "#cbe7f5",
        "on-primary":                   "#ffffff",
        "error-container":              "#ffdad6",
        "secondary":                    "#48626e",
        "on-primary-fixed-variant":     "#00419e",
        "primary-fixed":                "#dae2ff",
        "on-tertiary-container":        "#ffaa80",
        "error":                        "#ba1a1a",
        "on-secondary-fixed-variant":   "#304a55",
        "on-secondary-fixed":           "#021f29",
        "on-tertiary":                  "#ffffff",
        "inverse-primary":              "#b1c5ff",
        "tertiary-container":           "#843500",
        "tertiary":                     "#602400",
        "on-error":                     "#ffffff",
        "outline":                      "#737784",
        "surface-container-highest":    "#dfe3e7",
        "on-tertiary-fixed-variant":    "#7a3000",
        "primary-fixed-dim":            "#b1c5ff",
        "inverse-surface":              "#2c3134",
        "on-error-container":           "#93000a",
        "primary-container":            "#0047ab",
        "tertiary-fixed":               "#ffdbcb",
        "primary":                      "#00327d",
        "surface-variant":              "#dfe3e7"
      },
      fontFamily: {
        "headline": ["Plus Jakarta Sans"],
        "body":     ["Inter"],
        "label":    ["Inter"]
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg":      "1rem",
        "xl":      "1.5rem",
        "full":    "9999px"
      }
    }
  }
};

/* ── Drawer Toggle ── */
function toggleDrawer() {
  const drawer = document.getElementById("navDrawer");
  drawer.classList.toggle("drawer-hidden");
}