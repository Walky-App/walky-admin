import { formatInTimeZone } from 'date-fns-tz'
import { Chip } from 'primereact/chip'
import { Fieldset } from 'primereact/fieldset'

import { type IJobShiftDay, type IJob } from '../../../../interfaces/job'
import { type UserShiftsPopulate } from '../../../../interfaces/shifts'
import { cn } from '../../../../utils/cn'

interface IShiftTableAdminProps {
  job: IJob
}

export const ShiftsTableClient = ({ job }: IShiftTableAdminProps) => {
  return (
    <section className="mt-12">
      <h2 className="text-base font-semibold leading-6 text-gray-900">Schedule ({job?.job_dates?.length} days)</h2>
      <ol className="mt-2 text-base leading-6">
        {job?.job_days.map((day: IJobShiftDay, index: number) => {
          return (
            <li key={day.shifts_id._id} className="flex items-center justify-between py-4">
              <Fieldset
                legend={
                  'Day ' + (index + 1) + ' - ' + formatInTimeZone(day.day, job.facility.timezone, 'EEEE, MMMM d, yyyy')
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
                          className="h-10 w-10"
                          alt="profile"
                        />
                      )}
                      label={userShift.user_id.first_name + ' ' + userShift.user_id.last_name[0]}
                      className={cn('mr-10 mt-2 bg-green-600 pl-1 pr-7 text-white', {
                        'bg-purple-500': userShift.is_supervisor,
                      })}
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
