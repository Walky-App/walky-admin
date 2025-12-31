import React from "react";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CRow,
  CCol,
  CFormLabel,
} from "@coreui/react";
import SkeletonLoader from "./SkeletonLoader";
import { useTheme } from "../hooks/useTheme";


interface CampusDetailsSkeletonProps {
  inTabView?: boolean;
}

const CampusDetailsSkeleton: React.FC<CampusDetailsSkeletonProps> = ({
  inTabView = false,
}) => {
  const { theme } = useTheme();
  const containerPadding = inTabView ? "0" : "p-4";

  return (
    <div className={containerPadding}>
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
        >
          <SkeletonLoader width="120px" height="24px" />
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol md={7}>
              <SkeletonLoader width="140px" height="20px" className="mb-3" />

              {/* Campus Name Field */}
              <div className="mb-3">
                <CFormLabel style={{ color: theme.colors.bodyColor }}>
                  <SkeletonLoader width="100px" height="16px" />
                </CFormLabel>
                <SkeletonLoader width="100%" height="38px" borderRadius="6px" />
              </div>

              {/* City Field */}
              <div className="mb-3">
                <CFormLabel style={{ color: theme.colors.bodyColor }}>
                  <SkeletonLoader width="40px" height="16px" />
                </CFormLabel>
                <SkeletonLoader width="100%" height="38px" borderRadius="6px" />
              </div>

              {/* State and ZIP Row */}
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel style={{ color: theme.colors.bodyColor }}>
                    <SkeletonLoader width="50px" height="16px" />
                  </CFormLabel>
                  <SkeletonLoader width="100%" height="38px" borderRadius="6px" />
                </CCol>
                <CCol md={6}>
                  <CFormLabel style={{ color: theme.colors.bodyColor }}>
                    <SkeletonLoader width="60px" height="16px" />
                  </CFormLabel>
                  <SkeletonLoader width="100%" height="38px" borderRadius="6px" />
                </CCol>
              </CRow>

              {/* Phone Number Field */}
              <div className="mb-3">
                <CFormLabel style={{ color: theme.colors.bodyColor }}>
                  <SkeletonLoader width="100px" height="16px" />
                </CFormLabel>
                <SkeletonLoader width="100%" height="38px" borderRadius="6px" />
              </div>

              {/* Address Field */}
              <div className="mb-3">
                <CFormLabel style={{ color: theme.colors.bodyColor }}>
                  <SkeletonLoader width="60px" height="16px" />
                </CFormLabel>
                <SkeletonLoader width="100%" height="38px" borderRadius="6px" />
              </div>

              {/* Time Zone Field */}
              <div className="mb-3">
                <CFormLabel style={{ color: theme.colors.bodyColor }}>
                  <SkeletonLoader width="80px" height="16px" />
                </CFormLabel>
                <SkeletonLoader width="100%" height="38px" borderRadius="6px" />
              </div>

              {/* Dawn to Dusk Row */}
              <CRow className="mb-4">
                <CCol md={6}>
                  <CFormLabel style={{ color: theme.colors.bodyColor }}>
                    <SkeletonLoader width="80px" height="16px" />
                  </CFormLabel>
                  <SkeletonLoader width="100%" height="38px" borderRadius="6px" />
                </CCol>
                <CCol md={6}>
                  <CFormLabel style={{ color: theme.colors.bodyColor }}>
                    <SkeletonLoader width="80px" height="16px" />
                  </CFormLabel>
                  <SkeletonLoader width="100%" height="38px" borderRadius="6px" />
                </CCol>
              </CRow>

              {/* Ambassadors Section */}
              <SkeletonLoader width="120px" height="20px" className="mb-3" />
              <div className="mb-4">
                <CFormLabel style={{ color: theme.colors.bodyColor }}>
                  <SkeletonLoader width="100px" height="16px" />
                </CFormLabel>
                <SkeletonLoader width="100%" height="38px" borderRadius="6px" />
              </div>

              {/* Campus Boundary Section */}
              <SkeletonLoader width="140px" height="20px" className="mb-3" />
              <div
                style={{
                  height: "500px",
                  border: `1px solid ${theme.colors.borderColor}`,
                  borderRadius: "8px",
                  overflow: "hidden",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: theme.isDark ? "#2a2a2a" : "#f8f9fa",
                  color: theme.colors.textMuted,
                  fontSize: "18px",
                }}
              >
                🗺️ Loading Map...
              </div>
              <SkeletonLoader width="300px" height="14px" />
            </CCol>
          </CRow>

          {/* Action Buttons */}
          <CRow className="mt-4">
            <CCol className="d-flex justify-content-end">
              <SkeletonLoader
                width="80px"
                height="38px"
                borderRadius="6px"
                className="me-2"
              />
              <SkeletonLoader width="80px" height="38px" borderRadius="6px" />
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default CampusDetailsSkeleton;
