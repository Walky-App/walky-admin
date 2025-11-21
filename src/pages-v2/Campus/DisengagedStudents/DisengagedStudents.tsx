/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState } from "react";
import { ExportButton } from "../../../components-v2/ExportButton/ExportButton";
import {
  StudentProfileModal,
  StudentProfileData,
  CustomToast,
} from "../../../components-v2";
import { StatsCard } from "../components/StatsCard";
import "./DisengagedStudents.css";

interface DisengagedStudent {
  id: string;
  name: string;
  avatar?: string;
  peers: number;
  ignoredInvitations: number;
  memberSince: string;
  email: string;
  reported: boolean;
}

export const DisengagedStudents: React.FC = () => {
  const [selectedStudent, setSelectedStudent] =
    useState<DisengagedStudent | null>(null);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Mock data
  const mockStudents: DisengagedStudent[] = [
    {
      id: "1",
      name: "Austin",
      avatar: "A",
      peers: 0,
      ignoredInvitations: 10,
      memberSince: "Sep 28, 2025",
      email: "Austin@FIU.edu.co",
      reported: false,
    },
    {
      id: "2",
      name: "Leo",
      avatar: "L",
      peers: 1,
      ignoredInvitations: 15,
      memberSince: "Sep 28, 2025",
      email: "Leo@FIU.edu.co",
      reported: true,
    },
    {
      id: "3",
      name: "Natasha",
      avatar: "N",
      peers: 1,
      ignoredInvitations: 12,
      memberSince: "Sep 28, 2025",
      email: "Natasha@FIU.edu.co",
      reported: false,
    },
  ];

  const handleSendOutreach = async (student: DisengagedStudent) => {
    try {
      await navigator.clipboard.writeText(student.email);
      setToastMessage("Email copied to clipboard");
      setShowToast(true);
    } catch (error) {
      console.error("Failed to copy email:", error);
      setToastMessage("Failed to copy email");
      setShowToast(true);
    }
  };

  const handleStudentClick = (student: DisengagedStudent) => {
    setSelectedStudent(student);
    setProfileModalVisible(true);
  };

  const handleCloseProfile = () => {
    setProfileModalVisible(false);
    setSelectedStudent(null);
  };

  const handleExport = () => {
    console.log("Export clicked");
  };

  return (
    <div className="disengaged-students-page">
      {/* Stats Cards */}
      <div className="disengaged-students-stats">
        <StatsCard
          title="Total students"
          value="264"
          iconName="double-users-icon"
          iconBgColor="#E9FCF4"
          iconColor="#00C617"
          trend={{
            value: "8.5%",
            isPositive: true,
            label: "from last month",
          }}
        />
        <StatsCard
          title="Disengaged students"
          value="3"
          // @ts-ignore
          iconName="x-icon"
          iconBgColor="#FCE9E9"
          iconColor="#FF8082"
          trend={{
            value: "8.5%",
            isPositive: false,
            label: "from last month",
          }}
        />
      </div>

      {/* Content */}
      <div className="disengaged-students-content">
        <div className="disengaged-students-header">
          <div className="disengaged-students-title-section">
            <h1 className="disengaged-students-title">
              Potentially disengaged students
            </h1>
            <p className="disengaged-students-description">
              This information will be obtained by analyzing the number of peers
              and the number of ignored invitations.
            </p>
          </div>
          <ExportButton onClick={handleExport} />
        </div>

        {/* Custom Table */}
        <div className="disengaged-table-wrapper">
          <table className="disengaged-table">
            <thead>
              <tr className="disengaged-table-header">
                <th>Student name</th>
                <th>Peers</th>
                <th>Ignored invitations</th>
                <th>Member since</th>
                <th>Email address</th>
                <th>Reported</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockStudents.map((student) => (
                <tr key={student.id} className="disengaged-table-row">
                  <td>
                    <div className="disengaged-student-info">
                      <div className="disengaged-student-avatar">
                        {student.avatar && !student.avatar.match(/^https?:/) ? (
                          <div className="disengaged-student-avatar-placeholder">
                            {student.avatar}
                          </div>
                        ) : (
                          <img src={student.avatar} alt={student.name} />
                        )}
                      </div>
                      <span
                        className="disengaged-student-name"
                        onClick={() => handleStudentClick(student)}
                        style={{ cursor: "pointer" }}
                      >
                        {student.name}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="disengaged-cell-value">
                      {student.peers}
                    </span>
                  </td>
                  <td>
                    <span className="disengaged-cell-value">
                      {student.ignoredInvitations}
                    </span>
                  </td>
                  <td>
                    <span className="disengaged-cell-value">
                      {student.memberSince}
                    </span>
                  </td>
                  <td>
                    <span className="disengaged-cell-value">
                      {student.email}
                    </span>
                  </td>
                  <td>
                    {student.reported ? (
                      <div className="disengaged-status-badge reported">
                        Reported
                      </div>
                    ) : (
                      <div className="disengaged-status-badge not-reported">
                        Not reported
                      </div>
                    )}
                  </td>
                  <td>
                    <button
                      data-testid="send-outreach-btn"
                      className="disengaged-send-outreach-button"
                      onClick={() => handleSendOutreach(student)}
                    >
                      Send outreach
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <StudentProfileModal
        visible={profileModalVisible}
        student={
          selectedStudent
            ? ({
                userId: selectedStudent.id,
                name: selectedStudent.name,
                email: selectedStudent.email,
                avatar: selectedStudent.avatar,
                status: "disengaged" as const,
                interests: [],
                memberSince: selectedStudent.memberSince,
                onlineLast: "-",
              } as unknown as StudentProfileData)
            : null
        }
        onClose={handleCloseProfile}
        onBanUser={(student) => console.log("Ban user", student)}
        onDeactivateUser={(student) => console.log("Deactivate user", student)}
      />

      {showToast && (
        <CustomToast
          message={toastMessage}
          onClose={() => setShowToast(false)}
          duration={3000}
        />
      )}
    </div>
  );
};
