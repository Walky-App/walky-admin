import React, { useState, useMemo } from "react";
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
  // CFormCheck,
  CAlert,
  CSpinner,
  // CRow,
  // CCol,
  // CFormTextarea,
  CFormSelect,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { /* cilPlus, cilPencil, */ cilTrash, cilSearch, cilUserPlus, cilShieldAlt } from "@coreui/icons";
import { rolesService } from "../services/rolesService";
import {
  Role,
  GroupedPermissions,
  // CreateRoleRequest,
  // UpdateRoleRequest,
  AssignRoleRequest,
} from "../types/role";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const RolesManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("roles");
  // const [showRoleModal, setShowRoleModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [permissionSearch, setPermissionSearch] = useState("");

  // const [roleFormData, setRoleFormData] = useState<CreateRoleRequest>({
  //   name: "",
  //   display_name: "",
  //   description: "",
  //   permissions: [],
  //   scope: "global",
  // });

  const [assignFormData, setAssignFormData] = useState({
    userId: "",
    role: "",
    campus_id: "",
  });

  // Fetch roles
  const {
    data: rolesData,
    isLoading: rolesLoading,
    error: rolesError,
  } = useQuery({
    queryKey: ["roles"],
    queryFn: rolesService.getRoles,
  });

  // Fetch permissions
  const {
    data: permissionsData,
    isLoading: permissionsLoading,
  } = useQuery({
    queryKey: ["permissions"],
    queryFn: rolesService.getPermissions,
  });

  const roles = useMemo(() => rolesData?.roles || [], [rolesData?.roles]);
  const permissions = useMemo(() => permissionsData?.permissions || {}, [permissionsData?.permissions]);

  // Create role mutation - DISABLED
  // const createRoleMutation = useMutation({
  //   mutationFn: rolesService.createRole,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["roles"] });
  //     handleCloseRoleModal();
  //   },
  //   onError: (error) => {
  //     console.error("Failed to create role:", error);
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     alert((error as any)?.response?.data?.message || "Failed to create role. Please try again.");
  //   },
  // });

  // Update role mutation - DISABLED
  // const updateRoleMutation = useMutation({
  //   mutationFn: ({ roleId, data }: { roleId: string; data: UpdateRoleRequest }) =>
  //     rolesService.updateRole(roleId, data),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["roles"] });
  //     handleCloseRoleModal();
  //   },
  //   onError: (error) => {
  //     console.error("Failed to update role:", error);
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     alert((error as any)?.response?.data?.message || "Failed to update role. Please try again.");
  //   },
  // });

  // Delete role mutation
  const deleteRoleMutation = useMutation({
    mutationFn: rolesService.deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      setShowDeleteModal(false);
      setRoleToDelete(null);
    },
    onError: (error) => {
      console.error("Failed to delete role:", error);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      alert((error as any)?.response?.data?.message || "Failed to delete role. Please try again.");
    },
  });

  // Assign role mutation
  const assignRoleMutation = useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: AssignRoleRequest }) =>
      rolesService.assignRole(userId, data),
    onSuccess: () => {
      handleCloseAssignModal();
    },
    onError: (error) => {
      console.error("Failed to assign role:", error);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      alert((error as any)?.response?.data?.message || "Failed to assign role. Please try again.");
    },
  });

  // Filter roles based on search
  const filteredRoles = useMemo(() => {
    if (!searchTerm) return roles;
    return roles.filter(
      (role) =>
        role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.display_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [roles, searchTerm]);

  // Filter permissions based on search
  const filteredPermissions = useMemo(() => {
    if (!permissionSearch) return permissions;
    const filtered: GroupedPermissions = {};
    Object.entries(permissions).forEach(([resource, perms]) => {
      const matchingPerms = perms.filter(
        (p) =>
          resource.toLowerCase().includes(permissionSearch.toLowerCase()) ||
          p.action.toLowerCase().includes(permissionSearch.toLowerCase()) ||
          p.description.toLowerCase().includes(permissionSearch.toLowerCase())
      );
      if (matchingPerms.length > 0) {
        filtered[resource] = matchingPerms;
      }
    });
    return filtered;
  }, [permissions, permissionSearch]);

  // const handleOpenRoleModal = (role?: Role) => {
  //   if (role) {
  //     setSelectedRole(role);
  //     setRoleFormData({
  //       name: role.name,
  //       display_name: role.display_name,
  //       description: role.description,
  //       permissions: role.permissions,
  //       scope: role.scope,
  //     });
  //   } else {
  //     setSelectedRole(null);
  //     setRoleFormData({
  //       name: "",
  //       display_name: "",
  //       description: "",
  //       permissions: [],
  //       scope: "global",
  //     });
  //   }
  //   setShowRoleModal(true);
  // };

  // const handleCloseRoleModal = () => {
  //   setShowRoleModal(false);
  //   setSelectedRole(null);
  //   setRoleFormData({
  //     name: "",
  //     display_name: "",
  //     description: "",
  //     permissions: [],
  //     scope: "global",
  //   });
  // };

  const handleOpenAssignModal = () => {
    setAssignFormData({
      userId: "",
      role: "",
      campus_id: "",
    });
    setShowAssignModal(true);
  };

  const handleCloseAssignModal = () => {
    setShowAssignModal(false);
    setAssignFormData({
      userId: "",
      role: "",
      campus_id: "",
    });
  };

  // const handleRoleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (selectedRole) {
  //     updateRoleMutation.mutate({
  //       roleId: selectedRole._id,
  //       data: roleFormData,
  //     });
  //   } else {
  //     createRoleMutation.mutate(roleFormData);
  //   }
  // };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    assignRoleMutation.mutate({
      userId: assignFormData.userId,
      data: {
        role: assignFormData.role,
        campus_id: assignFormData.campus_id || undefined,
      },
    });
  };

  const handleDeleteRole = (role: Role) => {
    setRoleToDelete(role);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (roleToDelete) {
      deleteRoleMutation.mutate(roleToDelete._id);
    }
  };

  // const handlePermissionToggle = (permissionCode: string) => {
  //   setRoleFormData((prev) => ({
  //     ...prev,
  //     permissions: prev.permissions.includes(permissionCode)
  //       ? prev.permissions.filter((p) => p !== permissionCode)
  //       : [...prev.permissions, permissionCode],
  //   }));
  // };

  if (rolesLoading || permissionsLoading) {
    return (
      <div className="text-center p-5">
        <CSpinner color="primary" />
      </div>
    );
  }

  if (rolesError) {
    return (
      <CAlert color="danger">
        Error loading roles: {(rolesError as Error).message}
      </CAlert>
    );
  }

  return (
    <>
      <CCard>
        <CCardHeader>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Roles & Permissions Management</h5>
            <div>
              <CButton color="success" onClick={handleOpenAssignModal} className="me-2">
                <CIcon icon={cilUserPlus} className="me-1" />
                Assign Role to User
              </CButton>
              {/* Create Role button hidden */}
              {/* <CButton color="primary" onClick={() => handleOpenRoleModal()}>
                <CIcon icon={cilPlus} className="me-1" />
                Create Role
              </CButton> */}
            </div>
          </div>
        </CCardHeader>
        <CCardBody>
          <CNav variant="tabs" role="tablist" className="mb-3">
            <CNavItem>
              <CNavLink
                active={activeTab === "roles"}
                onClick={() => setActiveTab("roles")}
                style={{ cursor: "pointer" }}
              >
                <CIcon icon={cilShieldAlt} className="me-1" />
                Roles ({roles.length})
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === "permissions"}
                onClick={() => setActiveTab("permissions")}
                style={{ cursor: "pointer" }}
              >
                Permissions
              </CNavLink>
            </CNavItem>
          </CNav>

          <CTabContent>
            <CTabPane visible={activeTab === "roles"}>
              <CInputGroup className="mb-3">
                <CFormInput
                  placeholder="Search roles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <CButton color="primary" variant="outline">
                  <CIcon icon={cilSearch} />
                </CButton>
              </CInputGroup>

              <CTable striped hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Role Name</CTableHeaderCell>
                    <CTableHeaderCell>Display Name</CTableHeaderCell>
                    <CTableHeaderCell>Scope</CTableHeaderCell>
                    <CTableHeaderCell>Permissions</CTableHeaderCell>
                    <CTableHeaderCell>System Role</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {filteredRoles.length === 0 ? (
                    <CTableRow>
                      <CTableDataCell colSpan={6} className="text-center">
                        No roles found
                      </CTableDataCell>
                    </CTableRow>
                  ) : (
                    filteredRoles.map((role) => (
                      <CTableRow key={role._id}>
                        <CTableDataCell>
                          <strong>{role.name}</strong>
                        </CTableDataCell>
                        <CTableDataCell>{role.display_name}</CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={role.scope === "global" ? "primary" : "info"}>
                            {role.scope}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge color="secondary">{role.permissions.length} permissions</CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          {role.is_system_role ? (
                            <CBadge color="warning">System</CBadge>
                          ) : (
                            <CBadge color="success">Custom</CBadge>
                          )}
                        </CTableDataCell>
                        <CTableDataCell>
                          {/* Edit button hidden */}
                          {/* <CButton
                            color="info"
                            size="sm"
                            className="me-1"
                            onClick={() => handleOpenRoleModal(role)}
                          >
                            <CIcon icon={cilPencil} />
                          </CButton> */}
                          {!role.is_system_role && (
                            <CButton
                              color="danger"
                              size="sm"
                              onClick={() => handleDeleteRole(role)}
                            >
                              <CIcon icon={cilTrash} />
                            </CButton>
                          )}
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  )}
                </CTableBody>
              </CTable>
            </CTabPane>

            <CTabPane visible={activeTab === "permissions"}>
              <CInputGroup className="mb-3">
                <CFormInput
                  placeholder="Search permissions..."
                  value={permissionSearch}
                  onChange={(e) => setPermissionSearch(e.target.value)}
                />
                <CButton color="primary" variant="outline">
                  <CIcon icon={cilSearch} />
                </CButton>
              </CInputGroup>

              {Object.entries(filteredPermissions).map(([resource, perms]) => (
                <CCard key={resource} className="mb-3">
                  <CCardHeader>
                    <strong>{resource}</strong>
                  </CCardHeader>
                  <CCardBody>
                    <CTable borderless>
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell>Action</CTableHeaderCell>
                          <CTableHeaderCell>Code</CTableHeaderCell>
                          <CTableHeaderCell>Description</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {perms.map((perm) => (
                          <CTableRow key={perm.code}>
                            <CTableDataCell>
                              <CBadge color="info">{perm.action}</CBadge>
                            </CTableDataCell>
                            <CTableDataCell>
                              <code>{perm.code}</code>
                            </CTableDataCell>
                            <CTableDataCell>{perm.description}</CTableDataCell>
                          </CTableRow>
                        ))}
                      </CTableBody>
                    </CTable>
                  </CCardBody>
                </CCard>
              ))}
            </CTabPane>
          </CTabContent>
        </CCardBody>
      </CCard>

      {/* Create/Edit Role Modal - HIDDEN */}
      {/* <CModal visible={showRoleModal} onClose={handleCloseRoleModal} size="lg">
        <CModalHeader>
          <CModalTitle>{selectedRole ? "Edit Role" : "Create New Role"}</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={handleRoleSubmit}>
          <CModalBody>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>Role Name (unique identifier)</CFormLabel>
                <CFormInput
                  value={roleFormData.name}
                  onChange={(e) =>
                    setRoleFormData({ ...roleFormData, name: e.target.value })
                  }
                  placeholder="e.g., campus_moderator"
                  required
                  disabled={!!selectedRole}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel>Display Name</CFormLabel>
                <CFormInput
                  value={roleFormData.display_name}
                  onChange={(e) =>
                    setRoleFormData({ ...roleFormData, display_name: e.target.value })
                  }
                  placeholder="e.g., Campus Moderator"
                  required
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>Scope</CFormLabel>
                <CFormSelect
                  value={roleFormData.scope}
                  onChange={(e) =>
                    setRoleFormData({
                      ...roleFormData,
                      scope: e.target.value as "global" | "campus",
                    })
                  }
                >
                  <option value="global">Global</option>
                  <option value="campus">Campus</option>
                </CFormSelect>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol>
                <CFormLabel>Description</CFormLabel>
                <CFormTextarea
                  value={roleFormData.description}
                  onChange={(e) =>
                    setRoleFormData({ ...roleFormData, description: e.target.value })
                  }
                  placeholder="Describe what this role can do..."
                  rows={3}
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol>
                <CFormLabel>Permissions</CFormLabel>
                <div
                  style={{
                    maxHeight: "300px",
                    overflowY: "auto",
                    border: "1px solid #d8dbe0",
                    borderRadius: "4px",
                    padding: "10px",
                  }}
                >
                  {Object.entries(permissions).map(([resource, perms]) => (
                    <div key={resource} className="mb-3">
                      <strong>{resource}</strong>
                      <div className="ms-3">
                        {perms.map((perm) => (
                          <CFormCheck
                            key={perm.code}
                            id={perm.code}
                            label={`${perm.action} - ${perm.description}`}
                            checked={roleFormData.permissions.includes(perm.code)}
                            onChange={() => handlePermissionToggle(perm.code)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CCol>
            </CRow>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={handleCloseRoleModal}>
              Cancel
            </CButton>
            <CButton
              color="primary"
              type="submit"
              disabled={createRoleMutation.isPending || updateRoleMutation.isPending}
            >
              {createRoleMutation.isPending || updateRoleMutation.isPending ? (
                <CSpinner size="sm" />
              ) : selectedRole ? (
                "Update Role"
              ) : (
                "Create Role"
              )}
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal> */}

      {/* Assign Role Modal */}
      <CModal visible={showAssignModal} onClose={handleCloseAssignModal}>
        <CModalHeader>
          <CModalTitle>Assign Role to User</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={handleAssignSubmit}>
          <CModalBody>
            <div className="mb-3">
              <CFormLabel>User ID</CFormLabel>
              <CFormInput
                value={assignFormData.userId}
                onChange={(e) =>
                  setAssignFormData({ ...assignFormData, userId: e.target.value })
                }
                placeholder="Enter user ID"
                required
              />
            </div>
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
                    {role.display_name}
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

      {/* Delete Confirmation Modal */}
      <CModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <CModalHeader>
          <CModalTitle>Confirm Delete</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you sure you want to delete the role <strong>{roleToDelete?.display_name}</strong>?
          This action cannot be undone.
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </CButton>
          <CButton
            color="danger"
            onClick={confirmDelete}
            disabled={deleteRoleMutation.isPending}
          >
            {deleteRoleMutation.isPending ? <CSpinner size="sm" /> : "Delete"}
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default RolesManagement;
