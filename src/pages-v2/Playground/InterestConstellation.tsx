import * as THREE from "three";
import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line, Text, TrackballControls } from "@react-three/drei";

import "./InterestConstellation.css";

// Reuse the same interests and counts from InterestCloud
const interests = [
  { label: "basketball" },
  { label: "gaming" },
  { label: "coffee" },
  { label: "football" },
  { label: "disc golf" },
  { label: "billiards" },
  { label: "gym" },
  { label: "soccer" },
  { label: "pilates" },
  { label: "cosplay" },
  { label: "studying" },
  { label: "baking" },
  { label: "networking" },
  { label: "hip hop" },
  { label: "hiking" },
  { label: "knitting" },
  { label: "ballet" },
  { label: "photography" },
  { label: "larping" },
  { label: "cooking" },
  { label: "golf" },
  { label: "food" },
  { label: "yoga" },
  { label: "hockey" },
  { label: "acting" },
  { label: "pickleball" },
  { label: "fishing" },
  { label: "running" },
  { label: "cycling" },
  { label: "origami" },
  { label: "scuba" },
  { label: "swimming" },
  { label: "brewing" },
  { label: "cocktails" },
  { label: "volleyball" },
  { label: "3D modeling" },
  { label: "lacrosse" },
  { label: "sculpting" },
  { label: "meditation" },
  { label: "lifting" },
  { label: "framing" },
  { label: "Drinks" },
  { label: "dance" },
  { label: "climbing" },
  { label: "Movies" },
  { label: "decorating" },
  { label: "speakers" },
  { label: "books" },
  { label: "djing" },
  { label: "poetry" },
  { label: "editing" },
  { label: "hosting" },
  { label: "surfing" },
  { label: "wine" },
  { label: "celebration" },
  { label: "tiktok" },
  { label: "sketching" },
  { label: "fencing" },
  { label: "painting" },
  { label: "chess" },
  { label: "sewing" },
  { label: "thrifting" },
  { label: "pottery" },
  { label: "tennis" },
  { label: "weaving" },
  { label: "murals" },
  { label: "rowing" },
  { label: "volunteer" },
  { label: "jogging" },
  { label: "frisbee" },
  { label: "martial arts" },
  { label: "kayaking" },
  { label: "poker" },
  { label: "caligraphy" },
  { label: "songwriting" },
  { label: "salsa" },
  { label: "drama" },
  { label: "screenplay" },
  { label: "crossfit" },
  { label: "skateboard" },
  { label: "tea" },
  { label: "cards" },
  { label: "singing" },
  { label: "walking" },
  { label: "crocheting" },
  { label: "skating" },
  { label: "comedy" },
  { label: "anime" },
  { label: "ski & board" },
  { label: "pub speaking" },
  { label: "film" },
  { label: "tabletop" },
  { label: "Boating" },
  { label: "Arcade" },
  { label: "Amusement Park" },
  { label: "Videography" },
  { label: "Badminton" },
  { label: "Programming" },
  { label: "Dinner Parties" },
  { label: "Beach" },
];

const interestCounts: Record<string, number> = {
  basketball: 44,
  gaming: 43,
  coffee: 43,
  football: 42,
  "disc golf": 35,
  billiards: 34,
  gym: 32,
  soccer: 31,
  pilates: 30,
  cosplay: 30,
  studying: 30,
  baking: 29,
  networking: 25,
  "hip hop": 25,
  hiking: 22,
  knitting: 21,
  ballet: 21,
  photography: 21,
  larping: 21,
  cooking: 21,
  golf: 20,
  food: 20,
  yoga: 19,
  hockey: 19,
  acting: 18,
  pickleball: 18,
  fishing: 18,
  running: 17,
  cycling: 17,
  origami: 17,
  scuba: 16,
  swimming: 15,
  brewing: 15,
  cocktails: 15,
  volleyball: 14,
  "3D modeling": 14,
  lacrosse: 14,
  sculpting: 13,
  meditation: 13,
  lifting: 12,
  framing: 12,
  Drinks: 12,
  dance: 12,
  climbing: 12,
  Movies: 12,
  decorating: 11,
  speakers: 11,
  books: 11,
  djing: 11,
  poetry: 10,
  editing: 10,
  hosting: 10,
  surfing: 10,
  wine: 10,
  celebration: 10,
  tiktok: 9,
  sketching: 9,
  fencing: 9,
  painting: 9,
  chess: 9,
  sewing: 9,
  thrifting: 9,
  pottery: 9,
  tennis: 8,
  weaving: 8,
  murals: 8,
  rowing: 8,
  volunteer: 8,
  jogging: 8,
  frisbee: 8,
  "martial arts": 8,
  kayaking: 8,
  poker: 8,
  caligraphy: 7,
  songwriting: 7,
  salsa: 7,
  drama: 7,
  screenplay: 7,
  crossfit: 7,
  skateboard: 7,
  tea: 7,
  cards: 7,
  singing: 6,
  walking: 6,
  crocheting: 6,
  skating: 5,
  comedy: 5,
  anime: 5,
  "ski & board": 4,
  "pub speaking": 4,
  film: 4,
  tabletop: 3,
  Boating: 2,
  Arcade: 1,
  "Amusement Park": 1,
  Videography: 1,
  Badminton: 1,
  Programming: 1,
  "Dinner Parties": 1,
  Beach: 1,
};

const normalizedCounts: Record<string, number> = Object.fromEntries(
  Object.entries(interestCounts).map(([key, value]) => [
    key.toLowerCase(),
    value,
  ])
);

const ranked = [...interests]
  .map((i) => ({
    label: i.label,
    count: normalizedCounts[i.label.toLowerCase()] ?? 1,
  }))
  .sort((a, b) => b.count - a.count);

const TOP_N = 48; // show the most popular items only for clarity

interface NodeData {
  label: string;
  count: number;
  position: THREE.Vector3;
  color: string;
}

interface EdgeData {
  a: THREE.Vector3;
  b: THREE.Vector3;
  strength: number;
}

function fibonacciSpherePositions(n: number, radius: number) {
  const points: THREE.Vector3[] = [];
  const offset = 2 / n;
  const increment = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = i * offset - 1 + offset / 2;
    const r = Math.sqrt(1 - y * y);
    const phi = i * increment;
    const x = Math.cos(phi) * r;
    const z = Math.sin(phi) * r;
    points.push(new THREE.Vector3(x, y, z).multiplyScalar(radius));
  }
  return points;
}

function Node({ node }: { node: NodeData }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const scale = 0.9 + Math.sin(t * 1.2 + node.count) * 0.08;
    meshRef.current.scale.setScalar(scale);
  });

  const size = THREE.MathUtils.mapLinear(node.count, 1, 44, 0.8, 3.4);

  return (
    <group position={node.position.toArray()}>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <sphereGeometry args={[size, 24, 24]} />
        <meshStandardMaterial
          color={node.color}
          emissive={node.color}
          emissiveIntensity={0.35}
        />
      </mesh>
      <Text
        fontSize={2.4}
        position={[0, size + 2.5, 0]}
        color="#e5e7eb"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.06}
        outlineColor="#000000"
      >
        {node.label}
      </Text>
    </group>
  );
}

function Constellation() {
  const nodesAndEdges = useMemo(() => {
    const popular = ranked.slice(0, TOP_N);
    const positions = fibonacciSpherePositions(popular.length, 60);

    const nodes: NodeData[] = popular.map((item, idx) => {
      const rank = idx + 1;
      const highlight = rank <= 3;
      const color = highlight
        ? rank === 1
          ? "#fbbf24"
          : rank === 2
          ? "#d1d5db"
          : "#f59e0b"
        : "#6ee7b7";
      return {
        label: `${rank}. ${item.label}`,
        count: item.count,
        position: positions[idx],
        color,
      };
    });

    // Connect each node to its three nearest neighbors
    const edges: EdgeData[] = [];
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      const distances = nodes
        .map((n, j) => ({ j, dist: a.position.distanceTo(n.position) }))
        .filter((d) => d.j !== i)
        .sort((a, b) => a.dist - b.dist)
        .slice(0, 3);
      distances.forEach(({ j, dist }) => {
        // Avoid duplicating edges by ordering indexes
        const exists = edges.some(
          (e) =>
            (e.a === nodes[i].position && e.b === nodes[j].position) ||
            (e.a === nodes[j].position && e.b === nodes[i].position)
        );
        if (!exists) {
          edges.push({
            a: nodes[i].position,
            b: nodes[j].position,
            strength: dist,
          });
        }
      });
    }

    return { nodes, edges };
  }, []);

  return (
    <group>
      <ambientLight intensity={0.3} />
      <pointLight position={[50, 50, 50]} intensity={1.2} />
      <pointLight position={[-50, -40, -30]} intensity={0.5} color="#8ab4ff" />

      {nodesAndEdges.edges.map((edge, idx) => (
        <Line
          key={idx}
          points={[edge.a.toArray(), edge.b.toArray()]}
          color="#4ade80"
          lineWidth={1}
          transparent
          opacity={0.3}
        />
      ))}

      {nodesAndEdges.nodes.map((node) => (
        <Node key={node.label} node={node} />
      ))}
    </group>
  );
}

export default function InterestConstellation() {
  return (
    <div className="interest-constellation-page">
      <div className="interest-constellation-header">
        <div>
          <h1>Interest Constellation</h1>
          <p className="subtitle">
            The top interests arranged on a sphere, connected to their nearest
            neighbors. Drag to orbit and zoom to explore clusters.
          </p>
        </div>
      </div>
      <div className="interest-constellation-canvas">
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 90], fov: 70 }}>
          <color attach="background" args={["#0b1220"]} />
          <fog attach="fog" args={["#0b1220", 60, 220]} />
          <Suspense fallback={null}>
            <Constellation />
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
