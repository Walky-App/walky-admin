import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import API from "../API";
import AuthInput from "../components/AuthInput";

//login page
type LoginProps = {
  onLogin: () => void;
};

const Login = ({ onLogin }: LoginProps) => {
  const navigate = useNavigate();

  const [isContinueHovered, setIsContinueHovered] = useState(false);
  const [isContinueActive, setIsContinueActive] = useState(false);
  const [loginError, setLoginError] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setLoginError(true);
      return;
    }

    try {
      const response = await API.post("/login", {
        email,
        password,
      });

      const token = response?.data?.access_token;

      if (token) {
        // Store token in localStorage
        localStorage.setItem("token", token);
        onLogin();
        navigate("/");
      } else {
        throw new Error("Token not found in response.");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(
        "❌ Login failed:",
        error?.response?.data || error.message || error
      );
      setLoginError(true);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
      }}
    >
      <div
        style={{
          flex: 1,
          backgroundColor: "#1c1e26",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          padding: "2rem",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <img
            src="/Walky Logo_Duotone.svg"
            alt="Walky Logo"
            style={{ width: "120px" }}
          />
        </div>

        {/* Sign in form */}
        <div style={{ width: "100%", maxWidth: "400px", textAlign: "center" }}>
          <h2
            style={{
              fontSize: "1.75rem",
              fontWeight: 600,
              marginBottom: "0.5rem",
            }}
          >
            Sign in
          </h2>

          <div style={{ textAlign: "left", width: "100%" }}>
            <AuthInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setLoginError(false); // reset error on typing
              }}
              placeholder="Email address"
              hasError={loginError}
              errorMessage="Invalid email or password."
              testId="email-input"
            />

            <AuthInput
              label="Password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setLoginError(false); // reset error on typing
              }}
              placeholder="********"
              hasError={loginError}
              errorMessage="Invalid email or password."
              testId="password-input"
            />
          </div>

          <div
            style={{
              textAlign: "left",
              marginBottom: "1rem",
              marginTop: "-1rem",
            }}
          >
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

          <button
            data-testid="continue-button"
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
                ? "#5856D5"
                : isContinueHovered
                ? "#5b54f6"
                : "#6366f1",
              transition: "background-color 0.2s ease",
            }}
          >
            Continue
          </button>
        </div>
      </div>
      <div
        style={{
          flex: 1,
          backgroundColor: "#f9fafb",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem",
        }}
      >
        <img
          src="/Heroscreen.png"
          alt="Welcome Visual"
          style={{
            maxWidth: "90%",
            maxHeight: "90%",
            borderRadius: "1rem",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          }}
        />
      </div>
    </div>
  );
};

export default Login;
