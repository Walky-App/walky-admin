import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'

import { format } from 'date-fns'
import { Chip } from 'primereact/chip'
import { Fieldset } from 'primereact/fieldset'

import { type IJobShiftDay, type IApplicant, type IJob } from '../../../../interfaces/job'
import { type UserShiftsPopulate } from '../../../../interfaces/shifts'
import { requestService } from '../../../../services/requestServiceNew'
import { useUtils } from '../../../../store/useUtils'
import { roleChecker } from '../../../../utils/roleChecker'
import { EmployeeOptions } from './EmployeeOptions'

interface IShiftTableAdminProps {
  job: IJob
  setJob: Dispatch<SetStateAction<IJob | null>>
}

export const ShiftsTableAdmin = ({ job, setJob }: IShiftTableAdminProps) => {
  const [potentialApplicants, setPotentialApplicants] = useState<IApplicant[]>([])
  const { showToast } = useUtils()

  const role = roleChecker()

  useEffect(() => {
    const getPotentialApplicants = async () => {
      try {
        const response = await requestService({ path: `jobs/${job._id}/get-potential-applicants` })
        if (response.status === 200) {
          const jsonResponse = await response.json()
          setPotentialApplicants(jsonResponse)
        }
      } catch (error) {
        console.error('Error fetching potential applicants', error)
      }
    }
    if (role === 'admin') {
      getPotentialApplicants()
    }
  }, [job._id, role])

  const removeEmployeeShift = async (userShiftId: string, shiftId: string) => {
    try {
      const response = await requestService({
        path: `shifts/drop/${shiftId}`,
        method: 'PATCH',
        body: JSON.stringify({ userShiftId }),
      })
      const data = await response.json()
      if (response.ok) {
        setJob(data)
        showToast({
          severity: 'success',
          summary: 'Employee removed',
          detail: 'Employee has been removed from the shift',
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <section className="mt-12">
      <h2 className="text-base font-semibold leading-6 text-gray-900">Schedule ({job?.job_dates?.length} days)</h2>
      <ol className="mt-2 text-base leading-6 ">
        {job?.job_days.map((day: IJobShiftDay, index: number) => {
          return (
            <li key={day.shifts_id._id} className="flex items-center justify-between py-4">
              <Fieldset
                legend={'Day ' + (index + 1) + ' - ' + format(new Date(day.day), 'EEEE, MMMM d, yyyy')}
                toggleable
                className="w-3/4">
                {day?.shifts_id?.user_shifts?.map((userShift: UserShiftsPopulate) => {
                  return (
                    <Chip
                      key={userShift._id}
                      icon={() => (
                        <img
                          src={
                            userShift?.user_id?.avatar
                              ? userShift?.user_id?.avatar
                              : '/assets/photos/no-photo-found.jpg'
                          }
                          className="h-10 w-10 "
                          alt="profile"
                        />
                      )}
                      label={userShift.user_id.first_name}
                      className="mr-10 mt-2 bg-green-600 pl-1 pr-7 text-white hover:bg-red-600 hover:font-medium"
                      removable
                      onRemove={() => removeEmployeeShift(userShift._id, day.shifts_id._id)}
                    />
                  )
                })}
              </Fieldset>
              {day?.shifts_id?.user_shifts?.length === job?.vacancy ? (
                <p className="text-end text-green-500 md:text-start">Shift Filled</p>
              ) : (
                <EmployeeOptions
                  shiftDay={day}
                  job={job}
                  potentialApplicants={potentialApplicants}
                  shiftId={day.shifts_id._id}
                  setJob={setJob}
                />
              )}
            </li>
          )
        })}
      </ol>
    </section>
  )
}
