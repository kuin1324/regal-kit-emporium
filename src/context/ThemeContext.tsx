import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme = "dark" | "light";

export type AccentKey = "gold" | "azure" | "emerald" | "crimson" | "violet" | "ember";

export const ACCENTS: { key: AccentKey; label: string; hue: number; sat: number; swatch: string }[] = [
  { key: "gold", label: "Gold", hue: 43, sat: 74, swatch: "hsl(43 74% 54%)" },
  { key: "azure", label: "Azure", hue: 212, sat: 82, swatch: "hsl(212 82% 55%)" },
  { key: "emerald", label: "Emerald", hue: 155, sat: 58, swatch: "hsl(155 58% 45%)" },
  { key: "crimson", label: "Crimson", hue: 352, sat: 72, swatch: "hsl(352 72% 52%)" },
  { key: "violet", label: "Violet", hue: 265, sat: 68, swatch: "hsl(265 68% 60%)" },
  { key: "ember", label: "Ember", hue: 22, sat: 88, swatch: "hsl(22 88% 55%)" },
];

interface ThemeCtx {
  theme: Theme;
  toggleTheme: () => void;
  accent: AccentKey;
  setAccent: (a: AccentKey) => void;
}

const ThemeContext = createContext<ThemeCtx>({
  theme: "dark",
  toggleTheme: () => {},
  accent: "gold",
  setAccent: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("theme") as Theme;
    return saved || "dark";
  });
  const [accent, setAccentState] = useState<AccentKey>(() => {
    const saved = localStorage.getItem("accent") as AccentKey;
    return ACCENTS.some((a) => a.key === saved) ? saved : "gold";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const a = ACCENTS.find((x) => x.key === accent) ?? ACCENTS[0];
    const base = theme === "light" ? 49 : 54;
    const light = theme === "light" ? 62 : 68;
    const dark = theme === "light" ? 35 : 38;
    const s = document.documentElement.style;
    const core = `${a.hue} ${a.sat}%`;
    s.setProperty("--primary", `${core} ${base}%`);
    s.setProperty("--accent", `${core} ${base}%`);
    s.setProperty("--ring", `${core} ${base}%`);
    s.setProperty("--gold", `${core} ${base}%`);
    s.setProperty("--gold-light", `${core} ${light}%`);
    s.setProperty("--gold-dark", `${core} ${dark}%`);
    s.setProperty("--gold-gradient", `linear-gradient(135deg, hsl(${core} ${base}%), hsl(${core} ${light}%))`);
    s.setProperty("--shadow-gold", `0 4px 30px -8px hsl(${core} ${base}% / ${theme === "light" ? 0.2 : 0.15})`);
    s.setProperty(
      "--hero-gradient",
      theme === "light"
        ? `linear-gradient(135deg, hsl(0 0% 98%) 0%, hsl(0 0% 94%) 50%, hsl(${a.hue} 20% 95%) 100%)`
        : `linear-gradient(135deg, hsl(0 0% 4%) 0%, hsl(0 0% 8%) 50%, hsl(${a.hue} 20% 8%) 100%)`,
    );
    localStorage.setItem("accent", accent);
  }, [accent, theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, accent, setAccent: setAccentState }}>
      {children}
    </ThemeContext.Provider>
  );
};
