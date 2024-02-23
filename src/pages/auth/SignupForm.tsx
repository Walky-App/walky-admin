import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { ITokenInfo } from '../../interfaces/services.interfaces'

import { SetToken } from '../../utils/TokenUtils'
import { useAuth } from '../../contexts/AuthContext'
import { RequestService } from '../../services/RequestService'

const admin_role = process.env.REACT_APP_ADMIN_ROLE as string
const client_role = process.env.REACT_APP_CLIENT_ROLE as string
const employee_role = process.env.REACT_APP_EMPLOYEE_ROLE as string
const sales_role = process.env.REACT_APP_SALES_ROLE as string

export default function Signup() {
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)
  const { setUser } = useAuth()

  const { email, role } = useParams()
  const navigate = useNavigate()

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await setLoading(true)

    const target = e.target as any

    const formData = {
      email: email,
      phone: target.phone.value,
      password: target.password.value,
      password_confirmed: target.password_confirmed.value,
      first_name: target.firstName.value,
      last_name: target.lastName.value,
      role: role,
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
        case client_role:
          navigate('/client/dashboard')
          break
        case admin_role:
          navigate('/admin/dashboard')
          break
        case employee_role:
          navigate('/employee/dashboard')
          break
        case sales_role:
          navigate('/sales/dashboard')
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
    <div className="w-full">
      <div className="flex justify-center">
        <img src="/assets/logos/logo-horizontal-cropped.png" alt="hemp temps logo" width={400} />
      </div>
      <form onSubmit={handleSignup} className="mx-auto max-w-md">
        <div className="grid grid-cols-1 gap-4 p-3 sm:grid-cols-2">
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
              className="w-full rounded-lg border-zinc-200 p-4 pe-12 text-sm shadow-sm  focus:border-green-500 focus:ring-green-500 "
              placeholder="Last Name"
              type="text"
              name="lastName"
            />
          </div>
        </div>

        <div className="p-3">
          <label htmlFor="email" className="sr-only">
            Email
          </label>

          <div className="relative">
            <input
              disabled
              value={email}
              required
              type="email"
              name="email"
              className="w-full rounded-lg border-zinc-200 p-4 pe-12 text-sm shadow-sm  focus:border-green-500 focus:ring-green-500"
              placeholder="Email"
            />
          </div>
        </div>

        <div className="p-3">
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

        <div className="p-3">
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

          <div className="relative p-3">
            <input
              required
              type="password"
              name="password_confirmed"
              className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm  focus:border-green-500 focus:ring-green-500"
              placeholder="Verify Password"
            />
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
              loading && 'cursor-wait hover:bg-zinc-950'
            }`}>
            {loading ? 'Signing up...' : 'Signup'}
          </button>
        </div>
      </form>
    </div>
  )
}
