import * as React from 'react'
import BasicInfo from './BasicInfo'
import JobDetails from './JobDetails'
import ShiftDetails from './ShiftDetails'
import { useState, useRef } from 'react'
import TitleComponent from '../../../../components/shared/general/TitleComponent'
import { Nullable } from 'primereact/ts-helpers'
import { Steps } from 'primereact/steps'
import { Toast } from 'primereact/toast'
import { MenuItem } from 'primereact/menuitem'

export default function ClientAddJob() {
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const toast = useRef<Toast>(null)
  const [facilities, setFacilities] = React.useState<any>([])
  const [dates, setDates] = useState<Nullable<Date[]>>(null)
  const [jobId, setJobId] = useState<string | null>(null);

  const items: MenuItem[] = [
    {
      label: 'Basic Information',
      command: event => {
        toast.current?.show({ severity: 'info', summary: 'First Step', detail: event.item.label })
      },
    },
    {
      label: 'Job Details',
      command: event => {
        toast.current?.show({ severity: 'info', summary: 'Second Step', detail: event.item.label })
      },
    },
    {
      label: 'Shift Details',
      command: event => {
        toast.current?.show({ severity: 'info', summary: 'Last Step', detail: event.item.label })
      },
    },
  ]

  return (
    <>
      <TitleComponent title={'Add a new job'} />
      <div className="card">
        <Toast ref={toast}></Toast>
        <Steps model={items} activeIndex={activeIndex} onSelect={e => setActiveIndex(e.index)} readOnly={false} />
        <div>
            
          {activeIndex === 0 && <BasicInfo onJobCreated={setJobId}/>} {/* Only renders this when Step 1 is active */}
          {activeIndex === 1 && <JobDetails jobId={jobId}/>} {/* Only renders this when Step 2 is active */}
          {activeIndex === 2 && <ShiftDetails />} {/* Only renders this when Step 3 is active */}
        </div>
      </div>
    </>
  )
}
