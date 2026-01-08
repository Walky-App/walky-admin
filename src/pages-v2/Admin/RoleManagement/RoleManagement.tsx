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
  CustomToast,
  NoData,
  Chip,
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
import { usePermissions } from "../../../hooks/usePermissions";
import { useCampus } from "../../../contexts/CampusContext";
import { useSchool } from "../../../contexts/SchoolContext";
import { useAuth } from "../../../hooks/useAuth";
import { apiClient } from "../../../API";
import "./RoleManagement.css";

type RoleType =
  | "Walky Admin"
  | "Walky Internal"
  | "School Admin"
  | "Campus Admin"
  | "Moderator";

type SortField = "name" | "email" | "role" | "invitationStatus" | "lastActive";
type SortOrder = "asc" | "desc";

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
  isActive: boolean;
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
  const { canCreate, canUpdate, canDelete, canManage } = usePermissions();
  const { selectedSchool } = useSchool();
  const { selectedCampus } = useCampus();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Check if user is a super_admin or walky_internal who can view all campuses
  const isSuperAdminOrInternal =
    user?.role === "super_admin" || user?.role === "walky_internal";

  // Require campus selection for super_admin/walky_internal users
  const requiresCampusSelection = isSuperAdminOrInternal && !selectedCampus;

  // Permission checks for actions
  const canCreateMember = canCreate("role_management");
  const canChangeRole = canUpdate("role_management");
  const canRemoveMember = canDelete("role_management");
  const canSendPasswordReset = canManage("role_management");

  const entriesPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleType | "All Roles">(
    "All Roles"
  );
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [selectedRole, setSelectedRole] = useState<RoleType | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  const [isRemoveMemberModalOpen, setIsRemoveMemberModalOpen] = useState(false);
  const [isChangeRoleModalOpen, setIsChangeRoleModalOpen] = useState(false);
  const [isPasswordResetModalOpen, setIsPasswordResetModalOpen] =
    useState(false);
  const [isCreateMemberModalOpen, setIsCreateMemberModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberData | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const { data: membersData, isLoading } = useQuery({
    queryKey: [
      "members",
      currentPage,
      searchQuery,
      roleFilter,
      sortField,
      sortOrder,
      selectedSchool?._id,
      selectedCampus?._id,
    ],
    queryFn: () =>
      apiClient.api.adminV2MembersList({
        page: currentPage,
        limit: entriesPerPage,
        search: searchQuery || undefined,
        role: roleFilter !== "All Roles" ? roleFilter : undefined,
        sortBy: sortField,
        sortOrder: sortOrder,
        schoolId: selectedSchool?._id,
        campusId: selectedCampus?._id,
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
    isActive?: boolean;
    is_active?: boolean;
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
            member.lastActive ||
            member.last_active ||
            member.last_login ||
            null,
          isActive: member.isActive !== false && member.is_active !== false,
        };
      }),
    [membersData]
  );

  const isEmpty = !isLoading && members.length === 0;

  const handleRoleFilterSelect = (value: string) => {
    setRoleFilter(value as RoleType | "All Roles");
    setCurrentPage(1);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle sort order if same field
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // New field, default to ascending
      setSortField(field);
      setSortOrder("asc");
    }
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
      setToastMessage("Member removed");
      setShowToast(true);
      queryClient.invalidateQueries({ queryKey: ["members"] });
    } catch (error) {
      console.error("Failed to remove member:", error);
      toast.error("Failed to remove member");
      setToastMessage("Failed to remove member");
      setShowToast(true);
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
      setToastMessage("Role updated");
      setShowToast(true);
      queryClient.invalidateQueries({ queryKey: ["members"] });
    } catch (error) {
      console.error("Failed to change role:", error);
      toast.error("Failed to change role");
      setToastMessage("Failed to change role");
      setShowToast(true);
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

  const handleToggleMemberStatus = async (
    memberId: string,
    currentStatus: boolean
  ) => {
    const member = members.find((m) => m.id === memberId);
    if (!member) return;

    const newStatus = !currentStatus;
    const actionLabel = newStatus ? "activated" : "deactivated";

    try {
      await apiClient.api.adminV2MembersStatusPartialUpdate(memberId, {
        isActive: newStatus,
      });
      toast.success(`Member ${actionLabel} successfully`);
      setToastMessage(`Member ${actionLabel} successfully`);
      setShowToast(true);
      queryClient.invalidateQueries({ queryKey: ["members"] });
    } catch (error) {
      console.error(`Failed to ${actionLabel.replace("d", "")} member:`, error);
      toast.error(`Failed to ${actionLabel.replace("d", "")} member`);
      setToastMessage(`Failed to ${actionLabel.replace("d", "")} member`);
      setShowToast(true);
    }
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
      setToastMessage("Member created successfully");
      setShowToast(true);
      queryClient.invalidateQueries({ queryKey: ["members"] });
    } catch (error) {
      console.error("Failed to create member:", error);
      toast.error("Failed to create member");
      setToastMessage("Failed to create member");
      setShowToast(true);
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

  // Show campus selection required message for super_admin/walky_internal users
  if (requiresCampusSelection) {
    return (
      <main className="role-management-page">
        <div className="page-header">
          <h1 className="page-title">Role Management</h1>
          <p className="page-subtitle">Manage user role assignments</p>
        </div>

        <div className={`members-container ${theme.isDark ? "dark-mode" : ""}`}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "60px 20px",
              textAlign: "center",
            }}
          >
            <AssetIcon
              name="campus-icon"
              style={{ width: 64, height: 64, marginBottom: 16, opacity: 0.5 }}
            />
            <h3 style={{ marginBottom: 8, color: theme.colors.bodyColor }}>
              Select a Campus
            </h3>
            <p style={{ color: theme.colors.textMuted, maxWidth: 400 }}>
              Please select a campus from the dropdown in the navigation bar to
              view and manage members for that campus.
            </p>
          </div>
        </div>
      </main>
    );
  }

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
                  { value: "Walky Internal", label: "Walky Internal" },
                  { value: "School Admin", label: "School Admin" },
                  { value: "Campus Admin", label: "Campus Admin" },
                  { value: "Moderator", label: "Moderator" },
                ]}
                placeholder="All Roles"
                testId="role-filter"
              />
            </div>
          </div>
          {canCreateMember && (
            <button
              data-testid="create-member-btn"
              className="create-member-button"
              onClick={handleCreateMember}
            >
              <span>+ Create new member</span>
            </button>
          )}
        </div>

        <div className="members-table-wrapper">
          <table className="members-table">
            <thead>
              <tr
                className={`table-header-row${
                  isEmpty ? " table-header-row--muted" : ""
                }`}
              >
                <th>
                  <button
                    data-testid="sort-by-name"
                    className={`sortable-header full-name-header${
                      sortField === "name" ? " active" : ""
                    }`}
                    onClick={() => handleSort("name")}
                  >
                    <span>Full Name</span>
                    <AssetIcon
                      name="swap-arrows-icon"
                      color="#1d1b20"
                      size={16}
                      className={`sort-icon ${
                        sortField === "name" ? `${sortOrder} active` : ""
                      }`}
                    />
                  </button>
                </th>
                <th>
                  <button
                    data-testid="sort-by-email"
                    className={`sortable-header${
                      sortField === "email" ? " active" : ""
                    }`}
                    onClick={() => handleSort("email")}
                  >
                    <span>Institutional email</span>
                    <AssetIcon
                      name="swap-arrows-icon"
                      color="#1d1b20"
                      size={16}
                      className={`sort-icon ${
                        sortField === "email" ? `${sortOrder} active` : ""
                      }`}
                    />
                  </button>
                </th>
                <th>
                  <button
                    data-testid="sort-by-role"
                    className={`sortable-header${
                      sortField === "role" ? " active" : ""
                    }`}
                    onClick={() => handleSort("role")}
                  >
                    <span>Role</span>
                    <AssetIcon
                      name="swap-arrows-icon"
                      color="#1d1b20"
                      size={16}
                      className={`sort-icon ${
                        sortField === "role" ? `${sortOrder} active` : ""
                      }`}
                    />
                  </button>
                </th>
                <th>
                  <div className="assigned-by-header">
                    <span>Assigned By</span>
                  </div>
                </th>
                <th>
                  <button
                    data-testid="sort-by-invitation-status"
                    className={`sortable-header invitation-status-header${
                      sortField === "invitationStatus" ? " active" : ""
                    }`}
                    onClick={() => handleSort("invitationStatus")}
                  >
                    <span>Invitation status</span>
                    <AssetIcon
                      name="swap-arrows-icon"
                      color="#1d1b20"
                      size={16}
                      className={`sort-icon ${
                        sortField === "invitationStatus"
                          ? `${sortOrder} active`
                          : ""
                      }`}
                    />
                  </button>
                </th>
                <th>
                  <button
                    data-testid="sort-by-last-active"
                    className={`sortable-header last-active-header${
                      sortField === "lastActive" ? " active" : ""
                    }`}
                    onClick={() => handleSort("lastActive")}
                  >
                    <span>Last active</span>
                    <AssetIcon
                      name="swap-arrows-icon"
                      color="#1d1b20"
                      size={16}
                      className={`sort-icon ${
                        sortField === "lastActive" ? `${sortOrder} active` : ""
                      }`}
                    />
                  </button>
                </th>
                <th></th>
              </tr>
            </thead>
            <div className="content-space-divider" />
            <tbody>
              {isLoading ? (
                renderSkeletonRows()
              ) : isEmpty ? (
                <tr className="members-empty-row">
                  <td className="members-empty-cell" colSpan={7}>
                    <NoData message="No members found" />
                  </td>
                </tr>
              ) : (
                members.map((member, index) => (
                  <React.Fragment key={member.id}>
                    <tr
                      className={`member-row${
                        !member.isActive ? " deactivated" : ""
                      }`}
                    >
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
                          data-testid="role-chip-button"
                          onClick={() => handleRoleClick(member.role)}
                          style={{
                            background: "none",
                            border: "none",
                            padding: 0,
                            cursor: "pointer",
                          }}
                        >
                          <Chip
                            value={member.role}
                            type="adminRole"
                            className="role-chip"
                          />
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
                        <Chip
                          value={member.invitationStatus}
                          type="status"
                          className="invitation-chip"
                        />
                      </td>

                      <td className="member-last-active">
                        {member.lastActive || "--"}
                      </td>

                      <td className="member-actions">
                        {(canChangeRole ||
                          canSendPasswordReset ||
                          canRemoveMember) && (
                          <ActionDropdown
                            testId="member-actions"
                            items={[
                              ...(canChangeRole
                                ? [
                                    {
                                      label: "Change role",
                                      onClick: (e: React.MouseEvent) => {
                                        e.stopPropagation();
                                        handleChangeRole(member.id);
                                      },
                                    },
                                  ]
                                : []),
                              ...(canSendPasswordReset
                                ? [
                                    {
                                      label: "Send a password reset",
                                      onClick: (e: React.MouseEvent) => {
                                        e.stopPropagation();
                                        handleSendPasswordReset(member.id);
                                      },
                                    },
                                  ]
                                : []),
                              ...(canChangeRole
                                ? [
                                    {
                                      label: member.isActive
                                        ? "Deactivate member"
                                        : "Activate member",
                                      onClick: (e: React.MouseEvent) => {
                                        e.stopPropagation();
                                        handleToggleMemberStatus(
                                          member.id,
                                          member.isActive
                                        );
                                      },
                                    },
                                  ]
                                : []),
                              ...(canRemoveMember
                                ? [
                                    {
                                      label: "",
                                      isDivider: true,
                                      onClick: () => {},
                                    },
                                    {
                                      label: "Remove member",
                                      variant: "danger" as const,
                                      onClick: (e: React.MouseEvent) => {
                                        e.stopPropagation();
                                        handleRemoveMember(member.id);
                                      },
                                    },
                                  ]
                                : []),
                            ]}
                          />
                        )}
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

      {showToast && (
        <CustomToast
          message={toastMessage}
          onClose={() => setShowToast(false)}
        />
      )}
    </main>
  );
};
