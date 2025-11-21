 
import React, { useState } from "react";
import {
  AssetIcon,
  StudentProfileModal,
  StudentProfileData,
  ActivateUserModal,
  ActionDropdown,
  CustomToast,
  FlagUserModal,
} from "../../../components-v2";
import { StatusBadge } from "./StatusBadge";
import { InterestChip } from "./InterestChip";
import "./StudentTable.css";
import { StudentData, StudentTableColumn } from "./StudentTable";

interface DeactivatedStudentTableProps {
  students: StudentData[];
  columns?: StudentTableColumn[];
  onStudentClick?: (student: StudentData) => void;
}

type SortField = StudentTableColumn;
type SortDirection = "asc" | "desc";

export const DeactivatedStudentTable: React.FC<
  DeactivatedStudentTableProps
> = ({ students, columns = ["userId", "name", "email"], onStudentClick }) => {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(
    null
  );
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [activateModalVisible, setActivateModalVisible] = useState(false);
  const [flagModalVisible, setFlagModalVisible] = useState(false);
  const [studentToActivate, setStudentToActivate] =
    useState<StudentData | null>(null);
  const [studentToFlag, setStudentToFlag] = useState<StudentData | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleViewProfile = (student: StudentData) => {
    setSelectedStudent(student);
    setProfileModalVisible(true);
  };

  const handleSendEmail = async (student: StudentData) => {
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

  const handleFlagUser = (student: StudentData) => {
    setStudentToFlag(student);
    setFlagModalVisible(true);
  };

  const handleConfirmFlag = () => {
    if (!studentToFlag) return;

    console.log("Flagging user:", studentToFlag);
    // TODO: Call API to flag user
    // Example: await flagUserAPI(studentToFlag.id);

    setFlagModalVisible(false);
    setStudentToFlag(null);
  };

  const handleCloseFlagModal = () => {
    setFlagModalVisible(false);
    setStudentToFlag(null);
  };

  const handleCloseProfile = () => {
    setProfileModalVisible(false);
    setSelectedStudent(null);
  };

  const handleActivateUser = (student: StudentData) => {
    setStudentToActivate(student);
    setActivateModalVisible(true);
  };

  const handleConfirmActivate = () => {
    if (!studentToActivate) return;

    console.log("Activating user:", studentToActivate);
    // TODO: Call API to activate user
    // Example: await activateUserAPI(studentToActivate.id);

    setActivateModalVisible(false);
    setStudentToActivate(null);
  };

  const handleCloseActivateModal = () => {
    setActivateModalVisible(false);
    setStudentToActivate(null);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleCopyUserId = (userId: string) => {
    navigator.clipboard.writeText(userId);
  };

  const sortedStudents = React.useMemo(() => {
    if (!sortField) return students;

    return [...students].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue === undefined || bValue === undefined) return 0;

      let comparison = 0;
      if (typeof aValue === "string" && typeof bValue === "string") {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === "number" && typeof bValue === "number") {
        comparison = aValue - bValue;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [students, sortField, sortDirection]);

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
            aria-label="Copy user ID"
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
        <div className="student-name-cell">
          <div className="student-avatar">{student.avatar}</div>
          <span>{student.name}</span>
        </div>
      ),
    },
    email: {
      label: "Email address",
      sortable: true,
      render: (student) => <span>{student.email}</span>,
    },
    interests: {
      label: "Interests",
      sortable: false,
      render: (student) => (
        <div className="interests-cell">
          {student.interests?.slice(0, 2).map((interest, index) => (
            <InterestChip key={index} label={interest} />
          ))}
          {student.interests && student.interests.length > 2 && (
            <span className="interests-more">
              +{student.interests.length - 2}
            </span>
          )}
        </div>
      ),
    },
    status: {
      label: "Status",
      sortable: true,
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
      label: "Deactivation date",
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
          {sortedStudents.map((student) => (
            <tr
              key={student.id}
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
                  testId="deactivated-student-dropdown"
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
                      label: "Flag",
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
                      label: "Activate user",
                      variant: "danger",
                      onClick: (e) => {
                        e.stopPropagation();
                        handleActivateUser(student);
                      },
                    },
                  ]}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <StudentProfileModal
        visible={profileModalVisible}
        student={selectedStudent as StudentProfileData | null}
        onClose={handleCloseProfile}
        onBanUser={(student) => console.log("Ban user", student)}
        onDeactivateUser={(student) => console.log("Deactivate user", student)}
      />

      <ActivateUserModal
        visible={activateModalVisible}
        onClose={handleCloseActivateModal}
        onConfirm={handleConfirmActivate}
        userName={studentToActivate?.name}
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
