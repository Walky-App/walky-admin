import React from "react";
import "./Divider.css";

interface DividerProps {
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({ className }) => {
  return (
    <svg
      className={`divider ${className || ""}`}
      width="100%"
      height="1"
      viewBox="0 0 100 1"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="0"
        y1="0.5"
        x2="100"
        y2="0.5"
        strokeWidth="0.4"
        stroke="rgba(169, 171, 172, 0.4)"
      />
    </svg>
  );
};
