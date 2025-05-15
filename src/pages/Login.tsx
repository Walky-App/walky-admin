import { useNavigate, Link } from 'react-router-dom' 

type LoginProps = {
  onLogin: () => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const navigate = useNavigate()

  const handleLogin = () => {
    onLogin()
    navigate('/')
  }

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Login Page</h2>
      <button onClick={handleLogin} style={{
        padding: '0.75rem 1.5rem',
        fontSize: '1rem',
        borderRadius: '12px',
        backgroundColor: '#1e1e1e',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        margin: '1rem 0'
      }}>
        Log In
      </button>
      <p>Don’t have an account? <Link to="/create-account" style={{ color: '#6366f1' }}>Create one</Link></p>
    </div>
  )
}

export default Login
