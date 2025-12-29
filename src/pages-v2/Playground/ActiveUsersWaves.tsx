import * as THREE from "three";
import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { TrackballControls } from "@react-three/drei";
import { useDashboard } from "../../contexts/DashboardContext";
import { useActiveUsersData } from "./useActiveUsersData";

import "./ActiveUsersWaves.css";

type Cell = { pos: THREE.Vector3; h: number; color: string };

function WaveField({ data }: { data: { label: string; count: number }[] }) {
  const gridRef = useRef<THREE.Group>(null);
  const cells = useMemo<Cell[]>(() => {
    const cols = Math.ceil(Math.sqrt(data.length));
    const rows = Math.ceil(data.length / cols);
    const max = Math.max(...data.map((d) => d.count), 1);
    return data.map((d, idx) => {
      const x = (idx % cols) * 5 - (cols - 1) * 2.5;
      const z = Math.floor(idx / cols) * 5 - (rows - 1) * 2.5;
      const h = THREE.MathUtils.mapLinear(d.count, 0, max, 1.5, 8);
      const color = new THREE.Color()
        .setHSL(0.55 - 0.5 * (d.count / max), 0.8, 0.55)
        .getStyle();
      return { pos: new THREE.Vector3(x, 0, z), h, color };
    });
  }, [data]);

  useFrame(({ clock }) => {
    if (!gridRef.current) return;
    const t = clock.getElapsedTime();
    gridRef.current.children.forEach((child, idx) => {
      const m = child as THREE.Mesh;
      const base = cells[idx]?.h ?? 1.5;
      m.scale.y = 1 + Math.sin(t * 1.8 + idx * 0.3) * 0.2;
      m.position.y = (m.scale.y * base) / 2;
    });
  });

  return (
    <group ref={gridRef}>
      <ambientLight intensity={0.45} />
      <pointLight position={[60, 80, 90]} intensity={1.1} />
      <pointLight position={[-60, -40, -70]} intensity={0.5} color="#8ab4ff" />
      {cells.map((c, idx) => (
        <mesh key={idx} position={[c.pos.x, c.h / 2, c.pos.z]}>
          <boxGeometry args={[4, c.h, 4]} />
          <meshStandardMaterial
            color={c.color}
            emissive={c.color}
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function ActiveUsersWaves() {
  const { timePeriod } = useDashboard();
  const { data, loading, error } = useActiveUsersData(timePeriod as any);

  return (
    <div className="active-waves-page">
      <div className="active-waves-header">
        <div>
          <h1>Active Users Wavefield</h1>
          <p className="subtitle">
            Bars pulse like waves; height reflects activity.
          </p>
        </div>
        <div className="status-chip">
          {loading ? "Loading…" : error ? "Using fallback" : timePeriod}
        </div>
      </div>
      <div className="active-waves-canvas">
        <Canvas dpr={[1, 2]} camera={{ position: [0, 30, 80], fov: 55 }}>
          <color attach="background" args={["#0b0f1c"]} />
          <fog attach="fog" args={["#0b0f1c", 50, 200]} />
          <Suspense fallback={null}>
            <WaveField data={data} />
          </Suspense>
          <TrackballControls
            minDistance={25}
            maxDistance={180}
            zoomSpeed={0.9}
          />
        </Canvas>
      </div>
    </div>
  );
}
