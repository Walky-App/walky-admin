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
import { apiClient } from "../../API";
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
  const { user, isSuperAdmin, isSchoolAdmin } = useAuth();

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

      try {
        const isSuper = isSuperAdmin();
        let schools: School[] = [];

        if (isSuper) {
          const response = await apiClient.api.adminV2SchoolsList();
          console.log("Schools API response:", response);

          type RawSchool = { _id?: string; id?: string; school_name?: string; name?: string };
          let rawSchools: RawSchool[] = [];

          // Handle different response structures
          const responseData = response.data as RawSchool[] | { data?: RawSchool[] };
          if (Array.isArray(responseData)) {
            rawSchools = responseData;
          } else if (responseData && Array.isArray(responseData.data)) {
            rawSchools = responseData.data;
          }

          schools = rawSchools.map((s) => ({
            ...s,
            school_name: s.school_name || s.name || "Unknown School",
            _id: s._id || s.id || "",
            id: s.id || s._id || "",
          })) as School[];
          console.log("Parsed schools:", schools);
        } else {
          // Handle case where school_id might be an object (populated) or string
          const schoolId = typeof user.school_id === 'object' && user.school_id !== null
            ? (user.school_id as any)._id || (user.school_id as any).id
            : user.school_id;

          if (!schoolId) {
            console.warn("No valid school_id found for user");
            setIsLoadingSchools(false);
            hasInitializedSchools.current = true;
            return;
          }

          const response = await apiClient.api.schoolDetail(schoolId);
          console.log("School detail API response:", response);
          type RawSchool = { _id?: string; id?: string; school_name?: string; name?: string };
          const data = response.data as RawSchool | undefined;
          const rawSchools = data ? [data] : [];

          schools = rawSchools.map((s) => ({
            ...s,
            school_name: s.school_name || s.name || "Unknown School",
            _id: s._id || s.id || "",
            id: s.id || s._id || "",
          })) as School[];
        }

        console.log("Setting available schools:", schools);
        setAvailableSchools(schools);

        // Auto-select first school if none selected
        const hasSchools = schools.length > 0;
        if (hasSchools && !selectedSchool) {
          setSelectedSchool(schools[0]);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Fetch campuses when user or selectedSchool changes
  useEffect(() => {
    if (!user) return;

    const fetchCampuses = async () => {
      setIsLoadingCampuses(true);

      try {
        const isSuper = isSuperAdmin();
        const isSchool = isSchoolAdmin();
        let campuses: Campus[] = [];

        if (isSuper || isSchool) {
          // For super_admin: use selected school
          // For school_admin: use their assigned school_id
          let schoolId: string | undefined;
          if (isSuper) {
            schoolId = selectedSchool?._id || selectedSchool?.id;
          } else {
            // school_admin uses their own school_id
            schoolId = typeof user.school_id === 'object' && user.school_id !== null
              ? (user.school_id as any)._id || (user.school_id as any).id
              : user.school_id;
          }

          const response = await apiClient.api.adminV2CampusesList(
            schoolId ? { school_id: schoolId } : undefined
          );

          type RawCampus = { _id?: string; id?: string; campus_name?: string; name?: string; school_id?: string; schoolId?: string; is_active?: boolean; status?: string; image_url?: string; imageUrl?: string };
          const responseData = response.data as RawCampus[] | { data?: RawCampus[]; campuses?: RawCampus[] };

          let rawCampuses: RawCampus[] = [];
          if (Array.isArray(responseData)) {
            rawCampuses = responseData;
          } else if (responseData && Array.isArray(responseData.data)) {
            rawCampuses = responseData.data;
          } else if (responseData && Array.isArray(responseData.campuses)) {
            rawCampuses = responseData.campuses;
          }

          campuses = rawCampuses.map((c) => ({
            campus_name: c.campus_name || c.name || "Unknown Campus",
            _id: c._id || c.id || "",
          })) as Campus[];
        } else if (user.campus_id) {
          const response = await apiClient.api.campusesDetail(
            user.campus_id
          );
          type RawCampus = { _id?: string; id?: string; campus_name?: string; name?: string; data?: RawCampus; campus?: RawCampus };
          const data = response.data as RawCampus | undefined;
          let rawCampuses: RawCampus[] = [];

          if (data) {
            if (data.data) rawCampuses = [data.data];
            else if (data.campus) rawCampuses = [data.campus];
            else rawCampuses = [data];
          }

          campuses = rawCampuses.map((c) => ({
            ...c,
            campus_name: c.campus_name || c.name || "Unknown Campus",
            _id: c._id || c.id || "",
            id: c.id || c._id || "",
          })) as Campus[];
        }

        setAvailableCampuses(campuses);

        // Auto-select first campus if current selection is invalid or empty
        // Or if we just switched schools and need to reset
        const hasCampuses = campuses.length > 0;

        // If we have a selected campus, check if it's in the new list
        const isSelectedInList =
          selectedCampus && campuses.some((c) => c._id === selectedCampus._id);

        if (!isSelectedInList) {
          if (hasCampuses) {
            setSelectedCampus(campuses[0]);
          } else {
            setSelectedCampus(null);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, selectedSchool]);

  // Get user display name and avatar
  const userName = user ? `${user.first_name} ${user.last_name}` : "Admin Name";
  const userAvatar =
    user?.avatar_url ||
    "https://ui-avatars.com/api/?name=" +
      encodeURIComponent(userName) +
      "&background=4A5568&color=fff";

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Reload/Redirect to login
    window.location.href = "/login";
  };

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
          {/* School and Campus Selectors - Dropdown for super admins, read-only display for others */}
          <div className="selector-container">
            {isSuperAdmin() ? (
              // Super admin: Interactive dropdowns
              isMobile ? (
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
                    <AssetIcon
                      name="arrow-down"
                      size={18}
                      fill="var(--v2-neutral-black-main-500)"
                    />
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
                      fill="var(--v2-neutral-black-main-500)"
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
                                fill="var(--v2-neutral-black-main-500)"
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
                                fill="var(--v2-neutral-black-main-500)"
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
              )
            ) : isSchoolAdmin() ? (
              // School admin: Read-only school, but can select campus
              <>
                <div className="selector-group">
                  <div className="selector-icon">
                    <AssetIcon
                      name="school-icon"
                      color={theme.colors.bodyColor}
                    />
                  </div>
                  <div className="selector-info">
                    <span className="selector-label">Your school</span>
                    <span className="selector-value-readonly">
                      {isLoadingSchools ? (
                        <CSpinner size="sm" />
                      ) : (
                        selectedSchool?.school_name || "Not assigned"
                      )}
                    </span>
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
                    {isMobile ? (
                      <button
                        className="selector-icon-btn"
                        onClick={() => setCampusModalOpen(true)}
                        aria-label="Select campus"
                        style={{ padding: 0, minWidth: 'auto' }}
                      >
                        <span className="selector-btn-text">
                          {selectedCampus?.campus_name || "Select Campus"}
                        </span>
                        <AssetIcon
                          name="arrow-down"
                          size={18}
                          fill="var(--v2-neutral-black-main-500)"
                        />
                      </button>
                    ) : (
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
                                fill="var(--v2-neutral-black-main-500)"
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
                    )}
                  </div>
                </div>
              </>
            ) : (
              // Other admins: Read-only display of school and campus
              <>
                <div className="selector-group">
                  <div className="selector-icon">
                    <AssetIcon
                      name="school-icon"
                      color={theme.colors.bodyColor}
                    />
                  </div>
                  <div className="selector-info">
                    <span className="selector-label">Your school</span>
                    <span className="selector-value-readonly">
                      {isLoadingSchools ? (
                        <CSpinner size="sm" />
                      ) : (
                        selectedSchool?.school_name || "Not assigned"
                      )}
                    </span>
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
                    <span className="selector-value-readonly">
                      {isLoadingCampuses ? (
                        <CSpinner size="sm" />
                      ) : (
                        selectedCampus?.campus_name || "Not assigned"
                      )}
                    </span>
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
                <AssetIcon
                  name="arrow-down"
                  size={20}
                  fill="var(--v2-neutral-black-main-500)"
                />

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
                  onClick={() => navigate("/admin/settings")}
                  className="user-dropdown-item settings-item"
                >
                  <span>Administrator settings</span>
                  <AssetIcon
                    name="arrow-down"
                    size={24}
                    fill="var(--v2-neutral-black-main-500)"
                  />
                </CDropdownItem>
                <CDropdownItem
                  href="#"
                  onClick={handleLogout}
                  className="user-dropdown-item logout-item"
                >
                  <span>Logout</span>
                  <AssetIcon
                    name="logout-icon"
                    size={24}
                    color={theme.colors.bodyColor}
                  />
                </CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          </div>
        </div>
      </CContainer>

      {/* Bottom Border */}
      <div className="topbar-border" />

      {/* School Modal (Mobile) - Only for super admins */}
      {isSuperAdmin() && (
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
      )}

      {/* Campus Modal (Mobile) - For super admins and school admins */}
      {(isSuperAdmin() || isSchoolAdmin()) && (
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
      )}
    </div>
  );
};

export default TopbarV2;
