import React, { useCallback, useEffect, useRef } from 'react';
import { APIProvider, Map, useMap, MapMouseEvent } from '@vis.gl/react-google-maps';

interface GeofenceMapProps {
  latitude: number;
  longitude: number;
  radius: number;
  onLocationChange: (lat: number, lng: number, radius: number) => void;
  readonly?: boolean;
}

interface CircleProps {
  center: { lat: number; lng: number };
  radius: number;
  fillColor?: string;
  fillOpacity?: number;
  strokeColor?: string;
  strokeWeight?: number;
  clickable?: boolean;
}

const Circle: React.FC<CircleProps> = ({
  center,
  radius,
  fillColor = '#007bff',
  fillOpacity = 0.2,
  strokeColor = '#007bff',
  strokeWeight = 2,
  clickable = false
}) => {
  const map = useMap();
  const circleRef = useRef<google.maps.Circle | null>(null);

  useEffect(() => {
    if (!map) return;

    if (circleRef.current) {
      circleRef.current.setMap(null);
    }

    circleRef.current = new google.maps.Circle({
      center,
      radius,
      fillColor,
      fillOpacity,
      strokeColor,
      strokeWeight,
      clickable,
      map
    });

    return () => {
      if (circleRef.current) {
        circleRef.current.setMap(null);
      }
    };
  }, [map, center, radius, fillColor, fillOpacity, strokeColor, strokeWeight, clickable]);

  return null;
};

const GeofenceMap: React.FC<GeofenceMapProps> = ({
  latitude,
  longitude,
  radius,
  onLocationChange,
  readonly = false
}) => {
  const center = {
    lat: latitude || 25.7617,
    lng: longitude || -80.1918
  };

  const handleMapClick = useCallback((event: MapMouseEvent) => {
    if (!readonly && event.detail?.latLng) {
      const lat = event.detail.latLng.lat;
      const lng = event.detail.latLng.lng;
      onLocationChange(lat, lng, radius);
    }
  }, [onLocationChange, radius, readonly]);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;

  if (!apiKey) {
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
          <p className="mb-2">Google Maps API key not configured</p>
          <small className="text-muted">
            Please set VITE_GOOGLE_MAPS_API_KEY in your .env file
          </small>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '400px', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={center}
          defaultZoom={15}
          style={{ width: '100%', height: '100%' }}
          onClick={handleMapClick}
          gestureHandling="greedy"
          disableDefaultUI={false}
        >
          {latitude && longitude && radius > 0 && (
            <Circle
              center={{ lat: latitude, lng: longitude }}
              radius={radius}
              fillColor="#007bff"
              fillOpacity={0.2}
              strokeColor="#007bff"
              strokeWeight={2}
              clickable={false}
            />
          )}
        </Map>
      </APIProvider>
    </div>
  );
};

export default GeofenceMap;
