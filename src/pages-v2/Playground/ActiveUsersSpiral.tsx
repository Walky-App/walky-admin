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

import "./ActiveUsersSpiral.css";

function SpiralPoints({ data }: { data: { label: string; count: number }[] }) {
  const points = useMemo(() => {
    const spacing = 6;
    const radius = 35;
    const arr: THREE.Vector3[] = [];
    data.forEach((_d, i) => {
      const t = i / Math.max(1, data.length - 1);
      const angle = t * Math.PI * 4; // two turns
      const r = radius * (0.6 + 0.4 * t);
      const x = Math.cos(angle) * r;
      const y = (i - data.length / 2) * (spacing * 0.4);
      const z = Math.sin(angle) * r;
      arr.push(new THREE.Vector3(x, y, z));
    });
    return arr;
  }, [data]);

  const colors = data.map((_d, i) =>
    new THREE.Color().setHSL((i / data.length) * 0.6, 0.65, 0.6)
  );

  const positions = useMemo(
    () => Float32Array.from(points.flatMap((p) => p.toArray() as number[])),
    [points]
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    points.forEach((p, idx) => {
      p.y += Math.sin(t * 0.6 + idx) * 0.02;
    });
  });

  return (
    <group>
      <Line
        points={points.map((p) => p.toArray())}
        color="#22d3ee"
        lineWidth={1.5}
        opacity={0.4}
        transparent
      />
      <Points positions={positions} stride={3}>
        <PointMaterial
          transparent
          vertexColors
          size={10}
          sizeAttenuation
          color="#22d3ee"
          opacity={0.85}
        />
      </Points>
      {points.map((p, idx) => (
        <Text
          key={idx}
          position={[p.x, p.y + 3, p.z]}
          fontSize={2.2}
          color={colors[idx].getStyle()}
          outlineWidth={0.04}
          outlineColor="#0b1220"
          anchorX="center"
          anchorY="middle"
        >
          {data[idx].label}: {data[idx].count}
        </Text>
      ))}
    </group>
  );
}

export default function ActiveUsersSpiral() {
  const { timePeriod } = useDashboard();
  const { data, loading, error } = useActiveUsersData(timePeriod as any);

  return (
    <main className="active-spiral-page" aria-label="Active Users Spiral">
      <div className="active-spiral-header">
        <div>
          <h1>Active Users Spiral</h1>
          <p className="subtitle">
            Active users over time plotted on a 3D spiral. Drag to orbit; zoom
            to dive in.
          </p>
        </div>
        <div className="status-chip">
          {loading ? "Loading…" : error ? "Using fallback" : timePeriod}
        </div>
      </div>
      <div className="active-spiral-canvas">
        <Canvas dpr={[1, 2]} camera={{ position: [0, 10, 120], fov: 60 }}>
          <color attach="background" args={["#0b1220"]} />
          <fog attach="fog" args={["#0b1220", 80, 260]} />
          <ambientLight intensity={0.35} />
          <pointLight position={[80, 120, 90]} intensity={1.1} />
          <pointLight
            position={[-60, -40, -70]}
            intensity={0.5}
            color="#8ab4ff"
          />
          <Suspense fallback={null}>
            <SpiralPoints data={data} />
          </Suspense>
          <TrackballControls
            minDistance={40}
            maxDistance={240}
            zoomSpeed={0.9}
          />
        </Canvas>
      </div>
    </main>
  );
}
