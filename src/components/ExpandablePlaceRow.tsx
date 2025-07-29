import React, { useState } from "react";
import {
  CTableRow,
  CTableDataCell,
  CBadge,
  CButton,
  CTooltip,
  CCollapse,
  CSpinner,
  CImage,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilChevronRight,
  cilChevronTop,
  cilImage,
  cilFolder,
  cilLocationPin,
  cilStar,
} from "@coreui/icons";
import { useQuery } from "@tanstack/react-query";
import { placeService } from "../services/placeService";
import { Place } from "../types/place";
import PhotoPreview from "./PhotoPreview";
import "./ExpandablePlaceRow.css";

interface ExpandablePlaceRowProps {
  place: Place;
  level?: number;
  onAlert: (alert: { type: "success" | "danger" | "info"; message: string }) => void;
}

const ExpandablePlaceRow: React.FC<ExpandablePlaceRowProps> = ({
  place,
  level = 0
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

  const formatPlaceType = (type: string) => {
    // Common place type formatting
    const typeMap: Record<string, string> = {
      point_of_interest: "POI",
      establishment: "Place",
      meal_takeaway: "Takeaway",
      meal_delivery: "Delivery",
      clothing_store: "Clothing",
      electronics_store: "Electronics",
      book_store: "Books",
      grocery_or_supermarket: "Grocery",
      department_store: "Dept Store",
      shopping_mall: "Mall",
      beauty_salon: "Beauty",
      hair_care: "Hair",
      health: "Health",
      doctor: "Doctor",
      dentist: "Dentist",
    };
    
    return typeMap[type] || type.replace(/_/g, ' ');
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
      <div className="photoContainer">
        <div className="thumbnailsWrapper">
          {thumbnails.slice(0, 3).map((thumb, index) => (
            <CImage
              key={index}
              src={thumb.thumb_url}
              alt={`${place.name} thumbnail ${index + 1}`}
              width={30}
              height={30}
              className="rounded thumbnail"
              onClick={() => handlePhotoClick(place)}
            />
          ))}
        </div>
        <CButton
          color="link"
          size="sm"
          className="photoButton p-0 ms-1"
          onClick={() => handlePhotoClick(place)}
        >
          <CIcon icon={cilImage} size="sm" />
          <small className="photoCount">
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
      <CTableRow className={`placeRow ${(place.nested_places_count || 0) > 0 ? 'hasNestedPlaces' : ''}`}>
        <CTableDataCell style={indentStyle}>
          <div className="d-flex align-items-center">
            {(place.nested_places_count || 0) > 0 ? (
              <CButton
                color="link"
                size="sm"
                className="expandButton p-0 me-2"
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
              <div className="d-flex align-items-center gap-2">
                <strong className="placeName">{place.name}</strong>
                {place.hierarchy_level !== undefined && place.hierarchy_level > 0 && (
                  <CBadge color="light" className="hierarchyIndicator">
                    L{place.hierarchy_level}
                  </CBadge>
                )}
                {place.floor_level && (
                  <CBadge color="info" size="sm">
                    Floor {place.floor_level}
                  </CBadge>
                )}
              </div>
              {(place.types || place.google_types) && (place.types || place.google_types)!.length > 0 && (
                <div className="placeTypes">
                  {(place.types || place.google_types)!.slice(0, 3).map((type, index) => (
                    <CBadge key={index} color="primary" className="placeTypeBadge">
                      {formatPlaceType(type)}
                    </CBadge>
                  ))}
                  {(place.types || place.google_types)!.length > 3 && (
                    <CBadge color="secondary" className="placeTypeBadge moreTypes">
                      +{(place.types || place.google_types)!.length - 3}
                    </CBadge>
                  )}
                </div>
              )}
              {(place.nested_places_count || 0) > 0 && (
                <div className="nestedCount">
                  <CBadge color="info" size="sm">
                    {place.nested_places_count} nested place{place.nested_places_count !== 1 ? 's' : ''}
                  </CBadge>
                </div>
              )}
            </div>
          </div>
        </CTableDataCell>
        <CTableDataCell className="addressText">
          <CTooltip content={place.formatted_address || place.address || "No address"}>
            <span>{formatAddress(place)}</span>
          </CTooltip>
        </CTableDataCell>
        <CTableDataCell>{getPlaceCategoryBadge(place.place_category)}</CTableDataCell>
        <CTableDataCell>
          <div className="d-flex align-items-center gap-2">
            {place.parent_place_id && (
              <CTooltip content="Has parent place">
                <CIcon icon={cilChevronTop} size="sm" className="text-muted" />
              </CTooltip>
            )}
            {(place.contains_places || (place.child_place_ids?.length || 0) > 0) && (
              <CBadge color="primary" size="sm">
                <CIcon icon={cilFolder} size="sm" className="me-1" />
                {place.child_place_ids?.length || place.nested_places_count || 0}
              </CBadge>
            )}
            {!place.parent_place_id && !(place.contains_places || (place.child_place_ids?.length || 0) > 0) && (
              <span className="text-muted small">—</span>
            )}
          </div>
        </CTableDataCell>
        <CTableDataCell className="ratingText">
          {place.rating ? (
            <div>
              <strong>{place.rating.toFixed(1)}</strong>
              <span className="ratingCount"> ({place.user_ratings_total || 0})</span>
            </div>
          ) : (
            <span className="noDataText">N/A</span>
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
              <div className={`nestedContainer ${level % 2 === 0 ? 'nestedContainerEven' : 'nestedContainerOdd'}`}>
                {nestedLoading && (
                  <div className="loadingContainer">
                    <CSpinner size="sm" className="me-2" />
                    <span className="loadingText">Loading nested places...</span>
                  </div>
                )}
                
                {nestedError && (
                  <div className="errorText">
                    Failed to load nested places
                  </div>
                )}
                
                {nestedData && nestedData.nested_places.length > 0 && (
                  <div className="nestedPlacesGrid">
                    {nestedData.nested_places.map((nestedPlace) => (
                      <div key={nestedPlace._id} className="nestedPlaceCard">
                        <div className="nestedPlaceHeader">
                          <div className="nestedPlaceName">
                            {nestedPlace.name}
                            {nestedPlace.hierarchy_level !== undefined && nestedPlace.hierarchy_level > 0 && (
                              <CBadge color="light" className="ms-2" size="sm">
                                L{nestedPlace.hierarchy_level}
                              </CBadge>
                            )}
                          </div>
                          <CBadge color={nestedPlace.is_deleted ? "danger" : "success"} size="sm">
                            {nestedPlace.is_deleted ? "Deleted" : "Active"}
                          </CBadge>
                        </div>
                        
                        <div className="nestedPlaceBody">
                          <div className="nestedPlaceTypes">
                            {(nestedPlace.types || nestedPlace.google_types) && (nestedPlace.types || nestedPlace.google_types)!.length > 0 ? (
                              <>
                                {(nestedPlace.types || nestedPlace.google_types)!.slice(0, 2).map((type, index) => (
                                  <CBadge key={index} color="success" size="sm" className="nestedTypeBadge">
                                    {formatPlaceType(type)}
                                  </CBadge>
                                ))}
                                {(nestedPlace.types || nestedPlace.google_types)!.length > 2 && (
                                  <CBadge color="secondary" size="sm" className="nestedTypeBadge moreTypes">
                                    +{(nestedPlace.types || nestedPlace.google_types)!.length - 2}
                                  </CBadge>
                                )}
                              </>
                            ) : (
                              <span className="text-muted">No types</span>
                            )}
                          </div>
                          
                          <div className="nestedPlaceAddress">
                            <CIcon icon={cilLocationPin} size="sm" className="me-1" />
                            {formatAddress(nestedPlace)}
                          </div>
                          
                          <div className="nestedPlaceInfo">
                            <div className="nestedPlaceRating">
                              {nestedPlace.rating ? (
                                <>
                                  <CIcon icon={cilStar} size="sm" className="text-warning me-1" />
                                  <span>{nestedPlace.rating.toFixed(1)}</span>
                                  {nestedPlace.user_ratings_total && (
                                    <small className="text-muted ms-1">({nestedPlace.user_ratings_total})</small>
                                  )}
                                </>
                              ) : (
                                <span className="text-muted">No rating</span>
                              )}
                            </div>
                            
                            <div className="nestedPlacePhotos">
                              <CIcon icon={cilImage} size="sm" className="me-1" />
                              <span>{nestedPlace.photo_info?.total_photos || 0} photos</span>
                              {nestedPlace.photo_info?.synced_photos !== nestedPlace.photo_info?.total_photos && (
                                <small className="text-muted ms-1">
                                  ({nestedPlace.photo_info?.synced_photos || 0} synced)
                                </small>
                              )}
                            </div>
                          </div>
                          
                          {nestedPlace.photo_info?.thumbnails && nestedPlace.photo_info.thumbnails.length > 0 && (
                            <div className="nestedPlaceThumbnails">
                              {nestedPlace.photo_info.thumbnails.slice(0, 3).map((thumb, index) => (
                                thumb.thumb_url && (
                                  <div key={index} className="nestedThumbnailWrapper">
                                    <CImage
                                      src={thumb.thumb_url}
                                      alt={`${nestedPlace.name} thumbnail ${index + 1}`}
                                      className="nestedThumbnailImage"
                                      onClick={() => handlePhotoClick(nestedPlace)}
                                    />
                                    <div className="photoOverlay">
                                      <CIcon icon={cilImage} size="sm" />
                                    </div>
                                  </div>
                                )
                              ))}
                              {nestedPlace.photo_info.thumbnails.length > 3 && (
                                <div 
                                  className="moreThumbnails"
                                  onClick={() => handlePhotoClick(nestedPlace)}
                                >
                                  <span>+{nestedPlace.photo_info.thumbnails.length - 3}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {nestedData && nestedData.nested_places.length === 0 && (
                  <div className="noNestedText">
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
