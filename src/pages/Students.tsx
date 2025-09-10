import * as icon from '@coreui/icons'
import { CCol, CRow } from '@coreui/react'
import InfoStatWidget from '../components/InfoStatWidget'
import EnhancedStudentTable from '../components/EnhancedStudentTable'
import API from '../API/'
import { useState, useEffect } from 'react'

const Students = () => {
  const [totalUsers, setTotalUsers] = useState<string | number>('—')
  const [activeUsers, setActiveUsers] = useState<string | number>('—')
  const [verifiedUsers, setVerifiedUsers] = useState<string | number>('—')
  const [totalInterests, setTotalInterests] = useState<string | number>('—')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all users to calculate stats
        const res = await API.get<{
          users: {
            _id: string;
            is_active?: boolean;
            is_verified?: boolean;
            interest_ids?: Array<{ _id: string; name: string }>;
            interestList?: Array<{ _id: string; name: string }>;
          }[];
        }>('/users/?fields=_id,is_active,is_verified,interest_ids,interestList');
        
        if (res && res.data && res.data.users) {
          const users = res.data.users;
          
          // Total users
          setTotalUsers(users.length);
          
          // Active users
          const activeCount = users.filter(u => u.is_active).length;
          setActiveUsers(activeCount);
          
          // Verified users
          const verifiedCount = users.filter(u => u.is_verified).length;
          setVerifiedUsers(verifiedCount);
          
          // Unique interests across all users
          const uniqueInterests = new Set<string>();
          users.forEach(user => {
            const interests = user.interest_ids || user.interestList || [];
            interests.forEach(interest => {
              if (interest && interest._id) {
                uniqueInterests.add(interest._id);
              }
            });
          });
          setTotalInterests(uniqueInterests.size);
        }
      } catch (err) {
        console.error('❌ Failed to fetch user stats:', err);
      }
    };

    fetchStats();
  }, [])

  const widgets = [
    { 
      icon: icon.cilPeople, 
      value: totalUsers, 
      label: 'Total Users', 
      tooltip: 'Total number of registered users',
      color: 'primary'
    },
    { 
      icon: icon.cilCheckCircle, 
      value: activeUsers, 
      label: 'Active Users', 
      tooltip: 'Users with active accounts',
      color: 'success'
    },
    { 
      icon: icon.cilShieldAlt, 
      value: verifiedUsers, 
      label: 'Verified Users', 
      tooltip: 'Users with verified accounts',
      color: 'info'
    },
    { 
      icon: icon.cilStar, 
      value: totalInterests, 
      label: 'Unique Interests', 
      tooltip: 'Number of unique interests selected by users',
      color: 'warning'
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
      <EnhancedStudentTable />
    </div>
  )
}

export default Students
