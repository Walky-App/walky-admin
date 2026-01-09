import * as THREE from "three";
import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Line, Text, TrackballControls } from "@react-three/drei";
import { useDashboard } from "../../contexts/DashboardContext";
import { useActiveUsersData } from "./useActiveUsersData";

import "./ActiveUsersFunnel.css";

function FunnelBars({ data }: { data: { label: string; count: number }[] }) {
  const bars = useMemo(() => {
    const maxCount = Math.max(...data.map((d) => d.count), 1);
    return data.map((d, idx) => {
      const t = idx / Math.max(1, data.length - 1);
      const radiusTop = 65;
      const radiusBottom = 12;
      const height = 55;
      const radius = THREE.MathUtils.lerp(radiusTop, radiusBottom, t);
      const y = THREE.MathUtils.lerp(0, -height, t);
      const angle = (idx / data.length) * Math.PI * 2;
      const x = Math.cos(angle) * radius * 0.6;
      const z = Math.sin(angle) * radius * 0.6;
      const barHeight = THREE.MathUtils.mapLinear(
        d.count,
        0,
        maxCount,
        1.5,
        10
      );
      const color = new THREE.Color().setHSL(
        0.1 + 0.5 * (d.count / maxCount),
        0.75,
        0.58
      );
      return { ...d, position: new THREE.Vector3(x, y, z), barHeight, color };
    });
  }, [data]);

  return (
    <group>
      <ambientLight intensity={0.4} />
      <pointLight position={[70, 80, 90]} intensity={1.1} />
      <pointLight position={[-60, -40, -70]} intensity={0.5} color="#8ab4ff" />

      {/* translucent funnel shell */}
      <mesh rotation={[Math.PI, 0, 0]} position={[0, -28, 0]}>
        <coneGeometry args={[65, 70, 48, 1, true]} />
        <meshStandardMaterial
          color="#64748b"
          transparent
          opacity={0.12}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* rim cross */}
      <Line
        points={[new THREE.Vector3(65, 0, 0), new THREE.Vector3(-65, 0, 0)]}
        color="#a5b4fc"
        lineWidth={2}
        opacity={0.5}
        transparent
      />
      <Line
        points={[new THREE.Vector3(0, 0, 65), new THREE.Vector3(0, 0, -65)]}
        color="#a5b4fc"
        lineWidth={2}
        opacity={0.5}
        transparent
      />

      {bars.map((bar, idx) => (
        <group key={idx} position={bar.position.toArray()}>
          <mesh position={[0, bar.barHeight / 2, 0]}>
            <boxGeometry args={[4.5, bar.barHeight, 4.5]} />
            <meshStandardMaterial
              color={bar.color.getStyle()}
              emissive={bar.color.getStyle()}
              emissiveIntensity={0.3}
            />
          </mesh>
          <Text
            position={[0, bar.barHeight + 1.8, 0]}
            fontSize={1.4}
            color="#e5e7eb"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.04}
            outlineColor="#0b1020"
          >
            {bar.label}: {bar.count}
          </Text>
        </group>
      ))}
    </group>
  );
}

export default function ActiveUsersFunnel() {
  const { timePeriod } = useDashboard();
  const { data, loading, error } = useActiveUsersData(timePeriod as any);

  return (
    <main className="active-funnel-page" aria-label="Active Users Funnel">
      <div className="active-funnel-header">
        <div>
          <h1>Active Users Funnel</h1>
          <p className="subtitle">
            Tapered funnel with bars sized by activity; drag to orbit and zoom.
          </p>
        </div>
        <div className="status-chip">
          {loading ? "Loading…" : error ? "Using fallback" : timePeriod}
        </div>
      </div>
      <div className="active-funnel-canvas">
        <Canvas dpr={[1, 2]} camera={{ position: [0, 30, 150], fov: 55 }}>
          <color attach="background" args={["#0b1020"]} />
          <fog attach="fog" args={["#0b1020", 80, 260]} />
          <Suspense fallback={null}>
            <FunnelBars data={data} />
          </Suspense>
          <TrackballControls
            minDistance={30}
            maxDistance={240}
            zoomSpeed={0.9}
          />
        </Canvas>
      </div>
    </main>
  );
}
