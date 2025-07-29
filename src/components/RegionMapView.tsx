import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  CSpinner,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CAlert,
  CBadge,
  CButton,
  CButtonGroup,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CFormCheck,
} from "@coreui/react";
import { useTheme } from "../hooks/useTheme";
import CIcon from "@coreui/icons-react";
import { cilFilter, cilX } from "@coreui/icons";
import {
  GoogleMap,
  useJsApiLoader,
  Libraries,
  Marker,
  InfoWindow,
  Polygon,
} from "@react-google-maps/api";
import { useQuery } from "@tanstack/react-query";
import { Campus } from "../types/campus";
import { PlacesResponse, Place } from "../types/place";
import { PlaceType } from "../types/placeType";
import PlaceDetailsModal from "./PlaceDetailsModal";
import { placeTypeService } from "../services/placeTypeService";

interface RegionMapViewProps {
  campuses: Campus[];
  selectedCampus: string;
  onCampusSelect: (campusId: string) => void;
  placesData: PlacesResponse | undefined;
  isLoading: boolean;
  totalPlaces?: number;
}

const libraries: Libraries = ["drawing", "places"];

const mapContainerStyle = {
  width: "100%",
  height: "600px",
  borderRadius: "8px",
  overflow: "hidden",
};

const center = {
  lat: 40.7128,
  lng: -74.006,
};

interface MarkerData {
  id: string;
  position: { lat: number; lng: number };
  title: string;
  address: string;
  category: string;
  rating?: number;
  photoUrl?: string;
}

const RegionMapView: React.FC<RegionMapViewProps> = ({
  campuses,
  selectedCampus,
  placesData,
  isLoading,
  totalPlaces = 0,
}) => {
  const { theme } = useTheme();
  const mapRef = useRef<google.maps.Map | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [places, setPlaces] = useState<Place[]>([]);
  const [campusPolygon, setCampusPolygon] = useState<google.maps.LatLngLiteral[]>([]);
  
  // Filter states
  const [filterType, setFilterType] = useState<'none' | 'walky' | 'google'>('none');
  const [selectedWalkyCategories, setSelectedWalkyCategories] = useState<Set<string>>(new Set());
  const [selectedGoogleTypes, setSelectedGoogleTypes] = useState<Set<string>>(new Set());
  const [availableGoogleTypes, setAvailableGoogleTypes] = useState<string[]>([]);
  const [availableWalkyCategories, setAvailableWalkyCategories] = useState<PlaceType[]>([]);

  // Load Walky place types from API
  const { data: placeTypes = [], isLoading: placeTypesLoading } = useQuery({
    queryKey: ['placeTypes'],
    queryFn: () => placeTypeService.getAll({ is_active: true }),
  });

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyAumxyJ5Z1j-_X1EHUSy8GCRr21zDPzSHs",
    libraries,
  });

  // Extract available Google types from places
  useEffect(() => {
    if (placesData?.places) {
      // Store places for modal
      setPlaces(placesData.places);
      
      // Extract unique Google types
      const googleTypes = new Set<string>();
      
      placesData.places.forEach(place => {
        // Collect Google types
        const types = place.google_types || place.types || [];
        types.forEach(type => googleTypes.add(type));
      });
      
      setAvailableGoogleTypes(Array.from(googleTypes).sort());
    }
  }, [placesData]);

  // Set available Walky categories from loaded PlaceTypes
  useEffect(() => {
    if (placeTypes && placeTypes.length > 0) {
      setAvailableWalkyCategories(placeTypes);
    }
  }, [placeTypes]);

  // Convert places to markers with filtering
  useEffect(() => {
    if (placesData?.places) {
      let filteredPlaces = placesData.places;
      
      // Apply filters
      if (filterType === 'walky' && selectedWalkyCategories.size > 0) {
        // Get all Google types mapped to selected Walky categories
        const mappedGoogleTypes = new Set<string>();
        placeTypes.forEach(placeType => {
          if (selectedWalkyCategories.has(placeType._id)) {
            placeType.google_types.forEach(gt => mappedGoogleTypes.add(gt));
          }
        });
        
        // Filter places by these Google types
        filteredPlaces = filteredPlaces.filter(place => {
          const types = place.google_types || place.types || [];
          return types.some(type => mappedGoogleTypes.has(type));
        });
      } else if (filterType === 'google' && selectedGoogleTypes.size > 0) {
        filteredPlaces = filteredPlaces.filter(place => {
          const types = place.google_types || place.types || [];
          return types.some(type => selectedGoogleTypes.has(type));
        });
      }
      
      const newMarkers: MarkerData[] = filteredPlaces
        .filter(place => {
          // Check for coordinates in different possible locations
          return (place.geometry?.location?.lat && place.geometry?.location?.lng) ||
                 (place.coordinates?.lat && place.coordinates?.lng);
        })
        .map(place => {
          // Get coordinates from either geometry.location or coordinates
          const lat = place.geometry?.location?.lat || place.coordinates?.lat || 0;
          const lng = place.geometry?.location?.lng || place.coordinates?.lng || 0;
          
          return {
            id: place._id || place.place_id,
            position: { lat, lng },
            title: place.name,
            address: place.address || place.formatted_address || place.vicinity || "No address available",
            category: place.google_types?.[0] || place.types?.[0] || "Unknown",
            rating: place.rating,
            photoUrl: place.photos?.[0]?.optimized_urls?.thumb || place.photos?.[0]?.gcs_url,
          };
        });
      setMarkers(newMarkers);
    }
  }, [placesData, filterType, selectedWalkyCategories, selectedGoogleTypes, placeTypes]);

  // Get selected campus data
  const selectedCampusData = campuses.find(c => c.id === selectedCampus);

  // Update campus polygon when campus changes
  useEffect(() => {
    if (selectedCampusData?.coordinates?.coordinates?.[0]) {
      const polygonCoords = selectedCampusData.coordinates.coordinates[0].map(
        ([lng, lat]: number[]) => ({ lat, lng })
      );
      setCampusPolygon(polygonCoords);

      // Fit map to polygon bounds
      if (mapRef.current && polygonCoords.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        polygonCoords.forEach(coord => bounds.extend(coord));
        mapRef.current.fitBounds(bounds, {
          top: 50,
          right: 50,
          bottom: 50,
          left: 50,
        });
      }
    } else {
      setCampusPolygon([]);
    }
  }, [selectedCampusData]);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  // Handle marker click for modal
  const handleMarkerClick = (marker: MarkerData) => {
    setSelectedMarker(marker);
    
    // Find the full place data from the original places array
    const place = placesData?.places.find(p => (p._id || p.place_id) === marker.id);
    if (place) {
      setSelectedPlace(place);
      setShowDetailsModal(true);
    }
  };


  // Handle filter changes
  const handleWalkyCategoryToggle = (categoryId: string) => {
    const newSelection = new Set(selectedWalkyCategories);
    if (newSelection.has(categoryId)) {
      newSelection.delete(categoryId);
    } else {
      newSelection.add(categoryId);
    }
    setSelectedWalkyCategories(newSelection);
  };

  const handleGoogleTypeToggle = (type: string) => {
    const newSelection = new Set(selectedGoogleTypes);
    if (newSelection.has(type)) {
      newSelection.delete(type);
    } else {
      newSelection.add(type);
    }
    setSelectedGoogleTypes(newSelection);
  };

  const clearFilters = () => {
    setFilterType('none');
    setSelectedWalkyCategories(new Set());
    setSelectedGoogleTypes(new Set());
  };

  if (loadError) {
    return (
      <CAlert color="danger">
        Error loading Google Maps: {loadError.message}
      </CAlert>
    );
  }

  if (!isLoaded) {
    return (
      <div className="text-center py-5">
        <CSpinner color="primary" />
        <p className="mt-2">Loading map...</p>
      </div>
    );
  }

  return (
    <div>
      {selectedCampus && (
        <>
          <CRow className="mb-3">
            <CCol>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <span className="me-3">
                    <CBadge color="info" className="me-2">
                      {markers.length}
                    </CBadge>
                    Places on map
                    {totalPlaces > markers.length && (
                      <span className="text-muted ms-1">
                        (showing first {markers.length} of {totalPlaces} total)
                      </span>
                    )}
                  </span>
                  {selectedCampusData && (
                    <span>
                      <CBadge color="success">
                        {selectedCampusData.campus_name}
                      </CBadge>
                    </span>
                  )}
                </div>
              </div>
            </CCol>
          </CRow>

          {/* Filter Controls */}
          <CRow className="mb-3">
            <CCol>
              <div className="d-flex align-items-center gap-3">
                <CButtonGroup size="sm">
                  <CButton
                    color={filterType === 'none' ? 'primary' : 'secondary'}
                    onClick={() => clearFilters()}
                  >
                    All Places
                  </CButton>
                  <CButton
                    color={filterType === 'walky' ? 'primary' : 'secondary'}
                    onClick={() => setFilterType('walky')}
                    disabled={placeTypesLoading || availableWalkyCategories.length === 0}
                  >
                    Filter by Walky Category
                  </CButton>
                  <CButton
                    color={filterType === 'google' ? 'primary' : 'secondary'}
                    onClick={() => setFilterType('google')}
                    disabled={availableGoogleTypes.length === 0}
                  >
                    Filter by Google Type
                  </CButton>
                </CButtonGroup>

                {filterType !== 'none' && (
                  <CDropdown variant="btn-group">
                    <CDropdownToggle color="secondary" size="sm">
                      <CIcon icon={cilFilter} className="me-2" />
                      {filterType === 'walky' 
                        ? `${selectedWalkyCategories.size} categories selected`
                        : `${selectedGoogleTypes.size} types selected`}
                    </CDropdownToggle>
                    <CDropdownMenu style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {filterType === 'walky' ? (
                        availableWalkyCategories.length > 0 ? (
                          availableWalkyCategories.map(placeType => (
                            <CDropdownItem key={placeType._id} onClick={(e) => e.preventDefault()}>
                              <CFormCheck
                                id={`walky-${placeType._id}`}
                                label={placeType.name}
                                checked={selectedWalkyCategories.has(placeType._id)}
                                onChange={() => handleWalkyCategoryToggle(placeType._id)}
                              />
                            </CDropdownItem>
                          ))
                        ) : (
                          <CDropdownItem disabled>No Walky categories available</CDropdownItem>
                        )
                      ) : (
                        availableGoogleTypes.length > 0 ? (
                          availableGoogleTypes.map(type => (
                            <CDropdownItem key={type} onClick={(e) => e.preventDefault()}>
                              <CFormCheck
                                id={`google-${type}`}
                                label={type}
                                checked={selectedGoogleTypes.has(type)}
                                onChange={() => handleGoogleTypeToggle(type)}
                              />
                            </CDropdownItem>
                          ))
                        ) : (
                          <CDropdownItem disabled>No Google types available</CDropdownItem>
                        )
                      )}
                    </CDropdownMenu>
                  </CDropdown>
                )}

                {(selectedWalkyCategories.size > 0 || selectedGoogleTypes.size > 0) && (
                  <CButton
                    color="danger"
                    size="sm"
                    variant="ghost"
                    onClick={clearFilters}
                  >
                    <CIcon icon={cilX} className="me-1" />
                    Clear Filters
                  </CButton>
                )}
              </div>
            </CCol>
          </CRow>
        </>
      )}

      {!selectedCampus && (
        <div className="text-center py-5 text-muted">
          <h5>Select a campus to view region and places</h5>
          <p>Choose a campus from the dropdown above to see the region boundary and all synced places.</p>
        </div>
      )}

      {selectedCampus && totalPlaces > 200 && (
        <CAlert color="info" className="mb-3">
          <strong>Note:</strong> This campus has {totalPlaces} places. Currently showing the first 200 places on the map for performance. 
          Contact your administrator if you need to see more places at once.
        </CAlert>
      )}

      {selectedCampus && (
        <CCard>
          <CCardBody className="p-0">
            <div style={mapContainerStyle}>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={
                  selectedCampusData?.coordinates?.coordinates?.[0]?.[0]
                    ? {
                        lat: selectedCampusData.coordinates.coordinates[0][0][1],
                        lng: selectedCampusData.coordinates.coordinates[0][0][0],
                      }
                    : center
                }
                zoom={14}
                options={{
                  mapTypeControl: true,
                  streetViewControl: false,
                  fullscreenControl: true,
                  styles: theme.isDark
                    ? [
                        {
                          elementType: "geometry",
                          stylers: [{ color: "#242f3e" }],
                        },
                        {
                          elementType: "labels.text.stroke",
                          stylers: [{ color: "#242f3e" }],
                        },
                        {
                          elementType: "labels.text.fill",
                          stylers: [{ color: "#746855" }],
                        },
                        {
                          featureType: "water",
                          elementType: "geometry",
                          stylers: [{ color: "#17263c" }],
                        },
                      ]
                    : [],
                }}
                onLoad={onMapLoad}
              >
                {/* Campus Boundary Polygon */}
                {campusPolygon.length > 0 && (
                  <Polygon
                    paths={campusPolygon}
                    options={{
                      fillColor: theme.isDark ? "#1e90ff" : "#3388ff",
                      fillOpacity: 0.1,
                      strokeWeight: 2,
                      strokeColor: theme.isDark ? "#1e90ff" : "#3388ff",
                      strokeOpacity: 0.8,
                    }}
                  />
                )}

                {/* Place Markers */}
                {markers.map(marker => (
                  <Marker
                    key={marker.id}
                    position={marker.position}
                    title={marker.title}
                    onClick={() => handleMarkerClick(marker)}
                    icon={{
                      url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                      scaledSize: new google.maps.Size(32, 32),
                    }}
                  />
                ))}

                {/* Info Window */}
                {selectedMarker && (
                  <InfoWindow
                    position={selectedMarker.position}
                    onCloseClick={() => setSelectedMarker(null)}
                  >
                    <div style={{ padding: "8px", maxWidth: "250px" }}>
                      {selectedMarker.photoUrl && (
                        <img
                          src={selectedMarker.photoUrl}
                          alt={selectedMarker.title}
                          style={{
                            width: "100%",
                            height: "120px",
                            objectFit: "cover",
                            borderRadius: "4px",
                            marginBottom: "8px",
                          }}
                        />
                      )}
                      <h5 style={{ margin: "0 0 4px 0", fontSize: "16px" }}>
                        {selectedMarker.title}
                      </h5>
                      <p style={{ margin: "0 0 4px 0", fontSize: "13px", color: "#666" }}>
                        {selectedMarker.address}
                      </p>
                      <p style={{ margin: "0", fontSize: "12px", color: "#888" }}>
                        Category: {selectedMarker.category}
                      </p>
                      {selectedMarker.rating && (
                        <p style={{ margin: "4px 0 0 0", fontSize: "12px" }}>
                          Rating: ⭐ {selectedMarker.rating.toFixed(1)}
                        </p>
                      )}
                      <button
                        onClick={() => {
                          const place = places.find(p => (p._id || p.place_id) === selectedMarker.id);
                          if (place) {
                            setSelectedPlace(place);
                            setShowDetailsModal(true);
                            setSelectedMarker(null); // Close info window
                          }
                        }}
                        style={{
                          marginTop: "8px",
                          padding: "4px 12px",
                          backgroundColor: "#007bff",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "12px",
                          width: "100%",
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </div>
          </CCardBody>
        </CCard>
      )}

      {selectedCampus && isLoading && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <CSpinner color="primary" />
          <p className="mt-2 mb-0">Loading places...</p>
        </div>
      )}

      {/* Place Details Modal */}
      <PlaceDetailsModal
        place={selectedPlace}
        visible={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedPlace(null);
        }}
      />
    </div>
  );
};

export default RegionMapView;