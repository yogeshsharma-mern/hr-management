import React from "react";

const themes = [
  { id: "light", label: "Light", preview: "#2563eb" },
  { id: "dark", label: "Dark", preview: "#38bdf8" },
  { id: "midnight", label: "Midnight", preview: "#60a5fa" },
  { id: "aurora", label: "Aurora", preview: "#a78bfa" },
  { id: "frost", label: "Frost", preview: "#0ea5e9" },
];

export default function ThemeSetting() {
  const applyTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  };

  return (
    <div className="p-6">
      <h2 style={{ color: "var(--text-primary)", marginBottom: 20 }}>
        Appearance
      </h2>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {themes.map((t) => (
          <div
            key={t.id}
            onClick={() => applyTheme(t.id)}
            style={{
              cursor: "pointer",
              padding: 16,
              width: 140,
              borderRadius: 14,
              background: "var(--box-color)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
            }}
          >
            <div
              style={{
                height: 60,
                borderRadius: 10,
                background: `linear-gradient(135deg, ${t.preview}, transparent)`,
                marginBottom: 10,
              }}
            />
            {t.label}
          </div>
        ))}
      </div>
    </div>
  );
}
