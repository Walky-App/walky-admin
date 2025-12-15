import React, { useMemo, useState } from "react";
import {
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import AssetIcon from "../../../components-v2/AssetIcon/AssetIcon";
import {
  SearchInput,
  Divider,
  ActionDropdown,
  FilterDropdown,
  Pagination,
  NoData,
} from "../../../components-v2";
import {
  RolePermissionsModal,
  RemoveMemberModal,
  ChangeRoleModal,
  SendPasswordResetModal,
  CreateMemberModal,
  MemberFormData,
} from "../../../components-v2";
import { useTheme } from "../../../hooks/useTheme";
import { apiClient } from "../../../API";
import "./RoleManagement.css";

type RoleType = "Walky Admin" | "School Admin" | "Campus Admin" | "Moderator";

type MemberData = {
  id: string;
  name: string;
  title: string;
  email: string;
  avatar: string;
  role: RoleType;
  assignedBy: {
    name: string;
    email: string;
  };
  invitationStatus: "Accepted" | "Pending" | "Expired";
  lastActive: string | null;
};

const getInitials = (name: string): string =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

export const RoleManagement: React.FC = () => {
  const { theme } = useTheme();
  const queryClient = useQueryClient();

  const entriesPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleType | "All Roles">(
    "All Roles"
  );
  const [selectedRole, setSelectedRole] = useState<RoleType | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

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
        search: searchQuery || undefined,
        role: roleFilter !== "All Roles" ? roleFilter : undefined,
      }),
    placeholderData: keepPreviousData,
  });

  // Extended type for API response with possible additional fields
  type ExtendedMember = {
    id?: string;
    _id?: string;
    name?: string;
    first_name?: string;
    last_name?: string;
    title?: string;
    email?: string;
    institutional_email?: string;
    avatar?: string;
    avatar_url?: string;
    role?: string;
    assignedBy?: { name?: string; email?: string };
    assigned_by?: { name?: string; email?: string };
    assigned_by_name?: string;
    assigned_by_email?: string;
    invitationStatus?: string;
    lastActive?: string;
    last_active?: string;
    last_login?: string;
  };

  const members: MemberData[] = useMemo(
    () =>
      (membersData?.data.data || []).map((m) => {
        const member = m as ExtendedMember;
        return {
          id: member.id || member._id || "",
          name:
            member.name ||
            `${member.first_name || ""} ${member.last_name || ""}`.trim(),
          title: member.title || member.role || "Administrator",
          email: member.email || member.institutional_email || "",
          avatar: member.avatar || member.avatar_url || "",
          role: (member.role || "Walky Admin") as RoleType,
          assignedBy: {
            name:
              member.assignedBy?.name ||
              member.assigned_by?.name ||
              member.assigned_by_name ||
              "",
            email:
              member.assignedBy?.email ||
              member.assigned_by?.email ||
              member.assigned_by_email ||
              "",
          },
          invitationStatus: (member.invitationStatus ||
            "Pending") as MemberData["invitationStatus"],
          lastActive:
            member.lastActive || member.last_active || member.last_login || null,
        };
      }),
    [membersData]
  );

  const isEmpty = !isLoading && members.length === 0;

  const handleRoleFilterSelect = (value: string) => {
    setRoleFilter(value as RoleType | "All Roles");
    setCurrentPage(1);
  };

  const handleRoleClick = (role: RoleType) => {
    setSelectedRole(role);
    setIsRoleModalOpen(true);
  };

  const handleCloseRoleModal = () => {
    setIsRoleModalOpen(false);
    setSelectedRole(null);
  };

  const handleRemoveMember = (memberId: string) => {
    const member = members.find((m) => m.id === memberId) || null;
    setSelectedMember(member);
    setIsRemoveMemberModalOpen(true);
  };

  const handleConfirmRemoveMember = async () => {
    if (!selectedMember) return;
    try {
      await apiClient.api.adminV2MembersDelete(selectedMember.id);
      toast.success("Member removed");
      queryClient.invalidateQueries({ queryKey: ["members"] });
    } catch (error) {
      console.error("Failed to remove member:", error);
      toast.error("Failed to remove member");
    }
    setIsRemoveMemberModalOpen(false);
  };

  const handleChangeRole = (memberId: string) => {
    const member = members.find((m) => m.id === memberId) || null;
    setSelectedMember(member);
    setIsChangeRoleModalOpen(true);
  };

  const handleConfirmChangeRole = async (newRole: RoleType) => {
    if (!selectedMember) return;
    try {
      await apiClient.api.adminV2MembersRolePartialUpdate(selectedMember.id, {
        role: newRole,
      });
      toast.success("Role updated");
      queryClient.invalidateQueries({ queryKey: ["members"] });
    } catch (error) {
      console.error("Failed to change role:", error);
      toast.error("Failed to change role");
    }
    setIsChangeRoleModalOpen(false);
  };

  const handleSendPasswordReset = (memberId: string) => {
    const member = members.find((m) => m.id === memberId) || null;
    setSelectedMember(member);
    setIsPasswordResetModalOpen(true);
  };

  const handleConfirmPasswordReset = async () => {
    if (!selectedMember) return;
    try {
      await apiClient.api.adminV2MembersPasswordResetCreate(selectedMember.id);
      toast.success("Password reset sent");
    } catch (error) {
      console.error("Failed to send password reset:", error);
      toast.error("Failed to send password reset");
    }
    setIsPasswordResetModalOpen(false);
  };

  const handleCreateMember = () => setIsCreateMemberModalOpen(true);

  const handleConfirmCreateMember = async (memberData: MemberFormData) => {
    try {
      await apiClient.api.adminV2MembersCreate({
        name: `${memberData.firstName} ${memberData.lastName}`.trim(),
        email: memberData.email,
        role: memberData.role,
        title: memberData.role || "Administrator",
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
      <tr key={`skeleton-${index}`}>
        <td colSpan={7} style={{ padding: "18px" }}>
          <div className="member-skeleton" />
        </td>
      </tr>
    ));

  return (
    <main className="role-management-page">
      <div className="page-header">
        <h1 className="page-title">Role Management</h1>
        <p className="page-subtitle">Manage user role assignments</p>
      </div>

      <div className={`members-container ${theme.isDark ? "dark-mode" : ""}`}>
        <div className="members-header">
          <div className="members-header-left">
            <h2 className="members-title">Members list</h2>
            <div className="members-filters">
              <SearchInput
                value={searchQuery}
                onChange={(value) => {
                  setSearchQuery(value);
                  setCurrentPage(1);
                }}
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
              {isLoading ? (
                renderSkeletonRows()
              ) : isEmpty ? (
                <tr>
                  <td colSpan={7} style={{ padding: "32px 16px" }}>
                    <NoData message="No members found" />
                  </td>
                </tr>
              ) : (
                members.map((member, index) => (
                  <React.Fragment key={member.id}>
                    <tr className="member-row">
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

                      <td className="member-email">{member.email}</td>

                      <td className="member-role">
                        <button
                          data-testid="role-badge-btn"
                          className="role-badge"
                          onClick={() => handleRoleClick(member.role)}
                        >
                          {member.role}
                        </button>
                      </td>

                      <td className="member-assigned-by">
                        <div className="assigned-by-info">
                          <p className="assigned-by-name">
                            {member.assignedBy.name || "--"}
                          </p>
                          <p className="assigned-by-email">
                            {member.assignedBy.email || "--"}
                          </p>
                        </div>
                      </td>

                      <td className="member-invitation-status">
                        <span
                          className={`status-badge ${member.invitationStatus.toLowerCase()}`}
                        >
                          {member.invitationStatus}
                        </span>
                      </td>

                      <td className="member-last-active">
                        {member.lastActive || "--"}
                      </td>

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
                ))
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && members.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(
              (membersData?.data.total || 0) / entriesPerPage
            )}
            totalEntries={membersData?.data.total || 0}
            entriesPerPage={entriesPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {selectedRole && (
        <RolePermissionsModal
          isOpen={isRoleModalOpen}
          onClose={handleCloseRoleModal}
          roleType={selectedRole}
        />
      )}

      {selectedMember && (
        <RemoveMemberModal
          isOpen={isRemoveMemberModalOpen}
          onClose={() => setIsRemoveMemberModalOpen(false)}
          onConfirm={handleConfirmRemoveMember}
          memberName={selectedMember.name}
        />
      )}

      {selectedMember && (
        <ChangeRoleModal
          isOpen={isChangeRoleModalOpen}
          onClose={() => setIsChangeRoleModalOpen(false)}
          onConfirm={handleConfirmChangeRole}
          currentRole={selectedMember.role}
        />
      )}

      {selectedMember && (
        <SendPasswordResetModal
          isOpen={isPasswordResetModalOpen}
          onClose={() => setIsPasswordResetModalOpen(false)}
          onConfirm={handleConfirmPasswordReset}
        />
      )}

      <CreateMemberModal
        isOpen={isCreateMemberModalOpen}
        onClose={() => setIsCreateMemberModalOpen(false)}
        onConfirm={handleConfirmCreateMember}
      />
    </main>
  );
};
