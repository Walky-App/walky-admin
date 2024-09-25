import { useState } from 'react'

import { SelectButton, type SelectButtonChangeEvent } from 'primereact/selectbutton'
import { TabPanel, TabView } from 'primereact/tabview'

import { type IJob } from '../../../interfaces/job'
import { GetTokenInfo } from '../../../utils/tokenUtil'
import { JobCalendar } from './JobCalendar'
import { ActiveShifts } from './myJobsComponents/ActiveShifts'
import { DroppedShifts } from './myJobsComponents/DroppedShifts'
import { PassedShifts } from './myJobsComponents/PassedShifs'
import { SavedJobs } from './myJobsComponents/SavedJobs'

interface ViewOption {
  icon: string
  value: string
}
export interface IUserFirstAndLastName {
  _id: string
  first_name: string
  last_name: string
}
export interface IChangeHistory {
  date: string
  user_id: IUserFirstAndLastName
  action: string
  reason: string
  _id: string
}

export interface IShift {
  _id: string
  job_id: IJob
  start_time: string
  end_time: string
  status: string
  employee_id: string
  facility_id: string
  created_at: string
  updated_at: string
  shift_day: string
  shift_start_time: string
  shift_end_time: string
  createdAt: string
  user_shifts?: string[]
  vacancy_limit?: number
  change_history?: IChangeHistory[]
}

const viewOptions: ViewOption[] = [
  { icon: 'pi pi-bars', value: 'list' },
  { icon: 'pi pi-calendar', value: 'calendar' },
]

export const EmployeeMyJobs = ({ id }: { id?: string | undefined }) => {
  const [view, setView] = useState<string>('list')

  const viewOptionsTemplate = (option: ViewOption) => {
    return <i className={option.icon} />
  }

  const { _id } = GetTokenInfo()

  const employeeId = id ?? _id

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex w-full justify-end">
        <SelectButton
          value={view}
          onChange={(e: SelectButtonChangeEvent) => setView(e.value)}
          options={viewOptions}
          optionLabel="value"
          itemTemplate={viewOptionsTemplate}
          pt={{ button: { className: 'justify-center' } }}
        />
      </div>
      {view === 'calendar' ? (
        <JobCalendar employeeId={employeeId} />
      ) : (
        <div className="[&>*:last-child]:mt-8">
          <TabView>
            <TabPanel header="Active & Upcoming Shifts">
              <ActiveShifts employeeId={employeeId} />
            </TabPanel>
            <TabPanel header="Saved Jobs">
              <SavedJobs employeeId={employeeId} />
            </TabPanel>
            <TabPanel header="Dropped Shifts">
              <DroppedShifts employeeId={employeeId} />
            </TabPanel>
            <TabPanel header="Past Shifts">
              <PassedShifts employeeId={employeeId} />
            </TabPanel>
          </TabView>
        </div>
      )}
    </div>
  )
}
