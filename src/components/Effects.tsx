import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useMotionValue } from "framer-motion";
import type { ParticleKind } from "../seasons";

/* ------------------------------ Reveal ---------------------------------- */
export function Reveal({
  children, delay = 0, className = "", y = 56
}: { children: React.ReactNode; delay?: number; className?: string; y?: number }) {
  const reduce = useRef(
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ).current;
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------ Magnetic -------------------------------- */
export function Magnetic({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width / 2) * 0.25;
    const dy = (e.clientY - r.top - r.height / 2) * 0.25;
    el.style.transform = `translate(${dx}px, ${dy}px)`;
  };
  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "translate(0,0)";
  };
  return (
    <div
      ref={ref}
      className="magnetic"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </div>
  );
}

/* ------------------------------ TiltCard -------------------------------- */
export function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.transform =
      `perspective(900px) rotateX(${((0.5 - py) * 7).toFixed(2)}deg) rotateY(${((px - 0.5) * 7).toFixed(2)}deg)`;
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
  };
  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
  };
  return (
    <div ref={ref} className={`tilt ${className}`} onPointerMove={onMove} onPointerLeave={onLeave}>
      {children}
    </div>
  );
}

/* --------------------------- ScrollProgress ----------------------------- */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 });
  return (
    <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />
  );
}

/* ------------------------------ CursorGlow ------------------------------ */
export function CursorGlow() {
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const sx = useSpring(x, { stiffness: 260, damping: 28 });
  const sy = useSpring(y, { stiffness: 260, damping: 28 });
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    const move = (e: PointerEvent) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);
  if (!enabled) return null;
  return (
    <motion.div
      className="cursor-glow"
      style={{ x: sx, y: sy }}
      aria-hidden="true"
    />
  );
}

/* ---------------------------- AuroraBackground -------------------------- */
/**
 * Animated graphics background (no photos):
 *  - nature feel: drifting aurora mist + twinkling stars
 *  - graphics: slowly panning grid, spinning dashed orbit rings,
 *    floating shapes — all infinite CSS loops, cheap to render
 */
export function AuroraBackground() {
  return (
    <div className="aurora" aria-hidden="true">
      <div className="aurora-blob b1" />
      <div className="aurora-blob b2" />
      <div className="aurora-blob b3" />
      <div className="bg-grid" />
      <div className="bg-orbit o1" />
      <div className="bg-orbit o2" />
      <div className="bg-orbit o3" />
      <div className="bg-shape s1" />
      <div className="bg-shape s2 ring" />
      <div className="bg-shape s3" />
      <div className="bg-shape s4 ring" />
      <div className="bg-shape s5" />
      <div className="bg-shape s6 ring" />
      <div className="bg-stars">
        {Array.from({ length: 26 }, (_, i) => (
          <i
            key={i}
            className="bg-star"
            style={{
              left: `${(i * 37 + 4) % 100}%`,
              top: `${(i * 53 + 6) % 100}%`,
              animationDelay: `${(i % 9) * 0.55}s`
            }}
          />
        ))}
      </div>
      <i className="bg-shoot a" />
      <i className="bg-shoot b" />
    </div>
  );
}

/* ------------------------------ NoiseOverlay ---------------------------- */
export function NoiseOverlay() {
  return (
    <div
      className="grain"
      aria-hidden="true"
    />
  );
}

/* ----------------------------- SeasonParticles --------------------------- */
export function SeasonParticles({ kind, accent }: { kind: ParticleKind; accent: string }) {
  const [html, setHtml] = useState("");
  const reduce = typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (reduce) { setHtml(""); return; }
    const isMobile = window.innerWidth < 640;
    /* lighter particle counts — no jank on phones */
    const count = kind === "rain" ? (isMobile ? 24 : 48) : (isMobile ? 12 : 24);
    let out = "";
    for (let i = 0; i < count; i++) {
      const dur =
        kind === "rain" ? 0.9 + Math.random() * 0.9 :
        kind === "snow" ? 9 + Math.random() * 9 :
        kind === "mote" ? 11 + Math.random() * 10 :
        8 + Math.random() * 9;
      const delay = -Math.random() * dur;
      const sway = 2.4 + Math.random() * 3.5;
      const op = (0.25 + Math.random() * 0.5).toFixed(2);
      const size = kind === "rain" ? 40 + Math.random() * 26 : 2.5 + Math.random() * 3.5;
      const left = (Math.random() * 100).toFixed(2);
      let inner: string;
      if (kind === "rain") {
        inner = `<span style="display:block;width:1.5px;height:${size}px;border-radius:99px;background:linear-gradient(to bottom,transparent,color-mix(in srgb,${accent} 55%,transparent));opacity:.5"></span>`;
      } else if (kind === "snow") {
        inner = `<span style="display:block;animation:p-sway ${sway}s ease-in-out ${delay}s infinite alternate"><span style="display:block;width:${size}px;height:${size}px;border-radius:99px;background:#fff;box-shadow:0 0 6px rgba(255,255,255,.9)"></span></span>`;
      } else if (kind === "mote") {
        const d = (size * 0.9).toFixed(1);
        inner = `<span style="display:block;animation:p-sway ${sway}s ease-in-out ${delay}s infinite alternate"><span style="display:block;width:${d}px;height:${d}px;border-radius:99px;background:radial-gradient(circle,#fff 0%,${accent} 60%);box-shadow:0 0 10px 2px color-mix(in srgb,${accent} 45%,transparent)"></span></span>`;
      } else {
        inner = `<span style="display:block;animation:p-sway ${sway}s ease-in-out ${delay}s infinite alternate"><span style="display:block;width:9px;height:6.5px;border-radius:100% 4px 100% 4px;background:linear-gradient(130deg,color-mix(in srgb,${accent} 85%,white),var(--accent-soft));opacity:.85;transform:rotate(${Math.round(Math.random() * 360)}deg)"></span></span>`;
      }
      out += `<span style="left:${left}%;--po:${op};animation:${kind === "mote" ? "p-rise" : "p-fall"} ${dur.toFixed(2)}s linear ${delay.toFixed(2)}s infinite">${inner}</span>`;
    }
    setHtml(out);
  }, [kind, accent, reduce]);

  if (reduce) return null;
  return (
    <div className="particles" key={kind} aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: html }} />
  );
}

/* ----------------------------- CardMarquee ------------------------------ */
const MQ_ICONS = ["✦", "⌘", "❂", "◎", "✎", "➤", "◈", "❖"];

/**
 * Infinite scrolling cards — two rows, opposite directions, pause on hover.
 * Pure CSS transform animation: no JS per frame, cheap on phones.
 */
export function Marquee({ items }: { items: string[] }) {
  const cards = [...items, ...items];
  const track = (reverse: boolean) => (
    <div className="marquee-row">
      <div className={`marquee-track${reverse ? " reverse" : ""}`}>
        {cards.map((it, i) => (
          <span className="mq-card" key={i}>
            <em>{MQ_ICONS[i % MQ_ICONS.length]}</em> {it}
          </span>
        ))}
      </div>
    </div>
  );
  return (
    <div className="marquee" aria-hidden="true">
      {track(false)}
      {track(true)}
    </div>
  );
}
