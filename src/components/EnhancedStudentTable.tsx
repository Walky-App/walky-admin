import { useState, useEffect, useMemo } from 'react';
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CButton,
  CPagination,
  CPaginationItem,
  CTooltip,
  CBadge,
  CSpinner,
  CAlert,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CRow,
  CCol,
  CCard,
  CCardBody,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilArrowTop,
  cilArrowBottom,
  cilSearch,
  cilCloudDownload,
  cilCopy,
  cilCheckCircle,
  cilSortAscending,
} from '@coreui/icons';
import API from '../API/';

interface Interest {
  _id: string;
  name: string;
  icon_url?: string;
  image_url?: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
  joined: string;
  lastUpdate: string;
  interests: Interest[];
  status?: 'active' | 'inactive' | 'suspended';
  verified?: boolean;
}

type SortDirection = 'asc' | 'desc' | null;
type SortField = keyof Student | null;

const EnhancedStudentTable = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [flaggedUsers, setFlaggedUsers] = useState<string[]>([]);
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Copy feedback state
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Interests modal state
  const [interestsModalVisible, setInterestsModalVisible] = useState(false);
  const [selectedUserInterests, setSelectedUserInterests] = useState<{
    userName: string;
    interests: Interest[];
  } | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const res = await API.get<{
          users: {
            _id: string;
            first_name: string;
            last_name: string;
            email: string;
            createdAt: string;
            updatedAt: string;
            interest_ids?: Interest[];
            interestList?: Interest[];
            is_active?: boolean;
            is_verified?: boolean;
          }[];
        }>('/users/?fields=_id,first_name,last_name,email,createdAt,updatedAt,interest_ids,interestList,is_active,is_verified');

        // Debug: Log first user to see data structure
        if (res.data.users.length > 0) {
          console.log('Students - Sample user data:', res.data.users[0]);
          console.log('Students - Interest IDs:', res.data.users[0].interest_ids);
          console.log('Students - Interest List:', res.data.users[0].interestList);
        }

        const transformed = res.data.users.map((user) => ({
          id: user._id,
          name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'N/A',
          email: user.email,
          joined: user.createdAt,
          lastUpdate: user.updatedAt,
          interests: user.interest_ids || user.interestList || [],
          status: (user.is_active ? 'active' : 'inactive') as 'active' | 'inactive' | 'suspended',
          verified: user.is_verified || false,
        }));

        setStudents(transformed);
        setError(null);
      } catch (err) {
        console.error('❌ Failed to fetch student data:', err);
        setError('Failed to load students. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Handle sorting
  const handleSort = (field: keyof Student) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortField(null);
        setSortDirection(null);
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and sort students
  const processedStudents = useMemo(() => {
    const filtered = students.filter((student) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        student.name.toLowerCase().includes(searchLower) ||
        student.email.toLowerCase().includes(searchLower) ||
        student.id.toLowerCase().includes(searchLower) ||
        student.interests.some(interest => interest.name.toLowerCase().includes(searchLower))
      );
    });

    if (sortField && sortDirection) {
      filtered.sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;
        
        let comparison = 0;
        if (aValue < bValue) comparison = -1;
        if (aValue > bValue) comparison = 1;
        
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return filtered;
  }, [students, searchTerm, sortField, sortDirection]);

  // Pagination
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedStudents.slice(startIndex, startIndex + itemsPerPage);
  }, [processedStudents, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(processedStudents.length / itemsPerPage);

  // Handle ID copy
  const handleCopyId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy ID:', err);
    }
  };

  // Truncate ID for display
  const truncateId = (id: string) => {
    if (id.length <= 8) return id;
    return `${id.slice(0, 4)}...${id.slice(-4)}`;
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Interests', 'Status', 'Verified', 'Joined', 'Last Update'];
    const rows = processedStudents.map(student => [
      student.id,
      student.name,
      student.email,
      student.interests.map(i => i.name).join(', '),
      student.status || '',
      student.verified ? 'Yes' : 'No',
      new Date(student.joined).toISOString(),
      new Date(student.lastUpdate).toISOString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `students_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleToggleFlagUser = (id: string) => {
    setFlaggedUsers((prev) =>
      prev.includes(id)
        ? prev.filter((userId) => userId !== id)
        : [...prev, id]
    );
  };

  const handleShowInterests = (userName: string, interests: Interest[]) => {
    setSelectedUserInterests({ userName, interests });
    setInterestsModalVisible(true);
  };

  const getSortIcon = (field: keyof Student) => {
    if (sortField !== field) return cilSortAscending;
    return sortDirection === 'asc' ? cilArrowTop : cilArrowBottom;
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'active':
        return <CBadge color="success">Active</CBadge>;
      case 'inactive':
        return <CBadge color="secondary">Inactive</CBadge>;
      case 'suspended':
        return <CBadge color="danger">Suspended</CBadge>;
      default:
        return <CBadge color="secondary">Unknown</CBadge>;
    }
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <CSpinner color="primary" />
        <div className="mt-2">Loading students...</div>
      </div>
    );
  }

  if (error) {
    return (
      <CAlert color="danger" className="m-3">
        {error}
      </CAlert>
    );
  }

  return (
    <div className="enhanced-student-table">
      {/* Table Controls */}
      <div className="table-controls p-3 bg-light rounded-top border">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          {/* Search Bar */}
          <CInputGroup className="search-input" style={{ maxWidth: '400px' }}>
            <CInputGroupText>
              <CIcon icon={cilSearch} />
            </CInputGroupText>
            <CFormInput
              placeholder="Search by name, email, ID, or interests..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </CInputGroup>

          {/* Action Buttons */}
          <div className="d-flex gap-2">
            <CButton
              color="primary"
              variant="outline"
              onClick={exportToCSV}
              disabled={processedStudents.length === 0}
            >
              <CIcon icon={cilCloudDownload} className="me-2" />
              Export CSV
            </CButton>
            <CBadge color="info" className="d-flex align-items-center px-3">
              {processedStudents.length} {processedStudents.length === 1 ? 'student' : 'students'}
            </CBadge>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper border border-top-0" style={{ overflowX: 'auto' }}>
        <CTable hover responsive className="mb-0 left-align">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell 
                scope="col" 
                style={{ cursor: 'pointer', userSelect: 'none' }}
                onClick={() => handleSort('id')}
              >
                <div className="d-flex align-items-center gap-1">
                  User ID
                  <CIcon icon={getSortIcon('id')} size="sm" />
                </div>
              </CTableHeaderCell>
              <CTableHeaderCell 
                scope="col"
                style={{ cursor: 'pointer', userSelect: 'none' }}
                onClick={() => handleSort('name')}
              >
                <div className="d-flex align-items-center gap-1">
                  Full Name
                  <CIcon icon={getSortIcon('name')} size="sm" />
                </div>
              </CTableHeaderCell>
              <CTableHeaderCell 
                scope="col"
                style={{ cursor: 'pointer', userSelect: 'none' }}
                onClick={() => handleSort('email')}
              >
                <div className="d-flex align-items-center gap-1">
                  Email Address
                  <CIcon icon={getSortIcon('email')} size="sm" />
                </div>
              </CTableHeaderCell>
              <CTableHeaderCell scope="col">Interests</CTableHeaderCell>
              <CTableHeaderCell scope="col">Account Status</CTableHeaderCell>
              <CTableHeaderCell 
                scope="col"
                style={{ cursor: 'pointer', userSelect: 'none' }}
                onClick={() => handleSort('joined')}
              >
                <div className="d-flex align-items-center gap-1">
                  Member Since
                  <CIcon icon={getSortIcon('joined')} size="sm" />
                </div>
              </CTableHeaderCell>
              <CTableHeaderCell 
                scope="col"
                style={{ cursor: 'pointer', userSelect: 'none' }}
                onClick={() => handleSort('lastUpdate')}
              >
                <div className="d-flex align-items-center gap-1">
                  Last Active
                  <CIcon icon={getSortIcon('lastUpdate')} size="sm" />
                </div>
              </CTableHeaderCell>
              <CTableHeaderCell scope="col" style={{ width: '50px' }}></CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {paginatedStudents.length === 0 ? (
              <CTableRow>
                <CTableDataCell colSpan={8} className="text-center py-4">
                  No students found
                </CTableDataCell>
              </CTableRow>
            ) : (
              paginatedStudents.map((student) => (
                <CTableRow
                  key={student.id}
                  color={flaggedUsers.includes(student.id) ? 'danger' : undefined}
                >
                  <CTableDataCell>
                    <CTooltip content={copiedId === student.id ? 'Copied!' : `Click to copy: ${student.id}`}>
                      <div
                        className="d-flex align-items-center gap-1"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleCopyId(student.id)}
                      >
                        <code style={{ fontSize: '0.875rem' }}>{truncateId(student.id)}</code>
                        <CIcon 
                          icon={copiedId === student.id ? cilCheckCircle : cilCopy} 
                          size="sm"
                          style={{ color: copiedId === student.id ? 'green' : '#6c757d' }}
                        />
                      </div>
                    </CTooltip>
                  </CTableDataCell>
                  <CTableDataCell>
                    <div>
                      <strong>{student.name}</strong>
                      {student.verified && (
                        <CBadge color="info" className="ms-2" style={{ fontSize: '0.7rem' }}>
                          Verified
                        </CBadge>
                      )}
                    </div>
                  </CTableDataCell>
                  <CTableDataCell>{student.email}</CTableDataCell>
                  <CTableDataCell>
                    <div 
                      className="d-flex flex-wrap gap-1" 
                      style={{ maxWidth: '200px', cursor: student.interests.length > 0 ? 'pointer' : 'default' }}
                      onClick={() => student.interests.length > 0 && handleShowInterests(student.name, student.interests)}
                    >
                      {student.interests.length > 0 ? (
                        <>
                          {student.interests.slice(0, 3).map((interest) => (
                            <CBadge 
                              key={interest._id} 
                              color="primary" 
                              style={{ 
                                fontSize: '0.65rem',
                                fontWeight: 'normal',
                                textTransform: 'capitalize'
                              }}
                            >
                              {interest.name}
                            </CBadge>
                          ))}
                          {student.interests.length > 3 && (
                            <CBadge 
                              color="info" 
                              style={{ 
                                fontSize: '0.65rem',
                                fontWeight: 'bold'
                              }}
                            >
                              +{student.interests.length - 3} more →
                            </CBadge>
                          )}
                        </>
                      ) : (
                        <span className="text-muted" style={{ fontSize: '0.875rem' }}>None</span>
                      )}
                    </div>
                  </CTableDataCell>
                  <CTableDataCell>{getStatusBadge(student.status)}</CTableDataCell>
                  <CTableDataCell>
                    {new Date(student.joined).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </CTableDataCell>
                  <CTableDataCell>
                    {new Date(student.lastUpdate).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
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
                        <CDropdownItem href="#">View Profile</CDropdownItem>
                        <CDropdownItem href="#">Send Email</CDropdownItem>
                        <hr className="dropdown-divider" />
                        <CDropdownItem onClick={() => handleToggleFlagUser(student.id)}>
                          {flaggedUsers.includes(student.id) ? 'Unflag User' : 'Flag User'}
                        </CDropdownItem>
                        <CDropdownItem href="#">Edit User</CDropdownItem>
                        <CDropdownItem href="#" className="text-danger">
                          Suspend User
                        </CDropdownItem>
                      </CDropdownMenu>
                    </CDropdown>
                  </CTableDataCell>
                </CTableRow>
              ))
            )}
          </CTableBody>
        </CTable>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination-wrapper p-3 bg-light rounded-bottom border border-top-0">
          <div className="d-flex justify-content-between align-items-center">
            <div className="text-muted">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, processedStudents.length)} of{' '}
              {processedStudents.length} entries
            </div>
            <CPagination aria-label="Page navigation">
              <CPaginationItem
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </CPaginationItem>
              {[...Array(Math.min(5, totalPages))].map((_, index) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = index + 1;
                } else if (currentPage <= 3) {
                  pageNumber = index + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + index;
                } else {
                  pageNumber = currentPage - 2 + index;
                }
                
                return (
                  <CPaginationItem
                    key={pageNumber}
                    active={pageNumber === currentPage}
                    onClick={() => setCurrentPage(pageNumber)}
                  >
                    {pageNumber}
                  </CPaginationItem>
                );
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

      {/* Interests Modal */}
      <CModal
        visible={interestsModalVisible}
        onClose={() => setInterestsModalVisible(false)}
        size="lg"
      >
        <CModalHeader>
          <CModalTitle>
            Interests for {selectedUserInterests?.userName}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedUserInterests && (
            <div>
              <div className="mb-3">
                <strong>Total Interests:</strong> {selectedUserInterests.interests.length}
              </div>
              <CRow className="g-3">
                {selectedUserInterests.interests.map((interest) => (
                  <CCol xs={12} sm={6} md={4} key={interest._id}>
                    <CCard className="h-100" style={{ cursor: 'pointer', transition: 'all 0.2s' }}>
                      <CCardBody className="text-center p-3">
                        {interest.icon_url && (
                          <div className="mb-2">
                            <img 
                              src={interest.icon_url} 
                              alt={interest.name}
                              style={{ 
                                width: '48px', 
                                height: '48px',
                                objectFit: 'contain'
                              }}
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        <h6 className="mb-0" style={{ textTransform: 'capitalize' }}>
                          {interest.name}
                        </h6>
                      </CCardBody>
                    </CCard>
                  </CCol>
                ))}
              </CRow>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setInterestsModalVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default EnhancedStudentTable;