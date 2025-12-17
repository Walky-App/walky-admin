import React from "react";
import { CCard, CCardBody } from "@coreui/react";
import { useTheme } from "../../../../hooks/useTheme";
import "./FeatureCard.css";

interface FeatureItem {
  rank: number;
  icon: string;
  label: string;
  iconBgColor?: string;
}

interface FeatureCardProps {
  title: string;
  icon: React.ReactNode;
  items: FeatureItem[];
  onSeeAll?: () => void;
  maxItems?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  icon,
  items,
  onSeeAll,
  maxItems = 5,
}) => {
  const { theme } = useTheme();

  const headingId = `feature-card-${title.replace(/\s+/g, "-").toLowerCase()}`;
  const displayItems = items.slice(0, maxItems);

  const getIconFallback = (label: string) => {
    return label.charAt(0).toUpperCase();
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
            <h3
              id={headingId}
              className="feature-title"
              style={{ color: theme.colors.textMuted }}
            >
              {title}
            </h3>
          </div>

          {/* Items List */}
          <ol className="feature-items-list" aria-label={`${title} ranking`}>
            {displayItems.map((item) => (
              <li key={item.rank} className="feature-item">
                <span
                  className="feature-rank"
                  style={{ color: theme.colors.primary }}
                  aria-label={`Rank ${item.rank}`}
                >
                  {item.rank}.
                </span>
                {item.icon && item.iconBgColor ? (
                  <div
                    className="feature-item-icon-bg"
                    style={{ backgroundColor: item.iconBgColor }}
                    aria-hidden="true"
                  >
                    <img src={item.icon} alt="" className="feature-item-icon" />
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
                    {getIconFallback(item.label)}
                  </div>
                )}
                <span
                  className="feature-label"
                  style={{ color: theme.colors.textMuted }}
                >
                  {item.label}
                </span>
              </li>
            ))}
          </ol>
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
