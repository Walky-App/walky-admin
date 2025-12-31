import React from "react";
import "./InterestChip.css";

interface InterestChipProps {
  label: string;
}

export const InterestChip: React.FC<InterestChipProps> = ({ label }) => {
  return <div className="interest-chip">{label}</div>;
};
