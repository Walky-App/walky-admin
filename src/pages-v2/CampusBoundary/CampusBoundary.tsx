import { useState, useCallback, useRef, useEffect } from "react";
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

// DrawingManager was removed from the Maps JS API in v3.65, so we draw the
// polygon manually with core map click listeners (no "drawing" library).
const libraries: Libraries = ["places"];

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

  const polygonStyle = {
    fillColor: theme.isDark ? "#1e90ff" : "#3388ff",
    fillOpacity: 0.2,
    strokeWeight: 2,
    strokeColor: theme.isDark ? "#1e90ff" : "#3388ff",
  };

  const [boundaryData, setBoundaryData] = useState<CampusBoundaryData | null>(
    initialBoundaryData,
  );
  const [hasBeenCleared, setHasBeenCleared] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [vertexCount, setVertexCount] = useState(0);

  const polygonRef = useRef<google.maps.Polygon | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);

  // In-progress drawing state
  const drawingPolygonRef = useRef<google.maps.Polygon | null>(null);
  const drawingPathRef = useRef<google.maps.LatLngLiteral[]>([]);
  const drawingListenersRef = useRef<google.maps.MapsEventListener[]>([]);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyAumxyJ5Z1j-_X1EHUSy8GCRr21zDPzSHs",
    libraries,
  });

  // Convert a rendered polygon into our GeoJSON boundary shape (closed ring).
  const polygonToBoundary = (
    polygon: google.maps.Polygon,
  ): CampusBoundaryData => {
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
    return {
      geometry: {
        type: "Polygon",
        coordinates: [coords],
      },
    };
  };

  const commitBoundary = useCallback(
    (boundary: CampusBoundaryData | null, isValid: boolean) => {
      setBoundaryData(boundary);
      if (onBoundaryChange) onBoundaryChange(boundary);
      if (onValidityChange) onValidityChange(isValid);
    },
    [onBoundaryChange, onValidityChange],
  );

  // Make a finished polygon editable, wire edit listeners, and record it.
  const finalizePolygon = useCallback(
    (polygon: google.maps.Polygon) => {
      if (polygonRef.current) {
        polygonRef.current.setMap(null);
      }
      polygonRef.current = polygon;
      polygon.setEditable(true);

      setHasBeenCleared(false);
      commitBoundary(polygonToBoundary(polygon), true);

      const updateFromEdit = () =>
        commitBoundary(polygonToBoundary(polygon), true);

      const path = polygon.getPath();
      ["set_at", "insert_at", "remove_at"].forEach((event) =>
        window.google.maps.event.addListener(path, event, updateFromEdit),
      );
    },
    [commitBoundary],
  );

  const onMapLoad = useCallback(
    (map: google.maps.Map) => {
      mapRef.current = map;

      // Render existing boundary data on first load (unless manually cleared)
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
          ...polygonStyle,
          clickable: !readOnly,
          editable: !readOnly,
          zIndex: 1,
          map,
        });

        polygonRef.current = polygon;

        if (!readOnly) {
          const updateFromEdit = () =>
            commitBoundary(polygonToBoundary(polygon), true);
          ["set_at", "insert_at", "remove_at"].forEach((event) =>
            window.google.maps.event.addListener(
              polygon.getPath(),
              event,
              updateFromEdit,
            ),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [boundaryData, hasBeenCleared, theme.isDark, readOnly, commitBoundary],
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

  const stopDrawing = useCallback(() => {
    drawingListenersRef.current.forEach((listener) => listener.remove());
    drawingListenersRef.current = [];
    if (drawingPolygonRef.current) {
      drawingPolygonRef.current.setMap(null);
      drawingPolygonRef.current = null;
    }
    drawingPathRef.current = [];
    setVertexCount(0);
    setIsDrawing(false);
  }, []);

  const finishDrawing = useCallback(() => {
    // A polygon needs at least 3 vertices
    if (drawingPathRef.current.length < 3) return;

    const path = [...drawingPathRef.current];

    // Tear down the in-progress drawing state/listeners
    drawingListenersRef.current.forEach((listener) => listener.remove());
    drawingListenersRef.current = [];
    if (drawingPolygonRef.current) {
      drawingPolygonRef.current.setMap(null);
      drawingPolygonRef.current = null;
    }
    drawingPathRef.current = [];
    setVertexCount(0);
    setIsDrawing(false);

    if (!mapRef.current) return;

    const polygon = new window.google.maps.Polygon({
      paths: path,
      ...polygonStyle,
      clickable: true,
      editable: true,
      zIndex: 1,
      map: mapRef.current,
    });

    finalizePolygon(polygon);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalizePolygon]);

  const handleStartDrawing = useCallback(() => {
    if (!isLoaded || !mapRef.current || !window.google) return;

    // Remove any existing committed polygon — we're drawing a fresh one
    if (polygonRef.current) {
      polygonRef.current.setMap(null);
      polygonRef.current = null;
    }

    // Reset/seed the in-progress drawing
    drawingPathRef.current = [];
    setVertexCount(0);
    if (drawingPolygonRef.current) {
      drawingPolygonRef.current.setMap(null);
    }
    drawingPolygonRef.current = new window.google.maps.Polygon({
      paths: [],
      ...polygonStyle,
      clickable: false,
      editable: false,
      zIndex: 1,
      map: mapRef.current,
    });

    setIsDrawing(true);

    const map = mapRef.current;
    const clickListener = map.addListener(
      "click",
      (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;
        drawingPathRef.current.push(e.latLng.toJSON());
        drawingPolygonRef.current?.setPath(drawingPathRef.current);
        setVertexCount(drawingPathRef.current.length);
      },
    );
    // Double-click closes the shape (default dbl-click zoom is disabled below)
    const dblClickListener = map.addListener("dblclick", () => finishDrawing());

    drawingListenersRef.current = [clickListener, dblClickListener];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, finishDrawing]);

  const handleClearBoundary = () => {
    // Cancel any in-progress drawing first
    if (isDrawing) stopDrawing();

    if (polygonRef.current) {
      polygonRef.current.setMap(null);
      polygonRef.current = null;
    }

    setHasBeenCleared(true);
    commitBoundary(null, false);
  };

  // Disable default dbl-click zoom while drawing so dbl-click can close the shape
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setOptions({ disableDoubleClickZoom: isDrawing });
  }, [isDrawing]);

  // Clean up drawing listeners/overlays on unmount
  useEffect(() => {
    return () => {
      drawingListenersRef.current.forEach((listener) => listener.remove());
      if (drawingPolygonRef.current) {
        drawingPolygonRef.current.setMap(null);
      }
    };
  }, []);

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
              {isDrawing
                ? "Click on the map to add points. Add at least 3, then click Finish (or double-click) to close the boundary."
                : "Draw a polygon around your campus on the map below. Use the search to find your location, then click Draw Boundary and click points on the map."}
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
                      {isDrawing ? (
                        <>
                          <CButton
                            color="primary"
                            className="ms-2"
                            onClick={finishDrawing}
                            disabled={vertexCount < 3}
                          >
                            Finish{vertexCount > 0 ? ` (${vertexCount})` : ""}
                          </CButton>
                          <CButton
                            color="outline-secondary"
                            className="ms-2"
                            onClick={stopDrawing}
                          >
                            Cancel
                          </CButton>
                        </>
                      ) : (
                        <CButton
                          color="primary"
                          className="ms-2"
                          onClick={handleStartDrawing}
                        >
                          Draw Boundary
                        </CButton>
                      )}
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
                  />

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
