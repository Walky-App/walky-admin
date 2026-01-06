import * as THREE from "three";
import { Suspense, useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, TrackballControls } from "@react-three/drei";
import { useDashboard } from "../../contexts/DashboardContext";
import { useActiveUsersData } from "./useActiveUsersData";

import "./ActiveUsersDrums.css";

type Drum = {
  label: string;
  count: number;
  position: THREE.Vector3;
  radius: number;
  color: string;
};

function hitTone(
  freq: number,
  audioCtxRef: React.MutableRefObject<AudioContext | null>
) {
  try {
    if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.value = 0.001;
    osc.connect(gain).connect(ctx.destination);
    const now = ctx.currentTime;
    gain.gain.exponentialRampToValueAtTime(0.3, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
    osc.start(now);
    osc.stop(now + 0.4);
  } catch (e) {
    console.warn("audio unavailable", e);
  }
}

function DrumPad({
  drum,
  index,
  onHit,
}: {
  drum: Drum;
  index: number;
  onHit: (idx: number) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const wobble = 1 + Math.sin(t * 1.6 + index) * 0.02;
    meshRef.current.scale.set(wobble, 1, wobble);
  });
  return (
    <group position={drum.position.toArray()}>
      <mesh
        ref={meshRef}
        onPointerDown={() => onHit(index)}
        onPointerOver={() => onHit(index)}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[drum.radius, drum.radius * 0.95, 2.2, 24]} />
        <meshStandardMaterial
          color={drum.color}
          metalness={0.1}
          roughness={0.45}
          emissive={drum.color}
          emissiveIntensity={0.2}
        />
      </mesh>
      <Text
        position={[0, 2.8, 0]}
        fontSize={1.6}
        color="#e5e7eb"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#0b0f1c"
      >
        {drum.label} ({drum.count})
      </Text>
    </group>
  );
}

function DrumStage({ data }: { data: { label: string; count: number }[] }) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const drums = useMemo<Drum[]>(() => {
    const cols = 4;
    const rows = Math.ceil(data.length / cols);
    const max = Math.max(...data.map((d) => d.count), 1);
    return data.slice(0, 12).map((d, i) => {
      const x = (i % cols) * 12 - (cols - 1) * 6;
      const z = Math.floor(i / cols) * 12 - (rows - 1) * 6;
      const radius = THREE.MathUtils.mapLinear(d.count, 0, max, 3, 6);
      const color = new THREE.Color()
        .setHSL(0.05 + 0.5 * (d.count / max), 0.8, 0.55)
        .getStyle();
      return {
        label: d.label,
        count: d.count,
        position: new THREE.Vector3(x, 0, z),
        radius,
        color,
      };
    });
  }, [data]);

  const [lastHit, setLastHit] = useState<number | null>(null);

  const onHit = (idx: number) => {
    const drum = drums[idx];
    if (!drum) return;
    hitTone(120 + drum.count * 4, audioCtxRef);
    setLastHit(idx);
  };

  useEffect(() => {
    const audioCtx = audioCtxRef.current;
    return () => {
      if (audioCtx) {
        void audioCtx.close().catch(() => {});
      }
    };
  }, []);

  return (
    <group>
      <ambientLight intensity={0.4} />
      <pointLight position={[70, 90, 110]} intensity={1.2} />
      <pointLight position={[-60, -40, -80]} intensity={0.5} color="#a5b4fc" />
      {drums.map((drum, idx) => (
        <DrumPad key={idx} drum={drum} index={idx} onHit={onHit} />
      ))}
      {lastHit !== null && (
        <Text
          position={[0, 10, 0]}
          fontSize={2.2}
          color="#22d3ee"
          anchorX="center"
          anchorY="middle"
        >
          {drums[lastHit]?.label}
        </Text>
      )}
    </group>
  );
}

export default function ActiveUsersDrums() {
  const { timePeriod } = useDashboard();
  const { data, loading, error } = useActiveUsersData(timePeriod as any);

  return (
    <main className="active-drums-page" aria-label="Active Users Drums">
      <div className="active-drums-header">
        <div>
          <h1>Active Users Drums</h1>
          <p className="subtitle">
            Pads sized by activity. Hover or click to play tones.
          </p>
        </div>
        <div className="status-chip">
          {loading ? "Loading…" : error ? "Using fallback" : timePeriod}
        </div>
      </div>
      <div className="active-drums-canvas">
        <Canvas dpr={[1, 2]} camera={{ position: [0, 25, 90], fov: 55 }}>
          <color attach="background" args={["#0b0f1c"]} />
          <fog attach="fog" args={["#0b0f1c", 60, 220]} />
          <Suspense fallback={null}>
            <DrumStage data={data} />
          </Suspense>
          <TrackballControls
            minDistance={35}
            maxDistance={200}
            zoomSpeed={0.9}
          />
        </Canvas>
      </div>
    </main>
  );
}
