import { useState, useCallback, useRef } from "react";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CForm,
  CButton,
  CSpinner,
} from "@coreui/react";
import {
  GoogleMap,
  useJsApiLoader,
  DrawingManager,
  Libraries,
  StandaloneSearchBox,
} from "@react-google-maps/api";
import { useTheme } from "../../hooks/useTheme";

declare global {
  interface Window {
    google: typeof google;
  }
}

interface GeoJSONPolygon {
  type: string;
  coordinates: number[][][];
}

interface CampusBoundaryData {
  geometry: GeoJSONPolygon;
}

const libraries: Libraries = ["drawing", "places"];

interface CampusBoundaryProps {
  initialBoundaryData?: CampusBoundaryData | null;
  onBoundaryChange?: (boundary: CampusBoundaryData | null) => void;
  onValidityChange?: (isValid: boolean) => void;
  readOnly?: boolean;
}

const CampusBoundary = ({
  initialBoundaryData = null,
  onBoundaryChange,
  onValidityChange,
  readOnly = false,
}: CampusBoundaryProps) => {
  const { theme } = useTheme();

  // Dynamic map container style based on readOnly prop
  const mapContainerStyle = {
    width: "100%",
    height: readOnly ? "650px" : "560px",
    borderRadius: "8px",
    overflow: "hidden",
  };

  const [boundaryData, setBoundaryData] = useState<CampusBoundaryData | null>(
    initialBoundaryData,
  );
  const [hasBeenCleared, setHasBeenCleared] = useState(false);

  const polygonRef = useRef<google.maps.Polygon | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(
    null,
  );
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyAumxyJ5Z1j-_X1EHUSy8GCRr21zDPzSHs",
    libraries,
  });

  const onMapLoad = useCallback(
    (map: google.maps.Map) => {
      mapRef.current = map;

      // Function to update boundary from polygon
      const updateBoundaryFromPolygon = () => {
        if (!polygonRef.current) return;

        const path = polygonRef.current.getPath();
        const coords: number[][] = [];
        for (let i = 0; i < path.getLength(); i++) {
          const latLng = path.getAt(i);
          coords.push([latLng.lng(), latLng.lat()]);
        }
        if (path.getLength() > 0) {
          const firstPoint = path.getAt(0);
          coords.push([firstPoint.lng(), firstPoint.lat()]);
        }
        const newBoundary: CampusBoundaryData = {
          geometry: {
            type: "Polygon",
            coordinates: [coords],
          },
        };
        setBoundaryData(newBoundary);
        if (onBoundaryChange) onBoundaryChange(newBoundary);
        if (onValidityChange) onValidityChange(true);
      };

      // If there's current boundary data and it hasn't been manually cleared, render polygon on the map
      if (
        boundaryData &&
        boundaryData.geometry.coordinates.length &&
        !hasBeenCleared
      ) {
        const pathCoords = boundaryData.geometry.coordinates[0].map(
          ([lng, lat]) => ({ lat, lng }),
        );

        const polygon = new window.google.maps.Polygon({
          paths: pathCoords,
          fillColor: theme.isDark ? "#1e90ff" : "#3388ff",
          fillOpacity: 0.2,
          strokeWeight: 2,
          strokeColor: theme.isDark ? "#1e90ff" : "#3388ff",
          clickable: !readOnly,
          editable: !readOnly,
          zIndex: 1,
          map,
        });

        polygonRef.current = polygon;

        // Only add event listeners if not readonly
        if (!readOnly) {
          // Listen to polygon changes and update boundary data
          window.google.maps.event.addListener(
            polygon.getPath(),
            "set_at",
            () => updateBoundaryFromPolygon(),
          );
          window.google.maps.event.addListener(
            polygon.getPath(),
            "insert_at",
            () => updateBoundaryFromPolygon(),
          );
          window.google.maps.event.addListener(
            polygon.getPath(),
            "remove_at",
            () => updateBoundaryFromPolygon(),
          );
        }

        // Center the map on the polygon for better viewing
        const bounds = new window.google.maps.LatLngBounds();
        pathCoords.forEach((coord) => bounds.extend(coord));

        // In read-only mode, add more padding to show a wider area
        if (readOnly) {
          map.fitBounds(bounds, {
            top: 100,
            right: 100,
            bottom: 100,
            left: 100,
          });
        } else {
          map.fitBounds(bounds);
        }
      }
    },
    [
      boundaryData,
      hasBeenCleared,
      theme.isDark,
      readOnly,
      onBoundaryChange,
      onValidityChange,
    ],
  );

  const handleZoom = (delta: number) => {
    const map = mapRef.current;
    if (!map) return;
    const currentZoom = map.getZoom() ?? 13;
    const nextZoom = Math.min(21, Math.max(1, currentZoom + delta));
    map.setZoom(nextZoom);
  };

  const onSearchBoxLoad = useCallback(
    (searchBox: google.maps.places.SearchBox) => {
      searchBoxRef.current = searchBox;
      searchBox.addListener("places_changed", () => {
        const places = searchBox.getPlaces();
        if (!places || places.length === 0) return;
        const place = places[0];
        if (!place.geometry || !place.geometry.location) return;
        if (mapRef.current) {
          mapRef.current.setCenter(place.geometry.location);
          mapRef.current.setZoom(16);
        }
      });
    },
    [],
  );

  const onPolygonComplete = useCallback(
    (polygon: google.maps.Polygon) => {
      if (polygonRef.current) {
        polygonRef.current.setMap(null);
      }
      polygonRef.current = polygon;

      polygon.setEditable(true);

      // Update boundary from polygon
      const path = polygon.getPath();
      const coords: number[][] = [];
      for (let i = 0; i < path.getLength(); i++) {
        const latLng = path.getAt(i);
        coords.push([latLng.lng(), latLng.lat()]);
      }
      if (path.getLength() > 0) {
        const firstPoint = path.getAt(0);
        coords.push([firstPoint.lng(), firstPoint.lat()]);
      }
      const newBoundary: CampusBoundaryData = {
        geometry: {
          type: "Polygon",
          coordinates: [coords],
        },
      };
      setBoundaryData(newBoundary);
      if (onBoundaryChange) onBoundaryChange(newBoundary);
      if (onValidityChange) onValidityChange(true);

      // Reset the cleared flag since we now have a new boundary
      setHasBeenCleared(false);

      if (drawingManagerRef.current) {
        drawingManagerRef.current.setDrawingMode(null);
      }

      // Listen for edits on polygon
      const updateFromEdit = () => {
        const path = polygon.getPath();
        const coords: number[][] = [];
        for (let i = 0; i < path.getLength(); i++) {
          const latLng = path.getAt(i);
          coords.push([latLng.lng(), latLng.lat()]);
        }
        if (path.getLength() > 0) {
          const firstPoint = path.getAt(0);
          coords.push([firstPoint.lng(), firstPoint.lat()]);
        }
        const newBoundary: CampusBoundaryData = {
          geometry: {
            type: "Polygon",
            coordinates: [coords],
          },
        };
        setBoundaryData(newBoundary);
        if (onBoundaryChange) onBoundaryChange(newBoundary);
        if (onValidityChange) onValidityChange(true);
      };

      window.google.maps.event.addListener(
        polygon.getPath(),
        "set_at",
        updateFromEdit,
      );
      window.google.maps.event.addListener(
        polygon.getPath(),
        "insert_at",
        updateFromEdit,
      );
      window.google.maps.event.addListener(
        polygon.getPath(),
        "remove_at",
        updateFromEdit,
      );
    },
    [onBoundaryChange, onValidityChange],
  );

  const onDrawingManagerLoad = useCallback(
    (drawingManager: google.maps.drawing.DrawingManager) => {
      drawingManagerRef.current = drawingManager;
    },
    [],
  );

  const handleClearBoundary = () => {
    // Clear any existing polygon from the map
    if (polygonRef.current) {
      polygonRef.current.setMap(null);
      polygonRef.current = null;
    }

    // Clear the boundary data state
    setBoundaryData(null);

    // Mark that the boundary has been manually cleared
    setHasBeenCleared(true);

    // Notify parent component that boundary has been cleared
    if (onBoundaryChange) onBoundaryChange(null);
    if (onValidityChange) onValidityChange(false);

    // Set drawing manager back to polygon mode if available
    if (
      drawingManagerRef.current &&
      isLoaded &&
      window.google &&
      window.google.maps
    ) {
      drawingManagerRef.current.setDrawingMode(
        google.maps.drawing.OverlayType.POLYGON,
      );
    }
  };

  const handleStartDrawing = () => {
    if (
      drawingManagerRef.current &&
      isLoaded &&
      window.google &&
      window.google.maps
    ) {
      drawingManagerRef.current.setDrawingMode(
        google.maps.drawing.OverlayType.POLYGON,
      );
    }
  };

  if (loadError) {
    return (
      <div className="p-4">
        <CCard
          style={{
            backgroundColor: theme.colors.cardBg,
            borderColor: theme.colors.borderColor,
          }}
        >
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
    <main className="campus-boundary-page" style={{ marginBottom: 0 }}>
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
          <h4 className="mb-0">Campus Boundary</h4>
        </CCardHeader>
        <CCardBody>
          {!readOnly && (
            <p style={{ color: theme.colors.bodyColor }}>
              Draw a polygon around your campus on the map below. Use the search
              to find your location, then draw a boundary using the drawing
              tools.
            </p>
          )}

          <div
            style={{
              marginBottom: "20px",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
          >
            {!isLoaded ? (
              <div
                style={{
                  ...mapContainerStyle,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: theme.isDark ? "#242f3e" : "#f8f9fa",
                }}
              >
                <CSpinner color="primary" />
              </div>
            ) : (
              <>
                {!readOnly && (
                  <div
                    style={{
                      padding: "10px",
                      backgroundColor: theme.isDark ? "#343a40" : "#f8f9fa",
                      borderBottom: `1px solid ${theme.colors.borderColor}`,
                    }}
                  >
                    <div className="d-flex">
                      <StandaloneSearchBox onLoad={onSearchBoxLoad}>
                        <input
                          type="text"
                          placeholder="Search for your campus location"
                          data-testid="campus-boundary-search"
                          style={{
                            padding: "8px 12px",
                            borderRadius: "4px",
                            border: `1px solid ${theme.colors.borderColor}`,
                            boxSizing: "border-box",
                            width: "300px",
                            backgroundColor: theme.isDark ? "#212529" : "#fff",
                            color: theme.isDark ? "#fff" : "#212529",
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
                )}
                <div style={{ position: "relative" }}>
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    options={{
                      mapTypeControl: true,
                      streetViewControl: false,
                      fullscreenControl: true,
                      gestureHandling: "greedy",
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
                          ]
                        : [],
                    }}
                    onLoad={onMapLoad}
                  >
                    {!readOnly && (
                      <DrawingManager
                        onLoad={onDrawingManagerLoad}
                        options={{
                          drawingControl: false,
                          polygonOptions: {
                            fillColor: theme.isDark ? "#1e90ff" : "#3388ff",
                            fillOpacity: 0.2,
                            strokeWeight: 2,
                            strokeColor: theme.isDark ? "#1e90ff" : "#3388ff",
                            clickable: true,
                            editable: true,
                            zIndex: 1,
                          },
                        }}
                        onPolygonComplete={onPolygonComplete}
                      />
                    )}
                  </GoogleMap>

                  {isLoaded && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: 16,
                        right: 16,
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                        zIndex: 2,
                      }}
                      aria-label="Map zoom controls"
                    >
                      <button
                        type="button"
                        data-testid="map-zoom-in-btn"
                        onClick={() => handleZoom(1)}
                        aria-label="Zoom in"
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 10,
                          border: `1px solid ${theme.colors.borderColor}`,
                          backgroundColor: theme.isDark ? "#2d2f36" : "#fff",
                          color: theme.colors.bodyColor,
                          boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 18,
                          lineHeight: 1,
                        }}
                      >
                        +
                      </button>
                      <button
                        type="button"
                        data-testid="map-zoom-out-btn"
                        onClick={() => handleZoom(-1)}
                        aria-label="Zoom out"
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 10,
                          border: `1px solid ${theme.colors.borderColor}`,
                          backgroundColor: theme.isDark ? "#2d2f36" : "#fff",
                          color: theme.colors.bodyColor,
                          boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 18,
                          lineHeight: 1,
                        }}
                      >
                        -
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <CForm>
            {!readOnly && (
              <div className="d-flex justify-content-end mt-4">
                <CButton
                  type="button"
                  color="outline-secondary"
                  className="me-2"
                  onClick={handleClearBoundary}
                >
                  Clear Boundary
                </CButton>
              </div>
            )}
          </CForm>
        </CCardBody>
      </CCard>
    </main>
  );
};

export default CampusBoundary;
