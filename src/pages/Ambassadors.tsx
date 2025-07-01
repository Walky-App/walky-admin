import React, { useState, useEffect } from "react";
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
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilPlus, cilPencil, cilTrash, cilUser } from "@coreui/icons";
import { Ambassador } from "../types/ambassador";
import { ambassadorService } from "../services/ambassadorService";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryClient";

const Ambassadors: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  // Use React Query for fetching ambassadors
  const {
    data: ambassadors = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: queryKeys.ambassadors,
    queryFn: ambassadorService.getAll,
    retry: (failureCount, error) => {
      // Don't retry on 404 (endpoint not found) - this is expected if backend isn't ready
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 404) {
          console.warn(
            "🔍 Ambassador endpoint not found (404) - backend may not be ready"
          );
          return false;
        }
      }
      return failureCount < 2;
    },
  });

  // Track which ambassadors are being deleted
  const [deletingAmbassadors, setDeletingAmbassadors] = useState<Set<string>>(
    new Set()
  );

  // Delete ambassador mutation
  const deleteAmbassadorMutation = useMutation({
    mutationFn: (id: string) => {
      // Add to deleting set when mutation starts
      setDeletingAmbassadors((prev) => new Set(prev).add(id));
      return ambassadorService.delete(id);
    },
    onSuccess: (_, id) => {
      // Remove from deleting set
      setDeletingAmbassadors((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      // Invalidate and refetch ambassadors
      queryClient.invalidateQueries({ queryKey: queryKeys.ambassadors });
      setAlert({
        type: "success",
        message: "Ambassador deleted successfully!",
      });
      setTimeout(() => setAlert(null), 3000);
    },
    onError: (error, id) => {
      // Remove from deleting set on error
      setDeletingAmbassadors((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      console.error("Failed to delete ambassador:", error);
      setAlert({
        type: "danger",
        message: "Failed to delete ambassador. Please try again.",
      });
      setTimeout(() => setAlert(null), 3000);
    },
  });

  const [alert, setAlert] = useState<{
    type: "success" | "danger";
    message: string;
  } | null>(null);

  // Handle success message from navigation state
  useEffect(() => {
    if (location.state?.successMessage) {
      setAlert({
        type: "success",
        message: location.state.successMessage,
      });
      // Clean up the state to prevent showing the message again
      navigate(".", { replace: true, state: {} });
      // Auto-hide the alert after 5 seconds
      setTimeout(() => setAlert(null), 5000);
    }
  }, [location.state, navigate]);

  // Handle React Query error
  useEffect(() => {
    if (error) {
      console.error("Failed to load ambassadors:", error);

      // Check if it's a 404 error (endpoint not found)
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { status?: number; data?: unknown };
        };
        if (axiosError.response?.status === 404) {
          setAlert({
            type: "danger",
            message:
              "Ambassador endpoint not found. Please make sure the backend ambassador routes are properly configured.",
          });
        } else if (axiosError.response?.status === 500) {
          setAlert({
            type: "danger",
            message:
              "Server error when loading ambassadors. Please check the backend logs.",
          });
        } else {
          setAlert({
            type: "danger",
            message: `Failed to load ambassadors: ${
              axiosError.response?.status || "Unknown error"
            }`,
          });
        }
      } else {
        setAlert({
          type: "danger",
          message:
            "Failed to load ambassadors. Please check your connection and try again.",
        });
      }
      setTimeout(() => setAlert(null), 10000); // Show longer for debugging
    }
  }, [error]);

  const handleAddAmbassador = () => {
    // Navigate to ambassador view to create a new ambassador
    navigate("/ambassadors/ambassador-view");
  };

  const handleEditAmbassador = (ambassador: Ambassador) => {
    // Use the actual ambassador ID with fallback to _id, not a temporary one
    const ambassadorId = ambassador.id || ambassador._id;

    if (!ambassadorId || ambassadorId.startsWith("temp-")) {
      setAlert({
        type: "danger",
        message:
          "Cannot edit ambassador: Invalid ambassador ID. Please refresh the page and try again.",
      });
      setTimeout(() => setAlert(null), 3000);
      return;
    }

    console.log("✏️ Editing ambassador with ID:", ambassadorId);
    // Pass ambassador data through navigation state
    navigate("/ambassadors/ambassador-view/" + ambassadorId, {
      state: { ambassadorData: ambassador },
    });
  };

  const handleDeleteAmbassador = (id: string) => {
    console.log("🗑️ Attempting to delete ambassador with ID:", id);

    // Don't allow deletion if no valid ID
    if (!id || id.startsWith("temp-")) {
      console.warn("❌ Invalid ambassador ID for deletion:", id);
      setAlert({
        type: "danger",
        message:
          "Cannot delete ambassador: Invalid ambassador ID. Please refresh the page and try again.",
      });
      setTimeout(() => setAlert(null), 3000);
      return;
    }

    if (
      !window.confirm(
        "Are you sure you want to delete this ambassador? This action cannot be undone."
      )
    ) {
      return;
    }

    console.log("🚀 Calling deleteAmbassadorMutation with ID:", id);
    deleteAmbassadorMutation.mutate(id);
  };

  return (
    <div className="page-container">
      <CRow>
        <CCol xs={12}>
          <CCard className="campus-card">
            <CCardHeader className="campus-card-header">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <h4 className="mb-0 fw-semibold me-3">
                    Ambassador Management
                  </h4>
                </div>
                <CButton
                  color="primary"
                  size="sm"
                  onClick={handleAddAmbassador}
                  disabled={loading}
                >
                  <CIcon icon={cilPlus} className="me-2" />
                  Add Ambassador
                </CButton>
              </div>
            </CCardHeader>
            <CCardBody className="campus-card-body">
              {alert && (
                <CAlert color={alert.type} className="mb-3">
                  {alert.message}
                </CAlert>
              )}

              <div className="table-responsive">
                <CTable hover className="campus-table">
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell className="campus-logo-cell">
                        Ambassador
                      </CTableHeaderCell>
                      <CTableHeaderCell className="location-cell">
                        Email
                      </CTableHeaderCell>
                      <CTableHeaderCell className="address-cell">
                        Campuses
                      </CTableHeaderCell>
                      <CTableHeaderCell className="geofence-cell">
                        Major
                      </CTableHeaderCell>
                      <CTableHeaderCell className="status-cell">
                        Status
                      </CTableHeaderCell>
                      <CTableHeaderCell className="actions-cell">
                        Actions
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {loading ? (
                      // Loading skeleton rows
                      Array.from({ length: 5 }).map((_, index) => (
                        <CTableRow key={`skeleton-${index}`}>
                          <CTableDataCell>
                            <div className="d-flex align-items-center">
                              <div
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  backgroundColor: "#e9ecef",
                                  borderRadius: "50%",
                                  marginRight: "12px",
                                }}
                                className="skeleton-loader"
                              />
                              <div>
                                <div
                                  style={{
                                    width: "120px",
                                    height: "16px",
                                    backgroundColor: "#e9ecef",
                                    borderRadius: "4px",
                                    marginBottom: "4px",
                                  }}
                                  className="skeleton-loader"
                                />
                                <div
                                  style={{
                                    width: "80px",
                                    height: "12px",
                                    backgroundColor: "#e9ecef",
                                    borderRadius: "4px",
                                  }}
                                  className="skeleton-loader"
                                />
                              </div>
                            </div>
                          </CTableDataCell>
                          <CTableDataCell>
                            <div
                              style={{
                                width: "150px",
                                height: "16px",
                                backgroundColor: "#e9ecef",
                                borderRadius: "4px",
                              }}
                              className="skeleton-loader"
                            />
                          </CTableDataCell>
                          <CTableDataCell>
                            <div
                              style={{
                                width: "100px",
                                height: "16px",
                                backgroundColor: "#e9ecef",
                                borderRadius: "4px",
                              }}
                              className="skeleton-loader"
                            />
                          </CTableDataCell>
                          <CTableDataCell>
                            <div
                              style={{
                                width: "80px",
                                height: "16px",
                                backgroundColor: "#e9ecef",
                                borderRadius: "4px",
                              }}
                              className="skeleton-loader"
                            />
                          </CTableDataCell>
                          <CTableDataCell>
                            <div
                              style={{
                                width: "60px",
                                height: "20px",
                                backgroundColor: "#e9ecef",
                                borderRadius: "12px",
                              }}
                              className="skeleton-loader"
                            />
                          </CTableDataCell>
                          <CTableDataCell>
                            <div className="d-flex justify-content-center gap-1">
                              <div
                                style={{
                                  width: "32px",
                                  height: "32px",
                                  backgroundColor: "#e9ecef",
                                  borderRadius: "4px",
                                }}
                                className="skeleton-loader"
                              />
                              <div
                                style={{
                                  width: "32px",
                                  height: "32px",
                                  backgroundColor: "#e9ecef",
                                  borderRadius: "4px",
                                }}
                                className="skeleton-loader"
                              />
                            </div>
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    ) : ambassadors.length === 0 ? (
                      <CTableRow>
                        <CTableDataCell
                          colSpan={6}
                          className="text-center py-5"
                        >
                          <div style={{ color: "#6c757d" }}>
                            <div
                              style={{ fontSize: "48px", marginBottom: "16px" }}
                            >
                              👨‍🎓
                            </div>
                            <h5
                              style={{ marginBottom: "8px", color: "#6c757d" }}
                            >
                              No ambassadors found
                            </h5>
                            <p
                              style={{ marginBottom: "20px", color: "#6c757d" }}
                            >
                              Get started by adding your first ambassador
                            </p>
                            <CButton
                              color="primary"
                              onClick={handleAddAmbassador}
                              disabled={loading}
                            >
                              <CIcon icon={cilPlus} className="me-2" />
                              Add Ambassador
                            </CButton>
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    ) : (
                      ambassadors.map((ambassador, index) => {
                        // Use ambassador.id if available, otherwise use _id, otherwise create a unique fallback
                        const ambassadorId =
                          ambassador.id || ambassador._id || `temp-${index}`;
                        const ambassadorKey = `row-${ambassadorId}`;

                        // Check if this ambassador is being deleted
                        const isBeingDeleted =
                          deletingAmbassadors.has(ambassadorId);

                        return (
                          <CTableRow
                            key={ambassadorKey}
                            style={
                              isBeingDeleted
                                ? {
                                    position: "relative",
                                    opacity: 0.5,
                                    pointerEvents: "none",
                                  }
                                : {}
                            }
                          >
                            {/* Skeleton overlay for deleting ambassadors */}
                            {isBeingDeleted && (
                              <CTableDataCell
                                colSpan={6}
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                                  zIndex: 10,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <div className="d-flex align-items-center">
                                  <div
                                    className="skeleton-loader"
                                    style={{
                                      width: "20px",
                                      height: "20px",
                                      borderRadius: "50%",
                                      marginRight: "8px",
                                    }}
                                  />
                                  <span
                                    style={{
                                      fontSize: "14px",
                                      color: "#6c757d",
                                    }}
                                  >
                                    Deleting...
                                  </span>
                                </div>
                              </CTableDataCell>
                            )}
                            <CTableDataCell className="campus-logo-cell">
                              <div className="d-flex align-items-center">
                                {ambassador.profile_image_url &&
                                ambassador.profile_image_url !== "" &&
                                !ambassador.profile_image_url.includes(
                                  "placeholder"
                                ) ? (
                                  <img
                                    src={ambassador.profile_image_url}
                                    alt={`${ambassador.name} profile`}
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                      objectFit: "cover",
                                      marginRight: "12px",
                                      borderRadius: "50%",
                                      border:
                                        "1px solid var(--cui-border-color)",
                                    }}
                                    onError={(e) => {
                                      // Hide image if it fails to load
                                      (
                                        e.target as HTMLImageElement
                                      ).style.display = "none";
                                    }}
                                  />
                                ) : (
                                  <div
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                      backgroundColor: "var(--cui-gray-100)",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      marginRight: "12px",
                                      borderRadius: "50%",
                                      fontSize: "18px",
                                      border:
                                        "1px solid var(--cui-border-color)",
                                    }}
                                  >
                                    <CIcon icon={cilUser} />
                                  </div>
                                )}
                                <div>
                                  <div className="fw-semibold">
                                    {ambassador.name}
                                  </div>
                                  <small className="text-muted">
                                    {ambassador.student_id
                                      ? `ID: ${ambassador.student_id}`
                                      : `Sys ID: ${ambassador.id?.substring(
                                          0,
                                          8
                                        )}...`}
                                  </small>
                                </div>
                              </div>
                            </CTableDataCell>
                            <CTableDataCell className="location-cell">
                              {ambassador.email}
                            </CTableDataCell>
                            <CTableDataCell className="address-cell">
                              <div title={ambassador.campus_name}>
                                {ambassador.campus_name || "Not assigned"}
                              </div>
                            </CTableDataCell>
                            <CTableDataCell className="geofence-cell">
                              {ambassador.major || "Not specified"}
                            </CTableDataCell>
                            <CTableDataCell className="status-cell">
                              <CBadge
                                color={
                                  ambassador.is_active !== false
                                    ? "success"
                                    : "secondary"
                                }
                              >
                                {ambassador.is_active !== false
                                  ? "Active"
                                  : "Inactive"}
                              </CBadge>
                            </CTableDataCell>
                            <CTableDataCell className="actions-cell">
                              <div className="d-flex justify-content-center gap-1">
                                <CButton
                                  color="primary"
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleEditAmbassador(ambassador)
                                  }
                                  disabled={loading}
                                  title="Edit Ambassador"
                                >
                                  <CIcon icon={cilPencil} size="sm" />
                                </CButton>
                                <CButton
                                  color="danger"
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleDeleteAmbassador(
                                      ambassador.id ||
                                        ambassador._id ||
                                        `temp-${index}`
                                    )
                                  }
                                  disabled={
                                    loading ||
                                    deleteAmbassadorMutation.isPending
                                  }
                                  title="Delete Ambassador"
                                >
                                  <CIcon icon={cilTrash} size="sm" />
                                </CButton>
                              </div>
                            </CTableDataCell>
                          </CTableRow>
                        );
                      })
                    )}
                  </CTableBody>
                </CTable>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};

export default Ambassadors;
