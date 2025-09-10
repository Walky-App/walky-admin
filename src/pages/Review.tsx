import * as icon from '@coreui/icons'
import { CCol, CRow } from '@coreui/react'
import InfoStatWidget from '../components/InfoStatWidget'
import EnhancedReviewTable from '../components/EnhancedReviewTable'
import API from '../API/'
import { useState, useEffect } from 'react'

const Review = () => {
  const [totalReported, setTotalReported] = useState<string | number>('—')
  const [pendingReview, setPendingReview] = useState<string | number>('—')
  const [resolvedCases, setResolvedCases] = useState<string | number>('—')
  const [reportReasons, setReportReasons] = useState<string | number>('—')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all users with report data
        const res = await API.get<{
          users: {
            _id: string;
            reportedOn?: string;
            reason?: string;
            is_active?: boolean;
          }[];
        }>('/users/?fields=_id,reportedOn,reason,is_active');
        
        if (res && res.data && res.data.users) {
          const users = res.data.users;
          
          // For testing - show all users stats
          // In production, filter only reported users: users.filter(u => u.reportedOn)
          const reportedUsers = users; // Show all for testing
          setTotalReported(reportedUsers.length);
          
          // Active users (for testing)
          const pendingCount = reportedUsers.filter(u => u.is_active).length;
          setPendingReview(pendingCount);
          
          // Inactive users (for testing)
          const resolvedCount = reportedUsers.filter(u => !u.is_active).length;
          setResolvedCases(resolvedCount);
          
          // Unique report reasons
          const uniqueReasons = new Set<string>();
          reportedUsers.forEach(user => {
            if (user.reason) {
              uniqueReasons.add(user.reason);
            }
          });
          setReportReasons(uniqueReasons.size);
        }
      } catch (err) {
        console.error('❌ Failed to fetch review stats:', err);
      }
    };

    fetchStats();
  }, [])

  const widgets = [
    { 
      icon: icon.cilWarning, 
      value: totalReported, 
      label: 'Total Reported', 
      tooltip: 'Total number of reported users',
      color: 'danger'
    },
    { 
      icon: icon.cilClock, 
      value: pendingReview, 
      label: 'Pending Review', 
      tooltip: 'Users pending review action',
      color: 'warning'
    },
    { 
      icon: icon.cilCheckCircle, 
      value: resolvedCases, 
      label: 'Resolved Cases', 
      tooltip: 'Users who have been dealt with',
      color: 'success'
    },
    { 
      icon: icon.cilDescription, 
      value: reportReasons, 
      label: 'Unique Reasons', 
      tooltip: 'Number of unique report reasons',
      color: 'info'
    },
  ]

  return (
    <div style={{ padding: '2rem' }}>
      <CRow>
        {widgets.map((w, idx) => (
          <CCol xs={12} sm={6} md={3} className="mb-3" key={idx}>
            <InfoStatWidget {...w} />
          </CCol>
        ))}
      </CRow>
      <EnhancedReviewTable />
    </div>
  );
};

export default Review;
