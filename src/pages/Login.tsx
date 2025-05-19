import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
//login page
type LoginProps = {
  onLogin: () => void;
};

const Login = ({ onLogin }: LoginProps) => {
  const navigate = useNavigate();

  const [isContinueHovered, setIsContinueHovered] = useState(false);
  const [isContinueActive, setIsContinueActive] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    console.log("Logging in with:", { email, password });
    onLogin();
    navigate("/");
  };
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#1c1e26",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        color: "white",
        zIndex: 999,
        padding: "2rem 1rem",
        boxSizing: "border-box",
      }}
    >
      {/* Top: Logo */}
      <div style={{ marginTop: "9rem", textAlign: "center" }}>
        <img
          src="/Walky Logo_Duotone.svg"
          alt="Walky Logo"
          style={{ width: "120px", marginBottom: "1rem" }}
        />
      </div>

      {/* Middle: Sign in + link + form */}
      <div style={{ textAlign: "center", width: "100%", maxWidth: "400px" }}>
        <h2
          style={{
            fontSize: "1.75rem",
            fontWeight: 600,
            marginBottom: "0.5rem",
          }}
        >
          Sign in
        </h2>
        {/* <p style={{ fontSize: '0.95rem', color: '#94a3b8', marginBottom: '1.5rem' }}>
          or{' '}
          <Link
            to="/create-account"
            style={{ color: '#3b82f6', textDecoration: 'underline' }}
          >
            create an account
          </Link>
        </p> */}

        <div style={{ textAlign: "left", width: "100%" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Email
          </label>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem",
              marginBottom: "1.25rem",
              borderRadius: "10px",
              border: "1px solid #555",
              backgroundColor: "#1c1e26",
              color: "white",
              fontSize: "1rem",
            }}
          />

          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Password
          </label>
          <div style={{ position: "relative", marginBottom: "1.25rem" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                paddingRight: "2.5rem",
                borderRadius: "10px",
                border: "1px solid #555",
                backgroundColor: "#1c1e26",
                color: "white",
                fontSize: "1rem",
              }}
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                top: "50%",
                right: "0.75rem",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#94a3b8",
              }}
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </div>
          </div>
        </div>
        <div style={{ textAlign: "left", marginBottom: "1rem", marginTop: "-1rem" }}>
          <Link
            to="/forgot-password"
            style={{
              color: "#74787F",
              fontSize: "0.9rem",
            }}
          >
            Forgot Password
          </Link>
        </div>

        {/* Continue button */}
        <button
          onClick={handleLogin}
          onMouseEnter={() => setIsContinueHovered(true)}
          onMouseLeave={() => {
            setIsContinueHovered(false);
            setIsContinueActive(false);
          }}
          onMouseDown={() => setIsContinueActive(true)}
          onMouseUp={() => setIsContinueActive(false)}
          style={{
            width: "100%",
            padding: "0.75rem",
            fontSize: "1rem",
            borderRadius: "10px",
            color: "white",
            border: "none",
            cursor: "pointer",
            marginBottom: "1.25rem",
            backgroundColor: isContinueActive
              ? "#5856D5" // Darker when clicked
              : isContinueHovered
              ? "#5b54f6" // Slightly darker on hover
              : "#6366f1", // Light default purple
            transition: "background-color 0.2s ease",
          }}
        >
          Continue
        </button>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1.25rem",
          }}
        >
          {/* <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #555' }} />
          <span style={{ margin: '0 1rem', color: '#aaa' }}>or</span>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #555' }} /> */}
        </div>

        {/* Google Sign-In button
        <button
        onClick={() => console.log("Google button clicked")}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsActive(false);
        }}
        onMouseDown={() => setIsActive(true)}
        onMouseUp={() => setIsActive(false)}
          style={{
            width: '100%',
            padding: '0.75rem',
            fontSize: '1rem',
            borderRadius: '10px',
            border: '1px solid #555',
            color: '#e2e8f0',
            cursor: 'pointer',
            backgroundColor: isActive
              ? "#374151" // Darker when clicked
              : isHovered
              ? "#3f4957" // Slightly darker on hover
              : "transparent", // Default transparent
            transition: "background-color 0.2s ease",
          }}
        >
          Sign on with Google
        </button> */}
      </div>
    </div>
  );
};

export default Login;
