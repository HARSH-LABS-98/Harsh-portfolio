import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
} from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, Lightformer, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import {
  IconSunCloud,
  IconRaindrops,
  IconLeaf,
  IconMoonCloudSnow,
  IconSparkle,
  IconArrowUpRight,
  IconArrowRight,
  IconMenu,
  IconPencil,
  IconCode,
  IconTarget,
  IconRocket,
  IconChart,
  IconGlobe,
} from "nucleo-sharp";

/* ---------------------------------- theme ---------------------------------- */

type SeasonId = "winter" | "summer" | "monsoon" | "autumn";
type Mode = SeasonId | "auto";

type SeasonCfg = {
  id: SeasonId;
  name: string;
  hindi: string;
  accent: string;
  accentSoft: string;
  deep: string;
  icon: React.ComponentType;
  particle: "snow" | "mote" | "rain" | "petal";
  tagline: string;
};

const SEASONS: Record<SeasonId, SeasonCfg> = {
  winter: {
    id: "winter",
    name: "Winter",
    hindi: "Shishir",
    accent: "#6E93C9",
    accentSoft: "#EAF1FA",
    deep: "#33517A",
    icon: IconMoonCloudSnow,
    particle: "snow",
    tagline: "Frost-tipped glass, warm hearts.",
  },
  summer: {
    id: "summer",
    name: "Summer",
    hindi: "Grishma",
    accent: "#E5924A",
    accentSoft: "#FBEFDD",
    deep: "#8A4E1C",
    icon: IconSunCloud,
    particle: "mote",
    tagline: "Marigold mornings, mango afternoons.",
  },
  monsoon: {
    id: "monsoon",
    name: "Monsoon",
    hindi: "Varsha",
    accent: "#4C9B9E",
    accentSoft: "#E0F1F0",
    deep: "#1F5A5D",
    icon: IconRaindrops,
    particle: "rain",
    tagline: "Petrichor, chai and fresh code.",
  },
  autumn: {
    id: "autumn",
    name: "Autumn",
    hindi: "Sharad",
    accent: "#C9758C",
    accentSoft: "#F8E7EC",
    deep: "#8A3A55",
    icon: IconLeaf,
    particle: "petal",
    tagline: "Festival skies, marigold light.",
  },
};

const SEASON_LIST: SeasonCfg[] = [
  SEASONS.winter,
  SEASONS.summer,
  SEASONS.monsoon,
  SEASONS.autumn,
];

// All-India meteorological seasons (IMD calendar)
function detectSeason(): SeasonId {
  const m = new Date().getMonth();
  if (m === 11 || m <= 1) return "winter";
  if (m >= 2 && m <= 4) return "summer";
  if (m >= 5 && m <= 8) return "monsoon";
  return "autumn";
}

const GITHUB = "https://github.com/HARSH-LABS-98";
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ------------------------------- global style ------------------------------ */

function GlobalStyle() {
  return (
    <style>{`
      html { scroll-behavior: smooth; }
      body { margin: 0; }
      ::selection { background: var(--accent); color: #fff; }
      :focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; border-radius: 6px; }

      .glass {
        background: rgba(255,255,255,0.55);
        -webkit-backdrop-filter: blur(18px);
        backdrop-filter: blur(18px);
        border: 1px solid rgba(255,255,255,0.72);
        box-shadow: 0 8px 32px rgba(31,38,135,0.08);
      }
      .serif { font-family: Georgia, 'Times New Roman', serif; }
      .eyebrow {
        font-size: 12px; font-weight: 600; letter-spacing: 0.28em;
        text-transform: uppercase; color: var(--accent-deep);
      }

      .btn-primary {
        background: linear-gradient(135deg, var(--accent), var(--accent-deep));
        color: #fff;
        box-shadow: 0 10px 30px -8px color-mix(in srgb, var(--accent) 60%, transparent),
                    inset 0 1px 0 rgba(255,255,255,0.35);
        transition: transform .25s cubic-bezier(.22,1,.36,1), filter .25s, box-shadow .25s;
      }
      .btn-primary:hover { transform: translateY(-2px) scale(1.02); filter: saturate(1.08) brightness(1.04); }
      .btn-primary:active { transform: scale(.97); }

      .btn-ghost {
        background: rgba(255,255,255,0.6);
        border: 1px solid rgba(255,255,255,0.85);
        color: #1B2432;
        -webkit-backdrop-filter: blur(12px);
        backdrop-filter: blur(12px);
        box-shadow: 0 4px 18px rgba(31,38,135,0.06);
        transition: transform .25s cubic-bezier(.22,1,.36,1), background .25s;
      }
      .btn-ghost:hover { transform: translateY(-2px); background: rgba(255,255,255,0.9); }
      .btn-ghost:active { transform: scale(.97); }

      .gl-input {
        background: rgba(255,255,255,0.6);
        border: 1px solid rgba(255,255,255,0.85);
        -webkit-backdrop-filter: blur(12px);
        backdrop-filter: blur(12px);
        transition: border-color .25s, box-shadow .25s, background .25s;
      }
      .gl-input:focus {
        outline: none;
        border-color: var(--accent);
        background: rgba(255,255,255,0.9);
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 22%, transparent);
      }

      @keyframes p-fall {
        0% { transform: translateY(-6vh); opacity: 0; }
        8% { opacity: var(--po, .5); }
        92% { opacity: var(--po, .5); }
        100% { transform: translateY(106vh); opacity: 0; }
      }
      @keyframes p-rise {
        0% { transform: translateY(106vh); opacity: 0; }
        10% { opacity: var(--po, .6); }
        90% { opacity: var(--po, .6); }
        100% { transform: translateY(-6vh); opacity: 0; }
      }
      @keyframes p-sway {
        0% { transform: translateX(-12px) rotate(-10deg); }
        100% { transform: translateX(12px) rotate(10deg); }
      }
    `}</style>
  );
}

/* --------------------------------- helpers -------------------------------- */

function I({
  icon: Cmp,
  className = "",
  style,
}: {
  icon: React.ComponentType;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className={
        "inline-flex shrink-0 items-center justify-center [&>svg]:h-[1em] [&>svg]:w-[1em] [&>svg]:fill-current " +
        className
      }
      style={style}
    >
      <Cmp />
    </span>
  );
}

function Reveal({
  children,
  delay = 0,
  y = 30,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

function Tilt({
  children,
  max = 7,
  className = "",
}: {
  children: React.ReactNode;
  max?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rX = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 160, damping: 20 });
  const rY = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 160, damping: 20 });
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      style={{ rotateX: rX, rotateY: rY, transformStyle: "preserve-3d", transformPerspective: 900 }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width);
        py.set((e.clientY - r.top) / r.height);
      }}
      onPointerLeave={() => {
        px.set(0.5);
        py.set(0.5);
      }}
    >
      {children}
    </motion.div>
  );
}

function Magnetic({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 15, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 150, damping: 15, mass: 0.4 });
  if (reduce) return <div className="inline-flex">{children}</div>;
  return (
    <motion.div
      ref={ref}
      className="inline-flex"
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.25);
        y.set((e.clientY - r.top - r.height / 2) * 0.25);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });
  return (
    <motion.div
      style={{ scaleX, background: "linear-gradient(90deg, var(--accent), var(--accent-deep))" }}
      className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left"
    />
  );
}

function Grain() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[60] opacity-[0.03] mix-blend-multiply"
      style={{
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
      }}
    />
  );
}

/* ------------------------------ background fx ----------------------------- */

function BackgroundFx({ season }: { season: SeasonCfg }) {
  return (
    <AnimatePresence>
      <motion.div
        key={season.id}
        className="fixed inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        style={{ background: "linear-gradient(180deg,#F8FAFD 0%,#EEF2F8 100%)" }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(900px 620px at 85% -10%, ${season.accentSoft}, transparent 65%),
              radial-gradient(760px 540px at -12% 42%, color-mix(in srgb, ${season.accent} 12%, white), transparent 62%),
              radial-gradient(720px 720px at 50% 112%, color-mix(in srgb, ${season.accent} 8%, white), transparent 60%)`,
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
}

/* -------------------------------- particles ------------------------------- */

type P = { x: number; dur: number; delay: number; sway: number; op: number; size: number; rot: number };

function particleInner(kind: SeasonCfg["particle"], it: P, season: SeasonCfg) {
  if (kind === "rain") {
    return (
      <span
        style={{
          display: "block",
          width: 1.5,
          height: it.size,
          borderRadius: 999,
          background: `linear-gradient(to bottom, transparent, color-mix(in srgb, ${season.accent} 55%, transparent))`,
          opacity: 0.5,
        }}
      />
    );
  }
  if (kind === "snow") {
    return (
      <span style={{ display: "block", animation: `p-sway ${it.sway}s ease-in-out ${it.delay}s infinite alternate` }}>
        <span
          style={{
            display: "block",
            width: it.size,
            height: it.size,
            borderRadius: 999,
            background: "#fff",
            boxShadow: "0 0 6px rgba(255,255,255,.9)",
          }}
        />
      </span>
    );
  }
  if (kind === "mote") {
    return (
      <span style={{ display: "block", animation: `p-sway ${it.sway}s ease-in-out ${it.delay}s infinite alternate` }}>
        <span
          style={{
            display: "block",
            width: it.size * 0.9,
            height: it.size * 0.9,
            borderRadius: 999,
            background: `radial-gradient(circle, #fff 0%, ${season.accent} 60%)`,
            boxShadow: `0 0 10px 2px color-mix(in srgb, ${season.accent} 45%, transparent)`,
          }}
        />
      </span>
    );
  }
  return (
    <span style={{ display: "block", animation: `p-sway ${it.sway}s ease-in-out ${it.delay}s infinite alternate` }}>
      <span
        style={{
          display: "block",
          width: 9,
          height: 6.5,
          borderRadius: "100% 4px 100% 4px",
          background: `linear-gradient(130deg, color-mix(in srgb, ${season.accent} 85%, white), ${season.accentSoft})`,
          transform: `rotate(${it.rot}deg)`,
          opacity: 0.85,
        }}
      />
    </span>
  );
}

function Particles({ season }: { season: SeasonCfg }) {
  const kind = season.particle;
  const reduce = useReducedMotion();
  const items = useMemo<P[]>(() => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
    const count =
      kind === "rain" ? (isMobile ? 40 : 80) : isMobile ? 18 : 38;
    return Array.from({ length: count }, () => {
      const dur =
        kind === "rain"
          ? 0.9 + Math.random() * 0.9
          : kind === "snow"
          ? 9 + Math.random() * 9
          : kind === "mote"
          ? 11 + Math.random() * 10
          : 8 + Math.random() * 9;
      return {
        x: Math.random() * 100,
        dur,
        delay: -Math.random() * dur,
        sway: 2.4 + Math.random() * 3.5,
        op: 0.25 + Math.random() * 0.5,
        size: kind === "rain" ? 40 + Math.random() * 26 : 2.5 + Math.random() * 3.5,
        rot: Math.random() * 360,
      };
    });
  }, [kind]);

  if (reduce) return null;
  return (
    <AnimatePresence>
      <motion.div
        key={kind}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.2 }}
        className="pointer-events-none fixed inset-0 z-[6] overflow-hidden"
      >
        {items.map((it, i) => (
          <span
            key={i}
            className="absolute top-0"
            style={
              {
                left: `${it.x}%`,
                animation: `${kind === "mote" ? "p-rise" : "p-fall"} ${it.dur}s linear ${it.delay}s infinite`,
                "--po": it.op,
              } as React.CSSProperties
            }
          >
            {particleInner(kind, it, season)}
          </span>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}

/* ---------------------------------- 3D ------------------------------------ */

function Scene({ season, reduce }: { season: SeasonCfg; reduce: boolean }) {
  const group = useRef<THREE.Group>(null!);
  const core = useRef<THREE.MeshPhysicalMaterial>(null!);
  const glow = useRef<THREE.PointLight>(null!);
  const ringMat = useRef<THREE.MeshStandardMaterial>(null!);
  const target = useMemo(() => new THREE.Color(season.accent), [season.accent]);
  const emissiveTarget = useMemo(
    () => new THREE.Color(season.accent).multiplyScalar(0.32),
    [season.accent]
  );
  const ringTarget = useMemo(() => new THREE.Color("#C9D4E4"), []);
  const smooth = useRef({ px: 0, py: 0, spin: 0 });

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05);
    const s = smooth.current;
    s.px = THREE.MathUtils.lerp(s.px, state.pointer.x, 0.06);
    s.py = THREE.MathUtils.lerp(s.py, state.pointer.y, 0.06);
    s.spin += reduce ? 0 : d * 0.14;
    if (group.current) {
      group.current.rotation.y = s.spin + s.px * 0.35;
      group.current.rotation.x = 0.32 + s.py * 0.18;
    }
    const k = 1 - Math.exp(-3.2 * d);
    if (core.current) {
      core.current.color.lerp(target, k);
      core.current.emissive.lerp(emissiveTarget, k);
    }
    if (glow.current) glow.current.color.lerp(target, k);
    if (ringMat.current) ringMat.current.color.lerp(ringTarget, k);
  });

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 4]} intensity={1.1} />
      <pointLight
        ref={glow}
        position={[-3, -1, 3]}
        intensity={9}
        distance={9}
        color={season.accent}
      />
      <group ref={group} rotation={[0.32, 0, 0]}>
        <Float
          speed={reduce ? 0 : 1.3}
          rotationIntensity={reduce ? 0 : 0.5}
          floatIntensity={reduce ? 0 : 1.1}
        >
          {/* glass shell */}
          <mesh>
            <icosahedronGeometry args={[1.35, 0]} />
            <meshPhysicalMaterial
              color="#ffffff"
              transmission={0.96}
              thickness={1.4}
              roughness={0.14}
              ior={1.45}
              clearcoat={1}
              clearcoatRoughness={0.25}
              flatShading
              transparent
            />
          </mesh>
          {/* seasonal core */}
          <mesh scale={0.55}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshPhysicalMaterial
              ref={core}
              color={season.accent}
              roughness={0.28}
              metalness={0.05}
              emissive={season.accent}
              emissiveIntensity={0.5}
            />
          </mesh>
          {/* metal ring */}
          <mesh rotation={[Math.PI / 2.4, 0.35, 0]}>
            <torusGeometry args={[2.05, 0.018, 16, 128]} />
            <meshStandardMaterial ref={ringMat} color="#C9D4E4" metalness={0.85} roughness={0.28} />
          </mesh>
        </Float>
        <Float speed={reduce ? 0 : 1.7} rotationIntensity={0.8} floatIntensity={1.6}>
          <mesh position={[-2.5, 1.1, -0.6]}>
            <sphereGeometry args={[0.16, 24, 24]} />
            <meshStandardMaterial color="#ffffff" roughness={0.35} metalness={0.1} />
          </mesh>
        </Float>
        <Float speed={reduce ? 0 : 1.4} rotationIntensity={0.7} floatIntensity={1.4}>
          <mesh position={[2.4, -1.0, -0.4]}>
            <octahedronGeometry args={[0.22, 0]} />
            <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.15} flatShading />
          </mesh>
        </Float>
        <Float speed={reduce ? 0 : 1.9} rotationIntensity={0.9} floatIntensity={1.8}>
          <mesh position={[2.1, 1.35, 0.4]}>
            <sphereGeometry args={[0.1, 20, 20]} />
            <meshStandardMaterial color="#ffffff" roughness={0.4} />
          </mesh>
        </Float>
      </group>
      <ContactShadows
        position={[0, -2.3, 0]}
        opacity={0.32}
        scale={11}
        blur={2.6}
        far={4}
        color="#7C8DA5"
      />
      <Environment resolution={256}>
        <Lightformer
          intensity={2.2}
          position={[0, 5, 0]}
          rotation-x={Math.PI / 2}
          scale={[9, 9, 1]}
          color="#ffffff"
        />
        <Lightformer
          intensity={1.6}
          position={[-5, 1, -1]}
          rotation-y={Math.PI / 2}
          scale={[12, 2, 1]}
          color={season.accentSoft}
        />
        <Lightformer
          intensity={1.1}
          position={[5, 1, -1]}
          rotation-y={-Math.PI / 2}
          scale={[12, 2, 1]}
          color="#DCE7F6"
        />
        <Lightformer intensity={0.8} position={[0, -3, 2]} scale={[8, 2, 1]} color="#F1E8E2" />
      </Environment>
    </>
  );
}

function HeroScene({ season, reduce }: { season: SeasonCfg; reduce: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.5, 6.4], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
    >
      <React.Suspense fallback={null}>
        <Scene season={season} reduce={reduce} />
      </React.Suspense>
    </Canvas>
  );
}

/* ----------------------------------- nav ---------------------------------- */

const LINKS = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Work", href: "#work" },
  { label: "Journey", href: "#journey" },
  { label: "Contact", href: "#contact" },
];

function SeasonSwitch({
  mode,
  setMode,
  season,
  compact,
}: {
  mode: Mode;
  setMode: (m: Mode) => void;
  season: SeasonCfg;
  compact?: boolean;
}) {
  const btn = "grid h-7 w-7 place-items-center rounded-full text-xs transition-all duration-300";
  return (
    <div
      className={
        "flex items-center gap-0.5 rounded-full border border-white/70 bg-white/40 p-1 backdrop-blur-xl" +
        (compact ? "" : " hidden sm:flex")
      }
      role="group"
      aria-label="Season theme"
    >
      <button
        onClick={() => setMode("auto")}
        title="Auto (follow India's season)"
        aria-label="Auto season"
        className={
          btn +
          (mode === "auto"
            ? " font-bold text-white shadow"
            : " text-slate-500 hover:bg-white/70 hover:text-slate-800")
        }
        style={mode === "auto" ? { background: "var(--accent)" } : undefined}
      >
        A
      </button>
      {SEASON_LIST.map((s) => {
        const active = mode === s.id;
        return (
          <button
            key={s.id}
            onClick={() => setMode(s.id)}
            title={`${s.name} (${s.hindi})`}
            aria-label={`Switch to ${s.name}`}
            className={
              btn +
              (active
                ? " text-white shadow"
                : " text-slate-500 hover:bg-white/70 hover:text-slate-800")
            }
            style={active ? { background: s.accent } : undefined}
          >
            <I icon={s.icon} className="text-[13px]" />
          </button>
        );
      })}
      {!compact && mode !== "auto" && (
        <span className="ml-1 mr-1 text-[11px] font-semibold tracking-wide text-slate-500">
          {season.name}
        </span>
      )}
    </div>
  );
}

function Nav({ mode, setMode, season }: { mode: Mode; setMode: (m: Mode) => void; season: SeasonCfg }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="glass mt-4 flex items-center justify-between gap-3 rounded-2xl px-4 py-2.5">
          <a href="#top" className="flex items-center gap-2.5">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{
                background: "var(--accent)",
                boxShadow: "0 0 10px 2px color-mix(in srgb, var(--accent) 55%, transparent)",
              }}
            />
            <span className="text-sm font-semibold tracking-tight text-slate-900">
              harshu<span className="serif italic" style={{ color: "var(--accent)" }}>.portfolio</span>
            </span>
          </a>

          <nav className="hidden items-center gap-7 lg:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-slate-600 transition-colors duration-200 hover:text-slate-900"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <SeasonSwitch mode={mode} setMode={setMode} season={season} />
            <a
              href="#contact"
              className="btn-primary hidden rounded-xl px-4 py-2 text-sm font-semibold md:inline-flex"
            >
              Let&apos;s talk
            </a>
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label="Open menu"
              className="grid h-9 w-9 place-items-center rounded-xl border border-white/70 bg-white/50 text-slate-700 backdrop-blur-xl transition hover:bg-white/80 lg:hidden"
            >
              {open ? "✕" : <I icon={IconMenu} className="text-base" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="glass mt-2 rounded-2xl p-5 lg:hidden"
            >
              <nav className="flex flex-col gap-4">
                {LINKS.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="text-[15px] font-medium text-slate-700 transition hover:text-slate-950"
                  >
                    {l.label}
                  </a>
                ))}
              </nav>
              <div className="mt-5 border-t border-white/70 pt-4">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400">
                  Season theme
                </p>
                <SeasonSwitch mode={mode} setMode={setMode} season={season} compact />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

/* --------------------------------- sections -------------------------------- */

function Section({
  id,
  eyebrow,
  title,
  accent,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="relative py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="eyebrow mb-3">{eyebrow}</p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="max-w-3xl text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            {title}{" "}
            <span className="serif italic" style={{ color: "var(--accent)" }}>
              {accent}
            </span>
          </h2>
        </Reveal>
        <div className="mt-10 md:mt-14">{children}</div>
      </div>
    </section>
  );
}

function Hero({ season }: { season: SeasonCfg }) {
  const reduce = useReducedMotion();
  return (
    <section id="top" className="relative flex min-h-[100svh] items-center pb-16 pt-32">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <Reveal>
            <p className="eyebrow">Harshu · Portfolio · 2026</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="mt-4 text-5xl font-bold leading-[1.05] tracking-[-0.03em] text-slate-900 sm:text-6xl lg:text-7xl">
              Designing calm.
              <br />
              <span className="serif italic" style={{ color: "var(--accent)" }}>
                Building bold.
              </span>
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
              I&apos;m <span className="font-semibold text-slate-800">Harshu</span> — a student
              designer-developer from India, exploring health, wealth and financial independence
              while building products along the way. This interface is currently wearing{" "}
              <span className="font-semibold" style={{ color: "var(--accent-deep)" }}>
                {season.name.toLowerCase()}
              </span>
              , just like the country outside.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Magnetic>
                <a
                  href="#work"
                  className="btn-primary inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-semibold tracking-wide"
                >
                  Explore work <I icon={IconArrowRight} className="text-base" />
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href="#contact"
                  className="btn-ghost inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-semibold tracking-wide"
                >
                  Say hello
                </a>
              </Magnetic>
            </div>
          </Reveal>
          <Reveal delay={0.32}>
            <div className="mt-8 flex flex-wrap gap-3">
              {[
                { t: "UI/UX + Product", ic: IconPencil },
                { t: "React · Three.js", ic: IconCode },
                { t: "Season-aware UI", ic: IconSparkle },
              ].map(({ t, ic }) => (
                <span
                  key={t}
                  className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-slate-700"
                >
                  <span style={{ color: "var(--accent)" }}>
                    <I icon={ic} className="text-sm" />
                  </span>
                  {t}
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="relative h-72 sm:h-80 lg:h-[560px]">
          <HeroScene season={season} reduce={!!reduce} />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center">
            <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs text-slate-600">
              <span style={{ color: "var(--accent)" }}>
                <I icon={season.icon} className="text-sm" />
              </span>
              Now in India: {season.name} · {season.hindi}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

const VALUES = ["Curiosity", "Craft", "Consistency", "Courage"];

function About() {
  return (
    <Section id="about" eyebrow="About" title="The journey," accent="not the trophy.">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Reveal>
          <div className="glass h-full rounded-3xl p-8">
            <p className="text-lg leading-relaxed text-slate-700">
              I&apos;m Harshu — a student of design and code from India. I spend my days at the
              intersection of <span className="font-semibold">health</span>,{" "}
              <span className="font-semibold">wealth</span> and{" "}
              <span className="font-semibold">financial independence</span>: learning how bodies
              work, how money compounds, and how products get built.
            </p>
            <p className="mt-4 leading-relaxed text-slate-600">
              This portfolio frames the journey — not a finished career. Every project here is one
              season of it. Some shipped, some broke, all of them taught me something. I like quiet
              interfaces, loud ideas, and the patience of compounding.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {VALUES.map((v) => (
                <span
                  key={v}
                  className="rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide text-white"
                  style={{
                    background: "linear-gradient(135deg, var(--accent), var(--accent-deep))",
                    boxShadow: "0 4px 14px -4px color-mix(in srgb, var(--accent) 60%, transparent)",
                  }}
                >
                  {v}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
        <div className="grid gap-6">
          <Reveal delay={0.1}>
            <Tilt>
              <div className="glass rounded-3xl p-7">
                <span
                  className="grid h-11 w-11 place-items-center rounded-2xl"
                  style={{ background: "color-mix(in srgb, var(--accent) 14%, white)" }}
                >
                  <I icon={IconTarget} className="text-xl" style={{ color: "var(--accent-deep)" }} />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">Right now</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
                  Building Ai-studio, studying money like a syllabus, and training like the body is
                  also a product.
                </p>
              </div>
            </Tilt>
          </Reveal>
          <Reveal delay={0.18}>
            <Tilt>
              <div className="glass rounded-3xl p-7">
                <span
                  className="grid h-11 w-11 place-items-center rounded-2xl"
                  style={{ background: "color-mix(in srgb, var(--accent) 14%, white)" }}
                >
                  <I icon={IconSparkle} className="text-xl" style={{ color: "var(--accent-deep)" }} />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">This site</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
                  Its UI adapts to India&apos;s seasons — colours, light, weather and all. Try the
                  switcher up in the nav to see all four seasons.
                </p>
              </div>
            </Tilt>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

const SKILLS = [
  {
    icon: IconPencil,
    title: "Product & UI/UX Design",
    desc: "Interfaces that feel quiet and inevitable — PRDs, design systems, glassmorphism, 3D composition.",
    tags: ["UI/UX", "Design Systems", "Prototyping", "PRDs"],
  },
  {
    icon: IconCode,
    title: "Frontend Engineering",
    desc: "Pixel-true builds with modern React, typed end-to-end and animated with intent.",
    tags: ["React", "TypeScript", "Tailwind", "Framer Motion", "Three.js / R3F"],
  },
  {
    icon: IconTarget,
    title: "Product Strategy",
    desc: "From spark to spec: research, positioning, roadmaps and ruthless prioritisation.",
    tags: ["User Research", "Roadmaps", "Analytics", "Positioning"],
  },
  {
    icon: IconRocket,
    title: "Building in Public",
    desc: "Turning curiosity into shipped things — content, experiments and small businesses.",
    tags: ["Storytelling", "Content", "Experiments", "Community"],
  },
];

function Skills() {
  return (
    <Section id="skills" eyebrow="Skills" title="A quiet toolkit," accent="sharpened daily.">
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {SKILLS.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.08} className="h-full">
            <Tilt className="h-full">
              <div className="glass flex h-full flex-col rounded-3xl p-7">
                <span
                  className="grid h-11 w-11 place-items-center rounded-2xl"
                  style={{ background: "color-mix(in srgb, var(--accent) 14%, white)" }}
                >
                  <I icon={s.icon} className="text-xl" style={{ color: "var(--accent-deep)" }} />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-2 flex-1 text-[15px] leading-relaxed text-slate-600">{s.desc}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {s.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/80 bg-white/50 px-3 py-1 text-[11px] font-medium text-slate-600"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Tilt>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

const PROJECTS = [
  {
    name: "Ai-studio",
    year: "2025",
    blurb:
      "An AI playground for designing, testing and shipping prompts & agents — where my design and code obsessions first collided.",
    tags: ["React", "AI", "Open Source"],
    link: GITHUB,
    external: true,
    icon: IconSparkle,
  },
  {
    name: "FinFit",
    year: "2026",
    blurb:
      "Money, but for students — budgeting, first-investment basics and a financial-independence tracker that doesn't shame you.",
    tags: ["Product Design", "Figma", "Finance"],
    link: "#contact",
    external: false,
    icon: IconChart,
  },
  {
    name: "Ritu UI",
    year: "2026",
    blurb:
      "The season-aware design system powering this very site — one glass interface that dresses for India's four seasons.",
    tags: ["Design System", "Tailwind", "R3F"],
    link: "#top",
    external: false,
    icon: IconGlobe,
  },
];

function Work({ season }: { season: SeasonCfg }) {
  return (
    <Section id="work" eyebrow="Selected work" title="Things I've built," accent="things I'm building.">
      <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
        {PROJECTS.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.1} className="h-full">
            <Tilt className="group h-full">
              <article className="glass relative flex h-full flex-col overflow-hidden rounded-3xl transition-shadow duration-300 hover:shadow-[0_18px_50px_rgba(31,38,135,0.14)]">
                <div
                  className="relative h-44 overflow-hidden"
                  style={{
                    background: `linear-gradient(140deg, ${season.accentSoft}, #ffffff 55%, color-mix(in srgb, ${season.accent} 16%, #ffffff))`,
                  }}
                >
                  <span
                    className="absolute -left-8 -top-10 h-32 w-32 rounded-full border"
                    style={{ borderColor: "color-mix(in srgb, var(--accent) 25%, transparent)" }}
                  />
                  <span
                    className="absolute -bottom-14 -right-6 h-36 w-36 rounded-full"
                    style={{ background: "color-mix(in srgb, var(--accent) 12%, transparent)" }}
                  />
                  <I
                    icon={p.icon}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl"
                    style={{ color: "color-mix(in srgb, var(--accent) 55%, white)" }}
                  />
                </div>
                <div className="flex flex-1 flex-col p-7" style={{ transform: "translateZ(24px)" }}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-slate-900">{p.name}</h3>
                    <span className="text-[11px] font-medium tracking-[0.2em] text-slate-400">
                      {p.year}
                    </span>
                  </div>
                  <p className="mt-3 flex-1 text-[15px] leading-relaxed text-slate-600">{p.blurb}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full px-3 py-1 text-[11px] font-medium text-white"
                        style={{
                          background: "color-mix(in srgb, var(--accent) 80%, white)",
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <a
                    href={p.link}
                    {...(p.external ? { target: "_blank", rel: "noreferrer" } : {})}
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold transition-opacity hover:opacity-80"
                    style={{ color: "var(--accent-deep)" }}
                  >
                    {p.external ? "View on GitHub" : "Case study soon"}
                    <I
                      icon={IconArrowUpRight}
                      className="text-sm transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </a>
                </div>
              </article>
            </Tilt>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

const JOURNEY = [
  {
    year: "2024",
    title: "The spark",
    text: "Fell for design systems, glass UI and 3D on the web. Started sketching interfaces before sleeping.",
  },
  {
    year: "2025",
    title: "Deep work",
    text: "Went down the health–wealth–FI rabbit hole. Shipped Ai-studio, broke a few builds, learned in public.",
  },
  {
    year: "2026",
    title: "Going public",
    text: "This portfolio — season-aware UI, 3D scenes, and small businesses slowly taking shape.",
  },
  {
    year: "Next",
    title: "The horizon",
    text: "Building things that outlive seasons — and taking you along for the ride.",
    muted: true,
  },
];

function Journey() {
  return (
    <Section id="journey" eyebrow="Journey" title="So far," accent="and what's next.">
      <div
        className="relative ml-3 border-l-2"
        style={{ borderColor: "color-mix(in srgb, var(--accent) 30%, white)" }}
      >
        {JOURNEY.map((j, i) => (
          <Reveal key={j.year} delay={i * 0.08} className="relative pb-10 pl-8 last:pb-0">
            <span
              className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-2 bg-white"
              style={{
                borderColor: j.muted ? "#CBD5E1" : "var(--accent)",
                opacity: j.muted ? 0.75 : 1,
              }}
            />
            <p
              className="text-[11px] font-semibold tracking-[0.25em]"
              style={{ color: j.muted ? "#94A3B8" : "var(--accent-deep)" }}
            >
              {j.year.toUpperCase()}
            </p>
            <h3
              className={
                "mt-1.5 text-lg font-semibold " + (j.muted ? "text-slate-400" : "text-slate-900")
              }
            >
              {j.title}
            </h3>
            <p
              className={
                "mt-1 max-w-xl text-[15px] leading-relaxed " +
                (j.muted ? "text-slate-400" : "text-slate-600")
              }
            >
              {j.text}
            </p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <Section id="contact" eyebrow="Contact" title="The inbox is" accent="a friendly place.">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <div className="glass flex h-full flex-col rounded-3xl p-8">
            <p className="text-lg leading-relaxed text-slate-700">
              Have an idea, a role, or just want to talk seasons, design or money? Write to me — I
              reply faster than the monsoon arrives.
            </p>
            <div className="mt-8 flex flex-col gap-4">
              <a
                href={GITHUB}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-3"
              >
                <span
                  className="grid h-11 w-11 place-items-center rounded-full transition-transform duration-300 group-hover:scale-105"
                  style={{ background: "color-mix(in srgb, var(--accent) 15%, white)" }}
                >
                  <I icon={IconCode} className="text-lg" style={{ color: "var(--accent-deep)" }} />
                </span>
                <span className="text-sm font-semibold text-slate-800">
                  github.com/HARSH-LABS-98
                </span>
                <I
                  icon={IconArrowUpRight}
                  className="text-sm text-slate-400 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
              <a href="mailto:hello@harshu.design" className="group inline-flex items-center gap-3">
                <span
                  className="grid h-11 w-11 place-items-center rounded-full transition-transform duration-300 group-hover:scale-105"
                  style={{ background: "color-mix(in srgb, var(--accent) 15%, white)" }}
                >
                  <I icon={IconGlobe} className="text-lg" style={{ color: "var(--accent-deep)" }} />
                </span>
                <span className="text-sm font-semibold text-slate-800">hello@harshu.design</span>
                <I
                  icon={IconArrowUpRight}
                  className="text-sm text-slate-400 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </div>
            <p className="mt-auto pt-8 text-xs leading-relaxed text-slate-400">
              Currently accepting collaborations, internships and good conversations.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="glass h-full rounded-3xl p-8">
            {sent ? (
              <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-center">
                <span
                  className="grid h-14 w-14 place-items-center rounded-full"
                  style={{ background: "color-mix(in srgb, var(--accent) 16%, white)" }}
                >
                  <I icon={IconSparkle} className="text-2xl" style={{ color: "var(--accent-deep)" }} />
                </span>
                <h3 className="mt-5 text-xl font-semibold text-slate-900">Message received!</h3>
                <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-slate-600">
                  Thanks for reaching out. This demo form doesn&apos;t send yet — the real inbox
                  lands soon. Meanwhile, ping me on GitHub.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="btn-ghost mt-6 rounded-xl px-5 py-2.5 text-sm font-semibold"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
                className="flex flex-col gap-5"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Name
                    </label>
                    <input id="name" name="name" required placeholder="Your name" className="gl-input w-full rounded-2xl px-4 py-3 text-[15px] text-slate-800 placeholder:text-slate-400" />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Email
                    </label>
                    <input id="email" name="email" type="email" required placeholder="you@example.com" className="gl-input w-full rounded-2xl px-4 py-3 text-[15px] text-slate-800 placeholder:text-slate-400" />
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Message
                  </label>
                  <textarea id="message" name="message" required rows={5} placeholder="What's on your mind?" className="gl-input w-full resize-none rounded-2xl px-4 py-3 text-[15px] text-slate-800 placeholder:text-slate-400" />
                </div>
                <button type="submit" className="btn-primary rounded-2xl px-6 py-3.5 text-sm font-semibold tracking-wide">
                  Send message →
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

function Footer({ season }: { season: SeasonCfg }) {
  return (
    <footer className="relative z-10 border-t border-white/60 bg-white/30 py-10 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-slate-500 sm:flex-row">
        <p>© 2026 Harshu — designed in every Indian season.</p>
        <p className="flex items-center gap-2 text-xs">
          <I icon={season.icon} className="text-sm" style={{ color: "var(--accent)" }} />
          Currently wearing: {season.name} ({season.hindi})
        </p>
        <a
          href={GITHUB}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-slate-600 transition-colors hover:text-slate-900"
        >
          HARSH-LABS-98 ↗
        </a>
      </div>
    </footer>
  );
}

function SeasonToast({ season, manual }: { season: SeasonCfg; manual: boolean }) {
  const [visible, setVisible] = useState(false);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 3400);
    return () => clearTimeout(t);
  }, [season.id]);
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="glass fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-4 py-3"
        >
          <span
            className="grid h-9 w-9 place-items-center rounded-full"
            style={{ background: "color-mix(in srgb, var(--accent) 15%, white)" }}
          >
            <I icon={season.icon} className="text-base" style={{ color: "var(--accent-deep)" }} />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900">
              {season.name} · {season.hindi}{" "}
              <span className="text-[11px] font-medium text-slate-400">
                ({manual ? "manual" : "auto"})
              </span>
            </p>
            <p className="text-xs text-slate-500">{season.tagline}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ----------------------------------- app ----------------------------------- */

export default function App() {
  const [mode, setMode] = useState<Mode>("auto");
  const [detected] = useState<SeasonId>(() => detectSeason());
  const season = mode === "auto" ? SEASONS[detected] : SEASONS[mode];

  const vars = {
    "--accent": season.accent,
    "--accent-soft": season.accentSoft,
    "--accent-deep": season.deep,
  } as React.CSSProperties;

  return (
    <div
      style={vars}
      className="relative min-h-screen overflow-x-clip bg-[#F4F7FB] font-sans text-slate-800 antialiased"
    >
      <GlobalStyle />
      <BackgroundFx season={season} />
      <Particles season={season} />
      <Grain />
      <ScrollProgress />
      <Nav mode={mode} setMode={setMode} season={season} />
      <main className="relative z-10">
        <Hero season={season} />
        <About />
        <Skills />
        <Work season={season} />
        <Journey />
        <Contact />
      </main>
      <Footer season={season} />
      <SeasonToast season={season} manual={mode !== "auto"} />
    </div>
  );
}
