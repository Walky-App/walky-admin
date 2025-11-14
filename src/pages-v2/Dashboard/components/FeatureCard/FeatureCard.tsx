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
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  icon,
  items,
  onSeeAll,
}) => {
  const { theme } = useTheme();

  return (
    <CCard
      className="feature-card"
      style={{
        backgroundColor: theme.colors.cardBg,
        borderColor: theme.colors.borderColor,
      }}
    >
      <CCardBody className="feature-card-body">
        <div className="feature-card-content">
          {/* Header */}
          <div className="feature-card-header">
            <div className="feature-icon-container">{icon}</div>
            <h3
              className="feature-title"
              style={{ color: theme.colors.textMuted }}
            >
              {title}
            </h3>
          </div>

          {/* Items List */}
          <div className="feature-items-list">
            {items.map((item) => (
              <div key={item.rank} className="feature-item">
                <span
                  className="feature-rank"
                  style={{ color: theme.colors.primary }}
                >
                  {item.rank}.
                </span>
                {item.iconBgColor ? (
                  <div
                    className="feature-item-icon-bg"
                    style={{ backgroundColor: item.iconBgColor }}
                  >
                    <img src={item.icon} alt="" className="feature-item-icon" />
                  </div>
                ) : (
                  <img src={item.icon} alt="" className="feature-item-img" />
                )}
                <span
                  className="feature-label"
                  style={{ color: theme.colors.textMuted }}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* See All Link */}
        <div className="feature-see-all">
          <button
            data-testid="feature-card-see-all"
            onClick={onSeeAll}
            className="see-all-btn"
            style={{ color: theme.colors.primary }}
          >
            See all →
          </button>
        </div>
      </CCardBody>
    </CCard>
  );
};

export default FeatureCard;
