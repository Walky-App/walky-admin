import React, { useState, useEffect, useCallback } from "react";
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
  CFormCheck,
  CAvatar,
  CTooltip,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilLockUnlocked,
  cilLockLocked,
  cilReload,
  cilWarning,
} from "@coreui/icons";
import { format, formatDistanceToNow } from "date-fns";
import { lockedUsersService } from "../services/lockedUsersService";

interface LockedUser {
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
  is_banned: boolean;
  ban_date: string;
  ban_expires_at?: string;
  ban_reason: string;
  campus_id?: {
    _id: string;
    name?: string;
    campus_name?: string;
  };
  school_id?: {
    _id: string;
    name?: string;
    school_name?: string;
  };
  recentFailedAttempts: Array<{
    timestamp: string;
    ip_address: string;
    device_info?: string;
  }>;
  isExpired: boolean;
}

interface UnlockStats {
  totalLocked: number;
  lockedToday: number;
  lockedThisWeek: number;
  expiredLocks: number;
  recentUnlocks: number;
  timestamp: string;
}

const LockedUsers: React.FC = () => {
  const [lockedUsers, setLockedUsers] = useState<LockedUser[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [showBulkUnlockModal, setShowBulkUnlockModal] = useState(false);
  const [userToUnlock, setUserToUnlock] = useState<LockedUser | null>(null);
  const [unlockReason, setUnlockReason] = useState("Manual unlock by admin");
  const [clearAttempts, setClearAttempts] = useState(true);
  const [stats, setStats] = useState<UnlockStats | null>(null);

  const fetchLockedUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await lockedUsersService.getLockedUsers({
        page: currentPage,
        limit: 20,
        search: searchTerm,
      });
      setLockedUsers(response.data);
      setTotalPages(response.pagination.pages);
      setTotalUsers(response.pagination.total);
    } catch (err) {
      setError((err as Error).message || "Failed to fetch locked users");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await lockedUsersService.getUnlockStats();
      setStats(response.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  }, []);

  useEffect(() => {
    fetchLockedUsers();
    fetchStats();
  }, [fetchLockedUsers, fetchStats]);

  const handleUnlockUser = async () => {
    if (!userToUnlock) return;

    setLoading(true);
    setError(null);
    try {
      await lockedUsersService.unlockUser(userToUnlock._id, {
        reason: unlockReason,
        clearAttempts,
      });
      setSuccess(`Successfully unlocked ${userToUnlock.first_name} ${userToUnlock.last_name}`);
      setShowUnlockModal(false);
      setUserToUnlock(null);
      fetchLockedUsers();
      fetchStats();
    } catch (err) {
      setError((err as Error).message || "Failed to unlock user");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkUnlock = async () => {
    if (selectedUsers.length === 0) return;

    setLoading(true);
    setError(null);
    try {
      await lockedUsersService.bulkUnlockUsers({
        userIds: selectedUsers,
        reason: unlockReason,
        clearAttempts,
      });
      setSuccess(`Successfully unlocked ${selectedUsers.length} users`);
      setShowBulkUnlockModal(false);
      setSelectedUsers([]);
      fetchLockedUsers();
      fetchStats();
    } catch (err) {
      setError((err as Error).message || "Failed to unlock users");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === lockedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(lockedUsers.map((user) => user._id));
    }
  };

  const openUnlockModal = (user: LockedUser) => {
    setUserToUnlock(user);
    setUnlockReason("Manual unlock by admin");
    setClearAttempts(true);
    setShowUnlockModal(true);
  };

  const openBulkUnlockModal = () => {
    setUnlockReason("Bulk unlock by admin");
    setClearAttempts(true);
    setShowBulkUnlockModal(true);
  };

  const formatDate = (date: string) => {
    return format(new Date(date), "MMM dd, yyyy HH:mm");
  };

  const getStatusBadge = (user: LockedUser) => {
    if (user.isExpired) {
      return <CBadge color="warning">Lock Expired</CBadge>;
    }
    if (user.ban_expires_at) {
      return (
        <CBadge color="info">
          Expires {formatDistanceToNow(new Date(user.ban_expires_at), { addSuffix: true })}
        </CBadge>
      );
    }
    return <CBadge color="danger">Locked</CBadge>;
  };

  return (
    <>
      {/* Stats Cards */}
      {stats && (
        <CRow className="mb-4">
          <CCol sm={6} lg={3}>
            <CCard className="text-white bg-danger">
              <CCardBody className="pb-0">
                <div className="text-value-lg">{stats.totalLocked}</div>
                <div>Total Locked</div>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol sm={6} lg={3}>
            <CCard className="text-white bg-warning">
              <CCardBody className="pb-0">
                <div className="text-value-lg">{stats.lockedToday}</div>
                <div>Locked Today</div>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol sm={6} lg={3}>
            <CCard className="text-white bg-info">
              <CCardBody className="pb-0">
                <div className="text-value-lg">{stats.lockedThisWeek}</div>
                <div>Locked This Week</div>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol sm={6} lg={3}>
            <CCard className="text-white bg-secondary">
              <CCardBody className="pb-0">
                <div className="text-value-lg">{stats.expiredLocks}</div>
                <div>Expired Locks</div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      )}

      <CCard>
        <CCardHeader>
          <CRow className="align-items-center">
            <CCol md={6}>
              <h4 className="mb-0">
                <CIcon icon={cilLockLocked} className="me-2" />
                Locked Users
              </h4>
            </CCol>
            <CCol md={6} className="text-end">
              <CButton
                color="success"
                size="sm"
                className="me-2"
                onClick={openBulkUnlockModal}
                disabled={selectedUsers.length === 0}
              >
                <CIcon icon={cilLockUnlocked} className="me-1" />
                Unlock Selected ({selectedUsers.length})
              </CButton>
              <CButton
                color="primary"
                size="sm"
                onClick={() => {
                  fetchLockedUsers();
                  fetchStats();
                }}
                disabled={loading}
              >
                <CIcon icon={cilReload} className="me-1" />
                Refresh
              </CButton>
            </CCol>
          </CRow>
        </CCardHeader>
        <CCardBody>
          {error && (
            <CAlert color="danger" dismissible onClose={() => setError(null)}>
              {error}
            </CAlert>
          )}
          {success && (
            <CAlert color="success" dismissible onClose={() => setSuccess(null)}>
              {success}
            </CAlert>
          )}

          <CRow className="mb-3">
            <CCol md={6}>
              <CFormInput
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-2"
              />
            </CCol>
            <CCol md={6} className="text-end">
              <small className="text-muted">
                Showing {lockedUsers.length} of {totalUsers} locked users
              </small>
            </CCol>
          </CRow>

          {loading && (
            <div className="text-center py-5">
              <CSpinner color="primary" />
            </div>
          )}

          {!loading && lockedUsers.length === 0 && (
            <CAlert color="info">No locked users found</CAlert>
          )}

          {!loading && lockedUsers.length > 0 && (
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>
                    <CFormCheck
                      checked={selectedUsers.length === lockedUsers.length}
                      onChange={handleSelectAll}
                    />
                  </CTableHeaderCell>
                  <CTableHeaderCell>User</CTableHeaderCell>
                  <CTableHeaderCell>Email</CTableHeaderCell>
                  <CTableHeaderCell>School/Campus</CTableHeaderCell>
                  <CTableHeaderCell>Locked Since</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Failed Attempts</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {lockedUsers.map((user) => (
                  <CTableRow key={user._id}>
                    <CTableDataCell>
                      <CFormCheck
                        checked={selectedUsers.includes(user._id)}
                        onChange={() => handleSelectUser(user._id)}
                      />
                    </CTableDataCell>
                    <CTableDataCell>
                      <div className="d-flex align-items-center">
                        <CAvatar
                          size="sm"
                          className="me-2"
                          color="secondary"
                        >
                          {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
                        </CAvatar>
                        {user.first_name} {user.last_name}
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>{user.email}</CTableDataCell>
                    <CTableDataCell>
                      <div>
                        {user.school_id && (
                          <small className="d-block">
                            {user.school_id.name || user.school_id.school_name || 'Unknown School'}
                          </small>
                        )}
                        {user.campus_id && (
                          <small className="text-muted">
                            {user.campus_id.name || user.campus_id.campus_name || 'Unknown Campus'}
                          </small>
                        )}
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      {formatDate(user.ban_date)}
                    </CTableDataCell>
                    <CTableDataCell>
                      {getStatusBadge(user)}
                    </CTableDataCell>
                    <CTableDataCell>
                      <CTooltip
                        content={
                          <div>
                            {user.recentFailedAttempts.slice(0, 3).map((attempt, idx) => (
                              <div key={idx} className="mb-1">
                                <small>
                                  {format(new Date(attempt.timestamp), "MMM dd HH:mm")}
                                  <br />
                                  IP: {attempt.ip_address}
                                  {attempt.device_info && (
                                    <>
                                      <br />
                                      Device: {attempt.device_info}
                                    </>
                                  )}
                                </small>
                              </div>
                            ))}
                          </div>
                        }
                      >
                        <CBadge color="danger" className="cursor-pointer">
                          {user.recentFailedAttempts.length} attempts
                        </CBadge>
                      </CTooltip>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CButton
                        color="success"
                        size="sm"
                        onClick={() => openUnlockModal(user)}
                      >
                        <CIcon icon={cilLockUnlocked} className="me-1" />
                        Unlock
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          )}

          {totalPages > 1 && (
            <CPagination align="center" className="mt-3">
              <CPaginationItem
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              >
                Previous
              </CPaginationItem>
              {[...Array(totalPages)].map((_, index) => (
                <CPaginationItem
                  key={index}
                  active={currentPage === index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </CPaginationItem>
              ))}
              <CPaginationItem
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              >
                Next
              </CPaginationItem>
            </CPagination>
          )}
        </CCardBody>
      </CCard>

      {/* Unlock Single User Modal */}
      <CModal
        visible={showUnlockModal}
        onClose={() => setShowUnlockModal(false)}
      >
        <CModalHeader>
          <CModalTitle>Unlock User Account</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {userToUnlock && (
            <>
              <CAlert color="info">
                You are about to unlock the account for:
                <br />
                <strong>
                  {userToUnlock.first_name} {userToUnlock.last_name}
                </strong>
                <br />
                <small>{userToUnlock.email}</small>
              </CAlert>
              
              <CFormLabel htmlFor="unlock-reason">Reason for unlock</CFormLabel>
              <CFormTextarea
                id="unlock-reason"
                rows={3}
                value={unlockReason}
                onChange={(e) => setUnlockReason(e.target.value)}
                placeholder="Enter reason for unlocking this account..."
              />
              
              <CFormCheck
                className="mt-3"
                id="clear-attempts"
                label="Clear all failed login attempts"
                checked={clearAttempts}
                onChange={(e) => setClearAttempts(e.target.checked)}
              />
              
              {userToUnlock.recentFailedAttempts.length > 0 && (
                <CAlert color="warning" className="mt-3">
                  <CIcon icon={cilWarning} className="me-2" />
                  This user has {userToUnlock.recentFailedAttempts.length} recent failed login attempts
                </CAlert>
              )}
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => setShowUnlockModal(false)}
          >
            Cancel
          </CButton>
          <CButton
            color="success"
            onClick={handleUnlockUser}
            disabled={loading}
          >
            {loading ? <CSpinner size="sm" /> : "Unlock Account"}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Bulk Unlock Modal */}
      <CModal
        visible={showBulkUnlockModal}
        onClose={() => setShowBulkUnlockModal(false)}
      >
        <CModalHeader>
          <CModalTitle>Bulk Unlock Users</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CAlert color="info">
            You are about to unlock {selectedUsers.length} user accounts.
          </CAlert>
          
          <CFormLabel htmlFor="bulk-unlock-reason">Reason for unlock</CFormLabel>
          <CFormTextarea
            id="bulk-unlock-reason"
            rows={3}
            value={unlockReason}
            onChange={(e) => setUnlockReason(e.target.value)}
            placeholder="Enter reason for unlocking these accounts..."
          />
          
          <CFormCheck
            className="mt-3"
            id="bulk-clear-attempts"
            label="Clear all failed login attempts for selected users"
            checked={clearAttempts}
            onChange={(e) => setClearAttempts(e.target.checked)}
          />
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => setShowBulkUnlockModal(false)}
          >
            Cancel
          </CButton>
          <CButton
            color="success"
            onClick={handleBulkUnlock}
            disabled={loading}
          >
            {loading ? <CSpinner size="sm" /> : `Unlock ${selectedUsers.length} Accounts`}
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default LockedUsers;