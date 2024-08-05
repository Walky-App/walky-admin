import { useState, type Dispatch, type SetStateAction } from 'react'

import { format } from 'date-fns'
import { Button } from 'primereact/button'
import { Chip } from 'primereact/chip'
import { Dialog } from 'primereact/dialog'
import { Fieldset } from 'primereact/fieldset'
import { InputTextarea } from 'primereact/inputtextarea'

import { type IJobShiftDay, type IJob } from '../../../../interfaces/job'
import { type UserShiftsPopulate } from '../../../../interfaces/shifts'
import { requestService } from '../../../../services/requestServiceNew'
import { useUtils } from '../../../../store/useUtils'

interface IShiftTableAdminProps {
  job: IJob
  setJob: Dispatch<SetStateAction<IJob | null>>
}

export const ShiftsTableClient = ({ job, setJob }: IShiftTableAdminProps) => {
  const [showDialog, setShowDialog] = useState(false)
  const [shiftDropReason, setShiftDropReason] = useState('')
  const [employeeShiftInfoToRemove, setEmployeeShiftInfoToRemove] = useState({ shiftId: '', userShiftId: '' })
  const { showToast } = useUtils()

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
              disabled={shiftDropReason.length < 20}
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
            placeholder="More than 30 characters"
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
                legend={'Day ' + (index + 1) + ' - ' + format(new Date(day.day), 'EEEE, MMMM d, yyyy')}
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
                          className="h-10 w-10"
                          alt="profile"
                        />
                      )}
                      label={userShift.user_id.first_name + ' ' + userShift.user_id.last_name[0]}
                      className="mr-10 mt-2 bg-green-600 pl-1 pr-7 text-white"
                    />
                  )
                })}
              </Fieldset>
              {day?.shifts_id?.user_shifts?.length === job?.vacancy ? (
                <p className="text-end text-green-500 md:text-start">Shift Filled</p>
              ) : null}
            </li>
          )
        })}
      </ol>
    </section>
  )
}
