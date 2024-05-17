import { useState, useRef } from 'react'

import { Controller, type SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'

import { InputMask } from 'primereact/inputmask'
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { Toast } from 'primereact/toast'

import { useAuth } from '../../contexts/AuthContext'
import { type ISignupData, type ILoginData } from '../../interfaces/loginData'
import { type ITokenInfo } from '../../interfaces/services'
import { requestService } from '../../services/requestServiceNew'
import { useUtils } from '../../store/useUtils'
import { SetToken } from '../../utils/tokenUtil'

const admin_role = process.env.REACT_APP_ADMIN_ROLE as string
const client_role = process.env.REACT_APP_CLIENT_ROLE as string
const employee_role = process.env.REACT_APP_EMPLOYEE_ROLE as string
const sales_role = process.env.REACT_APP_SALES_ROLE as string

interface IShowToast {
  message: string
  severity: 'success' | 'info' | 'warn' | 'error' | undefined
  summary: string
}

export const Signup = () => {
  const [loading, setLoading] = useState(false)
  const { setUser } = useAuth()
  const { setAvatarImageUrl } = useUtils()
  const toast = useRef<Toast>(null)

  const show = ({ message, severity, summary }: IShowToast) => {
    toast.current?.show({ severity: severity, summary: summary, detail: message })
  }

  const { email, role } = useParams()
  const navigate = useNavigate()

  const defaultValues: ISignupData = {
    first_name: '',
    last_name: '',
    password: '',
    password_confirmed: '',
    email: email as string,
    role: role as string,
    phone_number: '',
    otp: '',
  }

  const { control, handleSubmit, reset } = useForm({ defaultValues })

  const onSubmit: SubmitHandler<ISignupData> = async data => {
    await setLoading(true)

    try {
      const payload = {
        first_name: data.first_name,
        last_name: data.last_name,
        password: data.password,
        password_confirmed: data.password_confirmed,
        email: email as string,
        role: role as string,
        phone_number: data.phone_number,
        otp: data.otp,
      }

      const response = await requestService({ path: 'auth', method: 'POST', body: JSON.stringify(payload) })
      if (response.ok) {
        const jsonResponse = await response.json()

        if (response.status === 201) {
          const { access_token, user }: ILoginData = jsonResponse
          if (access_token) {
            const ls_info: ITokenInfo = {
              first_name: user.first_name,
              _id: user._id,
              role: user.role,
              access_token: access_token,
              state: user.state,
              avatar: user.avatar,
              onboarding: user.onboarding,
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
            show({ message: 'Account created successfully', severity: 'success', summary: 'Success' })
            reset()
          }
        } else {
          setLoading(false)
        }
      } else {
        const jsonResponse = await response.json()
        show({ message: jsonResponse.message, severity: 'error', summary: 'Error' })
        setLoading(false)
      }
    } catch (error) {
      show({ message: 'An error occurred. Please try again.' + error, severity: 'error', summary: 'Error' })
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-md">
        <div className="flex justify-center">
          <img src="/assets/logos/logo-horizontal-cropped.png" alt="hemp temps logo" width={400} />
        </div>
        <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Controller
            name="first_name"
            control={control}
            rules={{ required: 'First Name is required' }}
            render={({ field }) => (
              <InputText
                required
                type="text"
                name="first_name"
                onChange={e => field.onChange(e.target.value)}
                className="w-full rounded-lg border-zinc-200 p-4 shadow-sm  focus:border-green-500 focus:ring-green-500"
                placeholder="*First Name"
              />
            )}
          />
          <Controller
            name="last_name"
            control={control}
            rules={{ required: 'Last Name is required' }}
            render={({ field }) => (
              <InputText
                required
                type="text"
                name="last_name"
                onChange={e => field.onChange(e.target.value)}
                className="w-full rounded-lg border-zinc-200 p-4 shadow-sm  focus:border-green-500 focus:ring-green-500"
                placeholder="*Last Name"
              />
            )}
          />
        </div>
        <div className="relative mb-5">
          <Controller
            name="email"
            control={control}
            rules={{ required: 'Email is required' }}
            render={({ field }) => (
              <InputText
                required
                disabled
                defaultValue={email}
                type="email"
                name="email"
                onChange={e => field.onChange(e.target.value)}
                className="w-full rounded-lg border-zinc-200 p-4 shadow-sm  focus:border-green-500 focus:ring-green-500"
                placeholder="*Email"
              />
            )}
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
          <Controller
            name="phone_number"
            control={control}
            rules={{ required: 'Phone Number is required' }}
            render={({ field }) => (
              <InputMask
                required
                mask="(999) 999-9999"
                onChange={e => field.onChange(e.target.value)}
                placeholder="(561) 999-9999"
                className="w-full"
              />
            )}
          />
        </div>
        <div>
          <Controller
            name="password"
            control={control}
            rules={{ required: 'Password is required' }}
            render={({ field }) => (
              <Password
                required
                inputId="password"
                placeholder="*Password"
                toggleMask
                onChange={e => field.onChange(e.target.value)}
                pt={{
                  panel: { className: 'hidden' },
                  input: {
                    className:
                      'w-full rounded-lg border-zinc-200 p-4 shadow-sm focus:border-green-500 focus:ring-green-500',
                  },
                  iconField: { root: { className: 'w-full' } },
                }}
                className="w-full"
              />
            )}
          />
          <Controller
            name="password_confirmed"
            control={control}
            rules={{ required: 'Password Verify is required' }}
            render={({ field }) => (
              <Password
                required
                inputId="password_confirmed"
                placeholder="*Password confirmed"
                toggleMask
                onChange={e => field.onChange(e.target.value)}
                pt={{
                  panel: { className: 'hidden' },
                  input: {
                    className:
                      'w-full rounded-lg border-zinc-200 p-4 shadow-sm focus:border-green-500 focus:ring-green-500',
                  },
                  iconField: { root: { className: 'w-full' } },
                }}
                className="my-5 w-full"
              />
            )}
          />
          {/* <div className="relative my-5">
            <label htmlFor="employee" className="block text-sm font-medium leading-6 text-gray-900">
              One Time Passcode
            </label>
            <Controller
              name="otp"
              control={control}
              rules={{ required: 'One time passcode is required' }}
              render={({ field }) => (
                <InputMask
                  required
                  mask="999-999"
                  onChange={e => field.onChange(e.target.value)}
                  placeholder="123-456"
                  className="w-full"
                />
              )}
            />

          </div> */}

          <Toast ref={toast} position="bottom-right" />
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
