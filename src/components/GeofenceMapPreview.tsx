import React, { useEffect, useRef } from 'react';
import { Geofence } from '../types/geofence';

interface GeofenceMapPreviewProps {
  geofence: Geofence;
  width?: number;
  height?: number;
}

const GeofenceMapPreview: React.FC<GeofenceMapPreviewProps> = ({ 
  geofence, 
  width = 120, 
  height = 80 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || !window.google) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: geofence.latitude, lng: geofence.longitude },
      zoom: 15,
      disableDefaultUI: true,
      gestureHandling: 'none',
      zoomControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    });

    if (geofence.type === 'radius' && geofence.radius) {
      new window.google.maps.Circle({
        strokeColor: '#4285f4',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#4285f4',
        fillOpacity: 0.35,
        map,
        center: { lat: geofence.latitude, lng: geofence.longitude },
        radius: geofence.radius
      });
    } else if (geofence.type === 'polygon' && geofence.polygon) {
      new window.google.maps.Polygon({
        paths: geofence.polygon,
        strokeColor: '#4285f4',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#4285f4',
        fillOpacity: 0.35,
        map
      });
    }

    mapInstanceRef.current = map;
  }, [geofence]);

  return (
    <div 
      ref={mapRef} 
      style={{ 
        width: `${width}px`, 
        height: `${height}px`, 
        borderRadius: '4px',
        border: '1px solid #dee2e6'
      }} 
    />
  );
};

export default GeofenceMapPreview;
