import React from "react";
import { ExportButton } from "../../../components-v2/ExportButton/ExportButton";
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

  const handleSendOutreach = (student: DisengagedStudent) => {
    console.log("Send outreach to:", student);
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
          trend={{
            value: "8.5%",
            isPositive: true,
            label: "from last month",
          }}
        />
        <StatsCard
          title="Disengaged students"
          value="3"
          iconName="lock-icon"
          iconBgColor="#FCE9E9"
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
                      <span className="disengaged-student-name">
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
    </div>
  );
};
