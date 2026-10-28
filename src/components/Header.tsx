import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../App";
import { SEASONS, ORDER } from "../seasons";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#work", label: "Work" },
  { href: "#journey", label: "Journey" },
  { href: "#contact", label: "Contact" }
];

function SeasonSwitch({ compact = false }: { compact?: boolean }) {
  const { mode, setMode } = useApp();
  return (
    <div className={`switch${compact ? " switch-compact" : ""}`} role="group" aria-label="Season theme">
      <button
        data-mode="auto"
        aria-pressed={mode === "auto"}
        title="Auto — follow your location's season"
        aria-label="Auto season (follows your location)"
        onClick={() => setMode("auto")}
      ><span className="ico">⌖</span></button>
      {ORDER.map((id) => (
        <button
          key={id}
          data-mode={id}
          aria-pressed={mode === id}
          title={`${SEASONS[id].name} (${SEASONS[id].hindi})`}
          aria-label={`Switch to ${SEASONS[id].name}`}
          onClick={() => setMode(id)}
        ><span className="ico">{SEASONS[id].emoji}</span></button>
      ))}
    </div>
  );
}

export default function Header() {
  const { theme, toggleTheme } = useApp();
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container">
        <div className="nav-inner glass">
          <a href="#top" className="logo">
            <span className="logo-dot" />
            <span>harshu</span>
            <span className="logo-dash accent">–</span>
            <span>portfolio</span>
          </a>
          <nav className="nav-links" aria-label="Main">
            {LINKS.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
          </nav>
          <div className="nav-right">
            <SeasonSwitch compact />
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
              title={theme === "light" ? "Dark mode" : "Light mode"}
            >
              {theme === "light" ? "☾" : "☀"}
            </button>
            <a href="#contact" className="btn-primary nav-cta">Let's talk</a>
            <button
              className={`burger${open ? " open" : ""}`}
              aria-label="Menu"
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
            ><span /></button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              className="mobile-panel glass"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <nav aria-label="Mobile" onClick={() => setOpen(false)}>
                {LINKS.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
              </nav>
              <p className="panel-label">Season theme</p>
              <SeasonSwitch />
              <p className="panel-label">Appearance</p>
              <button className="theme-toggle panel-theme" onClick={toggleTheme} aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}>
                {theme === "light" ? "☾" : "☀"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
