import { create } from 'zustand'

import { type IJob } from '../interfaces/job'

interface State {
  jobs: IJob[]
  setJobs: (jobs: IJob[]) => void
}

export const useJobs = create<State>(set => ({
  jobs: [],
  setJobs: jobs => {
    if (!Array.isArray(jobs)) {
      console.error('setJobs was called with a non-array value:', jobs)
      return
    }
    set({ jobs })
  },
}))
