import { useEffect, useState } from 'react'

import { HTLoadingLogo } from '../../../../components/shared/HTLoadingLogo'
import { type IJob } from '../../../../interfaces/job'
import { requestService } from '../../../../services/requestServiceNew'
import { JobCard } from '../JobCard'

export const SavedJobs = ({ employeeId }: { employeeId: string }) => {
  const [jobs, setJobs] = useState<IJob[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const getJobs = async () => {
      try {
        const response = await requestService({ path: `jobs/byemployee/${employeeId}` })
        if (response.ok) {
          const allJobs = await response.json()
          setJobs(allJobs)
          setLoading(false)
        }
      } catch (error) {
        console.error('Failed to fetch jobs:', error)
      }
    }
    getJobs()
  }, [employeeId])

  const handleSaveUnsaveJob = (jobId: string, isSaved: boolean) => {
    setJobs(
      jobs.map(job =>
        job._id === jobId
          ? { ...job, saved_by: isSaved ? [...job.saved_by, employeeId] : job.saved_by.filter(id => id !== employeeId) }
          : job,
      ),
    )
  }

  return (
    <ul className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-2 2xl:grid-cols-3">
      {!loading ? (
        jobs.length > 0 ? (
          jobs.map(job => <JobCard key={job._id} handleSaveUnsaveJob={handleSaveUnsaveJob} job={job} status="saved" />)
        ) : (
          <h2>No jobs saved yet! 😎</h2>
        )
      ) : (
        <HTLoadingLogo />
      )}
    </ul>
  )
}
