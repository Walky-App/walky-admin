/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import {
  CButton,
  CForm,
  CFormInput,
  CFormTextarea,
  CFormSelect,
  CRow,
  CCol,
  CFormLabel,
  CSpinner,
  CAlert,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilCode,
  cilPencil,
  cilCloudDownload,
  cilExternalLink,
} from "@coreui/icons";
import { Geofence, GeofenceFormData } from "../types/geofence";
import { geofenceService } from "../services/geofenceService";

interface GeofenceInlineFormProps {
  onSubmit: (data: GeofenceFormData) => void;
  geofence?: Geofence | null;
  loading?: boolean;
  campusId: string;
}

interface FormErrors {
  name?: string;
  description?: string;
  latitude?: string;
  longitude?: string;
  radius?: string;
  geojson?: string;
}

const GeofenceInlineForm: React.FC<GeofenceInlineFormProps> = ({
  onSubmit,
  geofence,
  loading = false,
  campusId,
}) => {
  const [formData, setFormData] = useState<GeofenceFormData>({
    name: "",
    description: "",
    latitude: 25.7617,
    longitude: -80.1918,
    radius: 100,
    type: "radius",
    status: "active",
    campusId: campusId,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [activeTab, setActiveTab] = useState<"form" | "json">("form");
  const [geojsonInput, setGeojsonInput] = useState<string>("");

  useEffect(() => {
    if (geofence) {
      setFormData({
        name: geofence.name,
        description: geofence.description,
        latitude: geofence.latitude,
        longitude: geofence.longitude,
        radius: geofence.radius,
        polygon: geofence.polygon,
        type: geofence.type,
        status: geofence.status,
        campusId: geofence.campusId,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        latitude: 25.7617,
        longitude: -80.1918,
        radius: 100,
        type: "radius",
        status: "active",
        campusId: campusId,
      });
    }
    setErrors({});
  }, [geofence, campusId]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (formData.latitude < -90 || formData.latitude > 90) {
      newErrors.latitude = "Latitude must be between -90 and 90";
    }

    if (formData.longitude < -180 || formData.longitude > 180) {
      newErrors.longitude = "Longitude must be between -180 and 180";
    }

    if (
      formData.type === "radius" &&
      (!formData.radius || formData.radius <= 0 || formData.radius > 10000)
    ) {
      newErrors.radius = "Radius must be between 1 and 10000 meters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (
    field: keyof GeofenceFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleGeojsonInputChange = (value: string) => {
    setGeojsonInput(value);
    setErrors((prev) => ({ ...prev, geojson: undefined }));
  };

  const parseGeojsonInput = () => {
    if (!geojsonInput.trim()) {
      setErrors((prev) => ({ ...prev, geojson: "GeoJSON data is required" }));
      return false;
    }

    try {
      const parsed = JSON.parse(geojsonInput);

      const features =
        parsed.type === "FeatureCollection" ? parsed.features : [parsed];

      let parsedAtLeastOne = false;

      features.forEach((feature: any) => {
        if (
          !feature.geometry ||
          !feature.geometry.type ||
          !feature.geometry.coordinates
        )
          return;

        if (feature.geometry.type === "Point") {
          const [lng, lat] = feature.geometry.coordinates;
          const radius = feature.properties?.radius || 100;

          setFormData((prev) => ({
            ...prev,
            latitude: lat,
            longitude: lng,
            radius: radius,
            type: "radius",
            name: feature.properties?.name || prev.name,
            description: feature.properties?.description || prev.description,
          }));
          parsedAtLeastOne = true;
        } else if (feature.geometry.type === "Polygon") {
          const coordinates = feature.geometry.coordinates[0];
          const polygon = coordinates.map(([lng, lat]: number[]) => ({
            lat,
            lng,
          }));
          const centerLat =
            polygon.reduce((sum: any, p: { lat: any }) => sum + p.lat, 0) /
            polygon.length;
          const centerLng =
            polygon.reduce((sum: any, p: { lng: any }) => sum + p.lng, 0) /
            polygon.length;

          setFormData((prev) => ({
            ...prev,
            latitude: centerLat,
            longitude: centerLng,
            polygon: polygon,
            type: "polygon",
            name: feature.properties?.name || prev.name,
            description: feature.properties?.description || prev.description,
          }));
          parsedAtLeastOne = true;
        }
      });

      if (!parsedAtLeastOne) {
        setErrors((prev) => ({
          ...prev,
          geojson: "No valid Point or Polygon geometry found",
        }));
        return false;
      }

      return true;
    } catch {
      setErrors((prev) => ({ ...prev, geojson: "Invalid JSON format" }));
      return false;
    }
  };

  const exportToGeojson = async () => {
    if (!formData.name || !formData.description) {
      setErrors((prev) => ({
        ...prev,
        name: !formData.name ? "Name is required for export" : undefined,
        description: !formData.description
          ? "Description is required for export"
          : undefined,
      }));
      return;
    }

    const tempGeofence: Geofence = {
      id: "temp",
      ...formData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const geojson = await geofenceService.exportSingleGeoJSON(tempGeofence);
      const jsonString = JSON.stringify(geojson, null, 2);

      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${formData.name
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase()}_geofence.geojson`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  const openInGeojsonIo = async () => {
    if (!formData.name || !formData.description) {
      setErrors((prev) => ({
        ...prev,
        name: !formData.name ? "Name is required" : undefined,
        description: !formData.description
          ? "Description is required"
          : undefined,
      }));
      return;
    }

    const tempGeofence: Geofence = {
      id: "temp",
      ...formData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const geojson = await geofenceService.exportSingleGeoJSON(tempGeofence);
      const jsonString = JSON.stringify(geojson);
      const encodedData = encodeURIComponent(jsonString);
      const url = `https://geojson.io/#data=data:application/json,${encodedData}`;
      window.open(url, "_blank");
    } catch (error) {
      console.error("Failed to open in geojson.io:", error);
    }
  };

  return (
    <CForm onSubmit={handleSubmit}>
      <CNav variant="tabs" className="mb-3">
        <CNavItem>
          <CNavLink
            active={activeTab === "form"}
            onClick={() => setActiveTab("form")}
            style={{ cursor: "pointer" }}
          >
            <CIcon icon={cilPencil} className="me-2" />
            Form Entry
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            active={activeTab === "json"}
            onClick={() => setActiveTab("json")}
            style={{ cursor: "pointer" }}
          >
            <CIcon icon={cilCode} className="me-2" />
            GeoJSON Import/Export
          </CNavLink>
        </CNavItem>
      </CNav>

      <CTabContent>
        <CTabPane visible={activeTab === "form"}>
          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel htmlFor="name">Name *</CFormLabel>
              <CFormInput
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                invalid={!!errors.name}
                placeholder="Enter geofence name"
              />
              {errors.name && (
                <div className="invalid-feedback d-block">{errors.name}</div>
              )}
            </CCol>

            <CCol md={3}>
              <CFormLabel htmlFor="type">Type</CFormLabel>
              <CFormSelect
                id="type"
                value={formData.type}
                onChange={(e) =>
                  handleInputChange(
                    "type",
                    e.target.value as "radius" | "polygon"
                  )
                }
              >
                <option value="radius">Circle</option>
                <option value="polygon">Polygon</option>
              </CFormSelect>
            </CCol>

            <CCol md={3}>
              <CFormLabel htmlFor="status">Status</CFormLabel>
              <CFormSelect
                id="status"
                value={formData.status}
                onChange={(e) =>
                  handleInputChange(
                    "status",
                    e.target.value as "active" | "inactive"
                  )
                }
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </CFormSelect>
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol>
              <CFormLabel htmlFor="description">Description *</CFormLabel>
              <CFormTextarea
                id="description"
                rows={2}
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                invalid={!!errors.description}
                placeholder="Enter geofence description"
              />
              {errors.description && (
                <div className="invalid-feedback d-block">
                  {errors.description}
                </div>
              )}
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={4}>
              <CFormLabel htmlFor="latitude">Latitude *</CFormLabel>
              <CFormInput
                id="latitude"
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) =>
                  handleInputChange("latitude", parseFloat(e.target.value) || 0)
                }
                invalid={!!errors.latitude}
                placeholder="25.7617"
              />
              {errors.latitude && (
                <div className="invalid-feedback d-block">
                  {errors.latitude}
                </div>
              )}
            </CCol>

            <CCol md={4}>
              <CFormLabel htmlFor="longitude">Longitude *</CFormLabel>
              <CFormInput
                id="longitude"
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) =>
                  handleInputChange(
                    "longitude",
                    parseFloat(e.target.value) || 0
                  )
                }
                invalid={!!errors.longitude}
                placeholder="-80.1918"
              />
              {errors.longitude && (
                <div className="invalid-feedback d-block">
                  {errors.longitude}
                </div>
              )}
            </CCol>

            {formData.type === "radius" && (
              <CCol md={4}>
                <CFormLabel htmlFor="radius">Radius (m) *</CFormLabel>
                <CFormInput
                  id="radius"
                  type="number"
                  min="1"
                  max="10000"
                  value={formData.radius || 100}
                  onChange={(e) =>
                    handleInputChange("radius", parseInt(e.target.value) || 0)
                  }
                  invalid={!!errors.radius}
                  placeholder="100"
                />
                {errors.radius && (
                  <div className="invalid-feedback d-block">
                    {errors.radius}
                  </div>
                )}
              </CCol>
            )}
          </CRow>

          {formData.type === "polygon" && (
            <CRow className="mb-3">
              <CCol>
                <CFormLabel>Polygon Info</CFormLabel>
                <div className="form-control-plaintext">
                  {formData.polygon && formData.polygon.length > 0
                    ? `Polygon with ${formData.polygon.length} vertices`
                    : "Use map selection to draw polygon or search for a location with boundaries"}
                </div>
              </CCol>
            </CRow>
          )}
        </CTabPane>

        <CTabPane visible={activeTab === "json"}>
          <CRow className="mb-3">
            <CCol>
              <CAlert color="info" className="mb-3">
                <strong>GeoJSON Workflow:</strong> Import GeoJSON data to
                populate the form, or export current form data as GeoJSON for
                use with external tools like geojson.io.
              </CAlert>
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel htmlFor="geojson-import">Import GeoJSON</CFormLabel>
              <CFormTextarea
                id="geojson-import"
                rows={8}
                value={geojsonInput}
                onChange={(e) => handleGeojsonInputChange(e.target.value)}
                invalid={!!errors.geojson}
                placeholder='Paste GeoJSON Feature here, e.g.:
{
  "type": "Feature",
  "properties": {
    "name": "Campus Area",
    "description": "Main campus geofence"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [-80.1918, 25.7617]
  }
}'
              />
              {errors.geojson && (
                <div className="invalid-feedback d-block">{errors.geojson}</div>
              )}
              <div className="mt-2">
                <CButton
                  color="primary"
                  size="sm"
                  onClick={parseGeojsonInput}
                  disabled={!geojsonInput.trim()}
                >
                  Import to Form
                </CButton>
              </div>
            </CCol>

            <CCol md={6}>
              <CFormLabel>Export Current Data</CFormLabel>
              <div className="d-grid gap-2">
                <CButton
                  color="success"
                  variant="outline"
                  onClick={exportToGeojson}
                  disabled={!formData.name || !formData.description}
                >
                  <CIcon icon={cilCloudDownload} className="me-2" />
                  Download GeoJSON
                </CButton>

                <CButton
                  color="info"
                  variant="outline"
                  onClick={openInGeojsonIo}
                  disabled={!formData.name || !formData.description}
                >
                  <CIcon icon={cilExternalLink} className="me-2" />
                  Open in geojson.io
                </CButton>
              </div>

              <div className="mt-3">
                <CFormLabel>Current Coordinates</CFormLabel>
                <div className="form-control-plaintext">
                  <code>
                    {formData.latitude.toFixed(6)},{" "}
                    {formData.longitude.toFixed(6)}
                  </code>
                  {formData.type === "radius" && (
                    <>
                      <br />
                      <small className="text-muted">
                        Radius: {formData.radius}m
                      </small>
                    </>
                  )}
                  {formData.type === "polygon" &&
                    formData.polygon &&
                    formData.polygon.length > 0 && (
                      <>
                        <br />
                        <small className="text-muted">
                          Polygon: {formData.polygon.length} vertices
                        </small>
                      </>
                    )}
                </div>
              </div>
            </CCol>
          </CRow>
        </CTabPane>
      </CTabContent>

      <div className="d-flex justify-content-end gap-2 mt-3">
        <CButton color="primary" type="submit" disabled={loading}>
          {loading && <CSpinner size="sm" className="me-2" />}
          {geofence ? "Update" : "Create"} Geofence
        </CButton>
      </div>
    </CForm>
  );
};

export default GeofenceInlineForm;
