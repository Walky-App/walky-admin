import React from "react";
import { AssetIcon } from "../../../../components-v2";
import { useTheme } from "../../../../hooks/useTheme";
import "./ExportButton.css";

interface ExportButtonProps {
  onClick?: () => void;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ onClick }) => {
  const { theme } = useTheme();

  return (
    <button
      data-testid="export-button"
      className="export-button"
      onClick={onClick}
      style={{
        backgroundColor: "#ebf0fa",
        borderColor: "#d2d2d3",
        color: theme.colors.bodyColor,
      }}
    >
      <AssetIcon name="export-icon" size={20} />
      <span>Export</span>
    </button>
  );
};
