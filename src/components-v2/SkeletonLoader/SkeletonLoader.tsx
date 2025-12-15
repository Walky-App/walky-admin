import React from "react";
import { useTheme } from "../../hooks/useTheme";

interface SkeletonLoaderProps {
  height?: string;
  width?: string;
  borderRadius?: string;
  className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  height = "20px",
  width = "100%",
  borderRadius = "4px",
  className = "",
}) => {
  const { theme } = useTheme();

  return (
    <div
      className={`skeleton-loader ${className}`}
      style={{
        height,
        width,
        borderRadius,
        backgroundColor: theme.isDark ? "#343a40" : "#e9ecef",
        background: theme.isDark
          ? "linear-gradient(90deg, #343a40 25%, #495057 50%, #343a40 75%)"
          : "linear-gradient(90deg, #e9ecef 25%, #dee2e6 50%, #e9ecef 75%)",
        backgroundSize: "200% 100%",
        animation: "skeleton-loading 1.5s infinite",
      }}
    />
  );
};

export default SkeletonLoader;
