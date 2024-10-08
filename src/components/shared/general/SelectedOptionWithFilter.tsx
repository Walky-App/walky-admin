import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { BarsArrowUpIcon, CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid'
import { SelectedOptionInterface } from '../../../interfaces/global'
import { useSearchParams } from 'react-router-dom'

interface Props {
  selectedOptions: SelectedOptionInterface[]
  defaultOption?: number
  showInputIcon?: boolean
  classStyle?: string
  roundedOrientation?: string
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export const SelectedOptionWithFilter = ({
  selectedOptions,
  defaultOption = 0,
  showInputIcon = true,
  classStyle = '',
  roundedOrientation,
}: Props) => {
  const [selected, setSelected] = useState(selectedOptions[defaultOption])
  const [searchParams, setSearchParams] = useSearchParams()

  const handlerSelect = (terms: SelectedOptionInterface) => {
    const params = new URLSearchParams(searchParams.toString())
    if (terms.name.toLowerCase().includes('all')) {
      params.delete('selected')
    } else {
      params.set('selected', terms.code.toLowerCase())
    }
    setSearchParams(params)
    setSelected(terms)
  }

  return (
    <div className={`${classStyle}`}>
      <Listbox onChange={handlerSelect} value={selected} >
        {({ open }) => (
          <div>
            <div className="relative">
              <Listbox.Button
                className={`relative h-9 w-full ${roundedOrientation ? roundedOrientation : 'rounded-md'
                  } cursor-default bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-green-800 sm:text-sm sm:leading-6`}>
                <div className="flex gap-1 items-center justify-start">
                  {showInputIcon ? (
                    <span className="block truncate">
                      <BarsArrowUpIcon aria-hidden="true" className="-ml-0.5 h-5 w-5 text-gray-400" />
                    </span>
                  ) : null}

                  <span className="block truncate text-center text-black text-sm font-semibold leading-tight">
                    {selected.name}
                  </span>
                </div>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  {open ? (
                    <ChevronUpIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-gray-400" />
                  )}
                </span>
              </Listbox.Button>

              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                show={open}
              >
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {selectedOptions.map((select, index) => (
                    <Listbox.Option
                      className={({ active }) =>
                        classNames(
                          active ? 'bg-green-600 text-white' : 'text-gray-900',
                          'relative cursor-default select-none py-2 pl-3 pr-9',
                        )
                      }
                      key={`${select.name}-${index}`}
                      value={select}>
                      {({ selected, active }) => (
                        <>
                          <span
                            className={classNames(
                              selected ? 'font-semibold' : 'font-normal',
                              'block truncate text-black text-sm font-normal leading-tight',
                            )}>
                            {select.name}
                          </span>

                          {selected ? (
                            <span
                              className={classNames(
                                active ? 'text-white' : 'text-green-800',
                                'absolute inset-y-0 right-0 flex items-center pr-4',
                              )}>
                              <CheckIcon aria-hidden="true" className="h-5 w-5" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </div>
        )}
      </Listbox>
    </div>
  )
}
