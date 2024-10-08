import { useEffect, useState } from 'react'

import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'

import { PlusIcon } from '@heroicons/react/20/solid'

import { type IJobShiftDay, type IApplicant, type IJob } from '../../../../interfaces/job'
import { requestService } from '../../../../services/requestServiceNew'
import { useUtils } from '../../../../store/useUtils'
import { roleChecker } from '../../../../utils/roleChecker'

interface EmployeeOptionsProps {
  job: IJob
  shiftDay: IJobShiftDay
  shiftId: string
  setJob: (job: IJob) => void
}

export const EmployeeOptions = ({ shiftId, setJob, job, shiftDay }: EmployeeOptionsProps) => {
  const { showToast } = useUtils()
  const [applicantId, setApplicantId] = useState<Record<string, string>>({})
  const [potentialApplicants, setPotentialApplicants] = useState<IApplicant[]>([])
  const role = roleChecker()

  useEffect(() => {
    const getPotentialApplicantsPerShift = async () => {
      try {
        const response = await requestService({ path: `shifts/with-available-employees/${shiftId}` })
        if (response.status === 200) {
          const jsonResponse = await response.json()
          setPotentialApplicants(jsonResponse)
        }
      } catch (error) {
        console.error('Error fetching potential applicants', error)
      }
    }
    if (role === 'admin') {
      getPotentialApplicantsPerShift()
    }
  }, [shiftId, role])

  const addEmployeeShift = async () => {
    try {
      const response = await requestService({
        path: `shifts/add-one/${shiftId}`,
        method: 'PATCH',
        body: JSON.stringify({ userId: applicantId._id, jobId: job._id }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message)
      }

      const data = await response.json()
      setJob(data)
      showToast({ severity: 'success', summary: 'Success', detail: 'Employee added to shift' })
      setApplicantId({})
    } catch (error) {
      if (error instanceof Error) {
        showToast({ severity: 'error', summary: 'Error', detail: error.message })
      } else {
        console.error(error)
      }
    }
  }

  const handleDropdownOptions = () => {
    const filteredApplicants = potentialApplicants
      .filter(applicant =>
        shiftDay?.shifts_id?.user_shifts?.every(userShift => userShift.user_id._id !== applicant._id),
      )
      .map(applicant => ({ label: applicant.first_name + ' ' + applicant.last_name, value: applicant }))
    return filteredApplicants
  }

  return (
    <div className="flex h-12 justify-center space-x-2 md:justify-end">
      <Dropdown
        value={applicantId}
        placeholder="Select an applicant"
        name="employee"
        onChange={event => setApplicantId(event.value)}
        options={handleDropdownOptions()}
        filter
      />
      {applicantId._id ? (
        <Button type="submit" onClick={addEmployeeShift}>
          Add <PlusIcon className="h-7 w-7" />
        </Button>
      ) : null}
    </div>
  )
}
