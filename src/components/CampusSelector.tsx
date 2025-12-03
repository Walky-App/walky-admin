import React, { useEffect } from 'react';
import {
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CSpinner,
  CBadge,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilBuilding, cilCheckAlt, cilGlobeAlt } from '@coreui/icons';
import { useCampus } from '../contexts/CampusContext';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { apiClient } from '../API';

export const CampusSelector: React.FC = () => {
  const { theme } = useTheme();
  const { user, isSuperAdmin } = useAuth();
  const {
    selectedCampus,
    setSelectedCampus,
    availableCampuses,
    setAvailableCampuses,
    isLoadingCampuses,
    setIsLoadingCampuses,
    clearCampusSelection,
  } = useCampus();

  // Fetch campuses on mount
  useEffect(() => {
    const fetchCampuses = async () => {
      if (!user) return;

      setIsLoadingCampuses(true);
      try {
        let campuses = [];

        if (isSuperAdmin()) {
          // Super admin can see all campuses
          const response = await apiClient.api.campusesList() as any;
          campuses = response.data?.data || response.data?.campuses || response.data || [];
        } else if (user.campus_id) {
          // Campus admin or staff - only their campus
          const response = await apiClient.api.campusesDetail(user.campus_id) as any;
          const campus = response.data || response.data?.data || response.data?.campus;
          campuses = campus ? [campus] : [];
        }

        setAvailableCampuses(campuses);

        // Auto-select for non-super admins only if no campus is selected
        if (!isSuperAdmin() && campuses.length > 0 && !selectedCampus) {
          setSelectedCampus(campuses[0]);
        }
      } catch (error) {
        console.error('Failed to fetch campuses:', error);
        setAvailableCampuses([]);
      } finally {
        setIsLoadingCampuses(false);
      }
    };

    fetchCampuses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email, user?.role]);

  // Don't show selector if not super admin (they're locked to their campus)
  if (!isSuperAdmin()) {
    return null;
  }

  // Don't show if no campuses available
  if (availableCampuses.length === 0 && !isLoadingCampuses) {
    return null;
  }

  const handleSelectCampus = (campus: typeof selectedCampus) => {
    setSelectedCampus(campus);
  };

  const handleClearSelection = () => {
    clearCampusSelection();
  };

  return (
    <div
      style={{
        borderRight: `1px solid ${theme.colors.borderColor}40`,
        paddingRight: '1rem',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <CDropdown variant="nav-item">
        <CDropdownToggle
          caret={false}
          className="p-0 border-0 bg-transparent d-flex align-items-center"
          style={{
            color: theme.colors.bodyColor,
            cursor: 'pointer',
          }}
        >
          {isLoadingCampuses ? (
            <CSpinner size="sm" className="me-2" />
          ) : (
            <CIcon icon={selectedCampus ? cilBuilding : cilGlobeAlt} size="lg" className="me-2" />
          )}
          <div className="d-flex flex-column align-items-start">
            <small
              style={{
                fontSize: '11px',
                color: theme.colors.textMuted,
                lineHeight: '1',
                marginBottom: '2px',
              }}
            >
              {selectedCampus ? 'Campus' : 'All Campuses'}
            </small>
            <span
              style={{
                fontSize: '14px',
                fontWeight: '600',
                lineHeight: '1',
                maxWidth: '200px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {selectedCampus ? selectedCampus.campus_name : 'All Universities'}
            </span>
          </div>
        </CDropdownToggle>
        <CDropdownMenu
          style={{
            maxHeight: '400px',
            overflowY: 'auto',
            minWidth: '280px',
            backgroundColor: theme.colors.cardBg,
            border: `1px solid ${theme.colors.borderColor}40`,
            boxShadow: theme.isDark
              ? '0 8px 24px rgba(0,0,0,0.4)'
              : '0 8px 24px rgba(0,0,0,0.15)',
          }}
        >
          {/* View All Option */}
          <CDropdownItem
            onClick={handleClearSelection}
            style={{
              backgroundColor: !selectedCampus
                ? theme.isDark
                  ? 'rgba(255,255,255,0.1)'
                  : 'rgba(0,0,0,0.05)'
                : 'transparent',
              color: theme.colors.bodyColor,
            }}
          >
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <CIcon icon={cilGlobeAlt} className="me-2" />
                <span style={{ fontWeight: '600' }}>All Universities</span>
              </div>
              {!selectedCampus && (
                <CIcon icon={cilCheckAlt} style={{ color: theme.colors.success }} />
              )}
            </div>
          </CDropdownItem>

          <div
            style={{
              borderTop: `1px solid ${theme.colors.borderColor}40`,
              margin: '8px 0',
            }}
          />

          {/* Campus List */}
          {availableCampuses.map((campus) => (
            <CDropdownItem
              key={campus._id}
              onClick={() => handleSelectCampus(campus)}
              style={{
                backgroundColor:
                  selectedCampus?._id === campus._id
                    ? theme.isDark
                      ? 'rgba(255,255,255,0.1)'
                      : 'rgba(0,0,0,0.05)'
                    : 'transparent',
                color: theme.colors.bodyColor,
              }}
            >
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex flex-column">
                  <span style={{ fontWeight: '600' }}>{campus.campus_name}</span>
                  {campus.school_id && typeof campus.school_id === 'object' && 'school_name' in campus.school_id && (
                    <small style={{ color: theme.colors.textMuted }}>
                      {(campus.school_id as any).school_name}
                    </small>
                  )}
                </div>
                {selectedCampus?._id === campus._id && (
                  <CIcon icon={cilCheckAlt} style={{ color: theme.colors.success }} />
                )}
              </div>
            </CDropdownItem>
          ))}

          {availableCampuses.length === 0 && !isLoadingCampuses && (
            <CDropdownItem disabled style={{ color: theme.colors.textMuted }}>
              No campuses available
            </CDropdownItem>
          )}
        </CDropdownMenu>
      </CDropdown>

      {selectedCampus && (
        <CBadge
          color="primary"
          shape="rounded-pill"
          style={{
            marginLeft: '8px',
            fontSize: '10px',
            padding: '4px 8px',
          }}
        >
          Filtered
        </CBadge>
      )}
    </div>
  );
};
