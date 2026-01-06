import * as THREE from "three";
import { useRef, useState, useMemo, useEffect, Suspense } from "react";
import type { ComponentProps } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Billboard, Text, TrackballControls, Image } from "@react-three/drei";

import "./InterestCloud.css";

// Labels taken from interest list
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

const interestCountsNormalized: Record<string, number> = Object.entries(
  interestCounts
).reduce((acc, [key, value]) => {
  acc[key.toLowerCase()] = value;
  return acc;
}, {} as Record<string, number>);

const rankedByCount = [...interests]
  .map((item) => ({
    label: item.label,
    count: interestCountsNormalized[item.label.toLowerCase()] ?? 1,
  }))
  .sort((a, b) => b.count - a.count);

const rankMap: Record<string, number> = rankedByCount.reduce(
  (acc, curr, idx) => {
    const key = curr.label.toLowerCase();
    if (acc[key] === undefined) {
      acc[key] = idx + 1;
    }
    return acc;
  },
  {} as Record<string, number>
);

const iconPool = [
  "https://cdn-stg.walkyapp.com/interests/icons/basketball_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/gaming_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/coffee_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/football_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/disc_golf_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/billiards_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/gym_icon.png",
  "https://cdn-stg.walkyapp.com/interests/images/0e663fa5-97f8-4652-aab2-72117d660d5d.png",
  "https://cdn-stg.walkyapp.com/interests/icons/pilates_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/cosplay_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/studying_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/baking_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/networking_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/hip_hop_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/hiking_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/knitting_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/ballet_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/photography_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/larping_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/cooking_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/golf_icon.png",
  "https://cdn-stg.walkyapp.com/interests/images/c588d33b-90ff-4f20-8160-e49913bb7216.png",
  "https://cdn-stg.walkyapp.com/interests/icons/yoga_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/hockey_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/acting_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/pickleball_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/fishing_icon.png",
  "https://cdn-stg.walkyapp.com/interests/images/af6e5b86-a5d1-41db-a258-de9725601f1f.png",
  "https://cdn-stg.walkyapp.com/interests/icons/cycling_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/origami_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/scuba_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/swimming_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/brewing_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/cocktails_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/volleyball_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/3d_modeling_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/lacrosse_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/sculpting_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/meditation_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/lifting_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/framing_icon.png",
  "https://cdn-stg.walkyapp.com/interests/images/bd1bd209-71cc-4697-9380-aa377a5269a9.png",
  "https://cdn-stg.walkyapp.com/interests/icons/dance_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/climbing_icon.png",
  "https://cdn-stg.walkyapp.com/interests/images/89678c06-8486-4778-a13e-2caeaaf62e7b.png",
  "https://cdn-stg.walkyapp.com/interests/icons/decorating_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/speakers_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/books_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/djing_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/poetry_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/editing_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/hosting_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/surfing_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/wine_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/celebration_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/tiktok_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/sketching_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/fencing_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/painting_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/chess_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/sewing_icon.png",
  "https://cdn-stg.walkyapp.com/interests/images/3ef44707-d2d5-4492-8b94-1ddc8d53d039.png",
  "https://cdn-stg.walkyapp.com/interests/icons/pottery_icon.png",
  "https://cdn-stg.walkyapp.com/interests/images/1ad79e28-860e-4285-b0cb-560db8e1986b.png",
  "https://cdn-stg.walkyapp.com/interests/icons/weaving_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/murals_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/rowing_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/volunteer_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/jogging_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/frisbee_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/martial_arts_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/kayaking_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/poker_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/caligraphy_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/songwriting_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/salsa_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/drama_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/screenplay_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/crossfit_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/skateboard_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/tea_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/cards_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/singing_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/walking_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/crocheting_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/skating_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/comedy_icon.png",
  "https://cdn-stg.walkyapp.com/interests/images/1530a41f-b952-4296-baa8-d327da7ef0d0.png",
  "https://cdn-stg.walkyapp.com/interests/icons/ski_&_board_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/pub_speaking_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/film_icon.png",
  "https://cdn-stg.walkyapp.com/interests/icons/tabletop_icon.png",
  "https://cdn-stg.walkyapp.com/interests/images/3f7b3c6a-c191-4838-9376-e3541c00782c.png",
  "https://cdn-stg.walkyapp.com/interests/images/2aa6d834-42f2-418a-a15b-94ea1a874b15.png",
  "https://cdn-stg.walkyapp.com/interests/images/152f3f53-3b80-44ed-a3ac-1ae377e746ce.png",
  "https://cdn-stg.walkyapp.com/interests/images/2deb4751-1b97-4f96-b198-f68275aa3c1d.png",
  "https://cdn-stg.walkyapp.com/interests/images/b2b5b8b7-a7e3-4fcf-9985-8911402e7d43.png",
  "https://cdn-stg.walkyapp.com/interests/images/6023b730-5d6e-4045-b66e-a99838699f5e.png",
  "https://cdn-stg.walkyapp.com/interests/images/d194d5f9-17b2-40e1-b9ab-ec041d1faf5d.png",
  "https://cdn-stg.walkyapp.com/interests/images/03fd412e-3be6-46fe-8aa9-58ee6281afed.png",
];

const itemsWithIcons = interests.map((item, i) => ({
  ...item,
  count: interestCountsNormalized[item.label.toLowerCase()] ?? 1,
  rank: rankMap[item.label.toLowerCase()] ?? i + 1,
  icon: iconPool[i % iconPool.length],
}));

const counts = itemsWithIcons.map((item) => item.count);
const MIN_COUNT = Math.min(...counts);
const MAX_COUNT = Math.max(...counts);

function Word({
  item,
  ...props
}: {
  item: { label: string; icon: string; count: number; rank: number };
} & ComponentProps<typeof Billboard>) {
  const color = new THREE.Color();
  const fontProps = {
    // Use default Drei font; the bundled Inter file is not present locally.
    letterSpacing: -0.05,
    lineHeight: 1,
    "material-toneMapped": false,
  } as const;
  const fontSize = useMemo(() => {
    const minCount = MIN_COUNT;
    const maxCount = MAX_COUNT;
    const clamped = Math.min(maxCount, Math.max(minCount, item.count || 1));
    const minSize = 1.2;
    const maxSize = 8;
    const t =
      maxCount === minCount ? 0 : (clamped - minCount) / (maxCount - minCount);
    const eased = Math.pow(t, 0.65); // emphasize larger counts
    return minSize + eased * (maxSize - minSize);
  }, [item.count]);
  const baseColor = useMemo(() => {
    if (item.rank === 1) return "#fbbf24"; // gold
    if (item.rank === 2) return "#d1d5db"; // silver
    if (item.rank === 3) return "#f59e0b"; // bronze-ish
    return "white";
  }, [item.rank]);
  const ref = useRef<THREE.Mesh | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const [hovered, setHovered] = useState(false);
  const over = (e: any) => (e.stopPropagation(), setHovered(true));
  const out = () => setHovered(false);

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered]);

  useFrame((state, _delta) => {
    if (!ref.current) return;
    const mat = ref.current.material as
      | THREE.MeshBasicMaterial
      | THREE.MeshBasicMaterial[];
    const targetColor = color.set(hovered ? "#fa2720" : baseColor);
    if (Array.isArray(mat)) {
      mat.forEach((m) => m.color.lerp(targetColor, 0.1));
    } else {
      mat.color.lerp(targetColor, 0.1);
    }

    if (groupRef.current) {
      const target = hovered ? 1.25 : 1;
      groupRef.current.scale.lerp(
        new THREE.Vector3(target, target, target),
        0.12
      );

      // Gentle individual bobbing to animate each word in 3D space
      const phase = item.rank * 0.7;
      groupRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 0.9 + phase) * 0.6;
    }
  });

  return (
    <Billboard {...props} onPointerOver={over} onPointerOut={out}>
      <group ref={groupRef}>
        <Image
          url={item.icon}
          transparent
          toneMapped={false}
          scale={[3, 3]}
          position={[0, 2.5, 0]}
          visible={hovered}
        />
        <Text
          ref={ref as any}
          onClick={() => console.log("clicked", item.label)}
          {...fontProps}
          fontSize={fontSize}
          position={[0, -1.5, 0]}
        >
          {item.rank}. {item.label}
        </Text>
      </group>
    </Billboard>
  );
}

function Cloud({
  items = [],
  radius = 60, // spread labels out
}: {
  items: { label: string; icon: string; count: number; rank: number }[];
  radius?: number;
}) {
  const cloudRef = useRef<THREE.Group | null>(null);
  const words = useMemo(() => {
    const temp: [
      THREE.Vector3,
      { label: string; icon: string; count: number; rank: number }
    ][] = [];
    const n = items.length || 1;
    const offset = 2 / n;
    const increment = Math.PI * (3 - Math.sqrt(5)); // golden angle
    for (let i = 0; i < n; i++) {
      const y = i * offset - 1 + offset / 2;
      const r = Math.sqrt(1 - y * y);
      const theta = i * increment;
      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;
      temp.push([new THREE.Vector3(x, y, z).multiplyScalar(radius), items[i]]);
    }
    return temp;
  }, [items, radius]);

  useFrame((_state) => {
    if (!cloudRef.current) return;
    // Keep the cloud orientation fixed; no automatic spin
  });

  return (
    <group ref={cloudRef}>
      {words.map(([pos, item], index) => (
        <Word key={item.label ?? index} position={pos} item={item} />
      ))}
    </group>
  );
}

export default function InterestCloud() {
  const [mode, setMode] = useState<"cloud" | "list">("cloud");

  return (
    <main className="interest-cloud-page" aria-label="Interest Cloud">
      <div className="interest-cloud-header">
        <div>
          <h1>Interest Cloud</h1>
          <p className="subtitle">
            Hover the words to highlight; drag to orbit.
          </p>
        </div>
        <button
          className="interest-toggle"
          data-testid="interest-toggle-button"
          onClick={() => setMode((m) => (m === "cloud" ? "list" : "cloud"))}
        >
          {mode === "cloud" ? "List view" : "Cloud view"}
        </button>
      </div>
      {mode === "cloud" ? (
        <div className="interest-cloud-canvas">
          <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 35], fov: 90 }}>
            <fog attach="fog" args={["#202025", 0, 80]} />
            <Suspense fallback={null}>
              <group rotation={[10, 10.5, 10]}>
                <Cloud items={itemsWithIcons} />
              </group>
            </Suspense>
            <TrackballControls
              minDistance={5}
              maxDistance={120}
              zoomSpeed={0.8}
            />
          </Canvas>
        </div>
      ) : (
        <div className="interest-list">
          {itemsWithIcons
            .slice()
            .sort((a, b) => b.count - a.count)
            .map((item) => (
              <div key={item.label} className="interest-list-item">
                <img
                  src={item.icon}
                  alt={item.label}
                  className="interest-list-icon"
                />
                <div className="interest-list-text">
                  <span className="interest-list-label">
                    {item.rank}. {item.label}
                  </span>
                  <span className="interest-list-count">{item.count}</span>
                </div>
              </div>
            ))}
        </div>
      )}
    </main>
  );
}
