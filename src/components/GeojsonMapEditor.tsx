/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef } from "react";
import { MapContainer, TileLayer, FeatureGroup, useMap } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

interface GeojsonMapEditorProps {
  geojson: any;
  onChange: (geojson: any) => void;
}

const GeojsonMapEditor: React.FC<GeojsonMapEditorProps> = ({
  geojson,
  onChange,
}) => {
  const featureGroupRef = useRef<any>(null);

  const handleEdited = () => {
    const layer = featureGroupRef.current;
    if (layer) {
      const geojsonData = layer.toGeoJSON();
      onChange(geojsonData);
    }
  };

  return (
    <MapContainer
      center={[
        geojson?.features?.[0]?.geometry?.coordinates[1] || 0,
        geojson?.features?.[0]?.geometry?.coordinates[0] || 0,
      ]}
      zoom={15}
      style={{ height: 400 }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FeatureGroup ref={featureGroupRef}>
        <EditControl
          position="topright"
          onEdited={handleEdited}
          onCreated={handleEdited}
          onDeleted={handleEdited}
          draw={{
            rectangle: true,
            circle: true,
            marker: true,
            polygon: true,
            polyline: true,
            circlemarker: true,
          }}
        />
      </FeatureGroup>
    </MapContainer>
  );
};

export default GeojsonMapEditor;
