import React, { useState } from "react";
import AssetIcon from "../../../components-v2/AssetIcon/AssetIcon";
import {
  SearchInput,
  Divider,
  ActionDropdown,
  FilterDropdown,
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

export const RoleManagement: React.FC = () => {
  const { theme } = useTheme();
  const [currentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [selectedRole, setSelectedRole] = useState<
    "Walky Admin" | "School Admin" | "Campus Admin" | "Moderator" | null
  >(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  // Action modals state
  const [isRemoveMemberModalOpen, setIsRemoveMemberModalOpen] = useState(false);
  const [isChangeRoleModalOpen, setIsChangeRoleModalOpen] = useState(false);
  const [isPasswordResetModalOpen, setIsPasswordResetModalOpen] =
    useState(false);
  const [isCreateMemberModalOpen, setIsCreateMemberModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberData | null>(null);

  // Mock data - replace with real data from API
  const mockMembers: MemberData[] = [
    {
      id: "1",
      name: "Emily Carter",
      title: "Dean of Student Wellbeing",
      email: "Emily@FIU.edu.co",
      avatar: "https://via.placeholder.com/38",
      role: "School Admin",
      assignedBy: {
        name: "Admin Name",
        email: "Admin@FIU.edu.co",
      },
      invitationStatus: "Accepted",
      lastActive: "Oct 7, 2025",
    },
    {
      id: "2",
      name: "James Thompson",
      title: "Campus Administrator",
      email: "James@FIU.edu.co",
      avatar: "https://via.placeholder.com/38",
      role: "Campus Admin",
      assignedBy: {
        name: "Admin Name",
        email: "Admin@FIU.edu.co",
      },
      invitationStatus: "Pending",
      lastActive: null,
    },
    {
      id: "3",
      name: "Olivia Bennett",
      title: "Academic Advisor",
      email: "Olivia@FIU.edu.co",
      avatar: "https://via.placeholder.com/38",
      role: "Moderator",
      assignedBy: {
        name: "Admin Name",
        email: "Admin@FIU.edu.co",
      },
      invitationStatus: "Expired",
      lastActive: null,
    },
    {
      id: "4",
      name: "Ethan Miller",
      title: "Financial Aid Officer",
      email: "Ethan@FIU.edu.co",
      avatar: "https://via.placeholder.com/38",
      role: "School Admin",
      assignedBy: {
        name: "Admin Name",
        email: "Admin@FIU.edu.co",
      },
      invitationStatus: "Accepted",
      lastActive: "Oct 7, 2025",
    },
    {
      id: "5",
      name: "Jeremiah Newman",
      title: "CPO",
      email: "jeremiah@walkyapp.com",
      avatar: "https://via.placeholder.com/38",
      role: "Walky Admin",
      assignedBy: {
        name: "Admin Name",
        email: "Admin@FIU.edu.co",
      },
      invitationStatus: "Accepted",
      lastActive: "Oct 7, 2025",
    },
  ];

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
    const member = mockMembers.find((m) => m.id === memberId);
    if (member) {
      setSelectedMember(member);
      setIsChangeRoleModalOpen(true);
    }
  };

  const handleSendPasswordReset = (memberId: string) => {
    const member = mockMembers.find((m) => m.id === memberId);
    if (member) {
      setSelectedMember(member);
      setIsPasswordResetModalOpen(true);
    }
  };

  const handleRemoveMember = (memberId: string) => {
    const member = mockMembers.find((m) => m.id === memberId);
    if (member) {
      setSelectedMember(member);
      setIsRemoveMemberModalOpen(true);
    }
  };

  // Modal confirm handlers
  const handleConfirmRemoveMember = () => {
    console.log("Remove member confirmed:", selectedMember?.name);
    // TODO: API call to remove member
    setIsRemoveMemberModalOpen(false);
    setSelectedMember(null);
  };

  const handleConfirmChangeRole = (
    newRole: "Walky Admin" | "School Admin" | "Campus Admin" | "Moderator"
  ) => {
    console.log("Change role confirmed:", selectedMember?.name, "to", newRole);
    // TODO: API call to change member role
    setIsChangeRoleModalOpen(false);
    setSelectedMember(null);
  };

  const handleConfirmPasswordReset = (dontShowAgain: boolean) => {
    console.log(
      "Password reset confirmed for:",
      selectedMember?.email,
      "Don't show again:",
      dontShowAgain
    );
    // TODO: API call to send password reset
    setIsPasswordResetModalOpen(false);
    setSelectedMember(null);
  };

  const handleConfirmCreateMember = (memberData: MemberFormData) => {
    console.log("Create member confirmed:", memberData);
    // TODO: API call to create new member
    setIsCreateMemberModalOpen(false);
  };

  const totalMembers = mockMembers.length;

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
              {mockMembers.map((member, index) => (
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
                  {index < mockMembers.length - 1 && (
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
        <div className="pagination-container">
          <p className="pagination-info">
            Showing {totalMembers} of {totalMembers} entries
          </p>
          <div className="pagination-controls">
            <button
              data-testid="pagination-prev-btn"
              className="pagination-button"
              disabled
            >
              Previous
            </button>
            <div className="page-number active">{currentPage}</div>
            <button
              data-testid="pagination-next-btn"
              className="pagination-button"
              disabled
            >
              Next
            </button>
          </div>
        </div>
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
