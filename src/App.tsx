import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { SEASONS, Season, SeasonId, PRIMARY } from "./seasons";
import { resolveAutoSeason } from "./autoTheme";
import Header from "./components/Header";
import {
  AuroraBackground, SeasonParticles, NoiseOverlay,
  ScrollProgress, CursorGlow
} from "./components/Effects";
import {
  Hero, About, Skills, Work, Journey, Contact, Footer, Toast
} from "./components/Sections";

export type SeasonMode = "auto" | SeasonId;
type Theme = "light" | "dark";

interface AppState {
  season: Season;
  mode: SeasonMode;
  setMode: (m: SeasonMode) => void;
  theme: Theme;
  toggleTheme: () => void;
  toast: { season: Season; manual: boolean } | null;
}

const Ctx = createContext<AppState | null>(null);
export function useApp(): AppState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp outside provider");
  return ctx;
}

export default function App() {
  const [mode, setModeRaw] = useState<SeasonMode>("auto");
  const [autoSeasonId, setAutoSeasonId] = useState<SeasonId>(PRIMARY);
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem("harshu-theme");
      if (saved === "dark" || saved === "light") return saved;
    } catch (e) { /* private mode */ }
    return "light";
  });
  const [toast, setToast] = useState<AppState["toast"]>(null);
  const toastTimer = useRef<number | null>(null);

  /* background location scan — starts on primary, upgrades if the visitor is in India */
  useEffect(() => {
    let alive = true;
    resolveAutoSeason().then((id) => {
      if (alive && id !== PRIMARY) setAutoSeasonId(id);
    });
    return () => { alive = false; };
  }, []);

  const season = SEASONS[mode === "auto" ? autoSeasonId : mode];

  const setMode = (m: SeasonMode) => {
    setModeRaw(m);
    const s = SEASONS[m === "auto" ? autoSeasonId : (m as SeasonId)];
    setToast({ season: s, manual: m !== "auto" });
  };

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  /* push season + theme into CSS variables */
  useEffect(() => {
    const rs = document.documentElement.style;
    rs.setProperty("--accent", season.accent);
    rs.setProperty("--accent-soft", season.soft);
    rs.setProperty("--accent-deep", season.deep);
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("harshu-theme", theme); } catch (e) {}
  }, [season, theme]);

  /* toast auto-hide */
  useEffect(() => {
    if (!toast) return;
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 3400);
    return () => { if (toastTimer.current) window.clearTimeout(toastTimer.current); };
  }, [toast]);

  const value: AppState = { season, mode, setMode, theme, toggleTheme, toast };

  return (
    <Ctx.Provider value={value}>
      <AuroraBackground />
      <SeasonParticles kind={season.particle} accent={season.accent} />
      <NoiseOverlay />
      <ScrollProgress />
      <CursorGlow />
      <Header />
      <main className="site-main">
        <Hero />
        <About />
        <Skills />
        <Work />
        <Journey />
        <Contact />
      </main>
      <Footer />
      <Toast toast={toast} mode={mode} />
    </Ctx.Provider>
  );
}
