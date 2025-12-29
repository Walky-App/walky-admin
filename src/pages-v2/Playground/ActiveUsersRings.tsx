import * as THREE from "three";
import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Line, Text, TrackballControls } from "@react-three/drei";
import { useDashboard } from "../../contexts/DashboardContext";
import { useActiveUsersData } from "./useActiveUsersData";

import "./ActiveUsersRings.css";

function Rings({ data }: { data: { label: string; count: number }[] }) {
  const rings = useMemo(() => {
    const max = Math.max(...data.map((d) => d.count), 1);
    return data.map((d, idx) => {
      const t = d.count / max;
      const radius = 10 + idx * 3.2;
      const arc = Math.PI * 2 * Math.max(0.08, t);
      const color = new THREE.Color().setHSL(0.08 + 0.6 * t, 0.75, 0.6);
      return { radius, arc, color, label: d.label, count: d.count };
    });
  }, [data]);

  return (
    <group>
      <ambientLight intensity={0.4} />
      <pointLight position={[70, 80, 90]} intensity={1.1} />
      <pointLight position={[-60, -40, -70]} intensity={0.5} color="#8ab4ff" />

      {rings.map((ring, idx) => {
        const segments = 64;
        const points: THREE.Vector3[] = [];
        for (let i = 0; i <= segments; i++) {
          const theta = (i / segments) * ring.arc - ring.arc / 2;
          points.push(
            new THREE.Vector3(
              Math.cos(theta) * ring.radius,
              idx * 0.4,
              Math.sin(theta) * ring.radius
            )
          );
        }
        return (
          <group key={idx}>
            <Line
              points={points.map((p) => p.toArray())}
              color={ring.color.getStyle()}
              lineWidth={2}
              transparent
              opacity={0.8}
            />
            <Text
              position={[ring.radius + 4, idx * 0.4, 0]}
              fontSize={1.5}
              color="#e5e7eb"
              anchorX="left"
              anchorY="middle"
              outlineWidth={0.04}
              outlineColor="#0b1220"
            >
              {ring.label}: {ring.count}
            </Text>
          </group>
        );
      })}
    </group>
  );
}

export default function ActiveUsersRings() {
  const { timePeriod } = useDashboard();
  const { data, loading, error } = useActiveUsersData(timePeriod as any);

  return (
    <div className="active-rings-page">
      <div className="active-rings-header">
        <div>
          <h1>Active Users Rings</h1>
          <p className="subtitle">
            Layered arcs sized by activity; outer rings are later periods.
          </p>
        </div>
        <div className="status-chip">
          {loading ? "Loading…" : error ? "Using fallback" : timePeriod}
        </div>
      </div>
      <div className="active-rings-canvas">
        <Canvas dpr={[1, 2]} camera={{ position: [0, 25, 110], fov: 55 }}>
          <color attach="background" args={["#0b0f1c"]} />
          <fog attach="fog" args={["#0b0f1c", 60, 220]} />
          <Suspense fallback={null}>
            <Rings data={data} />
          </Suspense>
          <TrackballControls
            minDistance={30}
            maxDistance={200}
            zoomSpeed={0.9}
          />
        </Canvas>
      </div>
    </div>
  );
}
