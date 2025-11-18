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
      aria-label="Export data to CSV"
      style={{
        backgroundColor: theme.colors.exportBg,
        borderColor: theme.colors.exportBorder,
        color: theme.colors.bodyColor,
      }}
    >
      <AssetIcon name="export-icon" size={20} aria-hidden="true" />
      <span>Export</span>
    </button>
  );
};
