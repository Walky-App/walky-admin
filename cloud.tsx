import * as THREE from "three";
import { useRef, useState, useMemo, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Billboard, Text, TrackballControls, Image } from "@react-three/drei";

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

// simple placeholder icon pool; replace with your own if desired
const iconPool = [
  "https://picsum.photos/seed/a/128",
  "https://picsum.photos/seed/b/128",
  "https://picsum.photos/seed/c/128",
  "https://picsum.photos/seed/d/128",
  "https://picsum.photos/seed/e/128",
  "https://picsum.photos/seed/d/128",
];

const withRandomIcons = interests.map((item, i) => ({
  ...item,
  icon: iconPool[i % iconPool.length],
}));

function Word({ item, ...props }) {
  const color = new THREE.Color();
  const fontProps = {
    font: "/Inter-Bold.woff",
    fontSize: 2.2,
    letterSpacing: -0.05,
    lineHeight: 1,
    "material-toneMapped": false,
  };
  const ref = useRef();
  const [hovered, setHovered] = useState(false);
  const over = (e) => (e.stopPropagation(), setHovered(true));
  const out = () => setHovered(false);

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto";
    return () => (document.body.style.cursor = "auto");
  }, [hovered]);

  useFrame(() => {
    ref.current.material.color.lerp(
      color.set(hovered ? "#fa2720" : "white"),
      0.1
    );
  });

  return (
    <Billboard {...props}>
      <group>
        <Image
          url={item.icon}
          crossOrigin="anonymous"
          transparent
          toneMapped={false}
          scale={[3, 3, 1]}
          position={[0, 2.5, 0]}
        />
        <Text
          ref={ref}
          onPointerOver={over}
          onPointerOut={out}
          onClick={() => console.log("clicked", item.label)}
          {...fontProps}
          position={[0, -1.5, 0]}
        >
          {item.label}
        </Text>
      </group>
    </Billboard>
  );
}

function Cloud({ items = [], radius = 20 }) {
  const words = useMemo(() => {
    const temp = [];
    const spherical = new THREE.Spherical();
    const n = items.length || 1;
    const rings = Math.ceil(Math.sqrt(n));
    const phiSpan = Math.PI / (rings + 1);
    const thetaSpan = (Math.PI * 2) / rings;

    let k = 0;
    for (let i = 1; i < rings + 1; i++) {
      for (let j = 0; j < rings && k < items.length; j++, k++) {
        const pos = new THREE.Vector3().setFromSpherical(
          spherical.set(radius, phiSpan * i, thetaSpan * j)
        );
        temp.push([pos, items[k]]);
      }
    }
    return temp;
  }, [items, radius]);

  return words.map(([pos, item], index) => (
    <Word key={item.label ?? index} position={pos} item={item} />
  ));
}

export default function App() {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 35], fov: 90 }}>
      <fog attach="fog" args={["#202025", 0, 80]} />
      <Suspense fallback={null}>
        <group rotation={[10, 10.5, 10]}>
          <Cloud items={withRandomIcons} radius={20} />
        </group>
      </Suspense>
      <TrackballControls />
    </Canvas>
  );
}
