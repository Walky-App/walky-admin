import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import API from '../API'

const VerifyCode = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const emailFromState = location.state?.email || ''

  const [email, setEmail] = useState(emailFromState)
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState<'verify' | 'reset'>('verify')
  const [error, setError] = useState('')
  const [isHovered, setIsHovered] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)


  const handleVerify = async () => {
    setError('')

    console.log('🔐 Verifying with:', { email, otp: Number(otp) })

    try {
      const res = await API.post('/verify', {
        otp: Number(otp),
        email,
      })

      if (res && res.data) {
        setStep('reset')
      }
    } catch {
      setError('Invalid code or email.')
    }
  }

  const handleResetPassword = async () => {
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    try {
      await API.post('/reset-password', {
        email,
        password,
        password_confirmed: confirmPassword,
        otp: Number(otp),
      })

      navigate('/login')
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('❌ Reset failed:', err.message)
      }
      setError('Could not reset password. Try again or request a new code.')
    }    
  }

  const handleResendCode = async () => {
    if (resendCooldown > 0) return
  
    try {
      await API.post('/forgot-password', { email })
      setError('A new verification code was sent to your email.')
      setResendCooldown(30)
  
      // Start cooldown countdown
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(message || 'Failed to resend code. Please try again.')
    }
  }
  

  return (
    <div
      data-testid="verify-code-page"
      style={{
        backgroundColor: '#1c1e26',
        color: 'white',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <div style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <img src="/Walky Logo_Duotone.svg" alt="Walky Logo" style={{ width: '120px' }} />
        </div>

        <h2 style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: '1rem' }} data-testid="verify-code-heading">
          {step === 'verify' ? 'Enter Verification Code' : 'Reset Your Password'}
        </h2>

        <div style={{ textAlign: 'left' }} data-testid="verify-code-instructions">
          {step === 'verify' ? (
            <>
              <label className="form-label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control mb-3"
                placeholder="Email address"
              />

              <label className="form-label">Verification Code</label>
              <input
                data-testid="verify-code-input"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="form-control mb-3"
                placeholder="Enter the code"
              />

              <button
                data-testid="verify-code-submit-button"
                onClick={handleVerify}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => {
                  setIsHovered(false)
                  setIsActive(false)
                }}
                onMouseDown={() => setIsActive(true)}
                onMouseUp={() => setIsActive(false)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '1rem',
                  borderRadius: '10px',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: isActive
                    ? '#5856D5'
                    : isHovered
                    ? '#5b54f6'
                    : '#6366f1',
                  transition: 'background-color 0.2s ease',
                }}
              >
                Verify Code
              </button>
            </>
          ) : (
            <>
              <label className="form-label">New Password</label>
              <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
                <input
                  data-testid="new-password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                  placeholder="Enter new password"
                />
                <div
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: '0.75rem',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer',
                    color: '#94a3b8',
                  }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </div>
              </div>

              <label className="form-label">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-control mb-4"
                placeholder="Confirm password"
              />

              <button
                data-testid="verify-reset-submit-button"
                onClick={handleResetPassword}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => {
                  setIsHovered(false)
                  setIsActive(false)
                }}
                onMouseDown={() => setIsActive(true)}
                onMouseUp={() => setIsActive(false)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '1rem',
                  borderRadius: '10px',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: isActive
                    ? '#5856D5'
                    : isHovered
                    ? '#5b54f6'
                    : '#6366f1',
                  transition: 'background-color 0.2s ease',
                }}
              >
                Reset Password
              </button>
            </>
          )}
        </div>

        {error && (
          <p style={{ marginTop: '1rem', color: 'salmon', textAlign: 'center' }}>{error}</p>
        )}

{step === 'verify' && (
  <button
    data-testid="verify-code-resend-button"
    type="button"
    onClick={handleResendCode}
    disabled={resendCooldown > 0}
    style={{
      marginTop: '1rem',
      background: 'none',
      border: 'none',
      color: resendCooldown > 0 ? '#64748b' : '#94a3b8',
      textDecoration: 'underline',
      cursor: resendCooldown > 0 ? 'not-allowed' : 'pointer',
      fontSize: '0.95rem',
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto',
    }}
  >
    {resendCooldown > 0
      ? `Resend available in ${resendCooldown}s`
      : 'Resend verification code'}
  </button>
)}

      </div>
    </div>
  )
}

export default VerifyCode
