import React from 'react';
import HeaderComponent from '../../../components/shared/general/HeaderComponent'
import Nav from "./Nav";
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';

export default function ClientOnboarding(){
  const [step, setStep] = React.useState<number>(1);

  console.log(step)

  return (
    <div>
      <HeaderComponent title=' Client Onboarding'/>
      <Nav step={step} setStep={setStep} />
      {step === 1 && <Step1 />}
      {step === 2 && <Step2 />}
      {step === 3 && <Step3 />}
      {step === 4 && <Step4 />}
      {step === 5 && <h1>Step 5</h1>}
    </div>
  )
}