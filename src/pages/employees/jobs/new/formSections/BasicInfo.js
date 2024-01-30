export default function BasicInfo() {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
      <div className="px-4 sm:px-0">
        <h2 className="text-base font-semibold leading-7 text-zinc-900">Basic Information</h2>
        <p className="mt-1 text-sm leading-6 text-zinc-600">
          Please provide the essential information for the job posting. Specify the position title, and provide a
          comprehensive job description.
        </p>
      </div>
      <section className="bg-white shadow-sm ring-1 ring-zinc-900/5 sm:rounded-xl md:col-span-2">
        <div className="px-4 py-6 sm:p-8">
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="title" className="block text-sm font-medium leading-6 text-zinc-900">
                Position Name or Title
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-zinc-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-600 sm:max-w-md">
                  <input
                    type="text"
                    name="title"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-zinc-900 placeholder:text-zinc-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Position Name or Title"
                  />
                </div>
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="description" className="block text-sm font-medium leading-6 text-zinc-900">
                Job Description
              </label>
              <div className="mt-2">
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  Please provide a comprehensive job description for this job.
                </p>
                <textarea
                  name="description"
                  rows={3}
                  className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:outline-none focus:ring-green-600 sm:text-sm sm:leading-6"
                  defaultValue={''}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
