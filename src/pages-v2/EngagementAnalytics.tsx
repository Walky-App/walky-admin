import React, { useState } from 'react';
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CButton,
  CButtonGroup,
  CFormSelect,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilUser,
  cilCalendar,
  cilLayers,
  cilLightbulb,
  cilCloudUpload,
} from '@coreui/icons';
import './EngagementAnalytics.css';

// Custom icons (these would need to be implemented as SVG components)
const UserIcon = () => (
  <div className="stat-icon-wrapper" style={{ backgroundColor: '#e5e4ff' }}>
    <CIcon icon={cilUser} size="xl" style={{ color: '#8280ff' }} />
  </div>
);

const EventsIcon = () => (
  <div className="stat-icon-wrapper" style={{ backgroundColor: '#ffded1' }}>
    <CIcon icon={cilCalendar} size="xl" style={{ color: '#ff9500' }} />
  </div>
);

const SpacesIcon = () => (
  <div className="stat-icon-wrapper" style={{ backgroundColor: '#d9e3f7' }}>
    <CIcon icon={cilLayers} size="xl" style={{ color: '#4a4cd9' }} />
  </div>
);

const IdeasIcon = () => (
  <div className="stat-icon-wrapper" style={{ backgroundColor: '#fff3d6' }}>
    <CIcon icon={cilLightbulb} size="xl" style={{ color: '#ffc107' }} />
  </div>
);

// Stat Card Component
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend: {
    value: string;
    isPositive: boolean;
    label: string;
  };
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend }) => (
  <CCard className="stat-card">
    <CCardBody>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="stat-title text-muted mb-0">{title}</h6>
        {icon}
      </div>
      <h2 className="stat-value mb-2">{value}</h2>
      <div className="d-flex align-items-center gap-2">
        <span className={`trend-badge ${trend.isPositive ? 'trend-up' : 'trend-down'}`}>
          {trend.isPositive ? '↑' : '↓'} {trend.value}
        </span>
        <span className="trend-label text-muted">{trend.label}</span>
      </div>
    </CCardBody>
  </CCard>
);

// Chart Component (placeholder for actual chart implementation)
interface ChartCardProps {
  title: string;
  currentValue: string;
  color: string;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, currentValue, color }) => (
  <CCard className="chart-card">
    <CCardBody>
      <h5 className="chart-title mb-4">{title}</h5>
      <div className="chart-placeholder" style={{ borderColor: color }}>
        <p className="text-muted">Chart placeholder for {title}</p>
        <p className="chart-current-value" style={{ color }}>
          Current: {currentValue}
        </p>
      </div>
      <div className="chart-labels d-flex justify-content-between mt-3">
        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(
          (month) => (
            <span key={month} className="month-label">
              {month}
            </span>
          )
        )}
      </div>
    </CCardBody>
  </CCard>
);

const EngagementAnalytics: React.FC = () => {
  const [timePeriod, setTimePeriod] = useState<'all' | 'week' | 'month'>('month');
  const [selectedMetric, setSelectedMetric] = useState('User Engagement Over Time');

  const handleExport = () => {
    console.log('Exporting data...');
    // Implement export functionality
  };

  return (
    <CContainer fluid className="engagement-analytics-page">
      {/* Filter Section */}
      <CRow className="mb-4">
        <CCol>
          <div className="filter-section">
            <div>
              <h6 className="fw-bold mb-3">Filter by:</h6>
              <div className="d-flex align-items-center gap-3">
                <span className="fw-semibold">Time period:</span>
                <CButtonGroup role="group">
                  <CButton
                    color="secondary"
                    variant={timePeriod === 'all' ? 'outline' : 'outline'}
                    active={timePeriod === 'all'}
                    onClick={() => setTimePeriod('all')}
                  >
                    All time
                  </CButton>
                  <CButton
                    color="secondary"
                    variant="outline"
                    active={timePeriod === 'week'}
                    onClick={() => setTimePeriod('week')}
                  >
                    Week
                  </CButton>
                  <CButton
                    color="primary"
                    active={timePeriod === 'month'}
                    onClick={() => setTimePeriod('month')}
                  >
                    Month
                  </CButton>
                </CButtonGroup>
              </div>
            </div>
            <CButton color="light" className="export-button" onClick={handleExport}>
              <CIcon icon={cilCloudUpload} className="me-2" />
              Export
            </CButton>
          </div>
        </CCol>
      </CRow>

      {/* Stats Cards */}
      <CRow className="mb-4 g-4">
        <CCol xs={12} sm={6} lg={3}>
          <StatCard
            title="Total User"
            value="75089"
            icon={<UserIcon />}
            trend={{ value: '8.5%', isPositive: true, label: 'from last month' }}
          />
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Active Events"
            value="10293"
            icon={<EventsIcon />}
            trend={{ value: '1.3%', isPositive: false, label: 'Up from last month' }}
          />
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Spaces Created"
            value="2040"
            icon={<SpacesIcon />}
            trend={{ value: '1.3%', isPositive: true, label: 'Up from last month' }}
          />
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Ideas Created"
            value="10293"
            icon={<IdeasIcon />}
            trend={{ value: '1.3%', isPositive: true, label: 'Up from last month' }}
          />
        </CCol>
      </CRow>

      {/* Engagement Section Header */}
      <CRow className="mb-4 align-items-center">
        <CCol>
          <div className="d-flex align-items-center gap-3">
            <UserIcon />
            <h2 className="section-title mb-0">Engagement</h2>
          </div>
        </CCol>
        <CCol xs="auto">
          <CFormSelect
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="metric-selector"
          >
            <option value="User Engagement Over Time">User Engagement Over Time</option>
            <option value="Session Duration">Session Duration</option>
            <option value="Total Chats">Total Chats</option>
          </CFormSelect>
        </CCol>
      </CRow>

      {/* Charts Row 1 */}
      <CRow className="mb-4 g-4">
        <CCol xs={12} lg={6}>
          <ChartCard
            title="Total active users"
            currentValue="75,089"
            color="#00b69b"
          />
        </CCol>
        <CCol xs={12} lg={6}>
          <ChartCard
            title="Total chats"
            currentValue="75"
            color="#4379ee"
          />
        </CCol>
      </CRow>

      {/* Charts Row 2 */}
      <CRow className="mb-4 g-4">
        <CCol xs={12} lg={6}>
          <ChartCard
            title="Session duration"
            currentValue="15.25 min"
            color="#24aff5"
          />
        </CCol>
        <CCol xs={12} lg={6}>
          <CCard className="chart-card">
            <CCardBody>
              <h5 className="chart-title mb-4">Events by Users vs Spaces</h5>
              <div className="donut-chart-container">
                <div className="donut-chart-placeholder">
                  {/* Placeholder for donut chart */}
                  <div className="donut-visual" />
                </div>
                <div className="donut-legend">
                  <div className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: '#526ac9' }} />
                    <span className="legend-label">Events organized by spaces</span>
                    <span className="legend-value">70.16%</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: '#321fdb' }} />
                    <span className="legend-label">Events organized by users</span>
                    <span className="legend-value">29.84%</span>
                  </div>
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Last Updated */}
      <CRow>
        <CCol>
          <div className="last-updated text-muted">
            Last updated: 25 oct 2025 - 9:33:00
          </div>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default EngagementAnalytics;
