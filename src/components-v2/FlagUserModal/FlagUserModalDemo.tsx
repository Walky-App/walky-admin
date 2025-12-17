/**
 * FlagUserModal Demo
 *
 * This file demonstrates how to use the FlagUserModal component.
 * It can be imported into any page for testing or as a reference implementation.
 */

import React, { useState } from "react";
import { FlagUserModal } from "./FlagUserModal";

export const FlagUserModalDemo: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [lastAction, setLastAction] = useState<string>("");

  const handleFlagUser = () => {
    setLastAction("User flagged!");
    setShowModal(false);

    // Here you would typically call your API to flag the user
    console.log("Flagging user...");
  };

  const handleCancel = () => {
    setLastAction("Cancelled");
    setShowModal(false);
  };

  const handleShowModal = () => {
    // Check if user has opted out
    const shouldSkip =
      localStorage.getItem("walky-admin-flag-user-hide-message") === "true";

    if (shouldSkip) {
      // Skip modal and flag directly
      setLastAction("User flagged (modal skipped per preference)");
      handleFlagUser();
    } else {
      setShowModal(true);
    }
  };

  const handleClearPreference = () => {
    localStorage.removeItem("walky-admin-flag-user-hide-message");
    setLastAction("Preference cleared - modal will show again");
  };

  return (
    <div style={{ padding: "40px", maxWidth: "600px" }}>
      <h2 style={{ marginBottom: "24px" }}>FlagUserModal Demo</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <button
          data-testid="demo-flag-btn"
          onClick={handleShowModal}
          style={{
            padding: "12px 24px",
            backgroundColor: "#526AC9",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: 600,
          }}
        >
          Flag User (Check Preference First)
        </button>

        <button
          data-testid="demo-show-modal-btn"
          onClick={() => setShowModal(true)}
          style={{
            padding: "12px 24px",
            backgroundColor: "#6D747D",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: 600,
          }}
        >
          Show Modal (Ignore Preference)
        </button>

        <button
          data-testid="demo-clear-preference-btn"
          onClick={handleClearPreference}
          style={{
            padding: "12px 24px",
            backgroundColor: "#FF9500",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: 600,
          }}
        >
          Clear "Don't Show Again" Preference
        </button>
      </div>

      {lastAction && (
        <div
          style={{
            marginTop: "24px",
            padding: "16px",
            backgroundColor: "#F7F8FA",
            borderRadius: "8px",
            borderLeft: "4px solid #526AC9",
          }}
        >
          <strong>Last Action:</strong> {lastAction}
        </div>
      )}

      <div
        style={{
          marginTop: "32px",
          padding: "16px",
          backgroundColor: "#EDF2FF",
          borderRadius: "8px",
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: "12px", fontSize: "16px" }}>
          Instructions:
        </h3>
        <ul
          style={{
            margin: 0,
            paddingLeft: "20px",
            fontSize: "14px",
            lineHeight: 1.6,
          }}
        >
          <li>Click "Flag User" to see the modal with preference checking</li>
          <li>
            Check "Don't show this message again" and confirm to save preference
          </li>
          <li>Click "Flag User" again - the modal will be skipped</li>
          <li>Use "Clear Preference" to reset and see the modal again</li>
          <li>
            Use "Show Modal (Ignore Preference)" to always show the modal for
            testing
          </li>
        </ul>
      </div>

      <FlagUserModal
        visible={showModal}
        onClose={handleCancel}
        onConfirm={handleFlagUser}
      />
    </div>
  );
};

export default FlagUserModalDemo;
