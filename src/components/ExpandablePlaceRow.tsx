import React, { useState } from "react";
import {
  CTableRow,
  CTableDataCell,
  CBadge,
  CButton,
  CTooltip,
  CCollapse,
  CSpinner,
  CTable,
  CTableHead,
  CTableHeaderCell,
  CTableBody,
  CImage,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilChevronRight,
  cilChevronTop,
  cilImage,
} from "@coreui/icons";
import { useQuery } from "@tanstack/react-query";
import { placeService } from "../services/placeService";
import { Place } from "../types/place";
import PhotoPreview from "./PhotoPreview";

interface ExpandablePlaceRowProps {
  place: Place;
  level?: number;
  onAlert: (alert: { type: "success" | "danger" | "info"; message: string }) => void;
}

const ExpandablePlaceRow: React.FC<ExpandablePlaceRowProps> = ({
  place,
  level = 0,
  onAlert,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedPhotoPlace, setSelectedPhotoPlace] = useState<Place | null>(null);

  const {
    data: nestedData,
    isLoading: nestedLoading,
    error: nestedError,
  } = useQuery({
    queryKey: ["nested-places", place.place_id],
    queryFn: () => placeService.getNestedPlaces(place.place_id, 50, 0),
    enabled: isExpanded && !!place.place_id && (place.nested_places_count || 0) > 0,
  });

  const getPlaceCategoryBadge = (category?: string) => {
    switch (category) {
      case "container":
        return <CBadge color="primary">Container</CBadge>;
      case "standalone":
        return <CBadge color="success">Standalone</CBadge>;
      case "nested":
        return <CBadge color="info">Nested</CBadge>;
      default:
        return <CBadge color="secondary">Unknown</CBadge>;
    }
  };

  const formatAddress = (place: Place) => {
    const address = place.formatted_address || place.address;
    if (address) {
      return address.length > 50
        ? address.substring(0, 50) + "..."
        : address;
    }
    return "N/A";
  };

  const handleToggleExpand = () => {
    if ((place.nested_places_count || 0) > 0) {
      setIsExpanded(!isExpanded);
    }
  };

  const handlePhotoClick = (place: Place) => {
    if (place.photo_info?.thumbnails && place.photo_info.thumbnails.length > 0) {
      setSelectedPhotoPlace(place);
    }
  };

  const renderPhotoThumbnails = (place: Place) => {
    const thumbnails = place.photo_info?.thumbnails || [];
    
    if (thumbnails.length === 0) {
      return <CBadge color="secondary">No photos</CBadge>;
    }

    return (
      <div className="d-flex align-items-center gap-1">
        <div className="d-flex" style={{ gap: "2px" }}>
          {thumbnails.slice(0, 3).map((thumb, index) => (
            <CImage
              key={index}
              src={thumb.thumb_url}
              alt={`${place.name} thumbnail ${index + 1}`}
              width={30}
              height={30}
              className="rounded cursor-pointer"
              style={{ 
                objectFit: "cover", 
                cursor: "pointer",
                border: "1px solid #dee2e6"
              }}
              onClick={() => handlePhotoClick(place)}
            />
          ))}
        </div>
        <CButton
          color="link"
          size="sm"
          className="p-0 ms-1"
          onClick={() => handlePhotoClick(place)}
        >
          <CIcon icon={cilImage} size="sm" />
          <small className="ms-1">
            {place.photo_info?.total_photos || 0}
            {place.photo_info?.synced_photos !== place.photo_info?.total_photos && 
              ` (${place.photo_info?.synced_photos || 0} synced)`
            }
          </small>
        </CButton>
      </div>
    );
  };

  const indentStyle = {
    paddingLeft: `${level * 20 + 8}px`,
  };

  return (
    <>
      <CTableRow style={{ backgroundColor: "white" }}>
        <CTableDataCell style={indentStyle}>
          <div className="d-flex align-items-center">
            {(place.nested_places_count || 0) > 0 ? (
              <CButton
                color="link"
                size="sm"
                className="p-0 me-2 text-primary"
                onClick={handleToggleExpand}
              >
                <CIcon 
                  icon={isExpanded ? cilChevronTop : cilChevronRight} 
                  size="sm" 
                />
              </CButton>
            ) : (
              <div style={{ width: "24px" }} />
            )}
            <div>
              <strong className="text-dark">{place.name}</strong>
              {(place.types || place.google_types) && (place.types || place.google_types)!.length > 0 && (
                <div className="small text-secondary">
                  {(place.types || place.google_types)!.slice(0, 2).join(", ")}
                </div>
              )}
              {(place.nested_places_count || 0) > 0 && (
                <div className="small text-primary fw-bold">
                  {place.nested_places_count} nested place{place.nested_places_count !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>
        </CTableDataCell>
        <CTableDataCell className="text-dark">
          <CTooltip content={place.formatted_address || place.address || "No address"}>
            <span>{formatAddress(place)}</span>
          </CTooltip>
        </CTableDataCell>
        <CTableDataCell>{getPlaceCategoryBadge(place.place_category)}</CTableDataCell>
        <CTableDataCell className="text-dark">
          {place.rating ? (
            <div>
              <strong>{place.rating.toFixed(1)}</strong>
              <span className="text-secondary small"> ({place.user_ratings_total || 0})</span>
            </div>
          ) : (
            <span className="text-secondary">N/A</span>
          )}
        </CTableDataCell>
        <CTableDataCell>
          {renderPhotoThumbnails(place)}
        </CTableDataCell>
        <CTableDataCell>
          {place.is_deleted ? (
            <CBadge color="danger">Deleted</CBadge>
          ) : (
            <CBadge color="success">Active</CBadge>
          )}
        </CTableDataCell>
      </CTableRow>

      {/* Nested places collapse */}
      {(place.nested_places_count || 0) > 0 && (
        <CTableRow>
          <CTableDataCell colSpan={6} className="p-0">
            <CCollapse visible={isExpanded}>
              <div className="p-3" style={{ 
                backgroundColor: level % 2 === 0 ? "#f8f9fa" : "#e9ecef",
                borderLeft: `4px solid ${level % 2 === 0 ? "#007bff" : "#6c757d"}`
              }}>
                {nestedLoading && (
                  <div className="text-center py-3">
                    <CSpinner size="sm" className="me-2" />
                    <span className="text-dark">Loading nested places...</span>
                  </div>
                )}
                
                {nestedError && (
                  <div className="text-danger text-center py-3 fw-bold">
                    Failed to load nested places
                  </div>
                )}
                
                {nestedData && nestedData.nested_places.length > 0 && (
                  <CTable className="mb-0" style={{ backgroundColor: "white" }}>
                    <CTableHead style={{ backgroundColor: "#e9ecef" }}>
                      <CTableRow>
                        <CTableHeaderCell className="text-dark fw-bold">Name</CTableHeaderCell>
                        <CTableHeaderCell className="text-dark fw-bold">Address</CTableHeaderCell>
                        <CTableHeaderCell className="text-dark fw-bold">Category</CTableHeaderCell>
                        <CTableHeaderCell className="text-dark fw-bold">Rating</CTableHeaderCell>
                        <CTableHeaderCell className="text-dark fw-bold">Photos</CTableHeaderCell>
                        <CTableHeaderCell className="text-dark fw-bold">Status</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {nestedData.nested_places.map((nestedPlace) => (
                        <ExpandablePlaceRow
                          key={nestedPlace._id}
                          place={nestedPlace}
                          level={level + 1}
                          onAlert={onAlert}
                        />
                      ))}
                    </CTableBody>
                  </CTable>
                )}
                
                {nestedData && nestedData.nested_places.length === 0 && (
                  <div className="text-dark text-center py-3 fw-bold">
                    No nested places found
                  </div>
                )}
              </div>
            </CCollapse>
          </CTableDataCell>
        </CTableRow>
      )}

      {/* Photo Preview Modal */}
      {selectedPhotoPlace && (
        <PhotoPreview
          place={selectedPhotoPlace}
          visible={!!selectedPhotoPlace}
          onClose={() => setSelectedPhotoPlace(null)}
        />
      )}
    </>
  );
};

export default ExpandablePlaceRow;
