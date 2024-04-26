import { useState, useRef } from 'react'

import { useNavigate, useParams } from 'react-router-dom'

import { InputMask } from 'primereact/inputmask'
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { Toast } from 'primereact/toast'

import { AddressAutoComplete, type IAddressAutoComplete } from '../../components/shared/forms/AddressAutoComplete'
import { useAuth } from '../../contexts/AuthContext'
import { type ILoginData } from '../../interfaces/loginData'
import { type ITokenInfo } from '../../interfaces/services'
import { requestService } from '../../services/requestServiceNew'
import { useUtils } from '../../store/useUtils'
import { SetToken } from '../../utils/tokenUtil'

const admin_role = process.env.REACT_APP_ADMIN_ROLE as string
const client_role = process.env.REACT_APP_CLIENT_ROLE as string
const employee_role = process.env.REACT_APP_EMPLOYEE_ROLE as string
const sales_role = process.env.REACT_APP_SALES_ROLE as string

export const Signup = () => {
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    _id: '',
    access_token: '',
    password: '',
    password_confirmed: '',
    phone_number: '',
    address: '',
  })
  const { setUser } = useAuth()
  const { setAvatarImageUrl } = useUtils()
  const [moreAddressDetails, setMoreAddressDetails] = useState<IAddressAutoComplete>()
  const toast = useRef<Toast>(null)

  const show = (message: string) => {
    toast.current?.show({ severity: 'error', summary: 'Email not found', detail: message })
  }

  const { email, role } = useParams()
  const navigate = useNavigate()

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await setLoading(true)

    const target = e.target as HTMLFormElement

    const formData = {
      email: email,
      phone_number: target.phone.value,
      password: target.password.value,
      password_confirmed: target.password_confirmed.value,
      first_name: target.firstName.value,
      last_name: target.lastName.value,
      role: role,
    }

    try {
      const response = await requestService({ path: 'auth', method: 'POST', body: JSON.stringify(formData) })
      const data = await response.json()

      const { access_token, user }: ILoginData = data

      if (access_token) {
        const ls_info: ITokenInfo = {
          first_name: user.first_name,
          _id: user._id,
          role: user.role,
          access_token: access_token,
          avatar: user.avatar,
        }

        SetToken(ls_info)
        setUser({ ...user, access_token: access_token })
        setAvatarImageUrl(user.avatar as string)
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
    } catch (error) {
      console.error('Error:', error)
      show('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <form onSubmit={handleSignup} className="mx-auto max-w-md">
        <div className="flex justify-center">
          <img src="/assets/logos/logo-horizontal-cropped.png" alt="hemp temps logo" width={400} />
        </div>
        <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <InputText
            required
            type="text"
            name="first_name"
            className="w-full rounded-lg border-zinc-200 p-4 shadow-sm  focus:border-green-500 focus:ring-green-500"
            placeholder="*First Name"
          />

          <InputText
            required
            type="text"
            name="last_name"
            className="w-full rounded-lg border-zinc-200 p-4 shadow-sm  focus:border-green-500 focus:ring-green-500"
            placeholder="*Last Name"
          />
        </div>

        <div className="relative mb-5">
          <InputText
            required
            type="email"
            name="email"
            className="w-full rounded-lg border-zinc-200 p-4 shadow-sm  focus:border-green-500 focus:ring-green-500"
            placeholder="*Email"
          />
          <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-zinc-700"
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
        <div className="relative my-5">
          {/* <InputText
            required
            type="tel"
            name="phone"
            className="w-full rounded-lg border-zinc-200 p-4 shadow-sm  focus:border-green-500 focus:ring-green-500"
            placeholder="*Phone Number"
          /> */}

          <InputMask
            value={form.phone_number}
            onChange={e => setForm({ ...form, phone_number: e.target.value || '' })}
            mask="(999) 999-9999"
            placeholder="(561) 999-9999"
            className="w-full"
          />
        </div>
        <div className="p-fluid mb-5">
          <AddressAutoComplete
            setMoreAddressDetails={setMoreAddressDetails}
            className="rounded-lg border-zinc-200  focus:border-green-500 focus:ring-green-500"
            currentAddress={'*Home Address'}
          />
        </div>
        <div>
          <Password
            inputId="password"
            placeholder="*Password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            toggleMask
            pt={{
              panel: { className: 'hidden' },
              input: {
                className:
                  'w-full rounded-lg border-zinc-200 p-4 shadow-sm focus:border-green-500 focus:ring-green-500',
              },
            }}
            className="w-full"
          />
          <Password
            inputId="password_confirmed"
            placeholder="*Password confirmed"
            value={form.password_confirmed}
            onChange={e => setForm({ ...form, password_confirmed: e.target.value })}
            toggleMask
            pt={{
              panel: { className: 'hidden' },
              input: {
                className:
                  'w-full rounded-lg border-zinc-200 p-4 shadow-sm focus:border-green-500 focus:ring-green-500',
              },
            }}
            className="my-5 w-full"
          />
          <Toast ref={toast} position="bottom-right" />

          {error ? (
            <div className="mt-3 flex items-center justify-center">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          ) : null}
        </div>
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
