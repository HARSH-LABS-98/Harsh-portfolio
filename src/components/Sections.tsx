import React, { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useApp } from "../App";
import { Reveal, TiltCard, Magnetic, Marquee } from "./Effects";
import { Orbital } from "./Orbital";
import type { SeasonMode } from "../App";
import type { Season } from "../seasons";

/* --------------------------------- HERO ---------------------------------- */
export function Hero() {
  const { season } = useApp();
  /* the big word: letters spring in one by one, then float forever;
     the whole word parallaxes away as you scroll */
  const { scrollY } = useScroll();
  const bigY = useTransform(scrollY, [0, 700], [0, 140]);
  const bigFade = useTransform(scrollY, [0, 520], [1, 0]);
  const WORD = "PORTFOLIO".split("");
  /* slide-in stagger for the hero copy */
  const copyVar: any = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } };
  const itemVar: any = {
    hidden: { opacity: 0, y: 44, x: -30 },
    show: { opacity: 1, y: 0, x: 0, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] } }
  };
  return (
    <section className="hero" id="top">
      <motion.div className="hero-bigword" style={{ y: bigY, opacity: bigFade }} aria-hidden="true">
        {WORD.map((ch, i) => (
          <motion.span
            key={i}
            initial={{ y: 80, opacity: 0, rotate: 10 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            transition={{ delay: 0.35 + i * 0.07, type: "spring", stiffness: 130, damping: 16 }}
          >
            <span className="bw-f" style={{ animationDelay: `${i * 0.45}s` }}>{ch}</span>
          </motion.span>
        ))}
      </motion.div>
      <div className="container hero-grid">
        <motion.div className="hero-copy" variants={copyVar} initial="hidden" animate="show">
          <motion.div variants={itemVar}><p className="eyebrow">Harshu · Portfolio · 2026</p></motion.div>
          <motion.div variants={itemVar}>
            <h1>
              Designing calm.<br />
              <span className="serif accent">Building bold.</span>
            </h1>
          </motion.div>
          <motion.div variants={itemVar}>
            <p className="lead">
              I'm <b>Harshu</b> — a student designer-developer from India, exploring
              health, wealth and financial independence while building products along
              the way. This interface is currently wearing{" "}
              <b className="accent-deep-text">{season.name.toLowerCase()}</b>, just like
              the country outside.
            </p>
          </motion.div>
          <motion.div variants={itemVar}>
            <div className="hero-ctas">
              <Magnetic><a href="#work" className="btn-primary">Explore work →</a></Magnetic>
              <Magnetic><a href="#contact" className="btn-ghost">Say hello</a></Magnetic>
            </div>
          </motion.div>
          <motion.div variants={itemVar}>
            <div className="hero-chips">
              <span className="chip glass"><em>✦</em> UI/UX + Product</span>
              <span className="chip glass"><em>⌘</em> React · TypeScript</span>
              <span className="chip glass"><em>❂</em> Three.js / R3F</span>
            </div>
          </motion.div>
          <motion.div variants={itemVar}>
            <div className="hero-stats">
              <div><b>10+</b><span>projects shipped</span></div>
              <div><b>4</b><span>seasons, one UI</span></div>
              <div><b>∞</b><span>curiosity</span></div>
            </div>
          </motion.div>
        </motion.div>
        <motion.div
          className="hero-scene-wrap"
          initial={{ opacity: 0, scale: 0.92, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="hero-scene">
            <Orbital />
            <div className="hero-badge glass">
              <em>{season.emoji}</em> Now in India: <b>{season.name} · {season.hindi}</b>
            </div>
          </div>
        </motion.div>
      </div>
      <Marquee
        items={[
          "Product Design", "React", "TypeScript", "Three.js / R3F",
          "Design Systems", "Framer Motion", "Glassmorphism", "Season-aware UI"
        ]}
      />
    </section>
  );
}

/* --------------------------------- ABOUT --------------------------------- */
export function About() {
  return (
    <section className="block" id="about">
      <div className="container">
        <Reveal><p className="eyebrow">About</p></Reveal>
        <Reveal delay={0.06}>
          <h2>The journey, <span className="serif accent">not the trophy.</span></h2>
        </Reveal>
        <div className="block-body about-grid">
          <Reveal delay={0.1}>
            <TiltCard className="card glass about-main">
              <p>
                I'm Harshu — a student of design and code from India. I spend my days at
                the intersection of <b>health</b>, <b>wealth</b> and{" "}
                <b>financial independence</b>: learning how bodies work, how money
                compounds, and how products get built.
              </p>
              <p>
                This portfolio frames the journey — not a finished career. Every project
                here is one season of it. Some shipped, some broke, all of them taught me
                something. I like quiet interfaces, loud ideas, and the patience of
                compounding.
              </p>
              <div className="values">
                <span className="value">Curiosity</span>
                <span className="value">Craft</span>
                <span className="value">Consistency</span>
                <span className="value">Courage</span>
              </div>
            </TiltCard>
          </Reveal>
          <div className="about-side">
            <Reveal delay={0.18}>
              <TiltCard className="side-card glass">
                <div className="icon-tile">◎</div>
                <h3>Right now</h3>
                <p>Building Ai-studio, studying money like a syllabus, and training like the body is also a product.</p>
              </TiltCard>
            </Reveal>
            <Reveal delay={0.24}>
              <TiltCard className="side-card glass">
                <div className="icon-tile">❂</div>
                <h3>This site</h3>
                <p>Its UI adapts to India's seasons — colours, light, weather and all. Try the switcher in the header, or the dark mode toggle.</p>
              </TiltCard>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- SKILLS --------------------------------- */
const SKILLS = [
  { icon: "✎", title: "Product & UI/UX Design", desc: "Interfaces that feel quiet and inevitable — PRDs, design systems, glassmorphism, 3D composition.", tags: ["UI/UX", "Design Systems", "Prototyping", "PRDs"] },
  { icon: "⌘", title: "Frontend Engineering", desc: "Pixel-true builds with modern React, typed end-to-end and animated with intent.", tags: ["React", "TypeScript", "Vite", "Framer Motion"] },
  { icon: "◎", title: "3D & Motion", desc: "Scenes with React Three Fiber — lighting, materials, springs and scroll-driven stories.", tags: ["Three.js", "R3F", "drei", "GSAP"] },
  { icon: "➤", title: "Building in Public", desc: "Turning curiosity into shipped things — content, experiments and small businesses.", tags: ["Storytelling", "Content", "Experiments", "Community"] }
];

export function Skills() {
  return (
    <section className="block" id="skills">
      <div className="container">
        <Reveal><p className="eyebrow">Skills</p></Reveal>
        <Reveal delay={0.06}>
          <h2>A quiet toolkit, <span className="serif accent">sharpened daily.</span></h2>
        </Reveal>
        <div className="block-body grid-skills">
          {SKILLS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08}>
              <TiltCard className="skill-card glass">
                <div className="icon-tile">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <div className="tags">{s.tags.map((t) => <span key={t}>{t}</span>)}</div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- WORK ---------------------------------- */
const WORK = [
  {
    glyph: "✦", title: "Ai-studio", year: "2025",
    desc: "An AI playground for designing, testing and shipping prompts & agents — where my design and code obsessions first collided.",
    tags: ["React", "AI", "Open Source"],
    link: "https://github.com/HARSH-LABS-98", linkLabel: "View on GitHub"
  },
  {
    glyph: "❫", title: "FinFit", year: "2026",
    desc: "Money, but for students — budgeting, first-investment basics and a financial-independence tracker that doesn't shame you.",
    tags: ["Product Design", "Figma", "Finance"],
    link: "#contact", linkLabel: "Case study soon"
  },
  {
    glyph: "❂", title: "Ritu UI", year: "2026",
    desc: "The season-aware design system powering this very site — one glass interface that dresses for India's four seasons, in light and dark.",
    tags: ["Design System", "React", "R3F"],
    link: "#top", linkLabel: "Explore it here"
  }
];

export function Work() {
  return (
    <section className="block" id="work">
      <div className="container">
        <Reveal><p className="eyebrow">Selected work</p></Reveal>
        <Reveal delay={0.06}>
          <h2>Things I've built, <span className="serif accent">things I'm building.</span></h2>
        </Reveal>
        <div className="block-body grid-work">
          {WORK.map((w, i) => (
            <Reveal key={w.title} delay={i * 0.1}>
              <TiltCard className="project-card glass">
                <div className="thumb"><span className="b1" /><span className="b2" /><span className="glyph">{w.glyph}</span></div>
                <div className="project-body">
                  <div className="project-head"><h3>{w.title}</h3><span className="project-year">{w.year}</span></div>
                  <p>{w.desc}</p>
                  <div className="project-tags">{w.tags.map((t) => <span key={t}>{t}</span>)}</div>
                  <a className="project-link" href={w.link} target={w.link.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                    {w.linkLabel} <span className="arrow">↗</span>
                  </a>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- JOURNEY -------------------------------- */
const TIMELINE = [
  { year: "2024", title: "The spark", desc: "Fell for design systems, glass UI and 3D on the web. Started sketching interfaces before sleeping.", muted: false },
  { year: "2025", title: "Deep work", desc: "Went down the health–wealth–FI rabbit hole. Shipped Ai-studio, broke a few builds, learned in public.", muted: false },
  { year: "2026", title: "Going public", desc: "This portfolio — season-aware UI, real 3D scenes, and small businesses slowly taking shape.", muted: false },
  { year: "NEXT", title: "The horizon", desc: "Building things that outlive seasons — and taking you along for the ride.", muted: true }
];

export function Journey() {
  return (
    <section className="block" id="journey">
      <div className="container">
        <Reveal><p className="eyebrow">Journey</p></Reveal>
        <Reveal delay={0.06}>
          <h2>So far, <span className="serif accent">and what's next.</span></h2>
        </Reveal>
        <div className="block-body timeline">
          {TIMELINE.map((t, i) => (
            <Reveal key={t.year} delay={i * 0.08} className={`t-item${t.muted ? " muted" : ""}`}>
              <span className="t-dot" />
              <p className="t-year">{t.year}</p>
              <h3>{t.title}</h3>
              <p>{t.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- CONTACT -------------------------------- */
export function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <section className="block" id="contact">
      <div className="container">
        <Reveal><p className="eyebrow">Contact</p></Reveal>
        <Reveal delay={0.06}>
          <h2>The inbox is <span className="serif accent">a friendly place.</span></h2>
        </Reveal>
        <div className="block-body grid-contact">
          <Reveal delay={0.1}>
            <div className="card glass contact-pitch">
              <p>Have an idea, a role, or just want to talk seasons, design or money? Write to me — I reply faster than the monsoon arrives.</p>
              <div className="contact-links">
                <a href="https://github.com/HARSH-LABS-98" target="_blank" rel="noreferrer"><span className="round">⌘</span><span className="lbl">github.com/HARSH-LABS-98</span><span className="out">↗</span></a>
                <a href="mailto:hello@harshu.design"><span className="round">✉</span><span className="lbl">hello@harshu.design</span><span className="out">↗</span></a>
              </div>
              <p className="contact-note">Currently accepting collaborations, internships and good conversations.</p>
            </div>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="card glass">
              {sent ? (
                <div className="form-success show">
                  <div className="big">✦</div>
                  <h3>Message received!</h3>
                  <p>Thanks for reaching out. This demo form doesn't send yet — the real inbox lands soon. Meanwhile, ping me on GitHub.</p>
                  <button className="btn-ghost" style={{ marginTop: 24 }} onClick={() => setSent(false)}>Send another</button>
                </div>
              ) : (
                <form
                  className="contact-form"
                  onSubmit={(e) => { e.preventDefault(); setSent(true); }}
                >
                  <div className="field-row">
                    <div><label htmlFor="name">Name</label><input id="name" name="name" required placeholder="Your name" /></div>
                    <div><label htmlFor="email">Email</label><input id="email" name="email" type="email" required placeholder="you@example.com" /></div>
                  </div>
                  <div><label htmlFor="message">Message</label><textarea id="message" name="message" rows={5} required placeholder="What's on your mind?" /></div>
                  <button type="submit" className="btn-primary form-submit">Send message →</button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- FOOTER --------------------------------- */
export function Footer() {
  const { season } = useApp();
  return (
    <footer>
      <div className="container footer-inner">
        <p>© 2026 Harshu — designed in every Indian season.</p>
        <p className="footer-season"><em>{season.emoji}</em> Currently wearing: <b>{season.name} ({season.hindi})</b> · <span className="ver">v5.2</span></p>
        <a href="https://github.com/HARSH-LABS-98" target="_blank" rel="noreferrer">HARSH-LABS-98 ↗</a>
      </div>
    </footer>
  );
}

/* --------------------------------- TOAST --------------------------------- */
export function Toast({ toast, mode }: { toast: { season: Season; manual: boolean } | null; mode: SeasonMode }) {
  if (!toast) return null;
  return (
    <div className="toast glass show" role="status" aria-live="polite">
      <span className="round">{toast.season.emoji}</span>
      <div>
        <b>
          {toast.season.name} · {toast.season.hindi}
          <small>{mode === "auto" ? "auto" : "manual"}</small>
        </b>
        <span>{toast.season.tagline}</span>
      </div>
    </div>
  );
}
