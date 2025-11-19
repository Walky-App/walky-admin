import React from "react";
import { CTooltip } from "@coreui/react";
import { AssetIcon } from "../../../components-v2";
import { useTheme } from "../../../hooks/useTheme";
import "./TopFieldsOfStudy.css";

interface FieldOfStudy {
  rank: number;
  name: string;
  students: number;
  avgInteractions: number;
  rankColor: string;
  rankBgColor: string;
}

interface TopFieldsOfStudyProps {
  fields: FieldOfStudy[];
}

const TopFieldsOfStudy: React.FC<TopFieldsOfStudyProps> = ({ fields }) => {
  const { theme } = useTheme();

  return (
    <div
      className="top-fields-container"
      style={{ backgroundColor: theme.colors.cardBg }}
    >
      <div className="top-fields-header">
        <div className="top-fields-icon">
          <AssetIcon
            name="top-fields-study-icon"
            color={theme.colors.iconPurple}
            size={24}
          />
        </div>
        <h3
          className="top-fields-title"
          style={{ color: theme.colors.textMuted }}
        >
          Top fields of study by interaction
        </h3>
      </div>

      <div className="top-fields-content">
        <div
          className="top-fields-table-header"
          style={{ backgroundColor: theme.colors.dropdownBg }}
        >
          <div className="table-header-item">
            <span
              className="table-header-text"
              style={{ color: theme.colors.bodyColor }}
            >
              Field
            </span>
            <AssetIcon
              name="swap-arrows-icon"
              color={theme.colors.bodyColor}
              size={24}
            />
          </div>
          <div className="table-header-item">
            <span
              className="table-header-text"
              style={{ color: theme.colors.bodyColor }}
            >
              Students
            </span>
            <AssetIcon
              name="swap-arrows-icon"
              color={theme.colors.bodyColor}
              size={24}
            />
          </div>
          <div className="table-header-item">
            <span
              className="table-header-text"
              style={{ color: theme.colors.bodyColor }}
            >
              Avg interactions
            </span>
            <CTooltip
              content="Explanation of how this data is calculated"
              placement="top"
            >
              <button
                data-testid="avg-interactions-tooltip-button"
                className="tooltip-button"
                aria-label="Information about average interactions"
                type="button"
              >
                <AssetIcon name="tooltip-icon" color="#acb6ba" size={16} />
              </button>
            </CTooltip>
          </div>
        </div>

        <div className="top-fields-list">
          {fields.map((field) => (
            <div key={field.rank} className="field-item">
              <div className="field-info">
                <div
                  className="field-rank"
                  style={{
                    backgroundColor: field.rankBgColor,
                    color: field.rankColor,
                  }}
                >
                  #{field.rank}
                </div>
                <p
                  className="field-name"
                  style={{ color: theme.colors.bodyColor }}
                >
                  {field.name}
                </p>
              </div>
              <p
                className="field-students"
                style={{ color: theme.colors.bodyColor }}
              >
                {field.students}
              </p>
              <p
                className="field-interactions"
                style={{ color: theme.colors.bodyColor }}
              >
                {field.avgInteractions}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopFieldsOfStudy;
