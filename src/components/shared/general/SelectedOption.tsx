import { Fragment, useEffect, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { BarsArrowUpIcon, CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid'
import { SelectedOptionInterface } from '../../../interfaces/global'
import { cn } from '../../../utils/cn'

interface Props {
  selectedOptions: SelectedOptionInterface[]
  setSelectedOptions: (value: string) => void
  defaultOption?: number
  showInputIcon?: boolean
  classStyle?: string
  roundedOrientation?: string
  value?: string
}

export const SelectedOption = ({
  selectedOptions,
  setSelectedOptions,
  defaultOption = 0,
  showInputIcon = false,
  classStyle = '',
  roundedOrientation,
  value
}: Props) => {
  const [selected, setSelected] = useState(selectedOptions[defaultOption])

  const handlerSelect = (terms: any) => {
    setSelected(terms)
    setSelectedOptions(terms.code)
  }

  useEffect(() => {
    if (value) {
      const selectedOption = selectedOptions.find((option) => option.code === value)
      if (selectedOption) {
        setSelected(selectedOption)
      }
    }

  })


  return (
    <div className={`${classStyle}`}>
      <Listbox value={selected} onChange={handlerSelect}>
        {({ open }) => (
          <>
            <div className="relative">
              <Listbox.Button
                className={`relative h-9 w-full ${roundedOrientation ? roundedOrientation : 'rounded-md'
                  } cursor-default bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-green-800 sm:text-sm sm:leading-6`}>
                <div className="flex gap-1 items-center justify-start">
                  {showInputIcon ? (
                    <span className="block truncate">
                      <BarsArrowUpIcon className="-ml-0.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                  ) : null}

                  <span className="block truncate text-center text-black text-sm font-semibold leading-tight">
                    {selected?.name}
                  </span>
                </div>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  {open ? (
                    <ChevronUpIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                  ) : (
                    <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                  )}
                </span>
              </Listbox.Button>

              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0">
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {selectedOptions.map((select, index) => (
                    <Listbox.Option
                      key={`${select.name}-${index}`}
                      className={({ active }) =>
                        cn(
                          active ? 'bg-green-600 text-white' : 'text-gray-900',
                          'relative cursor-default select-none py-2 pl-3 pr-9',
                        )
                      }
                      value={select}>
                      {({ selected, active }) => (
                        <>
                          <span
                            className={cn(
                              selected ? 'font-semibold' : 'font-normal',
                              'block truncate text-black text-sm font-normal leading-tight',
                            )}>
                            {select.name}
                          </span>

                          {selected ? (
                            <span
                              className={cn(
                                active ? 'text-white' : 'text-green-800',
                                'absolute inset-y-0 right-0 flex items-center pr-4',
                              )}>
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
    </div>
  )
}
