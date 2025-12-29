import * as THREE from "three";
import { Suspense, useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, TrackballControls } from "@react-three/drei";
import { useDashboard } from "../../contexts/DashboardContext";
import { useActiveUsersData } from "./useActiveUsersData";

import "./ActiveUsersChimes.css";

function playChime(
  freq: number,
  audioCtxRef: React.MutableRefObject<AudioContext | null>
) {
  try {
    if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = freq;
    gain.gain.value = 0.001;
    osc.connect(gain).connect(ctx.destination);
    const now = ctx.currentTime;
    gain.gain.exponentialRampToValueAtTime(0.25, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
    osc.start(now);
    osc.stop(now + 0.85);
  } catch (e) {
    console.warn("audio unavailable", e);
  }
}

function Chime({
  idx,
  datum,
  maxCount,
  audioCtxRef,
}: {
  idx: number;
  datum: { label: string; count: number };
  maxCount: number;
  audioCtxRef: React.MutableRefObject<AudioContext | null>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const sway = Math.sin(t * 1.2 + idx) * 0.08;
    meshRef.current.rotation.z = sway;
  });

  const height = THREE.MathUtils.mapLinear(datum.count, 0, maxCount, 6, 16);
  const color = new THREE.Color().setHSL(
    0.15 + 0.5 * (datum.count / maxCount),
    0.7,
    0.6
  );

  return (
    <group position={[idx * 4 - 10, 0, 0]}>
      <mesh
        ref={meshRef}
        onPointerOver={() =>
          playChime(220 + datum.count * 6 + idx * 4, audioCtxRef)
        }
        onPointerDown={() =>
          playChime(220 + datum.count * 6 + idx * 4, audioCtxRef)
        }
      >
        <boxGeometry args={[1, height, 1]} />
        <meshStandardMaterial
          color={color.getStyle()}
          metalness={0.2}
          roughness={0.4}
          emissive={color.getStyle()}
          emissiveIntensity={0.2}
        />
      </mesh>
      <Text
        position={[0, height / 2 + 1.6, 0]}
        fontSize={1.1}
        color="#e5e7eb"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor="#0b1020"
      >
        {datum.label}
      </Text>
    </group>
  );
}

function ChimeRow({ data }: { data: { label: string; count: number }[] }) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  useEffect(() => {
    return () => {
      const ctx = audioCtxRef.current;
      if (ctx) {
        void ctx.close().catch(() => {});
      }
    };
  }, []);
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <group>
      <ambientLight intensity={0.45} />
      <pointLight position={[60, 90, 100]} intensity={1.1} />
      <pointLight position={[-60, -40, -70]} intensity={0.5} color="#8ab4ff" />
      {data.map((d, idx) => (
        <Chime
          key={idx}
          idx={idx}
          datum={d}
          maxCount={maxCount}
          audioCtxRef={audioCtxRef}
        />
      ))}
    </group>
  );
}

export default function ActiveUsersChimes() {
  const { timePeriod } = useDashboard();
  const { data, loading, error } = useActiveUsersData(timePeriod as any);
  const top = useMemo(() => data.slice(0, 8), [data]);

  return (
    <div className="active-chimes-page">
      <div className="active-chimes-header">
        <div>
          <h1>Active Users Chimes</h1>
          <p className="subtitle">
            Hover to hear activity; bar length and color follow counts.
          </p>
        </div>
        <div className="status-chip">
          {loading ? "Loading…" : error ? "Using fallback" : timePeriod}
        </div>
      </div>
      <div className="active-chimes-canvas">
        <Canvas dpr={[1, 2]} camera={{ position: [0, 15, 55], fov: 55 }}>
          <color attach="background" args={["#0b1020"]} />
          <fog attach="fog" args={["#0b1020", 40, 200]} />
          <Suspense fallback={null}>
            <ChimeRow data={top} />
          </Suspense>
          <TrackballControls
            minDistance={20}
            maxDistance={120}
            zoomSpeed={0.9}
          />
        </Canvas>
      </div>
    </div>
  );
}
