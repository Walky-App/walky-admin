 
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
  CopyableId,
} from "../../../components-v2";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../../API";
import { StatusBadge } from "./StatusBadge";
import { InterestChip } from "./InterestChip";
import "./StudentTable.css";
import { StudentData, StudentTableColumn } from "./StudentTable";

interface BannedStudentTableProps {
  students: StudentData[];
  columns?: StudentTableColumn[];
  onStudentClick?: (student: StudentData) => void;
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
}) => {
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

  const queryClient = useQueryClient();

  const deactivateMutation = useMutation({
    mutationFn: (id: string) => apiClient.api.adminV2StudentsDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      setToastMessage("User deactivated successfully");
      setShowToast(true);
    },
    onError: () => {
      setToastMessage("Failed to deactivate user");
      setShowToast(true);
    }
  });

  const unbanMutation = useMutation({
    mutationFn: (id: string) => apiClient.api.adminV2StudentsUnbanCreate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      setToastMessage("User unbanned successfully");
      setShowToast(true);
    },
    onError: () => {
      setToastMessage("Failed to unban user");
      setShowToast(true);
    }
  });

  const flagMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      apiClient.api.adminV2StudentsFlagCreate(id, { reason: reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      setToastMessage("User flagged successfully");
      setShowToast(true);
    },
    onError: () => {
      setToastMessage("Failed to flag user");
      setShowToast(true);
    }
  });

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

  const handleDeactivateUser = (student: StudentData) => {
    setStudentToDeactivate(student);
    setDeactivateModalVisible(true);
  };

  const handleConfirmDeactivate = () => {
    if (!studentToDeactivate) return;
    deactivateMutation.mutate(studentToDeactivate.id);
    setDeactivateModalVisible(false);
    setStudentToDeactivate(null);
  };

  const handleCloseDeactivateModal = () => {
    setDeactivateModalVisible(false);
    setStudentToDeactivate(null);
  };

  const handleFlagUser = (student: StudentData) => {
    setStudentToFlag(student);
    setFlagModalVisible(true);
  };

  const handleConfirmFlag = () => {
    if (!studentToFlag) return;
    flagMutation.mutate({ id: studentToFlag.id, reason: "Flagged by admin" });
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

  const handleUnbanUser = (student: StudentData) => {
    setStudentToUnban(student);
    setUnbanModalVisible(true);
  };

  const handleConfirmUnban = () => {
    if (!studentToUnban) return;
    unbanMutation.mutate(studentToUnban.id);
    setUnbanModalVisible(false);
    setStudentToUnban(null);
  };

  const handleCloseUnbanModal = () => {
    setUnbanModalVisible(false);
    setStudentToUnban(null);
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
                        onClick: () => { },
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
