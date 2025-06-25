import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Circle, Polygon, useMapEvents, useMap } from 'react-leaflet';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { CAlert, CRow, CCol, CButton } from '@coreui/react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface GeofenceMapFreeProps {
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

let polygonVertices: Array<{ lat: number; lng: number }> = [];

const MapEventHandler: React.FC<{
  geofenceType: 'radius' | 'polygon';
  radius: number;
  onLocationChange: (lat: number, lng: number, radius?: number, polygon?: Array<{ lat: number; lng: number }>, type?: 'radius' | 'polygon') => void;
  readonly: boolean;
}> = ({ geofenceType, radius, onLocationChange, readonly }) => {
  useMapEvents({
    click: (event) => {
      if (readonly) return;
      
      const { lat, lng } = event.latlng;
      if (geofenceType === 'radius') {
        onLocationChange(lat, lng, radius, undefined, 'radius');
      } else if (geofenceType === 'polygon') {
        polygonVertices.push({ lat, lng });
        if (polygonVertices.length >= 3) {
          const center = polygonVertices.reduce((acc, vertex) => ({
            lat: acc.lat + vertex.lat,
            lng: acc.lng + vertex.lng
          }), { lat: 0, lng: 0 });
          center.lat /= polygonVertices.length;
          center.lng /= polygonVertices.length;
          onLocationChange(center.lat, center.lng, undefined, [...polygonVertices], 'polygon');
        }
      }
    }
  });
  return null;
};

const MapController: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  
  return null;
};

const GeofenceMapFree: React.FC<GeofenceMapFreeProps> = ({
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
  const [geofenceType, setGeofenceType] = useState<'radius' | 'polygon'>(type);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([latitude || 25.7617, longitude || -80.1918]);

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
          setMapCenter([lat, lng]);
          return;
        }
      }
      
      onLocationChange(lat, lng, radius, undefined, geofenceType);
      setMapCenter([lat, lng]);
    }
  }, [onLocationChange, radius, geofenceType, renderCoordinates]);

  useEffect(() => {
    setGeofenceType(type);
  }, [type]);

  useEffect(() => {
    if (latitude && longitude) {
      setMapCenter([latitude, longitude]);
    }
  }, [latitude, longitude]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div>
      <CRow className="mb-3">
        <CCol>
          <CAlert color="info" className="mb-3">
            <strong>Instructions:</strong> Search for a location or click on the map to set the geofence. 
            {!readonly && geofenceType === 'radius' && " Adjust the radius using the controls."}
            {!readonly && geofenceType === 'polygon' && " Search for places to auto-create areas."}
          </CAlert>
          
          <AsyncTypeahead
            id="location-search"
            isLoading={isLoading}
            labelKey="display_name"
            multiple={false}
            onSearch={handleSearch}
            onChange={(selected: unknown[]) => handleSelectionChange(selected as SearchOption[])}
            options={searchOptions}
            placeholder="Search for a location..."
            selected={selectedOptions}
            renderMenuItemChildren={(option: unknown) => (
              <div>
                <span>{(option as SearchOption).display_name}</span>
              </div>
            )}
            className="mb-3"
          />
          
          {!readonly && geofenceType === 'polygon' && (
            <div className="mb-3">
              <CAlert color="info">
                <strong>Area Selection:</strong> Search for a location to automatically create the area boundary, or click on the map to draw manually.
                {polygonVertices.length > 0 && (
                  <><br/><small>Current points: {polygonVertices.length} {polygonVertices.length >= 3 ? '✓' : `(need ${3 - polygonVertices.length} more)`}</small></>
                )}
              </CAlert>
              {polygonVertices.length > 0 && (
                <CButton 
                  color="secondary" 
                  size="sm" 
                  onClick={() => {
                    polygonVertices = [];
                    onLocationChange(latitude, longitude, undefined, [], 'polygon');
                  }}
                  className="mb-2"
                >
                  Clear Area
                </CButton>
              )}
            </div>
          )}
        </CCol>
      </CRow>
      
      <div style={{ height: '300px', width: '100%', borderRadius: '8px', border: '1px solid #dee2e6' }}>
        <MapContainer
          center={mapCenter}
          zoom={15}
          style={{ height: '100%', width: '100%', borderRadius: '8px' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapController center={mapCenter} />
          
          <MapEventHandler
            geofenceType={geofenceType}
            radius={radius}
            onLocationChange={onLocationChange}
            readonly={readonly}
          />
          
          {geofenceType === 'radius' && latitude && longitude && (
            <Circle
              center={[latitude, longitude]}
              radius={radius}
              pathOptions={{
                color: '#007bff',
                fillColor: '#007bff',
                fillOpacity: 0.2,
                weight: 2
              }}
            />
          )}
          
          {geofenceType === 'polygon' && polygon && polygon.length > 0 && (
            <Polygon
              positions={polygon.map(p => [p.lat, p.lng])}
              pathOptions={{
                color: '#007bff',
                fillColor: '#007bff',
                fillOpacity: 0.2,
                weight: 2
              }}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default GeofenceMapFree;
