import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const CreateAccount = () => {
  console.log("✅ CreateAccount component rendered");

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = () => {
    console.log("Signing up with:", { email, password });
    
  };

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
        textAlign: 'center',
        overflowY: 'auto',
      }}
    >
      {/* Logo */}
      <div style={{ marginTop: '2rem' }}>
        <img
          src="/walky-logo.png"
          alt="Walky Logo"
          style={{ width: '120px', marginBottom: '1rem' }}
        />
      </div>

      <h2>Create your admin account</h2>

      {/* Form */}
      <div style={{ textAlign: 'left', width: '100%', maxWidth: '400px', marginTop: '2rem' }}>
        {/* Email Field */}
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

        {/* Password Field */}
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
        <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              paddingRight: '3rem',
              borderRadius: '10px',
              border: '1px solid #555',
              backgroundColor: '#1c1e26',
              color: 'white',
              fontSize: '1rem',
            }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            title={showPassword ? 'Hide password' : 'Show password'}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            style={{
              position: 'absolute',
              right: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              padding: 0,
              margin: 0,
              cursor: 'pointer',
              color: '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleSignUp}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#6366f1',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginBottom: '1rem',
          }}
        >
          Continue
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#334155' }}></div>
          <span style={{ margin: '0 0.75rem', color: '#94a3b8', fontSize: '0.85rem' }}>or</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#334155' }}></div>
        </div>

        {/* Google Sign-On */}
        <button
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#1e293b',
            color: '#cbd5e1',
            border: '1px solid #475569',
            borderRadius: '10px',
            fontSize: '1rem',
            marginBottom: '1rem',
            cursor: 'pointer',
          }}
        >
          Sign on with Google
        </button>

        {/* Terms */}
        <p
          style={{
            fontSize: '0.8rem',
            color: '#94a3b8',
            textAlign: 'center',
            lineHeight: '1.5',
            marginTop: '1rem',
            whiteSpace: 'nowrap',
            maxWidth: '100%',
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          By creating an account, you agree to the&nbsp;
          <a href="#" style={{ color: 'white', textDecoration: 'underline' }}>
            Terms of Service
          </a>
          &nbsp;and&nbsp;
          <a href="#" style={{ color: 'white', textDecoration: 'underline' }}>
            Privacy Policy
          </a>.
        </p>

        {/* Sign In Link */}
        <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#94a3b8', textAlign: 'center' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#3b82f6', textDecoration: 'underline' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CreateAccount;
