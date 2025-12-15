/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useRef, useState } from "react";
import { ExportButton } from "../../../components-v2/ExportButton/ExportButton";
import {
  StudentProfileModal,
  StudentProfileData,
  CustomToast,
  Divider,
  Pagination,
} from "../../../components-v2";
import { StatsCard } from "../components/StatsCard";
import { StudentTableSkeleton } from "../components/StudentTableSkeleton/StudentTableSkeleton";
import { NoStudentsFound } from "../components/NoStudentsFound/NoStudentsFound";
import { formatMemberSince } from "../../../lib/utils/dateUtils";
import "./DisengagedStudents.css";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../API";

interface DisengagedStudent {
  id: string;
  userId?: string;
  name: string;
  avatar?: string;
  peers: number;
  ignoredInvitations: number;
  memberSince: string;
  email: string;
  reported: boolean;
  status?: string;
  bio?: string;
  lastLogin?: string;
  areaOfStudy?: string;
  totalPeers?: number;
  interests?: string[];
}

export const DisengagedStudents: React.FC = () => {
  const [selectedStudent, setSelectedStudent] =
    useState<DisengagedStudent | null>(null);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage] = useState("");
  const [currentPage] = useState(1);
  const entriesPerPage = 10;

  const exportRef = useRef<HTMLElement | null>(null);
  const { data: studentsData, isLoading: isStudentsLoading } = useQuery({
    queryKey: ["students", currentPage, "disengaged"],
    queryFn: () =>
      apiClient.api.adminV2StudentsList({
        page: currentPage,
        limit: entriesPerPage,
        status: "disengaged",
      }),
  });

  const { data: statsData, isLoading: isStatsLoading } = useQuery({
    queryKey: ["studentStats"],
    queryFn: () => apiClient.api.adminV2StudentsStatsList(),
  });

  const isLoading = isStudentsLoading || isStatsLoading;

  const students: DisengagedStudent[] = (studentsData?.data.data || []).map(
    (student) => ({
      id: student.id || "",
      userId: student.userId,
      name: student.name || "",
      avatar: student.avatar,
      peers: student.peers || student.totalPeers || 0,
      ignoredInvitations: student.ignoredInvitations || 0,
      memberSince: formatMemberSince(student.memberSince),
      email: student.email || "",
      reported: student.isFlagged || false,
      status: student.status,
      bio: student.bio,
      lastLogin: student.onlineLast,
      areaOfStudy: student.studyMain,
      totalPeers: student.totalPeers,
      interests: student.interests || [],
    })
  );
  const handleSendOutreach = (student: DisengagedStudent) => {
    window.location.href = `mailto:${student.email}`;
  };

  const handleStudentClick = async (student: DisengagedStudent) => {
    try {
      const response = await apiClient.api.adminV2StudentsDetail(student.id);
      const details = response.data;

      // Format lastLogin date nicely
      const formatLastLogin = (dateStr?: string) => {
        if (!dateStr) return "N/A";
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return "N/A";
        return date.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
      };

      // Merge details with existing student data
      const fullStudentData: DisengagedStudent = {
        ...student,
        userId: details.userId || student.userId || student.id,
        areaOfStudy: details.areaOfStudy || student.areaOfStudy || "N/A",
        lastLogin: formatLastLogin(details.lastLogin || student.lastLogin),
        totalPeers: details.totalPeers ?? details.peers ?? student.totalPeers ?? student.peers ?? 0,
        bio: details.bio || student.bio || "No bio provided",
        interests: details.interests || student.interests || [],
        status: details.status || student.status,
      };

      setSelectedStudent(fullStudentData);
      setProfileModalVisible(true);
    } catch (error) {
      console.error("Error fetching student details:", error);
      // Fallback to basic data if API call fails
      setSelectedStudent(student);
      setProfileModalVisible(true);
    }
  };

  const handleCloseProfile = () => {
    setProfileModalVisible(false);
    setSelectedStudent(null);
  };

  return (
    <main className="disengaged-students-page" ref={exportRef}>
      {/* Stats Cards */}
      <div className="disengaged-students-stats">
        <StatsCard
          title="Total students"
          value={statsData?.data.totalStudents?.toString() || "0"}
          iconName="double-users-icon"
          iconBgColor="#E9FCF4"
          iconColor="#00C617"
        />
        <StatsCard
          title="Disengaged students"
          value={studentsData?.data.total?.toString() || "0"}
          // @ts-ignore
          iconName="x-icon"
          iconBgColor="#FCE9E9"
          iconColor="#FF8082"
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
          <ExportButton captureRef={exportRef} filename="disengaged_students" />
        </div>

        {/* Custom Table */}
        {isLoading ? (
          <StudentTableSkeleton />
        ) : students.length === 0 ? (
          <NoStudentsFound />
        ) : (
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
                {students.map((student, index) => (
                  <React.Fragment key={student.id}>
                    <tr className="disengaged-table-row">
                      <td>
                        <div className="disengaged-student-info">
                          <div className="disengaged-student-avatar">
                            {student.avatar &&
                            student.avatar.match(/^https?:/) ? (
                              <img src={student.avatar} alt={student.name} />
                            ) : (
                              <div className="disengaged-student-avatar-placeholder">
                                {student.avatar || student.name.charAt(0)}
                              </div>
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
                    {index < students.length - 1 && (
                      <tr className="disengaged-divider-row">
                        <td colSpan={7}>
                          <Divider />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && students.length > 0 && (
          <div className="disengaged-students-pagination">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(
                (studentsData?.data.total || 0) / entriesPerPage
              )}
              totalEntries={studentsData?.data.total || 0}
              entriesPerPage={entriesPerPage}
              onPageChange={() => {}}
            />
          </div>
        )}
      </div>

      <StudentProfileModal
        visible={profileModalVisible}
        student={
          selectedStudent
            ? ({
                id: selectedStudent.id,
                userId: selectedStudent.userId || selectedStudent.id,
                name: selectedStudent.name,
                email: selectedStudent.email,
                avatar: selectedStudent.avatar,
                status: selectedStudent.status || "disengaged",
                interests: selectedStudent.interests || [],
                memberSince: selectedStudent.memberSince,
                lastLogin: selectedStudent.lastLogin || "N/A",
                totalPeers:
                  selectedStudent.totalPeers ?? selectedStudent.peers ?? 0,
                bio: selectedStudent.bio || "No bio provided",
                areaOfStudy: selectedStudent.areaOfStudy || "N/A",
              } as StudentProfileData)
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
    </main>
  );
};
