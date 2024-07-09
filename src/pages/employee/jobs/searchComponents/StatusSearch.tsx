import { useState } from 'react'

import { Button } from 'primereact/button'
import { Checkbox, type CheckboxChangeEvent } from 'primereact/checkbox'
import { Divider } from 'primereact/divider'

import { HtInputLabel } from '../../../../components/shared/forms/HtInputLabel'
import { HtInfoTooltip } from '../../../../components/shared/general/HtInfoTooltip'
import { type IApplicantWithoutPopulate } from '../../../../interfaces/job'
import { useJobs } from '../../../../store/useJobs'
import { GetTokenInfo } from '../../../../utils/tokenUtil'

const isNew = (date: string) => {
  const today = new Date()
  const jobDate = new Date(date)
  const diff = today.getTime() - jobDate.getTime()
  const diffDays = diff / (1000 * 3600 * 24)
  return diffDays <= 3
}
const { _id } = GetTokenInfo()

export const StatusSearch = () => {
  const [status, setStatus] = useState<string[]>([])
  const { jobs, setFilteredJobs } = useJobs()

  const handleNewStatus = (e: CheckboxChangeEvent) => {
    const filterResults = jobs.filter(job => isNew(job.createdAt.toString()))
    setFilteredJobs(filterResults)
    setStatus(['new'])

    if (!e.checked) {
      setFilteredJobs(jobs)
      setStatus([])
    }
  }

  const handleAppliedStatus = (e: CheckboxChangeEvent) => {
    const filteredResults = jobs.filter(job =>
      job.applicants.find((applicant: IApplicantWithoutPopulate) => {
        const applicantUserId = typeof applicant.user === 'object' ? applicant.user._id : applicant.user
        return applicantUserId === _id
      }),
    )
    setFilteredJobs(filteredResults)
    setStatus(['applied'])

    if (!e.checked) {
      setFilteredJobs(jobs)
      setStatus([])
    }
  }

  const handleClear = () => {
    setFilteredJobs(jobs)
    setStatus([])
  }

  return (
    <>
      <Divider />
      <HtInfoTooltip message="Enter address or your current location where you want to search by" className="mb-4">
        <HtInputLabel htmlFor="date_range" labelText="By Status" className="text-xs" />
      </HtInfoTooltip>

      <div className="flex justify-between">
        <div className="flex items-center">
          <Checkbox
            inputId="new"
            name="new"
            onChange={handleNewStatus}
            checked={status.includes('new') ? true : false}
          />
          <label htmlFor="new" className="ml-2">
            New
          </label>
        </div>

        <div className="flex items-center">
          <Checkbox
            inputId="applied"
            name="applied"
            onChange={handleAppliedStatus}
            checked={status.includes('applied') ? true : false}
          />
          <label htmlFor="applied" className="ml-2">
            Applied
          </label>
        </div>
      </div>
      {status.length > 0 ? (
        <div className="flex w-full justify-end">
          <Button label="Clear" className="text-sm underline" text link onClick={handleClear} />
        </div>
      ) : null}
    </>
  )
}
