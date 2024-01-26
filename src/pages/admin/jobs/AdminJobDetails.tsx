import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { RequestService } from '../../../services/RequestService'

export default function AdminJobDetails() {
  const [jobData, setJobState] = useState<any>({})
  const { id } = useParams()

  const fetchJob = async () => {
    const jobData = await RequestService(`jobs/${id}`)
    setJobState(jobData)
    console.log(jobData)
  }

  useEffect(() => {
    fetchJob()
  }, [])

  return (
    <h2>
      Job detail view {id} 
      {jobData?.title}
    </h2>
    
  )
}
