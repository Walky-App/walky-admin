/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import { CModal, CModalBody, CButton } from "@coreui/react";
import AssetIcon from "../AssetIcon/AssetIcon";
import "./BanUserModal.css";

export interface BanUserModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (
    duration: string,
    reason: string,
    resolveReports: boolean
  ) => void;
  userName?: string;
}

const BAN_DURATIONS = [
  "1 Day",
  "3 Days",
  "7 Days",
  "14 Days",
  "30 Days",
  "90 Days",
];

export const BanUserModal: React.FC<BanUserModalProps> = ({
  visible,
  onClose,
  onConfirm,
  userName: _userName,
}) => {
  const [duration, setDuration] = useState("1 Day");
  const [reason, setReason] = useState("");
  const [resolveReports, setResolveReports] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleConfirm = () => {
    if (!reason.trim()) {
      // Could show an error message here
      return;
    }
    onConfirm(duration, reason, resolveReports);
    handleReset();
  };

  const handleCancel = () => {
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setDuration("1 Day");
    setReason("");
    setResolveReports(true);
    setDropdownOpen(false);
  };

  const handleDurationSelect = (selectedDuration: string) => {
    setDuration(selectedDuration);
    setDropdownOpen(false);
  };

  return (
    <CModal
      visible={visible}
      onClose={onClose}
      alignment="center"
      backdrop="static"
      className="ban-user-modal"
    >
      <CModalBody className="ban-user-modal-body">
        {/* Close button */}
        <button
          data-testid="ban-modal-close-btn"
          className="ban-modal-close-icon"
          onClick={handleCancel}
          aria-label="Close modal"
        >
          <AssetIcon name="x-icon" size={16} color="#5B6168" />
        </button>

        <div className="ban-modal-content">
          {/* Content Section */}
          <div>
            {/* Title */}
            <h2 className="ban-modal-title">Ban user</h2>

            {/* Ban Duration Field */}
            <div className="ban-modal-field">
              <label className="ban-modal-label">Ban duration</label>
              <div className="ban-modal-dropdown" ref={dropdownRef}>
                <button
                  data-testid="ban-duration-dropdown-btn"
                  className="ban-modal-dropdown-trigger"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  type="button"
                >
                  <span>{duration}</span>
                  <AssetIcon
                    name="arrow-down"
                    size={12}
                    color="#1D1B20"
                    className={`ban-modal-dropdown-icon ${
                      dropdownOpen ? "open" : ""
                    }`}
                  />
                </button>
                {dropdownOpen && (
                  <div className="ban-modal-dropdown-menu">
                    {BAN_DURATIONS.map((dur, index) => (
                      <React.Fragment key={dur}>
                        {index > 0 && (
                          <div className="ban-modal-dropdown-divider" />
                        )}
                        <button
                          data-testid="ban-duration-option-btn"
                          className={`ban-modal-dropdown-item ${
                            duration === dur ? "selected" : ""
                          }`}
                          onClick={() => handleDurationSelect(dur)}
                          type="button"
                        >
                          {dur}
                        </button>
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Ban Reason Field */}
            <div className="ban-modal-field ban-modal-field-textarea">
              <label className="ban-modal-label">Ban reason</label>
              <textarea
                data-testid="ban-reason-textarea"
                className="ban-modal-textarea"
                placeholder="Enter reason for ban"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={5}
              />
            </div>

            {/* Checkbox */}
            <div className="ban-modal-checkbox-container">
              <label className="ban-modal-checkbox-label">
                <input
                  data-testid="ban-resolve-reports-checkbox"
                  type="checkbox"
                  checked={resolveReports}
                  onChange={(e) => setResolveReports(e.target.checked)}
                  className="ban-modal-checkbox-input"
                />
                <span className="ban-modal-checkbox-custom">
                  {resolveReports && (
                    <svg
                      width="12"
                      height="9"
                      viewBox="0 0 12 9"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 4.5L4.5 8L11 1"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                <span className="ban-modal-checkbox-text">
                  Resolve all related reports for this user
                </span>
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="ban-modal-button-container">
            <CButton onClick={handleCancel} className="ban-modal-cancel-button">
              Cancel
            </CButton>
            <CButton
              onClick={handleConfirm}
              className="ban-modal-confirm-button"
              disabled={!reason.trim()}
            >
              Ban user
            </CButton>
          </div>
        </div>
      </CModalBody>
    </CModal>
  );
};

export default BanUserModal;
