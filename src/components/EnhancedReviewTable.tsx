import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CCard,
  CCardBody,
  CFormInput,
  CButton,
  CInputGroup,
  CInputGroupText,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CDropdownDivider,
  CSpinner,
  CAlert,
  CPagination,
  CPaginationItem,
  CBadge,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import * as icon from '@coreui/icons';
import API from '../API/';

interface User {
  _id: string;
  first_name: string;
  last_name: string;
  reason?: string;
  createdAt: string;
  reportedOn?: string;
  is_active?: boolean;
  is_verified?: boolean;
  interest_ids?: Array<{ _id: string; name: string }>;
  interestList?: Array<{ _id: string; name: string }>;
}

interface SortConfig {
  key: keyof User | 'name';
  direction: 'asc' | 'desc';
}

const EnhancedReviewTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'createdAt', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedUserInterests, setSelectedUserInterests] = useState<{ user: User | null; show: boolean }>({
    user: null,
    show: false,
  });
  
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await API.get<{ users: User[] }>(
          '/users/?fields=_id,first_name,last_name,reason,createdAt,reportedOn,is_active,is_verified,interest_ids,interestList'
        );
        
        if (res && res.data && res.data.users) {
          // Debug: Log first user to see data structure
          if (res.data.users.length > 0) {
            console.log('Sample user data:', res.data.users[0]);
            console.log('Interest IDs:', res.data.users[0].interest_ids);
            console.log('Interest List:', res.data.users[0].interestList);
          }
          
          // For now, show all users to test the interests display
          // In production, filter only users that have been reported (have reportedOn field)
          // const reportedUsers = res.data.users.filter(user => user.reportedOn);
          setUsers(res.data.users); // Show all users for testing
        }
      } catch (err) {
        console.error('❌ Failed to fetch review data:', err);
        setError('Failed to load review data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const truncateId = (id: string) => {
    if (id.length <= 8) return id;
    return `${id.slice(0, 4)}...${id.slice(-4)}`;
  };

  const handleCopyId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleSort = (key: keyof User | 'name') => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const getUserInterests = (user: User) => {
    return user.interest_ids || user.interestList || [];
  };

  const sortedUsers = useMemo(() => {
    const sorted = [...users].sort((a, b) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let aValue: any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let bValue: any;

      if (sortConfig.key === 'name') {
        aValue = `${a.first_name} ${a.last_name}`.toLowerCase();
        bValue = `${b.first_name} ${b.last_name}`.toLowerCase();
      } else {
        aValue = a[sortConfig.key];
        bValue = b[sortConfig.key];
      }

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [users, sortConfig]);

  const filteredUsers = useMemo(() => {
    return sortedUsers.filter((user) => {
      const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
      const searchLower = searchTerm.toLowerCase();
      
      return (
        fullName.includes(searchLower) ||
        user._id.toLowerCase().includes(searchLower) ||
        (user.reason && user.reason.toLowerCase().includes(searchLower))
      );
    });
  }, [sortedUsers, searchTerm]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const exportToCSV = useCallback(() => {
    const headers = ['ID', 'Name', 'Reason', 'Status', 'Verified', 'Interests Count', 'Joined', 'Reported On'];
    const csvData = filteredUsers.map((user) => {
      const interests = getUserInterests(user);
      return [
        user._id,
        `${user.first_name} ${user.last_name}`,
        user.reason || '',
        user.is_active ? 'Active' : 'Inactive',
        user.is_verified ? 'Yes' : 'No',
        interests.length,
        new Date(user.createdAt).toLocaleDateString(),
        user.reportedOn ? new Date(user.reportedOn).toLocaleDateString() : '',
      ];
    });

    const csvContent = [
      headers.join(','),
      ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `review_users_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [filteredUsers]);

  const getSortIcon = (column: keyof User | 'name') => {
    if (sortConfig.key !== column) {
      return <CIcon icon={icon.cilSwapVertical} size="sm" className="ms-1 text-muted" />;
    }
    return sortConfig.direction === 'asc' ? (
      <CIcon icon={icon.cilArrowTop} size="sm" className="ms-1 text-primary" />
    ) : (
      <CIcon icon={icon.cilArrowBottom} size="sm" className="ms-1 text-primary" />
    );
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <CSpinner color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <CAlert color="danger" className="m-3">
        <CIcon icon={icon.cilWarning} className="me-2" />
        {error}
      </CAlert>
    );
  }

  return (
    <>
      <CCard className="enhanced-student-table">
        <CCardBody className="p-0">
          {/* Table Controls */}
          <div className="table-controls">
            <div className="d-flex justify-content-between align-items-center gap-3">
              <CInputGroup className="search-input" style={{ maxWidth: '300px' }}>
                <CInputGroupText>
                  <CIcon icon={icon.cilSearch} />
                </CInputGroupText>
                <CFormInput
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </CInputGroup>
              
              <CButton
                color="primary"
                variant="outline"
                onClick={exportToCSV}
                disabled={filteredUsers.length === 0}
              >
                <CIcon icon={icon.cilCloudDownload} className="me-2" />
                Export CSV
              </CButton>
            </div>
          </div>

          {/* Table */}
          <div className="table-wrapper">
            <CTable hover responsive className="mb-0">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell 
                    scope="col" 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSort('_id')}
                  >
                    ID {getSortIcon('_id')}
                  </CTableHeaderCell>
                  <CTableHeaderCell 
                    scope="col" 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSort('name')}
                  >
                    Name {getSortIcon('name')}
                  </CTableHeaderCell>
                  <CTableHeaderCell 
                    scope="col" 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSort('reason')}
                  >
                    Reason {getSortIcon('reason')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Interests</CTableHeaderCell>
                  <CTableHeaderCell 
                    scope="col" 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSort('createdAt')}
                  >
                    Joined {getSortIcon('createdAt')}
                  </CTableHeaderCell>
                  <CTableHeaderCell 
                    scope="col" 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSort('reportedOn')}
                  >
                    Reported {getSortIcon('reportedOn')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col"></CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {paginatedUsers.map((user) => {
                  const interests = getUserInterests(user);
                  return (
                    <CTableRow key={user._id}>
                      <CTableDataCell>
                        <code
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleCopyId(user._id)}
                          title={`Click to copy: ${user._id}`}
                        >
                          {copiedId === user._id ? (
                            <>
                              <CIcon icon={icon.cilCheckCircle} size="sm" className="text-success me-1" />
                              Copied!
                            </>
                          ) : (
                            truncateId(user._id)
                          )}
                        </code>
                      </CTableDataCell>
                      <CTableDataCell>
                        <strong>{user.first_name} {user.last_name}</strong>
                      </CTableDataCell>
                      <CTableDataCell>
                        {user.reason ? (
                          <span className="text-danger">{user.reason}</span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={user.is_active ? 'success' : 'secondary'}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </CBadge>
                        {user.is_verified && (
                          <CBadge color="info" className="ms-1">
                            Verified
                          </CBadge>
                        )}
                      </CTableDataCell>
                      <CTableDataCell>
                        {interests.length > 0 ? (
                          <div className="d-flex align-items-center gap-2">
                            <CBadge color="warning">{interests.length}</CBadge>
                            <CButton
                              color="primary"
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedUserInterests({ user, show: true })}
                            >
                              View All
                            </CButton>
                          </div>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </CTableDataCell>
                      <CTableDataCell>
                        {new Date(user.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </CTableDataCell>
                      <CTableDataCell>
                        {user.reportedOn ? (
                          <span className="text-danger">
                            {new Date(user.reportedOn).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CDropdown alignment="end">
                          <CDropdownToggle
                            color="dark"
                            variant="ghost"
                            caret={false}
                            style={{
                              backgroundColor: 'transparent',
                              border: 'none',
                              boxShadow: 'none',
                              padding: 0,
                            }}
                          >
                            ⋮
                          </CDropdownToggle>
                          <CDropdownMenu>
                            <CDropdownItem>
                              <CIcon icon={icon.cilEnvelopeClosed} className="me-2" />
                              Send Email
                            </CDropdownItem>
                            <CDropdownItem>
                              <CIcon icon={icon.cilNotes} className="me-2" />
                              View Activity Logs
                            </CDropdownItem>
                            <CDropdownDivider />
                            <CDropdownItem className="text-warning">
                              <CIcon icon={icon.cilBan} className="me-2" />
                              Suspend User
                            </CDropdownItem>
                            <CDropdownItem className="text-danger">
                              <CIcon icon={icon.cilTrash} className="me-2" />
                              Request to Delete
                            </CDropdownItem>
                          </CDropdownMenu>
                        </CDropdown>
                      </CTableDataCell>
                    </CTableRow>
                  );
                })}
              </CTableBody>
            </CTable>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination-wrapper">
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} entries
                </span>
                
                <CPagination aria-label="Page navigation">
                  <CPaginationItem
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </CPaginationItem>
                  
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNum = index + 1;
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <CPaginationItem
                          key={pageNum}
                          active={pageNum === currentPage}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </CPaginationItem>
                      );
                    } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                      return <CPaginationItem key={pageNum} disabled>...</CPaginationItem>;
                    }
                    return null;
                  })}
                  
                  <CPaginationItem
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </CPaginationItem>
                </CPagination>
              </div>
            </div>
          )}
        </CCardBody>
      </CCard>

      {/* Interests Modal */}
      <CModal
        visible={selectedUserInterests.show}
        onClose={() => setSelectedUserInterests({ user: null, show: false })}
        size="lg"
      >
        <CModalHeader>
          <CModalTitle>
            {selectedUserInterests.user && (
              <>
                Interests for {selectedUserInterests.user.first_name} {selectedUserInterests.user.last_name}
              </>
            )}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedUserInterests.user && (
            <div className="d-flex flex-wrap gap-2">
              {getUserInterests(selectedUserInterests.user).map((interest, idx) => (
                <CBadge
                  key={interest._id || idx}
                  color="primary"
                  style={{ fontSize: '0.875rem', padding: '0.5rem 0.75rem' }}
                >
                  {interest.name}
                </CBadge>
              ))}
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => setSelectedUserInterests({ user: null, show: false })}
          >
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default EnhancedReviewTable;