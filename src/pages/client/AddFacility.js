import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import TextInput from '@/components/shared/forms/TextInput'
import Select from '@/components/shared/forms/Select'
import { states } from '@/variables'

export default function AddFacility({ open, setOpen, handleSubmit }) {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => setOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-zinc-900">
                  Add Facility Location
                </Dialog.Title>
                <form className="mt-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <TextInput label="Facility Name*" name="name" placeholder="Facility Name*" required />
                    <TextInput label="Street Address*" name="streetAddress" placeholder="Street Address*" required />
                    <TextInput label="Apt, Suite or Unit" name="address2" placeholder="Apt, Suite or Unit" />
                    <TextInput label="City*" name="city" placeholder="City*" required />
                    <Select
                      options={states}
                      required
                      name="state"
                      label="State / Province*"
                      placeholder="State / Province*"
                    />
                    <TextInput label="Zip Code*" name="zipCode" placeholder="Zip Code*" required />
                  </div>

                  <div className="mt-4 flex justify-end gap-4">
                    <button
                      type="submit"
                      onClick={e => handleSubmit(e)} // Cannot use onSubmit with nested form
                      className="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2">
                      Save
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
