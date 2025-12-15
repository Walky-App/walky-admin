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
import { cilEducation, cilCheckAlt, cilGlobeAlt } from '@coreui/icons';
import { useSchool } from '../contexts/SchoolContext';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { apiClient } from '../API';

export const SchoolSelector: React.FC = () => {
  const { theme } = useTheme();
  const { user, isSuperAdmin } = useAuth();
  const {
    selectedSchool,
    setSelectedSchool,
    availableSchools,
    setAvailableSchools,
    isLoadingSchools,
    setIsLoadingSchools,
    clearSchoolSelection,
  } = useSchool();

  // Fetch schools on mount
  useEffect(() => {
    const fetchSchools = async () => {
      if (!user) return;

      setIsLoadingSchools(true);
      try {
        let schools = [];

        if (isSuperAdmin()) {
          // Super admin can see all schools
          const response = await apiClient.api.adminV2SchoolsList() as any;
          console.log('📚 Raw API response:', response);
          console.log('📚 response.data:', response.data);
          schools = response.data || [];
        } else if (user.school_id) {
          // School admin or staff - only their school
          const response = await apiClient.api.schoolDetail(user.school_id) as any;
          const school = response.data;
          schools = school ? [school] : [];
        }

        console.log('📚 Fetched schools array:', schools);
        console.log('📚 Schools array length:', schools.length);
        console.log('📚 First school structure:', schools[0]);
        setAvailableSchools(schools);

        // Auto-select for non-super admins only if no school is selected
        if (!isSuperAdmin() && schools.length > 0 && !selectedSchool) {
          console.log('🎯 Auto-selecting school:', schools[0]);
          setSelectedSchool(schools[0]);
        }
      } catch (error) {
        console.error('Failed to fetch schools:', error);
        setAvailableSchools([]);
      } finally {
        setIsLoadingSchools(false);
      }
    };

    fetchSchools();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email, user?.role]);

  // Don't show selector if not super admin (they're locked to their school)
  if (!isSuperAdmin()) {
    return null;
  }

  // Don't show if no schools available
  if (availableSchools.length === 0 && !isLoadingSchools) {
    return null;
  }

  const handleSelectSchool = (school: typeof selectedSchool) => {
    console.log('🏫 Selected school:', school);
    console.log('🏫 School name field:', school?.name);
    console.log('🏫 School display_name field:', school?.display_name);
    console.log('🏫 School school_name field:', school?.school_name);
    setSelectedSchool(school);
  };

  const handleClearSelection = () => {
    clearSchoolSelection();
  };

  // Debug logging for selected school display
  const selectedSchoolName = selectedSchool
    ? (selectedSchool.name || selectedSchool.display_name || selectedSchool.school_name || 'Unknown School')
    : 'All Schools';
  console.log('🎯 Dropdown toggle display:', { selectedSchool, selectedSchoolName });

  return (
    <div
      style={{
        borderRight: `1px solid ${theme.colors.borderColor}40`,
        paddingRight: '1rem',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <CDropdown variant="nav-item" style={{ listStyleType: 'none' }}>
        <CDropdownToggle
          caret={false}
          className="p-0 border-0 bg-transparent d-flex align-items-center"
          style={{
            color: theme.colors.bodyColor,
            cursor: 'pointer',
          }}
        >
          {isLoadingSchools ? (
            <CSpinner size="sm" className="me-2" />
          ) : (
            <CIcon icon={selectedSchool ? cilEducation : cilGlobeAlt} size="lg" className="me-2" />
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
              {selectedSchool ? 'School' : 'All Schools'}
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
              {selectedSchoolName}
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
              backgroundColor: !selectedSchool
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
                <span style={{ fontWeight: '600' }}>All Schools</span>
              </div>
              {!selectedSchool && (
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

          {/* School List */}
          {availableSchools.map((school) => {
            const schoolId = school.id || school._id;
            const schoolName = school.name || school.display_name || school.school_name || 'Unknown School';
            const selectedId = selectedSchool?.id || selectedSchool?._id;
            const isSelected = selectedId === schoolId;

            console.log('🏫 Rendering school:', { schoolId, schoolName, school });

            return (
              <CDropdownItem
                key={schoolId}
                onClick={() => handleSelectSchool(school)}
                style={{
                  backgroundColor:
                    isSelected
                      ? theme.isDark
                        ? 'rgba(255,255,255,0.1)'
                        : 'rgba(0,0,0,0.05)'
                      : 'transparent',
                  color: theme.colors.bodyColor,
                }}
              >
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex flex-column">
                    <span style={{ fontWeight: '600' }}>
                      {schoolName}
                    </span>
                    {school.school_name && school.display_name && school.display_name !== school.school_name && (
                      <small style={{ color: theme.colors.textMuted }}>
                        {school.school_name}
                      </small>
                    )}
                  </div>
                  {isSelected && (
                    <CIcon icon={cilCheckAlt} style={{ color: theme.colors.success }} />
                  )}
                </div>
              </CDropdownItem>
            );
          })}

          {availableSchools.length === 0 && !isLoadingSchools && (
            <CDropdownItem disabled style={{ color: theme.colors.textMuted }}>
              No schools available
            </CDropdownItem>
          )}
        </CDropdownMenu>
      </CDropdown>

      {selectedSchool && (
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
