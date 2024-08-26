import * as React from 'react'

import { HTLoadingLogo } from '../../../components/shared/HTLoadingLogo'
import { type IJob } from '../../../interfaces/job'
import { RequestService } from '../../../services/RequestService'
import { roleChecker } from '../../../utils/roleChecker'
import { GetTokenInfo } from '../../../utils/tokenUtil'
import { JobsListView } from '../../shared/jobs/JobsListView'

export const ClientJobs = () => {
  const [jobsData, setJobsData] = React.useState<IJob[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  const role = roleChecker()

  const user = GetTokenInfo()
  const id = user?._id

  React.useEffect(() => {
    const getJobs = async () => {
      try {
        const allJobs = await RequestService(`jobs/client/${id}`)
        setJobsData(allJobs)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching jobs data:', error)
      }
    }
    getJobs()
  }, [id])

  return isLoading ? (
    <HTLoadingLogo />
  ) : jobsData.length > 0 ? (
    <JobsListView jobs={jobsData} role={role} />
  ) : (
    <div className="mt-4">No jobs have been posted yet.</div>
  )
}
