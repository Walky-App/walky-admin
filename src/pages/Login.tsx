import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { apiClient } from "../API";

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
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setLoginError(true);
      return;
    }

    try {
      const response = await apiClient.api.loginCreate({
        email,
        password,
      }) as any;

      const token = response?.data?.access_token;
      const userData = response?.data;

      if (!token) {
        throw new Error("Token not found in response.");
      }

      // Validate user role - only allow admin roles
      const adminRoles = [
        "super_admin",
        "campus_admin",
        "editor",
        "moderator",
        "staff",
        "viewer",
      ];
      const userRole = userData?.role;

      if (!userRole || !adminRoles.includes(userRole)) {
        setLoginError(true);
        console.warn(
          `❌ Access denied: User role "${userRole}" is not authorized for admin panel`
        );
        return;
      }

      // Store token and user data in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          _id: userData._id,
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          role: userData.role,
          avatar_url: userData.avatar_url,
          campus_id: userData.campus_id,
          school_id: userData.school_id,
        })
      );

      onLogin();
      navigate("/");
       
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
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setLoginError(false); // 👈 reset error on typing
              }}
              className={`form-control ${loginError ? "is-invalid" : ""}`}
              placeholder="Email address"
            />
            {loginError && (
              <div className="invalid-feedback">Invalid email or password.</div>
            )}

            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              Password
            </label>
            <div style={{ position: "relative", marginBottom: "1.25rem" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setLoginError(false); // 👈 reset error on typing
                }}
                className={`form-control ${loginError ? "is-invalid" : ""}`}
                placeholder="********"
              />
              {loginError && (
                <div className="invalid-feedback">
                  Invalid email or password.
                </div>
              )}

              <div
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  top: loginError ? "30%" : "50%",
                  right: loginError ? "2.25rem" : "0.75rem", // 👈 shift left if error
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#94a3b8",
                  zIndex: 2, // make sure it's on top
                }}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </div>
            </div>
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
