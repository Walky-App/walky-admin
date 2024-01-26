import { useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'

export default function ForgotPassword() {
  const [error, setError] = useState()
  const [isOpen, setIsOpen] = useState(false)
  const closeModal = () => setIsOpen(false)
  const openModal = () => setIsOpen(true)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  return (
    <>
      <main className=" bg-zinc-50">
        <div className="container mx-auto py-20 h-screen">
          <div className="flex justify-center px-6 my-12 ">
            <div className="w-full xl:w-3/4 lg:w-11/12 flex border border-zinc-950">
              <div className="w-full h-auto bg-zinc-400 hidden lg:block lg:w-1/2 bg-cover rounded-l-lg">
                <img
                  src="https://images.unsplash.com/photo-1498671546682-94a232c26d17?auto=format&fit=crop&q=80&w=2603&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="marijuana leaves"
                />
              </div>
              <div className="w-full lg:w-1/2 bg-zinc-50 p-5 rounded-lg lg:rounded-l-none">
                <div className="px-8 mb-4 text-center">
                  <h3 className="pt-4 mb-2 text-2xl">Forgot Your Password?</h3>
                  <p className="mb-4 text-sm text-zinc-700">
                    We get it, stuff happens. Just enter your email address below and we'll send you a link to reset
                    your password!
                  </p>
                </div>
                <MyModal closeModal={closeModal} isOpen={isOpen} error={error} />
                <form onSubmit={handleSubmit} className="px-8 pt-6 pb-8 mb-4 bg-zinc-50 rounded">
                  <div className="mb-4">
                    <label htmlFor="email" className="sr-only">
                      Email
                    </label>
                    <input
                      className="w-full px-3 py-4 text-sm leading-tight text-zinc-700 border rounded-lg border-zinc-200 p-4 shadow-sm focus:outline-none focus:shadow-outline focus:border-green-500 focus:ring-green-500"
                      id="email"
                      type="email"
                      placeholder="Email Address"
                    />
                  </div>
                  <div className="mb-6 text-center">
                    <button
                      className="w-full px-4 py-2 text-zinc-50 bg-zinc-950 rounded-full hover:bg-green-700 focus:outline-none focus:shadow-outline"
                      type="submit">
                      Reset Password
                    </button>
                  </div>
                  <hr className="mb-6 border-t border-green-600" />
                  <div className="text-center">
                    <a
                      className="inline-block text-sm text-zinc-950 align-baseline hover:text-green-600"
                      href="/signup">
                      Create an Account!
                    </a>
                  </div>
                  <div className="text-center">
                    <a className="inline-block text-sm text-zinc-950 align-baseline hover:text-green-600" href="/login">
                      Already have an account? Login!
                    </a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

const MyModal = ({ closeModal, isOpen, error }: any) => {
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <div className="fixed inset-0 bg-zinc-950/25" />
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
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-grzincay-900">
                    {error ? 'Oops!' : 'Email Sent'}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-zinc-500">
                      {error
                        ? `ERROR: ${error.message}`
                        : `We sent you an email with a link to reset your password. Please check your
                      inbox. It may take up to 5 minutes to arrive.`}
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                      onClick={closeModal}>
                      Got it, thanks!
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
