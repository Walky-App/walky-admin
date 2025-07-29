import React, { useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CAlert,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormTextarea,
  CFormLabel,
  CSpinner,
  CFormCheck,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilPlus,
  cilPencil,
  cilTrash,
} from "@coreui/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { placeTypeService } from "../services/placeTypeService";
import { PlaceType, CreatePlaceTypeRequest, UpdatePlaceTypeRequest } from "../types/placeType";

const PlaceTypes: React.FC = () => {
  const queryClient = useQueryClient();
  const [alert, setAlert] = useState<{
    type: "success" | "danger" | "info";
    message: string;
  } | null>(null);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingPlaceType, setEditingPlaceType] = useState<PlaceType | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingPlaceType, setDeletingPlaceType] = useState<PlaceType | null>(null);

  // Form states
  const [formData, setFormData] = useState<CreatePlaceTypeRequest>({
    name: "",
    description: "",
    google_types: [],
    is_active: true,
  });

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [showInactive, setShowInactive] = useState(false);

  // Fetch place types
  const {
    data: placeTypes = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["place-types", { search: searchTerm, is_active: !showInactive }],
    queryFn: () => placeTypeService.getAll({
      search: searchTerm || undefined,
      is_active: showInactive ? undefined : true,
    }),
  });

  // Fetch Google types
  const {
    data: googleTypes = [],
    isLoading: googleTypesLoading,
  } = useQuery({
    queryKey: ["google-types"],
    queryFn: placeTypeService.getGoogleTypes,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: placeTypeService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["place-types"] });
      setShowModal(false);
      resetForm();
      setAlert({ type: "success", message: "Place type created successfully!" });
      setTimeout(() => setAlert(null), 3000);
    },
    onError: (error: unknown) => {
      setAlert({
        type: "danger",
        message: (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to create place type",
      });
      setTimeout(() => setAlert(null), 3000);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePlaceTypeRequest }) =>
      placeTypeService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["place-types"] });
      setShowModal(false);
      resetForm();
      setAlert({ type: "success", message: "Place type updated successfully!" });
      setTimeout(() => setAlert(null), 3000);
    },
    onError: (error: unknown) => {
      setAlert({
        type: "danger",
        message: (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to update place type",
      });
      setTimeout(() => setAlert(null), 3000);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: placeTypeService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["place-types"] });
      setShowDeleteModal(false);
      setDeletingPlaceType(null);
      setAlert({ type: "success", message: "Place type deleted successfully!" });
      setTimeout(() => setAlert(null), 3000);
    },
    onError: (error: unknown) => {
      setAlert({
        type: "danger",
        message: (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to delete place type",
      });
      setTimeout(() => setAlert(null), 3000);
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      google_types: [],
      is_active: true,
    });
    setEditingPlaceType(null);
  };

  const handleAddNew = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (placeType: PlaceType) => {
    setEditingPlaceType(placeType);
    setFormData({
      name: placeType.name,
      description: placeType.description || "",
      google_types: placeType.google_types,
      is_active: placeType.is_active,
    });
    setShowModal(true);
  };

  const handleDelete = (placeType: PlaceType) => {
    setDeletingPlaceType(placeType);
    setShowDeleteModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPlaceType) {
      updateMutation.mutate({ id: editingPlaceType._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingPlaceType) {
      deleteMutation.mutate(deletingPlaceType._id);
    }
  };

  const handleGoogleTypeToggle = (googleType: string) => {
    setFormData(prev => ({
      ...prev,
      google_types: prev.google_types.includes(googleType)
        ? prev.google_types.filter(type => type !== googleType)
        : [...prev.google_types, googleType]
    }));
  };

  const filteredPlaceTypes = placeTypes.filter(placeType => {
    if (!showInactive && !placeType.is_active) return false;
    if (searchTerm) {
      return placeType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             placeType.description?.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  if (error) {
    return (
      <CAlert color="danger">
        Failed to load place types. Please try again.
      </CAlert>
    );
  }

  return (
    <div className="page-container">
      <CRow>
        <CCol xs={12}>
          < CCard data-testid="place-types-page">
            <CCardHeader>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="mb-0 fw-semibold" data-testid="places-types-title">Place Types Management</h4>
                  <small className="text-muted">
                    Map Google place types to application categories
                  </small>
                </div>
                <CButton color="primary" onClick={handleAddNew} data-testid="add-place-type-button">
                  <CIcon icon={cilPlus} className="me-2" />
                  Add Place Type
                </CButton>
              </div>
            </CCardHeader>
            <CCardBody>
              {alert && (
                <CAlert color={alert.type} className="mb-3">
                  {alert.message}
                </CAlert>
              )}

              {/* Search and filters */}
              <div className="mb-3 d-flex gap-3 align-items-center">
                <CFormInput
                  placeholder="Search place types..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ maxWidth: "300px" }}
                />
                <CFormCheck
                  id="showInactive"
                  label="Show inactive"
                  checked={showInactive}
                  onChange={(e) => setShowInactive(e.target.checked)}
                />
              </div>

              {/* Place types table */}
              <div className="table-responsive">
                <CTable hover data-testid="place-types-table">
                  <CTableHead style={{ backgroundColor: "#343a40" }}>
                    <CTableRow data-testid="place-types-table-header">
                      <CTableHeaderCell className="text-white fw-bold">Name</CTableHeaderCell>
                      <CTableHeaderCell className="text-white fw-bold">Description</CTableHeaderCell>
                      <CTableHeaderCell className="text-white fw-bold">Google Types</CTableHeaderCell>
                      <CTableHeaderCell className="text-white fw-bold">Places Count</CTableHeaderCell>
                      <CTableHeaderCell className="text-white fw-bold">Status</CTableHeaderCell>
                      <CTableHeaderCell className="text-white fw-bold">Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {isLoading ? (
                      <CTableRow>
                        <CTableDataCell colSpan={7} className="text-center py-4">
                          <CSpinner size="sm" className="me-2" data-testid="places-types-loading"/>
                          Loading place types...
                        </CTableDataCell>
                      </CTableRow>
                    ) : filteredPlaceTypes.length === 0 ? (
                      <CTableRow>
                        <CTableDataCell colSpan={7} className="text-center py-5">
                          <div style={{ opacity: 0.7 }}>
                            <div style={{ fontSize: "48px", marginBottom: "16px" }}>
                              🏷️
                            </div>
                            <h5 style={{ marginBottom: "8px" }}>
                              No place types found
                            </h5>
                            <p style={{ marginBottom: "20px" }}>
                              Create your first place type to start mapping Google types
                            </p>
                            <CButton color="primary" onClick={handleAddNew}>
                              <CIcon icon={cilPlus} className="me-2" />
                              Add Place Type
                            </CButton>
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    ) : (
                      filteredPlaceTypes.map((placeType) => (
                        <CTableRow key={placeType._id} data-testid={`place-type-row-${placeType._id}`}>
                          <CTableDataCell>
                            <strong>{placeType.name}</strong>
                          </CTableDataCell>
                          <CTableDataCell>
                            {placeType.description || <span style={{ opacity: 0.6 }}>No description</span>}
                          </CTableDataCell>
                          <CTableDataCell>
                            <div className="d-flex flex-wrap gap-1">
                              {placeType.google_types.slice(0, 3).map((type) => (
                                <CBadge key={type} color="secondary" className="small" data-testid={`place-type-badge-${type}`}>
                                  {type}
                                </CBadge>
                              ))}
                              {placeType.google_types.length > 3 && (
                                <CBadge color="info" className="small">
                                  +{placeType.google_types.length - 3} more
                                </CBadge>
                              )}
                            </div>
                          </CTableDataCell>

                          <CTableDataCell className="text-dark" >

                            <strong>{placeType.places_count || 0}</strong>
                          </CTableDataCell>
                          <CTableDataCell>
                            <CBadge color={placeType.is_active ? "success" : "secondary"}>
                              {placeType.is_active ? "Active" : "Inactive"}
                            </CBadge>
                          </CTableDataCell>
                          <CTableDataCell>
                            <div className="d-flex gap-1">
                              <CButton
                                data-testid={`edit-place-type-button-${placeType._id}`}
                                color="primary"
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(placeType)}
                                title="Edit"
                              >
                                <CIcon icon={cilPencil} size="sm" />
                              </CButton>
                              <CButton
                                data-testid={`delete-place-type-button-${placeType._id}`}
                                color="danger"
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(placeType)}
                                title="Delete"
                              >
                                <CIcon icon={cilTrash} size="sm" />
                              </CButton>
                            </div>
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    )}
                  </CTableBody>
                </CTable>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Create/Edit Modal */}
      <CModal visible={showModal} onClose={() => setShowModal(false)} size="lg" data-testid="create-edit-modal">
        <CModalHeader>
          <CModalTitle>
            {editingPlaceType ? "Edit Place Type" : "Create Place Type"}
          </CModalTitle>
        </CModalHeader>
        <CForm onSubmit={handleSubmit}>
          <CModalBody>
            <CRow>
              <CCol md={8}>
                <div className="mb-3">
                  <CFormLabel htmlFor="name">Name *</CFormLabel>
                  <CFormInput
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    maxLength={50}
                    placeholder="e.g., Food & Dining"
                  />
                </div>
              </CCol>
              <CCol md={4}>
                <div className="mb-3">
                  <CFormCheck
                    id="is_active"
                    label="Active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                    className="mt-4"
                  />
                </div>
              </CCol>
            </CRow>

            <div className="mb-3">
              <CFormLabel htmlFor="description">Description</CFormLabel>
              <CFormTextarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                maxLength={200}
                placeholder="Brief description of this place type category..."
              />
            </div>

            <div className="mb-3">
              <CFormLabel className="fw-semibold mb-2" >
                Select Google Place Types 
                {formData.google_types.length > 0 && (
                  <CBadge color="primary" className="ms-2">
                    {formData.google_types.length} selected
                  </CBadge>
                )}
              </CFormLabel>
              <small className="text-muted d-block mb-3">
                Choose which Google place types should be included in this category
              </small>
              
              {googleTypesLoading ? (
                <div className="text-center py-4">
                  <CSpinner size="sm" className="me-2" />
                  Loading available Google types...
                </div>
              ) : (
                <div 
                  style={{ 
                    maxHeight: "250px", 
                    overflowY: "auto", 
                    border: "1px solid #dee2e6", 
                    borderRadius: "8px"
                  }}
                >
                  <div className="p-2">
                    {googleTypes.map((googleType) => (
                      <div 
                        key={googleType.type}
                        className={`p-2 rounded mb-1 ${
                          formData.google_types.includes(googleType.type) 
                            ? 'bg-primary bg-opacity-10' 
                            : ''
                        }`}
                        style={{ 
                          cursor: "pointer",
                          transition: "all 0.2s ease"
                        }}
                        onClick={() => handleGoogleTypeToggle(googleType.type)}
                      >
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center">
                            <CFormCheck
                              data-testid={`google-type-${googleType.type}`}
                              id={`google-type-${googleType.type}`}
                              checked={formData.google_types.includes(googleType.type)}
                              onChange={() => handleGoogleTypeToggle(googleType.type)}
                              className="me-3"
                            />
                            <div className="fw-medium" style={{ marginLeft: "8px" }}>
                              {googleType.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </div>
                          </div>
                          <CBadge 
                            color={formData.google_types.includes(googleType.type) ? "primary" : "secondary"} 
                            className="small"
                          >
                            {googleType.places_count} places
                          </CBadge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {formData.google_types.length === 0 && (
                <div className="mt-2 p-2 bg-danger bg-opacity-10 border border-danger border-opacity-25 rounded">
                  <small className="text-danger fw-medium">
                    ⚠️ Please select at least one Google place type for this category
                  </small>
                </div>
              )}
              
              {formData.google_types.length > 0 && (
                <div className="mt-3">
                  <small className="text-muted">Selected types:</small>
                  <div className="d-flex flex-wrap gap-1 mt-1" data-testid="selected-types-summary">
                    {formData.google_types.map((type) => (
                      <CBadge 
                        key={type} 
                        color="primary" 
                        className="small d-flex align-items-center"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleGoogleTypeToggle(type)}
                        title="Click to remove"
                      >
                        {type.replace(/_/g, ' ')}
                        <span className="ms-1">×</span>
                      </CBadge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </CButton>
            <CButton
              color="primary"
              type="submit"
              disabled={
                createMutation.isPending ||
                updateMutation.isPending ||
                !formData.name ||
                formData.google_types.length === 0
              }
            >
              {(createMutation.isPending || updateMutation.isPending) && (
                <CSpinner size="sm" className="me-2" />
              )}
              {editingPlaceType ? "Update" : "Create"}
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>

      {/* Delete Confirmation Modal */}
      <CModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)} data-testid="delete-confirmation-modal">
        <CModalHeader>
          <CModalTitle>Confirm Delete</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you sure you want to delete the place type "{deletingPlaceType?.name}"?
          {deletingPlaceType?.places_count && deletingPlaceType.places_count > 0 && (
            <div className="mt-2">
              <CAlert color="warning" className="mb-0" data-testid="delete-warning-alert">
                This place type is currently used by {deletingPlaceType.places_count} places.
              </CAlert>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </CButton>
          <CButton
            color="danger"
            onClick={handleConfirmDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending && <CSpinner size="sm" className="me-2" />}
            Delete
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default PlaceTypes;
