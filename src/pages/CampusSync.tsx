import React, { useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CAlert,
  CSpinner,
  CBadge,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CProgress,
  CTooltip,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilSync, cilMap, cilHistory, cilCheckCircle, cilXCircle, cilWarning } from "@coreui/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { campusSyncService, CampusSyncStatus } from "../services/campusSyncService";
import { useTheme } from "../hooks/useTheme";
import { format } from "date-fns";

const CampusSync: React.FC = () => {
  const { theme } = useTheme();
  const queryClient = useQueryClient();
  const [selectedCampus, setSelectedCampus] = useState<CampusSyncStatus | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [syncInProgress, setSyncInProgress] = useState<string | null>(null);
  const [alert, setAlert] = useState<{
    type: "success" | "danger" | "info" | "warning";
    message: string;
  } | null>(null);

  // Fetch campuses with sync status
  const {
    data: campuses = [],
    isLoading: campusesLoading,
    error: campusesError,
  } = useQuery({
    queryKey: ["campuses-sync-status"],
    queryFn: campusSyncService.getCampusesWithSyncStatus,
  });

  // Sync campus mutation
  const syncCampusMutation = useMutation({
    mutationFn: (campusId: string) => campusSyncService.syncCampus(campusId),
    onMutate: (campusId) => {
      setSyncInProgress(campusId);
      setAlert({
        type: "info",
        message: "Sync started. This may take a few minutes...",
      });
    },
    onSuccess: (data) => {
      setSyncInProgress(null);
      queryClient.invalidateQueries({ queryKey: ["campuses-sync-status"] });
      setAlert({
        type: data.sync_status === "completed" ? "success" : "warning",
        message: `Sync ${data.sync_status}. Added: ${data.places_added}, Updated: ${data.places_updated}, Removed: ${data.places_removed}`,
      });
    },
    onError: (error: unknown) => {
      setSyncInProgress(null);
      const errorObj = error as { response?: { data?: { message?: string } }; message?: string };
      setAlert({
        type: "danger",
        message: `Sync failed: ${errorObj.response?.data?.message || errorObj.message || 'Unknown error'}`,
      });
    },
  });

  // Sync all campuses mutation
  const syncAllMutation = useMutation({
    mutationFn: () => campusSyncService.syncAllCampuses(),
    onMutate: () => {
      setSyncInProgress("all");
      setAlert({
        type: "info",
        message: "Syncing all campuses. This may take several minutes...",
      });
    },
    onSuccess: (data) => {
      setSyncInProgress(null);
      queryClient.invalidateQueries({ queryKey: ["campuses-sync-status"] });
      const { summary } = data;
      setAlert({
        type: "success",
        message: `Sync completed for ${summary.total} campuses. Total places: Added ${summary.totalPlacesAdded}, Updated ${summary.totalPlacesUpdated}, Removed ${summary.totalPlacesRemoved}`,
      });
    },
    onError: (error: unknown) => {
      setSyncInProgress(null);
      const errorObj = error as { response?: { data?: { message?: string } }; message?: string };
      setAlert({
        type: "danger",
        message: `Sync failed: ${errorObj.response?.data?.message || errorObj.message || 'Unknown error'}`,
      });
    },
  });

  const getSyncStatusBadge = (status: string | undefined) => {
    if (!status) return <CBadge color="secondary">Never Synced</CBadge>;
    
    switch (status) {
      case "completed":
        return <CBadge color="success">Completed</CBadge>;
      case "failed":
        return <CBadge color="danger">Failed</CBadge>;
      case "partial":
        return <CBadge color="warning">Partial</CBadge>;
      case "in_progress":
        return <CBadge color="info">In Progress</CBadge>;
      default:
        return <CBadge color="secondary">{status}</CBadge>;
    }
  };

  const getCoordinatesBadge = (hasCoordinates: boolean) => {
    if (hasCoordinates) {
      return (
        <CBadge color="success">
          <CIcon icon={cilCheckCircle} size="sm" className="me-1" />
          Configured
        </CBadge>
      );
    }
    return (
      <CBadge color="danger">
        <CIcon icon={cilXCircle} size="sm" className="me-1" />
        Not Set
      </CBadge>
    );
  };

  if (campusesError) {
    return (
      <CAlert color="danger">
        Error loading campuses: {(campusesError as Error).message}
      </CAlert>
    );
  }

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard
            style={{
              backgroundColor: theme.colors.cardBg,
              borderColor: theme.colors.borderColor,
            }}
          >
            <CCardHeader
              style={{
                backgroundColor: theme.colors.cardBg,
                borderColor: theme.colors.borderColor,
                color: theme.colors.bodyColor,
              }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">Campus Sync Management</h4>
                <div>
                  <CButton
                    color="primary"
                    size="sm"
                    className="me-2"
                    onClick={() => syncAllMutation.mutate()}
                    disabled={syncInProgress !== null}
                  >
                    <CIcon icon={cilSync} className="me-2" />
                    Sync All Campuses
                  </CButton>
                  <CButton
                    color="secondary"
                    size="sm"
                    onClick={() => setShowLogsModal(true)}
                  >
                    <CIcon icon={cilHistory} className="me-2" />
                    View Logs
                  </CButton>
                </div>
              </div>
            </CCardHeader>
            <CCardBody>
              {alert && (
                <CAlert
                  color={alert.type}
                  dismissible
                  onClose={() => setAlert(null)}
                >
                  {alert.message}
                </CAlert>
              )}

              {campusesLoading ? (
                <div className="text-center p-4">
                  <CSpinner />
                </div>
              ) : (
                <CTable hover responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Campus Name</CTableHeaderCell>
                      <CTableHeaderCell>Coordinates</CTableHeaderCell>
                      <CTableHeaderCell>Places</CTableHeaderCell>
                      <CTableHeaderCell>Last Sync</CTableHeaderCell>
                      <CTableHeaderCell>Status</CTableHeaderCell>
                      <CTableHeaderCell>API Calls</CTableHeaderCell>
                      <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {campuses.map((campus) => (
                      <CTableRow key={campus._id}>
                        <CTableDataCell>{campus.campus_name}</CTableDataCell>
                        <CTableDataCell>
                          {getCoordinatesBadge(campus.has_coordinates)}
                        </CTableDataCell>
                        <CTableDataCell>{campus.places_count}</CTableDataCell>
                        <CTableDataCell>
                          {campus.last_sync
                            ? format(new Date(campus.last_sync.date), "MMM dd, yyyy HH:mm")
                            : "Never"}
                        </CTableDataCell>
                        <CTableDataCell>
                          {getSyncStatusBadge(campus.last_sync?.status)}
                        </CTableDataCell>
                        <CTableDataCell>
                          {campus.last_sync?.api_calls_used || 0}
                        </CTableDataCell>
                        <CTableDataCell>
                          <CTooltip content="Sync Campus">
                            <CButton
                              color="primary"
                              size="sm"
                              className="me-2"
                              onClick={() => syncCampusMutation.mutate(campus._id)}
                              disabled={!campus.has_coordinates || syncInProgress !== null}
                            >
                              {syncInProgress === campus._id ? (
                                <CSpinner size="sm" />
                              ) : (
                                <CIcon icon={cilSync} />
                              )}
                            </CButton>
                          </CTooltip>
                          <CTooltip content="Preview Boundary">
                            <CButton
                              color="info"
                              size="sm"
                              onClick={() => {
                                setSelectedCampus(campus);
                                setShowPreviewModal(true);
                              }}
                              disabled={!campus.has_coordinates}
                            >
                              <CIcon icon={cilMap} />
                            </CButton>
                          </CTooltip>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              )}

              {syncInProgress === "all" && (
                <div className="mt-3">
                  <p className="text-center mb-2">Syncing all campuses...</p>
                  <CProgress animated value={100} />
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Preview Modal */}
      <CModal
        visible={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        size="xl"
      >
        <CModalHeader>
          <CModalTitle>Campus Boundary Preview</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedCampus && (
            <PreviewModal campusId={selectedCampus._id} />
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowPreviewModal(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Logs Modal */}
      <CModal
        visible={showLogsModal}
        onClose={() => setShowLogsModal(false)}
        size="xl"
      >
        <CModalHeader>
          <CModalTitle>Sync Logs</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <SyncLogsTable />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowLogsModal(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

// Preview component
const PreviewModal: React.FC<{ campusId: string }> = ({ campusId }) => {
  const { data: preview, isLoading, error } = useQuery({
    queryKey: ["campus-preview", campusId],
    queryFn: () => campusSyncService.previewCampusBoundary(campusId),
  });

  if (isLoading) return <CSpinner />;
  if (error) return <CAlert color="danger">Error loading preview</CAlert>;
  if (!preview) return null;

  return (
    <div>
      <h5>{preview.campus_name}</h5>
      <CRow className="mb-3">
        <CCol sm={6}>
          <strong>Area:</strong> {preview.area_acres.toFixed(2)} acres ({preview.area_sqm.toFixed(0)} m²)
        </CCol>
        <CCol sm={6}>
          <strong>Search Points:</strong> {preview.search_points_count}
        </CCol>
      </CRow>
      <CRow>
        <CCol sm={6}>
          <strong>Center:</strong> {preview.center.lat.toFixed(6)}, {preview.center.lng.toFixed(6)}
        </CCol>
        <CCol sm={6}>
          <strong>Bounds:</strong> N: {preview.bounds.north.toFixed(4)}, S: {preview.bounds.south.toFixed(4)}
        </CCol>
      </CRow>
      {/* You can add a map component here to visualize the boundary and search points */}
    </div>
  );
};

// Sync logs table component
const SyncLogsTable: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["sync-logs"],
    queryFn: () => campusSyncService.getSyncLogs({ limit: 50 }),
  });

  if (isLoading) return <CSpinner />;
  if (error) return <CAlert color="danger">Error loading logs</CAlert>;
  if (!data) return null;

  return (
    <CTable hover responsive striped>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell>Date</CTableHeaderCell>
          <CTableHeaderCell>Campus</CTableHeaderCell>
          <CTableHeaderCell>Status</CTableHeaderCell>
          <CTableHeaderCell>Added</CTableHeaderCell>
          <CTableHeaderCell>Updated</CTableHeaderCell>
          <CTableHeaderCell>Removed</CTableHeaderCell>
          <CTableHeaderCell>Duration</CTableHeaderCell>
          <CTableHeaderCell>Error</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {data.logs.map((log) => (
          <CTableRow key={log._id}>
            <CTableDataCell>
              {format(new Date(log.createdAt), "MMM dd HH:mm")}
            </CTableDataCell>
            <CTableDataCell>{log.campus_id.campus_name}</CTableDataCell>
            <CTableDataCell>
              <CBadge
                color={
                  log.sync_status === "completed"
                    ? "success"
                    : log.sync_status === "failed"
                    ? "danger"
                    : "warning"
                }
              >
                {log.sync_status}
              </CBadge>
            </CTableDataCell>
            <CTableDataCell>{log.places_added}</CTableDataCell>
            <CTableDataCell>{log.places_updated}</CTableDataCell>
            <CTableDataCell>{log.places_removed}</CTableDataCell>
            <CTableDataCell>{(log.sync_duration_ms / 1000).toFixed(1)}s</CTableDataCell>
            <CTableDataCell>
              {log.error_message && (
                <CTooltip content={log.error_message}>
                  <CIcon icon={cilWarning} className="text-danger" />
                </CTooltip>
              )}
            </CTableDataCell>
          </CTableRow>
        ))}
      </CTableBody>
    </CTable>
  );
};

export default CampusSync;