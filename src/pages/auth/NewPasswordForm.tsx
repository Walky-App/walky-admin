import { useState, useRef } from 'react'

import { useParams, useNavigate } from 'react-router-dom'

import { Password } from 'primereact/password'
import { Toast } from 'primereact/toast'

import { requestService } from '../../services/requestServiceNew'

export const NewPasswordForm = () => {
  const { id, at } = useParams()
  const [form, setForm] = useState({ _id: id, access_token: at, password: '', password_confirmed: '' })
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)
  const [btnDisabled, setBtnDisabled] = useState(false)
  const toast = useRef<Toast>(null)

  const show = (message: string) => {
    toast.current?.show({ severity: 'error', summary: 'Email not found', detail: message })
  }

  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await requestService({ path: 'auth/new', method: 'POST', body: JSON.stringify(form) })
      const data = await response.json()

      if (response.ok) {
        setBtnDisabled(true)
        setError(undefined)
        setLoading(false)
        toast.current?.show({
          severity: 'success',
          summary: 'New Password Updated 👍',
          detail: data.message,
        })
        setTimeout(() => {
          navigate('/login')
        }, 5000)

        return
      } else {
        show(data.message)
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
      <form onSubmit={handleSubmit} className="mx-auto mb-0 max-w-md space-y-4">
        <div className="text-center">
          <img src="/assets/logos/logo-horizontal-cropped.png" alt="hemp temps logo" height={300} />
          <h1 className="text-2xl">PASSWORD RESET</h1>
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
              iconField: { root: { className: 'w-full' } },
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
              iconField: { root: { className: 'w-full' } },
            }}
            className="mt-5 w-full"
          />
          <Toast ref={toast} position="bottom-right" />

          {error ? (
            <div className="mt-3 flex items-center justify-center">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={btnDisabled}
          className={`w-full rounded-lg bg-green-700 py-3 text-sm font-medium text-zinc-50 hover:bg-green-600 ${
            loading && 'cursor-wait hover:bg-zinc-950'
          }`}>
          {loading ? 'Updating password...' : 'Reset Password'}
        </button>
      </form>
    </div>
  )
}
