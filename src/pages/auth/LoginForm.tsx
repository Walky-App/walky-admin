import { useState } from 'react'

import { useLocation, useNavigate } from 'react-router-dom'

import { Button } from 'primereact/button'
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

export const LoginForm = ({ setUserForm }: { setUserForm: (value: string) => void }) => {
  const [error, setError] = useState<Error>()
  const [loading, setLoading] = useState(false)
  const [value, setValue] = useState<string>('')
  const { setAvatarImageUrl } = useUtils()

  const location = useLocation()

  const params = new URLSearchParams(location.search)
  const redirectPath = params.get('redirect')

  const { setUser } = useAuth()
  const navigate = useNavigate()
  const tokenInfo = GetTokenInfo()

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
            state: user.state,
            avatar: user.avatar,
            onboarding: user.onboarding,
          }

          SetToken(data)
          setUser({ ...user, access_token: access_token, onboarding: user.onboarding })
          setAvatarImageUrl(user.avatar as string)
          if (redirectPath) {
            navigate(redirectPath, { replace: true })
          } else {
            switch (roleChecker()) {
              case 'admin':
                navigate('/admin/dashboard')
                break
              case 'client':
                if (tokenInfo.onboarding?.completed === false || tokenInfo.onboarding === undefined) {
                  navigate('/client/onboarding')
                } else {
                  navigate('/client/dashboard')
                }
                break
              case 'employee':
                if (tokenInfo.onboarding?.completed === false || tokenInfo.onboarding === undefined) {
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
    <form
      onSubmit={handleSubmit}
      className="mb-6 ml-auto mr-auto max-w-md space-y-4 px-4 sm:px-0"
      data-testid="login-form">
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
          iconField: { root: { className: 'w-full' } },
        }}
        className="w-full"
      />

      {error ? (
        <div className="flex items-center justify-center">
          <p className="text-sm text-red-500">{String(error)}</p>
        </div>
      ) : null}
      <div className="w-full text-right" style={{ marginTop: 0 }}>
        <button
          type="button"
          tabIndex={-1}
          className="text-xs text-zinc-500 underline hover:text-green-700"
          onClick={() => setUserForm('Forgot Password')}>
          Forgot your password?
        </button>
      </div>
      <Button
        label={loading ? 'Logging in' : 'Login'}
        type="submit"
        className={`w-full ${loading && 'cursor-wait hover:bg-zinc-950'}`}
      />
    </form>
  )
}
