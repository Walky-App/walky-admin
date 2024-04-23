import { create } from 'zustand'

interface State {
  latitude: number | null
  longitude: number | null
  loading: boolean
  setLatitude: (latitude: number) => void
  setLongitude: (longitude: number) => void
  setLoading: (loading: boolean) => void
  getLatitudeFromLocalStorage: () => boolean
  getLongitudeFromLocalStorage: () => boolean
  getLocation: () => void
}

export const useCoordinates = create<State>(set => ({
  latitude: null,
  longitude: null,
  loading: false,
  setLatitude: (latitude: number) => set(state => ({ ...state, latitude })),
  setLongitude: (longitude: number) => set(state => ({ ...state, longitude })),
  setLoading: (loading: boolean) => set(state => ({ ...state, loading })),
  getLatitudeFromLocalStorage: () => {
    const latitude = localStorage.getItem('latitude')
    set({ latitude: latitude ? parseFloat(latitude) : null })
    return latitude ? true : false
  },
  getLongitudeFromLocalStorage: () => {
    const longitude = localStorage.getItem('longitude')
    set({ longitude: longitude ? parseFloat(longitude) : null })
    return longitude ? true : false
  },
  getLocation: () => {
    set({ loading: true })
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords
      localStorage.setItem('latitude', latitude.toString())
      localStorage.setItem('longitude', longitude.toString())
      set({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        loading: false,
      })
    })
  },
}))
