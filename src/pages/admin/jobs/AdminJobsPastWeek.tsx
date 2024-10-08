import { useEffect, useState } from 'react'

import { HTLoadingLogo } from '../../../components/shared/HTLoadingLogo'
import { type IJob } from '../../../interfaces/job'
import { requestService } from '../../../services/requestServiceNew'
import { roleChecker } from '../../../utils/roleChecker'
import { JobsListView } from '../../shared/jobs/JobsListView'

export const AdminJobsPastWeek = () => {
  const [jobsData, setJobsData] = useState<IJob[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const role = roleChecker()

  useEffect(() => {
    const getJobs = async () => {
      try {
        const response = await requestService({ path: 'jobs/by-admin-past-week' })

        if (response.ok) {
          const allJobs = await response.json()
          setJobsData(allJobs)
        }
      } catch (error) {
        console.error('Error fetching job data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    getJobs()
  }, [])

  return isLoading ? <HTLoadingLogo /> : <JobsListView jobs={jobsData} role={role} />
}
