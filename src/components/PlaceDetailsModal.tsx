import React, { useState, useEffect } from "react";
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CBadge,
  CRow,
  CCol,
  CCard,
  CCardBody,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilLocationPin,
  cilPhone,
  cilGlobeAlt,
  cilStar,
  cilClock,
  cilImage,
  cilLayers,
  cilTag,
  cilBuilding,
  cilExternalLink,
  cilCode,
} from "@coreui/icons";
import { Place } from "../types/place";
import { PlaceType } from "../types/placeType";
import { useQuery } from "@tanstack/react-query";
import { placeTypeService } from "../services/placeTypeService";
import "./PlaceDetailsModal.css";

interface PlaceDetailsModalProps {
  place: Place | null;
  visible: boolean;
  onClose: () => void;
}

const PlaceDetailsModal: React.FC<PlaceDetailsModalProps> = ({
  place,
  visible,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(false);

  // Load Walky place types from API
  const { data: placeTypes = [] } = useQuery({
    queryKey: ['placeTypes'],
    queryFn: () => placeTypeService.getAll({ is_active: true }),
    enabled: visible, // Only fetch when modal is visible
  });


  // Reset state when modal opens with new place
  useEffect(() => {
    if (visible) {
      setActiveTab(0);
      setSelectedImageIndex(0);
      setImageLoading(false);
    }
  }, [visible, place]);

  if (!place) return null;

  // Compute Walky categories based on place's Google types
  const getWalkyCategories = (): PlaceType[] => {
    if (!place || !placeTypes.length) return [];
    
    const placeGoogleTypes = place.google_types || place.types || [];
    if (!placeGoogleTypes.length) return [];
    
    // Find all PlaceTypes that have at least one Google type matching the place's types
    return placeTypes.filter(placeType => 
      placeType.google_types.some(googleType => 
        placeGoogleTypes.includes(googleType)
      )
    );
  };

  const walkyCategories = getWalkyCategories();

  // Get photos from multiple possible sources
  const thumbnails = place.photo_info?.thumbnails || [];
  const photos = place.photos || [];
  
  // Combine all photo sources
  const allPhotos = thumbnails.length > 0 ? thumbnails : photos.map(photo => ({
    thumb_url: photo.optimized_urls?.thumb || photo.photo_url || photo.gcs_url,
    large_url: photo.optimized_urls?.large || photo.photo_url || photo.gcs_url
  }));
  
  const hasPhotos = allPhotos.length > 0;
  const location = place.coordinates || place.geometry?.location;
  const hasLocation = !!location;


  // Open in Google Maps
  const openInGoogleMaps = () => {
    if (!hasLocation || !location) return;
    const { lat, lng } = location;
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
  };

  return (
    <CModal 
      visible={visible} 
      onClose={onClose} 
      size="xl" 
      alignment="center"
      scrollable
    >
      <CModalHeader className="border-bottom">
        <CModalTitle>
          <div>
            <h5 className="mb-1">{place.name}</h5>
            <div className="d-flex align-items-center gap-3">
              {place.rating && (
                <div className="d-flex align-items-center gap-1">
                  <CIcon icon={cilStar} className="text-warning" />
                  <span className="small fw-medium">{place.rating.toFixed(1)}</span>
                  <span className="small text-muted">({place.user_ratings_total || 0})</span>
                </div>
              )}
              {place.price_level && (
                <span className="small text-muted">
                  {"$".repeat(place.price_level)}
                </span>
              )}
              <CBadge color={place.is_deleted ? "danger" : "success"} size="sm">
                {place.is_deleted ? "Deleted" : "Active"}
              </CBadge>
            </div>
          </div>
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CNav variant="tabs" role="tablist" className="mb-3">
          <CNavItem>
            <CNavLink
              active={activeTab === 0}
              onClick={() => setActiveTab(0)}
              style={{ cursor: "pointer" }}
            >
              Overview
            </CNavLink>
          </CNavItem>
          {hasPhotos && (
            <CNavItem>
              <CNavLink
                active={activeTab === 1}
                onClick={() => setActiveTab(1)}
                style={{ cursor: "pointer" }}
              >
                Photos ({allPhotos.length})
              </CNavLink>
            </CNavItem>
          )}
          {hasLocation && (
            <CNavItem>
              <CNavLink
                active={activeTab === 2}
                onClick={() => setActiveTab(2)}
                style={{ cursor: "pointer" }}
              >
                Map
              </CNavLink>
            </CNavItem>
          )}
          <CNavItem>
            <CNavLink
              active={activeTab === 3}
              onClick={() => setActiveTab(3)}
              style={{ cursor: "pointer" }}
            >
              Technical
            </CNavLink>
          </CNavItem>
        </CNav>

        <CTabContent className="mt-3">
          {/* Overview Tab */}
          <CTabPane visible={activeTab === 0}>
            {/* Description - Show prominently at the top */}
            {(place.editorial_summary?.overview || place.secondary_description) && (
              <div className="mb-4">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <CIcon icon={cilTag} className="text-muted" size="sm" />
                  <strong className="small">Description</strong>
                </div>
                {place.editorial_summary?.overview && (
                  <p className="small mb-2">{place.editorial_summary.overview}</p>
                )}
                {place.secondary_description && (
                  <p className="small text-muted mb-0">{place.secondary_description}</p>
                )}
              </div>
            )}

            <CRow className="mb-4">
              <CCol md={6}>
                <div className="d-flex gap-2 mb-3">
                  <CIcon icon={cilLocationPin} className="text-muted" size="sm" />
                  <div className="flex-1">
                    <small className="text-muted d-block">Address</small>
                    <p className="mb-0 small">{place.formatted_address || place.address || "No address available"}</p>
                  </div>
                </div>
              </CCol>
              {place.formatted_phone_number && (
                <CCol md={6}>
                  <div className="d-flex gap-2 mb-3">
                    <CIcon icon={cilPhone} className="text-muted" size="sm" />
                    <div>
                      <small className="text-muted d-block">Phone</small>
                      <a href={`tel:${place.formatted_phone_number}`} className="text-decoration-none small">
                        {place.formatted_phone_number}
                      </a>
                    </div>
                  </div>
                </CCol>
              )}
              {place.website && (
                <CCol md={6}>
                  <div className="d-flex gap-2 mb-3">
                    <CIcon icon={cilGlobeAlt} className="text-muted" size="sm" />
                    <div>
                      <small className="text-muted d-block">Website</small>
                      <a 
                        href={place.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-decoration-none text-truncate d-block small"
                        style={{ maxWidth: "300px" }}
                      >
                        {place.website}
                      </a>
                    </div>
                  </div>
                </CCol>
              )}
              <CCol md={6}>
                <div className="d-flex gap-2 mb-3">
                  <CIcon icon={cilBuilding} className="text-muted" size="sm" />
                  <div>
                    <small className="text-muted d-block">Category</small>
                    <p className="mb-0 text-capitalize small">{place.place_category || "Not categorized"}</p>
                  </div>
                </div>
              </CCol>
            </CRow>


            {/* Google Place Types */}
            <div className="mb-4">
              <div className="d-flex align-items-center gap-2 mb-2">
                <CIcon icon={cilTag} className="text-muted" size="sm" />
                <strong className="small">Google Place Types</strong>
              </div>
              <div className="d-flex flex-wrap gap-1">
                {(place.google_types || place.types || []).map((type, index) => (
                  <CBadge key={index} color="info" size="sm" className="fw-normal">
                    {type}
                  </CBadge>
                ))}
                {(!place.google_types?.length && !place.types?.length) && (
                  <span className="text-muted small">No types available</span>
                )}
              </div>
            </div>

            {/* Hierarchy Info */}
            <div className="mb-4">
              <div className="d-flex align-items-center gap-2 mb-2">
                <CIcon icon={cilLayers} className="text-muted" size="sm" />
                <strong className="small">Hierarchy Information</strong>
              </div>
              <CCard className="border shadow-sm info-card">
                <CCardBody className="py-2">
                  <CRow>
                    <CCol xs={6} md={3}>
                      <small className="text-muted d-block">Level</small>
                      <strong className="small">{place.hierarchy_level !== undefined ? place.hierarchy_level : "—"}</strong>
                    </CCol>
                    <CCol xs={6} md={3}>
                      <small className="text-muted d-block">Floor</small>
                      <strong className="small">{place.floor_level || "—"}</strong>
                    </CCol>
                    <CCol xs={6} md={3}>
                      <small className="text-muted d-block">Nested Places</small>
                      <strong className="small">{place.nested_places_count || 0}</strong>
                    </CCol>
                    <CCol xs={6} md={3}>
                      <small className="text-muted d-block">Photos</small>
                      <strong className="small">{place.photo_info?.total_photos || 0}</strong>
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>
            </div>

            {/* Business Services */}
            {(place.delivery || place.takeout || place.dine_in || place.curbside_pickup || place.reservable || 
              place.serves_breakfast || place.serves_brunch || place.serves_lunch || place.serves_dinner ||
              place.serves_vegetarian_food || place.serves_beer || place.serves_wine || place.wheelchair_accessible_entrance) && (
              <div className="mb-4">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <CIcon icon={cilTag} className="text-muted" size="sm" />
                  <strong className="small">Services & Features</strong>
                </div>
                <div className="d-flex flex-wrap gap-2">
                  {place.delivery && <CBadge color="success" size="sm">Delivery</CBadge>}
                  {place.takeout && <CBadge color="success" size="sm">Takeout</CBadge>}
                  {place.dine_in && <CBadge color="success" size="sm">Dine-in</CBadge>}
                  {place.curbside_pickup && <CBadge color="success" size="sm">Curbside Pickup</CBadge>}
                  {place.reservable && <CBadge color="success" size="sm">Reservations</CBadge>}
                  {place.serves_breakfast && <CBadge color="info" size="sm">Breakfast</CBadge>}
                  {place.serves_brunch && <CBadge color="info" size="sm">Brunch</CBadge>}
                  {place.serves_lunch && <CBadge color="info" size="sm">Lunch</CBadge>}
                  {place.serves_dinner && <CBadge color="info" size="sm">Dinner</CBadge>}
                  {place.serves_vegetarian_food && <CBadge color="info" size="sm">Vegetarian</CBadge>}
                  {place.serves_beer && <CBadge color="warning" size="sm">Beer</CBadge>}
                  {place.serves_wine && <CBadge color="warning" size="sm">Wine</CBadge>}
                  {place.wheelchair_accessible_entrance && <CBadge color="primary" size="sm">Wheelchair Accessible</CBadge>}
                </div>
              </div>
            )}

            {/* Opening Hours */}
            {(place.opening_hours?.weekday_text?.length || place.hours?.weekday_text?.length) ? (
              <div className="mb-4">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <CIcon icon={cilClock} className="text-muted" size="sm" />
                  <strong className="small">Opening Hours</strong>
                </div>
                <div className="ps-4">
                  {(place.opening_hours?.weekday_text || place.hours?.weekday_text || []).map((day, index) => (
                    <p key={index} className="mb-1 small text-muted">{day}</p>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Additional Google Places Data */}
            <div className="mb-4">
              <div className="d-flex align-items-center gap-2 mb-2">
                <CIcon icon={cilGlobeAlt} className="text-muted" size="sm" />
                <strong className="small">Additional Information</strong>
              </div>
              <CRow className="g-3">
                {place.adr_address && (
                  <CCol md={6}>
                    <small className="text-muted d-block">ADR Address</small>
                    <div className="small" dangerouslySetInnerHTML={{ __html: place.adr_address }} />
                  </CCol>
                )}
                {place.vicinity && (
                  <CCol md={6}>
                    <small className="text-muted d-block">Vicinity</small>
                    <p className="mb-0 small">{place.vicinity}</p>
                  </CCol>
                )}
                {place.international_phone_number && (
                  <CCol md={6}>
                    <small className="text-muted d-block">International Phone</small>
                    <a href={`tel:${place.international_phone_number}`} className="text-decoration-none small">
                      {place.international_phone_number}
                    </a>
                  </CCol>
                )}
                {place.plus_code?.compound_code && (
                  <CCol md={6}>
                    <small className="text-muted d-block">Plus Code</small>
                    <p className="mb-0 small font-monospace">{place.plus_code.compound_code}</p>
                  </CCol>
                )}
              </CRow>
            </div>

            {/* Walky Place Types - From Database */}
            <div className="mb-4">
              <div className="d-flex align-items-center gap-2 mb-2">
                <CIcon icon={cilTag} className="text-muted" size="sm" />
                <strong className="small">Walky Categories</strong>
              </div>
              <div className="d-flex flex-wrap gap-1">
                {walkyCategories.length > 0 ? (
                  walkyCategories.map((placeType) => (
                    <CBadge key={placeType._id} color="primary" size="sm" className="fw-normal">
                      {placeType.name}
                    </CBadge>
                  ))
                ) : (
                  <span className="text-muted small">No categories mapped</span>
                )}
              </div>
            </div>

            {/* Map Preview */}
            {hasLocation && (
              <div className="mb-4">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <CIcon icon={cilLocationPin} className="text-muted" size="sm" />
                    <strong className="small">Location Preview</strong>
                  </div>
                  <CButton
                    color="link"
                    size="sm"
                    onClick={() => setActiveTab(2)}
                    className="text-decoration-none p-0"
                  >
                    View full map
                    <CIcon icon={cilExternalLink} className="ms-1" size="sm" />
                  </CButton>
                </div>
                <div 
                  className="rounded overflow-hidden position-relative border" 
                  style={{ height: "200px", cursor: "pointer", backgroundColor: "#f0f0f0" }}
                  onClick={() => setActiveTab(2)}
                >
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyAumxyJ5Z1j-_X1EHUSy8GCRr21zDPzSHs&q=${location!.lat},${location!.lng}&zoom=16`}
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Location Preview"
                    loading="lazy"
                  />
                </div>
              </div>
            )}
          </CTabPane>

          {/* Photos Tab */}
          <CTabPane visible={activeTab === 1}>
            {hasPhotos ? (
              <div>
                {/* Main Image */}
                <div className="position-relative rounded overflow-hidden mb-3 border photo-main-container" style={{ height: "400px" }}>
                  {imageLoading && (
                    <div className="position-absolute top-50 start-50 translate-middle">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  )}
                  <img
                    src={allPhotos[selectedImageIndex]?.large_url || allPhotos[selectedImageIndex]?.thumb_url || ''}
                    alt={`${place.name} photo ${selectedImageIndex + 1}`}
                    className="w-100 h-100"
                    style={{ objectFit: "contain" }}
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.style.display = 'none';
                      const parent = img.parentElement;
                      if (parent) {
                        parent.innerHTML = '<div class="text-center text-muted p-5"><i class="cil-image" style="font-size: 3rem;"></i><p class="mt-2">Failed to load image</p></div>';
                      }
                    }}
                    onLoad={() => setImageLoading(false)}
                  />
                  <div className="position-absolute bottom-0 end-0 m-3 bg-dark bg-opacity-75 text-white px-2 py-1 rounded small">
                    {selectedImageIndex + 1} / {allPhotos.length}
                  </div>
                </div>

                {/* Thumbnail Grid */}
                <div className="row g-2">
                  {allPhotos.map((photo, index) => (
                    <div key={index} className="col-2 col-md-1">
                      <div
                        className={`ratio ratio-1x1 rounded overflow-hidden border-2 ${
                          selectedImageIndex === index ? "border-primary" : "border"
                        }`}
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setSelectedImageIndex(index);
                          setImageLoading(true);
                        }}
                      >
                        <img
                          src={photo.thumb_url || ''}
                          alt={`${place.name} thumbnail ${index + 1}`}
                          className="w-100 h-100 photo-thumbnail"
                          style={{ objectFit: "cover" }}
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            img.style.opacity = '0.3';
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-5">
                <CIcon icon={cilImage} size="3xl" className="text-muted mb-3" />
                <p className="text-muted">No photos available for this place</p>
              </div>
            )}
          </CTabPane>

          {/* Map Tab */}
          <CTabPane visible={activeTab === 2}>
            {hasLocation ? (
              <div>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <CIcon icon={cilLocationPin} className="text-muted" size="sm" />
                    <span className="small text-muted">
                      {location!.lat.toFixed(6)}, {location!.lng.toFixed(6)}
                    </span>
                  </div>
                  <CButton color="primary" size="sm" onClick={openInGoogleMaps}>
                    <CIcon icon={cilExternalLink} className="me-1" size="sm" />
                    Open in Google Maps
                  </CButton>
                </div>
                
                {/* Embedded Google Map using iframe */}
                <div className="rounded overflow-hidden border position-relative map-container" style={{ height: "450px" }}>
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyAumxyJ5Z1j-_X1EHUSy8GCRr21zDPzSHs&q=${location!.lat},${location!.lng}&zoom=17`}
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Google Maps"
                    loading="lazy"
                    onError={() => {
                      console.error('Failed to load Google Maps');
                    }}
                  />
                  <div className="position-absolute bottom-0 start-0 m-3 bg-dark bg-opacity-75 text-white px-2 py-1 rounded small">
                    Lat: {location!.lat.toFixed(4)}, Lng: {location!.lng.toFixed(4)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-5">
                <CIcon icon={cilLocationPin} size="3xl" className="text-muted mb-3" />
                <p className="text-muted">No location data available for this place</p>
              </div>
            )}
          </CTabPane>

          {/* Technical Tab */}
          <CTabPane visible={activeTab === 3}>
            <div className="mb-4">
              <div className="d-flex align-items-center gap-2 mb-2">
                <CIcon icon={cilCode} className="text-muted" size="sm" />
                <strong className="small">Identifiers</strong>
              </div>
              <CCard className="border shadow-sm info-card">
                <CCardBody className="py-2">
                  <div className="font-monospace" style={{ fontSize: "0.8rem" }}>
                    <div className="mb-1">
                      <span className="text-muted">Place ID:</span> {place.place_id}
                    </div>
                    <div className="mb-1">
                      <span className="text-muted">Database ID:</span> {place._id}
                    </div>
                    {place.parent_place_id && (
                      <div>
                        <span className="text-muted">Parent ID:</span> {place.parent_place_id}
                      </div>
                    )}
                  </div>
                </CCardBody>
              </CCard>
            </div>

            <CRow className="g-3">
              <CCol xs={6} md={3}>
                <small className="text-muted d-block">Created</small>
                <p className="small fw-medium mb-0">
                  {place.createdAt ? new Date(place.createdAt).toLocaleDateString() : "Unknown"}
                </p>
              </CCol>
              <CCol xs={6} md={3}>
                <small className="text-muted d-block">Updated</small>
                <p className="small fw-medium mb-0">
                  {place.updatedAt ? new Date(place.updatedAt).toLocaleDateString() : "Unknown"}
                </p>
              </CCol>
              <CCol xs={6} md={3}>
                <small className="text-muted d-block">Synced</small>
                <p className="small fw-medium mb-0">{place.is_synced ? "Yes" : "No"}</p>
              </CCol>
              <CCol xs={6} md={3}>
                <small className="text-muted d-block">Last Sync</small>
                <p className="small fw-medium mb-0">
                  {place.last_synced_at ? new Date(place.last_synced_at).toLocaleDateString() : "Never"}
                </p>
              </CCol>
            </CRow>
            
            {/* Business Status */}
            {place.business_status && (
              <div className="mt-3">
                <small className="text-muted d-block mb-1">Business Status</small>
                <CBadge 
                  color={place.business_status === 'OPERATIONAL' ? 'success' : 
                         place.business_status === 'CLOSED_TEMPORARILY' ? 'warning' : 'danger'}
                  size="sm"
                >
                  {place.business_status.replace(/_/g, ' ')}
                </CBadge>
              </div>
            )}
            
            {/* Google Maps URL */}
            {place.url && (
              <div className="mt-3">
                <small className="text-muted d-block mb-1">Google Maps</small>
                <a href={place.url} target="_blank" rel="noopener noreferrer" className="small">
                  View on Google Maps <CIcon icon={cilExternalLink} size="sm" className="ms-1" />
                </a>
              </div>
            )}

            {/* Additional Technical Data */}
            <div className="mt-4">
              <strong className="small d-block mb-2">Extended Data</strong>
              <CRow className="g-3">
                {place.icon && (
                  <CCol xs={12}>
                    <small className="text-muted d-block">Icon URL</small>
                    <p className="mb-0 small text-truncate">{place.icon}</p>
                  </CCol>
                )}
                {place.icon_background_color && (
                  <CCol xs={6} md={3}>
                    <small className="text-muted d-block">Icon Color</small>
                    <div className="d-flex align-items-center gap-2">
                      <div style={{ width: '20px', height: '20px', backgroundColor: place.icon_background_color, border: '1px solid #ccc', borderRadius: '4px' }}></div>
                      <span className="small font-monospace">{place.icon_background_color}</span>
                    </div>
                  </CCol>
                )}
                {place.icon_mask_base_uri && (
                  <CCol xs={12}>
                    <small className="text-muted d-block">Icon Mask URI</small>
                    <p className="mb-0 small text-truncate">{place.icon_mask_base_uri}</p>
                  </CCol>
                )}
                <CCol xs={6} md={4}>
                  <small className="text-muted d-block">Total Photos</small>
                  <p className="mb-0 small fw-medium">{place.photo_info?.total_photos || place.photos?.length || 0}</p>
                </CCol>
                <CCol xs={6} md={4}>
                  <small className="text-muted d-block">Photo Sources</small>
                  <div className="small">
                    {place.photo_info?.thumbnails && place.photo_info.thumbnails.length > 0 && <div>Thumbnails: {place.photo_info.thumbnails.length}</div>}
                    {place.photos && place.photos.length > 0 && <div>Photos: {place.photos.length}</div>}
                  </div>
                </CCol>
                {place.reference && (
                  <CCol xs={12}>
                    <small className="text-muted d-block">Google Reference</small>
                    <p className="mb-0 small font-monospace text-truncate">{place.reference}</p>
                  </CCol>
                )}
              </CRow>
            </div>
          </CTabPane>
        </CTabContent>
      </CModalBody>
      <CModalFooter className="border-top">
        <CButton color="secondary" size="sm" onClick={onClose}>
          Close
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default PlaceDetailsModal;