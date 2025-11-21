import React, { useState, useEffect, useRef } from "react";
import AssetIcon from "../../../components-v2/AssetIcon/AssetIcon";
import { SearchInput } from "../../../components-v2";
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

export const RoleManagement: React.FC = () => {
  const [currentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [selectedRole, setSelectedRole] = useState<
    "Walky Admin" | "School Admin" | "Campus Admin" | "Moderator" | null
  >(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isRoleFilterOpen, setIsRoleFilterOpen] = useState(false);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);

  // Action modals state
  const [isRemoveMemberModalOpen, setIsRemoveMemberModalOpen] = useState(false);
  const [isChangeRoleModalOpen, setIsChangeRoleModalOpen] = useState(false);
  const [isPasswordResetModalOpen, setIsPasswordResetModalOpen] =
    useState(false);
  const [isCreateMemberModalOpen, setIsCreateMemberModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberData | null>(null);

  const roleFilterRef = useRef<HTMLDivElement>(null);
  const actionMenuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close role filter dropdown
      if (
        roleFilterRef.current &&
        !roleFilterRef.current.contains(event.target as Node)
      ) {
        setIsRoleFilterOpen(false);
      }

      // Close action menus
      if (openActionMenuId) {
        const actionMenuRef = actionMenuRefs.current[openActionMenuId];
        if (actionMenuRef && !actionMenuRef.contains(event.target as Node)) {
          setOpenActionMenuId(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openActionMenuId]);

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

  const handleMemberOptions = (id: string) => {
    if (openActionMenuId === id) {
      setOpenActionMenuId(null);
    } else {
      setOpenActionMenuId(id);
    }
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
    setIsRoleFilterOpen(false);
  };

  const handleChangeRole = (memberId: string) => {
    const member = mockMembers.find((m) => m.id === memberId);
    if (member) {
      setSelectedMember(member);
      setIsChangeRoleModalOpen(true);
    }
    setOpenActionMenuId(null);
  };

  const handleSendPasswordReset = (memberId: string) => {
    const member = mockMembers.find((m) => m.id === memberId);
    if (member) {
      setSelectedMember(member);
      setIsPasswordResetModalOpen(true);
    }
    setOpenActionMenuId(null);
  };

  const handleRemoveMember = (memberId: string) => {
    const member = mockMembers.find((m) => m.id === memberId);
    if (member) {
      setSelectedMember(member);
      setIsRemoveMemberModalOpen(true);
    }
    setOpenActionMenuId(null);
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
    <div className="role-management-page">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Role Management</h1>
        <p className="page-subtitle">Manage user role assignments</p>
      </div>

      {/* Main Content Container */}
      <div className="members-container">
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
              <div className="role-filter-wrapper" ref={roleFilterRef}>
                <button
                  data-testid="role-filter-btn"
                  className="role-filter-button"
                  onClick={() => setIsRoleFilterOpen(!isRoleFilterOpen)}
                >
                  <span>{roleFilter}</span>
                  <span className="filter-arrow">▼</span>
                </button>
                {isRoleFilterOpen && (
                  <div className="role-filter-dropdown">
                    <button
                      data-testid="filter-all-roles"
                      className="dropdown-item"
                      onClick={() => handleRoleFilterSelect("All Roles")}
                    >
                      All Roles
                    </button>
                    <button
                      data-testid="filter-walky-admin"
                      className="dropdown-item"
                      onClick={() => handleRoleFilterSelect("Walky Admin")}
                    >
                      Walky Admin
                    </button>
                    <button
                      data-testid="filter-school-admin"
                      className="dropdown-item"
                      onClick={() => handleRoleFilterSelect("School Admin")}
                    >
                      School Admin
                    </button>
                    <button
                      data-testid="filter-campus-admin"
                      className="dropdown-item"
                      onClick={() => handleRoleFilterSelect("Campus Admin")}
                    >
                      Campus Admin
                    </button>
                    <button
                      data-testid="filter-moderator"
                      className="dropdown-item"
                      onClick={() => handleRoleFilterSelect("Moderator")}
                    >
                      Moderator
                    </button>
                  </div>
                )}
              </div>
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
                <th className="table-header full-name-header">
                  <span>Full Name</span>
                  <AssetIcon name="swap-arrows-icon" size={24} />
                </th>
                <th className="table-header email-header">
                  <span>Institutional email</span>
                </th>
                <th className="table-header role-header">
                  <span>Role</span>
                </th>
                <th className="table-header assigned-by-header">
                  <span>Assigned By</span>
                  <AssetIcon name="swap-arrows-icon" size={24} />
                </th>
                <th className="table-header invitation-status-header">
                  <span>Invitation status</span>
                  <AssetIcon name="swap-arrows-icon" size={24} />
                </th>
                <th className="table-header last-active-header">
                  <span>Last active</span>
                  <AssetIcon name="swap-arrows-icon" size={24} />
                </th>
                <th className="table-header actions-header"></th>
              </tr>
            </thead>
            <tbody>
              {mockMembers.map((member) => (
                <tr key={member.id} className="member-row">
                  {/* Full Name Column */}
                  <td className="member-full-name">
                    <div className="member-info">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="member-avatar"
                      />
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
                    <div
                      className="actions-wrapper"
                      ref={(el) => {
                        actionMenuRefs.current[member.id] = el;
                      }}
                    >
                      <button
                        data-testid="member-options-btn"
                        className="options-button"
                        onClick={() => handleMemberOptions(member.id)}
                        title="More options"
                      >
                        <span className="options-dots">⋮</span>
                      </button>
                      {openActionMenuId === member.id && (
                        <div className="actions-dropdown">
                          <button
                            data-testid="member-change-role-btn"
                            className="action-item"
                            onClick={() => handleChangeRole(member.id)}
                          >
                            Change role
                          </button>
                          <button
                            data-testid="member-send-password-reset-btn"
                            className="action-item"
                            onClick={() => handleSendPasswordReset(member.id)}
                          >
                            Send a password reset
                          </button>
                          <button
                            data-testid="member-remove-btn"
                            className="action-item remove"
                            onClick={() => handleRemoveMember(member.id)}
                          >
                            Remove member
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
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
    </div>
  );
};
