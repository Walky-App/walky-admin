import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { RequestService } from '../../services/RequestService'

export default function NewPasswordForm({ setUserForm }: any) {
  const { id, at } = useParams()
  const [form, setForm] = useState({ _id: id, access_token: at, password: '', password_confirm: '' })
  const [error, setError] = useState<any>()
  const [loading, setLoading] = useState(false)

  console.log('id -> ', id)
  console.log('at -> ', at)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const response = await RequestService('auth/new', 'POST', form)

    if (response) {
      setUserForm('Login')
      setLoading(false)
    }
  }

  console.log('form -> ', form)

  return (
    <form onSubmit={handleSubmit} className="mx-auto mb-0 mt-8 max-w-md space-y-4">
      <div className="flex justify-center">
        <img src="/assets/logos/logo-horizontal-cropped.png" alt="hemp temps logo" height={300} />
      </div>

      <div>
        <label htmlFor="email" className="sr-only">
          New Password
        </label>

        <div>
          <label htmlFor="password" className=" sr-only">
            Password
          </label>

          <div className="relative">
            <input
              required
              type="password"
              name="password"
              className="my-5 w-full rounded-lg border-zinc-200 p-4 pe-12 text-sm shadow-sm  focus:border-green-500 focus:ring-green-500"
              placeholder="Password"
              onChange={e => setForm({ ...form, password: e.target.value })}
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
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </span>
          </div>
        </div>
        <div>
          <label htmlFor="password_confirmed" className="sr-only">
            Password Confirm
          </label>

          <div className="relative">
            <input
              required
              type="password"
              name="password_confirmed"
              className="w-full rounded-lg border-zinc-200 p-4 pe-12 text-sm shadow-sm  focus:border-green-500 focus:ring-green-500"
              placeholder="Password Confirmed"
              onChange={e => setForm({ ...form, password_confirm: e.target.value })}
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
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </span>
          </div>
        </div>
        {error && (
          <div className="flex items-center justify-center">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}
      </div>

      <button
        type="submit"
        className={`w-full rounded-lg bg-zinc-950 py-3 text-sm font-medium text-zinc-50 hover:bg-green-700 ${
          loading && 'hover:bg-zinc-950 cursor-wait'
        }`}>
        {loading ? 'Updating password...' : 'Submit'}
      </button>
    </form>
  )
}
