import React, { useState } from 'react';
import { CContainer, CRow, CCol, CCard, CCardBody, CButton, CButtonGroup } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCloudUpload } from '@coreui/icons';
import './EngagementAnalytics.css';

// Icon components matching Figma design
const UserIcon = () => (
  <div className="stat-icon-bg" style={{ backgroundColor: '#e5e4ff' }}>
    <svg width="23" height="18" viewBox="0 0 23 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 4C6 6.20914 7.79086 8 10 8C12.2091 8 14 6.20914 14 4C14 1.79086 12.2091 0 10 0C7.79086 0 6 1.79086 6 4Z" stroke="#8280FF" strokeWidth="2"/>
      <path d="M0 18C0 14.6863 2.68629 12 6 12H14C17.3137 12 20 14.6863 20 18" stroke="#8280FF" strokeWidth="2"/>
      <path d="M17 4C17 6.20914 18.7909 8 21 8C23.2091 8 25 6.20914 25 4C25 1.79086 23.2091 0 21 0C18.7909 0 17 1.79086 17 4Z" stroke="#8280FF" strokeWidth="2"/>
      <path d="M16 18C16 14.6863 18.6863 12 22 12" stroke="#8280FF" strokeWidth="2"/>
    </svg>
  </div>
);

const EventsIcon = () => (
  <div className="stat-icon-bg" style={{ backgroundColor: '#ffded1' }}>
    <svg width="27" height="32" viewBox="0 0 27 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0.5" y="6.5" width="26" height="25" rx="3.5" stroke="#FF9871"/>
      <line x1="9" y1="3" x2="9" y2="8" stroke="#FF9871" strokeWidth="2"/>
      <line x1="18" y1="3" x2="18" y2="8" stroke="#FF9871" strokeWidth="2"/>
      <path d="M4 11H23" stroke="#FF9871"/>
      <line x1="4" y1="16" x2="8" y2="16" stroke="#FF9871"/>
      <line x1="11" y1="16" x2="15" y2="16" stroke="#FF9871"/>
      <line x1="18" y1="16" x2="22" y2="16" stroke="#FF9871"/>
      <line x1="4" y1="20" x2="8" y2="20" stroke="#FF9871"/>
      <line x1="11" y1="20" x2="15" y2="20" stroke="#FF9871"/>
      <line x1="18" y1="20" x2="22" y2="20" stroke="#FF9871"/>
      <line x1="4" y1="24" x2="8" y2="24" stroke="#FF9871"/>
      <line x1="11" y1="24" x2="15" y2="24" stroke="#FF9871"/>
      <line x1="18" y1="24" x2="22" y2="24" stroke="#FF9871"/>
    </svg>
  </div>
);

const SpacesIcon = () => (
  <div className="stat-icon-bg" style={{ backgroundColor: '#d9e3f7' }}>
    <svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="4" r="3.5" stroke="#4A4CD9" strokeWidth="1.5"/>
      <circle cx="22" cy="27" r="3.5" stroke="#4A4CD9" strokeWidth="1.5"/>
      <circle cx="28" cy="11" r="2.5" stroke="#4A4CD9" strokeWidth="1.3"/>
      <circle cx="7" cy="23" r="2.5" stroke="#4A4CD9" strokeWidth="1.5"/>
      <circle cx="28" cy="17" r="4.5" stroke="#4A4CD9" strokeWidth="1.5"/>
      <circle cx="5" cy="12" r="4.5" stroke="#4A4CD9" strokeWidth="1.5"/>
      <circle cx="16" cy="16" r="7.5" stroke="#4A4CD9" strokeWidth="1.5"/>
    </svg>
  </div>
);

const IdeasIcon = () => (
  <div className="stat-icon-bg" style={{ backgroundColor: '#fff3d6' }}>
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 0C9.477 0 5 4.477 5 10c0 3.5 1.8 6.6 4.5 8.4V24h11v-5.6c2.7-1.8 4.5-4.9 4.5-8.4 0-5.523-4.477-10-10-10zM11 27h8v3h-8v-3z" fill="#EBB129"/>
    </svg>
  </div>
);

const TrendUp = () => (
  <svg width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="12" r="11" fill="#18682C" fillOpacity="0.1"/>
    <path d="M11 16V8M11 8L7 12M11 8L15 12" stroke="#18682C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TrendDown = () => (
  <svg width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="12" r="11" fill="#D53425" fillOpacity="0.1"/>
    <path d="M11 8V16M11 16L7 12M11 16L15 12" stroke="#D53425" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

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
  <CCard className="engagement-stat-card">
    <CCardBody className="p-20">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <p className="stat-card-title">{title}</p>
        {icon}
      </div>
      <h2 className="stat-card-value">{value}</h2>
      <div className="d-flex align-items-center gap-2 mt-2">
        {trend.isPositive ? <TrendUp /> : <TrendDown />}
        <span className={`trend-percentage ${trend.isPositive ? 'trend-up-text' : 'trend-down-text'}`}>
          {trend.value}
        </span>
        <span className="trend-label">{trend.label}</span>
      </div>
    </CCardBody>
  </CCard>
);

interface ChartCardProps {
  title: string;
  currentValue: string;
  yAxisLabels: string[];
  color: string;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, currentValue, yAxisLabels, color }) => (
  <CCard className="engagement-chart-card">
    <CCardBody>
      <h4 className="chart-card-title">{title}</h4>
      
      {/* Chart Area */}
      <div className="chart-area">
        {/* Y-Axis */}
        <div className="y-axis">
          {yAxisLabels.map((label, index) => (
            <span key={index} className="y-axis-label">{label}</span>
          ))}
        </div>
        
        {/* Chart Placeholder */}
        <div className="chart-content">
          <svg width="100%" height="185" viewBox="0 0 405 185" preserveAspectRatio="none">
            {/* Grid lines */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <line
                key={i}
                x1="0"
                y1={i * 37}
                x2="405"
                y2={i * 37}
                stroke="#5B6168"
                strokeWidth="0.5"
                opacity="0.2"
              />
            ))}
            
            {/* Sample line chart path */}
            <path
              d="M0,100 L50,80 L100,90 L150,70 L200,85 L250,60 L300,75 L350,55 L405,70"
              stroke={color}
              strokeWidth="2"
              fill="none"
            />
            
            {/* Data points */}
            {[0, 50, 100, 150, 200, 250, 300, 350, 405].map((x, i) => {
              const yValues = [100, 80, 90, 70, 85, 60, 75, 55, 70];
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={yValues[i]}
                  r="4"
                  fill={color}
                  stroke="white"
                  strokeWidth="2"
                />
              );
            })}
          </svg>
          
          {/* Tooltip/Current Value */}
          <div className="chart-tooltip" style={{ backgroundColor: color }}>
            {currentValue}
          </div>
        </div>
      </div>
      
      {/* X-Axis Month Labels */}
      <div className="x-axis-labels">
        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => (
          <span key={month} className="x-axis-label">{month}</span>
        ))}
      </div>
    </CCardBody>
  </CCard>
);

const DonutChartCard = () => (
  <CCard className="engagement-chart-card">
    <CCardBody>
      <h4 className="chart-card-title">Events by Users vs Spaces</h4>
      
      <div className="donut-chart-wrapper">
        <div className="donut-chart">
          <svg width="163" height="163" viewBox="0 0 163 163">
            {/* Background circle */}
            <circle cx="81.5" cy="81.5" r="70" fill="none" stroke="#E0E0E0" strokeWidth="25"/>
            
            {/* Primary segment (70.16%) */}
            <circle
              cx="81.5"
              cy="81.5"
              r="70"
              fill="none"
              stroke="#526AC9"
              strokeWidth="25"
              strokeDasharray="309 440"
              strokeDashoffset="0"
              transform="rotate(-90 81.5 81.5)"
            />
            
            {/* Secondary segment (29.84%) */}
            <circle
              cx="81.5"
              cy="81.5"
              r="70"
              fill="none"
              stroke="#321FDB"
              strokeWidth="25"
              strokeDasharray="131 440"
              strokeDashoffset="-309"
              transform="rotate(-90 81.5 81.5)"
            />
          </svg>
        </div>
        
        <div className="donut-legend">
          <div className="legend-item">
            <div className="legend-indicator" style={{ backgroundColor: '#526AC9' }}></div>
            <span className="legend-text">Events organized by spaces</span>
            <span className="legend-percentage">70.16%</span>
          </div>
          <div className="legend-item">
            <div className="legend-indicator" style={{ backgroundColor: '#321FDB' }}></div>
            <span className="legend-text">Events organized by users</span>
            <span className="legend-percentage">29.84%</span>
          </div>
        </div>
      </div>
    </CCardBody>
  </CCard>
);

const EngagementAnalytics: React.FC = () => {
  const [timePeriod, setTimePeriod] = useState<'all' | 'week' | 'month'>('month');
  const [selectedMetric, setSelectedMetric] = useState('User Engagement Over Time');

  const handleExport = () => {
    console.log('Exporting data...');
  };

  return (
    <CContainer fluid className="engagement-analytics">
      {/* Filter Section */}
      <div className="filter-section-wrapper">
        <div className="filter-controls">
          <h6 className="filter-label">Filter by:</h6>
          <div className="time-period-selector">
            <span className="selector-label">Time period:</span>
            <CButtonGroup className="time-button-group">
              <CButton
                className={`time-btn ${timePeriod === 'all' ? '' : 'time-btn-inactive'}`}
                onClick={() => setTimePeriod('all')}
              >
                All time
              </CButton>
              <CButton
                className={`time-btn time-btn-middle ${timePeriod === 'week' ? '' : 'time-btn-inactive'}`}
                onClick={() => setTimePeriod('week')}
              >
                Week
              </CButton>
              <CButton
                className={`time-btn ${timePeriod === 'month' ? 'time-btn-active' : 'time-btn-inactive'}`}
                onClick={() => setTimePeriod('month')}
              >
                Month
              </CButton>
            </CButtonGroup>
          </div>
        </div>
        <CButton className="export-btn" onClick={handleExport}>
          <CIcon icon={cilCloudUpload} className="me-2" />
          Export
        </CButton>
      </div>

      {/* Stats Cards Row */}
      <CRow className="g-4 mb-4">
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
      <div className="engagement-header">
        <div className="d-flex align-items-center gap-3">
          <UserIcon />
          <h2 className="engagement-title">Engagement</h2>
        </div>
        <select className="metric-dropdown" value={selectedMetric} onChange={(e) => setSelectedMetric(e.target.value)}>
          <option value="User Engagement Over Time">User Engagement Over Time</option>
          <option value="Session Duration">Session Duration</option>
          <option value="Total Chats">Total Chats</option>
        </select>
      </div>

      {/* Charts Grid */}
      <CRow className="g-4 mb-4">
        <CCol xs={12} lg={6}>
          <ChartCard
            title="Total active users"
            currentValue="75,089"
            yAxisLabels={['100k', '75k', '50k', '25k', '0']}
            color="#00B69B"
          />
        </CCol>
        <CCol xs={12} lg={6}>
          <ChartCard
            title="Total chats"
            currentValue="75"
            yAxisLabels={['100', '75', '50', '25', '0']}
            color="#4379EE"
          />
        </CCol>
      </CRow>

      <CRow className="g-4 mb-4">
        <CCol xs={12} lg={6}>
          <ChartCard
            title="Session duration"
            currentValue="15.25"
            yAxisLabels={['20 Min', '15 Min', '10 Min', '5 Min', '0']}
            color="#24AFF5"
          />
        </CCol>
        <CCol xs={12} lg={6}>
          <DonutChartCard />
        </CCol>
      </CRow>

      {/* Last Updated Footer */}
      <div className="last-updated-footer">
        Last updated: 25 oct 2025 - 9:33:00
      </div>
    </CContainer>
  );
};

export default EngagementAnalytics;
