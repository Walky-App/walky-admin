import React, { useState } from "react";
import {
  AssetIcon,
  StudentProfileModal,
  StudentProfileData,
  ActivateUserModal,
  ActionDropdown,
  CustomToast,
  FlagUserModal,
  Divider,
} from "../../../components-v2";
import { CopyableId } from "../../../components-v2/CopyableId";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../../API";
import { usePermissions } from "../../../hooks/usePermissions";
import { getFirstName } from "../../../lib/utils/nameUtils";
import { StatusBadge } from "./StatusBadge";
import { InterestChip } from "./InterestChip";
import { NoStudentsFound } from "./NoStudentsFound/NoStudentsFound";
import "./StudentTable.css";
import { StudentData, StudentTableColumn } from "./StudentTable";

type SortField = StudentTableColumn;
type SortDirection = "asc" | "desc";

interface DeactivatedStudentTableProps {
  students: StudentData[];
  columns?: StudentTableColumn[];
  onStudentClick?: (student: StudentData) => void;
  sortBy?: StudentTableColumn;
  sortOrder?: SortDirection;
  onSortChange?: (field: StudentTableColumn, order: SortDirection) => void;
  emptyMessage?: string;
}

export const DeactivatedStudentTable: React.FC<
  DeactivatedStudentTableProps
> = ({
  students,
  columns = ["userId", "name", "email"],
  onStudentClick,
  sortBy,
  sortOrder = "asc",
  onSortChange,
  emptyMessage = "No students found",
}) => {
  const { canUpdate } = usePermissions();

  // Permission check for deactivated student actions (reactivate)
  const canModifyDeactivatedStudents = canUpdate("inactive_students");

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

  const queryClient = useQueryClient();

  const activateMutation = useMutation({
    mutationFn: (id: string) => apiClient.api.adminV2StudentsActivateCreate(id),
    onSuccess: () => {
      // Invalidate all student queries to refresh both active and deactivated lists
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) && query.queryKey[0] === "students",
      });
      queryClient.invalidateQueries({ queryKey: ["studentStats"] });
      setToastMessage("User activated successfully");
      setShowToast(true);
    },
    onError: () => {
      setToastMessage("Failed to activate user");
      setShowToast(true);
    },
  });

  const flagMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      apiClient.api.adminV2StudentsFlagCreate(id, { reason: reason }),
    onSuccess: () => {
      // Invalidate all student queries to refresh all lists
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) && query.queryKey[0] === "students",
      });
      setToastMessage("User flagged successfully");
      setShowToast(true);
    },
    onError: () => {
      setToastMessage("Failed to flag user");
      setShowToast(true);
    },
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

  const handleActivateUser = (student: StudentData) => {
    setStudentToActivate(student);
    setActivateModalVisible(true);
  };

  const handleConfirmActivate = () => {
    if (!studentToActivate) return;
    activateMutation.mutate(studentToActivate.id);
    setActivateModalVisible(false);
    setStudentToActivate(null);
  };

  const handleCloseActivateModal = () => {
    setActivateModalVisible(false);
    setStudentToActivate(null);
  };

  const handleSort = (field: StudentTableColumn) => {
    if (onSortChange) {
      if (sortBy === field) {
        onSortChange(field, sortOrder === "asc" ? "desc" : "asc");
      } else {
        onSortChange(field, "asc");
      }
      return;
    }

    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedStudents = React.useMemo(() => {
    const activeSortField = sortBy ?? sortField;
    const activeSortDirection = sortOrder ?? sortDirection;

    if (!activeSortField) return students;

    return [...students].sort((a, b) => {
      const aValue = a[activeSortField];
      const bValue = b[activeSortField];

      if (aValue === undefined || bValue === undefined) return 0;

      let comparison = 0;
      if (typeof aValue === "string" && typeof bValue === "string") {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === "number" && typeof bValue === "number") {
        comparison = aValue - bValue;
      }

      return activeSortDirection === "asc" ? comparison : -comparison;
    });
  }, [students, sortBy, sortField, sortOrder, sortDirection]);

  const isEmpty = sortedStudents.length === 0;

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
        <div className="student-name-cell">
          <div className="student-avatar">
            {student.avatar && !student.avatar.match(/^[A-Z]$/) ? (
              <img src={student.avatar} alt={student.name} />
            ) : (
              <div className="student-avatar-placeholder">
                {student.avatar || student.name.charAt(0)}
              </div>
            )}
          </div>
          <span>{getFirstName(student.name)}</span>
        </div>
      ),
    },
    email: {
      label: "Email address",
      sortable: false,
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
          <tr
            className={`student-table-header${
              isEmpty ? " student-table-header--muted" : ""
            }`}
          >
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
          {isEmpty ? (
            <tr className="student-table-empty-row">
              <td
                className="student-table-empty-cell"
                colSpan={columns.length + 1}
              >
                <NoStudentsFound message={emptyMessage} />
              </td>
            </tr>
          ) : (
            sortedStudents.map((student, index) => (
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
                        ...(canModifyDeactivatedStudents
                          ? [
                              {
                                label: "Flag",
                                icon: "flag-icon" as const,
                                onClick: (e: React.MouseEvent) => {
                                  e.stopPropagation();
                                  handleFlagUser(student);
                                },
                              },
                            ]
                          : []),
                        ...(canModifyDeactivatedStudents
                          ? [
                              {
                                isDivider: true,
                                label: "",
                                onClick: () => {},
                              },
                              {
                                label: "Activate user",
                                variant: "danger" as const,
                                onClick: (e: React.MouseEvent) => {
                                  e.stopPropagation();
                                  handleActivateUser(student);
                                },
                              },
                            ]
                          : []),
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
            ))
          )}
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
