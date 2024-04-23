import { create } from 'zustand'

interface State {
  latitude: number | null
  longitude: number | null
  loading: boolean
  setLatitude: (latitude: number) => void
  setLongitude: (longitude: number) => void
  setLoading: (loading: boolean) => void
}

export const useCoordinates = create<State>(set => {
  const setLatitude = (latitude: number) => set(state => ({ ...state, latitude }))
  const setLongitude = (longitude: number) => set(state => ({ ...state, longitude }))
  const setLoading = (loading: boolean) => set(state => ({ ...state, loading }))

  const getLocation = () => {
    setLoading(true)
    navigator.geolocation.getCurrentPosition(position => {
      setLatitude(position.coords.latitude)
      setLongitude(position.coords.longitude)
      setLoading(false)
    })
  }

  getLocation()

  return {
    latitude: null,
    longitude: null,
    loading: true,
    setLatitude,
    setLongitude,
    setLoading,
  }
})
