import React from "react";

export interface BoundaryAvatarProps {
  coordinates?: number[][];
  size?: number;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  backgroundColor?: string;
  mapBackgroundUrl?: string;
  fallbackText?: string;
  className?: string;
  padding?: number;
  showBackground?: boolean;
  onClick?: () => void;
}

const toPoints = (
  coordinates?: number[][],
  padding: number = 6,
  canvas: number = 100
): string | null => {
  if (!coordinates || coordinates.length < 3) return null;

  const lngs = coordinates.map((c) => c[0]);
  const lats = coordinates.map((c) => c[1]);

  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);

  const spanLng = Math.max(maxLng - minLng, 1e-6);
  const spanLat = Math.max(maxLat - minLat, 1e-6);
  const usable = canvas - padding * 2;
  const maxSpan = Math.max(spanLng, spanLat);
  const scale = usable / maxSpan;

  const width = spanLng * scale;
  const height = spanLat * scale;
  const offsetX = padding + (usable - width) / 2;
  const offsetY = padding + (usable - height) / 2;

  const points = coordinates.map(([lng, lat]) => {
    const x = offsetX + (lng - minLng) * scale;
    const y = offsetY + (maxLat - lat) * scale; // invert latitude for screen space
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });

  return points.join(" ");
};

export const BoundaryAvatar: React.FC<BoundaryAvatarProps> = ({
  coordinates,
  size = 38,
  fillColor = "#546FD9",
  strokeColor = "#FF9500",
  strokeWidth = 2,
  backgroundColor = "#EEF0F1",
  mapBackgroundUrl,
  fallbackText = "",
  className = "",
  padding = 6,
  showBackground = true,
  onClick,
}) => {
  const points = toPoints(coordinates, padding);

  return (
    <div
      className={`boundary-avatar ${className}`.trim()}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: showBackground ? backgroundColor : "transparent",
        backgroundImage: mapBackgroundUrl
          ? `url(${mapBackgroundUrl})`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        cursor: onClick ? "pointer" : "default",
      }}
      onClick={onClick}
      aria-hidden={!fallbackText}
    >
      {points ? (
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          {showBackground && (
            <circle cx="50" cy="50" r="48" fill={backgroundColor} />
          )}
          <polygon
            points={points}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <span
          style={{
            fontFamily: "Lato, sans-serif",
            fontWeight: 600,
            fontSize: Math.max(12, size * 0.35),
            color: "#1d1b20",
          }}
        >
          {fallbackText}
        </span>
      )}
    </div>
  );
};

export default BoundaryAvatar;
