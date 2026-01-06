import * as THREE from "three";
import { Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line, Text, TrackballControls } from "@react-three/drei";

import "./InterestChord.css";

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

const counts: Record<string, number> = {
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

interface NodeData {
  label: string;
  count: number;
  position: THREE.Vector3;
}

interface Chord {
  a: THREE.Vector3;
  b: THREE.Vector3;
  weight: number;
}

function Node({ node }: { node: NodeData }) {
  const size = THREE.MathUtils.mapLinear(node.count, 1, 44, 1, 4);
  return (
    <group position={node.position.toArray()}>
      <mesh>
        <sphereGeometry args={[size, 22, 22]} />
        <meshStandardMaterial
          color="#67e8f9"
          emissive="#22d3ee"
          emissiveIntensity={0.4}
        />
      </mesh>
      <Text
        position={[0, size + 2, 0]}
        fontSize={2}
        color="#e5e7eb"
        outlineWidth={0.05}
        outlineColor="#0f172a"
        anchorX="center"
        anchorY="middle"
      >
        {node.label}
      </Text>
    </group>
  );
}

function Chords({ chords }: { chords: Chord[] }) {
  const lineRefs = useMemo(
    () => chords.map(() => ({ opacity: Math.random() })),
    [chords]
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    lineRefs.forEach((ref, i) => {
      // Slow breathing opacity per chord
      ref.opacity = 0.15 + (Math.sin(t * 0.8 + i) + 1) * 0.25;
    });
  });

  return (
    <>
      {chords.map((chord, idx) => (
        <Line
          key={idx}
          points={[chord.a.toArray(), chord.b.toArray()]}
          color="#22d3ee"
          lineWidth={1}
          transparent
          opacity={lineRefs[idx].opacity}
        />
      ))}
    </>
  );
}

function RingGraph() {
  const { nodes, chords } = useMemo(() => {
    const top = [...interests]
      .map((i) => ({
        label: i.label,
        count: counts[i.label.toLowerCase() as keyof typeof counts] ?? 1,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 36);

    const radius = 70;
    const nodes: NodeData[] = top.map((item, idx) => {
      const angle = (idx / top.length) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      return {
        label: `${idx + 1}. ${item.label}`,
        count: item.count,
        position: new THREE.Vector3(x, 0, z),
      };
    });

    const chords: Chord[] = [];
    for (let i = 0; i < nodes.length; i++) {
      const next = (i + 1) % nodes.length;
      chords.push({ a: nodes[i].position, b: nodes[next].position, weight: 1 });
      // Cross chords to create a web
      const skip = (i + Math.floor(nodes.length / 3)) % nodes.length;
      chords.push({ a: nodes[i].position, b: nodes[skip].position, weight: 1 });
    }

    return { nodes, chords };
  }, []);

  return (
    <group>
      <ambientLight intensity={0.3} />
      <pointLight position={[60, 80, 90]} intensity={1.2} />
      <pointLight position={[-60, -40, -70]} intensity={0.6} color="#a5b4fc" />

      <Chords chords={chords} />
      {nodes.map((node) => (
        <Node key={node.label} node={node} />
      ))}
    </group>
  );
}

export default function InterestChord() {
  return (
    <main className="interest-chord-page" aria-label="Interest Chord">
      <div className="interest-chord-header">
        <div>
          <h1>Interest Chord</h1>
          <p className="subtitle">
            A ring of the most popular interests linked with animated chords.
            Drag to orbit and zoom to inspect the web.
          </p>
        </div>
      </div>
      <div className="interest-chord-canvas">
        <Canvas dpr={[1, 2]} camera={{ position: [0, 55, 140], fov: 55 }}>
          <color attach="background" args={["#0b1324"]} />
          <fog attach="fog" args={["#0b1324", 80, 260]} />
          <Suspense fallback={null}>
            <RingGraph />
          </Suspense>
          <TrackballControls
            minDistance={40}
            maxDistance={220}
            zoomSpeed={0.9}
          />
        </Canvas>
      </div>
    </main>
  );
}
