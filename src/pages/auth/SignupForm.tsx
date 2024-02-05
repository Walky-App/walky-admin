import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ITokenInfo } from '../../interfaces/services.interfaces'

import { SetToken } from '../../utils/TokenUtils'
import { useAuth } from '../../contexts/AuthContext'
import { RequestService } from '../../services/RequestService'

export default function Signup() {
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)
  const { setUser } = useAuth()

  const navigate = useNavigate()

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await setLoading(true)

    const target = e.target as any

    const formData = {
      email: target.email.value,
      phone: target.phone.value,
      password: target.password.value,
      password_confirmed: target.password_confirmed.value,
      first_name: target.firstName.value,
      last_name: target.lastName.value,
      role: target.role.value,
    }

    const data: any = await RequestService('auth', 'POST', formData)

    const { access_token, user }: any = data

    if (user && access_token) {
      const ls_info: ITokenInfo = {
        first_name: user.first_name,
        _id: user._id,
        role: user.role,
        access_token: access_token,
        avatar: user.avatar,
      }

      SetToken(ls_info)
      setUser({ ...user, access_token: access_token })
      setLoading(false)

      switch (user.role) {
        case 'client':
          navigate('/client/dashboard')
          break
        case 'admin':
          navigate('/admin/dashboard')
          break
        case 'employee':
          navigate('/employee/dashboard')
          break
        default:
          navigate('/login')
      }
    } else {
      setError(data.message)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSignup} className="mx-auto max-w-md">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="sr-only" htmlFor="firstName">
            First Name
          </label>
          <input
            required
            className="w-full rounded-lg border-zinc-200 p-4 text-sm  focus:border-green-500 focus:ring-green-500"
            placeholder="First Name"
            type="text"
            name="firstName"
          />
        </div>
        <div>
          <label className="sr-only" htmlFor="lastName">
            Last Name
          </label>
          <input
            required
            className="w-full rounded-lg border-zinc-200 p-4 pe-12 text-sm shadow-sm  focus:border-green-500 focus:ring-green-500"
            placeholder="Last Name"
            type="text"
            name="lastName"
          />
        </div>
      </div>

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
            placeholder="Email"
          />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="sr-only">
          Phone
        </label>

        <div className="relative">
          <input
            required
            type="tel"
            name="phone"
            className="w-full rounded-lg border-zinc-200 p-4 pe-12 text-sm shadow-sm  focus:border-green-500 focus:ring-green-500"
            placeholder="Phone Number"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="sr-only">
          Password
        </label>

        <div className="relative">
          <input
            required
            type="password"
            name="password"
            className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm  focus:border-green-500 focus:ring-green-500"
            placeholder="Password"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password_confirmed" className="sr-only">
          password_confirmed
        </label>

        <div className="relative">
          <input
            required
            type="password"
            name="password_confirmed"
            className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm  focus:border-green-500 focus:ring-green-500"
            placeholder="Verify Password"
          />
        </div>
      </div>

      <div className="flex justify-center">
        <div className="inline-block relative w-64">
          <p className="text-center">I want to:</p>
          <select
            name="role"
            className="block appearance-none w-full bg-zinc-50 border border-zinc-200 hover:border-green-600 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline  focus:border-green-500 focus:ring-green-500">
            <option value="employee">Become a HempTemp</option>
            <option value="client">Hire HempTemps</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-700"></div>
        </div>
      </div>
      {error && (
        <div className="flex items-center justify-center">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}
      <div className="flex items-center justify-center">
        <button
          disabled={loading}
          type="submit"
          className={`w-full rounded-lg bg-zinc-950 py-3 text-sm font-medium text-zinc-50 hover:bg-green-700 ${
            loading && 'hover:bg-zinc-950 cursor-wait'
          }`}>
          {loading ? 'Signing up...' : 'Signup'}
        </button>
      </div>
    </form>
  )
}
