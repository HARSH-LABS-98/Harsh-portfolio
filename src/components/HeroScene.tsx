import React, { Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { useApp } from "../App";

interface SceneProps {
  accent: string;
  deep: string;
}

/* ------------------------------ the sculpture ---------------------------- */
function Sculpture({ accent, deep }: SceneProps) {
  const group = React.useRef<THREE.Group>(null!);
  const satellites: Array<[number, number, number]> = [
    [-2.5, 1.1, -0.6],
    [2.4, -1.0, -0.4],
    [2.1, 1.35, 0.4]
  ];

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    /* slow self-rotation + gentle pointer parallax, never jittery */
    g.rotation.y += delta * 0.18;
    const targetX = 0.28 + state.pointer.y * 0.14;
    const targetPX = state.pointer.x * 0.35;
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, targetX, 0.04);
    g.position.x = THREE.MathUtils.lerp(g.position.x, targetPX, 0.03);
    g.position.y = THREE.MathUtils.lerp(g.position.y, state.pointer.y * 0.2, 0.03);
  });

  return (
    <group ref={group} rotation={[0.28, 0, 0]}>
      {/* seasonal core — the glowing heart */}
      <mesh>
        <sphereGeometry args={[0.72, 48, 48]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={0.55}
          roughness={0.25}
          metalness={0.1}
        />
      </mesh>

      {/* glass icosahedron shell */}
      <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.6}>
        <mesh>
          <icosahedronGeometry args={[1.35, 0]} />
          <meshPhysicalMaterial
            color={accent}
            transmission={0.92}
            thickness={1.4}
            roughness={0.12}
            ior={1.4}
            metalness={0}
            transparent
            opacity={0.96}
            clearcoat={1}
            clearcoatRoughness={0.15}
            iridescence={0.35}
            iridescenceIOR={1.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      </Float>

      {/* metal orbit ring */}
      <mesh rotation={[Math.PI / 2.4, 0, 0.35]}>
        <torusGeometry args={[2.05, 0.025, 16, 120]} />
        <meshStandardMaterial color="#c8ccd6" metalness={0.95} roughness={0.25} />
      </mesh>

      {/* orbiting satellites */}
      {satellites.map((p, i) => (
        <Float key={i} speed={2 + i * 0.6} rotationIntensity={0.4} floatIntensity={1.2}>
          <mesh position={p}>
            <sphereGeometry args={[0.14, 24, 24]} />
            <meshStandardMaterial
              color={i === 1 ? deep : "#ffffff"}
              emissive={i === 1 ? deep : accent}
              emissiveIntensity={0.35}
              roughness={0.3}
              metalness={0.2}
            />
          </mesh>
        </Float>
      ))}

      {/* ambient sparkles around the sculpture */}
      <Sparkles count={60} scale={5} size={2.2} speed={0.35} color={accent} opacity={0.6} />
    </group>
  );
}

/* ------------------------------ error boundary ---------------------------- */
class SceneErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { failed: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(err: any) {
    try { console.warn("[portfolio] 3D scene failed:", err); } catch (e) {}
  }
  render() {
    if (this.state.failed) {
      /* elegant CSS fallback — never a blank box */
      return (
        <div className="hero-scene-fallback" aria-hidden="true">
          <div className="orb core" />
          <div className="orb ring" />
        </div>
      );
    }
    return this.props.children;
  }
}

/* --------------------------------- export -------------------------------- */
export default function HeroScene() {
  const { season } = useApp();
  return (
    <div className="hero-scene">
      <SceneErrorBoundary>
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [0, 0.5, 6.4], fov: 40 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        >
          <ambientLight intensity={0.35} />
          <directionalLight position={[4, 6, 5]} intensity={1.2} color="#fff5e8" />
          <directionalLight position={[-5, 2, -4]} intensity={0.5} color={season.accent} />
          <Suspense fallback={null}>
            <Sculpture accent={season.accent} deep={season.deep} />
            <Environment preset="city" />
            <ContactShadows position={[0, -2.6, 0]} opacity={0.35} blur={2.6} far={4} />
          </Suspense>
        </Canvas>
      </SceneErrorBoundary>
      <div className="hero-badge glass">
        <em>{season.emoji}</em> Now in India: <b>{season.name} · {season.hindi}</b>
      </div>
    </div>
  );
}
