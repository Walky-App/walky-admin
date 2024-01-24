import { useNavigate } from 'react-router-dom'
import { LoginService } from '../../services/AuthService'
import { SetToken } from '../../utils/TokenUtils'
import { LoginData } from '../../interfaces/Global'
import { useAuth } from '../../contexts/AuthContext'

export default function LoginForm() {
  const { setUser } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    const form = event.target

    const body: LoginData = {
      email: form.email.value,
      password: form.password.value,
    }

    const data: any = await LoginService(body)

    const { access_token, user }: any = data

    if (user && access_token) {
      SetToken(user.role, access_token)
      setUser({ ...user, access_token: access_token })

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

      <div>
        <label htmlFor="password" className="sr-only">
          Password
        </label>

        <div className="relative">
          <input
            required
            type="password"
            name="password"
            className="w-full rounded-lg border-zinc-200 p-4 pe-12 text-sm shadow-sm  focus:border-green-500 focus:ring-green-500"
            placeholder="Password"
          />

          <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-zinc-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
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

      <div className="flex items-center justify-center">
        <button
          type="submit"
          className="inline-block rounded-lg bg-zinc-950 px-32 md:px-48 py-3 text-sm font-medium text-zinc-50 hover:bg-green-700">
          Continue
        </button>
      </div>
    </form>
  )
}
