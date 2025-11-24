/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  AssetIcon,
  StudentProfileModal,
  StudentProfileData,
  FlagUserModal,
  DeactivateUserModal,
  BanUserModal,
  CustomToast,
  ActionDropdown,
  CopyableId,
  Divider,
} from "../../../components-v2";
import { StatusBadge } from "./StatusBadge";
import { InterestChip } from "./InterestChip";
import "./StudentTable.css";

export interface StudentData {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  interests?: string[];
  status: "active" | "banned" | "deactivated" | "disengaged";
  memberSince: string;
  onlineLast: string;
  isFlagged?: boolean;
  // Profile fields
  areaOfStudy?: string;
  lastLogin?: string;
  totalPeers?: number;
  bio?: string;
  // Banned specific fields
  bannedDate?: string;
  bannedBy?: string;
  bannedByEmail?: string;
  bannedTime?: string;
  reason?: string;
  duration?: string;
  // Deactivated specific fields
  deactivatedDate?: string;
  deactivatedBy?: string;
  // History data
  banHistory?: Array<{
    title: string;
    duration: string;
    expiresIn?: string;
    reason: string;
    bannedDate: string;
    bannedTime: string;
    bannedBy: string;
  }>;
  reportHistory?: Array<{
    reportedIdea: string;
    reportId: string;
    reason: string;
    description: string;
    reportedDate: string;
    reportedTime: string;
    reportedBy: string;
    status: "Pending" | "Resolved";
  }>;
  blockedByUsers?: Array<{
    id: string;
    name: string;
    avatar?: string;
    date: string;
    time: string;
  }>;
}

export type StudentTableColumn =
  | "userId"
  | "name"
  | "email"
  | "interests"
  | "status"
  | "memberSince"
  | "onlineLast"
  | "bannedDate"
  | "bannedBy"
  | "reason"
  | "duration"
  | "deactivatedDate"
  | "deactivatedBy";

interface StudentTableProps {
  students: StudentData[];
  columns?: StudentTableColumn[];
  onStudentClick?: (student: StudentData) => void;
  onActionClick?: (student: StudentData) => void;
}

type SortField = StudentTableColumn;
type SortDirection = "asc" | "desc";

export const StudentTable: React.FC<StudentTableProps> = ({
  students,
  columns = [
    "userId",
    "name",
    "email",
    "interests",
    "status",
    "memberSince",
    "onlineLast",
  ],
  onStudentClick,
}) => {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(
    null
  );
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [flagModalVisible, setFlagModalVisible] = useState(false);
  const [studentToFlag, setStudentToFlag] = useState<StudentData | null>(null);
  const [deactivateModalVisible, setDeactivateModalVisible] = useState(false);
  const [studentToDeactivate, setStudentToDeactivate] =
    useState<StudentData | null>(null);
  const [banModalVisible, setBanModalVisible] = useState(false);
  const [studentToBan, setStudentToBan] = useState<StudentData | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleViewProfile = (student: StudentData) => {
    setSelectedStudent(student);
    setProfileModalVisible(true);
  };

  const handleSendEmail = (student: StudentData) => {
    // Copy email to clipboard
    navigator.clipboard.writeText(student.email);

    // Show toast
    setToastMessage("Email copied to clipboard");
    setShowToast(true);

    // Auto-hide after 3 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleCloseProfile = () => {
    setProfileModalVisible(false);
    setSelectedStudent(null);
  };

  const handleFlagUser = (student: StudentData) => {
    // Check if user has opted out of the modal
    const shouldSkip =
      localStorage.getItem("walky-admin-flag-user-hide-message") === "true";

    if (shouldSkip) {
      // Skip modal and flag directly
      handleConfirmFlag(student);
    } else {
      setStudentToFlag(student);
      setFlagModalVisible(true);
    }
  };

  const handleConfirmFlag = (student?: StudentData) => {
    const studentToProcess = student || studentToFlag;
    if (!studentToProcess) return;

    console.log("Flagging user:", studentToProcess);
    // TODO: Call API to flag user
    // Example: await flagUserAPI(studentToProcess.id);

    setFlagModalVisible(false);
    setStudentToFlag(null);
  };

  const handleCloseFlagModal = () => {
    setFlagModalVisible(false);
    setStudentToFlag(null);
  };

  const handleDeactivateUser = (student: StudentData) => {
    setStudentToDeactivate(student);
    setDeactivateModalVisible(true);
  };

  const handleConfirmDeactivate = () => {
    if (!studentToDeactivate) return;

    console.log("Deactivating user:", studentToDeactivate);
    // TODO: Call API to deactivate user
    // Example: await deactivateUserAPI(studentToDeactivate.id);

    setDeactivateModalVisible(false);
    setStudentToDeactivate(null);
  };

  const handleCloseDeactivateModal = () => {
    setDeactivateModalVisible(false);
    setStudentToDeactivate(null);
  };

  const handleBanUser = (student: StudentData) => {
    setStudentToBan(student);
    setBanModalVisible(true);
  };

  const handleConfirmBan = (
    duration: string,
    reason: string,
    resolveReports: boolean
  ) => {
    if (!studentToBan) return;

    console.log("Banning user:", studentToBan);
    console.log("Duration:", duration);
    console.log("Reason:", reason);
    console.log("Resolve reports:", resolveReports);
    // TODO: Call API to ban user
    // Example: await banUserAPI(studentToBan.id, { duration, reason, resolveReports });

    setBanModalVisible(false);
    setStudentToBan(null);
  };

  const handleCloseBanModal = () => {
    setBanModalVisible(false);
    setStudentToBan(null);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
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
        <CopyableId id={student.userId} label="User ID" testId="copy-user-id" />
      ),
    },
    name: {
      label: "Student name",
      sortable: true,
      render: (student) => (
        <>
          {student.isFlagged && (
            <div className="student-flag-icon">
              <AssetIcon name="flag-icon" size={16} color="#d32f2f" />
            </div>
          )}
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
        </>
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

        <div className="content-space-divider" />
        <tbody>
          {sortedStudents.map((student, index) => (
            <React.Fragment key={student.id}>
              <tr
                className={`student-table-row ${
                  student.isFlagged ? "student-row-flagged" : ""
                }`}
                onClick={() => onStudentClick?.(student)}
              >
                {columns.map((column) => (
                  <td key={column} className="student-table-cell">
                    {columnConfig[column].render(student)}
                  </td>
                ))}
                <td className="student-table-cell student-table-actions">
                  <ActionDropdown
                    testId="student-dropdown"
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
                        label: "Ban user",
                        variant: "danger",
                        onClick: (e) => {
                          e.stopPropagation();
                          handleBanUser(student);
                        },
                      },
                      {
                        label: "Deactivate user",
                        variant: "danger",
                        onClick: (e) => {
                          e.stopPropagation();
                          handleDeactivateUser(student);
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
      />

      <FlagUserModal
        visible={flagModalVisible}
        onClose={handleCloseFlagModal}
        onConfirm={() => handleConfirmFlag()}
      />

      <DeactivateUserModal
        visible={deactivateModalVisible}
        onClose={handleCloseDeactivateModal}
        onConfirm={handleConfirmDeactivate}
        userName={studentToDeactivate?.name}
      />

      <BanUserModal
        visible={banModalVisible}
        onClose={handleCloseBanModal}
        onConfirm={handleConfirmBan}
        userName={studentToBan?.name}
      />

      {showToast && (
        <CustomToast
          message={toastMessage}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};
