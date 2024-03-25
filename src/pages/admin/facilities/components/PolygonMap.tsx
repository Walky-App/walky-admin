import { useRef, useCallback } from 'react'

import { Button } from 'primereact/button'

import { GoogleMap, LoadScript, Polygon } from '@react-google-maps/api'

export const PolygonMap = ({
  locationPolygon,
  locationPin,
  containerStyle,
  setLocationPolygon,
}: {
  locationPolygon: [number, number][]
  locationPin: number[]
  containerStyle: { width: string; height: string }
  setLocationPolygon: (polygon: [number, number][]) => void
}) => {
  const currentpolygonCoords = locationPolygon.map(coord => ({ lat: coord[0], lng: coord[1] }))

  const listenersRef = useRef([])

  const generateNewPolygon = () => {
    const offset = 0.0001
    const polygonPointOne: [number, number] = [locationPin[0] - offset, locationPin[1] - offset]
    const polygonPointTwo: [number, number] = [locationPin[0] - offset, locationPin[1] + offset]
    const polygonPointThree: [number, number] = [locationPin[0] + offset, locationPin[1] + offset]
    const polygonPointFour: [number, number] = [locationPin[0] + offset, locationPin[1] - offset]
    const newPolygon: [number, number][] = [polygonPointOne, polygonPointTwo, polygonPointThree, polygonPointFour]
    setLocationPolygon(newPolygon)
  }

  const onEdit = useCallback(() => {
    if (polygonRef.current) {
      const nextPath = (polygonRef.current as google.maps.Polygon)
        .getPath()
        .getArray()
        .map(latLng => ({ lat: latLng.lat(), lng: latLng.lng() }))
      setLocationPolygon(nextPath.map(coord => [coord.lat, coord.lng]))
    }
  }, [setLocationPolygon])

  const polygonRef = useRef<google.maps.Polygon | null>(null)

  const onLoad = useCallback(
    (polygon: google.maps.Polygon) => {
      polygonRef.current = polygon
      const path = polygon.getPath()

      listenersRef.current.push(
        // @ts-ignore
        path.addListener('set_at', onEdit) as google.maps.MapsEventListener,
        path.addListener('insert_at', onEdit) as google.maps.MapsEventListener,
        path.addListener('remove_at', onEdit) as google.maps.MapsEventListener,
      )
    },
    [onEdit],
  )

  const onUnmount = useCallback(() => {
    (listenersRef.current as google.maps.MapsEventListener[]).forEach(lis => lis.remove())
    polygonRef.current = null
  }, [])

  const center = { lat: locationPin[0], lng: locationPin[1] }

  return (
    <>
      <Button className="mb-5" type="button" onClick={generateNewPolygon}>
        Generate New Polygon
      </Button>
      <br />
      <LoadScript googleMapsApiKey={`${process.env.REACT_APP_GOOGLE_API_KEY}`}>
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={19}>
          <Polygon
            path={currentpolygonCoords}
            options={{
              editable: true,
              fillColor: '#FF0000',
              fillOpacity: 0.35,
              strokeColor: '#FF0000',
              strokeOpacity: 0.6,
              strokeWeight: 2,
              clickable: true,
              draggable: false,
              geodesic: true,
              zIndex: 1,
            }}
            onMouseUp={onEdit}
            onUnmount={onUnmount}
            onDragEnd={onEdit}
            onLoad={onLoad}
          />
        </GoogleMap>
      </LoadScript>
    </>
  )
}
