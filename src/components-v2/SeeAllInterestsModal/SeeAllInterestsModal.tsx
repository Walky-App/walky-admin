import React, { useState, useMemo } from "react";
import {
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CButton,
  CFormInput,
  CInputGroup,
  CInputGroupText,
} from "@coreui/react";
import AssetIcon from "../AssetIcon/AssetIcon";
import { useMixpanel } from "../../hooks/useMixpanel";
import "./SeeAllInterestsModal.css";

interface Interest {
  rank: number;
  name: string;
  icon: string;
}

interface SeeAllInterestsModalProps {
  visible: boolean;
  onClose: () => void;
  interests: Interest[];
  title?: string;
  subtitle?: string;
}

const SeeAllInterestsModal: React.FC<SeeAllInterestsModalProps> = ({
  visible,
  onClose,
  interests,
  title = "Top interests",
  subtitle = "Interests ranked by popularity",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { trackEvent } = useMixpanel();

  const filteredInterests = useMemo(() => {
    if (!searchTerm.trim()) return interests;
    return interests.filter((interest) =>
      interest.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [interests, searchTerm]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);

    if (value.trim().length > 0) {
      trackEvent("Popular Features - Modal Search Input", {
        search_query: value,
        results_count: filteredInterests.length,
        modal_title: title,
      });
    }
  };

  const handleClose = () => {
    setSearchTerm("");
    onClose();
  };

  return (
    <CModal
      visible={visible}
      onClose={handleClose}
      alignment="center"
      backdrop="static"
      className="see-all-interests-modal"
    >
      {/* Header */}
      <CModalHeader closeButton className="see-all-interests-modal-header">
        <div className="see-all-interests-header-content">
          <div className="see-all-interests-title-group">
            <div className="see-all-interests-icon">
              <AssetIcon name="top-interests-icon" size={30} />
            </div>
            <h2 className="see-all-interests-title">{title}</h2>
          </div>
          <p className="see-all-interests-subtitle">{subtitle}</p>
        </div>
      </CModalHeader>

      {/* Body */}
      <CModalBody className="see-all-interests-modal-body">
        {/* Container with border that includes search and list */}
        <div className="see-all-interests-container">
          {/* Search Input */}
          <div className="see-all-interests-search-container">
            <CInputGroup className="see-all-interests-search-input">
              <CInputGroupText className="see-all-interests-search-icon">
                <AssetIcon name="search-icon" />
              </CInputGroupText>
              <CFormInput
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="see-all-interests-search-field"
                data-testid="interests-search-input"
              />
            </CInputGroup>
          </div>

          {/* Interest List */}
          <div className="see-all-interests-list-container">
            <div className="see-all-interests-list-scroll">
              {filteredInterests.length > 0 ? (
                <ol className="see-all-interests-list">
                  {filteredInterests.map((interest) => (
                    <li key={interest.rank} className="see-all-interests-item">
                      <div className="see-all-interests-item-content">
                        <span className="see-all-interests-rank">
                          {interest.rank}.
                        </span>
                        <div className="see-all-interests-item-icon">
                          <div className="see-all-interests-icon-background">
                            {interest.icon ? (
                              <img
                                src={interest.icon}
                                alt={interest.name}
                                className="see-all-interests-icon-image"
                              />
                            ) : (
                              <div className="see-all-interests-icon-placeholder">
                                {interest.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                        </div>
                        <span className="see-all-interests-name">
                          {interest.name}
                        </span>
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="see-all-interests-empty">
                  <p className="see-all-interests-empty-text">
                    {searchTerm
                      ? "No interests found matching your search."
                      : "No interests available."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CModalBody>

      {/* Footer */}
      <CModalFooter className="see-all-interests-modal-footer">
        <CButton
          color="light"
          onClick={handleClose}
          className="see-all-interests-close-button"
        >
          Close
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default SeeAllInterestsModal;
