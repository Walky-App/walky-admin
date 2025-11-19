import React, { useState } from "react";
import { CModal, CModalHeader, CModalBody, CButton } from "@coreui/react";
import AssetIcon from "../AssetIcon/AssetIcon";
import { useTheme } from "../../hooks/useTheme";

interface Interest {
  rank: number;
  name: string;
  icon: string;
}

interface SeeAllInterestsModalProps {
  visible: boolean;
  onClose: () => void;
  interests: Interest[];
}

const SeeAllInterestsModal: React.FC<SeeAllInterestsModalProps> = ({
  visible,
  onClose,
  interests,
}) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  console.log("=== SeeAllInterestsModal ===");
  console.log("visible:", visible);
  console.log("interests count:", interests?.length);

  const filteredInterests = interests.filter((interest) =>
    interest.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <CModal
      visible={visible}
      onClose={onClose}
      alignment="center"
      backdrop={true}
      className="see-all-interests-modal"
    >
      <CModalHeader closeButton>
        <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
          <AssetIcon
            name="top-interests-icon"
            size={30}
            color={theme.colors.iconPurple}
          />
          <div>
            <h3
              style={{
                fontFamily: '"Lato", sans-serif',
                fontSize: "18px",
                fontWeight: 700,
                lineHeight: "normal",
                margin: 0,
                color: theme.colors.bodyColor,
              }}
            >
              Top interests
            </h3>
            <p
              style={{
                fontFamily: '"Lato", sans-serif',
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: "normal",
                margin: "8px 0 0 0",
                color: theme.colors.textMuted,
              }}
            >
              Interests ranked by popularity
            </p>
          </div>
        </div>
      </CModalHeader>

      <CModalBody
        style={{
          backgroundColor: theme.colors.cardBg,
          padding: "0 32px 32px 32px",
        }}
      >
        {/* Search Input */}
        <div
          className="search-container"
          style={{
            backgroundColor: theme.colors.cardBg,
            borderColor: theme.colors.borderColor,
          }}
        >
          <input
            data-testid="interests-search-input"
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            style={{
              backgroundColor: theme.colors.cardBg,
              color: theme.colors.bodyColor,
            }}
          />
        </div>

        {/* Interests List */}
        <div
          className="interests-list-container"
          style={{
            backgroundColor: theme.colors.cardBg,
            borderColor: theme.colors.borderColor,
          }}
        >
          <div className="interests-list">
            {filteredInterests.map((interest) => (
              <div key={interest.rank} className="interest-item">
                <span
                  className="interest-rank"
                  style={{ color: theme.colors.iconPurple }}
                >
                  {interest.rank}.
                </span>
                <div
                  className="interest-icon-wrapper"
                  style={{ backgroundColor: "#EBF1FF" }}
                >
                  <img
                    src={interest.icon}
                    alt={interest.name}
                    className="interest-icon"
                  />
                </div>
                <span
                  className="interest-name"
                  style={{ color: theme.colors.textMuted }}
                >
                  {interest.name}
                </span>
              </div>
            ))}
          </div>

          {/* Scrollbar indicator */}
          <div className="scrollbar-indicator" />
        </div>

        {/* Close Button */}
        <div className="modal-footer">
          <CButton
            color="light"
            onClick={onClose}
            className="close-button"
            style={{
              backgroundColor: theme.colors.cardBg,
              border: `1px solid ${theme.colors.borderColor}`,
              color: theme.colors.bodyColor,
            }}
          >
            Close
          </CButton>
        </div>
      </CModalBody>
    </CModal>
  );
};

export default SeeAllInterestsModal;
