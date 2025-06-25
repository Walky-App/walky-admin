import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { CAlert, CRow, CCol } from '@coreui/react';

interface GeofenceMapProps {
  latitude: number;
  longitude: number;
  radius: number;
  onLocationChange: (lat: number, lng: number, radius: number) => void;
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

const GeofenceMap: React.FC<GeofenceMapProps> = ({
  latitude,
  longitude,
  radius,
  onLocationChange,
  readonly = false
}) => {
  const [searchOptions, setSearchOptions] = useState<SearchOption[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<SearchOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const drawGeofenceCircle = useCallback(() => {
    if (!map || !latitude || !longitude || radius <= 0) return;

    if (geofenceCircle) {
      geofenceCircle.setMap(null);
    }

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
    map.setCenter({ lat: latitude, lng: longitude });

    if (!readonly && geofenceCircle.getEditable()) {
      geofenceCircle.addListener('radius_changed', () => {
        if (geofenceCircle) {
          const newRadius = geofenceCircle.getRadius();
          onLocationChange(latitude, longitude, newRadius);
        }
      });

      geofenceCircle.addListener('center_changed', () => {
        if (geofenceCircle) {
          const center = geofenceCircle.getCenter();
          if (center) {
            onLocationChange(center.lat(), center.lng(), radius);
          }
        }
      });
    }
  }, [latitude, longitude, radius, onLocationChange, readonly]);

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
          onLocationChange(lat, lng, radius);
        }
      });
    }

    drawGeofenceCircle();
  }, [latitude, longitude, radius, onLocationChange, readonly, drawGeofenceCircle]);

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

  const handleSelectionChange = useCallback((selected: SearchOption[]) => {
    setSelectedOptions(selected);
    
    if (selected.length > 0) {
      const option = selected[0];
      const lat = parseFloat(option.lat);
      const lng = parseFloat(option.lon);
      
      onLocationChange(lat, lng, radius);
      
      if (map) {
        map.setCenter({ lat, lng });
        map.setZoom(15);
      }
    }
  }, [onLocationChange, radius]);

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
    };
  }, [initMap]);

  useEffect(() => {
    drawGeofenceCircle();
  }, [drawGeofenceCircle]);

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
            <strong>Instructions:</strong> Search for a location below or click directly on the map to set the geofence center. 
            {!readonly && " You can drag the circle to move it or resize it by dragging the edge."}
          </CAlert>
          
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
