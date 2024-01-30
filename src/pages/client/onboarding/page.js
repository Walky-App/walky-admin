'use client'
import { useContext } from 'react'
import { OnboardingContext } from './layout'
import ClientForm1 from './Form1'
import ClientForm2 from './Form2'
import PrimaryButton from '@/components/shared/forms/PrimaryButton'

const steps = [
  {
    component: <ClientForm1 />,
    formVals: [
      'tax_id',
      'phone_number',
      'company_name',
      'role',
      'country',
      'address',
      'unit',
      'city',
      'state',
      'zip',
      'stateLicensePath',
      'stateLicenseUrl',
      'cityLicensePath',
      'cityLicenseUrl',
    ],
  },
  {
    component: <ClientForm2 />,
    formVals: [],
  },
]

export default function ClientOnboarding() {
  const { step, setStep, company, setCompany } = useContext(OnboardingContext)

  const nextStep = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (step >= step.length - 1) {
      // TODO: Handle completion of Client Onboarding Process
    } else {
      setStep(step + 1)
    }
  }

  const handleClientOnboarding = e => {
    e.preventDefault()

    // TODO: Handle uploads !!

    let formValues = {}
    for (const val of steps[step - 1]?.formVals) {
      if (e.target[val]?.value !== '') {
        formValues[val] = e.target[val]?.value
      }
    }
    // For client onboarding, we want to create a company with the user as the owner.
    const companyUpdateRoute = company ? `/companies/${company._id}` : '/companies'
    // fetch(`${process.env.NEXT_PUBLIC_API}/${companyUpdateRoute}`, {
    fetch(`${process.env.NEXT_PUBLIC_API}/companies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${user?.access_token}`,
      },
      body: JSON.stringify(formValues),
    })
      .then(res => res.json())
      .then(data => {
        setCompany(data)
        nextStep()
      })
      .catch(err => {
        console.log(err)
        alert('Something went wrong. Please try again.')
      })
  }

  return (
    <form onSubmit={handleClientOnboarding} className="w-3/4 bg-zinc-50 h-screen mx-auto">
      {steps[step - 1]?.component || null}

      <div className="mx-auto w-auto py-6 md:flex md:items-center md:justify-between">
        <div className="flex justify-center items-end py-6 w-full border-t-2">
          <PrimaryButton clickFunction={null} text="Continue" type="submit" />
        </div>
      </div>
    </form>
  )
}
