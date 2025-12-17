import React, { useCallback, useState } from "react";
import { AssetIcon } from "../AssetIcon/AssetIcon";
import { useTheme } from "../../hooks/useTheme";
import "./ExportButton.css";

interface ExportButtonProps {
  onClick?: () => void;
  captureRef?: React.RefObject<HTMLElement | null>;
  filename?: string;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  onClick,
  captureRef: _captureRef,
  filename: _filename,
}) => {
  const { theme } = useTheme();
  const [isExporting, setIsExporting] = useState(false);

  const defaultExport = useCallback(() => {
    setIsExporting(true);

    const finish = () => setIsExporting(false);

    const handleAfterPrint = () => {
      finish();
      window.removeEventListener("afterprint", handleAfterPrint);
    };

    window.addEventListener("afterprint", handleAfterPrint);

    // Trigger native print; fallback timeout to clear state if afterprint is not fired
    window.print();
    setTimeout(() => {
      window.removeEventListener("afterprint", handleAfterPrint);
      finish();
    }, 1500);
  }, []);

  const handleClick = onClick || defaultExport;

  return (
    <button
      data-testid="export-button"
      className="export-button"
      onClick={handleClick}
      aria-label="Export data to CSV"
      style={{
        backgroundColor: theme.colors.exportBg,
        borderColor: theme.colors.exportBorder,
        color: theme.colors.bodyColor,
      }}
      disabled={isExporting}
    >
      <AssetIcon name="export-icon" size={20} aria-hidden="true" />
      <span>{isExporting ? "Exporting..." : "Export"}</span>
    </button>
  );
};
