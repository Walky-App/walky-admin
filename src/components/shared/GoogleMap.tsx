import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api'

export const GoogleMapComponent = ({
  locationPin,
  containerStyle,
}: {
  locationPin: number[]
  containerStyle: { width: string; height: string }
}) => {
  const center = { lat: locationPin[0], lng: locationPin[1] }

  return (
    <LoadScript googleMapsApiKey={`${process.env.REACT_APP_GOOGLE_API_KEY}`}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={17}>
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  )
}
