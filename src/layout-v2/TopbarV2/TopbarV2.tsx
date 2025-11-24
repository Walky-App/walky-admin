import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CContainer,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CSpinner,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
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
  const navigate = useNavigate();
  const [schoolModalOpen, setSchoolModalOpen] = useState(false);
  const [campusModalOpen, setCampusModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 992);

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
  const { toggleTheme, theme } = useTheme();
  const { user, isSuperAdmin } = useAuth();

  // Track if initial fetch has been done
  const hasInitializedSchools = useRef(false);
  const hasInitializedCampuses = useRef(false);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 992);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch schools on mount
  useEffect(() => {
    if (hasInitializedSchools.current) return;
    if (!user) return;

    const fetchSchools = async () => {
      setIsLoadingSchools(true);

      // Determine which API endpoint to call
      const endpoint = isSuperAdmin()
        ? "/admin/schools"
        : `/admin/schools/${user.school_id}`;

      const shouldFetch = isSuperAdmin() || user.school_id;

      if (!shouldFetch) {
        setIsLoadingSchools(false);
        return;
      }

      try {
        const response = await API.get(endpoint);

        // Process response with simple assignments only
        let schools;
        const isSuper = isSuperAdmin();

        if (isSuper) {
          const data = response.data;
          if (data) {
            schools = data;
          } else {
            schools = [];
          }
        } else {
          const data = response.data;
          if (data) {
            schools = [data];
          } else {
            schools = [];
          }
        }

        setAvailableSchools(schools);

        // Auto-select first school for non-super admins
        const hasSchools = schools.length > 0;
        if (!isSuper) {
          if (hasSchools) {
            setSelectedSchool(schools[0]);
          }
        }
        setIsLoadingSchools(false);
        hasInitializedSchools.current = true;
      } catch (error) {
        console.error("Failed to fetch schools:", error);
        setAvailableSchools([]);
        setIsLoadingSchools(false);
      }
    };

    fetchSchools();
  }, [
    user,
    isSuperAdmin,
    setIsLoadingSchools,
    setAvailableSchools,
    setSelectedSchool,
  ]);

  // Fetch campuses on mount
  useEffect(() => {
    if (hasInitializedCampuses.current) return;
    if (!user) return;

    const fetchCampuses = async () => {
      setIsLoadingCampuses(true);

      // Determine which API endpoint to call
      const endpoint = isSuperAdmin()
        ? "/admin/campuses"
        : `/admin/campuses/${user.campus_id}`;

      const shouldFetch = isSuperAdmin() || user.campus_id;

      if (!shouldFetch) {
        setIsLoadingCampuses(false);
        return;
      }

      try {
        const response = await API.get(endpoint);

        // Process response with simple assignments only
        let campuses;
        const isSuper = isSuperAdmin();

        if (isSuper) {
          const responseData = response.data;
          let dataData;
          let dataCampuses;

          if (responseData) {
            dataData = responseData.data;
            dataCampuses = responseData.campuses;
          }

          if (dataData) {
            campuses = dataData;
          } else if (dataCampuses) {
            campuses = dataCampuses;
          } else {
            campuses = [];
          }
        } else {
          const data = response.data;
          let dataData;
          let dataCampus;

          if (data) {
            dataData = data.data;
            dataCampus = data.campus;
          }

          let campus;
          if (data) {
            campus = data;
          } else if (dataData) {
            campus = dataData;
          } else if (dataCampus) {
            campus = dataCampus;
          }

          if (campus) {
            campuses = [campus];
          } else {
            campuses = [];
          }
        }

        setAvailableCampuses(campuses);

        // Auto-select first campus for non-super admins
        const hasCampuses = campuses.length > 0;
        if (!isSuper) {
          if (hasCampuses) {
            setSelectedCampus(campuses[0]);
          }
        }
        setIsLoadingCampuses(false);
        hasInitializedCampuses.current = true;
      } catch (error) {
        console.error("Failed to fetch campuses:", error);
        setAvailableCampuses([]);
        setIsLoadingCampuses(false);
      }
    };

    fetchCampuses();
  }, [
    user,
    isSuperAdmin,
    setIsLoadingCampuses,
    setAvailableCampuses,
    setSelectedCampus,
  ]);

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
          aria-label="Toggle navigation menu"
        >
          <AssetIcon name="hamburguer-icon" color="#1d1b20" />
        </button>

        {/* Main Container */}
        <div className="topbar-main">
          {/* School and Campus Selectors */}
          <div className="selector-container">
            {isMobile ? (
              <>
                {/* Mobile: Icon buttons with text */}
                <button
                  className="selector-icon-btn"
                  onClick={() => setSchoolModalOpen(true)}
                  aria-label="Select school"
                >
                  <AssetIcon
                    name="school-icon"
                    color={theme.colors.bodyColor}
                  />
                  <span className="selector-btn-text">
                    {selectedSchool?.school_name || "School"}
                  </span>
                  <AssetIcon name="arrow-down" size={18} />
                </button>
                <button
                  className="selector-icon-btn"
                  onClick={() => setCampusModalOpen(true)}
                  aria-label="Select campus"
                >
                  <AssetIcon
                    name="campus-icon"
                    color={theme.colors.bodyColor}
                  />
                  <span className="selector-btn-text">
                    {selectedCampus?.campus_name || "Campus"}
                  </span>
                  <AssetIcon
                    name="arrow-down"
                    size={18}
                    color={theme.colors.bodyColor}
                  />
                </button>
              </>
            ) : (
              <>
                {/* Desktop: Full dropdowns */}
                <div className="selector-group">
                  <div className="selector-icon">
                    <AssetIcon
                      name="school-icon"
                      color={theme.colors.bodyColor}
                    />
                  </div>
                  <div className="selector-info">
                    <span className="selector-label">Your school</span>
                    <CDropdown className="selector-dropdown">
                      <CDropdownToggle color="link" className="selector-toggle">
                        {isLoadingSchools ? (
                          <CSpinner size="sm" />
                        ) : (
                          <>
                            <span className="selector-value">
                              {selectedSchool?.school_name || "Select School"}
                            </span>
                            <AssetIcon
                              name="arrow-down"
                              size={20}
                              color={theme.colors.bodyColor}
                            />
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

                <div className="selector-group">
                  <div className="selector-icon">
                    <AssetIcon
                      name="campus-icon"
                      color={theme.colors.bodyColor}
                    />
                  </div>
                  <div className="selector-info">
                    <span className="selector-label">Your campus</span>
                    <CDropdown className="selector-dropdown">
                      <CDropdownToggle color="link" className="selector-toggle">
                        {isLoadingCampuses ? (
                          <CSpinner size="sm" />
                        ) : (
                          <>
                            <span className="selector-value">
                              {selectedCampus?.campus_name || "Select Campus"}
                            </span>
                            <AssetIcon
                              name="arrow-down"
                              size={20}
                              color={theme.colors.bodyColor}
                            />
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
                        {availableCampuses.length === 0 &&
                          !isLoadingCampuses && (
                            <CDropdownItem disabled>
                              No campuses available
                            </CDropdownItem>
                          )}
                      </CDropdownMenu>
                    </CDropdown>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Actions */}
          <div className="user-actions">
            {/* Theme Toggle */}
            <button
              className="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label="Toggle color theme"
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
                <AssetIcon name="arrow-down" color={theme.colors.bodyColor} />
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
                <CDropdownItem
                  onClick={() => navigate("/v2/admin/settings")}
                  className="user-dropdown-item settings-item"
                >
                  <span>Administrator settings</span>
                  <AssetIcon name="arrow-down" size={24} />
                </CDropdownItem>
                <CDropdownItem
                  href="/logout"
                  className="user-dropdown-item logout-item"
                >
                  <span>Logout</span>
                  <AssetIcon name="lock-icon" size={24} />
                </CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          </div>
        </div>
      </CContainer>

      {/* Bottom Border */}
      <div className="topbar-border" />

      {/* School Modal (Mobile) */}
      <CModal
        visible={schoolModalOpen}
        onClose={() => setSchoolModalOpen(false)}
        alignment="center"
        className="selector-modal"
      >
        <CModalHeader>
          <CModalTitle>Select School</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="modal-list">
            {availableSchools.map((school: School) => (
              <button
                key={school._id}
                className={`modal-list-item ${
                  selectedSchool?._id === school._id ? "active" : ""
                }`}
                onClick={() => {
                  setSelectedSchool(school);
                  setSchoolModalOpen(false);
                }}
              >
                {school.school_name}
              </button>
            ))}
            {availableSchools.length === 0 && !isLoadingSchools && (
              <div className="modal-empty">No schools available</div>
            )}
          </div>
        </CModalBody>
      </CModal>

      {/* Campus Modal (Mobile) */}
      <CModal
        visible={campusModalOpen}
        onClose={() => setCampusModalOpen(false)}
        alignment="center"
        className="selector-modal"
      >
        <CModalHeader>
          <CModalTitle>Select Campus</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="modal-list">
            {availableCampuses.map((campus: Campus) => (
              <button
                key={campus._id}
                className={`modal-list-item ${
                  selectedCampus?._id === campus._id ? "active" : ""
                }`}
                onClick={() => {
                  setSelectedCampus(campus);
                  setCampusModalOpen(false);
                }}
              >
                {campus.campus_name}
              </button>
            ))}
            {availableCampuses.length === 0 && !isLoadingCampuses && (
              <div className="modal-empty">No campuses available</div>
            )}
          </div>
        </CModalBody>
      </CModal>
    </div>
  );
};

export default TopbarV2;
