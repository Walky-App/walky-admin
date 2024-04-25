import { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'

import { useAuth } from '../../contexts/AuthContext'
import { type LoginData } from '../../interfaces/global'
import { type ILoginData } from '../../interfaces/loginData'
import { type ITokenInfo } from '../../interfaces/services'
import { LoginService } from '../../services/authService'
import { useUtils } from '../../store/useUtils'
import { roleChecker } from '../../utils/roleChecker'
import { GetTokenInfo, SetToken } from '../../utils/tokenUtil'

const admin_role = process.env.REACT_APP_ADMIN_ROLE
const client_role = process.env.REACT_APP_CLIENT_ROLE
const employee_role = process.env.REACT_APP_EMPLOYEE_ROLE
const sales_role = process.env.REACT_APP_SALES_ROLE

export const LoginForm = () => {
  const [error, setError] = useState<Error>()
  const [loading, setLoading] = useState(false)
  const [value, setValue] = useState<string>('')
  const { setAvatarImageUrl } = useUtils()

  const { setUser } = useAuth()
  const navigate = useNavigate()

  const roleType = roleChecker()
  const tokenInfo = GetTokenInfo()

  /* This is to persist the user in the app */
  useEffect(() => {
    switch (roleType) {
      case 'admin':
        navigate('/admin/dashboard')
        break
      case 'client':
        if (tokenInfo.onboarding?.completed === false) {
          navigate('/client/onboarding')
        } else {
          navigate('/client/dashboard')
        }
        break
      case 'employee':
        if (tokenInfo.onboarding?.completed === false) {
          navigate('/employee/onboarding')
        } else {
          navigate('/employee/dashboard')
        }
        break
      case 'sales':
        navigate('/sales/dashboard')
        break
      default:
        navigate('/login')
    }
  }, [navigate, roleType, tokenInfo.onboarding?.completed])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await setLoading(true)
    const form = event.target as HTMLFormElement

    const body: LoginData = {
      email: form.email.value,
      password: form.password.value,
    }

    const data: ILoginData = await LoginService(body)

    try {
      if (!data) {
        setLoading(false)
        return setError(new Error('Email/Password invalid'))
      } else {
        const { access_token, user }: ILoginData = data

        if (user && access_token) {
          const data: ITokenInfo = {
            first_name: user.first_name,
            _id: user._id,
            role: user.role,
            access_token: access_token,
            avatar: user.avatar,
            onboarding: user.onboarding,
          }

          SetToken(data)
          setUser({ ...user, access_token: access_token, onboarding: user.onboarding })
          setAvatarImageUrl(user.avatar as string)

          switch (user.role) {
            case admin_role:
              navigate('/admin/dashboard')
              break
            case client_role:
              navigate('/client/dashboard')
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
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 ml-auto mr-auto max-w-md space-y-4 px-4 sm:px-0">
      <div className="mx-auto max-w-lg text-center" />
      <div>
        <label htmlFor="email" className="sr-only">
          Email
        </label>

        <div className="relative">
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
      </div>

      <Password
        inputId="password"
        placeholder="*Password"
        value={value}
        onChange={e => setValue(e.target.value)}
        toggleMask
        pt={{
          panel: { className: 'hidden' },
          input: {
            className: 'w-full rounded-lg border-zinc-200 p-4 shadow-sm focus:border-green-500 focus:ring-green-500',
          },
        }}
        className="w-full"
      />

      {error ? (
        <div className="flex items-center justify-center">
          <p className="text-sm text-red-500">{String(error)}</p>
        </div>
      ) : null}
      <button
        type="submit"
        className={`w-full rounded-lg bg-zinc-950 py-3 text-sm font-medium text-zinc-50 hover:bg-green-700 ${
          loading && 'cursor-wait hover:bg-zinc-950'
        }`}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}
