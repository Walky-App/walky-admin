/**
 * DeactivateUserModal Demo
 *
 * This file demonstrates how to use the DeactivateUserModal component.
 * It can be imported into any page for testing or as a reference implementation.
 */

import React, { useState } from "react";
import { DeactivateUserModal } from "./DeactivateUserModal";

export const DeactivateUserModalDemo: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [userName, setUserName] = useState("Austin Smith");
  const [lastAction, setLastAction] = useState<string>("");

  const handleDeactivateUser = () => {
    setLastAction(`User "${userName}" deactivated!`);
    setShowModal(false);

    // Here you would typically call your API to deactivate the user
    console.log("Deactivating user:", userName);
  };

  const handleCancel = () => {
    setLastAction("Deactivation cancelled");
    setShowModal(false);
  };

  return (
    <div style={{ padding: "40px", maxWidth: "600px" }}>
      <h2 style={{ marginBottom: "24px" }}>DeactivateUserModal Demo</h2>

      <div style={{ marginBottom: "24px" }}>
        <label
          style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}
        >
          User Name:
        </label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          style={{
            width: "100%",
            padding: "8px 12px",
            border: "1px solid #d2d2d3",
            borderRadius: "8px",
            fontSize: "14px",
          }}
          placeholder="Enter user name"
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: "12px 24px",
            backgroundColor: "#1D1B20",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: 600,
          }}
        >
          Deactivate User
        </button>

        <button
          onClick={() => {
            setUserName("");
            setShowModal(true);
          }}
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
          Test Without User Name
        </button>
      </div>

      {lastAction && (
        <div
          style={{
            marginTop: "24px",
            padding: "16px",
            backgroundColor: "#F7F8FA",
            borderRadius: "8px",
            borderLeft: "4px solid #1D1B20",
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
          <li>Enter a user name in the input field</li>
          <li>Click "Deactivate User" to see the modal with the user name</li>
          <li>
            The modal shows confirmation message with the user name in bold
          </li>
          <li>Email notification message is displayed</li>
          <li>Test with empty name to see default "this user" text</li>
        </ul>
      </div>

      <DeactivateUserModal
        visible={showModal}
        onClose={handleCancel}
        onConfirm={handleDeactivateUser}
        userName={userName}
      />
    </div>
  );
};

export default DeactivateUserModalDemo;
