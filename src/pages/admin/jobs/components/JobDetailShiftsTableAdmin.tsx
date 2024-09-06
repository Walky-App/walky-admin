import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'

import { formatInTimeZone } from 'date-fns-tz'
import { Button } from 'primereact/button'
import { Chip } from 'primereact/chip'
import { Dialog } from 'primereact/dialog'
import { Fieldset } from 'primereact/fieldset'
import { InputTextarea } from 'primereact/inputtextarea'

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
  const [showDialog, setShowDialog] = useState(false)
  const [shiftDropReason, setShiftDropReason] = useState('')
  const [loadingSendingNotifications, setLoadingSendingNotifications] = useState(false)
  const [employeeShiftInfoToRemove, setEmployeeShiftInfoToRemove] = useState({ shiftId: '', userShiftId: '' })
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
        setShowDialog(false)
        setEmployeeShiftInfoToRemove({ shiftId: '', userShiftId: '' })
        setShiftDropReason('')
      }
    } catch (error) {
      console.error(error)
    }
  }

  const reject = () => {
    setShowDialog(false)
    setShiftDropReason('')
    showToast({ severity: 'success', summary: 'Rejected', detail: 'Shift was not dropped 🙂', life: 3000 })
  }

  const handleSendNotification = async (shiftId: string) => {
    try {
      const response = await requestService({
        path: `shifts/notify-employees-open-shift`,
        method: 'POST',
        body: JSON.stringify({ shiftId }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message)
      }
      setLoadingSendingNotifications(false)
      showToast({ severity: 'success', summary: 'Success', detail: 'Notifications successfully sent' })
    } catch (error) {
      if (error instanceof Error) {
        showToast({ severity: 'error', summary: 'Error', detail: error.message })
      } else {
        console.error(error)
      }
    }
  }

  return (
    <section className="mt-12">
      <Dialog
        header="Drop Shift?"
        visible={showDialog}
        draggable={false}
        className="w-full md:w-1/2"
        onHide={() => {
          if (!showDialog) return
          setShowDialog(false)
        }}
        footer={() => (
          <div>
            <Button label="No" icon="pi pi-check" onClick={reject} className="p-button-text" />
            <Button
              label="Yes, Drop the Shift"
              severity="danger"
              icon="pi pi-times"
              onClick={() =>
                removeEmployeeShift(employeeShiftInfoToRemove.userShiftId, employeeShiftInfoToRemove.shiftId)
              }
            />
          </div>
        )}>
        <div className="m-0">
          <h2 className="mb-8 text-lg font-medium">Sure you want to drop this user?</h2>
          <h3 className="text-xl font-medium text-red-600">Reason for dropping the user from shift</h3>
          <InputTextarea
            placeholder="Type in the reason for dropping the user from the shift"
            required
            rows={5}
            cols={50}
            className="text-lg"
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setShiftDropReason(e.target.value)}
            value={shiftDropReason}
          />
        </div>
      </Dialog>

      <h2 className="text-base font-semibold leading-6 text-gray-900">Schedule ({job?.job_dates?.length} days)</h2>
      <ol className="mt-2 text-base leading-6 ">
        {job?.job_days.map((day: IJobShiftDay, index: number) => {
          return (
            <li key={day.shifts_id._id} className="flex items-center justify-between py-4">
              <Fieldset
                legend={
                  <div className="flex items-center justify-between">
                    <span>
                      {'Day ' +
                        (index + 1) +
                        ' - ' +
                        formatInTimeZone(day.day, job.facility.timezone, 'EEEE, MMMM d, yyyy') +
                        ' - ' +
                        'Shifts (' +
                        day?.shifts_id?.user_shifts?.length +
                        '/' +
                        job?.vacancy +
                        ')'}
                    </span>
                    {day?.shifts_id?.user_shifts && day.shifts_id.user_shifts.length < job?.vacancy ? (
                      <Button
                        type="button"
                        loading={loadingSendingNotifications}
                        className="ml-2"
                        onClick={event => {
                          event.stopPropagation()
                          setLoadingSendingNotifications(true)
                          handleSendNotification(day.shifts_id._id)
                        }}>
                        Send Notifications
                      </Button>
                    ) : null}
                  </div>
                }
                toggleable
                className="w-3/4">
                {day?.shifts_id?.user_shifts?.map((userShift: UserShiftsPopulate) => {
                  return (
                    <Chip
                      key={userShift._id}
                      icon={() => (
                        <img
                          key={userShift._id}
                          src={
                            userShift?.user_id?.avatar
                              ? userShift?.user_id?.avatar
                              : '/assets/photos/no-photo-found.jpg'
                          }
                          className="h-10 w-10 object-cover"
                          alt="profile"
                        />
                      )}
                      label={userShift.user_id.first_name + ' ' + userShift.user_id.last_name}
                      className="mr-10 mt-2 bg-green-600 pl-1 pr-7 text-white hover:cursor-pointer hover:bg-red-600 hover:font-medium"
                      onClick={() => {
                        setEmployeeShiftInfoToRemove({
                          shiftId: day.shifts_id._id,
                          userShiftId: userShift._id,
                        })
                        setShowDialog(true)
                      }}
                    />
                  )
                })}
              </Fieldset>

              {day?.shifts_id?.user_shifts === undefined ? null : day.shifts_id.user_shifts.length >= job?.vacancy ? (
                <p className="text-end text-green-500 md:text-start">
                  {'Shift Filled' +
                    (day.shifts_id.user_shifts.length > job?.vacancy
                      ? ' (+' + (day.shifts_id.user_shifts.length - job.vacancy) + ' extra)'
                      : '')}
                </p>
              ) : null}
              <EmployeeOptions
                shiftDay={day}
                job={job}
                potentialApplicants={potentialApplicants}
                shiftId={day.shifts_id._id}
                setJob={setJob}
              />
            </li>
          )
        })}
      </ol>
    </section>
  )
}
