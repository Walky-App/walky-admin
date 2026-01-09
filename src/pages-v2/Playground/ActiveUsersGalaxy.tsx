import * as THREE from "three";
import { Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Line,
  Points,
  PointMaterial,
  Text,
  TrackballControls,
} from "@react-three/drei";
import { useDashboard } from "../../contexts/DashboardContext";
import { useActiveUsersData } from "./useActiveUsersData";

import "./ActiveUsersGalaxy.css";

type Dot = {
  pos: THREE.Vector3;
  color: THREE.Color;
  label: string;
  count: number;
};

function Galaxy({ data }: { data: { label: string; count: number }[] }) {
  const dots = useMemo<Dot[]>(() => {
    const max = Math.max(...data.map((d) => d.count), 1);
    return data.map((d, idx) => {
      const radius = 12 + idx * 2.2;
      const angle = idx * 0.9;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = Math.sin(idx * 0.3) * 2;
      const color = new THREE.Color().setHSL(
        0.1 + 0.6 * (d.count / max),
        0.75,
        0.6
      );
      return {
        pos: new THREE.Vector3(x, y, z),
        color,
        label: d.label,
        count: d.count,
      };
    });
  }, [data]);

  const positions = useMemo(
    () => Float32Array.from(dots.flatMap((d) => d.pos.toArray() as number[])),
    [dots]
  );

  useFrame((state) => {
    state.scene.rotation.y += 0.0015;
  });

  return (
    <group>
      <ambientLight intensity={0.4} />
      <pointLight position={[60, 80, 90]} intensity={1.1} />
      <pointLight position={[-60, -40, -70]} intensity={0.5} color="#8ab4ff" />
      <Points positions={positions} stride={3}>
        <PointMaterial
          transparent
          vertexColors
          size={10}
          sizeAttenuation
          color="#22d3ee"
          opacity={0.9}
        />
      </Points>
      {dots.map((d, idx) => (
        <Text
          key={idx}
          position={[d.pos.x, d.pos.y + 2.6, d.pos.z]}
          fontSize={1.2}
          color={d.color.getStyle()}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.04}
          outlineColor="#0b0f1c"
        >
          {d.label}: {d.count}
        </Text>
      ))}
      <Line
        points={dots.map((d) => d.pos.toArray())}
        color="#22d3ee"
        lineWidth={1}
        opacity={0.2}
        transparent
      />
    </group>
  );
}

export default function ActiveUsersGalaxy() {
  const { timePeriod } = useDashboard();
  const { data, loading, error } = useActiveUsersData(timePeriod as any);

  return (
    <main className="active-galaxy-page" aria-label="Active Users Galaxy">
      <div className="active-galaxy-header">
        <div>
          <h1>Active Users Galaxy</h1>
          <p className="subtitle">
            Spiral galaxy of points; orbit and read labels.
          </p>
        </div>
        <div className="status-chip">
          {loading ? "Loading…" : error ? "Using fallback" : timePeriod}
        </div>
      </div>
      <div className="active-galaxy-canvas">
        <Canvas dpr={[1, 2]} camera={{ position: [0, 20, 90], fov: 55 }}>
          <color attach="background" args={["#0b0f1c"]} />
          <fog attach="fog" args={["#0b0f1c", 50, 200]} />
          <Suspense fallback={null}>
            <Galaxy data={data} />
          </Suspense>
          <TrackballControls
            minDistance={25}
            maxDistance={180}
            zoomSpeed={0.9}
          />
        </Canvas>
      </div>
    </main>
  );
}
