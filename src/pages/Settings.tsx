import React, { useState, useEffect } from "react";
import {
  CCard,
  CCardBody,
  CForm,
  CRow,
  CCol,
  CButton,
  CFormText,
} from "@coreui/react";
import { useTheme } from "../hooks/useTheme";
import Input from "../components/Input";
import ImageUpload from "../components/ImageUpload";
import API from "../API";

interface Student {
  id: string;
  name: string;
  email: string;
}

const Settings = () => {
  const { theme } = useTheme();

  // State for form fields
  const [schoolName, setSchoolName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [emailDomain, setEmailDomain] = useState("");
  const [selectedStudents] = useState<string[]>([]);
  const [logo, setLogo] = useState<File | null>(null);

  // State for students data
  const [, setStudents] = useState<Student[]>([]);
  const [, setLoading] = useState(false);
  const [, setError] = useState("");

  // Fetch students data
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await API.get<{
          users: {
            _id: string;
            first_name: string;
            last_name: string;
            email: string;
            createdAt: string;
            updatedAt: string;
          }[];
        }>("/users/?fields=_id,first_name,last_name,email,createdAt,updatedAt");

        const transformed = res.data.users.map((user) => ({
          id: user._id,
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
        }));

        setStudents(transformed);
      } catch (err) {
        console.error("❌ Failed to fetch student data:", err);
        setError("Failed to load students. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create form data object with all settings
    const formData = {
      schoolName,
      displayName,
      emailDomain,
      studentAmbassadors: selectedStudents,
      logo,
    };

    // Log the settings data (would be an API call in production)
    console.log("Settings updated:", formData);

    // Here you would send this data to your backend
    // API.put('/settings', formData)
  };

  return (
    <div className="p-4">
      <CCard
        style={{
          backgroundColor: theme.colors.cardBg,
          borderColor: theme.colors.borderColor,
        }}
      >
        <CCardBody>
          <CForm onSubmit={handleSubmit}>
            <CRow className="mb-4">
              <CCol md={6}>
                <Input
                  id="schoolName"
                  label="School Name"
                  value={schoolName}
                  onChange={setSchoolName}
                  placeholder="Enter school name"
                  required
                  helpText="Official name of your school or institution"
                />
              </CCol>
              <CCol md={6}>
                <Input
                  id="displayName"
                  label="Display Name (visible to students)"
                  value={displayName}
                  onChange={setDisplayName}
                  placeholder="Enter display name"
                  required
                  helpText="How your school name will appear to students"
                />
              </CCol>
            </CRow>
            <CRow className="mb-4">
              <CCol md={6}>
                <Input
                  id="emailDomain"
                  label="Email Domain"
                  value={emailDomain}
                  onChange={setEmailDomain}
                  placeholder="example.edu"
                  required
                  helpText="Domain used for school email addresses"
                />
              </CCol>
            </CRow>
            <CRow className="mb-4">
              <CCol md={12}>
                <div className="mb-3">
                  <ImageUpload
                    id="logo"
                    label="School Logo"
                    onChange={setLogo}
                    value={logo}
                    placeholder="Upload your school logo (PNG, JPG, SVG)"
                    acceptedFormats="image/jpeg, image/png, image/svg+xml"
                    maxSizeMB={2}
                  />
                  <CFormText style={{ color: theme.colors.textMuted }}>
                    Recommended size: 200x200px, max 2MB
                  </CFormText>
                </div>
              </CCol>
            </CRow>
            <div className="d-flex justify-content-end mt-4">
              <CButton type="button" color="outline-secondary" className="me-2">
                Cancel
              </CButton>
              <CButton type="submit" color="primary">
                Save Changes
              </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default Settings;
