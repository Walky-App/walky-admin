import React from "react";

interface SkeletonLoaderProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = "100%",
  height = "20px",
  borderRadius = "4px",
  className = "",
  style = {},
}) => {
  return (
    <div
      className={`skeleton-loader ${className}`}
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: "#e0e0e0",
        animation: "pulse 1.5s ease-in-out infinite",
        ...style,
      }}
    />
  );
};

export default SkeletonLoader;
