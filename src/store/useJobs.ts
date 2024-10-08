import { type Dispatch, type SetStateAction } from 'react'

import { create } from 'zustand'

import { type IJob } from '../interfaces/job'
import { requestService } from '../services/requestServiceNew'

interface IJobsStore {
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  jobs: IJob[]
  setJobs: Dispatch<SetStateAction<IJob[]>>
  filteredJobs: IJob[]
  setFilteredJobs: Dispatch<SetStateAction<IJob[]>>
  showRangeSelector: boolean
  setShowRangeSelector: (showRangeSelector: boolean) => void
  handleUseCurrentLocation: () => void
  handleUseSelectedAddress: (locationDetails: { latitude: number; longitude: number }) => void
}

export const useJobs = create<IJobsStore>(set => ({
  isLoading: false,
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  jobs: [],
  setJobs: jobs => {
    if (!Array.isArray(jobs)) {
      console.error('setJobs was called with a non-array value:', jobs)
      return
    }
    set({ jobs })
  },
  filteredJobs: [],
  setFilteredJobs: filteredJobs => {
    if (!Array.isArray(filteredJobs)) {
      console.error('setFilteredJobs was called with a non-array value:', filteredJobs)
      return
    }
    set({ filteredJobs })
  },
  showRangeSelector: false,
  setShowRangeSelector: (showRangeSelector: boolean) => set({ showRangeSelector }),
  handleUseCurrentLocation: async () => {
    set({ isLoading: true })
    try {
      const response = await requestService({ path: 'jobs/bydistance', method: 'POST', body: JSON.stringify({}) })

      if (response.ok) {
        const allJobs = await response.json()
        set({ filteredJobs: allJobs, isLoading: false, showRangeSelector: true })
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
    }
  },
  handleUseSelectedAddress: async (locationDetails: { latitude: number; longitude: number }) => {
    set({ isLoading: true })
    try {
      const response = await requestService({
        path: 'jobs/bydistance',
        method: 'POST',
        body: JSON.stringify({ locationDetails }),
      })
      if (response.ok) {
        const allJobs = await response.json()
        set({ filteredJobs: allJobs, isLoading: false, showRangeSelector: true })
      }
      set({ isLoading: false })
    } catch (error) {
      console.error('Error fetching jobs:', error)
    }
  },
}))
