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
  CFormSelect,
  CPagination,
  CPaginationItem,
  CSpinner,
  CButtonGroup,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormTextarea,
  CFormLabel,
  CFormCheck,
} from "@coreui/react";
import { useTheme } from "../hooks/useTheme";
import CIcon from "@coreui/icons-react";
import {
  cilDescription,
  cilBan,
  cilCheckCircle,
  cilXCircle,
  cilClock,
} from "@coreui/icons";
import {
  Report,
  ReportFilters,
  BanUserRequest,
  ReportType,
} from "../types/report";
import { reportService } from "../services/reportService";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const Reports: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alert, setAlert] = useState<{
    type: "success" | "danger";
    message: string;
  } | null>(null);

  // Filters
  const [filters, setFilters] = useState<ReportFilters>({
    status: undefined,
    report_type: undefined,
    page: 1,
    limit: 20,
  });

  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  // Selected reports for bulk actions
  const [selectedReports, setSelectedReports] = useState<Set<string>>(
    new Set()
  );

  // Ban modal
  const [banModal, setBanModal] = useState<{
    show: boolean;
    reportId: string | null;
    userId: string | null;
    userName: string;
  }>({
    show: false,
    reportId: null,
    userId: null,
    userName: "",
  });

  const [banForm, setBanForm] = useState<BanUserRequest>({
    ban_duration: undefined,
    ban_reason: "",
    resolve_related_reports: false,
  });

  // Bulk action modal
  const [bulkModal, setBulkModal] = useState({
    show: false,
    action: "" as "resolve" | "dismiss" | "under_review" | "",
  });
  const [bulkNotes, setBulkNotes] = useState("");

  // Fetch reports from API
  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await reportService.getReports(filters);

      setReports(result.reports);
      setPagination(result.pagination);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch reports";
      setError(errorMessage);
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (
    key: keyof ReportFilters,
    value: string | number | undefined
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
      page: key === "page" ? (typeof value === "number" ? value : 1) : 1, // Reset to page 1 when other filters change
    }));
  };

  // Handle report selection
  const handleSelectReport = (reportId: string) => {
    setSelectedReports((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(reportId)) {
        newSet.delete(reportId);
      } else {
        newSet.add(reportId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedReports.size === reports.length) {
      setSelectedReports(new Set());
    } else {
      setSelectedReports(new Set(reports.map((r) => r._id)));
    }
  };

  // Update report status
  const handleUpdateStatus = async (reportId: string, status: string) => {
    try {
      await reportService.updateReportStatus(reportId, {
        status: status as "pending" | "under_review" | "resolved" | "dismissed",
      });
      setAlert({
        type: "success",
        message: "Report status updated successfully",
      });
      fetchReports();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update status";
      setAlert({ type: "danger", message: errorMessage });
    }
  };

  // Ban user
  const handleBanUser = async () => {
    if (!banModal.reportId) return;

    try {
      await reportService.banUserFromReport(banModal.reportId, banForm);
      setAlert({ type: "success", message: "User banned successfully" });
      setBanModal({ show: false, reportId: null, userId: null, userName: "" });
      setBanForm({
        ban_duration: undefined,
        ban_reason: "",
        resolve_related_reports: false,
      });
      fetchReports();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to ban user";
      setAlert({ type: "danger", message: errorMessage });
    }
  };

  // Bulk update
  const handleBulkUpdate = async () => {
    if (!bulkModal.action || selectedReports.size === 0) return;

    try {
      await reportService.bulkUpdateReports({
        report_ids: Array.from(selectedReports),
        action: bulkModal.action,
        admin_notes: bulkNotes,
      });
      setAlert({
        type: "success",
        message: `${selectedReports.size} reports updated successfully`,
      });
      setBulkModal({ show: false, action: "" });
      setBulkNotes("");
      setSelectedReports(new Set());
      fetchReports();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update reports";
      setAlert({ type: "danger", message: errorMessage });
    }
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "warning";
      case "under_review":
        return "info";
      case "resolved":
        return "success";
      case "dismissed":
        return "secondary";
      default:
        return "primary";
    }
  };

  // Get report type color
  const getTypeColor = (type: ReportType) => {
    switch (type) {
      case ReportType.USER:
        return "danger";
      case ReportType.MESSAGE:
        return "warning";
      case ReportType.EVENT:
        return "info";
      case ReportType.IDEA:
        return "success";
      case ReportType.SPACE:
        return "secondary";
      default:
        return "primary";
    }
  };

  // Format reason
  const formatReason = (reason: string) => {
    return reason
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div style={{ padding: "2rem" }}>
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
          📋 Report Management
        </h1>
        <p
          style={{
            margin: 0,
            color: theme.colors.textMuted,
            fontSize: "16px",
            fontWeight: "400",
          }}
        >
          Monitor and manage user reports, violations, and community safety
        </p>
      </div>

      {alert && (
        <CAlert
          color={alert.type}
          dismissible
          onClose={() => setAlert(null)}
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

      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">Reports Management</h4>
                <div className="d-flex gap-2">
                  {selectedReports.size > 0 && (
                    <CButtonGroup>
                      <CButton
                        color="success"
                        size="sm"
                        onClick={() =>
                          setBulkModal({ show: true, action: "resolve" })
                        }
                      >
                        <CIcon icon={cilCheckCircle} className="me-1" />
                        Resolve ({selectedReports.size})
                      </CButton>
                      <CButton
                        color="secondary"
                        size="sm"
                        onClick={() =>
                          setBulkModal({ show: true, action: "dismiss" })
                        }
                      >
                        <CIcon icon={cilXCircle} className="me-1" />
                        Dismiss ({selectedReports.size})
                      </CButton>
                      <CButton
                        color="info"
                        size="sm"
                        onClick={() =>
                          setBulkModal({ show: true, action: "under_review" })
                        }
                      >
                        <CIcon icon={cilClock} className="me-1" />
                        Review ({selectedReports.size})
                      </CButton>
                    </CButtonGroup>
                  )}
                </div>
              </div>
            </CCardHeader>
            <CCardBody>
              {/* Filters */}
              <CRow className="mb-3">
                <CCol md={3}>
                  <CFormSelect
                    value={filters.status || "all"}
                    onChange={(e) =>
                      handleFilterChange("status", e.target.value === "all" ? undefined : e.target.value)
                    }
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="under_review">Under Review</option>
                    <option value="resolved">Resolved</option>
                    <option value="dismissed">Dismissed</option>
                  </CFormSelect>
                </CCol>
                <CCol md={3}>
                  <CFormSelect
                    value={filters.report_type || "all"}
                    onChange={(e) =>
                      handleFilterChange("report_type", e.target.value === "all" ? undefined : e.target.value)
                    }
                  >
                    <option value="all">All Types</option>
                    <option value={ReportType.USER}>User</option>
                    <option value={ReportType.MESSAGE}>Message</option>
                    <option value={ReportType.EVENT}>Event</option>
                    <option value={ReportType.IDEA}>Idea</option>
                    <option value={ReportType.SPACE}>Space</option>
                  </CFormSelect>
                </CCol>
                <CCol md={3}>
                  <CFormSelect
                    value={filters.limit}
                    onChange={(e) =>
                      handleFilterChange("limit", parseInt(e.target.value))
                    }
                  >
                    <option value="10">10 per page</option>
                    <option value="20">20 per page</option>
                    <option value="50">50 per page</option>
                    <option value="100">100 per page</option>
                  </CFormSelect>
                </CCol>
                <CCol md={3}>
                  <CButton
                    color="primary"
                    onClick={fetchReports}
                    disabled={loading}
                  >
                    Refresh
                  </CButton>
                </CCol>
              </CRow>

              {/* Reports Table */}
              {loading ? (
                <div className="text-center p-4">
                  <CSpinner color="primary" />
                </div>
              ) : error ? (
                <CAlert color="danger">{error}</CAlert>
              ) : reports.length === 0 ? (
                <CAlert color="info">
                  No reports found with the current filters.
                </CAlert>
              ) : (
                <>
                  <CTable hover responsive>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>
                          <CFormCheck
                            checked={
                              selectedReports.size === reports.length &&
                              reports.length > 0
                            }
                            onChange={handleSelectAll}
                          />
                        </CTableHeaderCell>
                        <CTableHeaderCell>Type</CTableHeaderCell>
                        <CTableHeaderCell>Reason</CTableHeaderCell>
                        <CTableHeaderCell>Reported By</CTableHeaderCell>
                        <CTableHeaderCell>Date</CTableHeaderCell>
                        <CTableHeaderCell>Status</CTableHeaderCell>
                        <CTableHeaderCell>Actions</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {reports.map((report) => (
                        <CTableRow key={report._id}>
                          <CTableDataCell>
                            <CFormCheck
                              checked={selectedReports.has(report._id)}
                              onChange={() => handleSelectReport(report._id)}
                            />
                          </CTableDataCell>
                          <CTableDataCell>
                            <CBadge color={getTypeColor(report.report_type)}>
                              {report.report_type}
                            </CBadge>
                          </CTableDataCell>
                          <CTableDataCell>
                            <div>
                              <strong>{formatReason(report.reason)}</strong>
                              <br />
                              <small className="text-muted">
                                {report.description.substring(0, 100)}
                                {report.description.length > 100 && "..."}
                              </small>
                            </div>
                          </CTableDataCell>
                          <CTableDataCell>
                            {report.reported_by.first_name}{" "}
                            {report.reported_by.last_name}
                            <br />
                            <small className="text-muted">
                              {report.reported_by.email}
                            </small>
                          </CTableDataCell>
                          <CTableDataCell>
                            {format(new Date(report.createdAt), "MMM dd, yyyy")}
                            <br />
                            <small className="text-muted">
                              {format(new Date(report.createdAt), "HH:mm")}
                            </small>
                          </CTableDataCell>
                          <CTableDataCell>
                            <CBadge color={getStatusColor(report.status)}>
                              {report.status}
                            </CBadge>
                          </CTableDataCell>
                          <CTableDataCell>
                            <CButtonGroup size="sm">
                              <CButton
                                color="info"
                                variant="ghost"
                                onClick={() =>
                                  navigate(`/reports/${report._id}`)
                                }
                                title="View Details"
                              >
                                <CIcon icon={cilDescription} />
                              </CButton>
                              {report.report_type === ReportType.USER &&
                                report.status === "pending" && (
                                  <CButton
                                    color="danger"
                                    variant="ghost"
                                    onClick={() =>
                                      setBanModal({
                                        show: true,
                                        reportId: report._id,
                                        userId: report.reported_item_id,
                                        userName: `User ${report.reported_item_id}`,
                                      })
                                    }
                                    title="Ban User"
                                  >
                                    <CIcon icon={cilBan} />
                                  </CButton>
                                )}
                              {report.status === "pending" && (
                                <>
                                  <CButton
                                    color="success"
                                    variant="ghost"
                                    onClick={() =>
                                      handleUpdateStatus(report._id, "resolved")
                                    }
                                    title="Resolve"
                                  >
                                    <CIcon icon={cilCheckCircle} />
                                  </CButton>
                                  <CButton
                                    color="secondary"
                                    variant="ghost"
                                    onClick={() =>
                                      handleUpdateStatus(
                                        report._id,
                                        "dismissed"
                                      )
                                    }
                                    title="Dismiss"
                                  >
                                    <CIcon icon={cilXCircle} />
                                  </CButton>
                                </>
                              )}
                            </CButtonGroup>
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>

                  {/* Pagination */}
                  {pagination.pages > 1 && (
                    <CPagination align="center" aria-label="Page navigation">
                      <CPaginationItem
                        disabled={pagination.page === 1}
                        onClick={() =>
                          handleFilterChange("page", pagination.page - 1)
                        }
                      >
                        Previous
                      </CPaginationItem>
                      {[...Array(Math.min(5, pagination.pages))].map(
                        (_, index) => {
                          const pageNum = index + 1;
                          return (
                            <CPaginationItem
                              key={pageNum}
                              active={pageNum === pagination.page}
                              onClick={() =>
                                handleFilterChange("page", pageNum)
                              }
                            >
                              {pageNum}
                            </CPaginationItem>
                          );
                        }
                      )}
                      {pagination.pages > 5 && (
                        <CPaginationItem disabled>...</CPaginationItem>
                      )}
                      <CPaginationItem
                        disabled={pagination.page === pagination.pages}
                        onClick={() =>
                          handleFilterChange("page", pagination.page + 1)
                        }
                      >
                        Next
                      </CPaginationItem>
                    </CPagination>
                  )}
                </>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Ban User Modal */}
      <CModal
        visible={banModal.show}
        onClose={() => setBanModal({ ...banModal, show: false })}
      >
        <CModalHeader>
          <CModalTitle>Ban User</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <CFormLabel>Ban Duration</CFormLabel>
            <CFormSelect
              value={banForm.ban_duration?.toString() || "permanent"}
              onChange={(e) =>
                setBanForm({
                  ...banForm,
                  ban_duration: e.target.value === "permanent"
                    ? undefined
                    : parseInt(e.target.value),
                })
              }
            >
              <option value="permanent">Permanent Ban</option>
              <option value="1">1 Day</option>
              <option value="3">3 Days</option>
              <option value="7">7 Days</option>
              <option value="14">14 Days</option>
              <option value="30">30 Days</option>
              <option value="90">90 Days</option>
            </CFormSelect>
          </div>
          <div className="mb-3">
            <CFormLabel>Ban Reason</CFormLabel>
            <CFormTextarea
              rows={3}
              value={banForm.ban_reason}
              onChange={(e) =>
                setBanForm({ ...banForm, ban_reason: e.target.value })
              }
              placeholder="Enter reason for ban..."
            />
          </div>
          <div className="mb-3">
            <CFormCheck
              id="resolveRelated"
              label="Resolve all related reports for this user"
              checked={banForm.resolve_related_reports}
              onChange={(e) =>
                setBanForm({
                  ...banForm,
                  resolve_related_reports: e.target.checked,
                })
              }
            />
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => setBanModal({ ...banModal, show: false })}
          >
            Cancel
          </CButton>
          <CButton color="danger" onClick={handleBanUser}>
            Ban User
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Bulk Action Modal */}
      <CModal
        visible={bulkModal.show}
        onClose={() => setBulkModal({ ...bulkModal, show: false })}
      >
        <CModalHeader>
          <CModalTitle>
            Bulk{" "}
            {bulkModal.action === "resolve"
              ? "Resolve"
              : bulkModal.action === "dismiss"
              ? "Dismiss"
              : "Review"}{" "}
            Reports
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>
            You are about to {bulkModal.action} {selectedReports.size} selected
            reports.
          </p>
          <div className="mb-3">
            <CFormLabel>Admin Notes (Optional)</CFormLabel>
            <CFormTextarea
              rows={3}
              value={bulkNotes}
              onChange={(e) => setBulkNotes(e.target.value)}
              placeholder="Enter notes for this action..."
            />
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => setBulkModal({ ...bulkModal, show: false })}
          >
            Cancel
          </CButton>
          <CButton
            color={
              bulkModal.action === "resolve"
                ? "success"
                : bulkModal.action === "dismiss"
                ? "secondary"
                : "info"
            }
            onClick={handleBulkUpdate}
          >
            {bulkModal.action === "resolve"
              ? "Resolve"
              : bulkModal.action === "dismiss"
              ? "Dismiss"
              : "Mark as Under Review"}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default Reports;
