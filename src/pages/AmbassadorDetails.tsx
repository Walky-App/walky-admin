import { useState, useEffect } from "react";
import {
  CCard,
  CCardBody,
  CForm,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CButton,
  CRow,
  CCol,
  CAlert,
  CFormText,
  CSpinner,
  CFormTextarea,
  CFormFeedback,
} from "@coreui/react";
import { useTheme } from "../hooks/useTheme";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import CIcon from "@coreui/icons-react";
import { cilSave, cilX, cilArrowLeft } from "@coreui/icons";
import { ambassadorService } from "../services/ambassadorService";
import {
  AmbassadorFormData,
  Ambassador as AmbassadorType,
} from "../types/ambassador";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryClient";

interface AmbassadorDetailsProps {
  ambassadorId?: string;
  inTabView?: boolean;
}

const AmbassadorDetails = ({
  ambassadorId,
  inTabView = false,
}: AmbassadorDetailsProps) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [, setIsValidating] = useState<boolean>(false);
  // Mutations for create and update
  const createAmbassadorMutation = useMutation({
    mutationFn: (data: AmbassadorFormData) => ambassadorService.create(data),
    onSuccess: (result) => {
      // Invalidate ambassadors query to refresh the list
      queryClient.invalidateQueries({ queryKey: queryKeys.ambassadors });
      setSaveSuccess(true);
      setSaveError(null);

      // Show detailed success message
      console.log("✅ Ambassador created successfully:", result);

      setTimeout(() => {
        navigate("/ambassadors", {
          state: {
            successMessage: `Ambassador "${result.name}" has been created successfully! They can now be assigned to campuses and start their role.`,
          },
        });
      }, 2000);
    },
    onError: (error) => {
      handleSaveError(error, "create");
    },
  });

  const updateAmbassadorMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<AmbassadorFormData>;
    }) => ambassadorService.update(id, data),
    onSuccess: (result) => {
      // Invalidate ambassadors query to refresh the list
      queryClient.invalidateQueries({ queryKey: queryKeys.ambassadors });
      setSaveSuccess(true);
      setSaveError(null);

      // Show detailed success message
      console.log("✅ Ambassador updated successfully:", result);

      setTimeout(() => {
        navigate("/ambassadors", {
          state: {
            successMessage: `Ambassador "${result.name}" has been updated successfully! All changes have been saved.`,
          },
        });
      }, 2000);
    },
    onError: (error) => {
      handleSaveError(error, "update");
    },
  });

  // Handle save errors
  const handleSaveError = (
    error: unknown,
    operation: "create" | "update" = "create"
  ) => {
    console.error(`Failed to ${operation} ambassador:`, error);

    // Enhanced error handling to show specific validation errors
    let errorMessage = `Failed to ${operation} ambassador. Please try again.`;

    if (error instanceof Error) {
      errorMessage = `Failed to ${operation} ambassador: ${error.message}`;
    } else if (typeof error === "object" && error !== null) {
      const errorObj = error as {
        response?: {
          data?: {
            message?: string;
            errors?: Record<string, unknown>;
            error?: string;
            details?: unknown;
          };
          status?: number;
        };
      };

      // Log full error details for debugging
      console.error("🔍 Full error response:", errorObj.response?.data);
      console.error("🔍 Error status:", errorObj.response?.status);

      if (errorObj.response?.data?.message) {
        errorMessage = `Failed to ${operation} ambassador: ${errorObj.response.data.message}`;
      } else if (errorObj.response?.data?.error) {
        errorMessage = `Failed to ${operation} ambassador: ${errorObj.response.data.error}`;
      } else if (errorObj.response?.data?.errors) {
        // Handle validation errors
        const validationErrors = errorObj.response.data.errors;
        const errorMessages = Object.keys(validationErrors).map((key) => {
          const error = validationErrors[key];
          const errorStr =
            typeof error === "object" && error !== null && "message" in error
              ? (error as { message: string }).message
              : String(error);
          return `${key}: ${errorStr}`;
        });
        errorMessage = `Validation failed: ${errorMessages.join(", ")}`;

        // Add helpful suggestions for common validation errors
        if (errorMessage.includes("email")) {
          errorMessage +=
            "\n\nTip: Please check that the email address is valid and not already in use.";
        }
        if (errorMessage.includes("name")) {
          errorMessage +=
            "\n\nTip: Ambassador name must be between 2-100 characters.";
        }
        if (errorMessage.includes("student_id")) {
          errorMessage +=
            "\n\nTip: Student ID must be unique and follow your institution's format.";
        }
      } else if (errorObj.response?.status === 400) {
        errorMessage =
          "Bad Request: Please check all required fields are filled correctly.";
      } else if (errorObj.response?.status === 409) {
        errorMessage = `Conflict: An ambassador with this ${
          operation === "create" ? "email or student ID" : "information"
        } already exists.`;
      } else if (errorObj.response?.status === 422) {
        errorMessage =
          "Validation Error: Please check that all fields contain valid information.";
      } else if (errorObj.response?.status && errorObj.response.status >= 500) {
        errorMessage =
          "Server Error: There was a problem on our end. Please try again in a few moments.";
      }
    }

    setSaveError(errorMessage);
    setSaveSuccess(false);

    // Auto-hide error after 8 seconds for better UX
    setTimeout(() => setSaveError(null), 8000);
  };

  // Form state
  const [ambassador, setAmbassador] = useState<AmbassadorFormData>({
    name: "",
    email: "",
    phone: "",
    student_id: "",
    is_active: true,
    profile_image_url: "",
    bio: "",
    graduation_year: undefined,
    major: "",
  });

  // Removed unused fillSampleData function

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form validation state
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Check if we're editing (have an ID) or creating new
  const effectiveId = ambassadorId || id;
  const isEditing = !!effectiveId && !effectiveId.startsWith("default-");

  // Load ambassador data if editing
  useEffect(() => {
    if (isEditing && effectiveId) {
      // Check if we have ambassador data in navigation state first
      if (location.state?.ambassadorData) {
        const ambassadorData = location.state.ambassadorData as AmbassadorType;
        console.log(
          "📝 Loading ambassador from navigation state:",
          ambassadorData
        );

        setAmbassador({
          name: ambassadorData.name || "",
          email: ambassadorData.email || "",
          phone: ambassadorData.phone || "",
          student_id: ambassadorData.student_id || "",
          is_active: ambassadorData.is_active ?? true,
          profile_image_url: ambassadorData.profile_image_url || "",
          bio: ambassadorData.bio || "",
          graduation_year: ambassadorData.graduation_year || undefined,
          major: ambassadorData.major || "",
        });
      } else {
        // Fallback: fetch from API
        console.log(
          "🔄 Fetching ambassador data from API for ID:",
          effectiveId
        );
        setIsLoading(true);
        ambassadorService
          .getById(effectiveId)
          .then((ambassadorData) => {
            console.log("✅ Loaded ambassador data:", ambassadorData);
            setAmbassador({
              name: ambassadorData.name || "",
              email: ambassadorData.email || "",
              phone: ambassadorData.phone || "",
              student_id: ambassadorData.student_id || "",
              is_active: ambassadorData.is_active ?? true,
              profile_image_url: ambassadorData.profile_image_url || "",
              bio: ambassadorData.bio || "",
              graduation_year: ambassadorData.graduation_year || undefined,
              major: ambassadorData.major || "",
            });
          })
          .catch((error) => {
            console.error("❌ Failed to load ambassador:", error);
            setSaveError("Failed to load ambassador data. Please try again.");
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    }
  }, [effectiveId, isEditing, location.state]);

  const handleInputChange = (
    field: keyof AmbassadorFormData,
    value: string | number | boolean | undefined
  ) => {
    setAmbassador((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Real-time validation for key fields
    if (field === "name" || field === "email") {
      validateField(field, value);
    }

    // Clear any existing save errors when user starts typing
    if (saveError) {
      setSaveError(null);
    }
  };

  // Form validation
  const validateForm = () => {
    const errors: Record<string, string> = {};

    // Name validation
    if (!ambassador.name.trim()) {
      errors.name = "Ambassador name is required.";
    } else if (ambassador.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters long.";
    } else if (ambassador.name.trim().length > 100) {
      errors.name = "Name must be less than 100 characters.";
    }

    // Email validation
    if (!ambassador.email.trim()) {
      errors.email = "Email address is required.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(ambassador.email)) {
        errors.email = "Please enter a valid email address.";
      }
    }

    // Phone validation (optional but if provided must be valid)
    if (ambassador.phone && ambassador.phone.trim()) {
      const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
      const cleanPhone = ambassador.phone.replace(/[\s\-()]/g, "");
      if (!phoneRegex.test(cleanPhone)) {
        errors.phone = "Please enter a valid phone number.";
      }
    }

    // Student ID validation (optional but if provided must be valid)
    if (ambassador.student_id && ambassador.student_id.trim()) {
      if (ambassador.student_id.trim().length < 3) {
        errors.student_id = "Student ID must be at least 3 characters.";
      } else if (ambassador.student_id.trim().length > 20) {
        errors.student_id = "Student ID must be less than 20 characters.";
      }
    }

    // Graduation year validation (optional but if provided must be reasonable)
    if (ambassador.graduation_year) {
      const currentYear = new Date().getFullYear();
      if (
        ambassador.graduation_year < currentYear - 10 ||
        ambassador.graduation_year > currentYear + 10
      ) {
        errors.graduation_year = `Graduation year must be between ${
          currentYear - 10
        } and ${currentYear + 10}.`;
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Real-time validation for specific fields
  const validateField = (
    fieldName: string,
    value: string | number | boolean | undefined
  ) => {
    const errors = { ...validationErrors };

    switch (fieldName) {
      case "name":
        if (!value || (typeof value === "string" && !value.trim())) {
          errors.name = "Ambassador name is required.";
        } else if (typeof value === "string" && value.trim().length < 2) {
          errors.name = "Name must be at least 2 characters long.";
        } else {
          delete errors.name;
        }
        break;
      case "email":
        if (!value || (typeof value === "string" && !value.trim())) {
          errors.email = "Email address is required.";
        } else if (typeof value === "string") {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            errors.email = "Please enter a valid email address.";
          } else {
            delete errors.email;
          }
        }
        break;
      default:
        delete errors[fieldName];
    }

    setValidationErrors(errors);
  };

  const handleSave = async () => {
    console.log("💾 Saving ambassador with data:", ambassador);

    // Clear previous errors
    setSaveError(null);
    setIsValidating(true);

    // Comprehensive validation
    if (!validateForm()) {
      setIsValidating(false);
      setSaveError("Please fix the validation errors below before saving.");
      setTimeout(() => setSaveError(null), 5000);
      return;
    }

    // Additional business logic validation
    if (ambassador.graduation_year) {
      const currentYear = new Date().getFullYear();
      if (ambassador.graduation_year < currentYear - 10) {
        setSaveError(
          "Graduation year seems too far in the past. Please verify this information."
        );
        setIsValidating(false);
        setTimeout(() => setSaveError(null), 5000);
        return;
      }
    }

    try {
      setIsValidating(false);

      if (isEditing && effectiveId) {
        console.log("📝 Updating ambassador with ID:", effectiveId);
        console.log("🔄 Update payload:", ambassador);
        updateAmbassadorMutation.mutate({ id: effectiveId, data: ambassador });
      } else {
        console.log("➕ Creating new ambassador");
        console.log("🔄 Create payload:", ambassador);
        createAmbassadorMutation.mutate(ambassador);
      }
    } catch (error) {
      console.error("❌ Save operation failed:", error);
      setIsValidating(false);
      handleSaveError(error, isEditing ? "update" : "create");
    }
  };

  const handleCancel = () => {
    navigate("/ambassadors");
  };

  const handleGoBack = () => {
    navigate("/ambassadors");
  };

  // Show loading state if we're fetching data
  if (isLoading) {
    return (
      <div className="page-container">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "200px" }}
        >
          <CSpinner color="primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Go Back Button */}
      {!inTabView && (
        <CButton
          variant="ghost"
          onClick={handleGoBack}
          className="back-button d-flex align-items-center mb-3"
        >
          <CIcon icon={cilArrowLeft} className="me-2" />
          Back to Ambassadors
        </CButton>
      )}

      <CCard className="campus-card">
        <CCardBody className="campus-card-body p-4">
          {saveSuccess && (
            <CAlert color="success" dismissible>
              Ambassador details saved successfully!
            </CAlert>
          )}

          {saveError && (
            <CAlert color="danger" dismissible>
              {saveError}
            </CAlert>
          )}

          <CForm>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="name" className="required-label">
                  Full Name
                </CFormLabel>
                <CFormInput
                  type="text"
                  id="name"
                  placeholder="Enter ambassador's full name"
                  value={ambassador.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={theme.isDark ? "dark-theme-input" : ""}
                  invalid={!!validationErrors.name}
                  required
                />
                {validationErrors.name && (
                  <CFormFeedback invalid>{validationErrors.name}</CFormFeedback>
                )}
                <CFormText>
                  The ambassador's full name as it should appear in the system.
                </CFormText>
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="email" className="required-label">
                  Email Address
                </CFormLabel>
                <CFormInput
                  type="email"
                  id="email"
                  placeholder="Enter email address"
                  value={ambassador.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={theme.isDark ? "dark-theme-input" : ""}
                  invalid={!!validationErrors.email}
                  required
                />
                {validationErrors.email && (
                  <CFormFeedback invalid>
                    {validationErrors.email}
                  </CFormFeedback>
                )}
                <CFormText>Primary email address for communication.</CFormText>
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="phone">Phone Number</CFormLabel>
                <CFormInput
                  type="tel"
                  id="phone"
                  placeholder="Enter phone number"
                  value={ambassador.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className={theme.isDark ? "dark-theme-input" : ""}
                />
                <CFormText>Optional contact phone number.</CFormText>
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="student_id">Student ID</CFormLabel>
                <CFormInput
                  type="text"
                  id="student_id"
                  placeholder="Enter student ID"
                  value={ambassador.student_id}
                  onChange={(e) =>
                    handleInputChange("student_id", e.target.value)
                  }
                  className={theme.isDark ? "dark-theme-input" : ""}
                />
                <CFormText>The ambassador's university student ID.</CFormText>
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={12}>
                <CFormLabel htmlFor="major">Major/Field of Study</CFormLabel>
                <CFormInput
                  type="text"
                  id="major"
                  placeholder="Enter major or field of study"
                  value={ambassador.major}
                  onChange={(e) => handleInputChange("major", e.target.value)}
                  className={theme.isDark ? "dark-theme-input" : ""}
                />
                <CFormText>
                  The ambassador's academic major or field of study.
                </CFormText>
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="graduation_year">
                  Graduation Year
                </CFormLabel>
                <CFormInput
                  type="number"
                  id="graduation_year"
                  placeholder="Enter graduation year"
                  value={ambassador.graduation_year || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "graduation_year",
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                  className={theme.isDark ? "dark-theme-input" : ""}
                  min="2020"
                  max="2030"
                />
                <CFormText>Expected or actual graduation year.</CFormText>
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="profile_image_url">
                  Profile Image URL
                </CFormLabel>
                <CFormInput
                  type="url"
                  id="profile_image_url"
                  placeholder="Enter profile image URL"
                  value={ambassador.profile_image_url}
                  onChange={(e) =>
                    handleInputChange("profile_image_url", e.target.value)
                  }
                  className={theme.isDark ? "dark-theme-input" : ""}
                />
                <CFormText>
                  Optional URL to the ambassador's profile photo.
                </CFormText>
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={12}>
                <CFormLabel htmlFor="bio">Biography</CFormLabel>
                <CFormTextarea
                  id="bio"
                  placeholder="Enter ambassador biography (optional)"
                  value={ambassador.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  className={theme.isDark ? "dark-theme-input" : ""}
                  rows={4}
                />
                <CFormText>
                  Optional biography or description about the ambassador.
                </CFormText>
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="is_active">Status</CFormLabel>
                <CFormSelect
                  id="is_active"
                  value={ambassador.is_active ? "true" : "false"}
                  onChange={(e) =>
                    handleInputChange("is_active", e.target.value === "true")
                  }
                  className={theme.isDark ? "dark-theme-select" : ""}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </CFormSelect>
                <CFormText>
                  Whether the ambassador is currently active in the system.
                </CFormText>
              </CCol>
            </CRow>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <CButton
                variant="outline"
                color="secondary"
                onClick={handleCancel}
                disabled={
                  createAmbassadorMutation.isPending ||
                  updateAmbassadorMutation.isPending
                }
              >
                <CIcon icon={cilX} className="me-2" />
                Cancel
              </CButton>
              <CButton
                color="primary"
                onClick={handleSave}
                disabled={
                  createAmbassadorMutation.isPending ||
                  updateAmbassadorMutation.isPending
                }
              >
                {createAmbassadorMutation.isPending ||
                updateAmbassadorMutation.isPending ? (
                  <CSpinner size="sm" className="me-2" />
                ) : (
                  <CIcon icon={cilSave} className="me-2" />
                )}
                {isEditing ? "Update Ambassador" : "Create Ambassador"}
              </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default AmbassadorDetails;
