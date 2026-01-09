import React, { useEffect, useMemo, useState } from "react";
import {
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from "@coreui/react";
import { AssetIcon } from "../../../components-v2";
import { useTheme } from "../../../hooks/useTheme";
import "./CommonInterests.css";

interface Interest {
  rank: number;
  name: string;
  value: number;
  valueLabel: string;
  percentage: number;
  barWidth: number;
  rankColor: string;
  rankBgColor: string;
  icon?: string;
}

interface CommonInterestsProps {
  interests: any[];
  datasets?: Record<string, any[]>;
}

const CommonInterests: React.FC<CommonInterestsProps> = ({
  interests,
  datasets,
}) => {
  const { theme } = useTheme();
  const capitalizeFirst = (value: string) => {
    if (!value) return value;
    return value.charAt(0).toUpperCase() + value.slice(1);
  };
  const filterOptions = useMemo(() => {
    const keys = datasets ? Object.keys(datasets) : [];
    // Filter out "Common interests" from the dropdown options
    const filteredKeys = keys.filter(
      (key) => key.toLowerCase() !== "common interests"
    );
    return filteredKeys.length ? filteredKeys : [];
  }, [datasets]);

  const [selectedFilter, setSelectedFilter] = useState(filterOptions[0]);

  useEffect(() => {
    if (!filterOptions.length) return;
    if (!selectedFilter || !filterOptions.includes(selectedFilter)) {
      setSelectedFilter(filterOptions[0]);
    }
  }, [filterOptions, selectedFilter]);

  const displayedInterests = useMemo(() => {
    const rankBgPalette = ["#fff3d6", "#d9e3f7", "#ffebe9"]; // top1, top2, top3 backgrounds
    const rankColorPalette = ["#8f5400", "#4a4cd9", "#ba5630"]; // top1, top2, top3 text
    const source = datasets?.[selectedFilter];
    const isCommonInterests =
      selectedFilter?.toLowerCase() === "common interests";
    const list =
      source && Array.isArray(source)
        ? source
        : isCommonInterests
        ? interests
        : [];

    const toNumber = (value: any, fallback = 0) => {
      const n = parseFloat(value);
      return Number.isFinite(n) ? n : fallback;
    };

    const inferUnit = (item: any, filterLabel: string) => {
      const lowerFilter = (filterLabel || "").toLowerCase();
      if ("members" in item) return "member";
      if ("attendees" in item) return "attendee";
      if ("visits" in item) return "visit";
      if ("score" in item) return "score";
      if ("students" in item) return "student";
      if ("count" in item) {
        if (lowerFilter.includes("space")) return "space";
        if (lowerFilter.includes("event")) return "event";
        if (lowerFilter.includes("place")) return "place";
        if (lowerFilter.includes("invitation")) return "invitation";
        if (lowerFilter.includes("connect")) return "connection";
        return "count";
      }
      if ("avgInteractions" in item) return "interaction";
      return "value";
    };

    const pluralizeUnit = (unit: string, amount: number) => {
      if (unit === "score") return "score";
      if (Math.abs(amount) === 1) return unit;
      if (unit.endsWith("s")) return unit;
      return `${unit}s`;
    };

    const counts = list.map((item) =>
      toNumber(
        item.students ??
          item.count ??
          item.score ??
          item.value ??
          item.total ??
          item.visits ??
          item.attendees ??
          item.members ??
          item.avgInteractions,
        0
      )
    );
    const maxCount = Math.max(1, ...counts);

    return list.map((item: any, idx: number): Interest => {
      const rank = Number(item.rank ?? idx + 1) || idx + 1;
      const value = counts[idx] ?? 0;
      const computedPercentage = value ? (value / maxCount) * 100 : 0;
      const percentageRaw = toNumber(item.percentage, computedPercentage);
      const percentage = Number.isFinite(percentageRaw)
        ? Number((percentageRaw as number).toFixed(2))
        : percentageRaw;
      const computedBarWidth = Math.min(100, percentage || computedPercentage);
      const barWidth = toNumber(item.barWidth, computedBarWidth);

      const rankColor =
        rank >= 1 && rank <= 3
          ? rankColorPalette[rank - 1]
          : item.rankColor ?? "#676d70";
      const rankBgColor =
        rank >= 1 && rank <= 3
          ? rankBgPalette[rank - 1]
          : item.rankBgColor ?? "#f4f5f7";

      const unit = inferUnit(item, selectedFilter);
      const valueLabel = `${value} ${pluralizeUnit(unit, value)}`;

      return {
        rank,
        name: capitalizeFirst(item.name || item.label || "—"),
        value,
        valueLabel,
        percentage,
        barWidth,
        rankColor,
        rankBgColor,
        icon: item.icon,
      };
    });
  }, [datasets, interests, selectedFilter]);

  console.log("CommonInterests modalVisible:", false);

  return (
    <div className="common-interests-container">
      <div className="common-interests-header">
        <div className="common-interests-title-group">
          <div className="common-interests-icon">
            <AssetIcon
              name="top-interests-icon"
              color={theme.colors.iconPurple}
            />
          </div>
          <h3 className="common-interests-title">{selectedFilter || "Top Rankings"}</h3>
        </div>
        {filterOptions.length > 1 && (
          <CDropdown className="common-interests-dropdown">
            <CDropdownToggle color="light" className="dropdown-toggle-custom">
              {selectedFilter}
              <AssetIcon
                name="arrow-down"
                size={18}
                color={theme.colors.dropdownText}
              />
            </CDropdownToggle>
            <CDropdownMenu>
              {filterOptions.map((option) => (
                <CDropdownItem
                  key={option}
                  onClick={() => setSelectedFilter(option)}
                  active={selectedFilter === option}
                >
                  {option}
                </CDropdownItem>
              ))}
            </CDropdownMenu>
          </CDropdown>
        )}
      </div>

      <div className="common-interests-list">
        {displayedInterests.map((interest) => (
          <div key={interest.rank} className="interest-item">
            <div
              className="interest-rank"
              style={{
                backgroundColor: interest.rankBgColor,
                color: interest.rankColor,
              }}
            >
              #{interest.rank}
            </div>
            <div className="interest-info">
              <div className="interest-details">
                <p className="interest-name">{interest.name}</p>
                <p className="interest-stats">
                  {interest.valueLabel}
                  {Number.isFinite(interest.percentage)
                    ? ` (${interest.percentage}%)`
                    : ""}
                </p>
              </div>
              <div className="interest-progress-container">
                <div className="interest-progress-bg" />
                <div
                  className="interest-progress-bar"
                  style={{ width: `${interest.barWidth}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommonInterests;
