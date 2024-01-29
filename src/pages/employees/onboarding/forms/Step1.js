import Select from '@/components/shared/forms/Select'
import TextInput from '@/components/shared/forms/TextInput'
import { states, countries, months, days, years } from '@/variables'

export default function Step1({ setContinueStyle, stepComplete, setStepComplete }) {
  const handleStepComplete = () => {
    setContinueStyle(true)
    setStepComplete({ ...stepComplete, form1: 'complete' })
  }

  return (
    <section className="h-[calc(100vh-250px)] overflow-y-scroll pb-16">
      <div className="flex flex-col">
        <h1 className="text-3xl flex justify-center mr-auto">Confirm legal name and verify SSN</h1>
        <p className="flex justify-center mt-3">
          Please enter your name exactly as it appears on your Social Security card. When you enter your Social Security
          Number it will be encrypted. You will enter the number two times. The numbers must match in order to save the
          information.
        </p>
      </div>
      <div className="mx-auto mt-8 space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextInput label="Legal First Name*" name="legalFirstName" placeholder="Legal First Name*" required />
          <TextInput label="Legal Middle Name*" name="legalMiddleName" placeholder="Legal Middle Name*" required />
          <TextInput label="Legal Last Name*" name="legalLastName" placeholder="Legal Last Name*" required />
          <TextInput label="Maiden Name*" name="maidenName" placeholder="Maiden Name*" required />
          <TextInput label="Preffered Name*" name="preferredName" placeholder="Preffered Name*" required />
          <TextInput label="Email Address*" name="emailAddress" placeholder="Email Address*" required />
          <TextInput label="Social Security Number*" name="ssn" placeholder="Social Security Number*" required />
          <TextInput
            label="Confirm Social Security Number*"
            name="confirmSsn"
            placeholder="Confirm Social Security Number*"
            required
          />
          <TextInput label="Address*" name="address" placeholder="Address*" required />
          <TextInput label="City*" name="city" placeholder="City*" required />
          <Select
            options={states}
            required
            name="stateOrProvince"
            label="State / Province*"
            placeholder="State / Province*"
          />
          <TextInput label="Zip Code*" name="zipCode" placeholder="Zip Code*" required />
          <Select options={countries} required name="country" label="Country*" placeholder="Country*" />

          <TextInput label="Main Phone*" name="mainPhone" placeholder="Main Phone*" required />
          <TextInput label="Alternate Phone" name="altPhone" placeholder="Alternate Phone" />
          <TextInput label="Mobile Phone" name="mobilePhone" placeholder="Mobile Phone" />

          <div className="flex items-center rounded-lg border-zinc-200">
            <Select options={months} required name="month" label="Month*" placeholder="Month*" />
            <Select options={days} required name="day" label="Day*" placeholder="Day*" />
            <Select options={years} required name="year" label="Year*" placeholder="Year*" />
          </div>
          <div>
            <label htmlFor="dateOfBirth" className="top-1/2 transform -translate-y-1/2 text-sm text-gray-400">
              Date of Birth
            </label>

            <div className="relative">
              <input
                required
                type="text"
                name="dateOfBirth"
                className="w-full rounded-lg border-zinc-200 p-4 pe-12 text-sm shadow-sm  focus:border-green-500 focus:ring-green-500"
                placeholder="Date of Birth*"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
