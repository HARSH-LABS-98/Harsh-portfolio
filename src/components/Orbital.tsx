import React, { useEffect, useRef } from "react";

/**
 * "The Orbital" — Harshu's hero centerpiece.
 * A season-reactive gyroscope: a breathing gradient core, tilted rings
 * spinning at different speeds, satellites orbiting them, and twinkling
 * sparks. Pure CSS transforms — no WebGL, silky on any phone.
 * On desktop the whole system tilts gently with your mouse.
 */
export function Orbital() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
      const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      el.style.setProperty("--tilt-x", `${(dy * -10).toFixed(2)}deg`);
      el.style.setProperty("--tilt-y", `${(dx * 14).toFixed(2)}deg`);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return (
    <div className="orbital" ref={ref} aria-hidden="true">
      <div className="orb-sys">
        <span className="orb-core" />
        <span className="orb-ring r-a" />
        <span className="orb-ring r-b" />
        <span className="orb-ring r-c" />
        <span className="orb-ring r-d" />
        <span className="orb-sat s-a"><i /></span>
        <span className="orb-sat s-b"><i /></span>
        <span className="orb-sat s-c"><i /></span>
        <span className="orb-spark p1">✦</span>
        <span className="orb-spark p2">✦</span>
        <span className="orb-spark p3">✦</span>
      </div>
    </div>
  );
}
