import { useState, useRef, useEffect } from 'react'

import { useNavigate, useParams } from 'react-router-dom'

import { Button } from 'primereact/button'
import { type CheckboxChangeEvent } from 'primereact/checkbox'
import { Checkbox } from 'primereact/checkbox'
import { InputMask, type InputMaskChangeEvent } from 'primereact/inputmask'
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { Toast } from 'primereact/toast'

import { HtInputHelpText } from '../../components/shared/forms/HtInputHelpText'
import { type ISignupData } from '../../interfaces/loginData'
import { requestService } from '../../services/requestServiceNew'
import { type INotificationPreference } from '../../utils/formOptions'
import { SignupDialog } from './SignupDialog'

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
    notifications: [],
    terms: { is_accepted: false, accepted_at: new Date(), ip_address: '' },
    role: employee_role,
  })
  const [visible, setVisible] = useState(true)

  const [loading, setLoading] = useState(false)
  const toast = useRef<Toast>(null)

  const show = ({ message, severity, summary }: IShowToast) => {
    toast.current?.show({ severity: severity, summary: summary, detail: message })
  }

  const { email, role } = useParams()

  useEffect(() => {
    if (email != null && role != null) {
      setFormData(prevState => ({ ...prevState, email: email, role: role }))
    }
  }, [email, role])

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

  const handleApprovedTerms = (e: CheckboxChangeEvent) => {
    setFormData({
      ...formData,
      terms: {
        is_accepted: e.checked !== null ? e.checked : false,
      },
    })
  }

  const handleNotificationPreferenceChange = (e: CheckboxChangeEvent, type: INotificationPreference) => {
    if (e.checked ?? false) {
      setFormData(prevState => ({
        ...prevState,
        notifications: [...prevState.notifications, type],
      }))
    } else {
      setFormData(prevState => ({
        ...prevState,
        notifications: prevState.notifications.filter(pref => pref !== type),
      }))
    }
  }
  const handleOnSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await requestService({ path: 'auth', method: 'POST', body: JSON.stringify(formData) })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message ?? 'An error occurred. Please try again.')
      }

      if (response.status === 201) {
        navigate('/otp/' + data.user._id)
        show({ message: 'Account created successfully', severity: 'success', summary: 'Success' })
      } else {
        show({ message: data.message, severity: 'error', summary: 'Error' })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.'
      show({ message: errorMessage, severity: 'error', summary: 'Error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center">
      <form onSubmit={handleOnSubmit} className="mx-auto px-8 md:max-w-md">
        <div className="bg-white px-6 py-6 sm:py-8 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-base font-semibold leading-7 text-green-600">
              Sign Up Now and Get the Support You Deserve!
            </p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Signup Today!</h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Connect and Thrive: Your Premier Hub for Cannabis Industry Temp Jobs
            </p>
          </div>
        </div>
        <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <InputText
            required
            type="text"
            name="first_name"
            onChange={handleFormOnChange}
            className="w-full rounded-lg border-zinc-200 p-4 shadow-sm  focus:border-green-500 focus:ring-green-500"
            placeholder="*First Name"
            autoComplete="off"
          />
          <InputText
            required
            name="last_name"
            type="text"
            onChange={e => setFormData({ ...formData, last_name: e.target.value })}
            className="w-full rounded-lg border-zinc-200 p-4 shadow-sm  focus:border-green-500 focus:ring-green-500"
            placeholder="*Last Name"
            autoComplete="off"
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
            autoComplete="off"
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
            autoComplete="off"
            pt={{
              root: {
                className:
                  'w-full rounded-lg border-zinc-200 p-4 shadow-sm focus:border-green-500 focus:ring-green-500',
              },
            }}
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
            autoComplete="off"
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
            autoComplete="off"
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
            className="mt-5 w-full"
          />
          <div className="my-6 flex flex-col space-y-2 text-sm text-zinc-500">
            <span>Please choose notifications you would like to receive:</span>
            <div>
              <Checkbox
                inputId="email_notifications"
                name="notifications.email"
                onChange={e => handleNotificationPreferenceChange(e, 'notification_email')}
                checked={formData.notifications.includes('notification_email')}
              />
              <label htmlFor="email_notifications" className="ml-2">
                Email
              </label>
            </div>
            <div>
              <Checkbox
                inputId="sms_notifications"
                name="notifications.sms"
                onChange={e => handleNotificationPreferenceChange(e, 'notification_sms')}
                checked={formData.notifications.includes('notification_sms')}
              />
              <label htmlFor="sms_notifications" className="ml-2">
                SMS
              </label>
            </div>
          </div>
          <div className="my-4 text-sm text-zinc-500">
            <Checkbox
              required
              inputId="terms"
              name="terms.is_accepted"
              value={formData.terms}
              onChange={handleApprovedTerms}
              checked={formData.terms.is_accepted || false}
            />
            <a href="https://hemptemps.com/terms-and-conditions/" target="_blank" className="ml-2 underline">
              Accept Terms & Conditions
            </a>
          </div>

          <Toast ref={toast} position="bottom-right" />
        </div>
        <div className="flex items-center justify-center">
          <div className="text-center">
            <Button
              label="EMPLOYEE Signup"
              disabled={loading}
              type="submit"
              onClick={() => setFormData({ ...formData, role: employee_role })}
              className={`mr-3 w-full text-sm md:text-lg ${loading && 'cursor-wait hover:bg-zinc-950'}`}
            />
            <HtInputHelpText helpText="I want to work!" className="text-gray-600" fieldName="" />
          </div>
          <div className="ml-2 text-center">
            <Button
              label="EMPLOYER Signup"
              disabled={loading}
              severity="secondary"
              type="submit"
              onClick={() => setFormData({ ...formData, role: client_role })}
              className={`w-full text-sm md:text-lg ${loading && 'cursor-wait hover:bg-zinc-950'}`}
            />
            <HtInputHelpText helpText="I want to hire workers!" className="text-gray-600" fieldName="" />
          </div>
        </div>
      </form>
      <SignupDialog visible={visible} setVisible={setVisible} />
    </div>
  )
}
