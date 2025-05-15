
import { useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
//login page
type LoginProps = {
  onLogin: () => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = () => {
    console.log('Logging in with:', { email, password })
    onLogin()
    navigate('/')
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#1c1e26',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: 'white',
        zIndex: 999,
        padding: '2rem 1rem',
        boxSizing: 'border-box',
      }}
    >
      {/* Top: Logo */}
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <img
          src="/walky-logo.png"
          alt="Walky Logo"
          style={{ width: '120px', marginBottom: '1rem' }}
        />
      </div>

      {/* Middle: Sign in + link + form */}
      <div style={{ textAlign: 'center', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: '0.5rem' }}>
          Sign in
        </h2>
        <p style={{ fontSize: '0.95rem', color: '#94a3b8', marginBottom: '1.5rem' }}>
          or{' '}
          <Link
            to="/create-account"
            style={{ color: '#3b82f6', textDecoration: 'underline' }}
          >
            create an account
          </Link>
        </p>

        <div style={{ textAlign: 'left', width: '100%' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              marginBottom: '1.25rem',
              borderRadius: '10px',
              border: '1px solid #555',
              backgroundColor: '#1c1e26',
              color: 'white',
              fontSize: '1rem',
            }}
          />

          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
          <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                paddingRight: '2.5rem',
                borderRadius: '10px',
                border: '1px solid #555',
                backgroundColor: '#1c1e26',
                color: 'white',
                fontSize: '1rem',
              }}
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
        </div>

        {/* Continue button */}
        <button
          onClick={handleLogin}
          style={{
            width: '100%',
            padding: '0.75rem',
            fontSize: '1rem',
            borderRadius: '10px',
            backgroundColor: '#6366f1',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            marginBottom: '1.25rem',
          }}
        >
          Continue
        </button>

        {/* Divider */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem',
          }}
        >
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #555' }} />
          <span style={{ margin: '0 1rem', color: '#aaa' }}>or</span>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #555' }} />
        </div>

        {/* Google Sign-In button */}
        <button
          style={{
            width: '100%',
            padding: '0.75rem',
            fontSize: '1rem',
            borderRadius: '10px',
            backgroundColor: 'transparent',
            border: '1px solid #555',
            color: '#e2e8f0',
            cursor: 'pointer',
          }}
        >
          Sign on with Google
        </button>
      </div>
    </div>
  )
}

export default Login

