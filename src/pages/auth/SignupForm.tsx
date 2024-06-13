import { useState, useRef } from 'react'

import { useNavigate, useParams } from 'react-router-dom'

import { Button } from 'primereact/button'
import { InputMask, type InputMaskChangeEvent } from 'primereact/inputmask'
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { Toast } from 'primereact/toast'

import { type ISignupData } from '../../interfaces/loginData'
import { requestService } from '../../services/requestServiceNew'

const client_role = process.env.REACT_APP_CLIENT_ROLE as string
const employee_role = process.env.REACT_APP_EMPLOYEE_ROLE as string

interface IShowToast {
  message: string
  severity: 'success' | 'info' | 'warn' | 'error' | undefined
  summary: string
}

export const Signup = () => {
  const [formData, setFormData] = useState<ISignupData>({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    password: '',
    password_confirmed: '',
    role: employee_role,
  })
  const [loading, setLoading] = useState(false)
  const toast = useRef<Toast>(null)

  const show = ({ message, severity, summary }: IShowToast) => {
    toast.current?.show({ severity: severity, summary: summary, detail: message })
  }

  const { email, role } = useParams()

  if (role !== undefined && email !== undefined) {
    setFormData({ ...formData, role: role })
  }
  const navigate = useNavigate()

  const handleFormOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFormUpdateNumber = (e: InputMaskChangeEvent) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleOnSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await requestService({ path: 'auth', method: 'POST', body: JSON.stringify(formData) })
      if (response.ok) {
        const data = await response.json()

        if (response.status === 201) {
          navigate('/otp/' + data.user._id)
          show({ message: 'Account created successfully', severity: 'success', summary: 'Success' })
          setLoading(false)
        } else {
          show({ message: data.message, severity: 'error', summary: 'Error' })
          setLoading(false)
        }
      }
    } catch (error) {
      show({ message: 'An error occurred. Please try again.' + error, severity: 'error', summary: 'Error' })
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <form onSubmit={handleOnSubmit} className="mx-auto max-w-md">
        <div className="flex justify-center">
          <img src="/assets/logos/logo-horizontal-cropped.png" alt="hemp temps logo" width={400} />
        </div>
        <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <InputText
            required
            type="text"
            name="first_name"
            onChange={handleFormOnChange}
            className="w-full rounded-lg border-zinc-200 p-4 shadow-sm  focus:border-green-500 focus:ring-green-500"
            placeholder="*First Name"
          />
          <InputText
            required
            name="last_name"
            type="text"
            onChange={e => setFormData({ ...formData, last_name: e.target.value })}
            className="w-full rounded-lg border-zinc-200 p-4 shadow-sm  focus:border-green-500 focus:ring-green-500"
            placeholder="*Last Name"
          />
        </div>
        <div className="relative mb-5">
          <InputText
            required
            disabled={email ? true : false}
            defaultValue={email}
            type="email"
            name="email"
            onChange={handleFormOnChange}
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
          <InputMask
            required
            name="phone_number"
            mask="(999) 999-9999"
            onChange={handleFormUpdateNumber}
            placeholder="(561) 999-9999"
            className="w-full"
          />
        </div>
        <div>
          <Password
            required
            name="password"
            inputId="password"
            placeholder="*Password"
            toggleMask
            onChange={handleFormOnChange}
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
          <Password
            required
            name="password_confirmed"
            inputId="password_confirmed"
            placeholder="*Password confirmed"
            toggleMask
            onChange={handleFormOnChange}
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
          <Toast ref={toast} position="bottom-right" />
        </div>
        <div className="flex items-center justify-center">
          <Button
            label={loading ? 'Signing up' : 'Employee Signup'}
            type="submit"
            onClick={() => setFormData({ ...formData, role: employee_role })}
            className={`mr-3 w-full ${loading && 'cursor-wait hover:bg-zinc-950'}`}
          />
          <Button
            label={loading ? 'Signing up' : 'Client Signup'}
            type="submit"
            onClick={() => setFormData({ ...formData, role: client_role })}
            className={`w-full ${loading && 'cursor-wait hover:bg-zinc-950'}`}
          />
        </div>
      </form>
    </div>
  )
}
