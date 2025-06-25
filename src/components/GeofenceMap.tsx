import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { CAlert, CRow, CCol, CFormInput, CFormLabel, CInputGroup, CInputGroupText, CFormSelect } from '@coreui/react';

interface GeofenceMapProps {
  latitude: number;
  longitude: number;
  radius?: number;
  polygon?: Array<{ lat: number; lng: number }>;
  type: 'radius' | 'polygon';
  onLocationChange: (lat: number, lng: number, radius?: number, polygon?: Array<{ lat: number; lng: number }>, type?: 'radius' | 'polygon') => void;
  readonly?: boolean;
}

interface SearchOption {
  display_name: string;
  lat: string;
  lon: string;
  geojson?: {
    type: string;
    coordinates: number[][][] | number[][];
  };
}

let map: google.maps.Map;
let geofenceCircle: google.maps.Circle | null = null;
let geofencePolygon: google.maps.Polygon | null = null;

const GeofenceMap: React.FC<GeofenceMapProps> = ({
  latitude,
  longitude,
  radius = 100,
  polygon,
  type,
  onLocationChange,
  readonly = false
}) => {
  const [searchOptions, setSearchOptions] = useState<SearchOption[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<SearchOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [localRadius, setLocalRadius] = useState<string>(radius.toString());
  const [geofenceType, setGeofenceType] = useState<'radius' | 'polygon'>(type);
  const mapRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearGeofenceShapes = useCallback(() => {
    if (geofenceCircle) {
      geofenceCircle.setMap(null);
      geofenceCircle = null;
    }
    if (geofencePolygon) {
      geofencePolygon.setMap(null);
      geofencePolygon = null;
    }
  }, []);

  const drawGeofenceCircle = useCallback(() => {
    if (!map || !latitude || !longitude || radius <= 0) return;

    clearGeofenceShapes();

    geofenceCircle = new window.google.maps.Circle({
      center: { lat: latitude, lng: longitude },
      radius: radius,
      strokeColor: '#007bff',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#007bff',
      fillOpacity: 0.2,
      editable: !readonly,
      clickable: false
    });

    geofenceCircle.setMap(map);

    if (!readonly && geofenceCircle.getEditable()) {
      geofenceCircle.addListener('radius_changed', () => {
        if (geofenceCircle) {
          const newRadius = Math.round(geofenceCircle.getRadius());
          setLocalRadius(newRadius.toString());
          const center = geofenceCircle.getCenter();
          if (center) {
            onLocationChange(center.lat(), center.lng(), newRadius, undefined, 'radius');
          }
        }
      });

      geofenceCircle.addListener('center_changed', () => {
        if (geofenceCircle) {
          const center = geofenceCircle.getCenter();
          if (center) {
            const currentRadius = Math.round(geofenceCircle.getRadius());
            onLocationChange(center.lat(), center.lng(), currentRadius, undefined, 'radius');
          }
        }
      });
    }
  }, [latitude, longitude, radius, onLocationChange, readonly, clearGeofenceShapes]);

  const drawGeofencePolygon = useCallback((polygonCoords: Array<{ lat: number; lng: number }>) => {
    if (!map || !polygonCoords || polygonCoords.length < 3) return;

    clearGeofenceShapes();

    geofencePolygon = new window.google.maps.Polygon({
      paths: polygonCoords,
      strokeColor: '#007bff',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#007bff',
      fillOpacity: 0.2,
      editable: !readonly,
      clickable: false
    });

    geofencePolygon.setMap(map);

    const bounds = new window.google.maps.LatLngBounds();
    polygonCoords.forEach(coord => bounds.extend(coord));
    map.fitBounds(bounds);

    if (!readonly && geofencePolygon.getEditable()) {
      geofencePolygon.addListener('paths_changed', () => {
        if (geofencePolygon) {
          const paths = geofencePolygon.getPaths();
          if (paths.getLength() > 0) {
            const path = paths.getAt(0);
            const newPolygon: Array<{ lat: number; lng: number }> = [];
            for (let i = 0; i < path.getLength(); i++) {
              const vertex = path.getAt(i);
              newPolygon.push({ lat: vertex.lat(), lng: vertex.lng() });
            }
            const center = bounds.getCenter();
            onLocationChange(center.lat(), center.lng(), undefined, newPolygon, 'polygon');
          }
        }
      });
    }
  }, [onLocationChange, readonly, clearGeofenceShapes]);

  const initMap = useCallback(() => {
    if (!mapRef.current || !window.google?.maps) return;

    map = new window.google.maps.Map(mapRef.current, {
      center: { lat: latitude || 25.7617, lng: longitude || -80.1918 },
      zoom: 15,
      zoomControl: true,
      zoomControlOptions: {
        position: window.google.maps.ControlPosition.RIGHT_CENTER
      },
      scrollwheel: true,
      streetViewControl: false,
      mapTypeControl: false,
      mapTypeId: 'roadmap',
    });

    if (!readonly) {
      map.addListener('click', (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
          const lat = event.latLng.lat();
          const lng = event.latLng.lng();
          if (geofenceType === 'radius') {
            onLocationChange(lat, lng, radius, undefined, 'radius');
          }
        }
      });
    }

    if (geofenceType === 'radius') {
      drawGeofenceCircle();
    } else if (geofenceType === 'polygon' && polygon && polygon.length > 0) {
      drawGeofencePolygon(polygon);
    }
  }, [latitude, longitude, radius, polygon, geofenceType, onLocationChange, readonly, drawGeofenceCircle, drawGeofencePolygon]);

  const handleSearch = useCallback((query: string) => {
    if (!query) {
      setSearchOptions([]);
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsLoading(true);
    timeoutRef.current = setTimeout(() => {
      fetch(`https://nominatim.openstreetmap.org/search.php?q=${encodeURIComponent(query)}&polygon_geojson=1&format=json&limit=10`)
        .then(resp => resp.json())
        .then((data: SearchOption[]) => {
          const filteredData = data.filter(item => 
            item.geojson?.type === "MultiPolygon" || 
            item.geojson?.type === "Polygon" ||
            !item.geojson
          );
          setSearchOptions(filteredData);
          setIsLoading(false);
        })
        .catch(() => {
          setSearchOptions([]);
          setIsLoading(false);
        });
    }, 500);
  }, []);

  const renderCoordinates = useCallback((coordinates: number[][][] | number[][]) => {
    const coords: Array<{ lat: number; lng: number }> = [];
    let position = 0;
    
    const processCoords = (coordArray: number[][]) => {
      coordArray.forEach((location) => {
        if (position % 10 === 0) {
          coords.push({ lat: location[1], lng: location[0] });
        }
        position++;
      });
    };

    if (Array.isArray(coordinates[0][0])) {
      processCoords(coordinates[0] as number[][]);
    } else {
      processCoords(coordinates as number[][]);
    }
    
    return coords;
  }, []);

  const handleSelectionChange = useCallback((selected: SearchOption[]) => {
    setSelectedOptions(selected);
    
    if (selected.length > 0) {
      const option = selected[0];
      const lat = parseFloat(option.lat);
      const lng = parseFloat(option.lon);
      
      if (option.geojson && (option.geojson.type === "MultiPolygon" || option.geojson.type === "Polygon")) {
        const polygonCoords = renderCoordinates(option.geojson.coordinates);
        if (polygonCoords.length > 2) {
          setGeofenceType('polygon');
          onLocationChange(lat, lng, undefined, polygonCoords, 'polygon');
          if (map) {
            const bounds = new window.google.maps.LatLngBounds();
            polygonCoords.forEach(coord => bounds.extend(coord));
            map.fitBounds(bounds);
          }
          return;
        }
      }
      
      onLocationChange(lat, lng, radius, undefined, geofenceType);
      
      if (map) {
        map.setCenter({ lat, lng });
        map.setZoom(15);
      }
    }
  }, [onLocationChange, radius, geofenceType, renderCoordinates]);

  const handleRadiusChange = useCallback((value: string) => {
    setLocalRadius(value);
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue) && numericValue >= 10 && numericValue <= 10000) {
      onLocationChange(latitude, longitude, numericValue, undefined, 'radius');
      
      if (geofenceCircle && !readonly) {
        geofenceCircle.setRadius(numericValue);
      }
    }
  }, [latitude, longitude, onLocationChange, readonly]);

  const handleTypeChange = useCallback((newType: 'radius' | 'polygon') => {
    setGeofenceType(newType);
    onLocationChange(latitude, longitude, newType === 'radius' ? radius : undefined, newType === 'polygon' ? polygon : undefined, newType);
  }, [latitude, longitude, radius, polygon, onLocationChange]);

  useEffect(() => {
    setLocalRadius(radius.toString());
  }, [radius]);

  useEffect(() => {
    setGeofenceType(type);
  }, [type]);

  useEffect(() => {
    const checkGoogleMaps = () => {
      if (window.google?.maps) {
        initMap();
      } else {
        setTimeout(checkGoogleMaps, 100);
      }
    };
    
    checkGoogleMaps();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      clearGeofenceShapes();
    };
  }, [initMap, clearGeofenceShapes]);

  useEffect(() => {
    if (geofenceType === 'radius') {
      drawGeofenceCircle();
    } else if (geofenceType === 'polygon' && polygon && polygon.length > 0) {
      drawGeofencePolygon(polygon);
    }
  }, [geofenceType, drawGeofenceCircle, drawGeofencePolygon, polygon]);

  if (!window.google?.maps) {
    return (
      <div style={{ 
        height: '400px', 
        width: '100%', 
        borderRadius: '8px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6'
      }}>
        <div className="text-center">
          <p className="mb-2">Loading Google Maps...</p>
          <small className="text-muted">
            Please wait while the map loads
          </small>
        </div>
      </div>
    );
  }

  return (
    <div>
      <CRow className="mb-3">
        <CCol>
          <CAlert color="info" className="mb-3">
            <strong>Instructions:</strong> Search for a location below or click directly on the map to set the geofence. 
            {!readonly && geofenceType === 'radius' && " You can drag the circle to move it or resize it by dragging the edge, or manually adjust the radius below."}
            {!readonly && geofenceType === 'polygon' && " You can drag the polygon vertices to modify the shape."}
            {" Searching for places with boundaries will automatically create polygons."}
          </CAlert>
          
          {!readonly && (
            <div className="mb-3">
              <CFormLabel htmlFor="geofence-type">Geofence Type</CFormLabel>
              <CFormSelect
                id="geofence-type"
                value={geofenceType}
                onChange={(e) => handleTypeChange(e.target.value as 'radius' | 'polygon')}
              >
                <option value="radius">Radius (Circle)</option>
                <option value="polygon">Polygon (Custom Shape)</option>
              </CFormSelect>
            </div>
          )}
          
          <AsyncTypeahead
            id="location-search"
            isLoading={isLoading}
            labelKey="display_name"
            multiple={false}
            onSearch={handleSearch}
            onChange={(selected: unknown[]) => handleSelectionChange(selected as SearchOption[])}
            options={searchOptions}
            placeholder="Search for a location (e.g., 'Florida International University' or 'Miami, FL')..."
            selected={selectedOptions}
            renderMenuItemChildren={(option: unknown) => (
              <div>
                <span>{(option as SearchOption).display_name}</span>
              </div>
            )}
            className="mb-3"
          />
          
          {!readonly && geofenceType === 'radius' && (
            <div className="mb-3">
              <CFormLabel htmlFor="radius-input">Geofence Radius</CFormLabel>
              <CInputGroup>
                <CFormInput
                  id="radius-input"
                  type="number"
                  min="10"
                  max="10000"
                  step="10"
                  value={localRadius}
                  onChange={(e) => handleRadiusChange(e.target.value)}
                  placeholder="Enter radius in meters"
                />
                <CInputGroupText>meters</CInputGroupText>
              </CInputGroup>
              <small className="text-muted">
                Minimum: 10m, Maximum: 10,000m (10km)
              </small>
            </div>
          )}
          
          {!readonly && geofenceType === 'polygon' && (
            <div className="mb-3">
              <CAlert color="warning">
                <strong>Polygon Mode:</strong> Search for a location with boundaries to automatically create a polygon, or manually draw one by clicking points on the map.
              </CAlert>
            </div>
          )}
        </CCol>
      </CRow>
      
      <div 
        ref={mapRef}
        style={{ 
          height: '400px', 
          width: '100%', 
          borderRadius: '8px', 
          border: '1px solid #dee2e6'
        }}
      />
    </div>
  );
};

export default GeofenceMap;
