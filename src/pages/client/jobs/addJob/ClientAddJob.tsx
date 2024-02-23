import BasicInfo from './BasicInfo'
import JobDetails from './JobDetails'
import ShiftDetails from './ShiftDetails'
import { useState} from 'react'
import TitleComponent from '../../../../components/shared/general/TitleComponent'
import { Steps } from 'primereact/steps'

export default function ClientAddJob() {
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [jobId, setJobId] = useState<string | null>(null)

  const items = [{ label: 'Basic Information' }, { label: 'Job Details' }, { label: 'Shift Details' }]

  return (
    <>
      <TitleComponent title={'Add a new job'} />
      <div className="card">
        <Steps model={items} activeIndex={activeIndex} />
        <div>
          {activeIndex === 0 && <BasicInfo onJobCreated={setJobId} onNext={() => setActiveIndex(activeIndex + 1)} />}{' '}
          {activeIndex === 1 && <JobDetails jobId={jobId} onNext={() => setActiveIndex(activeIndex + 1)} />}{' '}
          {activeIndex === 2 && <ShiftDetails jobId={jobId} />}
        </div>
      </div>
    </>
  )
}
