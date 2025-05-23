import  { useState, useEffect } from 'react';
import {
  CCard,
  CCardHeader,
  CCardBody,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
} from '@coreui/react';
import { useTheme } from '../hooks/useTheme';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import CampusDetails from './CampusDetails';
import CampusBoundary from './CampusBoundary';

// Fake campus data to get the campus name
const fakeCampuses = [
  {
    id: '1',
    name: 'University of California, Berkeley',
  },
  {
    id: '2',
    name: 'Stanford University',
  },
  {
    id: '3',
    name: 'Massachusetts Institute of Technology',
  },
  {
    id: '4',
    name: 'Harvard University',
  },
  {
    id: '5',
    name: 'Yale University',
  },
  {
    id: '6',
    name: 'Princeton University',
  },
  {
    id: '7',
    name: 'Columbia University',
  },
];

const CampusView = () => {
  const { theme } = useTheme();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the active tab from URL or default to 'details'
  const getActiveTabFromUrl = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('tab') || 'details';
  };
  
  const [activeTab, setActiveTab] = useState(getActiveTabFromUrl());
  const [campusName, setCampusName] = useState('Campus');
  const [loading, setLoading] = useState(true);
  
  // Fetch campus name when component mounts
  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      if (id) {
        const campus = fakeCampuses.find(c => c.id === id);
        if (campus) {
          setCampusName(campus.name);
        }
      }
      setLoading(false);
    }, 500);
  }, [id]);
  
  // Update URL when tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    // Update the URL with the new tab
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('tab', tab);
    navigate({
      pathname: location.pathname,
      search: searchParams.toString()
    }, { replace: true });
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="p-4">
        <CCard style={{ 
          backgroundColor: theme.colors.cardBg,
          borderColor: theme.colors.borderColor
        }}>
          <CCardBody>
            <div className="text-center p-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3" style={{ color: theme.colors.bodyColor }}>Loading campus information...</p>
            </div>
          </CCardBody>
        </CCard>
      </div>
    );
  }
  
  return (
    <div className="p-4">
      <CCard style={{ 
        backgroundColor: theme.colors.cardBg,
        borderColor: theme.colors.borderColor
      }}>
        <CCardHeader style={{ 
          backgroundColor: theme.colors.cardBg,
          borderColor: theme.colors.borderColor,
          color: theme.colors.bodyColor
        }}>
          <h4 className="mb-0">{campusName}</h4>
        </CCardHeader>
        <CCardBody>
          <CNav variant="tabs" className="mb-4">
            <CNavItem>
              <CNavLink 
                active={activeTab === 'details'} 
                onClick={() => handleTabChange('details')}
                style={{ 
                  cursor: 'pointer',
                  color: activeTab === 'details' ? theme.colors.primary : theme.colors.bodyColor,
                  backgroundColor: activeTab === 'details' ? theme.colors.cardBg : undefined,
                  borderColor: theme.colors.borderColor,
                  borderBottomColor: activeTab === 'details' ? theme.colors.cardBg : theme.colors.borderColor
                }}
              >
                Details
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink 
                active={activeTab === 'boundary'} 
                onClick={() => handleTabChange('boundary')}
                style={{ 
                  cursor: 'pointer',
                  color: activeTab === 'boundary' ? theme.colors.primary : theme.colors.bodyColor,
                  backgroundColor: activeTab === 'boundary' ? theme.colors.cardBg : undefined,
                  borderColor: theme.colors.borderColor,
                  borderBottomColor: activeTab === 'boundary' ? theme.colors.cardBg : theme.colors.borderColor
                }}
              >
                Boundary
              </CNavLink>
            </CNavItem>
          </CNav>
          
          <CTabContent>
            <CTabPane visible={activeTab === 'details'}>
              <CampusDetails campusId={id} inTabView={true} />
            </CTabPane>
            <CTabPane visible={activeTab === 'boundary'}>
              <CampusBoundary campusId={id} inTabView={true} />
            </CTabPane>
          </CTabContent>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default CampusView; 