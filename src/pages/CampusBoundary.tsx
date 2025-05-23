import React, { useState, useCallback, useRef } from 'react';
import {
  CCard,
  CCardHeader,
  CCardBody,
  CForm,
  CButton,
  CSpinner,
} from '@coreui/react';
import { useTheme } from '../hooks/useTheme';
import { GoogleMap, useJsApiLoader, DrawingManager, Libraries, StandaloneSearchBox } from '@react-google-maps/api';

// Declare google on window object for TypeScript
declare global {
  interface Window {
    google: typeof google;
  }
}

// Set your Google Maps API key here
// In a production environment, you should use environment variables

// Map container style
const mapContainerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '8px',
  overflow: 'hidden',
};

// Default center position (New York City)
const center = {
  lat: 40.7128,
  lng: -74.0060
};

interface GeoJSONPolygon {
  type: string;
  coordinates: number[][][];
}

interface CampusBoundaryData {
  geometry: GeoJSONPolygon;
}

const libraries: Libraries = ["drawing", "places"];

const CampusBoundary = () => {
  const { theme } = useTheme();
  
  // State for form fields
  const [boundaryData, setBoundaryData] = useState<CampusBoundaryData | null>(null);
  
  // Google Maps references
  const polygonRef = useRef<google.maps.Polygon | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(null);
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);
  
  // Load Google Maps JavaScript API
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  });
  
  // Handle map load
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);
  
  // Handle search box load
  const onSearchBoxLoad = useCallback((searchBox: google.maps.places.SearchBox) => {
    searchBoxRef.current = searchBox;
    
    // Listen for places selection
    searchBox.addListener('places_changed', () => {
      const places = searchBox.getPlaces();
      if (!places || places.length === 0) return;
      
      // Get the first place
      const place = places[0];
      if (!place.geometry || !place.geometry.location) return;
      
      // Center map on the selected place
      if (mapRef.current) {
        mapRef.current.setCenter(place.geometry.location);
        mapRef.current.setZoom(16);
      }
    });
  }, []);
  
  // Handle polygon complete
  const onPolygonComplete = useCallback((polygon: google.maps.Polygon) => {
    // Clear any existing polygon
    if (polygonRef.current) {
      polygonRef.current.setMap(null);
    }
    
    // Save the new polygon
    polygonRef.current = polygon;
    
    // Get polygon path
    const path = polygon.getPath();
    const coordinates = [];
    
    // Convert path to coordinates array
    for (let i = 0; i < path.getLength(); i++) {
      const latLng = path.getAt(i);
      coordinates.push([latLng.lng(), latLng.lat()]);
    }
    
    // Close the polygon
    if (path.getLength() > 0) {
      const firstPoint = path.getAt(0);
      coordinates.push([firstPoint.lng(), firstPoint.lat()]);
    }
    
    // Create GeoJSON polygon
    const polygonData: CampusBoundaryData = {
      geometry: {
        type: 'Polygon',
        coordinates: [coordinates]
      }
    };
    
    setBoundaryData(polygonData);
    
    // Switch drawing mode off after completing a polygon
    if (drawingManagerRef.current) {
      drawingManagerRef.current.setDrawingMode(null);
    }
  }, []);
  
  // Handle drawing manager load
  const onDrawingManagerLoad = useCallback((drawingManager: google.maps.drawing.DrawingManager) => {
    drawingManagerRef.current = drawingManager;
  }, []);
  
  // Handle clear boundary
  const handleClearBoundary = () => {
    if (polygonRef.current) {
      polygonRef.current.setMap(null);
      polygonRef.current = null;
    }
    
    setBoundaryData(null);
    
    // Reset drawing mode
    if (drawingManagerRef.current && isLoaded) {
      const drawingManager = drawingManagerRef.current;
      // Only access Google Maps objects when the API is loaded
      if (window.google && window.google.maps) {
        drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
      }
    }
  };
  
  // Start drawing polygon
  const handleStartDrawing = () => {
    if (drawingManagerRef.current && isLoaded && window.google && window.google.maps) {
      drawingManagerRef.current.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!boundaryData) {
      alert('Please draw a campus boundary on the map.');
      return;
    }
    
    try {
      // This would be replaced with your actual API call
      // await API.put('/settings/campus-boundary', boundaryData);
      console.log('Campus Boundary updated:', boundaryData);
      alert('Campus boundary saved successfully!');
    } catch (error) {
      console.error('Failed to save campus boundary:', error);
      alert('Failed to save campus boundary. Please try again.');
    }
  };
  
  // Build drawing options only when the API is loaded
  const getDrawingManagerOptions = () => {
    if (!isLoaded || !window.google || !window.google.maps) {
      return {};
    }
    
    return {
      drawingControl: false, // Turn off default controls to avoid duplicates
      polygonOptions: {
        fillColor: theme.isDark ? '#1e90ff' : '#3388ff',
        fillOpacity: 0.2,
        strokeWeight: 2,
        strokeColor: theme.isDark ? '#1e90ff' : '#3388ff',
        clickable: true,
        editable: true,
        zIndex: 1,
      },
    };
  };
  
  // Determine map styles based on theme
  const mapOptions = isLoaded ? {
    mapTypeControl: true,
    streetViewControl: false,
    fullscreenControl: true,
    styles: theme.isDark ? [
      { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
      {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }],
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }],
      },
      {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }],
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }],
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }],
      },
      {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#2f3948" }],
      },
      {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }],
      },
    ] : []
  } : {};

  if (loadError) {
    return (
      <div className="p-4">
        <CCard style={{ backgroundColor: theme.colors.cardBg, borderColor: theme.colors.borderColor }}>
          <CCardBody>
            <div className="text-center">
              <p style={{ color: theme.colors.bodyColor }}>
                Error loading Google Maps: {loadError.message}
              </p>
            </div>
          </CCardBody>
        </CCard>
      </div>
    );
  }

  return (
    <div className="p-4">
      <CCard style={{ 
        backgroundColor: theme.colors.cardBg,
        borderColor: theme.colors.borderColor
      }}>
        <CCardHeader style={{ 
          backgroundColor: theme.colors.cardBg,
          borderColor: theme.colors.borderColor,
          color: theme.colors.bodyColor
        }}>
          <h4 className="mb-0">Campus Boundary</h4>
        </CCardHeader>
        <CCardBody>
          <p style={{ color: theme.colors.bodyColor }}>
            Draw a polygon around your campus on the map below. Use the search to find your location, then draw a boundary using the drawing tools.
          </p>
          
          <div style={{ 
            marginBottom: '20px',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
          }}>
            {!isLoaded ? (
              <div 
                style={{ 
                  ...mapContainerStyle, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  backgroundColor: theme.isDark ? '#242f3e' : '#f8f9fa'
                }}
              >
                <CSpinner color="primary" />
              </div>
            ) : (
              <>
                <div style={{ 
                  padding: '10px', 
                  backgroundColor: theme.isDark ? '#343a40' : '#f8f9fa',
                  borderBottom: `1px solid ${theme.colors.borderColor}`
                }}>
                  <div className="d-flex">
                    <StandaloneSearchBox onLoad={onSearchBoxLoad}>
                      <input
                        type="text"
                        placeholder="Search for your campus location"
                        style={{
                          padding: '8px 12px',
                          borderRadius: '4px',
                          border: `1px solid ${theme.colors.borderColor}`,
                          boxSizing: 'border-box',
                          width: '300px',
                          backgroundColor: theme.isDark ? '#212529' : '#fff',
                          color: theme.isDark ? '#fff' : '#212529'
                        }}
                      />
                    </StandaloneSearchBox>
                    <CButton
                      color="primary"
                      className="ms-2"
                      onClick={handleStartDrawing}
                    >
                      Draw Boundary
                    </CButton>
                  </div>
                </div>
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={center}
                  zoom={13}
                  options={mapOptions}
                  onLoad={onMapLoad}
                >
                  <DrawingManager
                    onLoad={onDrawingManagerLoad}
                    options={getDrawingManagerOptions()}
                    onPolygonComplete={onPolygonComplete}
                  />
                </GoogleMap>
              </>
            )}
          </div>
          
          <CForm onSubmit={handleSubmit}>
            <div className="d-flex justify-content-end mt-4">
              <CButton 
                type="button" 
                color="outline-secondary" 
                className="me-2"
                onClick={handleClearBoundary}
              >
                Clear Boundary
              </CButton>
              <CButton 
                type="submit" 
                color="primary"
                disabled={!boundaryData}
              >
                Save Boundary
              </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default CampusBoundary;