import { useNavigate } from 'react-router-dom'

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
    <div style={{ padding: '2rem' }}>
      <h2>Login Page</h2>
      <button onClick={handleLogin}>Log In</button>
    </div>
  )
}

export default Login
