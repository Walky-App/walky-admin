import { useState } from 'react'

import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'

import { PlusIcon } from '@heroicons/react/20/solid'

import { type IApplicant, type IJob } from '../../../interfaces/job'
import { requestService } from '../../../services/requestServiceNew'
import { useUtils } from '../../../store/useUtils'

interface EmployeeOptionsProps {
  potentialApplicants: IApplicant[]
  shiftId: string
  setJob: (job: IJob) => void
  jobId: string
}

export const EmployeeOptions = ({ potentialApplicants, shiftId, setJob, jobId }: EmployeeOptionsProps) => {
  const { showToast } = useUtils()
  const [applicantId, setApplicantId] = useState<Record<string, string>>({})

  const addEmployeeShift = async () => {
    try {
      const response = await requestService({
        path: `shifts/add-one/${shiftId}`,
        method: 'PATCH',
        body: JSON.stringify({ userId: applicantId, jobId }),
      })
      const data = await response.json()
      if (response.ok) {
        setJob(data)
        showToast({ severity: 'success', summary: 'Success', detail: 'Employee added to shift' })
      }
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <div className="flex h-12 justify-center space-x-2 md:justify-end">
      <Dropdown
        value={applicantId}
        placeholder="Select an applicant"
        name="employee"
        onChange={e => setApplicantId(e.target.value)}
        options={potentialApplicants.map((potentialApplicant: IApplicant) => ({
          value: potentialApplicant._id,
          label: `${potentialApplicant.first_name} ${potentialApplicant.last_name}`,
        }))}
        optionLabel="label"
        filter
      />
      <Button type="submit" onClick={addEmployeeShift}>
        Add <PlusIcon className="h-7 w-7" />{' '}
      </Button>
    </div>
  )
}
