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
  const [activeIndex, setActiveIndex] = useState<number>(2)
  const toast = useRef<Toast>(null)
  const [facilities, setFacilities] = React.useState<any>([])
  const [dates, setDates] = useState<Nullable<Date[]>>(null)
  const [jobId, setJobId] = useState<string | null>(null);

  const items = [
    {
        label: 'Basic Information'
    },
    {
        label: 'Job Details'
    },
    {
        label: 'Shift Details'
    }
];

  return (
    <>
      <TitleComponent title={'Add a new job'} />
      <div className="card">
        <Steps model={items} activeIndex={activeIndex}/>
        <div>
          {activeIndex === 0 && <BasicInfo onJobCreated={setJobId} onNext={() => setActiveIndex(activeIndex + 1)}/>} {/* Only renders this when Step 1 is active */}
          {activeIndex === 1 && <JobDetails jobId={jobId} onNext={() => setActiveIndex(activeIndex + 1)} />} {/* Only renders this when Step 2 is active */}
          {activeIndex === 2 && <ShiftDetails jobId={jobId}/>} {/* Only renders this when Step 3 is active */}
        </div>
      </div>
    </>
  )
}
