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
import { useTheme } from "../hooks/useTheme";
import CIcon from "@coreui/icons-react";
import {
  cilPlus,
  cilPencil,
  cilTrash,
  cilChevronBottom,
  cilChevronTop,
  cilSync,
} from "@coreui/icons";
import { Campus } from "../types/campus";
import { campusService } from "../services/campusService";
import { campusSyncService } from "../services/campusSyncService";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryClient";
import CampusBoundary from "./CampusBoundary";
import { CampusTableSkeleton } from "../components";
import "../components/SyncButton.css";

const Campuses: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  // Use React Query for fetching campuses
  const {
    data: campuses = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: queryKeys.campuses,
    queryFn: campusService.getAll,
  });

  // Track which campuses are being deleted
  const [deletingCampuses, setDeletingCampuses] = useState<Set<string>>(
    new Set()
  );

  // Track which campuses are being synced
  const [syncingCampuses, setSyncingCampuses] = useState<Set<string>>(
    new Set()
  );

  // Delete campus mutation
  const deleteCampusMutation = useMutation({
    mutationFn: (id: string) => {
      // Add to deleting set when mutation starts
      setDeletingCampuses((prev) => new Set(prev).add(id));
      return campusService.delete(id);
    },
    onSuccess: (_, id) => {
      // Remove from deleting set
      setDeletingCampuses((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      // Invalidate and refetch campuses
      queryClient.invalidateQueries({ queryKey: queryKeys.campuses });
      setAlert({ type: "success", message: "Campus deleted successfully!" });
      setTimeout(() => setAlert(null), 3000);
    },
    onError: (error, id) => {
      // Remove from deleting set on error
      setDeletingCampuses((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      console.error("Failed to delete campus:", error);
      setAlert({
        type: "danger",
        message: "Failed to delete campus. Please try again.",
      });
      setTimeout(() => setAlert(null), 3000);
    },
  });

  // Sync campus places mutation
  const syncCampusMutation = useMutation({
    mutationFn: (id: string) => {
      // Add to syncing set when mutation starts
      setSyncingCampuses((prev) => new Set(prev).add(id));
      return campusSyncService.syncCampus(id);
    },
    onSuccess: (result, id) => {
      // Remove from syncing set
      setSyncingCampuses((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      
      const campus = campuses.find(c => c.id === id);
      const campusName = campus?.campus_name || campus?.name || 'Campus';
      
      if (result.sync_status === 'completed') {
        setAlert({ 
          type: "success", 
          message: `${campusName} places synced successfully! Added: ${result.places_added}, Updated: ${result.places_updated}, Removed: ${result.places_removed}` 
        });
      } else if (result.sync_status === 'partial') {
        setAlert({ 
          type: "success", 
          message: `${campusName} places partially synced. Added: ${result.places_added}, Updated: ${result.places_updated}, Removed: ${result.places_removed}. Some errors occurred.` 
        });
      } else {
        setAlert({ 
          type: "danger", 
          message: `${campusName} places sync failed. Please try again.` 
        });
      }
      setTimeout(() => setAlert(null), 5000);
    },
    onError: (error, id) => {
      // Remove from syncing set on error
      setSyncingCampuses((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      
      const campus = campuses.find(c => c.id === id);
      const campusName = campus?.campus_name || campus?.name || 'Campus';
      
      console.error("Failed to sync campus places:", error);
      setAlert({
        type: "danger",
        message: `Failed to sync ${campusName} places. Please try again.`,
      });
      setTimeout(() => setAlert(null), 3000);
    },
  });

  const [alert, setAlert] = useState<{
    type: "success" | "danger";
    message: string;
  } | null>(null);

  const [expandedGeofenceMap, setExpandedGeofenceMap] = useState<string | null>(
    null
  );

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
      console.error("Failed to load campuses:", error);
      setAlert({
        type: "danger",
        message: "Failed to load campuses. Please try again.",
      });
      setTimeout(() => setAlert(null), 3000);
    }
  }, [error]);

  const handleAddCampus = () => {
    // Navigate to campus view to create a new campus
    navigate("/campuses/campus-view");
  };

  const handleEditCampus = (campus: Campus) => {
    // Use the actual campus ID, not a temporary one
    const campusId = campus.id;

    if (!campusId || campusId.startsWith("temp-")) {
      setAlert({
        type: "danger",
        message:
          "Cannot edit campus: Invalid campus ID. Please refresh the page and try again.",
      });
      setTimeout(() => setAlert(null), 3000);
      return;
    }

    console.log("✏️ Editing campus with ID:", campusId);
    // Pass campus data through navigation state
    navigate("/campuses/campus-view/" + campusId, {
      state: { campusData: campus },
    });
  };

  const handleDeleteCampus = (id: string) => {
    console.log("🗑️ Attempting to delete campus with ID:", id);

    // Don't allow deletion if no valid ID
    if (!id || id.startsWith("temp-")) {
      console.warn("❌ Invalid campus ID for deletion:", id);
      setAlert({
        type: "danger",
        message:
          "Cannot delete campus: Invalid campus ID. Please refresh the page and try again.",
      });
      setTimeout(() => setAlert(null), 3000);
      return;
    }

    if (
      !window.confirm(
        "Are you sure you want to delete this campus? This will also delete all associated geofences."
      )
    ) {
      return;
    }

    console.log("🚀 Calling deleteCampusMutation with ID:", id);
    deleteCampusMutation.mutate(id);
  };

  const handleSyncCampus = (id: string) => {
    console.log("🔄 Attempting to sync campus places with ID:", id);

    // Don't allow sync if no valid ID
    if (!id || id.startsWith("temp-")) {
      console.warn("❌ Invalid campus ID for sync:", id);
      setAlert({
        type: "danger",
        message:
          "Cannot sync campus: Invalid campus ID. Please refresh the page and try again.",
      });
      setTimeout(() => setAlert(null), 3000);
      return;
    }

    const campus = campuses.find(c => c.id === id);
    const campusName = campus?.campus_name || campus?.name || 'Campus';

    if (!window.confirm(
      `Are you sure you want to sync places for ${campusName}? This will fetch the latest places data from Google Places API.`
    )) {
      return;
    }

    console.log("🚀 Calling syncCampusMutation with ID:", id);
    syncCampusMutation.mutate(id);
  };

  const handleToggleGeofenceMap = (campusId: string) => {
    setExpandedGeofenceMap(expandedGeofenceMap === campusId ? null : campusId);
  };

  return (
    <div style={{ padding: '2rem' }}>
      {/* Modern Page Header */}
      <div 
        className="mb-5 dashboard-header"
        style={{
          background: `linear-gradient(135deg, ${theme.colors.primary}15, ${theme.colors.info}10)`,
          borderRadius: "16px",
          padding: "24px 32px",
          border: `1px solid ${theme.colors.borderColor}20`,
          backdropFilter: "blur(10px)",
          boxShadow: theme.isDark 
            ? "0 8px 32px rgba(0,0,0,0.3)" 
            : "0 8px 32px rgba(0,0,0,0.08)",
        }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h1 
              style={{
                fontSize: "28px",
                fontWeight: "700",
                margin: "0 0 8px 0",
                background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.info})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              🏫 Campus Management
            </h1>
            <p 
              style={{
                margin: 0,
                color: theme.colors.textMuted,
                fontSize: "16px",
                fontWeight: "400",
              }}
            >
              Manage university campuses, boundaries, and location data
            </p>
          </div>
          <CButton
            color="primary"
            size="lg"
            onClick={handleAddCampus}
            disabled={loading}
            className="modern-button"
            style={{
              borderRadius: "12px",
              fontWeight: "600",
              padding: "12px 24px",
              boxShadow: `0 4px 12px ${theme.colors.primary}30`,
              transition: "all 0.2s ease",
            }}
          >
            <CIcon icon={cilPlus} className="me-2" />
            Add Campus
          </CButton>
        </div>
      </div>

      <CRow>
        <CCol xs={12}>
          <CCard 
            className="main-chart"
            style={{
              borderRadius: "20px",
              border: "none",
              boxShadow: theme.isDark 
                ? "0 12px 40px rgba(0,0,0,0.3)" 
                : "0 12px 40px rgba(0,0,0,0.08)",
              background: theme.isDark 
                ? `linear-gradient(135deg, ${theme.colors.cardBg}, ${theme.colors.primary}05)`
                : `linear-gradient(135deg, ${theme.colors.cardBg}, ${theme.colors.primary}02)`,
              backdropFilter: "blur(10px)",
            }}
          >
            <CCardHeader 
              style={{
                background: "transparent",
                border: "none",
                padding: "32px 32px 0 32px",
              }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h3 
                    style={{
                      fontSize: "24px",
                      fontWeight: "700",
                      margin: "0 0 8px 0",
                      color: theme.colors.bodyColor,
                    }}
                  >
                    📍 Campus Directory
                  </h3>
                  <p 
                    style={{
                      margin: 0,
                      color: theme.colors.textMuted,
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  >
                    {campuses.length} campus{campuses.length !== 1 ? 'es' : ''} configured
                  </p>
                </div>
              </div>
            </CCardHeader>
            <CCardBody style={{ padding: "32px" }}>
              {alert && (
                <CAlert 
                  color={alert.type} 
                  className="mb-4"
                  style={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: theme.isDark 
                      ? "0 4px 20px rgba(0,0,0,0.2)" 
                      : "0 4px 20px rgba(0,0,0,0.05)",
                  }}
                >
                  {alert.message}
                </CAlert>
              )}

              <div 
                className="table-responsive"
                style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: theme.colors.cardBg,
                  boxShadow: theme.isDark 
                    ? "0 4px 20px rgba(0,0,0,0.2)" 
                    : "0 4px 20px rgba(0,0,0,0.05)",
                }}
              >
                <CTable hover className="mb-0">
                  <CTableHead>
                    <CTableRow 
                      style={{
                        background: theme.isDark 
                          ? `linear-gradient(135deg, ${theme.colors.primary}15, ${theme.colors.info}10)`
                          : `linear-gradient(135deg, ${theme.colors.primary}08, ${theme.colors.info}05)`,
                      }}
                    >
                      <CTableHeaderCell 
                        style={{
                          fontWeight: "600",
                          fontSize: "14px",
                          color: theme.colors.bodyColor,
                          border: "none",
                          padding: "16px 20px",
                        }}
                      >
                        🏫 Campus
                      </CTableHeaderCell>
                      <CTableHeaderCell 
                        style={{
                          fontWeight: "600",
                          fontSize: "14px",
                          color: theme.colors.bodyColor,
                          border: "none",
                          padding: "16px 20px",
                        }}
                      >
                        📍 Location
                      </CTableHeaderCell>
                      <CTableHeaderCell 
                        style={{
                          fontWeight: "600",
                          fontSize: "14px",
                          color: theme.colors.bodyColor,
                          border: "none",
                          padding: "16px 20px",
                        }}
                      >
                        🏠 Address
                      </CTableHeaderCell>
                      <CTableHeaderCell 
                        style={{
                          fontWeight: "600",
                          fontSize: "14px",
                          color: theme.colors.bodyColor,
                          border: "none",
                          padding: "16px 20px",
                          textAlign: "center",
                        }}
                      >
                        ⚡ Status
                      </CTableHeaderCell>
                      <CTableHeaderCell 
                        style={{
                          fontWeight: "600",
                          fontSize: "14px",
                          color: theme.colors.bodyColor,
                          border: "none",
                          padding: "16px 20px",
                          textAlign: "center",
                        }}
                      >
                        🔧 Actions
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {loading ? (
                      <CampusTableSkeleton rows={5} />
                    ) : campuses.length === 0 ? (
                      <CTableRow>
                        <CTableDataCell
                          colSpan={5}
                          className="text-center py-5"
                          style={{
                            border: "none",
                            padding: "60px 20px",
                          }}
                        >
                          <div>
                            <div
                              style={{ 
                                fontSize: "64px", 
                                marginBottom: "24px",
                                opacity: 0.8,
                              }}
                            >
                              🏫
                            </div>
                            <h4
                              style={{ 
                                marginBottom: "12px", 
                                color: theme.colors.bodyColor,
                                fontWeight: "600",
                              }}
                            >
                              No Campuses Found
                            </h4>
                            <p
                              style={{ 
                                marginBottom: "32px", 
                                color: theme.colors.textMuted,
                                fontSize: "16px",
                              }}
                            >
                              Get started by adding your first campus location
                            </p>
                            <CButton
                              color="primary"
                              size="lg"
                              onClick={handleAddCampus}
                              disabled={loading}
                              className="modern-button"
                              style={{
                                borderRadius: "12px",
                                fontWeight: "600",
                                padding: "12px 32px",
                                boxShadow: `0 4px 12px ${theme.colors.primary}30`,
                              }}
                            >
                              <CIcon icon={cilPlus} className="me-2" />
                              Add Your First Campus
                            </CButton>
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    ) : (
                      campuses.map((campus, index) => {
                        // Use campus.id if available, otherwise create a unique fallback
                        const campusId = campus.id || `temp-${index}`;
                        const campusKey = `row-${campusId}`;

                        // Check if this campus is being deleted or synced
                        const isBeingDeleted = deletingCampuses.has(campusId);
                        const isBeingSynced = syncingCampuses.has(campusId);

                        return (
                          <React.Fragment key={campusKey}>
                            <CTableRow
                              style={{
                                ...(isBeingDeleted
                                  ? {
                                      position: "relative",
                                      opacity: 0.5,
                                      pointerEvents: "none",
                                    }
                                  : {
                                      cursor: "pointer",
                                    }),
                              }}
                              onClick={() => handleToggleGeofenceMap(campusId)}
                              title="Click to view campus boundary"
                            >
                              {/* Skeleton overlay for deleting campuses */}
                              {isBeingDeleted && (
                                <CTableDataCell
                                  colSpan={5}
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
                                  {campus.image_url &&
                                  campus.image_url !== "" &&
                                  !campus.image_url.includes("placeholder") ? (
                                    <img
                                      src={campus.image_url}
                                      alt={`${
                                        campus.campus_name || campus.name
                                      } logo`}
                                      style={{
                                        width: "40px",
                                        height: "40px",
                                        objectFit: "contain",
                                        marginRight: "12px",
                                        borderRadius: "8px",
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
                                        borderRadius: "8px",
                                        fontSize: "18px",
                                        border:
                                          "1px solid var(--cui-border-color)",
                                      }}
                                    >
                                      🏫
                                    </div>
                                  )}
                                  <div>
                                    <div
                                      className="fw-semibold d-flex align-items-center"
                                      style={{
                                        color: "var(--cui-primary)",
                                        textDecoration: "none",
                                      }}
                                    >
                                      <CIcon
                                        icon={
                                          expandedGeofenceMap === campusId
                                            ? cilChevronTop
                                            : cilChevronBottom
                                        }
                                        size="sm"
                                        className="me-2"
                                        style={{
                                          transition: "transform 0.2s ease",
                                          color: "var(--cui-primary)",
                                        }}
                                      />
                                      {campus.campus_name || campus.name}
                                    </div>
                                    <small className="text-muted">
                                      ID: {campus.id?.substring(0, 8)}...
                                    </small>
                                  </div>
                                </div>
                              </CTableDataCell>
                              <CTableDataCell className="location-cell">
                                {campus.city && campus.state
                                  ? `${campus.city}, ${campus.state}`
                                  : campus.location}
                              </CTableDataCell>
                              <CTableDataCell className="address-cell">
                                <div title={campus.address}>
                                  {campus.address?.length > 40
                                    ? `${campus.address.substring(0, 40)}...`
                                    : campus.address}
                                </div>
                              </CTableDataCell>
                              <CTableDataCell className="status-cell">
                                <CBadge
                                  color={
                                    campus.is_active !== false
                                      ? "success"
                                      : "secondary"
                                  }
                                >
                                  {campus.is_active !== false
                                    ? "Active"
                                    : "Inactive"}
                                </CBadge>
                              </CTableDataCell>
                              <CTableDataCell 
                                style={{
                                  border: "none",
                                  padding: "16px 20px",
                                  textAlign: "center",
                                }}
                              >
                                <div className="d-flex justify-content-center gap-2">
                                  <CButton
                                    color="info"
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSyncCampus(
                                        campus.id || `temp-${index}`
                                      );
                                    }}
                                    disabled={
                                      loading || 
                                      syncCampusMutation.isPending || 
                                      isBeingSynced ||
                                      isBeingDeleted
                                    }
                                    title="Sync Places"
                                    style={{
                                      borderRadius: "8px",
                                      fontWeight: "500",
                                      padding: "6px 12px",
                                      border: `1px solid ${theme.colors.info}40`,
                                      backgroundColor: `${theme.colors.info}10`,
                                      color: theme.colors.info,
                                      transition: "all 0.2s ease",
                                    }}
                                  >
                                    <CIcon 
                                      icon={cilSync} 
                                      size="sm" 
                                      className={isBeingSynced ? "fa-spin" : ""}
                                      style={{
                                        animation: isBeingSynced ? "spin 1s linear infinite" : "none"
                                      }}
                                    />
                                  </CButton>
                                  <CButton
                                    color="primary"
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditCampus(campus);
                                    }}
                                    disabled={loading || isBeingSynced || isBeingDeleted}
                                    title="Edit Campus"
                                    style={{
                                      borderRadius: "8px",
                                      fontWeight: "500",
                                      padding: "6px 12px",
                                      border: `1px solid ${theme.colors.primary}40`,
                                      backgroundColor: `${theme.colors.primary}10`,
                                      color: theme.colors.primary,
                                      transition: "all 0.2s ease",
                                    }}
                                  >
                                    <CIcon icon={cilPencil} size="sm" />
                                  </CButton>
                                  <CButton
                                    color="danger"
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteCampus(
                                        campus.id || `temp-${index}`
                                      );
                                    }}
                                    disabled={
                                      loading || 
                                      deleteCampusMutation.isPending ||
                                      isBeingSynced ||
                                      isBeingDeleted
                                    }
                                    title="Delete Campus"
                                    style={{
                                      borderRadius: "8px",
                                      fontWeight: "500",
                                      padding: "6px 12px",
                                      border: `1px solid ${theme.colors.danger}40`,
                                      backgroundColor: `${theme.colors.danger}10`,
                                      color: theme.colors.danger,
                                      transition: "all 0.2s ease",
                                    }}
                                  >
                                    <CIcon icon={cilTrash} size="sm" />
                                  </CButton>
                                </div>
                              </CTableDataCell>
                            </CTableRow>

                            {expandedGeofenceMap === campusId && (
                              <CTableRow key={`${campusKey}-geofence`}>
                                <CTableDataCell colSpan={5}>
                                  <div
                                    style={{
                                      height: "800px",
                                      border: "1px solid #dee2e6",
                                      borderRadius: "4px",
                                      overflow: "hidden",
                                    }}
                                  >
                                    <CampusBoundary
                                      readOnly={true}
                                      initialBoundaryData={
                                        campus.coordinates
                                          ? {
                                              geometry: {
                                                type: campus.coordinates.type,
                                                coordinates:
                                                  campus.coordinates
                                                    .coordinates,
                                              },
                                            }
                                          : null
                                      }
                                      onBoundaryChange={() => {
                                        // Read-only mode, no changes allowed
                                      }}
                                    />
                                  </div>
                                </CTableDataCell>
                              </CTableRow>
                            )}
                          </React.Fragment>
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

export default Campuses;
