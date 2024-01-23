'use client'
import { createContext, useState } from 'react'
import ProgressBar from './forms/ProgressBar'

export const OnboardingContext = createContext()

export default function Layout({ children }) {

  const [step, setStep] = useState(0)
  const [stepComplete, setStepComplete] = useState({
    form1: 'incomplete',
    form2: 'incomplete',
    form3: 'incomplete',
    form4: 'incomplete',
    form5: 'incomplete',
    form6: 'incomplete',
    form7: 'incomplete',
    form8: 'incomplete',
  })

  return (
    <OnboardingContext.Provider value={{ step, setStep, stepComplete, setStepComplete }}>
      <section className="relative flex flex-wrap sm:mb-8 md:mb-0 h-screen lg:items-center">
        <ProgressBar stepComplete={stepComplete} currentStep={step} />
        {children}
      </section>
    </OnboardingContext.Provider>
  )
}
