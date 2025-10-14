/**
 * Student Management Page
 * Purpose: Enable monitoring and segmentation of student participation
 */

import { useState, useEffect, useCallback } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CBadge,
  CSpinner,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CAvatar,
  CRow,
  CCol,
  CFormSelect,
  CPagination,
  CPaginationItem,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilSearch,
  
  
  cilMagnifyingGlass,
  cilX,
  
} from '@coreui/icons'
import { useTheme } from '../hooks/useTheme'
import { useSchool } from '../contexts/SchoolContext'
import API from '../API'

interface Student {
  _id: string
  email: string
  first_name: string
  last_name: string
  avatar_url?: string
  field_of_study?: string
  interests?: string[]
  profile_bio?: string
  lastLogin?: Date
  createdAt: Date
  isActive: boolean
  engagementScore?: number
  stats?: {
    totalPeers: number
    walksAccepted: number
    eventsAttended: number
  }
}

const StudentManagement = () => {
  const { theme } = useTheme()
  const { selectedSchool } = useSchool()
  const isDark = theme.isDark

  // State
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [showModal, setShowModal] = useState(false)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const studentsPerPage = 20

  // Fetch students
  const fetchStudents = useCallback(async () => {
    console.log('👥 StudentManagement: Fetching students for school:', selectedSchool?._id || 'all schools')
    setLoading(true)
    try {
      const response = await API.get('/admin/analytics/students', {
        params: {
          page: currentPage,
          limit: studentsPerPage,
          search: searchTerm,
          status: statusFilter === 'all' ? undefined : statusFilter,
        },
      })

      setStudents(response.data.students)
      setTotalPages(response.data.pagination.pages)
      setError(null)
    } catch (err: unknown) {
      console.error('Failed to fetch students:', err)
      const errorMessage = (err as { response?: { data?: { error?: string } }; message?: string })?.response?.data?.error || (err as { message?: string })?.message || 'Failed to load students.'
      setError(`API Error: ${errorMessage}`)
      setStudents([])
      setTotalPages(0)
    } finally {
      setLoading(false)
    }
  }, [currentPage, searchTerm, statusFilter, studentsPerPage, selectedSchool?._id])

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  const viewStudentDetails = (student: Student) => {
    setSelectedStudent(student)
    setShowModal(true)
  }

  const getActivityStatus = (lastLogin?: Date) => {
    if (!lastLogin) return { label: 'Never', color: 'secondary' }

    const daysSinceLogin = Math.floor(
      (Date.now() - new Date(lastLogin).getTime()) / (1000 * 60 * 60 * 24)
    )

    if (daysSinceLogin === 0) return { label: 'Today', color: 'success' }
    if (daysSinceLogin <= 7) return { label: `${daysSinceLogin}d ago`, color: 'success' }
    if (daysSinceLogin <= 30) return { label: `${daysSinceLogin}d ago`, color: 'warning' }
    return { label: `${daysSinceLogin}d ago`, color: 'danger' }
  }

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      searchTerm === '' ||
      student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.field_of_study?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.interests?.some((i) => i.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && student.isActive) ||
      (statusFilter === 'inactive' && !student.isActive)

    return matchesSearch && matchesStatus
  })

  return (
    <div style={{ padding: '2rem' }}>
      {/* Header */}
      <div className="mb-4">
        <h2 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>
          Student Management
        </h2>
        <p style={{ color: '#6B7280', marginBottom: 0 }}>
          Monitor and segment student participation across your campuses
        </p>
      </div>

      {/* Filters */}
      <CCard className="mb-4">
        <CCardBody>
          <CRow className="g-3">
            <CCol md={6}>
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilSearch} />
                </CInputGroupText>
                <CFormInput
                  placeholder="Search by name, email, program, or interests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <CButton
                    color="secondary"
                    variant="ghost"
                    onClick={() => setSearchTerm('')}
                  >
                    <CIcon icon={cilX} />
                  </CButton>
                )}
              </CInputGroup>
            </CCol>
            <CCol md={3}>
              <CFormSelect
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
              >
                <option value="all">All Students</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </CFormSelect>
            </CCol>
            <CCol md={3} className="d-flex justify-content-end align-items-center">
              <span style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                {filteredStudents.length} students found
              </span>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* Error Display */}
      {error && (
        <CAlert color="danger" className="mb-4">
          {error}
        </CAlert>
      )}

      {/* Students Table */}
      <CCard>
        <CCardHeader
          style={{
            background: isDark ? 'var(--modern-card-bg)' : '#FFFFFF',
            borderBottom: `1px solid ${isDark ? 'var(--modern-border-primary)' : '#E5E7EB'}`,
          }}
        >
          <h5 className="mb-0" style={{ fontWeight: '600' }}>
            Students List
          </h5>
        </CCardHeader>
        <CCardBody className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <CSpinner color="primary" />
              <p className="mt-3">Loading students...</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-5">
              <CIcon icon={cilMagnifyingGlass} size="3xl" style={{ color: '#9CA3AF' }} />
              <p className="mt-3" style={{ color: '#6B7280' }}>
                No students found matching your criteria
              </p>
            </div>
          ) : (
            <>
              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Student</CTableHeaderCell>
                    <CTableHeaderCell>Field of Study</CTableHeaderCell>
                    <CTableHeaderCell>Interests</CTableHeaderCell>
                    <CTableHeaderCell>Engagement</CTableHeaderCell>
                    <CTableHeaderCell>Last Login</CTableHeaderCell>
                    <CTableHeaderCell>Joined</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {filteredStudents.map((student) => {
                    const activityStatus = getActivityStatus(student.lastLogin)
                    return (
                      <CTableRow key={student._id}>
                        <CTableDataCell>
                          <div className="d-flex align-items-center gap-2">
                            <CAvatar
                              src={student.avatar_url || 'https://via.placeholder.com/40'}
                              size="md"
                            />
                            <div>
                              <div style={{ fontWeight: '500' }}>
                                {student.first_name} {student.last_name}
                              </div>
                              <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                                {student.email}
                              </div>
                            </div>
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>{student.field_of_study || 'N/A'}</CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex flex-wrap gap-1">
                            {student.interests?.slice(0, 2).map((interest, idx) => (
                              <CBadge key={idx} color="info" style={{ fontSize: '0.75rem' }}>
                                {interest}
                              </CBadge>
                            ))}
                            {student.interests && student.interests.length > 2 && (
                              <CBadge color="secondary" style={{ fontSize: '0.75rem' }}>
                                +{student.interests.length - 2}
                              </CBadge>
                            )}
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div style={{ fontSize: '0.875rem' }}>
                            <div>
                              <strong>{student.engagementScore}</strong>/100
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                              {student.stats?.totalPeers || 0} peers
                            </div>
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={activityStatus.color}>
                            {activityStatus.label}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          {new Date(student.createdAt).toLocaleDateString()}
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={student.isActive ? 'success' : 'secondary'}>
                            {student.isActive ? 'Active' : 'Inactive'}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CButton
                            size="sm"
                            color="primary"
                            variant="ghost"
                            onClick={() => viewStudentDetails(student)}
                          >
                            View Details
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    )
                  })}
                </CTableBody>
              </CTable>

              {/* Pagination */}
              <div className="d-flex justify-content-center p-3">
                <CPagination>
                  <CPaginationItem
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </CPaginationItem>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const page = i + 1
                    return (
                      <CPaginationItem
                        key={page}
                        active={page === currentPage}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </CPaginationItem>
                    )
                  })}
                  <CPaginationItem
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </CPaginationItem>
                </CPagination>
              </div>
            </>
          )}
        </CCardBody>
      </CCard>

      {/* Student Details Modal */}
      <CModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        size="lg"
      >
        <CModalHeader>
          <CModalTitle>Student Profile</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedStudent && (
            <div>
              {/* Header with Avatar */}
              <div className="d-flex align-items-center gap-3 mb-4 p-3" style={{
                background: isDark ? 'var(--modern-card-bg)' : '#F9FAFB',
                borderRadius: '8px'
              }}>
                <CAvatar
                  src={selectedStudent.avatar_url || 'https://via.placeholder.com/80'}
                  size="xl"
                />
                <div>
                  <h4 className="mb-1">
                    {selectedStudent.first_name} {selectedStudent.last_name}
                  </h4>
                  <p className="mb-1" style={{ color: '#6B7280' }}>
                    {selectedStudent.email}
                  </p>
                  <div className="d-flex gap-2">
                    <CBadge color={selectedStudent.isActive ? 'success' : 'secondary'}>
                      {selectedStudent.isActive ? 'Active' : 'Inactive'}
                    </CBadge>
                    <CBadge color="info">
                      Engagement: {selectedStudent.engagementScore}/100
                    </CBadge>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <CRow className="g-3">
                <CCol md={6}>
                  <strong>Field of Study:</strong>
                  <p>{selectedStudent.field_of_study || 'Not specified'}</p>
                </CCol>
                <CCol md={6}>
                  <strong>Profile Created:</strong>
                  <p>{new Date(selectedStudent.createdAt).toLocaleDateString()}</p>
                </CCol>
                <CCol md={6}>
                  <strong>Last Login:</strong>
                  <p>
                    {selectedStudent.lastLogin
                      ? new Date(selectedStudent.lastLogin).toLocaleDateString()
                      : 'Never'}
                  </p>
                </CCol>
                <CCol md={6}>
                  <strong>Total Peers:</strong>
                  <p>{selectedStudent?.stats?.totalPeers || 0}</p>
                </CCol>
                <CCol xs={12}>
                  <strong>Interests:</strong>
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    {selectedStudent.interests?.map((interest, idx) => (
                      <CBadge key={idx} color="info">
                        {interest}
                      </CBadge>
                    )) || <span style={{ color: '#6B7280' }}>No interests listed</span>}
                  </div>
                </CCol>
                <CCol xs={12}>
                  <strong>Bio:</strong>
                  <p style={{ color: '#6B7280', marginTop: '0.5rem' }}>
                    {selectedStudent.profile_bio || 'No bio provided'}
                  </p>
                </CCol>
                <CCol xs={12}>
                  <strong>Activity Stats:</strong>
                  <div className="d-flex gap-3 mt-2">
                    <div>
                      <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#5E5CE6' }}>
                        {selectedStudent.stats?.walksAccepted || 0}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                        Walks Accepted
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#007AFF' }}>
                        {selectedStudent.stats?.eventsAttended || 0}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                        Events Attended
                      </div>
                    </div>
                  </div>
                </CCol>
              </CRow>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowModal(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default StudentManagement
