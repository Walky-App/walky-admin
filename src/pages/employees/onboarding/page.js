'use client'
import { useState, useContext } from 'react'
import { OnboardingContext } from './layout'
import Back from './forms/Back'
import Start from './forms/Start'
import Continue from './forms/Continue'
import Exit from './forms/Exit'
import Welcome from './forms/Welcome'
import Step1 from './forms/Step1'
import Step2 from './forms/Step2'

export default function Onboarding() {
  const { step, setStep, setStepComplete } = useContext(OnboardingContext)

  const [continueStyle, setContinueStyle] = useState(true)

  const prevStep = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (step === 0) {
      return
    } else {
      setStep(step - 1)
      setContinueStyle(true)
    }
  }

  const nextStep = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setStep(step + 1)
    // setContinueStyle(false)
    if (!continueStyle) {
      // alert('Run a handle form errors function to send relevant message on what needs edited')
    } else if (step === 11) {
      // TODO: Handle completion of Temp Onboarding Process
    } else {
    }
  }

  const handleTempOnboarding = e => {
    e.preventDefault()
    // build form values object
    const formValues = {
      legalFirstName: e.target.legalFirstName.value,
      legalMiddleName: e.target.legalMiddleName.value,
      legalLastName: e.target.legalLastName.value,
      maidenName: e.target.maidenName.value,
      preferredName: e.target.preferredName.value,
      emailAddress: e.target.emailAddress.value,
      ssn: e.target.ssn.value,
      confirmSsn: e.target.confirmSsn.value,
      address: e.target.address.value,
      city: e.target.city.value,
      stateOrProvince: e.target.stateOrProvince.value,
      zipCode: e.target.zipCode.value,
      country: e.target.country.value,
      mainPhone: {
        countryCode: e.target?.countryCode?.value || '+1',
        mainPhone: e.target.mainPhone.value,
      },
      altPhone: {
        countryCode: e.target?.countryCode?.value || '+1',
        altPhone: e.target.altPhone.value,
      },
      mobilePhone: {
        countryCode: e.target?.countryCode?.value || '+1',
        mobilePhone: e.target.mobilePhone.value,
      },
      dateOfBirth: {
        month: new Date(e.target.dateOfBirth.value).getMonth(),
        day: new Date(e.target.dateOfBirth.value).getDay(),
        year: new Date(e.target.dateOfBirth.value).getFullYear(),
      },
    }
    // remove empty values from formValues object
    for (let key in formValues) {
      if (formValues[key] === undefined || formValues[key] === null || formValues[key] === '') {
        delete formValues[key]
      }
    }
    // fetch(`${process.env.NEXT_PUBLIC_API}/users/${user?.uid}`, {
    //   method: 'PATCH',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${user?.access_token}`,
    //   },
    //   body: JSON.stringify(formValues),
    // })
    //   .then(res => res.json())
    //   .then(() => {
    //     nextStep()
    //   })
    //   .catch(alert)
  }

  return (
    <form onSubmit={handleTempOnboarding} className="w-3/4 bg-zinc-50 h-screen">
      <Exit />
      <div className="inline-block max-w-4xl my-40 mx-60">
        {step === 0 && <Welcome />}
        {step === 1 && (
          <Step1 setContinueStyle={setContinueStyle} setStepComplete={setStepComplete} />
        )}
        {step === 2 && (
          <Step2 setContinueStyle={setContinueStyle} setStepComplete={setStepComplete} />
        )}
      </div>
      {step === 0 ? (
        <div className="flex items-center py-6 border-t-2 bottom-0 absolute w-3/4">
          <Start startFunction={nextStep} />
        </div>
      ) : (
        <div className="flex justify-between items-center py-6 border-t-2 bottom-0 absolute w-3/4">
          <Back
            prevStep={prevStep}
            continueStyle={continueStyle}
            setContinueStyle={setContinueStyle}
          />
          <Continue continueStyle={continueStyle} setContinueStyle={setContinueStyle} />
        </div>
      )}
    </form>
  )
}
