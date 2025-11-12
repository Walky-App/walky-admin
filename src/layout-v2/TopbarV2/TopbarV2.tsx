import React, { useEffect } from "react";
import {
  CContainer,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CSpinner,
} from "@coreui/react";
import { useSchool, School } from "../../contexts/SchoolContext";
import { useCampus, Campus } from "../../contexts/CampusContext";
import { useTheme } from "../../hooks/useTheme";
import { useAuth } from "../../hooks/useAuth";
import { AssetIcon } from "../../components-v2";
import API from "../../API";
import "./TopbarV2.css";

interface TopbarV2Props {
  onToggleSidebar?: () => void;
}

const TopbarV2: React.FC<TopbarV2Props> = ({ onToggleSidebar }) => {
  const {
    selectedSchool,
    setSelectedSchool,
    availableSchools,
    setAvailableSchools,
    isLoadingSchools,
    setIsLoadingSchools,
  } = useSchool();
  const {
    selectedCampus,
    setSelectedCampus,
    availableCampuses,
    setAvailableCampuses,
    isLoadingCampuses,
    setIsLoadingCampuses,
  } = useCampus();
  const { toggleTheme } = useTheme();
  const { user, isSuperAdmin } = useAuth();

  // Fetch schools on mount
  useEffect(() => {
    const fetchSchools = async () => {
      if (!user) return;

      setIsLoadingSchools(true);
      try {
        let schools = [];

        if (isSuperAdmin()) {
          const response = await API.get("/admin/schools");
          schools = response.data || [];
        } else if (user.school_id) {
          const response = await API.get(`/admin/schools/${user.school_id}`);
          const school = response.data;
          schools = school ? [school] : [];
        }

        setAvailableSchools(schools);

        if (!isSuperAdmin() && schools.length > 0 && !selectedSchool) {
          setSelectedSchool(schools[0]);
        }
      } catch (error) {
        console.error("Failed to fetch schools:", error);
        setAvailableSchools([]);
      } finally {
        setIsLoadingSchools(false);
      }
    };

    fetchSchools();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email, user?.role]);

  // Fetch campuses on mount
  useEffect(() => {
    const fetchCampuses = async () => {
      if (!user) return;

      setIsLoadingCampuses(true);
      try {
        let campuses = [];

        if (isSuperAdmin()) {
          const response = await API.get("/admin/campuses");
          campuses = response.data?.data || response.data?.campuses || [];
        } else if (user.campus_id) {
          const response = await API.get(`/admin/campuses/${user.campus_id}`);
          const campus =
            response.data || response.data?.data || response.data?.campus;
          campuses = campus ? [campus] : [];
        }

        setAvailableCampuses(campuses);

        if (!isSuperAdmin() && campuses.length > 0 && !selectedCampus) {
          setSelectedCampus(campuses[0]);
        }
      } catch (error) {
        console.error("Failed to fetch campuses:", error);
        setAvailableCampuses([]);
      } finally {
        setIsLoadingCampuses(false);
      }
    };

    fetchCampuses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email, user?.role]);

  // Get user display name and avatar
  const userName = user ? `${user.first_name} ${user.last_name}` : "Admin Name";
  const userAvatar =
    user?.avatar_url ||
    "https://ui-avatars.com/api/?name=" +
      encodeURIComponent(userName) +
      "&background=4A5568&color=fff";

  return (
    <div className="topbar-v2">
      <CContainer fluid className="topbar-container">
        {/* Hamburger Menu */}
        <button
          className="hamburger-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <AssetIcon name="hamburguer-icon" color="#1d1b20" />
        </button>

        {/* Main Container */}
        <div className="topbar-main">
          {/* School and Campus Selectors */}
          <div className="selector-container">
            {/* School Selector */}
            <div className="selector-group">
              <div className="selector-icon">
                <AssetIcon name="school-icon" color="#1d1b20" />
              </div>
              <div className="selector-info">
                <span className="selector-label">Your school</span>
                <CDropdown className="selector-dropdown">
                  <CDropdownToggle color="link" className="selector-toggle">
                    {isLoadingSchools ? (
                      <CSpinner size="sm" />
                    ) : (
                      <>
                        {selectedSchool?.school_name || "Select School"}
                        <AssetIcon name="arrow-down" color="#1d1b20" />
                      </>
                    )}
                  </CDropdownToggle>
                  <CDropdownMenu>
                    {availableSchools.map((school: School) => (
                      <CDropdownItem
                        key={school._id}
                        onClick={() => setSelectedSchool(school)}
                        active={selectedSchool?._id === school._id}
                      >
                        {school.school_name}
                      </CDropdownItem>
                    ))}
                    {availableSchools.length === 0 && !isLoadingSchools && (
                      <CDropdownItem disabled>
                        No schools available
                      </CDropdownItem>
                    )}
                  </CDropdownMenu>
                </CDropdown>
              </div>
            </div>

            {/* Campus Selector */}
            <div className="selector-group">
              <div className="selector-icon">
                <AssetIcon name="campus-icon" color="#1d1b20" />
              </div>
              <div className="selector-info">
                <span className="selector-label">Your campus</span>
                <CDropdown className="selector-dropdown">
                  <CDropdownToggle color="link" className="selector-toggle">
                    {isLoadingCampuses ? (
                      <CSpinner size="sm" />
                    ) : (
                      <>
                        {selectedCampus?.campus_name || "Select Campus"}
                        <AssetIcon name="arrow-down" color="#1d1b20" />
                      </>
                    )}
                  </CDropdownToggle>
                  <CDropdownMenu>
                    {availableCampuses.map((campus: Campus) => (
                      <CDropdownItem
                        key={campus._id}
                        onClick={() => setSelectedCampus(campus)}
                        active={selectedCampus?._id === campus._id}
                      >
                        {campus.campus_name}
                      </CDropdownItem>
                    ))}
                    {availableCampuses.length === 0 && !isLoadingCampuses && (
                      <CDropdownItem disabled>
                        No campuses available
                      </CDropdownItem>
                    )}
                  </CDropdownMenu>
                </CDropdown>
              </div>
            </div>
          </div>

          {/* User Actions */}
          <div className="user-actions">
            {/* Theme Toggle */}
            <button
              className="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              <AssetIcon
                name="wb-sunny-icon"
                color="var(--v2-neutral-grey-medium)"
              />
            </button>

            {/* Divider */}
            <div className="topbar-divider" />

            {/* User Dropdown */}
            <CDropdown className="user-dropdown">
              <CDropdownToggle color="link" className="user-toggle">
                <span className="user-name">{userName}</span>
                <AssetIcon name="arrow-down" color="#1d1b20" size={24} />
                <div className="user-avatar-wrapper">
                  <img
                    src={userAvatar}
                    alt={userName}
                    className="user-avatar"
                    width="38"
                    height="38"
                    draggable="false"
                  />
                </div>
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem href="/logout">Logout</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          </div>
        </div>
      </CContainer>

      {/* Bottom Border */}
      <div className="topbar-border" />
    </div>
  );
};

export default TopbarV2;
