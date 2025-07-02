import React, { useState, useEffect } from "react";
import {
  CCard,
  CCardHeader,
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
  CFormFeedback,
} from "@coreui/react";
import { useTheme } from "../hooks/useTheme";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import CIcon from "@coreui/icons-react";
import { cilSave, cilX, cilArrowLeft } from "@coreui/icons";
import MultiSelectDropdown from "../components/MultiSelectDropdown";
import CampusBoundary from "./CampusBoundary";
import { CampusDetailsSkeleton } from "../components";
import { campusService } from "../services/campusService";
import { ambassadorService } from "../services/ambassadorService";
import { CampusFormData, Campus as CampusType } from "../types/campus";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryClient";

interface CampusBoundaryData {
  geometry: {
    type: string;
    coordinates: number[][][];
  };
}

interface CampusDetailsProps {
  campusId?: string;
  inTabView?: boolean;
}

const CampusDetails = ({ campusId, inTabView = false }: CampusDetailsProps) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const queryClient = useQueryClient();

  // Get ambassadors for the dropdown
  const { data: ambassadors = [], isLoading: loadingAmbassadors } = useQuery({
    queryKey: queryKeys.ambassadors,
    queryFn: ambassadorService.getAll,
  });

  // Mutations for create and update
  const createCampusMutation = useMutation({
    mutationFn: (data: CampusFormData) => campusService.create(data),
    onSuccess: (result) => {
      // Invalidate campuses query to refresh the list
      queryClient.invalidateQueries({ queryKey: queryKeys.campuses });
      setSaveSuccess(true);
      setTimeout(() => {
        navigate("/campuses", {
          state: {
            successMessage: `Campus "${
              result.campus_name || result.name
            }" created successfully!`,
          },
        });
      }, 1500);
    },
    onError: (error) => {
      handleSaveError(error);
    },
  });

  const updateCampusMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CampusFormData> }) =>
      campusService.update(id, data),
    onSuccess: (result) => {
      // Invalidate campuses query to refresh the list
      queryClient.invalidateQueries({ queryKey: queryKeys.campuses });
      setSaveSuccess(true);
      setTimeout(() => {
        navigate("/campuses", {
          state: {
            successMessage: `Campus "${
              result.campus_name || result.name
            }" updated successfully!`,
          },
        });
      }, 1500);
    },
    onError: (error) => {
      handleSaveError(error);
    },
  });

  // Handle save errors
  const handleSaveError = (error: unknown) => {
    console.error("Failed to save campus:", error);

    // Enhanced error handling to show specific validation errors
    let errorMessage = "Failed to save campus. Please try again.";

    if (error instanceof Error) {
      errorMessage = `Failed to save campus: ${error.message}`;
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
        errorMessage = `Failed to save campus: ${errorObj.response.data.message}`;
      } else if (errorObj.response?.data?.error) {
        errorMessage = `Failed to save campus: ${errorObj.response.data.error}`;
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
      } else if (errorObj.response?.status === 400) {
        errorMessage =
          "Bad Request: Please check all required fields are filled correctly.";
      }
    }

    setSaveError(errorMessage);
  };

  // State for form data
  const [campus, setCampus] = useState<CampusType | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [selectedAmbassadors, setSelectedAmbassadors] = useState<string[]>([]);

  // New state for validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // State for campus polygon
  const [campusPolygon, setCampusPolygon] = useState<CampusBoundaryData | null>(
    null
  );
  const [polygonError, setPolygonError] = useState<string>("");

  // Helper functions to convert between time formats
  const minutesToTimeString = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}`;
  };

  const timeStringToMinutes = (timeString: string): number => {
    const [hours, minutes] = timeString.split(":").map(Number);
    return hours * 60 + minutes;
  };

  // Fetch campus data on mount
  useEffect(() => {
    const loadCampusData = () => {
      // Check if campus data was passed through navigation state
      const campusDataFromState = location.state?.campusData;

      if (campusDataFromState) {
        console.log(
          "📋 Using campus data from navigation state:",
          campusDataFromState
        );
        setCampus(campusDataFromState);

        // Set selected ambassadors from ambassador_ids
        const ambassadorIds = campusDataFromState.ambassador_ids || [];
        setSelectedAmbassadors(ambassadorIds);

        // If campus has coordinates, set the polygon
        if (campusDataFromState.coordinates) {
          setCampusPolygon({
            geometry: {
              type: campusDataFromState.coordinates.type,
              coordinates: campusDataFromState.coordinates.coordinates,
            },
          });
        }
      } else {
        // Create new campus (no campus data in state)
        createDefaultCampus();
      }
    };

    const createDefaultCampus = () => {
      const randomNum = Math.floor(Math.random() * 1000) + 1;
      setCampus({
        id: `default-${randomNum}`,
        campus_name: "",
        city: "",
        state: "",
        zip: "",
        phone_number: "",
        time_zone: "",
        image_url: "",
        address: "",
        ambassador_ids: [],
        is_active: true,
        dawn_to_dusk: [360, 1200],
        // Legacy fields for compatibility
        name: "",
        location: "",
        status: undefined,
      });
      setSelectedAmbassadors([]);
    };

    loadCampusData();
  }, [campusId, id, location.search, location.state]);

  // Handle ambassadors change
  const handleAmbassadorsChange = (ambassadorIds: string[]) => {
    if (!campus) return;

    console.log("📋 Selected ambassador IDs:", ambassadorIds);
    setSelectedAmbassadors(ambassadorIds);

    // Update campus with only the ambassador IDs
    setCampus({
      ...campus,
      ambassador_ids: ambassadorIds, // Send only ambassador IDs
    });
  };
  // Validate form
  const validateForm = () => {
    if (!campus) return false;

    const newErrors: Record<string, string> = {};

    // Check campus name (use new field name if available, fallback to legacy)
    const campusName = campus.campus_name || campus.name || "";
    if (!campusName.trim()) {
      newErrors.campus_name = "Campus name is required.";
    }

    // Check required backend fields
    const city = campus.city || "";
    if (!city.trim()) {
      newErrors.city = "City is required.";
    }

    const state = campus.state || "";
    if (!state.trim()) {
      newErrors.state = "State is required.";
    }

    const zip = campus.zip || "";
    if (!zip.trim()) {
      newErrors.zip = "ZIP code is required.";
    }

    const phoneNumber = campus.phone_number || "";
    if (!phoneNumber.trim()) {
      newErrors.phone_number = "Phone number is required.";
    }

    const timeZone = campus.time_zone || "";
    if (!timeZone.trim()) {
      newErrors.time_zone = "Time zone is required.";
    }

    const address = campus.address || "";
    if (!address.trim()) {
      newErrors.address = "Address is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!campusPolygon) {
      setPolygonError(
        "You must define the campus boundary polygon on the map before saving."
      );
      return;
    }

    if (!validateForm()) {
      return;
    }

    if (!campus) return;

    setSaveSuccess(false);
    setSaveError("");

    // Determine if this is a create or update operation
    const effectiveCampusId =
      campusId || id || new URLSearchParams(location.search).get("id") || "";

    const isCreating =
      !effectiveCampusId || effectiveCampusId.startsWith("default-");

    // Prepare campus data for API
    const campusData: CampusFormData = {
      campus_name: campus.campus_name || campus.name || "",
      image_url:
        "https://via.placeholder.com/400x200/cccccc/666666?text=Campus+Image", // Provide a proper placeholder URL since backend //requires non-empty image_url // todo: ask about the image
      ambassador_ids: campus.ambassador_ids || [], // Send only ambassador IDs
      phone_number: campus.phone_number || "",
      address: campus.address || "",
      city: campus.city || "",
      state: campus.state || "",
      zip: campus.zip || "",
      coordinates: campusPolygon?.geometry
        ? {
            type: campusPolygon.geometry.type,
            coordinates: campusPolygon.geometry.coordinates,
          }
        : undefined,
      dawn_to_dusk: campus.dawn_to_dusk || [360, 1200], // Default: 6:00 AM (360 min) and 8:00 PM (1200 min)
      time_zone: campus.time_zone || "",
      is_active: campus.is_active !== false, // Default to true if not explicitly set to false
      // Backend handles school_id, enabled, and created_by automatically
    };

    // Log the campus data being sent for debugging
    console.log("Campus data being sent to API:", campusData);
    console.log("Selected Ambassadors:", selectedAmbassadors);
    console.log("Ambassador IDs being sent:", campusData.ambassador_ids);
    console.log("Ambassador IDs type:", typeof campusData.ambassador_ids);
    console.log("Ambassador IDs value:", campusData.ambassador_ids);
    console.log(
      "Is ambassador_ids array?",
      Array.isArray(campusData.ambassador_ids)
    );

    if (isCreating) {
      // Create new campus using mutation
      createCampusMutation.mutate(campusData);
    } else {
      // Update existing campus using mutation
      updateCampusMutation.mutate({ id: effectiveCampusId, data: campusData });
    }

    setPolygonError("");
  };

  // Handle cancel
  const handleCancel = () => {
    navigate("/campuses");
  };

  // Convert ambassadors array to dropdown options
  const studentOptions =
    ambassadors?.map((ambassador) => ({
      value: ambassador._id || ambassador.id, // Use _id from MongoDB or fallback to id
      label: `${ambassador.name} - ${ambassador.email}`,
    })) || [];

  console.log("📋 Available ambassadors:", ambassadors);
  console.log("📋 Student options:", studentOptions);
  console.log("📋 Selected ambassadors:", selectedAmbassadors);
  console.log("📋 Current campus ambassador_ids:", campus?.ambassador_ids);

  // For tab view, adjust padding
  const containerPadding = inTabView ? "0" : "p-4";

  // While loading
  if (!campus) {
    return <CampusDetailsSkeleton inTabView={inTabView} />;
  }

  const isSaving =
    createCampusMutation.isPending || updateCampusMutation.isPending;

  return (
    <div className={containerPadding} style={{ position: "relative" }}>
      {/* Saving Overlay */}
      {isSaving && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              backgroundColor: theme.colors.cardBg,
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              border: `1px solid ${theme.colors.borderColor}`,
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <CSpinner size="sm" />
            <span style={{ color: theme.colors.bodyColor }}>
              Saving campus...
            </span>
          </div>
        </div>
      )}

      {/* Go Back Button */}
      {!inTabView && (
        <CButton
          variant="ghost"
          onClick={() => navigate("/campuses")}
          className="back-button d-flex align-items-center mb-3"
        >
          <CIcon icon={cilArrowLeft} className="me-2" />
          Back to Campuses
        </CButton>
      )}

      <CCard
        style={{
          backgroundColor: theme.colors.cardBg,
          borderColor: theme.colors.borderColor,
        }}
      >
        <CCardHeader
          style={{
            backgroundColor: theme.colors.cardBg,
            borderColor: theme.colors.borderColor,
            color: theme.colors.bodyColor,
          }}
          className="campus-card-header"
        >
          <h4 className="mb-0 fw-semibold">
            {campus.id && !campus.id.startsWith("default-")
              ? "Edit Campus"
              : "New Campus"}
          </h4>
        </CCardHeader>
        <CCardBody className="p-4">
          {saveSuccess && (
            <CAlert color="success" dismissible>
              Campus details saved successfully!
            </CAlert>
          )}

          {saveError && (
            <CAlert color="danger" dismissible>
              {saveError}
            </CAlert>
          )}

          {polygonError && (
            <CAlert
              color="danger"
              dismissible
              onClose={() => setPolygonError("")}
            >
              {polygonError}
            </CAlert>
          )}

          <CForm noValidate onSubmit={handleSubmit}>
            <CRow>
              <CCol md={7}>
                <h5 className="mb-3" style={{ color: theme.colors.bodyColor }}>
                  Basic Information
                </h5>

                <div className="mb-3">
                  <CFormLabel
                    htmlFor="campusName"
                    style={{ color: theme.colors.bodyColor }}
                  >
                    Campus Name*
                  </CFormLabel>
                  <CFormInput
                    id="campusName"
                    value={campus.campus_name || campus.name || ""}
                    onChange={(e) => {
                      setCampus({
                        ...campus,
                        campus_name: e.target.value,
                        name: e.target.value, // Keep legacy field for compatibility
                      });
                      setErrors((prev) => ({ ...prev, campus_name: "" }));
                    }}
                    required
                    invalid={!!errors.campus_name}
                    style={{
                      backgroundColor: theme.isDark ? "#343a40" : undefined,
                      color: theme.isDark ? "#fff" : undefined,
                      borderColor: theme.colors.borderColor,
                    }}
                  />
                  {errors.campus_name && (
                    <CFormFeedback invalid>{errors.campus_name}</CFormFeedback>
                  )}
                </div>

                <div className="mb-3">
                  <CFormLabel
                    htmlFor="phoneNumber"
                    style={{ color: theme.colors.bodyColor }}
                  >
                    Phone Number*
                  </CFormLabel>
                  <CFormInput
                    id="phoneNumber"
                    value={campus.phone_number || ""}
                    onChange={(e) => {
                      setCampus({
                        ...campus,
                        phone_number: e.target.value,
                      });
                      setErrors((prev) => ({ ...prev, phone_number: "" }));
                    }}
                    required
                    invalid={!!errors.phone_number}
                    style={{
                      backgroundColor: theme.isDark ? "#343a40" : undefined,
                      color: theme.isDark ? "#fff" : undefined,
                      borderColor: theme.colors.borderColor,
                    }}
                    placeholder="(555) 123-4567"
                  />
                  {errors.phone_number && (
                    <CFormFeedback invalid>{errors.phone_number}</CFormFeedback>
                  )}
                </div>

                <div className="mb-3">
                  <CFormLabel
                    htmlFor="campusAddress"
                    style={{ color: theme.colors.bodyColor }}
                  >
                    Full Address*
                  </CFormLabel>
                  <CFormInput
                    id="campusAddress"
                    value={campus.address || ""}
                    onChange={(e) => {
                      setCampus({
                        ...campus,
                        address: e.target.value,
                      });
                      setErrors((prev) => ({ ...prev, address: "" }));
                    }}
                    required
                    invalid={!!errors.address}
                    style={{
                      backgroundColor: theme.isDark ? "#343a40" : undefined,
                      color: theme.isDark ? "#fff" : undefined,
                      borderColor: theme.colors.borderColor,
                    }}
                    placeholder="123 University Ave"
                  />
                  {errors.address && (
                    <CFormFeedback invalid>{errors.address}</CFormFeedback>
                  )}
                </div>

                <CRow>
                  <CCol md={6}>
                    <div className="mb-3">
                      <CFormLabel
                        htmlFor="city"
                        style={{ color: theme.colors.bodyColor }}
                      >
                        City*
                      </CFormLabel>
                      <CFormInput
                        id="city"
                        value={campus.city || ""}
                        onChange={(e) => {
                          setCampus({
                            ...campus,
                            city: e.target.value,
                          });
                          setErrors((prev) => ({ ...prev, city: "" }));
                        }}
                        required
                        invalid={!!errors.city}
                        style={{
                          backgroundColor: theme.isDark ? "#343a40" : undefined,
                          color: theme.isDark ? "#fff" : undefined,
                          borderColor: theme.colors.borderColor,
                        }}
                        placeholder="Miami"
                      />
                      {errors.city && (
                        <CFormFeedback invalid>{errors.city}</CFormFeedback>
                      )}
                    </div>
                  </CCol>
                  <CCol md={4}>
                    <div className="mb-3">
                      <CFormLabel
                        htmlFor="state"
                        style={{ color: theme.colors.bodyColor }}
                      >
                        State*
                      </CFormLabel>
                      <CFormInput
                        id="state"
                        value={campus.state || ""}
                        onChange={(e) => {
                          setCampus({
                            ...campus,
                            state: e.target.value,
                          });
                          setErrors((prev) => ({ ...prev, state: "" }));
                        }}
                        required
                        invalid={!!errors.state}
                        style={{
                          backgroundColor: theme.isDark ? "#343a40" : undefined,
                          color: theme.isDark ? "#fff" : undefined,
                          borderColor: theme.colors.borderColor,
                        }}
                        placeholder="FL"
                      />
                      {errors.state && (
                        <CFormFeedback invalid>{errors.state}</CFormFeedback>
                      )}
                    </div>
                  </CCol>
                  <CCol md={2}>
                    <div className="mb-3">
                      <CFormLabel
                        htmlFor="zip"
                        style={{ color: theme.colors.bodyColor }}
                      >
                        ZIP*
                      </CFormLabel>
                      <CFormInput
                        id="zip"
                        value={campus.zip || ""}
                        onChange={(e) => {
                          setCampus({
                            ...campus,
                            zip: e.target.value,
                          });
                          setErrors((prev) => ({ ...prev, zip: "" }));
                        }}
                        required
                        invalid={!!errors.zip}
                        style={{
                          backgroundColor: theme.isDark ? "#343a40" : undefined,
                          color: theme.isDark ? "#fff" : undefined,
                          borderColor: theme.colors.borderColor,
                        }}
                        placeholder="33199"
                      />
                      {errors.zip && (
                        <CFormFeedback invalid>{errors.zip}</CFormFeedback>
                      )}
                    </div>
                  </CCol>
                </CRow>

                <div className="mb-3">
                  <CFormLabel
                    htmlFor="timeZone"
                    style={{ color: theme.colors.bodyColor }}
                  >
                    Time Zone*
                  </CFormLabel>
                  <CFormSelect
                    id="timeZone"
                    value={campus.time_zone || ""}
                    onChange={(e) => {
                      setCampus({
                        ...campus,
                        time_zone: e.target.value,
                      });
                      setErrors((prev) => ({ ...prev, time_zone: "" }));
                    }}
                    required
                    invalid={!!errors.time_zone}
                    style={{
                      backgroundColor: theme.isDark ? "#343a40" : undefined,
                      color: theme.isDark ? "#fff" : undefined,
                      borderColor: theme.colors.borderColor,
                    }}
                  >
                    <option value="">Select Time Zone</option>
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">
                      Pacific Time (PT)
                    </option>
                    <option value="America/Anchorage">Alaska Time (AT)</option>
                    <option value="Pacific/Honolulu">Hawaii Time (HT)</option>
                  </CFormSelect>
                  {errors.time_zone && (
                    <CFormFeedback invalid>{errors.time_zone}</CFormFeedback>
                  )}
                </div>

                <CRow>
                  <CCol md={6}>
                    <div className="mb-3">
                      <CFormLabel
                        htmlFor="dawnTime"
                        style={{ color: theme.colors.bodyColor }}
                      >
                        Dawn Time
                      </CFormLabel>
                      <CFormInput
                        id="dawnTime"
                        type="time"
                        value={
                          campus.dawn_to_dusk?.[0]
                            ? minutesToTimeString(campus.dawn_to_dusk[0])
                            : "06:00"
                        }
                        onChange={(e) => {
                          const newMinutes = timeStringToMinutes(
                            e.target.value
                          );
                          const newDawnToDusk = [
                            ...(campus.dawn_to_dusk || [360, 1200]),
                          ];
                          newDawnToDusk[0] = newMinutes;
                          setCampus({
                            ...campus,
                            dawn_to_dusk: newDawnToDusk,
                          });
                        }}
                        style={{
                          backgroundColor: theme.isDark ? "#343a40" : undefined,
                          color: theme.isDark ? "#fff" : undefined,
                          borderColor: theme.colors.borderColor,
                        }}
                      />
                    </div>
                  </CCol>
                  <CCol md={6}>
                    <div className="mb-3">
                      <CFormLabel
                        htmlFor="duskTime"
                        style={{ color: theme.colors.bodyColor }}
                      >
                        Dusk Time
                      </CFormLabel>
                      <CFormInput
                        id="duskTime"
                        type="time"
                        value={
                          campus.dawn_to_dusk?.[1]
                            ? minutesToTimeString(campus.dawn_to_dusk[1])
                            : "20:00"
                        }
                        onChange={(e) => {
                          const newMinutes = timeStringToMinutes(
                            e.target.value
                          );
                          const newDawnToDusk = [
                            ...(campus.dawn_to_dusk || [360, 1200]),
                          ];
                          newDawnToDusk[1] = newMinutes;
                          setCampus({
                            ...campus,
                            dawn_to_dusk: newDawnToDusk,
                          });
                        }}
                        style={{
                          backgroundColor: theme.isDark ? "#343a40" : undefined,
                          color: theme.isDark ? "#fff" : undefined,
                          borderColor: theme.colors.borderColor,
                        }}
                      />
                    </div>
                  </CCol>
                </CRow>
                <CFormText style={{ color: theme.colors.textMuted }}>
                  Operating hours for campus security and monitoring.
                </CFormText>
              </CCol>

              <CCol md={5}>
                <h5 className="mb-3" style={{ color: theme.colors.bodyColor }}>
                  Student Ambassadors
                </h5>

                {loadingAmbassadors ? (
                  <div className="mb-3">
                    <div className="d-flex align-items-center">
                      <CSpinner size="sm" className="me-2" />
                      <span style={{ color: theme.colors.textMuted }}>
                        Loading ambassadors...
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="mb-4">
                    <MultiSelectDropdown
                      id="ambassadors"
                      value={selectedAmbassadors}
                      onChange={handleAmbassadorsChange}
                      options={studentOptions}
                      placeholder="Select student ambassadors"
                      searchPlaceholder="Search ambassadors..."
                    />
                    <CFormText style={{ color: theme.colors.textMuted }}>
                      Select student ambassadors for this campus from the
                      registered ambassadors.
                    </CFormText>
                  </div>
                )}

                <div className="mb-3">
                  <CFormLabel
                    htmlFor="isActive"
                    style={{ color: theme.colors.bodyColor }}
                  >
                    Campus Status
                  </CFormLabel>
                  <CFormSelect
                    id="isActive"
                    value={campus.is_active !== false ? "true" : "false"}
                    onChange={(e) => {
                      setCampus({
                        ...campus,
                        is_active: e.target.value === "true",
                      });
                    }}
                    style={{
                      backgroundColor: theme.isDark ? "#343a40" : undefined,
                      color: theme.isDark ? "#fff" : undefined,
                      borderColor: theme.colors.borderColor,
                    }}
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </CFormSelect>
                  <CFormText style={{ color: theme.colors.textMuted }}>
                    Set campus as active or inactive.
                  </CFormText>
                </div>
              </CCol>
            </CRow>

            {/* Campus Boundary Section - Now at the bottom */}
            <CRow className="mt-4">
              <CCol>
                <h5 className="mb-3" style={{ color: theme.colors.bodyColor }}>
                  Campus Boundary
                </h5>

                <div
                  style={{
                    height: "800px",
                    border: `1px solid ${theme.colors.borderColor}`,
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                >
                  <CampusBoundary
                    initialBoundaryData={campusPolygon}
                    onBoundaryChange={(boundary) => {
                      setCampusPolygon(boundary);
                      if (boundary) {
                        setPolygonError("");
                        // Coordinates will be saved to backend on form submission
                      }
                    }}
                  />
                </div>
                <CFormText
                  style={{ color: theme.colors.textMuted, fontSize: "0.85em" }}
                >
                  Draw the campus boundary polygon on the map above. This is
                  required.
                </CFormText>
              </CCol>
            </CRow>

            <CRow className="mt-4">
              <CCol>
                <CButton
                  type="submit"
                  color="primary"
                  disabled={
                    !campusPolygon ||
                    createCampusMutation.isPending ||
                    updateCampusMutation.isPending
                  }
                >
                  {createCampusMutation.isPending ||
                  updateCampusMutation.isPending ? (
                    <>
                      <CSpinner size="sm" className="me-2" /> Saving...
                    </>
                  ) : (
                    <>
                      <CIcon icon={cilSave} className="me-2" />
                      Save
                    </>
                  )}
                </CButton>
                <CButton
                  color="secondary"
                  className="ms-2"
                  onClick={handleCancel}
                  disabled={
                    createCampusMutation.isPending ||
                    updateCampusMutation.isPending
                  }
                >
                  <CIcon icon={cilX} className="me-2" />
                  Cancel
                </CButton>
              </CCol>
            </CRow>
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default CampusDetails;
