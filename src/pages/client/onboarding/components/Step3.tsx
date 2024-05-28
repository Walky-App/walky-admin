import { Fragment, useContext, useState } from 'react'

import { Button } from 'primereact/button'

import { Menu, Transition } from '@headlessui/react'
import { EllipsisHorizontalIcon, PhotoIcon } from '@heroicons/react/20/solid'

import { cn } from '../../../../utils/cn'
import { FormDataContext, type StepProps } from '../ClientOnboardingPage'
import { AddFacilityDialog } from './AddFacilityDialog'

function joinTruthyStrings(strings: (string | undefined)[], separator: string): string {
  return strings.filter(Boolean).join(separator)
}

export const Step3 = ({ step, setStep }: StepProps) => {
  const [visible, setVisible] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false)

  const { facilitiesArray, defaultValues, selectedFacility, setSelectedFacility } = useContext(FormDataContext)

  const handleSaveButton = () => {
    setIsLoading(true)

    setTimeout(() => {
      setStep(step + 1)
    }, 1000)
  }

  return (
    <div className="space-y-4 sm:space-y-12">
      <AddFacilityDialog visible={visible} setVisible={setVisible} values={selectedFacility || defaultValues} />
      <div className="grid grid-cols-1 gap-x-8 gap-y-4 border-b border-gray-900/10 pb-12 sm:gap-y-10 md:grid-cols-3">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">Do you have more locations to add?</h2>
          <p className="mt-4 text-sm leading-6 text-gray-600">
            To continue, enter your business location information below.
          </p>
        </div>
        <div className="sm:col-span-full">
          <ul className="grid auto-rows-fr grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8">
            {facilitiesArray?.map(facility => (
              <li key={facility._id} className="overflow-hidden rounded-xl border border-gray-200">
                <div className="flex h-20 items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
                  {facility.images[0]?.url ? (
                    <img
                      src={facility.images[0]?.url}
                      alt={facility.name}
                      className="max-h-12 min-w-12 max-w-20 flex-none rounded-lg bg-white object-cover ring-1 ring-gray-900/10"
                    />
                  ) : (
                    <PhotoIcon
                      className="h-12 w-12 flex-none rounded-lg bg-white object-cover text-gray-300 ring-1 ring-gray-900/10"
                      aria-hidden="true"
                    />
                  )}
                  <div className="text-sm font-medium leading-6 text-gray-900">{facility.name}</div>
                  <Menu as="div" className="relative ml-auto">
                    <Menu.Button className="-m-2.5 block p-2.5 text-gray-400 hover:text-gray-500">
                      <span className="sr-only">Open options</span>
                      <EllipsisHorizontalIcon className="h-5 w-5" aria-hidden="true" />
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95">
                      <Menu.Items className="absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              type="button"
                              onClick={() => {
                                setVisible(true)
                                setSelectedFacility(facility)
                              }}
                              className={cn(
                                active ? 'bg-gray-50' : '',
                                'block w-full px-3 py-1 text-start text-sm leading-6 text-gray-900',
                              )}>
                              Edit<span className="sr-only">, {facility.name}</span>
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
                <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
                  <div className="flex justify-between gap-x-4 py-3">
                    <dt className="text-gray-500">Address</dt>
                    <dd className="flex items-start gap-x-2">
                      <div className="text-balance text-end font-medium text-gray-900">{facility.address}</div>
                    </dd>
                  </div>
                  <div className="flex justify-between gap-x-4 py-3">
                    <dt className="text-gray-500">Contact name</dt>
                    <dd className="flex items-start gap-x-2">
                      <div className="font-medium text-gray-900">
                        {joinTruthyStrings([facility.contacts[0].first_name, facility.contacts[0].last_name], ' ')}
                      </div>
                    </dd>
                  </div>
                  <div className="flex justify-between gap-x-4 py-3">
                    <dt className="text-gray-500">Role</dt>
                    <dd className="flex items-start gap-x-2">
                      <div className="font-medium text-gray-900">{facility.contacts[0].role}</div>
                    </dd>
                  </div>
                </dl>
              </li>
            ))}
            <li className="overflow-hidden rounded-xl border border-gray-200">
              <div className="flex h-full flex-col items-center justify-center gap-x-4 gap-y-3 border-b border-gray-900/5 bg-gray-50 p-6">
                <Button
                  icon="pi pi-plus"
                  rounded
                  aria-label="Add"
                  onClick={() => {
                    setVisible(true)
                    setSelectedFacility(undefined)
                  }}
                />
                <div className="text-sm font-medium leading-6 text-gray-900">Add new location</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <Button severity="secondary" label="Back" outlined onClick={() => setStep(step - 1)} />
        <Button label="Save" onClick={handleSaveButton} loading={isLoading} />
      </div>
    </div>
  )
}
