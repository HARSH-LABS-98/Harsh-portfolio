import React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { useApp } from "../App";

/**
 * Performance-tuned 3D sculpture:
 *  - no HDR environment download (lights only)  → fast first paint
 *  - no transmission pass (simple clearcoat glass) → cheap GPU
 *  - static contact shadows (rendered once)
 *  - dpr capped at 1.5
 * The whole component is lazy-loaded by the Hero, so the page paints first.
 */

interface SceneProps {
  accent: string;
  deep: string;
}

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
    g.rotation.y += delta * 0.18;
    const targetX = 0.28 + state.pointer.y * 0.14;
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, targetX, 0.04);
    g.position.x = THREE.MathUtils.lerp(g.position.x, state.pointer.x * 0.35, 0.03);
    g.position.y = THREE.MathUtils.lerp(g.position.y, state.pointer.y * 0.2, 0.03);
  });

  return (
    <group ref={group} rotation={[0.28, 0, 0]}>
      {/* seasonal core — the glowing heart */}
      <mesh>
        <sphereGeometry args={[0.72, 32, 32]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={0.6}
          roughness={0.25}
          metalness={0.1}
        />
      </mesh>

      {/* glass icosahedron shell — clearcoat glass, no transmission pass */}
      <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.6}>
        <mesh>
          <icosahedronGeometry args={[1.35, 0]} />
          <meshPhysicalMaterial
            color={accent}
            roughness={0.08}
            metalness={0.1}
            clearcoat={1}
            clearcoatRoughness={0.12}
            transparent
            opacity={0.38}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* inner wireframe for the glass edge feel */}
        <mesh scale={1.001}>
          <icosahedronGeometry args={[1.35, 0]} />
          <meshBasicMaterial color={accent} wireframe transparent opacity={0.35} />
        </mesh>
      </Float>

      {/* metal orbit ring */}
      <mesh rotation={[Math.PI / 2.4, 0, 0.35]}>
        <torusGeometry args={[2.05, 0.025, 12, 96]} />
        <meshStandardMaterial color="#c8ccd6" metalness={0.95} roughness={0.25} />
      </mesh>

      {/* orbiting satellites */}
      {satellites.map((p, i) => (
        <Float key={i} speed={2 + i * 0.6} rotationIntensity={0.4} floatIntensity={1.2}>
          <mesh position={p}>
            <sphereGeometry args={[0.14, 16, 16]} />
            <meshStandardMaterial
              color={i === 1 ? deep : "#ffffff"}
              emissive={i === 1 ? deep : accent}
              emissiveIntensity={0.4}
              roughness={0.3}
              metalness={0.2}
            />
          </mesh>
        </Float>
      ))}

      {/* light sparkles, cheaper on mobile GPUs */}
      <Sparkles count={36} scale={4.5} size={2} speed={0.3} color={accent} opacity={0.6} />
    </group>
  );
}

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

export default function HeroScene() {
  const { season } = useApp();
  return (
    <SceneErrorBoundary>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.5, 6.4], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.45} />
        <directionalLight position={[4, 6, 5]} intensity={1.3} color="#fff5e8" />
        <directionalLight position={[-5, 2, -4]} intensity={0.6} color={season.accent} />
        <pointLight position={[0, 0, 3]} intensity={0.5} color={season.accent} />
        <Sculpture accent={season.accent} deep={season.deep} />
        <ContactShadows position={[0, -2.6, 0]} opacity={0.3} blur={2.6} far={4} frames={1} />
      </Canvas>
    </SceneErrorBoundary>
  );
}
