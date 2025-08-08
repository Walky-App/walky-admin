import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../API'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [isHovered, setIsHovered] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await API.post('/forgot-password', { email })
      setSubmitted(true)
      navigate('/verify-code', { state: { email } })
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(message || 'Something went wrong. Please try again.')
    }  
  }

  return (
    <div
      data-testid="forgot-password-page"
      style={{
        height: '100vh',
        width: '100vw',
        backgroundColor: '#1c1e26',
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
      }}
    >
      <div style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <img
            src="/Walky Logo_Duotone.svg"
            alt="Walky Logo"
            style={{ width: '120px' }}
          />
        </div>

        <h2 style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: '1rem' }} data-testid="forgot-password-heading">
          Forgot your password?
        </h2>

        {submitted ? (
          <div
            data-testid="forgot-password-success-message"
            style={{
              backgroundColor: '#1e293b',
              padding: '1rem',
              borderRadius: '8px',
              color: '#22c55e',
              fontWeight: 500,
            }}
          >
            If your email is registered, you’ll receive reset instructions shortly.
          </div>
        ) : (
          <form onSubmit={handleSubmit} data-testid="forgot-password-form">
            <div style={{ textAlign: 'left', marginBottom: '1rem' }}>
              <label className="form-label">Email address</label>
              <input
                data-testid="forgot-password-email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="form-control"
              />
            </div>

            {error && (
              <p
                data-testid="forgot-password-error"
                style={{
                  color: 'salmon',
                  textAlign: 'center',
                  marginTop: '1rem',
                  fontWeight: 500,
                }}
              >
                {error}
              </p>
            )}


            <button
              data-testid="forgot-password-submit-button"
              type="submit"
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
                fontWeight: 600,
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                backgroundColor: isActive
                  ? '#5856D5'
                  : isHovered
                  ? '#5b54f6'
                  : '#6366f1',
                transition: 'background-color 0.2s ease',
                marginBottom: '1rem',
              }}
            >
              Send Reset Link
            </button>

            <button
              data-testid="forgot-password-back-button"
              type="button"
              onClick={() => navigate('/login')}
              style={{
                display: 'block',
                margin: '0 auto',
                color: '#94a3b8',
                textDecoration: 'underline',
                fontSize: '0.95rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Back to login
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default ForgotPassword
