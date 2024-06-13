import { useState, useRef, useEffect } from 'react'

import { useNavigate, useParams } from 'react-router-dom'

import { Button } from 'primereact/button'
import { InputMask, type InputMaskChangeEvent } from 'primereact/inputmask'
import { Toast } from 'primereact/toast'

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

interface IShowToast {
  message: string
  severity: 'success' | 'info' | 'warn' | 'error' | undefined
  summary: string
}

export const Otp = () => {
  const [otp, setOtp] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const { setUser } = useAuth()
  const { setAvatarImageUrl } = useUtils()
  const toast = useRef<Toast>(null)

  const navigate = useNavigate()

  const { id } = useParams()

  const show = ({ message, severity, summary }: IShowToast) => {
    toast.current?.show({ severity: severity, summary: summary, detail: message })
  }

  useEffect(() => {
    const fetchNewUser = async () => {
      const response = await requestService({ path: `auth/otp/${id}`, method: 'GET' })
      if (response.ok) {
        const jsonResponse = await response.json()
        setOtp(jsonResponse.otp)
      } else {
        const jsonResponse = await response.json()
        show({ message: jsonResponse.message, severity: 'error', summary: 'Error' })
      }
    }
    fetchNewUser()
  }, [id])

  const handleOtpVerification = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await requestService({
        path: 'auth/verify',
        method: 'POST',
        body: JSON.stringify({ otp: otp, id: id }),
      })

      if (response.ok) {
        const jsonResponse = await response.json()

        if (jsonResponse.access_token && jsonResponse.user) {
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

  const handleFormUpdateNumber = (e: InputMaskChangeEvent) => {
    const { value } = e.target ?? ''
    if (value !== undefined && value !== null) setOtp(parseInt(value.replace(/-/g, ''), 10))
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <form onSubmit={handleOtpVerification} className="mx-auto max-w-md">
        <div className="flex justify-center">
          <img src="/assets/logos/logo-horizontal-cropped.png" alt="hemp temps logo" width={400} />
        </div>
        <Toast ref={toast} position="bottom-right" />

        <div className="relative my-5">
          <InputMask
            required
            name="otp"
            mask="999-9-999"
            onChange={e => handleFormUpdateNumber(e)}
            placeholder="999-9-999"
            className="w-full"
          />
        </div>

        <div className="flex items-center justify-center">
          <Button
            disabled={loading}
            label="Verify Account"
            type="submit"
            className={`w-full ${loading && 'cursor-wait hover:bg-zinc-950'}`}
          />
        </div>
      </form>
    </div>
  )
}
