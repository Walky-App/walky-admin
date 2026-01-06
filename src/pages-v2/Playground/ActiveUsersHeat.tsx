import * as THREE from "three";
import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { TrackballControls, Text } from "@react-three/drei";
import { useDashboard } from "../../contexts/DashboardContext";
import { useActiveUsersData } from "./useActiveUsersData";

import "./ActiveUsersHeat.css";

function HeatCells({ data }: { data: { label: string; count: number }[] }) {
  const grid = useMemo(() => {
    const cols = Math.ceil(Math.sqrt(data.length));
    const rows = Math.ceil(data.length / cols);
    const cells = data.map((d, idx) => {
      const x = (idx % cols) - cols / 2;
      const y = Math.floor(idx / cols) - rows / 2;
      return { ...d, x, y };
    });
    const max = Math.max(...data.map((d) => d.count), 1);
    return { cells, cols, rows, max };
  }, [data]);

  return (
    <group>
      <ambientLight intensity={0.45} />
      <pointLight position={[40, 60, 80]} intensity={0.9} />
      <pointLight position={[-40, -40, -60]} intensity={0.5} color="#a5b4fc" />
      {grid.cells.map((cell, idx) => {
        const t = cell.count / grid.max;
        const color = new THREE.Color().setHSL(
          0.55 - 0.4 * t,
          0.75,
          0.55 + 0.2 * t
        );
        const height = 1 + t * 6;
        return (
          <group key={idx} position={[cell.x * 6, height / 2, cell.y * 6]}>
            <mesh>
              <boxGeometry args={[5, height, 5]} />
              <meshStandardMaterial
                color={color.getStyle()}
                emissive={color.getStyle()}
                emissiveIntensity={0.25}
              />
            </mesh>
            <Text
              position={[0, height / 2 + 1.6, 0]}
              fontSize={1.4}
              color="#e5e7eb"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.04}
              outlineColor="#0b1220"
            >
              {cell.label}
            </Text>
          </group>
        );
      })}
    </group>
  );
}

export default function ActiveUsersHeat() {
  const { timePeriod } = useDashboard();
  const { data, loading, error } = useActiveUsersData(timePeriod as any);

  return (
    <main className="active-heat-page" aria-label="Active Users Heat Grid">
      <div className="active-heat-header">
        <div>
          <h1>Active Users Heat Grid</h1>
          <p className="subtitle">
            Each cell height and hue reflect activity; higher is hotter.
          </p>
        </div>
        <div className="status-chip">
          {loading ? "Loading…" : error ? "Using fallback" : timePeriod}
        </div>
      </div>
      <div className="active-heat-canvas">
        <Canvas dpr={[1, 2]} camera={{ position: [0, 45, 95], fov: 60 }}>
          <color attach="background" args={["#0d0f1a"]} />
          <fog attach="fog" args={["#0d0f1a", 60, 220]} />
          <Suspense fallback={null}>
            <HeatCells data={data} />
          </Suspense>
          <TrackballControls
            minDistance={30}
            maxDistance={180}
            zoomSpeed={0.9}
          />
        </Canvas>
      </div>
    </main>
  );
}
