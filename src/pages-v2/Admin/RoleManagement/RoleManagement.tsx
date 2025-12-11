import React, { useState } from "react";
import AssetIcon from "../../../components-v2/AssetIcon/AssetIcon";
import {
  SearchInput,
  Divider,
  ActionDropdown,
  FilterDropdown,
  Pagination,
} from "../../../components-v2";
import { useTheme } from "../../../hooks/useTheme";
import {
  RolePermissionsModal,
  RemoveMemberModal,
  ChangeRoleModal,
  SendPasswordResetModal,
  CreateMemberModal,
  MemberFormData,
} from "../../../components-v2";
import "./RoleManagement.css";

interface MemberData {
  id: string;
  name: string;
  title: string;
  email: string;
  avatar: string;
  role: "School Admin" | "Campus Admin" | "Moderator" | "Walky Admin";
  assignedBy: {
    name: string;
    email: string;
  };
  invitationStatus: "Accepted" | "Pending" | "Expired";
  lastActive: string | null;
}

const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../../API";
import toast from "react-hot-toast";

export const RoleManagement: React.FC = () => {
  const { theme } = useTheme();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [selectedRole, setSelectedRole] = useState<
    "Walky Admin" | "School Admin" | "Campus Admin" | "Moderator" | null
  >(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const entriesPerPage = 10;

  // Action modals state
  const [isRemoveMemberModalOpen, setIsRemoveMemberModalOpen] = useState(false);
  const [isChangeRoleModalOpen, setIsChangeRoleModalOpen] = useState(false);
  const [isPasswordResetModalOpen, setIsPasswordResetModalOpen] =
    useState(false);
  const [isCreateMemberModalOpen, setIsCreateMemberModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberData | null>(null);

  const { data: membersData, isLoading } = useQuery({
    queryKey: ["members", currentPage, searchQuery, roleFilter],
    queryFn: () =>
      apiClient.api.adminV2MembersList({
        page: currentPage,
        limit: entriesPerPage,
        search: searchQuery,
        role: roleFilter,
      }),
  });

  const members: MemberData[] = (membersData?.data.data || []).map(
    (member: any) => ({
      id: member.id,
      name: member.name,
      title: member.title,
      email: member.email,
      avatar: member.avatar,
      role: member.role,
      assignedBy: member.assignedBy,
      invitationStatus: member.invitationStatus,
      lastActive: member.lastActive,
    })
  );

  const handleCreateMember = () => {
    setIsCreateMemberModalOpen(true);
  };

  const handleRoleClick = (
    role: "Walky Admin" | "School Admin" | "Campus Admin" | "Moderator"
  ) => {
    setSelectedRole(role);
    setIsRoleModalOpen(true);
  };

  const handleCloseRoleModal = () => {
    setIsRoleModalOpen(false);
    setSelectedRole(null);
  };

  const handleRoleFilterSelect = (role: string) => {
    setRoleFilter(role);
  };

  const handleChangeRole = (memberId: string) => {
    const member = members.find((m) => m.id === memberId);
    if (member) {
      setSelectedMember(member);
      setIsChangeRoleModalOpen(true);
    }
  };

  const handleSendPasswordReset = (memberId: string) => {
    const member = members.find((m) => m.id === memberId);
    if (member) {
      setSelectedMember(member);
      setIsPasswordResetModalOpen(true);
    }
  };

  const handleRemoveMember = (memberId: string) => {
    const member = members.find((m) => m.id === memberId);
    if (member) {
      setSelectedMember(member);
      setIsRemoveMemberModalOpen(true);
    }
  };

  // Modal confirm handlers
  const handleConfirmRemoveMember = async () => {
    if (!selectedMember) return;
    try {
      await apiClient.api.adminV2MembersDelete(selectedMember.id);
      toast.success(`Member ${selectedMember.name} removed successfully`);
      queryClient.invalidateQueries({ queryKey: ["members"] });
    } catch (error) {
      console.error("Failed to remove member:", error);
      toast.error("Failed to remove member");
    }
    setIsRemoveMemberModalOpen(false);
    setSelectedMember(null);
  };

  const handleConfirmChangeRole = async (
    newRole: "Walky Admin" | "School Admin" | "Campus Admin" | "Moderator"
  ) => {
    if (!selectedMember) return;
    try {
      await apiClient.api.adminV2MembersRolePartialUpdate(selectedMember.id, {
        role: newRole,
      });
      toast.success(`Role updated to ${newRole} for ${selectedMember.name}`);
      queryClient.invalidateQueries({ queryKey: ["members"] });
    } catch (error) {
      console.error("Failed to update role:", error);
      toast.error("Failed to update role");
    }
    setIsChangeRoleModalOpen(false);
    setSelectedMember(null);
  };

  const handleConfirmPasswordReset = async () => {
    if (!selectedMember) return;
    try {
      await apiClient.api.adminV2MembersPasswordResetCreate(selectedMember.id);
      toast.success(`Password reset sent to ${selectedMember.email}`);
    } catch (error) {
      console.error("Failed to send password reset:", error);
      toast.error("Failed to send password reset");
    }
    setIsPasswordResetModalOpen(false);
    setSelectedMember(null);
  };

  const handleConfirmCreateMember = async (memberData: MemberFormData) => {
    try {
      await apiClient.api.adminV2MembersCreate({
        name: `${memberData.firstName} ${memberData.lastName}`,
        email: memberData.email,
        role: memberData.role,
        title: memberData.role || "Administrator", // Use role as title since modal doesn't have title field
      });
      toast.success("Member created successfully");
      queryClient.invalidateQueries({ queryKey: ["members"] });
    } catch (error) {
      console.error("Failed to create member:", error);
      toast.error("Failed to create member");
    }
    setIsCreateMemberModalOpen(false);
  };

  const renderSkeletonRows = () =>
    Array.from({ length: 6 }).map((_, index) => (
      <React.Fragment key={`member-skeleton-${index}`}>
        <tr className="member-row skeleton-row">
          <td className="member-full-name">
            <div className="member-info">
              <div className="skeleton-block skeleton-avatar" />
              <div className="skeleton-stack">
                <div className="skeleton-block skeleton-line" />
                <div className="skeleton-block skeleton-line short" />
              </div>
            </div>
          </td>
          <td>
            <div className="skeleton-block skeleton-line wide" />
          </td>
          <td>
            <div className="skeleton-block skeleton-badge" />
          </td>
          <td>
            <div className="skeleton-stack">
              <div className="skeleton-block skeleton-line" />
              <div className="skeleton-block skeleton-line short" />
            </div>
          </td>
          <td>
            <div className="skeleton-block skeleton-pill" />
          </td>
          <td>
            <div className="skeleton-block skeleton-line short" />
          </td>
          <td className="member-actions">
            <div className="skeleton-block skeleton-action" />
          </td>
        </tr>
        {index < 5 && (
          <tr className="member-divider-row">
            <td colSpan={7}>
              <Divider />
            </td>
          </tr>
        )}
      </React.Fragment>
    ));

  return (
    <main className="role-management-page">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Role Management</h1>
        <p className="page-subtitle">Manage user role assignments</p>
      </div>

      {/* Main Content Container */}
      <div className={`members-container ${theme.isDark ? "dark-mode" : ""}`}>
        {/* Header with Filters and Create Button */}
        <div className="members-header">
          <div className="members-header-left">
            <h2 className="members-title">Members list</h2>
            <div className="members-filters">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search"
                variant="secondary"
              />
              <FilterDropdown
                value={roleFilter}
                onChange={handleRoleFilterSelect}
                options={[
                  { value: "All Roles", label: "All Roles" },
                  { value: "Walky Admin", label: "Walky Admin" },
                  { value: "School Admin", label: "School Admin" },
                  { value: "Campus Admin", label: "Campus Admin" },
                  { value: "Moderator", label: "Moderator" },
                ]}
                placeholder="All Roles"
                testId="role-filter"
              />
            </div>
          </div>
          <button
            data-testid="create-member-btn"
            className="create-member-button"
            onClick={handleCreateMember}
          >
            <span>+ Create new member</span>
          </button>
        </div>

        {/* Table Container */}
        <div className="members-table-wrapper">
          <table className="members-table">
            <thead>
              <tr className="table-header-row">
                <th>
                  <div className="full-name-header">
                    <span>Full Name</span>
                    <AssetIcon name="swap-arrows-icon" size={24} />
                  </div>
                </th>
                <th>
                  <span>Institutional email</span>
                </th>
                <th>
                  <span>Role</span>
                </th>
                <th>
                  <div className="assigned-by-header">
                    <span>Assigned By</span>
                    <AssetIcon name="swap-arrows-icon" size={24} />
                  </div>
                </th>
                <th>
                  <div className="invitation-status-header">
                    <span>Invitation status</span>
                    <AssetIcon name="swap-arrows-icon" size={24} />
                  </div>
                </th>
                <th>
                  <div className="last-active-header">
                    <span>Last active</span>
                    <AssetIcon name="swap-arrows-icon" size={24} />
                  </div>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? renderSkeletonRows()
                : members.map((member, index) => (
                    <React.Fragment key={member.id}>
                      <tr className="member-row">
                        {/* Full Name Column */}
                        <td className="member-full-name">
                          <div className="member-info">
                            {member.avatar ? (
                              <img
                                src={member.avatar}
                                alt={member.name}
                                className="member-avatar"
                              />
                            ) : (
                              <div className="member-avatar-placeholder">
                                {getInitials(member.name)}
                              </div>
                            )}
                            <div className="member-details">
                              <p className="member-name">{member.name}</p>
                              <p className="member-title">{member.title}</p>
                            </div>
                          </div>
                        </td>

                        {/* Email Column */}
                        <td className="member-email">{member.email}</td>

                        {/* Role Column */}
                        <td className="member-role">
                          <button
                            data-testid="role-badge-btn"
                            className="role-badge"
                            onClick={() => handleRoleClick(member.role)}
                          >
                            {member.role}
                          </button>
                        </td>

                        {/* Assigned By Column */}
                        <td className="member-assigned-by">
                          <div className="assigned-by-info">
                            <p className="assigned-by-name">
                              {member.assignedBy.name}
                            </p>
                            <p className="assigned-by-email">
                              {member.assignedBy.email}
                            </p>
                          </div>
                        </td>

                        {/* Invitation Status Column */}
                        <td className="member-invitation-status">
                          <span
                            className={`status-badge ${member.invitationStatus.toLowerCase()}`}
                          >
                            {member.invitationStatus}
                          </span>
                        </td>

                        {/* Last Active Column */}
                        <td className="member-last-active">
                          {member.lastActive || "--"}
                        </td>

                        {/* Actions Column */}
                        <td className="member-actions">
                          <ActionDropdown
                            testId="member-actions"
                            items={[
                              {
                                label: "Change role",
                                onClick: (e) => {
                                  e.stopPropagation();
                                  handleChangeRole(member.id);
                                },
                              },
                              {
                                label: "Send a password reset",
                                onClick: (e) => {
                                  e.stopPropagation();
                                  handleSendPasswordReset(member.id);
                                },
                              },
                              {
                                label: "",
                                isDivider: true,
                                onClick: () => {},
                              },
                              {
                                label: "Remove member",
                                variant: "danger",
                                onClick: (e) => {
                                  e.stopPropagation();
                                  handleRemoveMember(member.id);
                                },
                              },
                            ]}
                          />
                        </td>
                      </tr>
                      {index < members.length - 1 && (
                        <tr className="member-divider-row">
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

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(
            (membersData?.data.total || 0) / entriesPerPage
          )}
          totalEntries={membersData?.data.total || 0}
          entriesPerPage={entriesPerPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Role Permissions Modal */}
      {selectedRole && (
        <RolePermissionsModal
          isOpen={isRoleModalOpen}
          onClose={handleCloseRoleModal}
          roleType={selectedRole}
        />
      )}

      {/* Remove Member Modal */}
      {selectedMember && (
        <RemoveMemberModal
          isOpen={isRemoveMemberModalOpen}
          onClose={() => setIsRemoveMemberModalOpen(false)}
          onConfirm={handleConfirmRemoveMember}
          memberName={selectedMember.name}
        />
      )}

      {/* Change Role Modal */}
      {selectedMember && (
        <ChangeRoleModal
          isOpen={isChangeRoleModalOpen}
          onClose={() => setIsChangeRoleModalOpen(false)}
          onConfirm={handleConfirmChangeRole}
          currentRole={selectedMember.role}
        />
      )}

      {/* Send Password Reset Modal */}
      {selectedMember && (
        <SendPasswordResetModal
          isOpen={isPasswordResetModalOpen}
          onClose={() => setIsPasswordResetModalOpen(false)}
          onConfirm={handleConfirmPasswordReset}
        />
      )}

      {/* Create Member Modal */}
      <CreateMemberModal
        isOpen={isCreateMemberModalOpen}
        onClose={() => setIsCreateMemberModalOpen(false)}
        onConfirm={handleConfirmCreateMember}
      />
    </main>
  );
};
