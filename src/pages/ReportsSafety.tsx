/**
 * Reports & Safety Page
 * Purpose: Ensure a safe and healthy environment
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
  CRow,
  CCol,
  CFormSelect,
  CFormTextarea,
  CPagination,
  CPaginationItem,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilSearch,
  cilShieldAlt,
  cilCheckCircle,
  cilX,
  cilBan,
  cilInfo,
  cilPeople,
  cilCalendar,
  cilLightbulb,
  cilHome,
} from '@coreui/icons'
import { useTheme } from '../hooks/useTheme'
import API from '../API'

interface Report {
  _id: string
  report_type: 'user' | 'event' | 'space' | 'idea'
  reported_item_id: string
  reported_by: {
    _id: string
    first_name: string
    last_name: string
    email: string
  }
  reason: string
  description: string
  status: 'pending' | 'under_review' | 'resolved' | 'dismissed'
  reviewed_by?: {
    _id: string
    first_name: string
    last_name: string
  }
  admin_notes?: string
  resolved_at?: Date
  createdAt: Date
  reported_item_snapshot?: {
    name?: string
    title?: string
    email?: string
    first_name?: string
    last_name?: string
  }
}

type ReportType = 'all' | 'user' | 'event' | 'space' | 'idea'
type ReportStatus = 'all' | 'pending' | 'under_review' | 'resolved' | 'dismissed'

const ReportsSafety = () => {
  const { theme } = useTheme()
  const isDark = theme.isDark

  // State
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<ReportType>('all')
  const [statusFilter, setStatusFilter] = useState<ReportStatus>('all')
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showBanModal, setShowBanModal] = useState(false)
  const [banReason, setBanReason] = useState('')
  const [banDuration, setBanDuration] = useState('7')
  const [adminNotes, setAdminNotes] = useState('')
  const [processing, setProcessing] = useState(false)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const reportsPerPage = 20

  // Fetch reports
  const fetchReports = useCallback(async () => {
    setLoading(true)
    try {
      const response = await API.get('/api/admin/reports', {
        params: {
          page: currentPage,
          limit: reportsPerPage,
          search: searchTerm,
          type: typeFilter === 'all' ? undefined : typeFilter,
          status: statusFilter === 'all' ? undefined : statusFilter,
        },
      })

      setReports(response.data.reports)
      setTotalPages(response.data.pagination.pages)
    } catch (error) {
      console.error('Failed to fetch reports:', error)

      // Mock data for development
      const mockReports: Report[] = Array.from({ length: 20 }, (_, i) => ({
        _id: `report-${i}`,
        report_type: (['user', 'event', 'space', 'idea'] as const)[i % 4],
        reported_item_id: `item-${i}`,
        reported_by: {
          _id: `user-${i}`,
          first_name: ['John', 'Jane', 'Alex', 'Sarah', 'Michael'][i % 5],
          last_name: ['Smith', 'Johnson', 'Williams', 'Brown', 'Davis'][i % 5],
          email: `user${i}@university.edu`,
        },
        reason: [
          'Inappropriate Content',
          'Harassment',
          'Spam',
          'Misinformation',
          'Other',
        ][i % 5],
        description: 'This is a detailed description of the report issue.',
        status: (['pending', 'under_review', 'resolved', 'dismissed'] as const)[i % 4],
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        reported_item_snapshot: {
          name: `Reported Item ${i}`,
          title: `Event Title ${i}`,
          email: `reported${i}@university.edu`,
        },
      }))
      setReports(mockReports)
      setTotalPages(5)
    } finally {
      setLoading(false)
    }
  }, [currentPage, searchTerm, typeFilter, statusFilter, reportsPerPage])

  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  const viewReportDetails = (report: Report) => {
    setSelectedReport(report)
    setAdminNotes(report.admin_notes || '')
    setShowDetailsModal(true)
  }

  const openBanModal = (report: Report) => {
    setSelectedReport(report)
    setShowBanModal(true)
    setBanReason('')
    setBanDuration('7')
  }

  const handleUpdateStatus = async (status: Report['status']) => {
    if (!selectedReport) return

    setProcessing(true)
    try {
      await API.patch(`/api/admin/reports/${selectedReport._id}`, {
        status,
        admin_notes: adminNotes,
      })

      // Refresh reports
      await fetchReports()
      setShowDetailsModal(false)
    } catch (error) {
      console.error('Failed to update report:', error)
      alert('Failed to update report status')
    } finally {
      setProcessing(false)
    }
  }

  const handleBanUser = async () => {
    if (!selectedReport || !banReason.trim()) {
      alert('Please provide a ban reason')
      return
    }

    setProcessing(true)
    try {
      await API.post(`/api/admin/reports/${selectedReport._id}/ban-user`, {
        ban_duration: parseInt(banDuration),
        ban_reason: banReason,
        resolve_related_reports: true,
      })

      // Refresh reports list
      await fetchReports()

      alert(`User banned for ${banDuration} days`)
      setShowBanModal(false)
      setShowDetailsModal(false)
    } catch (error) {
      console.error('Failed to ban user:', error)
      alert('Failed to ban user')
    } finally {
      setProcessing(false)
    }
  }

  const getReportTypeIcon = (type: Report['report_type']) => {
    switch (type) {
      case 'user':
        return cilPeople
      case 'event':
        return cilCalendar
      case 'space':
        return cilHome
      case 'idea':
        return cilLightbulb
    }
  }

  const getReportTypeColor = (type: Report['report_type']) => {
    switch (type) {
      case 'user':
        return 'danger'
      case 'event':
        return 'warning'
      case 'space':
        return 'info'
      case 'idea':
        return 'primary'
    }
  }

  const getStatusBadge = (status: Report['status']) => {
    switch (status) {
      case 'pending':
        return <CBadge color="warning">Pending</CBadge>
      case 'under_review':
        return <CBadge color="info">Under Review</CBadge>
      case 'resolved':
        return <CBadge color="success">Resolved</CBadge>
      case 'dismissed':
        return <CBadge color="secondary">Dismissed</CBadge>
    }
  }

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      searchTerm === '' ||
      report.reported_by.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reported_by.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reported_by.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === 'all' || report.report_type === typeFilter
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter

    return matchesSearch && matchesType && matchesStatus
  })

  // Stats calculation
  const stats = {
    total: reports.length,
    pending: reports.filter((r) => r.status === 'pending').length,
    underReview: reports.filter((r) => r.status === 'under_review').length,
    resolved: reports.filter((r) => r.status === 'resolved').length,
  }

  return (
    <div style={{ padding: '2rem' }}>
      {/* Header */}
      <div className="mb-4">
        <h2 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>Reports & Safety</h2>
        <p style={{ color: '#6B7280', marginBottom: 0 }}>
          Ensure a safe and healthy environment for your community
        </p>
      </div>

      {/* Stats Cards */}
      <CRow className="g-3 mb-4">
        <CCol xs={12} sm={6} lg={3}>
          <CCard className="text-center">
            <CCardBody>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#6B7280' }}>
                {stats.total}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>Total Reports</div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <CCard className="text-center">
            <CCardBody>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#FF9500' }}>
                {stats.pending}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>Pending</div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <CCard className="text-center">
            <CCardBody>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#007AFF' }}>
                {stats.underReview}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>Under Review</div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <CCard className="text-center">
            <CCardBody>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#34C759' }}>
                {stats.resolved}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>Resolved</div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Support Channel Alert */}
      <CAlert color="info" className="mb-4">
        <div className="d-flex align-items-center">
          <CIcon icon={cilInfo} size="lg" className="me-3" />
          <div>
            <strong>Need Direct Support?</strong>
            <p className="mb-0" style={{ fontSize: '0.875rem' }}>
              For urgent safety concerns or complex cases, contact Walky support directly at{' '}
              <a href="mailto:support@walkyapp.com">support@walkyapp.com</a>
            </p>
          </div>
        </div>
      </CAlert>

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
                  placeholder="Search by reporter, reason, or description..."
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
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as ReportType)}
              >
                <option value="all">All Types</option>
                <option value="user">Users</option>
                <option value="event">Events</option>
                <option value="space">Spaces</option>
                <option value="idea">Ideas</option>
              </CFormSelect>
            </CCol>
            <CCol md={3}>
              <CFormSelect
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ReportStatus)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="resolved">Resolved</option>
                <option value="dismissed">Dismissed</option>
              </CFormSelect>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* Reports Table */}
      <CCard>
        <CCardHeader
          style={{
            background: isDark ? 'var(--modern-card-bg)' : '#FFFFFF',
            borderBottom: `1px solid ${isDark ? 'var(--modern-border-primary)' : '#E5E7EB'}`,
          }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0" style={{ fontWeight: '600' }}>
              Reports List
            </h5>
            <span style={{ color: '#6B7280', fontSize: '0.875rem' }}>
              {filteredReports.length} reports found
            </span>
          </div>
        </CCardHeader>
        <CCardBody className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <CSpinner color="primary" />
              <p className="mt-3">Loading reports...</p>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-5">
              <CIcon icon={cilShieldAlt} size="3xl" style={{ color: '#9CA3AF' }} />
              <p className="mt-3" style={{ color: '#6B7280' }}>
                No reports found matching your criteria
              </p>
            </div>
          ) : (
            <>
              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Type</CTableHeaderCell>
                    <CTableHeaderCell>Reported By</CTableHeaderCell>
                    <CTableHeaderCell>Reason</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Date</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {filteredReports.map((report) => (
                    <CTableRow key={report._id}>
                      <CTableDataCell>
                        <CBadge color={getReportTypeColor(report.report_type)}>
                          <CIcon icon={getReportTypeIcon(report.report_type)} className="me-1" />
                          {report.report_type.charAt(0).toUpperCase() + report.report_type.slice(1)}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>
                          <div style={{ fontWeight: '500' }}>
                            {report.reported_by.first_name} {report.reported_by.last_name}
                          </div>
                          <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                            {report.reported_by.email}
                          </div>
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>{report.reason}</CTableDataCell>
                      <CTableDataCell>{getStatusBadge(report.status)}</CTableDataCell>
                      <CTableDataCell>
                        {new Date(report.createdAt).toLocaleDateString()}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          size="sm"
                          color="primary"
                          variant="ghost"
                          onClick={() => viewReportDetails(report)}
                        >
                          View Details
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
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

      {/* Report Details Modal */}
      <CModal visible={showDetailsModal} onClose={() => setShowDetailsModal(false)} size="lg">
        <CModalHeader>
          <CModalTitle>Report Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedReport && (
            <div>
              {/* Report Type Badge */}
              <div className="mb-3">
                <CBadge color={getReportTypeColor(selectedReport.report_type)} style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
                  <CIcon icon={getReportTypeIcon(selectedReport.report_type)} className="me-2" />
                  {selectedReport.report_type.charAt(0).toUpperCase() + selectedReport.report_type.slice(1)} Report
                </CBadge>
                <span className="ms-2">{getStatusBadge(selectedReport.status)}</span>
              </div>

              {/* Details Grid */}
              <CRow className="g-3 mb-4">
                <CCol xs={12}>
                  <strong>Reported By:</strong>
                  <p>
                    {selectedReport.reported_by.first_name} {selectedReport.reported_by.last_name}
                    <br />
                    <span style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                      {selectedReport.reported_by.email}
                    </span>
                  </p>
                </CCol>
                <CCol xs={12}>
                  <strong>Reason:</strong>
                  <p>{selectedReport.reason}</p>
                </CCol>
                <CCol xs={12}>
                  <strong>Description:</strong>
                  <p style={{ color: '#6B7280' }}>{selectedReport.description}</p>
                </CCol>
                <CCol xs={12}>
                  <strong>Reported Item:</strong>
                  <p>
                    {selectedReport.reported_item_snapshot?.name ||
                      selectedReport.reported_item_snapshot?.title ||
                      'N/A'}
                  </p>
                </CCol>
                <CCol md={6}>
                  <strong>Report Date:</strong>
                  <p>{new Date(selectedReport.createdAt).toLocaleString()}</p>
                </CCol>
                {selectedReport.resolved_at && (
                  <CCol md={6}>
                    <strong>Resolved Date:</strong>
                    <p>{new Date(selectedReport.resolved_at).toLocaleString()}</p>
                  </CCol>
                )}
                {selectedReport.reviewed_by && (
                  <CCol xs={12}>
                    <strong>Reviewed By:</strong>
                    <p>
                      {selectedReport.reviewed_by.first_name} {selectedReport.reviewed_by.last_name}
                    </p>
                  </CCol>
                )}
              </CRow>

              {/* Admin Notes */}
              <div className="mb-3">
                <label className="form-label">
                  <strong>Admin Notes</strong>
                </label>
                <CFormTextarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about this report..."
                />
              </div>

              {/* Action Buttons */}
              <div className="d-flex flex-wrap gap-2">
                {selectedReport.status !== 'under_review' && (
                  <CButton
                    color="info"
                    onClick={() => handleUpdateStatus('under_review')}
                    disabled={processing}
                  >
                    Mark Under Review
                  </CButton>
                )}
                {selectedReport.status !== 'resolved' && (
                  <CButton
                    color="success"
                    onClick={() => handleUpdateStatus('resolved')}
                    disabled={processing}
                  >
                    <CIcon icon={cilCheckCircle} className="me-1" />
                    Mark Resolved
                  </CButton>
                )}
                {selectedReport.status !== 'dismissed' && (
                  <CButton
                    color="secondary"
                    onClick={() => handleUpdateStatus('dismissed')}
                    disabled={processing}
                  >
                    <CIcon icon={cilX} className="me-1" />
                    Dismiss
                  </CButton>
                )}
                {selectedReport.report_type === 'user' && selectedReport.status !== 'resolved' && (
                  <CButton color="danger" onClick={() => openBanModal(selectedReport)}>
                    <CIcon icon={cilBan} className="me-1" />
                    Ban User
                  </CButton>
                )}
              </div>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Ban User Modal */}
      <CModal visible={showBanModal} onClose={() => setShowBanModal(false)}>
        <CModalHeader>
          <CModalTitle>Ban User</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CAlert color="warning">
            <strong>Warning:</strong> This action will temporarily ban the reported user from
            accessing the platform.
          </CAlert>
          <div className="mb-3">
            <label className="form-label">
              <strong>Ban Duration</strong>
            </label>
            <CFormSelect value={banDuration} onChange={(e) => setBanDuration(e.target.value)}>
              <option value="1">1 Day</option>
              <option value="3">3 Days</option>
              <option value="7">7 Days</option>
              <option value="14">14 Days</option>
              <option value="30">30 Days</option>
              <option value="365">1 Year</option>
            </CFormSelect>
          </div>
          <div className="mb-3">
            <label className="form-label">
              <strong>Ban Reason</strong>
            </label>
            <CFormTextarea
              rows={3}
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              placeholder="Explain why this user is being banned..."
              required
            />
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowBanModal(false)}>
            Cancel
          </CButton>
          <CButton color="danger" onClick={handleBanUser} disabled={processing || !banReason.trim()}>
            {processing ? <CSpinner size="sm" className="me-2" /> : <CIcon icon={cilBan} className="me-2" />}
            Confirm Ban
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default ReportsSafety
