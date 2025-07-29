import React, { useEffect, useRef } from 'react';

interface GoogleMapProps {
  lat: number;
  lng: number;
  zoom?: number;
  height?: string;
  markerTitle?: string;
}

declare global {
  interface Window {
    google: typeof google;
    initMap?: () => void;
  }
}

const GoogleMap: React.FC<GoogleMapProps> = ({ 
  lat, 
  lng, 
  zoom = 17, 
  height = '400px',
  markerTitle = 'Location'
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map>(null);
  const markerRef = useRef<google.maps.Marker>(null);

  useEffect(() => {
    // Function to initialize the map
    const initializeMap = () => {
      if (!mapRef.current || !window.google) return;

      // Create map instance
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: { lat, lng },
        zoom,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
      });

      // Add marker
      markerRef.current = new window.google.maps.Marker({
        position: { lat, lng },
        map: mapInstanceRef.current,
        title: markerTitle,
        animation: window.google.maps.Animation.DROP,
      });

      // Add info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px;">
            <h4 style="margin: 0 0 4px 0; font-weight: 600;">${markerTitle}</h4>
            <p style="margin: 0; color: #666; font-size: 14px;">${lat.toFixed(6)}, ${lng.toFixed(6)}</p>
          </div>
        `,
      });

      markerRef.current.addListener('click', () => {
        infoWindow.open(mapInstanceRef.current, markerRef.current);
      });
    };

    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      initializeMap();
    } else {
      // Load Google Maps script
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&callback=initMap`;
      script.async = true;
      script.defer = true;
      
      // Define callback
      window.initMap = initializeMap;
      
      document.head.appendChild(script);

      return () => {
        // Cleanup
        document.head.removeChild(script);
        delete window.initMap;
      };
    }
  }, [lat, lng, zoom, markerTitle]);

  // Update map center when coordinates change
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current) {
      const newCenter = { lat, lng };
      mapInstanceRef.current.setCenter(newCenter);
      markerRef.current.setPosition(newCenter);
    }
  }, [lat, lng]);

  return (
    <div 
      ref={mapRef} 
      style={{ width: '100%', height, borderRadius: '0.5rem' }}
      className="bg-gray-200 dark:bg-gray-700"
    />
  );
};

export default GoogleMap;