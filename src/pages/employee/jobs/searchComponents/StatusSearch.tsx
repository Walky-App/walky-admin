import { useState } from 'react'

import { Button } from 'primereact/button'
import { Checkbox, type CheckboxChangeEvent } from 'primereact/checkbox'
import { Divider } from 'primereact/divider'

import { HtInputLabel } from '../../../../components/shared/forms/HtInputLabel'
import { HtInfoTooltip } from '../../../../components/shared/general/HtInfoTooltip'

// import { useJobs } from '../../../../store/useJobs'

export const StatusSearch = () => {
  const [status, setStatus] = useState<string[]>([])
  // const { filteredJobs, setFilteredJobs } = useJobs()

  const handleStatusChange = (e: CheckboxChangeEvent) => {
    const { value } = e.target
    let updatedStatus = [...status]
    if (e.checked) {
      updatedStatus.push(value)
    } else {
      updatedStatus = updatedStatus.filter(s => s !== value)
    }

    setStatus(updatedStatus)

    // const filterResults = filteredJobs.filter(job => job.status === value)
  }

  return (
    <>
      <Divider />
      <HtInfoTooltip message="Enter address or your current location where you want to search by" className="mb-4">
        <HtInputLabel htmlFor="date_range" labelText="By Status" className="text-xs" />
      </HtInfoTooltip>

      <div className="flex justify-between">
        <div className="flex items-center">
          <Checkbox inputId="new" name="new" onChange={handleStatusChange} checked={status.includes('new')} />
          <label htmlFor="new" className="ml-2">
            New
          </label>
        </div>

        <div className="flex items-center">
          <Checkbox
            inputId="applied"
            name="applied"
            onChange={e => setStatus(e.checked ? [...status, e.target.name] : status.filter(s => s !== e.target.name))}
            checked={status.includes('applied')}
          />
          <label htmlFor="applied" className="ml-2">
            Applied
          </label>
        </div>

        <div className="flex items-center">
          <Checkbox
            inputId="approved"
            name="approved"
            onChange={e => setStatus(e.checked ? [...status, e.target.name] : status.filter(s => s !== e.target.name))}
            checked={status.includes('approved')}
          />
          <label htmlFor="approved" className="ml-2">
            Approved
          </label>
        </div>
      </div>
      {status.length > 0 ? (
        <div className="flex w-full justify-end">
          <Button label="Clear" className="text-sm underline" text link />
        </div>
      ) : null}
    </>
  )
}
