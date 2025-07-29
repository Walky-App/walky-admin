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
  CFormCheck,
  CAlert,
  CSpinner,
  CRow,
  CCol,
  CImage,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilPlus, cilPencil, cilTrash, cilSearch, cilImage } from "@coreui/icons";
import { interestService } from "../services/interestService";
import { Interest, CreateInterestDto, UpdateInterestDto } from "../types/interest";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const Interests: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedInterest, setSelectedInterest] = useState<Interest | null>(null);
  const [formData, setFormData] = useState<CreateInterestDto>({
    name: "",
    image_url: "",
    is_active: true,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [interestToDelete, setInterestToDelete] = useState<Interest | null>(null);

  // Fetch interests
  const { data: interests = [], isLoading, error } = useQuery({
    queryKey: ["interests"],
    queryFn: interestService.getAllInterests,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: interestService.createInterest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interests"] });
      handleCloseModal();
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInterestDto }) =>
      interestService.updateInterest(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interests"] });
      handleCloseModal();
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: interestService.deleteInterest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interests"] });
      setShowDeleteModal(false);
      setInterestToDelete(null);
    },
  });

  // Upload image mutation
  const uploadMutation = useMutation({
    mutationFn: interestService.uploadImage,
    onSuccess: (data) => {
      setFormData({ ...formData, image_url: data.url });
      setImagePreview(data.url);
    },
  });

  // Filter interests based on search term
  const filteredInterests = useMemo(() => {
    if (!searchTerm) return interests;
    
    return interests.filter((interest) =>
      interest.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [interests, searchTerm]);

  const handleOpenModal = (interest?: Interest) => {
    if (interest) {
      setSelectedInterest(interest);
      setFormData({
        name: interest.name,
        image_url: interest.image_url,
        is_active: interest.is_active,
      });
      setImagePreview(interest.image_url);
    } else {
      setSelectedInterest(null);
      setFormData({
        name: "",
        image_url: "",
        is_active: true,
      });
      setImagePreview("");
    }
    setSelectedFile(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedInterest(null);
    setFormData({
      name: "",
      image_url: "",
      is_active: true,
    });
    setSelectedFile(null);
    setImagePreview("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Upload image if a new file is selected
    if (selectedFile) {
      await uploadMutation.mutateAsync(selectedFile);
    }

    if (selectedInterest) {
      updateMutation.mutate({
        id: selectedInterest._id,
        data: formData,
      });
    } else {
      createMutation.mutate({
        ...formData,
        created_by: "admin", // This should come from auth context
      });
    }
  };

  const handleDelete = (interest: Interest) => {
    setInterestToDelete(interest);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (interestToDelete) {
      deleteMutation.mutate(interestToDelete._id);
    }
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
        Error loading interests: {(error as Error).message}
      </CAlert>
    );
  }

  return (
    <>
      <CCard>
        <CCardHeader>
          <CRow className="align-items-center">
            <CCol xs={12} md={6}>
              <h4 className="mb-0">Interests Management</h4>
            </CCol>
            <CCol xs={12} md={6} className="text-end">
              <CButton color="primary" onClick={() => handleOpenModal()}>
                <CIcon icon={cilPlus} className="me-2" />
                Add New Interest
              </CButton>
            </CCol>
          </CRow>
        </CCardHeader>
        <CCardBody>
          {/* Search bar */}
          <CRow className="mb-3">
            <CCol xs={12} md={6}>
              <CInputGroup>
                <CFormInput
                  placeholder="Search interests by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <CButton color="primary" variant="outline">
                  <CIcon icon={cilSearch} />
                </CButton>
              </CInputGroup>
            </CCol>
          </CRow>

          {/* Interests table */}
          <CTable striped hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell style={{ width: "100px" }}>Image</CTableHeaderCell>
                <CTableHeaderCell style={{ width: "100px" }}>Icon</CTableHeaderCell>
                <CTableHeaderCell>Name</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Created By</CTableHeaderCell>
                <CTableHeaderCell style={{ width: "150px" }}>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredInterests.map((interest) => (
                <CTableRow key={interest._id}>
                  <CTableDataCell>
                    {interest.image_url ? (
                      <CImage
                        src={interest.image_url}
                        alt={interest.name}
                        width={50}
                        height={50}
                        style={{ objectFit: "cover", borderRadius: "4px" }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 50,
                          height: 50,
                          backgroundColor: "#e9ecef",
                          borderRadius: "4px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <CIcon icon={cilImage} size="lg" />
                      </div>
                    )}
                  </CTableDataCell>
                  <CTableDataCell>
                    {interest.icon_url ? (
                      <CImage
                        src={interest.icon_url}
                        alt={`${interest.name} icon`}
                        width={50}
                        height={50}
                        style={{ objectFit: "cover", borderRadius: "4px" }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 50,
                          height: 50,
                          backgroundColor: "#f8f9fa",
                          borderRadius: "4px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <small>No Icon</small>
                      </div>
                    )}
                  </CTableDataCell>
                  <CTableDataCell>
                    <strong>{interest.name}</strong>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={interest.is_active ? "success" : "danger"}>
                      {interest.is_active ? "Active" : "Inactive"}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>{interest.created_by}</CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      color="info"
                      variant="ghost"
                      size="sm"
                      className="me-2"
                      onClick={() => handleOpenModal(interest)}
                    >
                      <CIcon icon={cilPencil} />
                    </CButton>
                    <CButton
                      color="danger"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(interest)}
                    >
                      <CIcon icon={cilTrash} />
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>

          {filteredInterests.length === 0 && (
            <div className="text-center p-4">
              <p className="text-muted">
                {searchTerm
                  ? "No interests found matching your search."
                  : "No interests found. Create one to get started."}
              </p>
            </div>
          )}
        </CCardBody>
      </CCard>

      {/* Create/Edit Modal */}
      <CModal
        visible={showModal}
        onClose={handleCloseModal}
        size="lg"
        backdrop="static"
      >
        <CForm onSubmit={handleSubmit}>
          <CModalHeader>
            <CModalTitle>
              {selectedInterest ? "Edit Interest" : "Create New Interest"}
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            <div className="mb-3">
              <CFormLabel htmlFor="name">Interest Name</CFormLabel>
              <CFormInput
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Enter interest name"
              />
            </div>

            <div className="mb-3">
              <CFormLabel htmlFor="image">Interest Image</CFormLabel>
              <CFormInput
                id="image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {imagePreview && (
                <div className="mt-3 text-center">
                  <CImage
                    src={imagePreview}
                    alt="Preview"
                    width={200}
                    height={200}
                    style={{ objectFit: "cover", borderRadius: "8px" }}
                  />
                </div>
              )}
            </div>

            <div className="mb-3">
              <CFormCheck
                id="isActive"
                label="Active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              />
            </div>

            {(createMutation.isError || updateMutation.isError || uploadMutation.isError) && (
              <CAlert color="danger">
                Error: {(createMutation.error || updateMutation.error || uploadMutation.error)?.message}
              </CAlert>
            )}
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={handleCloseModal}>
              Cancel
            </CButton>
            <CButton
              color="primary"
              type="submit"
              disabled={
                createMutation.isPending ||
                updateMutation.isPending ||
                uploadMutation.isPending
              }
            >
              {createMutation.isPending || updateMutation.isPending || uploadMutation.isPending ? (
                <>
                  <CSpinner size="sm" className="me-2" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>

      {/* Delete Confirmation Modal */}
      <CModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        backdrop="static"
      >
        <CModalHeader>
          <CModalTitle>Confirm Delete</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you sure you want to delete the interest "{interestToDelete?.name}"?
          This action cannot be undone.
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </CButton>
          <CButton
            color="danger"
            onClick={confirmDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <>
                <CSpinner size="sm" className="me-2" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default Interests;