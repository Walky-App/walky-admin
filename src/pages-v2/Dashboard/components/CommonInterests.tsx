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
  students: number;
  percentage: number;
  barWidth: number;
  rankColor: string;
  rankBgColor: string;
  icon?: string;
}

interface CommonInterestsProps {
  interests: Interest[];
  datasets?: Record<string, any[]>;
}

const CommonInterests: React.FC<CommonInterestsProps> = ({
  interests,
  datasets,
}) => {
  const { theme } = useTheme();
  const filterOptions = useMemo(() => {
    const keys = datasets ? Object.keys(datasets) : [];
    return keys.length ? keys : ["Common Interests"];
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
    const list =
      source && Array.isArray(source)
        ? source
        : selectedFilter === "Common Interests"
        ? interests
        : [];

    const toNumber = (value: any, fallback = 0) => {
      const n = parseFloat(value);
      return Number.isFinite(n) ? n : fallback;
    };

    const counts = list.map((item) =>
      toNumber(
        item.students ??
          item.count ??
          item.value ??
          item.total ??
          item.visits ??
          item.attendees ??
          item.members,
        0
      )
    );
    const maxCount = Math.max(1, ...counts);

    return list.map((item: any, idx: number): Interest => {
      const rank = Number(item.rank ?? idx + 1) || idx + 1;
      const students = counts[idx] ?? 0;
      const computedPercentage = students ? (students / maxCount) * 100 : 0;
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

      return {
        rank,
        name: item.name || item.label || "—",
        students,
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
          <h3 className="common-interests-title">{selectedFilter}</h3>
        </div>
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
                  {interest.students}
                  {Number.isFinite(interest.students) ? " students" : ""}
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
