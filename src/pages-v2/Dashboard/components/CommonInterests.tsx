import React, { useState } from "react";
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
}

interface CommonInterestsProps {
  interests: Interest[];
}

const CommonInterests: React.FC<CommonInterestsProps> = ({ interests }) => {
  const { theme } = useTheme();
  const [selectedFilter, setSelectedFilter] = useState("Common Interests");

  console.log("CommonInterests modalVisible:", false);

  return (
    <div
      className="common-interests-container"
      style={{ backgroundColor: theme.colors.cardBg }}
    >
      <div className="common-interests-header">
        <div className="common-interests-title-group">
          <div className="common-interests-icon">
            <AssetIcon
              name="top-interests-icon"
              color={theme.colors.iconPurple}
            />
          </div>
          <h3
            className="common-interests-title"
            style={{ color: theme.colors.textMuted }}
          >
            Common Interests
          </h3>
        </div>
        <CDropdown className="common-interests-dropdown">
          <CDropdownToggle
            color="light"
            className="dropdown-toggle-custom"
            style={{
              backgroundColor: theme.colors.dropdownBg,
              border: `0.6px solid ${theme.colors.dropdownBorder}`,
              borderRadius: "4px",
              fontSize: "12px",
              fontFamily: '"Lato", sans-serif',
              fontWeight: 600,
              color: theme.colors.dropdownText,
              padding: "8px 12px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {selectedFilter}
            <AssetIcon
              name="arrow-down"
              size={18}
              color={theme.colors.dropdownText}
            />
          </CDropdownToggle>
          <CDropdownMenu>
            <CDropdownItem
              onClick={() => setSelectedFilter("Common Interests")}
            >
              Common Interests
            </CDropdownItem>
            <CDropdownItem
              onClick={() => setSelectedFilter("Popular Space categories")}
            >
              Popular Space categories
            </CDropdownItem>
            <CDropdownItem
              onClick={() => setSelectedFilter("Popular Events categories")}
            >
              Popular Events categories
            </CDropdownItem>
            <CDropdownItem
              onClick={() => setSelectedFilter("Popular ways to connect")}
            >
              Popular ways to connect
            </CDropdownItem>
            <CDropdownItem onClick={() => setSelectedFilter("Visited Places")}>
              Visited Places
            </CDropdownItem>
            <CDropdownItem
              onClick={() => setSelectedFilter("Invitation categories")}
            >
              Invitation categories
            </CDropdownItem>
            <CDropdownItem onClick={() => setSelectedFilter("Most engaged")}>
              Most engaged
            </CDropdownItem>
            <CDropdownItem
              onClick={() => setSelectedFilter("Events by number of attendees")}
            >
              Events by number of attendees
            </CDropdownItem>
            <CDropdownItem
              onClick={() => setSelectedFilter("Spaces by number of members")}
            >
              Spaces by number of members
            </CDropdownItem>
            <CDropdownItem
              onClick={() => setSelectedFilter("Collaborative Ideas")}
            >
              Collaborative Ideas
            </CDropdownItem>
          </CDropdownMenu>
        </CDropdown>
      </div>

      <div className="common-interests-list">
        {interests.map((interest) => (
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
                <p
                  className="interest-name"
                  style={{ color: theme.colors.bodyColor }}
                >
                  {interest.name}
                </p>
                <p
                  className="interest-stats"
                  style={{ color: theme.colors.textMuted }}
                >
                  {interest.students} students ({interest.percentage}%)
                </p>
              </div>
              <div className="interest-progress-container">
                <div
                  className="interest-progress-bg"
                  style={{ backgroundColor: "#eef0f1" }}
                />
                <div
                  className="interest-progress-bar"
                  style={{
                    backgroundColor: theme.colors.iconPurple,
                    width: `${interest.barWidth}px`,
                  }}
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
