import Link from 'next/link'
import JobListItem from './components/JobListItem'
import JobsHeader from './components/JobsHeader'

const getJobs = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API}/jobs/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // Authorization: `Bearer ${user?.access_token}`,
    },
  })
  return await res.json()
}

export default async function Jobs() {
  const jobs = await getJobs()

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-10 sm:px-6 lg:px-8">
      <JobsHeader title={'Find Jobs'} />

      <ul role="list" className="grid mt-10 grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {jobs?.map(job => (
          <Link href={`/employee/jobs/${job._id}`}>
            <JobListItem key={job._id} job={job} />
          </Link>
        ))}
      </ul>
    </div>
  )
}
