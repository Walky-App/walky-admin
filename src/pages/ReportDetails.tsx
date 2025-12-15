import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CBadge,
  CAlert,
  CSpinner,
  CListGroup,
  CListGroupItem,
  CAvatar,
  CButtonGroup,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormTextarea,
  CFormLabel,
  CFormSelect,
  CFormCheck,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilArrowLeft,
  cilBan,
  cilClock,
  cilUser,
  cilDescription,
  cilHistory,
} from "@coreui/icons";
import {
  ReportDetails as ReportDetailsType,
  BanUserRequest,
  ReportedUser,
} from "../types/report";
import { reportService } from "../services/reportService";
import { format } from "date-fns";
import { CopyableId } from "../components/CopyableId";

const ReportDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [report, setReport] = useState<ReportDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alert, setAlert] = useState<{
    type: "success" | "danger";
    message: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState("details");

  // Ban modal
  const [banModal, setBanModal] = useState(false);
  const [banForm, setBanForm] = useState<BanUserRequest>({
    ban_duration: undefined,
    ban_reason: "",
    resolve_related_reports: false,
  });

  // Update status modal
  const [statusModal, setStatusModal] = useState(false);
  const [statusForm, setStatusForm] = useState({
    status: "",
    admin_notes: "",
  });

  // Fetch report details
  const fetchReportDetails = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const data = await reportService.getReportDetails(id);
      setReport(data);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch report details";
      setError(errorMessage);
      console.error("Error fetching report details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Update report status
  const handleUpdateStatus = async () => {
    if (!id || !statusForm.status) return;

    try {
      await reportService.updateReportStatus(id, {
        status: statusForm.status as
          | "pending"
          | "under_review"
          | "resolved"
          | "dismissed",
        admin_notes: statusForm.admin_notes,
      });
      setAlert({
        type: "success",
        message: "Report status updated successfully",
      });
      setStatusModal(false);
      setStatusForm({ status: "", admin_notes: "" });
      fetchReportDetails();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update status";
      setAlert({ type: "danger", message: errorMessage });
    }
  };

  // Ban user
  const handleBanUser = async () => {
    if (!id) return;

    try {
      await reportService.banUserFromReport(id, banForm);
      setAlert({ type: "success", message: "User banned successfully" });
      setBanModal(false);
      setBanForm({
        ban_duration: undefined,
        ban_reason: "",
        resolve_related_reports: false,
      });
      fetchReportDetails();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to ban user";
      setAlert({ type: "danger", message: errorMessage });
    }
  };

  // Get status badge color
  const getStatusColor = (status?: string) => {
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
  const getTypeColor = (type?: string) => {
    switch (type) {
      case "user":
        return "danger";
      case "message":
        return "warning";
      case "event":
        return "info";
      case "idea":
        return "success";
      default:
        return "primary";
    }
  };

  // Format reason
  const formatReason = (reason?: string) => {
    if (!reason) return "Unknown";
    return reason
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <CSpinner color="primary" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <CAlert color="danger">
        {error || "Report not found"}
        <br />
        <CButton
          color="primary"
          size="sm"
          className="mt-2"
          onClick={() => navigate("/reports")}
        >
          Back to Reports
        </CButton>
      </CAlert>
    );
  }

  return (
    <>
      {alert && (
        <CAlert color={alert.type} dismissible onClose={() => setAlert(null)}>
          {alert.message}
        </CAlert>
      )}

      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-3">
                  <CButton
                    color="primary"
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/reports")}
                  >
                    <CIcon icon={cilArrowLeft} className="me-1" />
                    Back
                  </CButton>
                  <h4 className="mb-0">Report Details</h4>
                  <CBadge color={getTypeColor(report.report_type)}>
                    {report.report_type}
                  </CBadge>
                  <CBadge color={getStatusColor(report.status)}>
                    {report.status}
                  </CBadge>
                </div>
                <CButtonGroup>
                  {report.report_type === "user" &&
                    report.status !== "resolved" && (
                      <CButton
                        color="danger"
                        size="sm"
                        onClick={() => setBanModal(true)}
                      >
                        <CIcon icon={cilBan} className="me-1" />
                        Ban User
                      </CButton>
                    )}
                  <CButton
                    color="info"
                    size="sm"
                    onClick={() => setStatusModal(true)}
                  >
                    <CIcon icon={cilClock} className="me-1" />
                    Update Status
                  </CButton>
                </CButtonGroup>
              </div>
            </CCardHeader>
            <CCardBody>
              <CNav variant="tabs" role="tablist">
                <CNavItem>
                  <CNavLink
                    active={activeTab === "details"}
                    onClick={() => setActiveTab("details")}
                    style={{ cursor: "pointer" }}
                  >
                    <CIcon icon={cilDescription} className="me-1" />
                    Report Details
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink
                    active={activeTab === "reported"}
                    onClick={() => setActiveTab("reported")}
                    style={{ cursor: "pointer" }}
                  >
                    <CIcon icon={cilUser} className="me-1" />
                    Reported Item
                  </CNavLink>
                </CNavItem>
                {report.relatedReports && report.relatedReports.length > 0 && (
                  <CNavItem>
                    <CNavLink
                      active={activeTab === "related"}
                      onClick={() => setActiveTab("related")}
                      style={{ cursor: "pointer" }}
                    >
                      <CIcon icon={cilHistory} className="me-1" />
                      Related Reports ({report.totalRelatedReports})
                    </CNavLink>
                  </CNavItem>
                )}
              </CNav>

              <CTabContent className="mt-3">
                {/* Report Details Tab */}
                <CTabPane visible={activeTab === "details"}>
                  <CRow>
                    <CCol md={6}>
                      <CCard className="mb-3">
                        <CCardHeader>Report Information</CCardHeader>
                        <CCardBody>
                          <CListGroup flush>
                            <CListGroupItem className="d-flex justify-content-between align-items-center">
                              <strong>Report ID:</strong>
                              <CopyableId id={report._id || ""} />
                            </CListGroupItem>
                            <CListGroupItem className="d-flex justify-content-between">
                              <strong>Type:</strong>
                              <CBadge color={getTypeColor(report.report_type)}>
                                {report.report_type}
                              </CBadge>
                            </CListGroupItem>
                            <CListGroupItem className="d-flex justify-content-between">
                              <strong>Status:</strong>
                              <CBadge color={getStatusColor(report.status)}>
                                {report.status}
                              </CBadge>
                            </CListGroupItem>
                            <CListGroupItem className="d-flex justify-content-between">
                              <strong>Reason:</strong>
                              <span>{formatReason(report.reason)}</span>
                            </CListGroupItem>
                            <CListGroupItem className="d-flex justify-content-between">
                              <strong>Created:</strong>
                              <span>
                                {(report.createdAt || report.created_at) ? format(
                                  new Date(report.createdAt || report.created_at || ""),
                                  "MMM dd, yyyy HH:mm"
                                ) : "Unknown"}
                              </span>
                            </CListGroupItem>
                            {report.resolved_at && (
                              <CListGroupItem className="d-flex justify-content-between">
                                <strong>Resolved:</strong>
                                <span>
                                  {format(
                                    new Date(report.resolved_at),
                                    "MMM dd, yyyy HH:mm"
                                  )}
                                </span>
                              </CListGroupItem>
                            )}
                          </CListGroup>
                        </CCardBody>
                      </CCard>
                    </CCol>

                    <CCol md={6}>
                      {report.reported_by && (
                        <CCard className="mb-3">
                          <CCardHeader>Reported By</CCardHeader>
                          <CCardBody>
                            <div className="d-flex align-items-center mb-3">
                              <CAvatar
                                src={report.reported_by.avatar_url || undefined}
                                color="primary"
                                textColor="white"
                                className="me-3"
                              >
                                {!report.reported_by.avatar_url &&
                                  `${report.reported_by.first_name?.[0]}${report.reported_by.last_name?.[0]}`}
                              </CAvatar>
                              <div>
                                <h6 className="mb-0">
                                  {report.reported_by.first_name}{" "}
                                  {report.reported_by.last_name}
                                </h6>
                                <small className="text-muted">
                                  {report.reported_by.email}
                                </small>
                              </div>
                            </div>
                            {report.school_id && typeof report.school_id === "object" && (
                              <div>
                                <strong>School:</strong> {report.school_id.name}
                              </div>
                            )}
                          </CCardBody>
                        </CCard>
                      )}

                      {report.reviewed_by && (
                        <CCard className="mb-3">
                          <CCardHeader>Reviewed By</CCardHeader>
                          <CCardBody>
                            <div className="d-flex align-items-center">
                              <CAvatar
                                color="success"
                                textColor="white"
                                className="me-3"
                              >
                                {`${report.reviewed_by.first_name?.[0]}${report.reviewed_by.last_name?.[0]}`}
                              </CAvatar>
                              <div>
                                <h6 className="mb-0">
                                  {report.reviewed_by.first_name}{" "}
                                  {report.reviewed_by.last_name}
                                </h6>
                                {report.reviewed_by.email && (
                                  <small className="text-muted">
                                    {report.reviewed_by.email}
                                  </small>
                                )}
                              </div>
                            </div>
                          </CCardBody>
                        </CCard>
                      )}
                    </CCol>

                    <CCol xs={12}>
                      <CCard className="mb-3">
                        <CCardHeader>Description</CCardHeader>
                        <CCardBody>
                          <p className="mb-0">{report.description}</p>
                        </CCardBody>
                      </CCard>
                    </CCol>

                    {report.admin_notes && (
                      <CCol xs={12}>
                        <CCard className="mb-3">
                          <CCardHeader>Admin Notes</CCardHeader>
                          <CCardBody>
                            <p className="mb-0">{report.admin_notes}</p>
                          </CCardBody>
                        </CCard>
                      </CCol>
                    )}
                  </CRow>
                </CTabPane>

                {/* Reported Item Tab */}
                <CTabPane visible={activeTab === "reported"}>
                  {report.report_type === "user" &&
                  report.reportedItem ? (
                    <CCard>
                      <CCardHeader>Reported User</CCardHeader>
                      <CCardBody>
                        <CRow>
                          <CCol md={4} className="text-center">
                            <CAvatar
                              src={
                                (report.reportedItem as ReportedUser)
                                  .avatar_url || undefined
                              }
                              size="xl"
                              color="danger"
                              textColor="white"
                              className="mb-3"
                            >
                              {!(report.reportedItem as ReportedUser)
                                .avatar_url &&
                                `${
                                  (report.reportedItem as ReportedUser)
                                    .first_name?.[0]
                                }${
                                  (report.reportedItem as ReportedUser)
                                    .last_name?.[0]
                                }`}
                            </CAvatar>
                            <h5>
                              {(report.reportedItem as ReportedUser).first_name}{" "}
                              {(report.reportedItem as ReportedUser).last_name}
                            </h5>
                            <p className="text-muted">
                              {(report.reportedItem as ReportedUser).email}
                            </p>
                            {(report.reportedItem as ReportedUser)
                              .is_banned && (
                              <CBadge color="danger" className="mb-2">
                                BANNED
                              </CBadge>
                            )}
                            {(report.reportedItem as ReportedUser)
                              .report_count && (
                              <div>
                                <CBadge color="warning">
                                  {
                                    (report.reportedItem as ReportedUser)
                                      .report_count
                                  }{" "}
                                  Reports
                                </CBadge>
                              </div>
                            )}
                          </CCol>
                          <CCol md={8}>
                            <CListGroup flush>
                              <CListGroupItem className="d-flex justify-content-between align-items-center">
                                <strong>User ID:</strong>
                                <CopyableId
                                  id={(report.reportedItem as ReportedUser)?._id || ""}
                                />
                              </CListGroupItem>
                              {(report.reportedItem as ReportedUser)
                                .profile_bio && (
                                <CListGroupItem>
                                  <strong>Bio:</strong>{" "}
                                  {
                                    (report.reportedItem as ReportedUser)
                                      .profile_bio
                                  }
                                </CListGroupItem>
                              )}
                              {(report.reportedItem as ReportedUser)
                                ?.school_id && typeof (report.reportedItem as ReportedUser)?.school_id === "object" && (
                                <CListGroupItem>
                                  <strong>School:</strong>{" "}
                                  {
                                    ((report.reportedItem as ReportedUser)
                                      ?.school_id as { name?: string })?.name
                                  }
                                </CListGroupItem>
                              )}
                              {(report.reportedItem as ReportedUser)
                                .ban_reason && (
                                <CListGroupItem>
                                  <strong>Ban Reason:</strong>{" "}
                                  {
                                    (report.reportedItem as ReportedUser)
                                      .ban_reason
                                  }
                                </CListGroupItem>
                              )}
                            </CListGroup>
                          </CCol>
                        </CRow>
                      </CCardBody>
                    </CCard>
                  ) : report.reported_item_snapshot ? (
                    <CCard>
                      <CCardHeader>Reported Item Snapshot</CCardHeader>
                      <CCardBody>
                        <pre className="mb-0">
                          {JSON.stringify(
                            report.reported_item_snapshot,
                            null,
                            2
                          )}
                        </pre>
                      </CCardBody>
                    </CCard>
                  ) : (
                    <CAlert color="info">
                      No additional information available for this item.
                    </CAlert>
                  )}
                </CTabPane>

                {/* Related Reports Tab */}
                <CTabPane visible={activeTab === "related"}>
                  {report.relatedReports && report.relatedReports.length > 0 ? (
                    <CListGroup>
                      {report.relatedReports.map((related) => (
                        <CListGroupItem key={related._id}>
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h6>{formatReason(related.reason)}</h6>
                              <p className="mb-1">{related.description}</p>
                              <small className="text-muted">
                                {related.reported_by && typeof related.reported_by === "object" && (
                                  <>Reported by {related.reported_by.first_name}{" "}
                                  {related.reported_by.last_name} on{" "}</>
                                )}
                                {(related.createdAt || related.created_at) ? format(
                                  new Date(related.createdAt || related.created_at || ""),
                                  "MMM dd, yyyy"
                                ) : "Unknown date"}
                              </small>
                            </div>
                            <CBadge color={getStatusColor(related.status)}>
                              {related.status}
                            </CBadge>
                          </div>
                        </CListGroupItem>
                      ))}
                    </CListGroup>
                  ) : (
                    <CAlert color="info">No related reports found.</CAlert>
                  )}
                </CTabPane>
              </CTabContent>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Ban User Modal */}
      <CModal visible={banModal} onClose={() => setBanModal(false)}>
        <CModalHeader>
          <CModalTitle>Ban User</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <CFormLabel>Ban Duration</CFormLabel>
            <CFormSelect
              value={banForm.ban_duration || ""}
              onChange={(e) =>
                setBanForm({
                  ...banForm,
                  ban_duration: e.target.value
                    ? parseInt(e.target.value)
                    : undefined,
                })
              }
            >
              <option value="">Permanent Ban</option>
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
          <CButton color="secondary" onClick={() => setBanModal(false)}>
            Cancel
          </CButton>
          <CButton color="danger" onClick={handleBanUser}>
            Ban User
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Update Status Modal */}
      <CModal visible={statusModal} onClose={() => setStatusModal(false)}>
        <CModalHeader>
          <CModalTitle>Update Report Status</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <CFormLabel>New Status</CFormLabel>
            <CFormSelect
              value={statusForm.status}
              onChange={(e) =>
                setStatusForm({ ...statusForm, status: e.target.value })
              }
            >
              <option value="">Select Status</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="resolved">Resolved</option>
              <option value="dismissed">Dismissed</option>
            </CFormSelect>
          </div>
          <div className="mb-3">
            <CFormLabel>Admin Notes (Optional)</CFormLabel>
            <CFormTextarea
              rows={3}
              value={statusForm.admin_notes}
              onChange={(e) =>
                setStatusForm({ ...statusForm, admin_notes: e.target.value })
              }
              placeholder="Enter notes about this status change..."
            />
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setStatusModal(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleUpdateStatus}>
            Update Status
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default ReportDetails;
