import BasicInfo from './BasicInfo'
import JobDetails from './JobDetails'
import ShiftDetails from './ShiftDetails'
import { useState } from 'react'
import { TitleComponent } from '../../../../components/shared/general/TitleComponent'
import { Steps } from 'primereact/steps'

export default function ClientEditJob() {
  const [activeIndex, setActiveIndex] = useState<number>(0)

  const items = [{ label: 'Basic Information' }, { label: 'Job Details' }, { label: 'Shift Details' }]

  const nextStep = () => {
    setActiveIndex(prevIndex => prevIndex + 1)
  }

  return (
    <>
      <TitleComponent title={'Edit the job'} />
      <div className="card">
        <Steps model={items} activeIndex={activeIndex} />
        <div>
          {activeIndex === 0 && <BasicInfo nextStep={nextStep} />}
          {activeIndex === 1 && <JobDetails nextStep={nextStep} />}
          {activeIndex === 2 && <ShiftDetails />}
        </div>
      </div>
    </>
  )
}
