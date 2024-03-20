'use client'
import { useState, useEffect } from 'react'
import { RadioGroup } from '@headlessui/react'
import { FaCheckCircle } from 'react-icons/fa'

const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

export default function Location({ location, setLocation }) {
  const [facilities, setFacilities] = useState()

  // useEffect(() => {
  //   if (!user?.uid || !user?.accessToken) return null
  //   fetch(`${process.env.NEXT_PUBLIC_API}/facilities/client/${user.uid}`, {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${user?.accessToken}`,
  //     },
  //   })
  //     .then(res => res.json())
  //     .then(setFacilities)
  // }, [user])

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
      <div className="px-4 sm:px-0">
        <h2 className="text-base font-semibold leading-7 text-zinc-900">Job Location</h2>
        <p className="mt-1 text-sm leading-6 text-zinc-600">Choose which facility your job is located at.</p>
      </div>
      <section className="bg-white shadow-sm ring-1 ring-zinc-900/5 sm:rounded-xl md:col-span-2">
        <div className="px-4 py-6 sm:p-8">
          <div className="col-span-full">
            <div className="mt-2">
              <RadioGroup value={location} onChange={setLocation}>
                <RadioGroup.Label className="sr-only">Location</RadioGroup.Label>
                <div className="space-y-4">
                  {facilities &&
                    facilities.map(facility => {
                      return (
                        <RadioGroup.Option
                          key={facility._id}
                          value={facility._id}
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
                                    {facility.name} {facility.address} {facility.city}, {facility.state} {facility.zip}
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
                      )
                    })}
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
