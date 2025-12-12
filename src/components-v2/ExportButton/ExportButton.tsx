import React, { useCallback, useState } from "react";
import html2pdf from "html2pdf.js";
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
  captureRef,
  filename,
}) => {
  const { theme } = useTheme();
  const [isExporting, setIsExporting] = useState(false);

  const defaultExport = useCallback(async () => {
    const element =
      captureRef?.current ||
      (document.querySelector("main") as HTMLElement | null);
    if (!element) return;

    setIsExporting(true);
    try {
      const elementWidth = element.scrollWidth;
      const elementHeight = element.scrollHeight;
      const maxScale = 1.4;
      const fitScale = Math.min(
        maxScale,
        1400 / elementWidth,
        900 / elementHeight,
        1
      );
      const margin = 8;
      const format: [number, number] = [
        elementWidth * fitScale + margin * 2,
        elementHeight * fitScale + margin * 2,
      ];

      const options = {
        margin,
        filename: `${filename || "export"}.pdf`,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: {
          scale: fitScale,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
          windowWidth: elementWidth,
        },
        jsPDF: { unit: "px", format, orientation: "landscape" as const },
        pagebreak: { mode: ["avoid-all"] },
      };

      await html2pdf().set(options).from(element).save();
    } finally {
      setIsExporting(false);
    }
  }, [captureRef, filename]);

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
