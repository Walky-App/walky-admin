import React, { useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CFormInput,
  CInputGroup,
  CBadge,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CForm,
  CFormLabel,
  CAlert,
  CSpinner,
  CRow,
  CCol,
  CFormSelect,
  CPagination,
  CPaginationItem,
  CAvatar,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilSearch, cilUserPlus, cilTrash } from "@coreui/icons";
import { userService, UserWithRoles } from "../services/userService";
import { rolesService } from "../services/rolesService";
import { AssignRoleRequest, RemoveRoleRequest, RoleName } from "../types/role";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const UsersRoles: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState("");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithRoles | null>(null);
  const [selectedRoleToRemove, setSelectedRoleToRemove] = useState<{
    role: string;
    campus_id?: string;
  } | null>(null);

  const [assignFormData, setAssignFormData] = useState({
    role: "",
    campus_id: "",
  });

  const limit = 20;

  // Fetch users
  const {
    data: usersData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users", currentPage, searchTerm, roleFilter],
    queryFn: () =>
      userService.getUsers({
        page: currentPage,
        limit,
        search: searchTerm,
        role: roleFilter,
      }),
  });

  // Fetch roles for filter
  const { data: rolesData } = useQuery({
    queryKey: ["roles"],
    queryFn: rolesService.getRoles,
  });

  const users = (usersData?.users || []) as UserWithRoles[];
  const pagination = usersData?.pagination;
  const roles = rolesData?.roles || [];

  // Assign role mutation
  const assignRoleMutation = useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: AssignRoleRequest }) =>
      rolesService.assignRole(userId, {
        role: data.role as RoleName,
        campus_id: data.campus_id,
        school_id: data.school_id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      handleCloseAssignModal();
    },
    onError: (error) => {
      console.error("Failed to assign role:", error);
       
      alert((error as any)?.response?.data?.message || "Failed to assign role. Please try again.");
    },
  });

  // Remove role mutation
  const removeRoleMutation = useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: RemoveRoleRequest }) =>
      rolesService.removeRole(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setShowRemoveModal(false);
      setSelectedUser(null);
      setSelectedRoleToRemove(null);
    },
    onError: (error) => {
      console.error("Failed to remove role:", error);
       
      alert((error as any)?.response?.data?.message || "Failed to remove role. Please try again.");
    },
  });

  const handleOpenAssignModal = (user: UserWithRoles) => {
    setSelectedUser(user);
    setAssignFormData({
      role: "",
      campus_id: "",
    });
    setShowAssignModal(true);
  };

  const handleCloseAssignModal = () => {
    setShowAssignModal(false);
    setSelectedUser(null);
    setAssignFormData({
      role: "",
      campus_id: "",
    });
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser?._id) {
      assignRoleMutation.mutate({
        userId: selectedUser._id,
        data: {
          role: assignFormData.role,
          campus_id: assignFormData.campus_id || undefined,
        },
      });
    }
  };

  const handleOpenRemoveModal = (user: UserWithRoles, role: string, campus_id?: string) => {
    setSelectedUser(user);
    setSelectedRoleToRemove({ role, campus_id });
    setShowRemoveModal(true);
  };

  const handleRemoveConfirm = () => {
    if (selectedUser?._id && selectedRoleToRemove) {
      removeRoleMutation.mutate({
        userId: selectedUser._id,
        data: {
          role: selectedRoleToRemove.role,
          campus_id: selectedRoleToRemove.campus_id,
        },
      });
    }
  };

  const getUserInitials = (user: UserWithRoles) => {
    return `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase();
  };

  const getRoleDisplayName = (roleName: string) => {
    const role = roles.find((r) => r.name === roleName);
    return role?.display_name || roleName;
  };

  if (isLoading) {
    return (
      <div className="text-center p-5">
        <CSpinner color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <CAlert color="danger">
        Error loading users: {(error as Error).message}
      </CAlert>
    );
  }

  return (
    <>
      <CCard>
        <CCardHeader>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Users & Role Assignments</h5>
          </div>
        </CCardHeader>
        <CCardBody>
          <CRow className="mb-3">
            <CCol md={6}>
              <CInputGroup>
                <CFormInput
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
                <CButton color="primary" variant="outline">
                  <CIcon icon={cilSearch} />
                </CButton>
              </CInputGroup>
            </CCol>
            <CCol md={6}>
              <CFormSelect
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">All roles</option>
                {roles.map((role) => (
                  <option key={role._id} value={role.name}>
                    {role.display_name}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
          </CRow>

          <CTable striped hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>User</CTableHeaderCell>
                <CTableHeaderCell>Email</CTableHeaderCell>
                <CTableHeaderCell>School/Campus</CTableHeaderCell>
                <CTableHeaderCell>Primary Role</CTableHeaderCell>
                <CTableHeaderCell>Assigned Roles</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {users.length === 0 ? (
                <CTableRow>
                  <CTableDataCell colSpan={6} className="text-center">
                    No users found
                  </CTableDataCell>
                </CTableRow>
              ) : (
                users.map((user) => (
                  <CTableRow key={user._id}>
                    <CTableDataCell>
                      <div className="d-flex align-items-center">
                        {user.avatar_url ? (
                          <CAvatar src={user.avatar_url} size="md" className="me-2" />
                        ) : (
                          <CAvatar color="primary" size="md" className="me-2">
                            {getUserInitials(user)}
                          </CAvatar>
                        )}
                        <div>
                          <strong>
                            {user.first_name} {user.last_name}
                          </strong>
                          <div className="small text-muted">
                            {user.is_verified && (
                              <CBadge color="success" className="me-1">
                                Verified
                              </CBadge>
                            )}
                            {user.is_active ? (
                              <CBadge color="info">Active</CBadge>
                            ) : (
                              <CBadge color="secondary">Inactive</CBadge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>{user.email}</CTableDataCell>
                    <CTableDataCell>
                      {user.school_id && typeof user.school_id === "object" && user.school_id.name && (
                        <div className="small">
                          <strong>{user.school_id.name}</strong>
                          {user.campus_id && typeof user.campus_id === "object" && user.campus_id.campus_name && (
                            <div className="text-muted">{user.campus_id.campus_name}</div>
                          )}
                        </div>
                      )}
                    </CTableDataCell>
                    <CTableDataCell>
                      {user.primary_role && (
                        <CBadge color="primary">{getRoleDisplayName(user.primary_role)}</CBadge>
                      )}
                    </CTableDataCell>
                    <CTableDataCell>
                      {user.roles && user.roles.length > 0 ? (
                        <div>
                          {user.roles.map((roleAssignment, idx) => (
                            <div key={idx} className="mb-1">
                              <CBadge color="secondary" className="me-1">
                                {getRoleDisplayName(roleAssignment.role || "")}
                              </CBadge>
                              {roleAssignment.campus_id && typeof roleAssignment.campus_id === "object" && (
                                <span className="small text-muted">
                                  @ {roleAssignment.campus_id.campus_name}
                                </span>
                              )}
                              <CButton
                                color="danger"
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  handleOpenRemoveModal(
                                    user,
                                    roleAssignment.role || "",
                                    typeof roleAssignment.campus_id === "object" ? roleAssignment.campus_id?._id : roleAssignment.campus_id
                                  )
                                }
                              >
                                <CIcon icon={cilTrash} size="sm" />
                              </CButton>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted">No roles assigned</span>
                      )}
                    </CTableDataCell>
                    <CTableDataCell>
                      <CButton
                        color="success"
                        size="sm"
                        onClick={() => handleOpenAssignModal(user)}
                      >
                        <CIcon icon={cilUserPlus} className="me-1" />
                        Assign Role
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))
              )}
            </CTableBody>
          </CTable>

          {pagination && pagination.pages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <div className="text-muted">
                Showing {(currentPage - 1) * limit + 1} to{" "}
                {Math.min(currentPage * limit, pagination.total)} of {pagination.total} users
              </div>
              <CPagination>
                <CPaginationItem
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </CPaginationItem>
                {[...Array(pagination.pages)].map((_, idx) => (
                  <CPaginationItem
                    key={idx + 1}
                    active={currentPage === idx + 1}
                    onClick={() => setCurrentPage(idx + 1)}
                  >
                    {idx + 1}
                  </CPaginationItem>
                ))}
                <CPaginationItem
                  disabled={currentPage === pagination.pages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </CPaginationItem>
              </CPagination>
            </div>
          )}
        </CCardBody>
      </CCard>

      {/* Assign Role Modal */}
      <CModal visible={showAssignModal} onClose={handleCloseAssignModal}>
        <CModalHeader>
          <CModalTitle>
            Assign Role to {selectedUser?.first_name} {selectedUser?.last_name}
          </CModalTitle>
        </CModalHeader>
        <CForm onSubmit={handleAssignSubmit}>
          <CModalBody>
            <div className="mb-3">
              <CFormLabel>Role</CFormLabel>
              <CFormSelect
                value={assignFormData.role}
                onChange={(e) =>
                  setAssignFormData({ ...assignFormData, role: e.target.value })
                }
                required
              >
                <option value="">Select a role...</option>
                {roles.map((role) => (
                  <option key={role._id} value={role.name}>
                    {role.display_name} ({role.scope})
                  </option>
                ))}
              </CFormSelect>
            </div>
            <div className="mb-3">
              <CFormLabel>Campus ID (optional, for campus-scoped roles)</CFormLabel>
              <CFormInput
                value={assignFormData.campus_id}
                onChange={(e) =>
                  setAssignFormData({ ...assignFormData, campus_id: e.target.value })
                }
                placeholder="Enter campus ID (optional)"
              />
              <small className="text-muted">
                Required for campus-scoped roles, optional for global roles
              </small>
            </div>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={handleCloseAssignModal}>
              Cancel
            </CButton>
            <CButton color="primary" type="submit" disabled={assignRoleMutation.isPending}>
              {assignRoleMutation.isPending ? <CSpinner size="sm" /> : "Assign Role"}
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>

      {/* Remove Role Confirmation Modal */}
      <CModal visible={showRemoveModal} onClose={() => setShowRemoveModal(false)}>
        <CModalHeader>
          <CModalTitle>Confirm Remove Role</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you sure you want to remove the role{" "}
          <strong>{selectedRoleToRemove && getRoleDisplayName(selectedRoleToRemove.role)}</strong>{" "}
          from{" "}
          <strong>
            {selectedUser?.first_name} {selectedUser?.last_name}
          </strong>
          ?
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowRemoveModal(false)}>
            Cancel
          </CButton>
          <CButton
            color="danger"
            onClick={handleRemoveConfirm}
            disabled={removeRoleMutation.isPending}
          >
            {removeRoleMutation.isPending ? <CSpinner size="sm" /> : "Remove Role"}
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default UsersRoles;
