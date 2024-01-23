import { RadioGroup } from '@headlessui/react'
import { FaCheckCircle } from 'react-icons/fa'

const positions = [
  { id: 'trim', title: 'Trimmer' },
  { id: 'harvest', title: 'Harvester' },
  { id: 'package', title: 'Packager' },
  { id: 'general', title: 'General Labor' },
  { id: 'grower', title: 'Grower Assistant' },
  { id: 'budetender', title: 'Budtender' },
]

const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

export default function EmploymentType({ selectedJob, setSelectedJob }) {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
      <div className="px-4 sm:px-0">
        <h2 className="text-base font-semibold leading-7 text-zinc-900">Type of Employment</h2>
        <p className="mt-1 text-sm leading-6 text-zinc-600">
          Specify the type of job you are looking to fill.
        </p>
      </div>
      <section className="bg-white shadow-sm ring-1 ring-zinc-900/5 sm:rounded-xl md:col-span-2">
        <div className="px-4 py-6 sm:p-8">
            <div className="col-span-full">
              <div className="mt-2">
                <RadioGroup value={selectedJob} onChange={setSelectedJob}>
                  <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
                  <div className="space-y-4">
                    {positions.map(position => (
                      <RadioGroup.Option
                        key={position.id}
                        value={position.title}
                        className={({ active }) =>
                          classNames(
                            active ? 'border-green-600 ring-2 ring-green-600' : 'border-zinc-300',
                            'relative block cursor-pointer rounded-lg border bg-white px-6 py-4 mx-16 shadow-sm focus:outline-none sm:flex sm:justify-between',
                          )
                        }>
                        {({ active, checked }) => (
                          <>
                            <span className="flex items-center">
                              <span className="flex flex-col text-sm">
                                <RadioGroup.Label as="span" className="font-medium text-zinc-900">
                                  {position.title}
                                </RadioGroup.Label>
                              </span>
                            </span>

                            <FaCheckCircle
                              className={classNames(
                                !checked ? 'h-5 w-5 text-zinc-200' : '',
                                'h-5 w-5 text-green-600',
                              )}
                              aria-hidden="true"
                            />
                            <span
                              className={classNames(
                                active ? 'border' : 'border-2',
                                checked ? 'border-green-600' : 'border-transparent',
                                'pointer-events-none absolute -inset-px rounded-lg',
                              )}
                              aria-hidden="true"
                            />
                          </>
                        )}
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            </div>
        </div>
      </section>
    </div>
  )
}
