import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CTooltip } from "@coreui/react";
import { apiClient } from "../../../API";
import { useAuth } from "../../../hooks/useAuth";
import { usePermissions } from "../../../hooks/usePermissions";
import { getFirstName } from "../../../lib/utils/nameUtils";
import {
  AssetIcon,
  StudentProfileModal,
  StudentProfileData,
  FlagUserModal,
  DeactivateUserModal,
  BanUserModal,
  CustomToast,
  ActionDropdown,
  Divider,
} from "../../../components-v2";
import { CopyableId } from "../../../components-v2/CopyableId";
import { StatusBadge } from "./StatusBadge";
import { InterestChip } from "./InterestChip";
import { NoStudentsFound } from "./NoStudentsFound/NoStudentsFound";
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
  flagReason?: string;
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

type SortField = StudentTableColumn;
type SortDirection = "asc" | "desc";

interface StudentTableProps {
  students: StudentData[];
  columns?: StudentTableColumn[];
  onStudentClick?: (student: StudentData) => void;
  onActionClick?: (student: StudentData) => void;
  sortBy?: StudentTableColumn;
  sortOrder?: SortDirection;
  onSortChange?: (field: StudentTableColumn, order: SortDirection) => void;
  emptyMessage?: string;
}

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
  sortBy,
  sortOrder = "asc",
  onSortChange,
  emptyMessage = "No students found",
}) => {
  const { user } = useAuth();
  const { canUpdate } = usePermissions();
  const queryClient = useQueryClient();

  // Permission check for student actions (ban, deactivate)
  const canModifyStudents = canUpdate("active_students");

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
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.api.adminV2StudentsDelete(id),
    onSuccess: () => {
      // Invalidate all student queries to refresh all student lists
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) && query.queryKey[0] === "students",
      });
      queryClient.invalidateQueries({ queryKey: ["studentStats"] });
      setToastMessage("Student deactivated successfully");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setDeactivateModalVisible(false);
      setStudentToDeactivate(null);
    },
    onError: (error) => {
      console.error("Error deactivating student:", error);
      setToastMessage("Error deactivating student");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    },
  });

  const banMutation = useMutation({
    mutationFn: (data: { id: string; duration: number; reason: string }) =>
      apiClient.api.adminV2StudentsLockSettingsUpdate(data.id, {
        lockReason: data.reason,
        isLocked: true,
        lockDuration: data.duration,
      }),
    onSuccess: () => {
      // Invalidate all student queries to refresh both active and banned lists
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) && query.queryKey[0] === "students",
      });
      queryClient.invalidateQueries({ queryKey: ["studentStats"] });
      setToastMessage("Student banned successfully");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setBanModalVisible(false);
      setStudentToBan(null);
    },
    onError: (error) => {
      console.error("Error banning student:", error);
      setToastMessage("Error banning student");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    },
  });

  const flagMutation = useMutation({
    mutationFn: (data: { id: string; reason: string }) =>
      apiClient.api.adminV2StudentsFlagCreate(data.id, { reason: data.reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      setToastMessage("Student flagged successfully");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setFlagModalVisible(false);
      setStudentToFlag(null);
    },
    onError: (error) => {
      console.error("Error flagging student:", error);
      setToastMessage("Error flagging student");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    },
  });

  const unflagMutation = useMutation({
    mutationFn: (id: string) => apiClient.api.adminV2StudentsUnflagCreate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      setToastMessage("Student unflagged successfully");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    },
    onError: (error) => {
      console.error("Error unflagging student:", error);
      setToastMessage("Error unflagging student");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
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
      setToastMessage("Student unbanned successfully");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    },
    onError: (error) => {
      console.error("Error unbanning student:", error);
      setToastMessage("Error unbanning student");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    },
  });

  const handleViewProfile = async (student: StudentData) => {
    try {
      // Fetch student details and ban history in parallel
      const [detailsResponse, banHistoryResponse] = await Promise.all([
        apiClient.api.adminV2StudentsDetail(student.id),
        apiClient.api
          .adminV2StudentsBanHistoryList(student.id)
          .catch(() => ({ data: [] })),
      ]);

      const details = detailsResponse.data;
      const banHistoryData = banHistoryResponse.data || [];

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

      // Format ban history from the separate endpoint
      const formattedBanHistory = banHistoryData.map((b) => {
        const bannedDate = b.bannedAt ? new Date(b.bannedAt) : null;
        return {
          title: "Account Banned",
          duration: "N/A",
          expiresIn: undefined,
          reason: b.reason || "No reason provided",
          bannedDate: bannedDate
            ? bannedDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "",
          bannedTime: bannedDate
            ? bannedDate.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })
            : "",
          bannedBy: b.bannedBy || "System",
        };
      });

      // Create ban history entry from top-level ban fields if no other history exists
      const createBanHistoryFromDetails = () => {
        if (details.bannedDate || details.bannedBy || details.banReason) {
          const bannedDate = details.bannedAt
            ? new Date(details.bannedAt)
            : null;
          return [
            {
              title: "Account Banned",
              duration: "N/A",
              expiresIn: undefined,
              reason: details.banReason || "No reason provided",
              bannedDate:
                details.bannedDate ||
                (bannedDate
                  ? bannedDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : ""),
              bannedTime:
                details.bannedTime ||
                (bannedDate
                  ? bannedDate.toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    })
                  : ""),
              bannedBy: details.bannedBy || "System",
            },
          ];
        }
        return [];
      };

      // Use ban history from details if available, then separate endpoint, then top-level fields
      const banHistory =
        details.banHistory && details.banHistory.length > 0
          ? (details.banHistory || []).map((b) => ({
              title: b.title || "Account Banned",
              duration: b.duration || "N/A",
              expiresIn: b.expiresIn,
              reason: b.reason || "No reason provided",
              bannedDate: b.bannedDate || "",
              bannedTime: b.bannedTime || "",
              bannedBy: b.bannedBy || "System",
            }))
          : formattedBanHistory.length > 0
          ? formattedBanHistory
          : createBanHistoryFromDetails();

      // Merge details with existing student data or map completely
      const fullStudentData: StudentData = {
        ...student,
        areaOfStudy: details.areaOfStudy || "N/A",
        lastLogin: formatLastLogin(details.lastLogin),
        totalPeers: details.totalPeers ?? details.peers ?? 0,
        bio: details.bio || "No bio provided",
        interests: details.interests?.length
          ? details.interests
          : student.interests || [],
        status: (details.status as StudentData["status"]) || student.status,
        banHistory,
        reportHistory: ((details as any).reportHistory || []).map((r: any) => ({
          reportedIdea: r.reportedIdea || "User Report",
          reportId: r.reportId || "",
          reason: r.reason || "",
          description: r.description || "",
          reportedDate: r.reportedDate || "",
          reportedTime: r.reportedTime || "",
          reportedBy: r.reportedBy || "Anonymous",
          status: r.status || "Pending",
        })),
        blockedByUsers: (details.blockedByUsers || []).map((b) => ({
          id: b.id || "",
          name: b.name || "",
          avatar: b.avatar,
          date: b.date || "",
          time: b.time || "",
        })),
        bannedBy: details.bannedBy,
        bannedByEmail: details.bannedByEmail,
        bannedDate: details.bannedDate,
        bannedTime: details.bannedTime,
      };

      setSelectedStudent(fullStudentData);
      setProfileModalVisible(true);
    } catch (error) {
      console.error("Error fetching student details:", error);
      setToastMessage("Error fetching student details");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
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
    setStudentToFlag(student);
    setFlagModalVisible(true);
  };

  const handleConfirmFlag = (reason: string) => {
    if (!studentToFlag) return;

    flagMutation.mutate({
      id: studentToFlag.id,
      reason: reason || `Flagged by ${user?.email || "admin"}`,
    });
    setFlagModalVisible(false);
    setStudentToFlag(null);
  };

  const handleUnflagUser = (student: StudentData) => {
    unflagMutation.mutate(student.id);
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
    deleteMutation.mutate(studentToDeactivate.id);
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
    _resolveReports: boolean
  ) => {
    if (!studentToBan) return;

    // Convert duration string to number of days
    // Modal sends: "1 Day", "3 Days", "7 Days", "14 Days", "30 Days", "90 Days"
    const durationMap: Record<string, number> = {
      "1 Day": 1,
      "3 Days": 3,
      "7 Days": 7,
      "14 Days": 14,
      "30 Days": 30,
      "90 Days": 90,
      Permanent: 36500,
    };
    const durationDays = durationMap[duration] || parseInt(duration) || 7;

    banMutation.mutate({ id: studentToBan.id, duration: durationDays, reason });
  };

  const handleCloseBanModal = () => {
    setBanModalVisible(false);
    setStudentToBan(null);
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

  const isEmpty = sortedStudents.length === 0;
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
            {student.status === "banned" ? (
              <div className="student-texts">
                <span className="student-name">{student.name}</span>
                <span className="student-email student-email--muted">
                  {student.email}
                </span>
              </div>
            ) : (
              <span className="student-name">{getFirstName(student.name)}</span>
            )}
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

        <div className="content-space-divider" />

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
                        ...(canModifyStudents
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
                                    handleUnflagUser(student);
                                  } else {
                                    handleFlagUser(student);
                                  }
                                },
                              },
                            ]
                          : []),
                        ...(canModifyStudents
                          ? [
                              {
                                isDivider: true,
                                label: "",
                                onClick: () => {},
                              },
                              {
                                label: "Ban user",
                                variant: "danger" as const,
                                onClick: (e: React.MouseEvent) => {
                                  e.stopPropagation();
                                  handleBanUser(student);
                                },
                              },
                              {
                                label: "Deactivate user",
                                variant: "danger" as const,
                                onClick: (e: React.MouseEvent) => {
                                  e.stopPropagation();
                                  handleDeactivateUser(student);
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
        onBanUser={(student, duration, reason) => {
          // Convert duration string to number of days
          const durationMap: Record<string, number> = {
            "1 Day": 1,
            "3 Days": 3,
            "7 Days": 7,
            "14 Days": 14,
            "30 Days": 30,
            "90 Days": 90,
            Permanent: 36500,
          };
          const durationDays = durationMap[duration] || parseInt(duration) || 7;

          banMutation.mutate({
            id: student.id,
            duration: durationDays,
            reason,
          });
          handleCloseProfile();
        }}
        onDeactivateUser={(student) => {
          deleteMutation.mutate(student.id);
          handleCloseProfile();
        }}
        onUnbanUser={(student) => {
          unbanMutation.mutate(student.id);
          handleCloseProfile();
        }}
      />

      <FlagUserModal
        visible={flagModalVisible}
        onClose={handleCloseFlagModal}
        onConfirm={handleConfirmFlag}
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
