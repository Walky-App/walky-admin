import { useState } from 'react'
import BasicInfo from './formSections/BasicInfo'
import EmploymentType from './formSections/EmploymentType'
import Location from './formSections/Location'

export default function NewJob() {
  const [location, setLocation] = useState()
  const [selectedJob, setSelectedJob] = useState()

  const handleForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const target = e.target as any

    const formData = {
      title: target.title.value,
      description: target.description.value,
      position: selectedJob,
      location: location,
    }
    console.log(formData) // TODO: Send to API...
  }

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-2xl font-bold sm:text-3xl">Create Job</h1>
        <p className="mt-4 text-zinc-500 mb-8">
          Effortlessly post job openings, attract top talent, and streamline your hiring process with our user-friendly
          platform.
        </p>
      </div>

      <form onSubmit={handleForm} className="space-y-10 divide-y divide-zinc-900/10">
        <BasicInfo />
        <EmploymentType selectedJob={selectedJob} setSelectedJob={setSelectedJob} />
        <Location location={location} setLocation={setLocation} />
        <div className="flex items-center justify-end gap-x-6 border-t border-zinc-900/10 px-4 py-4 sm:px-8">
          <button
            type="submit"
            className="rounded-md bg-green-600 px-6 py-2 font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
            Save
          </button>
        </div>
      </form>
    </div>
  )
}
