'use client'
import { useState, createContext } from 'react'
import Progress from './Progress'

export const OnboardingContext = createContext()

/**
 * Layout component that wraps the onboarding process.
 *
 */
export default function Layout({ children }) {
  const [step, setStep] = useState(1)
  const [company, setCompany] = useState()
  return (
    <OnboardingContext.Provider value={{ step, setStep, company, setCompany }}>
      <section className="relative flex flex-wrap sm:mb-8 md:mb-0 h-screen lg:items-center">
        <Progress step={step} />
        <div className="md:w-3/4 w-auto bg-zinc-50 h-screen pb-16 overflow-y-auto">{children}</div>
      </section>
    </OnboardingContext.Provider>
  )
}
