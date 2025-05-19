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

          <div
            style={{ textAlign: "left", marginBottom: "1rem", marginTop: "-1rem" }}
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

          {/* 👇 Added hyperlink to create account */}
          <div style={{ marginTop: "0.5rem" }}>
            <span style={{ color: "#cbd5e1", fontSize: "0.9rem" }}>
              Don’t have an account?{" "}
              <Link
                to="/create-account"
                style={{ color: "#3b82f6", textDecoration: "underline" }}
              >
                Create one
              </Link>
            </span>
          </div>
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
          src="/Container.png"
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
