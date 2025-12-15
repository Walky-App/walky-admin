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
import { getFirstName } from "../../../lib/utils/nameUtils";
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
  sortBy?: StudentTableColumn;
  sortOrder?: "asc" | "desc";
  onSortChange?: (field: StudentTableColumn, order: "asc" | "desc") => void;
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
}) => {
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
      queryClient.invalidateQueries({
        queryKey: ["students"],
        refetchType: "all"
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
      queryClient.invalidateQueries({
        queryKey: ["students"],
        refetchType: "all"
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
      apiClient.api.adminV2StudentsFlagCreate(id, { reason: reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["students"],
        refetchType: "all"
      });
      setToastMessage("User flagged successfully");
      setShowToast(true);
    },
    onError: () => {
      setToastMessage("Failed to flag user");
      setShowToast(true);
    },
  });

  const handleViewProfile = async (student: StudentData) => {
    try {
      const response = await apiClient.api.adminV2StudentsDetail(student.id);
      const details = response.data;

      // Merge details with existing student data
      const fullStudentData: StudentData = {
        ...student,
        id: details.id || student.id,
        userId: details.userId || student.userId,
        name: details.name || student.name,
        email: details.email || student.email,
        avatar: details.avatar,
        interests: details.interests || student.interests || [],
        status: (details.status as StudentData["status"]) || student.status,
        memberSince: details.memberSince || student.memberSince,
        onlineLast: details.onlineLast || student.onlineLast,
        areaOfStudy: details.areaOfStudy,
        lastLogin: details.lastLogin,
        totalPeers: details.totalPeers,
        bio: details.bio,
        bannedDate: details.bannedDate,
        bannedBy: details.bannedBy,
        bannedByEmail: details.bannedByEmail,
        bannedTime: details.bannedTime,
        reason: details.banReason,
        duration: details.banHistory?.[0]?.duration,
        banHistory: (details.banHistory || []).map((b) => ({
          title: b.title || "",
          duration: b.duration || "",
          expiresIn: b.expiresIn,
          reason: b.reason || "",
          bannedDate: b.bannedDate || "",
          bannedTime: b.bannedTime || "",
          bannedBy: b.bannedBy || "",
        })),
        blockedByUsers: (details.blockedByUsers || []).map((b) => ({
          id: b.id || "",
          name: b.name || "",
          avatar: b.avatar,
          date: b.date || "",
          time: b.time || "",
        })),
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

  const handleSort = (field: StudentTableColumn) => {
    if (!onSortChange) return;

    if (sortBy === field) {
      onSortChange(field, sortOrder === "asc" ? "desc" : "asc");
    } else {
      onSortChange(field, "asc");
    }
  };

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

    const combined = [bannedDate, bannedTime].filter(Boolean).join(" ");
    const parsed = new Date(combined);

    if (!Number.isNaN(parsed.getTime())) {
      return {
        date: new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }).format(parsed),
        time: bannedTime
          ? new Intl.DateTimeFormat("en-US", {
              hour: "numeric",
              minute: "2-digit",
            }).format(parsed)
          : null,
      };
    }

    return {
      date: bannedDate || "-",
      time: bannedTime || null,
    };
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
          <span className="student-name">{getFirstName(student.name)}</span>
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
      label: "Ban date",
      sortable: true,
      render: (student) =>
        (() => {
          const { date, time } = formatBanDateParts(student);
          return (
            <div className="student-date ban-date-cell">
              <div>{date}</div>
              {time && <div className="student-time">{time}</div>}
            </div>
          );
        })(),
    },
    bannedBy: {
      label: "Banned by",
      sortable: false,
      render: (student) => <span>{student.bannedBy || "-"}</span>,
    },
    reason: {
      label: "Reported content",
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
          {students.map((student, index) => (
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
              {index < students.length - 1 && (
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
        onUnbanUser={(student) => {
          unbanMutation.mutate(student.id);
          handleCloseProfile();
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
          duration={3000}
        />
      )}
    </div>
  );
};
