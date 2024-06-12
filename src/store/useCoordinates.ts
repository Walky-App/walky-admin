import { create } from 'zustand'

interface State {
  latitude: number | null
  longitude: number | null
  loading: boolean
  setLatitude: (latitude: number) => void
  setLongitude: (longitude: number) => void
  setLoading: (loading: boolean) => void
  getLocation: () => void
}

export const useCoordinates = create<State>(set => ({
  latitude: null,
  longitude: null,
  loading: false,
  setLatitude: (latitude: number) => set(state => ({ ...state, latitude })),
  setLongitude: (longitude: number) => set(state => ({ ...state, longitude })),
  setLoading: (loading: boolean) => set(state => ({ ...state, loading })),
  getLocation: () => {
    set({ loading: true })
    navigator.geolocation.getCurrentPosition(position => {
      set({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        loading: false,
      })
    })
  },
}))
