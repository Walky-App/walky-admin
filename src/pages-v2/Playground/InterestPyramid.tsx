import * as THREE from "three";
import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, TrackballControls, Line } from "@react-three/drei";

import "./InterestPyramid.css";

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

interface TierItem {
  label: string;
  count: number;
  position: THREE.Vector3;
  tier: number;
}

function Block({ item }: { item: TierItem }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const wobble = 1 + Math.sin(t * 0.9 + item.count) * 0.03;
    ref.current.scale.set(wobble, wobble, wobble);
  });

  const size = THREE.MathUtils.mapLinear(item.count, 1, 44, 2.2, 4.5);
  const hue = THREE.MathUtils.mapLinear(item.tier, 0, 5, 180, 320);
  const color = new THREE.Color(`hsl(${hue}, 80%, 65%)`).getStyle();

  return (
    <group position={item.position.toArray()}>
      <mesh ref={ref}>
        <boxGeometry args={[size, 1.6, size]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.25}
        />
      </mesh>
      <Text
        position={[0, 1.6, 0]}
        fontSize={1.4}
        color="#e5e7eb"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#0b1020"
      >
        {item.label}
      </Text>
    </group>
  );
}

function Pyramid() {
  const tiers = useMemo(() => {
    const sorted = [...interests]
      .map((i) => ({
        label: i.label,
        count: counts[i.label.toLowerCase() as keyof typeof counts] ?? 1,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 30);

    const perTier = 6;
    const layers: TierItem[] = [];
    const maxRadius = 65; // wide mouth
    const minRadius = 10; // narrow tail
    const totalHeight = 40; // vertical span

    sorted.forEach((item, idx) => {
      const tier = Math.floor(idx / perTier); // 0 is top
      const within = idx % perTier;
      const itemsInThisTier = Math.min(perTier, sorted.length - tier * perTier);
      const tiersCount = Math.ceil(sorted.length / perTier);
      const t = tiersCount > 1 ? tier / (tiersCount - 1) : 0;
      const radius = THREE.MathUtils.lerp(maxRadius, minRadius, t);
      const y = THREE.MathUtils.lerp(0, -totalHeight, t);
      const angle = (within / itemsInThisTier) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      layers.push({
        label: `${idx + 1}. ${item.label}`,
        count: item.count,
        position: new THREE.Vector3(x, y, z),
        tier,
      });
    });

    return layers;
  }, []);

  return (
    <group>
      <ambientLight intensity={0.35} />
      <pointLight position={[80, 120, 90]} intensity={1.1} />
      <pointLight position={[-60, -40, -70]} intensity={0.5} color="#8ab4ff" />

      {/* Semi-transparent funnel shell for context */}
      <mesh rotation={[Math.PI, 0, 0]} position={[0, -20, 0]}>
        <coneGeometry args={[65, 50, 48, 1, true]} />
        <meshStandardMaterial
          color="#64748b"
          transparent
          opacity={0.12}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Rim highlight */}
      <Line
        points={[new THREE.Vector3(65, 0, 0), new THREE.Vector3(-65, 0, 0)]}
        color="#a5b4fc"
        lineWidth={2}
        transparent
        opacity={0.5}
      />
      <Line
        points={[new THREE.Vector3(0, 0, 65), new THREE.Vector3(0, 0, -65)]}
        color="#a5b4fc"
        lineWidth={2}
        transparent
        opacity={0.5}
      />

      {tiers.map((item) => (
        <Block key={item.label} item={item} />
      ))}
    </group>
  );
}

export default function InterestPyramid() {
  return (
    <main className="interest-pyramid-page" aria-label="Interest Pyramid">
      <div className="interest-pyramid-header">
        <div>
          <h1>Interest Pyramid</h1>
          <p className="subtitle">
            A stacked funnel of the top interests, layered by popularity. Drag
            to orbit; zoom to inspect tiers.
          </p>
        </div>
      </div>
      <div className="interest-pyramid-canvas">
        <Canvas dpr={[1, 2]} camera={{ position: [0, 30, 150], fov: 55 }}>
          <color attach="background" args={["#0b1020"]} />
          <fog attach="fog" args={["#0b1020", 80, 260]} />
          <Suspense fallback={null}>
            <Pyramid />
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
