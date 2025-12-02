import React, { useState } from "react";
import { CTooltip } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilCopy, cilCheckCircle } from "@coreui/icons";
import { useTheme } from "../../hooks/useTheme";

interface CopyableIdProps {
  id: string;
  collapsed?: boolean;
}

export const CopyableId: React.FC<CopyableIdProps> = ({
  id,
  collapsed = true,
}) => {
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);

  console.log('CopyableId rendering:', { id, collapsed });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const formatId = (id: string): React.ReactNode => {
    if (!collapsed || id.length <= 12) {
      return <span style={{ fontFamily: "monospace" }}>{id}</span>;
    }

    const first4 = id.slice(0, 4);
    const last4 = id.slice(-4);

    return (
      <span style={{ fontFamily: "monospace" }}>
        {first4}...{last4}
      </span>
    );
  };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "4px 8px",
        borderRadius: "6px",
        backgroundColor: theme.isDark
          ? "rgba(255, 255, 255, 0.05)"
          : "rgba(0, 0, 0, 0.03)",
        border: `1px solid ${theme.colors.borderColor}40`,
        cursor: "pointer",
        transition: "all 0.2s ease",
        fontSize: "13px",
      }}
      onClick={handleCopy}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = theme.isDark
          ? "rgba(255, 255, 255, 0.08)"
          : "rgba(0, 0, 0, 0.06)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = theme.isDark
          ? "rgba(255, 255, 255, 0.05)"
          : "rgba(0, 0, 0, 0.03)";
      }}
    >
      <CTooltip content={copied ? "Copied!" : `Click to copy: ${id}`}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            color: theme.colors.textMuted,
          }}
        >
          {formatId(id)}
          <CIcon
            icon={copied ? cilCheckCircle : cilCopy}
            size="sm"
            style={{
              color: copied ? theme.colors.success : theme.colors.textMuted,
              transition: "color 0.2s ease",
            }}
          />
        </span>
      </CTooltip>
    </span>
  );
};

export default CopyableId;
