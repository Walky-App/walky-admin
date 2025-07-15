import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getCurrentUserRole } from "../utils/UserRole";
import { Role } from "../types/Role";
import { schoolService } from "../services/schoolService";
import { useSchools } from "../hooks/useSchoolsQuery";
import { useTheme } from "../hooks/useTheme";
import { CIcon } from "@coreui/icons-react";
import { cilArrowLeft } from "@coreui/icons";
import { School } from "../types/school";

// Component for school logo with fallback
const SchoolLogo = ({ school }: { school: School }) => {
  const [logoError, setLogoError] = useState(false);
  const [logoLoading, setLogoLoading] = useState(true);

  const handleImageError = () => {
    setLogoError(true);
    setLogoLoading(false);
  };

  const handleImageLoad = () => {
    setLogoLoading(false);
  };

  // Check if we have a valid logo URL
  const hasValidLogo =
    school.logo_url && school.logo_url.trim() !== "" && !logoError;

  if (!hasValidLogo) {
    return <span className="fs-2">🏫</span>;
  }

  return (
    <div
      className="bg-white rounded-circle p-1 d-flex align-items-center justify-content-center overflow-hidden"
      style={{ width: "40px", height: "40px" }}
    >
      {logoLoading && (
        <div
          className="spinner-border spinner-border-sm text-primary"
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      )}
      <img
        src={school.logo_url}
        alt={`${school.display_name} logo`}
        className="w-100 h-100 rounded-circle"
        style={{
          objectFit: "cover",
          display: logoLoading ? "none" : "block",
        }}
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
    </div>
  );
};

export const SchoolSelection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const role = getCurrentUserRole();
  const { theme } = useTheme();

  // Use React Query to fetch schools
  const {
    data: schools = [],
    isLoading: loading,
    error,
    refetch,
  } = useSchools();

  // Debug: Log schools data
  useEffect(() => {
    if (schools.length > 0) {
      console.log("🏫 Schools data:", schools);
      schools.forEach((school, index) => {
        console.log(`School ${index + 1}:`, {
          id: school._id,
          name: school.display_name,
          logo_url: school.logo_url,
          is_active: school.is_active,
        });
      });
    }
  }, [schools]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (role !== Role.ADMIN) {
      navigate(`/${role}/dashboard`);
      return;
    }
  }, [user, role, navigate]);

  const handleSchoolSelect = (schoolId: string) => {
    // Find the selected school and store both ID and name
    const selectedSchool = schools.find((school) => school._id === schoolId);
    if (selectedSchool) {
      schoolService.setSelectedSchool(schoolId, selectedSchool.display_name);
    }

    // Navigate to admin dashboard with selected school
    navigate(`/${role}/dashboard`);
  };

  if (loading) {
    return (
      <div
        className="d-flex flex-column vh-100 align-items-center justify-content-center"
        style={{ backgroundColor: theme.colors.bodyBg }}
      >
        <div className="text-center">
          <div
            className="spinner-border text-primary mb-3"
            style={{ width: "3rem", height: "3rem" }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <h3 style={{ color: theme.colors.bodyColor }}>Loading Schools</h3>
          <p style={{ color: theme.colors.textMuted }}>
            Please wait while we fetch your available schools...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="d-flex flex-column vh-100 align-items-center justify-content-center px-4"
        style={{ backgroundColor: theme.colors.bodyBg }}
      >
        <div className="text-center" style={{ maxWidth: "400px" }}>
          <div
            className="card p-4"
            style={{
              backgroundColor: theme.colors.cardBg,
              border: `1px solid ${theme.colors.borderColor}`,
            }}
          >
            <div
              className="alert alert-danger d-flex align-items-center mb-3"
              style={{
                backgroundColor: "rgba(220, 53, 69, 0.1)",
                border: "1px solid rgba(220, 53, 69, 0.2)",
                color: theme.colors.danger,
              }}
            >
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              Unable to Load Schools
            </div>
            <p style={{ color: theme.colors.bodyColor }} className="mb-3">
              We encountered an error while fetching your schools. Please check
              your connection and try again.
            </p>
            <div
              className="alert alert-danger py-2 px-3 mb-3"
              style={{
                backgroundColor: "rgba(220, 53, 69, 0.05)",
                border: "1px solid rgba(220, 53, 69, 0.1)",
                fontSize: "0.875rem",
              }}
            >
              {error.message}
            </div>
            <button
              onClick={() => refetch()}
              className="btn btn-primary w-100"
              style={{ backgroundColor: theme.colors.primary }}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="d-flex flex-column vh-100"
      style={{ backgroundColor: theme.colors.bodyBg }}
    >
      {/* Header */}
      <div
        className="border-bottom py-3"
        style={{
          backgroundColor: theme.colors.cardBg,
          borderBottomColor: theme.colors.borderColor,
        }}
      >
        <div className="container-fluid">
          <div className="d-flex align-items-center justify-content-between">
            {/* Back Button */}
            <button
              onClick={() => navigate("/login")}
              className="btn btn-outline-secondary d-flex align-items-center"
              style={{
                borderColor: theme.colors.borderColor,
                color: theme.colors.bodyColor,
              }}
            >
              <CIcon icon={cilArrowLeft} className="me-2" size="sm" />
              Back
            </button>

            {/* Logo and Title */}
            <div className="d-flex align-items-center">
              <img
                src="/Walky Logo_Duotone.svg"
                alt="Walky Logo"
                className="me-3"
                style={{ height: "40px" }}
              />
              <div className="text-center">
                <h1
                  className="mb-0 h4"
                  style={{ color: theme.colors.bodyColor }}
                >
                  Walky Admin
                </h1>
                <small style={{ color: theme.colors.textMuted }}>
                  School Management Portal
                </small>
              </div>
            </div>

            {/* Spacer to center the logo */}
            <div style={{ width: "100px" }}></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main
        className="flex-grow-1 p-4 overflow-auto"
        style={{
          backgroundColor: theme.colors.bodyBg,
          color: theme.colors.bodyColor,
        }}
      >
        <div className="container-fluid" style={{ maxWidth: "1200px" }}>
          {/* Page Header */}
          <div className="text-center mb-5">
            <h2
              className="display-6 fw-bold mb-3"
              style={{ color: theme.colors.bodyColor }}
            >
              Select Your School
            </h2>
            <p
              className="lead"
              style={{
                color: theme.colors.textMuted,
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              Choose a school to manage from the list below. You'll be able to
              access student data, campus information, and administrative tools
              for your selected institution.
            </p>
          </div>

          {schools.length === 0 ? (
            <div className="text-center py-5">
              <div
                className="card mx-auto p-5"
                style={{
                  maxWidth: "400px",
                  backgroundColor: theme.colors.cardBg,
                  border: `1px solid ${theme.colors.borderColor}`,
                }}
              >
                <div className="display-1 mb-3">🏫</div>
                <h5
                  className="card-title"
                  style={{ color: theme.colors.bodyColor }}
                >
                  No schools available
                </h5>
                <p
                  className="card-text"
                  style={{ color: theme.colors.textMuted }}
                >
                  Please contact your administrator to assign schools to your
                  account.
                </p>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {schools.map((school) => (
                <div key={school._id} className="col-12 col-md-6 col-lg-4">
                  <button
                    onClick={() => handleSchoolSelect(school._id)}
                    className="card h-100 w-100 text-start border-0 shadow-sm school-card"
                    style={{
                      backgroundColor: theme.colors.cardBg,
                      border: `1px solid ${theme.colors.borderColor}`,
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-5px)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 25px rgba(0,0,0,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 2px 10px rgba(0,0,0,0.1)";
                    }}
                  >
                    {/* Card Header */}
                    <div
                      className="card-header text-white position-relative"
                      style={{
                        background:
                          "linear-gradient(135deg, #007bff 0%, #28a745 100%)",
                        border: "none",
                      }}
                    >
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                          <SchoolLogo school={school} />
                        </div>
                        <i className="bi bi-arrow-right fs-5 opacity-75"></i>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="card-body">
                      <h5
                        className="card-title mb-2"
                        style={{ color: theme.colors.bodyColor }}
                      >
                        {school.display_name}
                      </h5>

                      <p
                        className="card-text small mb-3 d-flex align-items-center"
                        style={{ color: theme.colors.textMuted }}
                      >
                        <i className="bi bi-envelope me-2"></i>
                        {school.email_domain}
                      </p>

                      {/* Status Badge */}
                      <div className="mb-3">
                        <span
                          className={`badge ${
                            school.is_active ? "bg-success" : "bg-danger"
                          } d-inline-flex align-items-center`}
                        >
                          <span
                            className={`badge rounded-pill me-1 ${
                              school.is_active
                                ? "bg-light text-success"
                                : "bg-light text-danger"
                            }`}
                            style={{
                              width: "6px",
                              height: "6px",
                              padding: "0",
                            }}
                          ></span>
                          {school.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>

                      {/* Action Text */}
                      <div
                        className="d-flex align-items-center small fw-medium"
                        style={{ color: theme.colors.primary }}
                      >
                        <span>Manage School</span>
                        <i className="bi bi-chevron-right ms-2"></i>
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer
        className="py-3 border-top text-center"
        style={{
          backgroundColor: theme.colors.cardBg,
          borderTopColor: theme.colors.borderColor + " !important",
          color: theme.colors.textMuted,
        }}
      >
        <div className="d-flex align-items-center justify-content-center">
          <i className="bi bi-shield-lock me-2"></i>
          <small>Secure school management portal</small>
        </div>
      </footer>
    </div>
  );
};
