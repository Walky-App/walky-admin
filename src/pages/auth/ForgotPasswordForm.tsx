import { useState } from 'react'

import { RequestService } from '../../services/RequestService'

export const ForgotPassword = () => {
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const response = await RequestService('auth/reset', 'POST', form)

    if (response) {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto mb-0 mt-8 max-w-md space-y-4">
      <div>
        <label htmlFor="email" className="sr-only">
          Email
        </label>

        <div className="relative">
          <input
            required
            type="email"
            name="email"
            className="w-full rounded-lg border-zinc-200 p-4 pe-12 text-sm shadow-sm  focus:border-green-500 focus:ring-green-500"
            placeholder="Email*"
            onChange={e => setForm({ email: e.target.value })}
          />

          <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-zinc-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
              />
            </svg>
          </span>
        </div>
      </div>

      <button
        type="submit"
        className={`w-full rounded-lg bg-zinc-950 py-3 text-sm font-medium text-zinc-50 hover:bg-green-700 ${
          loading && 'cursor-wait hover:bg-zinc-950'
        }`}>
        {loading ? 'Reseting password...' : 'Submit'}
      </button>
    </form>
  )
}
