/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  AssetIcon,
  StudentProfileModal,
  StudentProfileData,
  UnbanUserModal,
  DeactivateUserModal,
  FlagUserModal,
  ActionDropdown,
  CustomToast,
  Divider,
} from "../../../components-v2";
import { useMixpanel } from "../../../hooks";
import { StatusBadge } from "./StatusBadge";
import { InterestChip } from "./InterestChip";
import "./StudentTable.css";
import { StudentData, StudentTableColumn } from "./StudentTable";

interface BannedStudentTableProps {
  students: StudentData[];
  columns?: StudentTableColumn[];
  onStudentClick?: (student: StudentData) => void;
  pageContext?: string;
}

type SortField = StudentTableColumn;
type SortDirection = "asc" | "desc";

export const BannedStudentTable: React.FC<BannedStudentTableProps> = ({
  students,
  columns = [
    "userId",
    "name",
    "bannedBy",
    "duration",
    "status",
    "bannedDate",
    "reason",
  ],
  onStudentClick,
  pageContext = "Banned Students",
}) => {
  const { trackEvent } = useMixpanel();
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(
    null
  );
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [unbanModalVisible, setUnbanModalVisible] = useState(false);
  const [deactivateModalVisible, setDeactivateModalVisible] = useState(false);
  const [flagModalVisible, setFlagModalVisible] = useState(false);
  const [studentToUnban, setStudentToUnban] = useState<StudentData | null>(
    null
  );
  const [studentToDeactivate, setStudentToDeactivate] =
    useState<StudentData | null>(null);
  const [studentToFlag, setStudentToFlag] = useState<StudentData | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleViewProfile = (student: StudentData) => {
    setSelectedStudent(student);
    setProfileModalVisible(true);
    trackEvent(`${pageContext} - View Profile Action`, {
      student_id: student.userId,
      student_name: student.name,
      student_status: student.status,
    });
  };

  const handleSendEmail = async (student: StudentData) => {
    try {
      await navigator.clipboard.writeText(student.email);
      setToastMessage("Email copied to clipboard");
      setShowToast(true);
      trackEvent(`${pageContext} - Send Email Action`, {
        student_id: student.userId,
        student_name: student.name,
        student_email: student.email,
      });
    } catch (error) {
      console.error("Failed to copy email:", error);
      setToastMessage("Failed to copy email");
      setShowToast(true);
    }
  };

  const handleDeactivateUser = (student: StudentData) => {
    setStudentToDeactivate(student);
    setDeactivateModalVisible(true);
    trackEvent(`${pageContext} - Deactivate User Action`, {
      student_id: student.userId,
      student_name: student.name,
    });
  };

  const handleConfirmDeactivate = () => {
    if (!studentToDeactivate) return;

    console.log("Deactivating user:", studentToDeactivate);
    // TODO: Call API to deactivate user
    // Example: await deactivateUserAPI(studentToDeactivate.id);

    trackEvent(`${pageContext} - Deactivate User Confirmed`, {
      student_id: studentToDeactivate.userId,
      student_name: studentToDeactivate.name,
    });

    setDeactivateModalVisible(false);
    setStudentToDeactivate(null);
  };

  const handleCloseDeactivateModal = () => {
    if (studentToDeactivate) {
      trackEvent(`${pageContext} - Deactivate User Modal Closed`, {
        student_id: studentToDeactivate.userId,
        student_name: studentToDeactivate.name,
      });
    }
    setDeactivateModalVisible(false);
    setStudentToDeactivate(null);
  };

  const handleFlagUser = (student: StudentData) => {
    setStudentToFlag(student);
    setFlagModalVisible(true);
    trackEvent(`${pageContext} - Flag User Action`, {
      student_id: student.userId,
      student_name: student.name,
      already_flagged: student.isFlagged || false,
    });
  };

  const handleConfirmFlag = () => {
    if (!studentToFlag) return;

    console.log("Flagging user:", studentToFlag);
    // TODO: Call API to flag user
    // Example: await flagUserAPI(studentToFlag.id);

    trackEvent(`${pageContext} - Flag User Confirmed`, {
      student_id: studentToFlag.userId,
      student_name: studentToFlag.name,
    });

    setFlagModalVisible(false);
    setStudentToFlag(null);
  };

  const handleCloseFlagModal = () => {
    if (studentToFlag) {
      trackEvent(`${pageContext} - Flag User Modal Closed`, {
        student_id: studentToFlag.userId,
        student_name: studentToFlag.name,
      });
    }
    setFlagModalVisible(false);
    setStudentToFlag(null);
  };

  const handleCloseProfile = () => {
    setProfileModalVisible(false);
    setSelectedStudent(null);
  };

  const handleUnbanUser = (student: StudentData) => {
    setStudentToUnban(student);
    setUnbanModalVisible(true);
    trackEvent(`${pageContext} - Unban User Action`, {
      student_id: student.userId,
      student_name: student.name,
    });
  };

  const handleConfirmUnban = () => {
    if (!studentToUnban) return;

    console.log("Unbanning user:", studentToUnban);
    // TODO: Call API to unban user
    // Example: await unbanUserAPI(studentToUnban.id);

    trackEvent(`${pageContext} - Unban User Confirmed`, {
      student_id: studentToUnban.userId,
      student_name: studentToUnban.name,
    });

    setUnbanModalVisible(false);
    setStudentToUnban(null);
  };

  const handleCloseUnbanModal = () => {
    if (studentToUnban) {
      trackEvent(`${pageContext} - Unban User Modal Closed`, {
        student_id: studentToUnban.userId,
        student_name: studentToUnban.name,
      });
    }
    setUnbanModalVisible(false);
    setStudentToUnban(null);
  };

  const handleSort = (field: SortField) => {
    const newDirection =
      sortField === field ? (sortDirection === "asc" ? "desc" : "asc") : "asc";

    trackEvent(`${pageContext} - Table Sorted`, {
      sort_field: field,
      sort_direction: newDirection,
      previous_field: sortField || "none",
    });

    if (sortField === field) {
      setSortDirection(newDirection);
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleCopyUserId = (userId: string) => {
    navigator.clipboard.writeText(userId);
    trackEvent(`${pageContext} - User ID Copied`, {
      user_id: userId,
    });
  };

  const sortedStudents = React.useMemo(() => {
    if (!sortField) return students;

    return [...students].sort((a, b) => {
      const aValue = (a as any)[sortField];
      const bValue = (b as any)[sortField];

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [students, sortField, sortDirection]);

  const renderInterests = (interests?: string[]) => {
    if (!interests || interests.length === 0) return null;

    const visible = interests.slice(0, 2);
    const remaining = interests.length - 2;

    return (
      <div className="student-interests">
        {visible.map((interest, idx) => (
          <InterestChip key={idx} label={interest} />
        ))}
        {remaining > 0 && (
          <span className="student-interests-more">+{remaining}...</span>
        )}
      </div>
    );
  };

  const columnConfig: Record<
    StudentTableColumn,
    {
      label: string;
      sortable: boolean;
      render: (student: StudentData) => React.ReactNode;
    }
  > = {
    userId: {
      label: "User ID",
      sortable: true,
      render: (student) => (
        <div className="student-userid">
          <div className="student-userid-badge">
            <span className="student-userid-text">{student.userId}</span>
          </div>
          <button
            data-testid="copy-user-id-btn"
            className="student-userid-copy"
            onClick={(e) => {
              e.stopPropagation();
              handleCopyUserId(student.userId);
            }}
            title="Copy User ID"
          >
            <AssetIcon name="copy-icon" size={16} color="#321FDB" />
          </button>
        </div>
      ),
    },
    name: {
      label: "Student name",
      sortable: true,
      render: (student) => (
        <div className="student-info">
          <div className="student-avatar">
            {student.avatar && !student.avatar.match(/^[A-Z]$/) ? (
              <img src={student.avatar} alt={student.name} />
            ) : (
              <div className="student-avatar-placeholder">
                {student.avatar || student.name.charAt(0)}
              </div>
            )}
          </div>
          <span className="student-name">{student.name}</span>
        </div>
      ),
    },
    email: {
      label: "Email address",
      sortable: false,
      render: (student) => (
        <span className="student-email">{student.email}</span>
      ),
    },
    interests: {
      label: "Interest",
      sortable: false,
      render: (student) => renderInterests(student.interests),
    },
    status: {
      label: "Status",
      sortable: false,
      render: (student) => <StatusBadge status={student.status} />,
    },
    memberSince: {
      label: "Member since",
      sortable: true,
      render: (student) => (
        <span className="student-date">{student.memberSince}</span>
      ),
    },
    onlineLast: {
      label: "Online last",
      sortable: true,
      render: (student) => (
        <span className="student-date">{student.onlineLast}</span>
      ),
    },
    bannedDate: {
      label: "Banned date",
      sortable: true,
      render: (student) => (
        <span className="student-date">{student.bannedDate || "-"}</span>
      ),
    },
    bannedBy: {
      label: "Banned by",
      sortable: false,
      render: (student) => <span>{student.bannedBy || "-"}</span>,
    },
    reason: {
      label: "Reason",
      sortable: false,
      render: (student) => <span>{student.reason || "-"}</span>,
    },
    duration: {
      label: "Duration",
      sortable: false,
      render: (student) => <span>{student.duration || "-"}</span>,
    },
    deactivatedDate: {
      label: "Deactivated date",
      sortable: true,
      render: (student) => (
        <span className="student-date">{student.deactivatedDate || "-"}</span>
      ),
    },
    deactivatedBy: {
      label: "Deactivated by",
      sortable: false,
      render: (student) => <span>{student.deactivatedBy || "-"}</span>,
    },
  };

  return (
    <div className="student-table-wrapper">
      <table className="student-table">
        <thead>
          <tr className="student-table-header">
            {columns.map((column) => {
              const config = columnConfig[column];
              return (
                <th
                  key={column}
                  onClick={
                    config.sortable ? () => handleSort(column) : undefined
                  }
                  style={{ cursor: config.sortable ? "pointer" : "default" }}
                >
                  {config.sortable ? (
                    <div className="table-header-cell">
                      <span>{config.label}</span>
                      <AssetIcon name="swap-arrows-icon" size={24} />
                    </div>
                  ) : (
                    <span>{config.label}</span>
                  )}
                </th>
              );
            })}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sortedStudents.map((student, index) => (
            <React.Fragment key={student.id}>
              <tr
                className="student-table-row"
                onClick={() => onStudentClick?.(student)}
              >
                {columns.map((column) => (
                  <td key={column} className="student-table-cell">
                    {columnConfig[column].render(student)}
                  </td>
                ))}
                <td className="student-table-cell student-table-actions">
                  <ActionDropdown
                    testId="banned-student-dropdown"
                    items={[
                      {
                        label: "View profile",
                        onClick: (e) => {
                          e.stopPropagation();
                          handleViewProfile(student);
                        },
                      },
                      {
                        label: "Send email",
                        onClick: (e) => {
                          e.stopPropagation();
                          handleSendEmail(student);
                        },
                      },
                      {
                        label: "Flag user",
                        icon: "flag-icon",
                        onClick: (e) => {
                          e.stopPropagation();
                          handleFlagUser(student);
                        },
                      },

                      {
                        isDivider: true,
                        label: "",
                        onClick: () => {},
                      },
                      {
                        label: "Deactivate user",
                        variant: "danger",
                        onClick: (e) => {
                          e.stopPropagation();
                          handleDeactivateUser(student);
                        },
                      },
                      {
                        label: "Unban user",
                        variant: "danger",
                        onClick: (e) => {
                          e.stopPropagation();
                          handleUnbanUser(student);
                        },
                      },
                    ]}
                  />
                </td>
              </tr>
              {index < sortedStudents.length - 1 && (
                <tr className="student-divider-row">
                  <td colSpan={columns.length + 1}>
                    <Divider />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <StudentProfileModal
        visible={profileModalVisible}
        student={selectedStudent as StudentProfileData | null}
        onClose={handleCloseProfile}
        onBanUser={(student) => console.log("Ban user", student)}
        onDeactivateUser={(student) => console.log("Deactivate user", student)}
        pageContext={pageContext}
      />

      <UnbanUserModal
        visible={unbanModalVisible}
        onClose={handleCloseUnbanModal}
        onConfirm={handleConfirmUnban}
        userName={studentToUnban?.name}
      />

      <DeactivateUserModal
        visible={deactivateModalVisible}
        onClose={handleCloseDeactivateModal}
        onConfirm={handleConfirmDeactivate}
        userName={studentToDeactivate?.name}
      />

      <FlagUserModal
        visible={flagModalVisible}
        onClose={handleCloseFlagModal}
        onConfirm={handleConfirmFlag}
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
