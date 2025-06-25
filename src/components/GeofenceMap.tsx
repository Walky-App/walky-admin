import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Circle, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete (L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: () => string })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface GeofenceMapProps {
  latitude: number;
  longitude: number;
  radius: number;
  onLocationChange: (lat: number, lng: number, radius: number) => void;
  readonly?: boolean;
}

interface MapClickHandlerProps {
  onLocationChange: (lat: number, lng: number, radius: number) => void;
  currentRadius: number;
  readonly?: boolean;
}

const MapClickHandler: React.FC<MapClickHandlerProps> = ({ 
  onLocationChange, 
  currentRadius, 
  readonly 
}) => {
  useMapEvents({
    click: (e) => {
      if (!readonly) {
        onLocationChange(e.latlng.lat, e.latlng.lng, currentRadius);
      }
    },
  });
  return null;
};

const GeofenceMap: React.FC<GeofenceMapProps> = ({
  latitude,
  longitude,
  radius,
  onLocationChange,
  readonly = false
}) => {
  const mapRef = useRef<L.Map>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    latitude || 25.7617,
    longitude || -80.1918
  ]);

  useEffect(() => {
    if (latitude && longitude) {
      setMapCenter([latitude, longitude]);
    }
  }, [latitude, longitude]);

  const handleLocationChange = (lat: number, lng: number, newRadius: number) => {
    onLocationChange(lat, lng, newRadius);
    setMapCenter([lat, lng]);
  };

  return (
    <div style={{ height: '400px', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
      <MapContainer
        center={mapCenter}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapClickHandler 
          onLocationChange={handleLocationChange}
          currentRadius={radius}
          readonly={readonly}
        />
        
        {latitude && longitude && radius > 0 && (
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
      </MapContainer>
    </div>
  );
};

export default GeofenceMap;
