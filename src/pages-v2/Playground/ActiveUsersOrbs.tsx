import * as THREE from "three";
import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, TrackballControls } from "@react-three/drei";
import { useDashboard } from "../../contexts/DashboardContext";
import { useActiveUsersData } from "./useActiveUsersData";

import "./ActiveUsersOrbs.css";

function ActiveOrb({
  item,
  idx,
}: {
  item: { label: string; count: number; color: string };
  idx: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const s = 1 + Math.sin(t * 1.4 + idx) * 0.12;
    meshRef.current.scale.setScalar(s);
    meshRef.current.position.y = Math.sin(t * 1 + idx * 0.4) * 2;
  });

  return (
    <group position={[item.count, 0, 0]}>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <sphereGeometry args={[2.4, 24, 24]} />
        <meshStandardMaterial
          color={item.color}
          emissive={item.color}
          emissiveIntensity={0.4}
        />
      </mesh>
      <Text
        position={[0, 4.2, 0]}
        fontSize={1.4}
        color="#e5e7eb"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor="#0b0f1c"
      >
        {item.label}: {item.count}
      </Text>
    </group>
  );
}

function OrbRing({ data }: { data: { label: string; count: number }[] }) {
  const orbs = useMemo(() => {
    const max = Math.max(...data.map((d) => d.count), 1);
    return data.map((d, idx) => {
      const angle = (idx / data.length) * Math.PI * 2;
      const radius = 30;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const color = new THREE.Color()
        .setHSL(0.1 + 0.6 * (d.count / max), 0.7, 0.6)
        .getStyle();
      return { ...d, x, z, color };
    });
  }, [data]);

  return (
    <group>
      <ambientLight intensity={0.45} />
      <pointLight position={[50, 80, 90]} intensity={1.1} />
      <pointLight position={[-60, -40, -70]} intensity={0.5} color="#8ab4ff" />
      {orbs.map((o, idx) => (
        <group key={idx} position={[o.x, 0, o.z]}>
          <ActiveOrb
            item={{ label: o.label, count: o.count, color: o.color }}
            idx={idx}
          />
        </group>
      ))}
    </group>
  );
}

export default function ActiveUsersOrbs() {
  const { timePeriod } = useDashboard();
  const { data, loading, error } = useActiveUsersData(timePeriod as any);
  const top = useMemo(() => data.slice(0, 10), [data]);

  return (
    <div className="active-orbs-page">
      <div className="active-orbs-header">
        <div>
          <h1>Active Users Orbs</h1>
          <p className="subtitle">Floating orbs orbit and pulse by activity.</p>
        </div>
        <div className="status-chip">
          {loading ? "Loading…" : error ? "Using fallback" : timePeriod}
        </div>
      </div>
      <div className="active-orbs-canvas">
        <Canvas dpr={[1, 2]} camera={{ position: [0, 25, 90], fov: 55 }}>
          <color attach="background" args={["#0b0f1c"]} />
          <fog attach="fog" args={["#0b0f1c", 60, 200]} />
          <Suspense fallback={null}>
            <OrbRing data={top} />
          </Suspense>
          <TrackballControls
            minDistance={30}
            maxDistance={180}
            zoomSpeed={0.9}
          />
        </Canvas>
      </div>
    </div>
  );
}
