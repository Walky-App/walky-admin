'use client'
import { IoIosInformationCircleOutline } from 'react-icons/io'
import TextInput from '@/components/shared/forms/TextInput'
import Select from '@/components/shared/forms/Select'
import UploadArea from '@/components/shared/forms/UploadArea'
import { states, countries } from '@/variables'

const spacesToDashes = str => (str ? str.replace(/\s+/g, '-').toLowerCase() : '')

export default function ClientForm1() {
  return (
    <div className="flex flex-col mt-10">
      <div className="flex flex-col">
        <h1 className="text-3xl flex justify-center">Business Information</h1>
        <p className="flex justify-center mt-3">
          Please provide Information about your business so that we can verify you on the platform.
        </p>
      </div>

      <div className="rounded-md bg-zinc-200 p-4 w-full lg:w-3/4 mx-auto mt-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <IoIosInformationCircleOutline className="h-5 w-5 text-zinc-500" aria-hidden="true" />
          </div>
          <div className="ml-3 flex-1 md:flex md:justify-between">
            <p className="text-sm text-zinc-700">
              A Tax Identification Number (TIN) in the United States is a unique identifier assigned to individuals and
              businesses for tax purposes. It helps government authorities track financial activities, ensure accurate
              tax reporting, and maintain transparency in financial transactions.
            </p>
          </div>
        </div>
      </div>

      <section className="mx-auto w-full lg:w-3/4 mt-8 space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextInput label="Company Name*" name="company_name" placeholder="Company Name*" required />
          <TextInput label="Tax ID*" name="tax_id" placeholder="Tax ID*" required />
          <TextInput label="Contact Mobile Number*" name="phone_number" placeholder="Contact Mobile Number*" required />
          <Select
            options={[
              { code: 'owner', name: 'Owner' },
              { code: 'manager', name: 'Manager' },
            ]}
            required
            name="role"
            label="Contact Designation*"
            placeholder="Contact Designation*"
          />
        </div>

        <hr className="border-t border-green-800" />

        <div>
          <h2 className="text-xl font-bold">Business Location</h2>
          <p className="text-sm pb-5">Please provide your business address information below.</p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select options={countries} required name="country" label="Country*" placeholder="Country*" />
            <TextInput label="Street Address*" name="address" placeholder="Street Address*" required />
            <TextInput label="Apt/Suite/Unit" name="unit" placeholder="Apt, Suite or Unit" />
            <TextInput label="City*" name="city" placeholder="City*" required />
            <Select options={states} required name="state" label="State / Province*" placeholder="State / Province*" />
            <TextInput label="Zip Code*" name="zip" placeholder="Zip Code*" required />
          </div>
        </div>

        <hr className="border-t border-green-800" />

        {/* <div>
          <h2 className="text-xl font-bold">Business License Document</h2>
          <p className="text-sm">
            Please upload your business license documents. Please make sure your upload is clear
            without any warped or blurred portions and shows all relevant information.
          </p>
        </div> */}

        {/* <div className="flex gap-4">
          <UploadArea
            label="Upload State License Document*"
            name="stateLicense"
            required
            path={`clients/${encodeURIComponent(spacesToDashes(user?.displayName))}/${user?.uid}/state-license`}
          />
          <UploadArea
            label="Upload City License Document"
            name="cityLicense"
            path={`clients/${encodeURIComponent(spacesToDashes(user?.displayName))}/${user?.uid}/city-license`}
          />
        </div> */}
      </section>
    </div>
  )
}
