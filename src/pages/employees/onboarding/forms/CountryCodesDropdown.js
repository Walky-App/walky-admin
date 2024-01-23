import { Fragment, useState, useEffect } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { HiCheck, HiChevronDown } from 'react-icons/hi2'

const codes = [
  { code: '+1', name: 'United States', flag: '🇺🇸' },
  { code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
  { code: '+61', name: 'Australia', flag: '🇦🇺' },
  { code: '+49', name: 'Germany', flag: '🇩🇪' },
  { code: '+33', name: 'France', flag: '🇫🇷' },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function CountryCodesDropdown({ formValues, setFormValues }) {
  const [selected, setSelected] = useState(codes[0])

  const handleSelectChange = code => {
    setSelected(code)

    const mainPhoneId = document.getElementById('headlessui-listbox-button-:r0:')
    const altPhoneId = document.getElementById('headlessui-listbox-button-:r1:')
    const mobilePhoneId = document.getElementById('headlessui-listbox-button-:r2:')
    console.log(mainPhoneId, altPhoneId, mobilePhoneId)
    if (mainPhoneId) {
      console.log('CLICK')
    }

    setFormValues({
      ...formValues,
      mainPhone: { ...formValues.mainPhone, countryCode: code.code },
    })

    // switch ((id, code)) {
    //   case 'headlessui-listbox-button-:r0:':
    //     console.log('MAIN PHONE CASE', id, code)
    //     setSelected(code)
    //     setFormValues({
    //       ...formValues,
    //       mainPhone: { ...formValues.mainPhone, countryCode: code.code },
    //     })
    //     break
    //   case 'headlessui-listbox-button-:r1:':
    //     console.log('ALT PHONE CASE')
    //     setSelected(code)
    //     setFormValues({
    //       ...formValues,
    //       altPhone: { ...formValues.altPhone, countryCode: code.code },
    //     })
    //     break
    //   case 'headlessui-listbox-button-:r2:':
    //     console.log('MOBILE PHONE CASE')
    //     setSelected(code)
    //     setFormValues({
    //       ...formValues,
    //       mobilePhone: { ...formValues.mobilePhone, countryCode: code.code },
    //     })
    //     break
    //   default:
    //     break
    //}
  }
  // useEffect(() => {
  //   console.log(formValues.mainPhone, formValues.altPhone, formValues.mobilePhone)
  // }, [formValues])

  return (
    <Listbox
      value={selected}
      onChange={code => {
        handleSelectChange(code)
      }}>
      {({ open }) => (
        <>
          {/* <Listbox.Label className="block text-sm font-medium leading-6 text-zinc-900">
            Country Code
          </Listbox.Label> */}
          <div className="relative">
            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-3.5 pl-3 pr-10 text-left text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 focus:outline-none focus:ring-2 focus:ring-green-500 sm:text-sm sm:leading-6">
              <span className="flex items-center">
                <span className="h-5 w-5 flex-shrink-0 rounded-full">{selected?.flag}</span>
                <span className="ml-3 block truncate">{selected?.code}</span>
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                <HiChevronDown className="h-5 w-5 text-zinc-400" aria-hidden="true" />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0">
              <Listbox.Options className="absolute z-10 mt-1 max-h-56 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {codes.map(code => (
                  <Listbox.Option
                    key={code.code}
                    className={({ active }) =>
                      classNames(
                        active ? 'bg-green-600 text-white' : 'text-zinc-900',
                        'relative cursor-default select-none py-2 pl-3 pr-9',
                      )
                    }
                    value={code}>
                    {({ selected, active }) => (
                      <>
                        <div className="flex items-center">
                          <span className="h-5 w-5 flex-shrink-0 rounded-full">{code.flag}</span>
                          <span
                            className={classNames(
                              selected ? 'font-semibold' : 'font-normal',
                              'ml-3 block truncate',
                            )}>
                            {code.name}
                          </span>
                        </div>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? 'text-white' : 'text-green-600',
                              'absolute inset-y-0 right-0 flex items-center pr-4',
                            )}>
                            <HiCheck className="h-5 w-5" aria-hidden="true" />
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
  )
}
