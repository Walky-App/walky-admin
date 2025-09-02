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
  CFormInput,
  CPagination,
  CPaginationItem,
  CSpinner,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormTextarea,
  CFormLabel,
  CAvatar,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CListGroup,
  CListGroupItem,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilBan,
  cilCheckCircle,
  cilHistory,
  cilSearch,
  cilReload,
} from "@coreui/icons";
import { BannedUser, UserBanHistory } from "../types/report";
import { reportService } from "../services/reportService";
import { format, formatDistanceToNow, isPast } from "date-fns";

const BannedUsers: React.FC = () => {
  const [bannedUsers, setBannedUsers] = useState<BannedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ type: "success" | "danger"; message: string } | null>(null);
  
  // Search and pagination
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });
  
  // Unban modal
  const [unbanModal, setUnbanModal] = useState<{
    show: boolean;
    userId: string | null;
    userName: string;
  }>({
    show: false,
    userId: null,
    userName: "",
  });
  const [unbanReason, setUnbanReason] = useState("");
  
  // Ban history modal
  const [historyModal, setHistoryModal] = useState<{
    show: boolean;
    userId: string | null;
    userName: string;
  }>({
    show: false,
    userId: null,
    userName: "",
  });
  const [banHistory, setBanHistory] = useState<UserBanHistory | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [activeTab, setActiveTab] = useState("history");

  // Fetch banned users
  const fetchBannedUsers = async (page = 1) => {
    try {
      setLoading(true);
      const response = await reportService.getBannedUsers({
        page,
        limit: 20,
        search: search || undefined,
      });
      setBannedUsers(response.users);
      setPagination(response.pagination);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch banned users";
      setError(errorMessage);
      console.error("Error fetching banned users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBannedUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle search
  const handleSearch = () => {
    fetchBannedUsers(1);
  };

  // Handle unban
  const handleUnban = async () => {
    if (!unbanModal.userId) return;
    
    try {
      await reportService.unbanUser(unbanModal.userId, {
        unban_reason: unbanReason || undefined,
      });
      setAlert({ type: "success", message: "User unbanned successfully" });
      setUnbanModal({ show: false, userId: null, userName: "" });
      setUnbanReason("");
      fetchBannedUsers(pagination.page);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to unban user";
      setAlert({ type: "danger", message: errorMessage });
    }
  };

  // Fetch ban history
  const fetchBanHistory = async (userId: string) => {
    try {
      setLoadingHistory(true);
      const history = await reportService.getUserBanHistory(userId);
      setBanHistory(history);
    } catch (err) {
      console.error("Error fetching ban history:", err);
      setAlert({ type: "danger", message: "Failed to fetch ban history" });
    } finally {
      setLoadingHistory(false);
    }
  };

  // Handle view history
  const handleViewHistory = (user: BannedUser) => {
    setHistoryModal({
      show: true,
      userId: user._id,
      userName: `${user.first_name} ${user.last_name}`,
    });
    setActiveTab("history");
    fetchBanHistory(user._id);
  };

  // Check if ban has expired
  const isBanExpired = (expiresAt?: string) => {
    if (!expiresAt) return false;
    return isPast(new Date(expiresAt));
  };

  // Format ban duration
  const formatBanDuration = (duration?: number, expiresAt?: string) => {
    if (!duration) return "Permanent";
    if (expiresAt && isBanExpired(expiresAt)) return "Expired";
    return `${duration} days`;
  };

  // Get remaining time
  const getRemainingTime = (expiresAt?: string) => {
    if (!expiresAt) return "Permanent ban";
    const expiryDate = new Date(expiresAt);
    if (isPast(expiryDate)) return "Ban expired";
    return `Expires ${formatDistanceToNow(expiryDate, { addSuffix: true })}`;
  };

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
                <h4 className="mb-0">Banned Users</h4>
                <div className="d-flex gap-2">
                  <CFormInput
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    style={{ width: "250px" }}
                  />
                  <CButton color="primary" onClick={handleSearch}>
                    <CIcon icon={cilSearch} />
                  </CButton>
                  <CButton color="secondary" onClick={() => fetchBannedUsers(pagination.page)}>
                    <CIcon icon={cilReload} />
                  </CButton>
                </div>
              </div>
            </CCardHeader>
            <CCardBody>
              {loading ? (
                <div className="text-center p-4">
                  <CSpinner color="primary" />
                </div>
              ) : error ? (
                <CAlert color="danger">{error}</CAlert>
              ) : bannedUsers.length === 0 ? (
                <CAlert color="info">No banned users found.</CAlert>
              ) : (
                <>
                  <CTable hover responsive>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>User</CTableHeaderCell>
                        <CTableHeaderCell>Ban Date</CTableHeaderCell>
                        <CTableHeaderCell>Duration</CTableHeaderCell>
                        <CTableHeaderCell>Reason</CTableHeaderCell>
                        <CTableHeaderCell>Banned By</CTableHeaderCell>
                        <CTableHeaderCell>Reports</CTableHeaderCell>
                        <CTableHeaderCell>Actions</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {bannedUsers.map((user) => (
                        <CTableRow key={user._id}>
                          <CTableDataCell>
                            <div className="d-flex align-items-center">
                              <CAvatar
                                src={user.avatar_url || undefined}
                                color="danger"
                                textColor="white"
                                size="sm"
                                className="me-2"
                              >
                                {!user.avatar_url && `${user.first_name?.[0]}${user.last_name?.[0]}`}
                              </CAvatar>
                              <div>
                                <div>{`${user.first_name} ${user.last_name}`}</div>
                                <small className="text-muted">{user.email}</small>
                              </div>
                            </div>
                          </CTableDataCell>
                          <CTableDataCell>
                            {format(new Date(user.ban_date), "MMM dd, yyyy")}
                            <br />
                            <small className="text-muted">
                              {format(new Date(user.ban_date), "HH:mm")}
                            </small>
                          </CTableDataCell>
                          <CTableDataCell>
                            <div>
                              <CBadge
                                color={
                                  !user.ban_duration
                                    ? "danger"
                                    : isBanExpired(user.ban_expires_at)
                                    ? "secondary"
                                    : "warning"
                                }
                              >
                                {formatBanDuration(user.ban_duration, user.ban_expires_at)}
                              </CBadge>
                            </div>
                            <small className="text-muted">
                              {getRemainingTime(user.ban_expires_at)}
                            </small>
                          </CTableDataCell>
                          <CTableDataCell>
                            <div style={{ maxWidth: "200px" }}>
                              {user.ban_reason || "No reason provided"}
                            </div>
                          </CTableDataCell>
                          <CTableDataCell>
                            {user.banned_by ? (
                              <div>
                                {user.banned_by.first_name} {user.banned_by.last_name}
                              </div>
                            ) : (
                              <span className="text-muted">System</span>
                            )}
                          </CTableDataCell>
                          <CTableDataCell>
                            {user.report_count ? (
                              <CBadge color="warning">{user.report_count}</CBadge>
                            ) : (
                              <span className="text-muted">0</span>
                            )}
                          </CTableDataCell>
                          <CTableDataCell>
                            <CButton
                              color="success"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setUnbanModal({
                                  show: true,
                                  userId: user._id,
                                  userName: `${user.first_name} ${user.last_name}`,
                                })
                              }
                              title="Unban User"
                            >
                              <CIcon icon={cilCheckCircle} />
                            </CButton>
                            <CButton
                              color="info"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewHistory(user)}
                              title="View History"
                            >
                              <CIcon icon={cilHistory} />
                            </CButton>
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
                        onClick={() => fetchBannedUsers(pagination.page - 1)}
                      >
                        Previous
                      </CPaginationItem>
                      {[...Array(Math.min(5, pagination.pages))].map((_, index) => {
                        const pageNum = index + 1;
                        return (
                          <CPaginationItem
                            key={pageNum}
                            active={pageNum === pagination.page}
                            onClick={() => fetchBannedUsers(pageNum)}
                          >
                            {pageNum}
                          </CPaginationItem>
                        );
                      })}
                      {pagination.pages > 5 && (
                        <CPaginationItem disabled>...</CPaginationItem>
                      )}
                      <CPaginationItem
                        disabled={pagination.page === pagination.pages}
                        onClick={() => fetchBannedUsers(pagination.page + 1)}
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

      {/* Unban Modal */}
      <CModal visible={unbanModal.show} onClose={() => setUnbanModal({ ...unbanModal, show: false })}>
        <CModalHeader>
          <CModalTitle>Unban User</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>Are you sure you want to unban <strong>{unbanModal.userName}</strong>?</p>
          <div className="mb-3">
            <CFormLabel>Reason for Unbanning (Optional)</CFormLabel>
            <CFormTextarea
              rows={3}
              value={unbanReason}
              onChange={(e) => setUnbanReason(e.target.value)}
              placeholder="Enter reason for unbanning..."
            />
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => setUnbanModal({ ...unbanModal, show: false })}
          >
            Cancel
          </CButton>
          <CButton color="success" onClick={handleUnban}>
            Unban User
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Ban History Modal */}
      <CModal
        visible={historyModal.show}
        onClose={() => setHistoryModal({ ...historyModal, show: false })}
        size="lg"
      >
        <CModalHeader>
          <CModalTitle>Ban History - {historyModal.userName}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {loadingHistory ? (
            <div className="text-center p-4">
              <CSpinner color="primary" />
            </div>
          ) : banHistory ? (
            <>
              <CNav variant="tabs" role="tablist" className="mb-3">
                <CNavItem>
                  <CNavLink
                    active={activeTab === "history"}
                    onClick={() => setActiveTab("history")}
                    style={{ cursor: "pointer" }}
                  >
                    <CIcon icon={cilHistory} className="me-1" />
                    Ban History ({banHistory.ban_history?.length || 0})
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink
                    active={activeTab === "reports"}
                    onClick={() => setActiveTab("reports")}
                    style={{ cursor: "pointer" }}
                  >
                    <CIcon icon={cilBan} className="me-1" />
                    Reports ({banHistory.reports?.length || 0})
                  </CNavLink>
                </CNavItem>
              </CNav>

              <CTabContent>
                <CTabPane visible={activeTab === "history"}>
                  {banHistory.ban_history && banHistory.ban_history.length > 0 ? (
                    <CListGroup>
                      {banHistory.ban_history.map((ban, index) => (
                        <CListGroupItem key={index}>
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h6>
                                {ban.duration ? `${ban.duration} Day Ban` : "Permanent Ban"}
                              </h6>
                              <p className="mb-1">
                                <strong>Reason:</strong> {ban.reason}
                              </p>
                              <small className="text-muted">
                                Banned on {format(new Date(ban.banned_at), "MMM dd, yyyy HH:mm")}
                                {ban.banned_by && (
                                  <> by {ban.banned_by.first_name} {ban.banned_by.last_name}</>
                                )}
                              </small>
                              {ban.unbanned_at && (
                                <div className="mt-2">
                                  <CBadge color="success">Unbanned</CBadge>
                                  <small className="text-muted ms-2">
                                    on {format(new Date(ban.unbanned_at), "MMM dd, yyyy HH:mm")}
                                    {ban.unbanned_by && (
                                      <> by {ban.unbanned_by.first_name} {ban.unbanned_by.last_name}</>
                                    )}
                                  </small>
                                  {ban.unban_reason && (
                                    <p className="mb-0 mt-1">
                                      <small>Unban reason: {ban.unban_reason}</small>
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                            <CBadge color={ban.unbanned_at ? "success" : "danger"}>
                              {ban.unbanned_at ? "Lifted" : "Active"}
                            </CBadge>
                          </div>
                        </CListGroupItem>
                      ))}
                    </CListGroup>
                  ) : (
                    <CAlert color="info">No ban history found.</CAlert>
                  )}
                </CTabPane>

                <CTabPane visible={activeTab === "reports"}>
                  {banHistory.reports && banHistory.reports.length > 0 ? (
                    <CListGroup>
                      {banHistory.reports.map((report) => (
                        <CListGroupItem key={report._id}>
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h6>
                                {report.reason
                                  .split("_")
                                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                                  .join(" ")}
                              </h6>
                              <p className="mb-1">{report.description}</p>
                              <small className="text-muted">
                                Reported by {report.reported_by.first_name}{" "}
                                {report.reported_by.last_name} on{" "}
                                {format(new Date(report.createdAt), "MMM dd, yyyy")}
                              </small>
                            </div>
                            <CBadge
                              color={
                                report.status === "resolved"
                                  ? "success"
                                  : report.status === "dismissed"
                                  ? "secondary"
                                  : report.status === "under_review"
                                  ? "info"
                                  : "warning"
                              }
                            >
                              {report.status}
                            </CBadge>
                          </div>
                        </CListGroupItem>
                      ))}
                    </CListGroup>
                  ) : (
                    <CAlert color="info">No reports found.</CAlert>
                  )}
                </CTabPane>
              </CTabContent>
            </>
          ) : (
            <CAlert color="danger">Failed to load ban history.</CAlert>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => setHistoryModal({ ...historyModal, show: false })}
          >
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default BannedUsers;