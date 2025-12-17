import React, { useMemo, useState } from "react";
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

  const [sortBy, setSortBy] = useState<
    "rank" | "name" | "students" | "avgInteractions"
  >("rank");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const normalizedFields = useMemo(() => {
    const rankBgPalette = ["#fff3d6", "#d9e3f7", "#ffebe9"]; // 1st, 2nd, 3rd
    const rankColorPalette = ["#8f5400", "#4a4cd9", "#ba5630"]; // 1st, 2nd, 3rd

    return fields.map((field, idx) => {
      const rank = Number(field.rank ?? idx + 1) || idx + 1;
      const rankBgColor =
        rank >= 1 && rank <= 3
          ? rankBgPalette[rank - 1]
          : field.rankBgColor ?? "#f4f5f7";
      const rankColor =
        rank >= 1 && rank <= 3
          ? rankColorPalette[rank - 1]
          : field.rankColor ?? "#676d70";

      return { ...field, rank, rankBgColor, rankColor };
    });
  }, [fields]);

  const sortedFields = useMemo(() => {
    const copy = [...normalizedFields];
    copy.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name) * dir;
        case "students":
          return (a.students - b.students) * dir;
        case "avgInteractions":
          return (a.avgInteractions - b.avgInteractions) * dir;
        case "rank":
        default:
          return (a.rank - b.rank) * dir;
      }
    });
    return copy;
  }, [normalizedFields, sortBy, sortDir]);

  const toggleSort = (
    key: "rank" | "name" | "students" | "avgInteractions"
  ) => {
    if (sortBy === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortDir(key === "rank" ? "asc" : "desc");
    }
  };

  return (
    <div className="top-fields-container">
      <div className="top-fields-header">
        <div className="top-fields-icon">
          <AssetIcon
            name="top-fields-study-icon"
            color={theme.colors.iconPurple}
            size={24}
          />
        </div>
        <h3 className="top-fields-title">Top fields of study by interaction</h3>
      </div>

      <div className="top-fields-content">
        <div className="top-fields-table-header">
          <div className="table-header-item">
            <button
              type="button"
              className="table-header-sort"
              data-testid="top-fields-sort-name"
              onClick={() => toggleSort("name")}
              aria-label="Sort by field"
            >
              <span className="table-header-text">Field</span>
              <AssetIcon
                name="swap-arrows-icon"
                color={theme.colors.bodyColor}
                size={24}
                className={`sort-icon ${sortBy === "name" ? sortDir : ""}`}
              />
            </button>
          </div>
          <div className="table-header-item">
            <button
              type="button"
              className="table-header-sort"
              data-testid="top-fields-sort-students"
              onClick={() => toggleSort("students")}
              aria-label="Sort by students"
            >
              <span className="table-header-text">Students</span>
              <AssetIcon
                name="swap-arrows-icon"
                color={theme.colors.bodyColor}
                size={24}
                className={`sort-icon ${sortBy === "students" ? sortDir : ""}`}
              />
            </button>
          </div>
          <div className="table-header-item">
            <button
              type="button"
              className="table-header-sort"
              data-testid="top-fields-sort-avg-interactions"
              onClick={() => toggleSort("avgInteractions")}
              aria-label="Sort by average interactions"
            >
              <span className="table-header-text">Avg interactions</span>
              <AssetIcon
                name="swap-arrows-icon"
                color={theme.colors.bodyColor}
                size={24}
                className={`sort-icon ${
                  sortBy === "avgInteractions" ? sortDir : ""
                }`}
              />
            </button>
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
                <AssetIcon
                  name="tooltip-icon"
                  color={theme.colors.iconTooltip}
                  size={16}
                />
              </button>
            </CTooltip>
          </div>
        </div>

        <div className="top-fields-list">
          {sortedFields.map((field) => (
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
                <p className="field-name">{field.name}</p>
              </div>
              <p className="field-students">{field.students}</p>
              <p className="field-interactions">{field.avgInteractions}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopFieldsOfStudy;
