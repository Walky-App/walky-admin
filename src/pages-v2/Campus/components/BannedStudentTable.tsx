import React, { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CTooltip } from "@coreui/react";
import { apiClient } from "../../../API";
import { usePermissions } from "../../../hooks/usePermissions";
import {
  ActionDropdown,
  AssetIcon,
  CopyableId,
  CustomToast,
  DeactivateUserModal,
  Divider,
  FlagUserModal,
  StudentProfileData,
  StudentProfileModal,
  UnbanUserModal,
} from "../../../components-v2";
import { InterestChip } from "./InterestChip";
import { NoStudentsFound } from "./NoStudentsFound/NoStudentsFound";
import { StatusBadge } from "./StatusBadge";
import { StudentData, StudentTableColumn } from "./StudentTable";
import "./StudentTable.css";

type SortField = StudentTableColumn;
type SortDirection = "asc" | "desc";

interface BannedStudentTableProps {
  students: StudentData[];
  columns?: StudentTableColumn[];
  onStudentClick?: (student: StudentData) => void;
  sortBy?: StudentTableColumn;
  sortOrder?: SortDirection;
  onSortChange?: (field: StudentTableColumn, order: SortDirection) => void;
  emptyMessage?: string;
}

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
  sortBy,
  sortOrder = "asc",
  onSortChange,
  emptyMessage = "No students found",
}) => {
  const { canUpdate } = usePermissions();

  // Permission check for banned student actions (unban, deactivate)
  const canModifyBannedStudents = canUpdate("banned_students");

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
  const [resumeProfileAfterUnban, setResumeProfileAfterUnban] = useState(false);
  const [studentToDeactivate, setStudentToDeactivate] =
    useState<StudentData | null>(null);
  const [studentToFlag, setStudentToFlag] = useState<StudentData | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const queryClient = useQueryClient();

  const deactivateMutation = useMutation({
    mutationFn: (id: string) => apiClient.api.adminV2StudentsDelete(id),
    onSuccess: () => {
      // Invalidate all student queries to refresh all student lists
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) && query.queryKey[0] === "students",
      });
      queryClient.invalidateQueries({ queryKey: ["studentStats"] });
      setToastMessage("User deactivated successfully");
      setShowToast(true);
    },
    onError: () => {
      setToastMessage("Failed to deactivate user");
      setShowToast(true);
    },
  });

  const unbanMutation = useMutation({
    mutationFn: (id: string) => apiClient.api.adminV2StudentsUnbanCreate(id),
    onSuccess: () => {
      // Invalidate all student queries to refresh both active and banned lists
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) && query.queryKey[0] === "students",
      });
      queryClient.invalidateQueries({ queryKey: ["studentStats"] });
      setToastMessage("User unbanned successfully");
      setShowToast(true);
    },
    onError: () => {
      setToastMessage("Failed to unban user");
      setShowToast(true);
    },
  });

  const flagMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      apiClient.api.adminV2StudentsFlagCreate(id, { reason }),
    onSuccess: () => {
      // Invalidate all student queries
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

  const unflagMutation = useMutation({
    mutationFn: (id: string) => apiClient.api.adminV2StudentsUnflagCreate(id),
    onSuccess: () => {
      // Invalidate all student queries
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) && query.queryKey[0] === "students",
      });
      setToastMessage("User unflagged successfully");
      setShowToast(true);
    },
    onError: () => {
      setToastMessage("Failed to unflag user");
      setShowToast(true);
    },
  });

  const handleViewProfile = async (student: StudentData) => {
    try {
      const response = (await apiClient.api.adminV2StudentsDetail(
        student.id
      )) as any;
      const details = response.data;

      const fullStudentData: StudentData = {
        ...student,
        ...details,
        banHistory: details.banHistory || [],
      };

      setSelectedStudent(fullStudentData);
      setProfileModalVisible(true);
    } catch (error) {
      console.error("Error fetching student details:", error);
      setToastMessage("Error fetching student details");
      setShowToast(true);
    }
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

  const handleConfirmFlag = (reason: string) => {
    if (!studentToFlag) return;
    flagMutation.mutate({
      id: studentToFlag.id,
      reason: reason || "Flagged by admin",
    });
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
    setResumeProfileAfterUnban(false);
  };

  const handleConfirmUnban = () => {
    if (!studentToUnban) return;
    unbanMutation.mutate(studentToUnban.id);
    setUnbanModalVisible(false);
    setStudentToUnban(null);
    setResumeProfileAfterUnban(false);
  };

  const handleCloseUnbanModal = () => {
    setUnbanModalVisible(false);
    if (resumeProfileAfterUnban && selectedStudent) {
      setProfileModalVisible(true);
    }
    setResumeProfileAfterUnban(false);
    setStudentToUnban(null);
  };

  const handleSort = (field: SortField) => {
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

  const sortedStudents = useMemo(() => {
    const activeSortField = sortBy ?? sortField;
    const activeSortDirection = sortOrder ?? sortDirection;

    if (!activeSortField) return students;

    return [...students].sort((a, b) => {
      const aValue = (a as any)[activeSortField];
      const bValue = (b as any)[activeSortField];

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

  const formatBanDateParts = (student: StudentData) => {
    const { bannedDate, bannedTime } = student;

    if (!bannedDate && !bannedTime) {
      return { date: "-", time: null as string | null };
    }

    const parsedDate = bannedDate ? new Date(bannedDate) : null;
    const hasValidDate = parsedDate && !Number.isNaN(parsedDate.getTime());

    const dateText = hasValidDate
      ? new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          timeZone: "UTC",
        }).format(parsedDate as Date)
      : bannedDate || "-";

    const timeText = bannedTime
      ? bannedTime
      : hasValidDate
      ? new Intl.DateTimeFormat("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: false,
          timeZone: "UTC",
        }).format(parsedDate as Date)
      : null;

    return { date: dateText, time: timeText };
  };

  const parseDurationDays = (duration?: string | null) => {
    if (!duration) return null;
    const lower = duration.toLowerCase();
    if (lower.includes("permanent")) return null;
    const match = duration.match(/(\d+(?:\.\d+)?)/);
    if (!match) return null;
    const days = parseFloat(match[1]);
    return Number.isFinite(days) ? days : null;
  };

  const getExpiresInText = (student: StudentData) => {
    const expiresIn = student.banHistory?.[0]?.expiresIn;
    if (expiresIn) return expiresIn;

    const durationDays = parseDurationDays(student.duration);
    if (!durationDays) return null;

    const start = student.bannedDate ? new Date(student.bannedDate) : null;
    if (!start || Number.isNaN(start.getTime())) return null;

    const end = new Date(start.getTime() + durationDays * 24 * 60 * 60 * 1000);
    const diffMs = end.getTime() - Date.now();
    if (diffMs <= 0) return "Expired";

    const diffHours = diffMs / (1000 * 60 * 60);
    if (diffHours >= 36) {
      const days = Math.round(diffHours / 24);
      return `Expires in about ${days} day${days === 1 ? "" : "s"}`;
    }

    const roundedHours = Math.round(diffHours);
    return `Expires in about ${roundedHours} hour${
      roundedHours === 1 ? "" : "s"
    }`;
  };

  const getReportedContentCount = (student: StudentData) => {
    if (typeof student.reportedContentCount === "number") {
      return student.reportedContentCount;
    }

    if (typeof student.reported === "number") {
      return student.reported;
    }

    if (Array.isArray(student.reportHistory)) {
      return student.reportHistory.length;
    }

    return null;
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
          {Boolean(student.isFlagged) && (
            <CTooltip content={student.flagReason || "Flagged"} placement="top">
              <div className="student-flag-icon">
                <AssetIcon name="flag-icon" size={16} color="#d32f2f" />
              </div>
            </CTooltip>
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
            <div className="student-texts">
              <span className="student-name">{student.name}</span>
              <div className="student-email-row">
                <span className="student-email student-email--muted">
                  {student.email}
                </span>
                <button
                  type="button"
                  className="student-copy-btn"
                  data-testid="copy-student-email"
                  onClick={() => handleSendEmail(student)}
                  title="Copy email"
                  aria-label="Copy email"
                >
                  <AssetIcon name="copy-icon" size={14} color="#ACB6BA" />
                </button>
              </div>
            </div>
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
      render: (student) => (
        <StatusBadge
          status={
            student.status as "active" | "deactivated" | "banned" | "disengaged"
          }
        />
      ),
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
      label: "Ban date",
      sortable: true,
      render: (student) =>
        (() => {
          const parts = formatBanDateParts(student);
          return (
            <div className="ban-date-cell">
              <span className="student-date">{parts.date}</span>
              {parts.time && <span className="student-time">{parts.time}</span>}
            </div>
          );
        })(),
    },
    bannedBy: {
      label: "Banned by",
      sortable: false,
      render: (student) => (
        <span className="banned-by-email">
          {student.bannedByEmail || student.bannedBy || "-"}
        </span>
      ),
    },
    reason: {
      label: "Reported content",
      sortable: false,
      render: (student) => {
        const reportedCount = getReportedContentCount(student);
        const hasCount = reportedCount !== null && reportedCount !== undefined;
        const pillValue = hasCount ? reportedCount.toString() : "-";
        const subtext =
          hasCount && reportedCount > 0
            ? `${reportedCount} report${reportedCount === 1 ? "" : "s"}`
            : null;

        return (
          <div className="ban-duration-cell">
            <span className="ban-duration-pill">{pillValue}</span>
            {subtext && <span className="ban-duration-subtext">{subtext}</span>}
          </div>
        );
      },
    },
    duration: {
      label: "Duration",
      sortable: false,
      render: (student) => {
        const duration = student.duration || "-";
        const expiresText = getExpiresInText(student);

        return (
          <div className="ban-duration-cell">
            <span className="ban-duration-pill">{duration}</span>
            {expiresText && (
              <span className="ban-duration-subtext">{expiresText}</span>
            )}
          </div>
        );
      },
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

  const isEmpty = sortedStudents.length === 0;

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
                        ...(canModifyBannedStudents
                          ? [
                              {
                                label: student.isFlagged ? "Unflag" : "Flag",
                                icon: "flag-icon" as const,
                                variant: student.isFlagged
                                  ? ("danger" as const)
                                  : undefined,
                                onClick: (e: React.MouseEvent) => {
                                  e.stopPropagation();
                                  if (student.isFlagged) {
                                    unflagMutation.mutate(student.id);
                                  } else {
                                    handleFlagUser(student);
                                  }
                                },
                              },
                            ]
                          : []),
                        ...(canModifyBannedStudents
                          ? [
                              {
                                isDivider: true,
                                label: "",
                                onClick: () => {},
                              },
                              {
                                label: "Unban user",
                                variant: "danger" as const,
                                onClick: (e: React.MouseEvent) => {
                                  e.stopPropagation();
                                  handleUnbanUser(student);
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
        onUnbanUser={(student) => {
          unbanMutation.mutate(student.id);
          setProfileModalVisible(false);
        }}
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
        />
      )}
    </div>
  );
};
