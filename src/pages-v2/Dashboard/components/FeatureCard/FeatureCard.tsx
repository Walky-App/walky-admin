import React from "react";
import { CCard, CCardBody } from "@coreui/react";
import { useTheme } from "../../../../hooks/useTheme";
import { AssetIcon, NoData } from "../../../../components-v2";
import { IconName } from "../../../../components-v2/AssetIcon/AssetIcon.types";
import "./FeatureCard.css";

interface FeatureItem {
  rank: number;
  icon: string;
  label: string;
  iconBgColor?: string;
  iconName?: IconName;
}

interface FeatureCardProps {
  title: string;
  icon: React.ReactNode;
  items: FeatureItem[];
  onSeeAll?: () => void;
  maxItems?: number;
  formatLabel?: (raw: string) => string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  icon,
  items,
  onSeeAll,
  maxItems = 5,
  formatLabel,
}) => {
  const { theme } = useTheme();

  const capitalizeFirst = (value: string) => {
    if (!value) return value;
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const headingId = `feature-card-${title.replace(/\s+/g, "-").toLowerCase()}`;
  const displayItems = items.slice(0, maxItems);

  const getIconFallback = (label: string) => {
    const firstChar = label?.charAt(0) || "?";
    return firstChar.toUpperCase();
  };

  return (
    <CCard
      className="feature-card"
      role="region"
      aria-labelledby={headingId}
      style={{
        backgroundColor: theme.colors.cardBg,
        borderColor: theme.colors.borderColor,
      }}
    >
      <CCardBody className="feature-card-body">
        <div className="feature-card-content">
          {/* Header */}
          <div className="feature-card-header">
            <div className="feature-icon-container" aria-hidden="true">
              {icon}
            </div>
            <h3 id={headingId} className="feature-title">
              {title}
            </h3>
          </div>

          {displayItems.length === 0 ? (
            <div className="feature-no-data">
              <NoData
                type="primary"
                message="No data yet"
                iconName="nd-grafs-empty"
                iconColor="#526AC9"
                iconSize={42}
              />
            </div>
          ) : (
            <ol className="feature-items-list" aria-label={`${title} ranking`}>
              {displayItems.map((item) => {
                const rawLabel = item.label || (item as any).name || "";
                const formattedLabel =
                  formatLabel?.(rawLabel) || capitalizeFirst(rawLabel) || "?";
                return (
                  <li key={item.rank} className="feature-item">
                    <span
                      className="feature-rank"
                      style={{ color: theme.colors.primary }}
                      aria-label={`Rank ${item.rank}`}
                    >
                      {item.rank}.
                    </span>
                    {item.iconName ? (
                      <div
                        className="feature-item-icon-bg"
                        style={{
                          backgroundColor:
                            item.iconBgColor || theme.colors.primary + "20",
                        }}
                        aria-hidden="true"
                      >
                        <AssetIcon
                          name={item.iconName}
                          color={theme.colors.primary}
                          size={20}
                        />
                      </div>
                    ) : item.icon && item.iconBgColor ? (
                      <div
                        className="feature-item-icon-bg"
                        style={{ backgroundColor: item.iconBgColor }}
                        aria-hidden="true"
                      >
                        <img
                          src={item.icon}
                          alt=""
                          className="feature-item-icon"
                        />
                      </div>
                    ) : item.icon ? (
                      <img
                        src={item.icon}
                        alt={`${item.label} icon`}
                        className="feature-item-img"
                      />
                    ) : (
                      <div
                        className="feature-item-icon-bg"
                        style={{
                          backgroundColor: theme.colors.primary + "20",
                          color: theme.colors.primary,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          fontWeight: "600",
                          fontSize: "14px",
                        }}
                        aria-hidden="true"
                      >
                        {getIconFallback(formattedLabel)}
                      </div>
                    )}
                    <span
                      className="feature-label"
                      style={{ color: theme.colors.textMuted }}
                    >
                      {formattedLabel}
                    </span>
                  </li>
                );
              })}
            </ol>
          )}
        </div>

        {/* See All Link */}
        <div className="feature-see-all">
          <button
            data-testid="feature-card-see-all"
            onClick={onSeeAll}
            className="see-all-btn"
            style={{ color: theme.colors.primary }}
            aria-label={`See all ${title.toLowerCase()}`}
          >
            See all →
          </button>
        </div>
      </CCardBody>
    </CCard>
  );
};

export default FeatureCard;
