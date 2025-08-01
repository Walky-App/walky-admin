import React from "react";
import { Eye, EyeOff } from "lucide-react";

interface AuthInputProps {
  label: string;
  type: "email" | "password" | "text";
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  hasError?: boolean;
  errorMessage?: string;
  testId: string;
}

const AuthInput: React.FC<AuthInputProps> = ({
  label,
  type,
  value,
  onChange,
  placeholder,
  hasError = false,
  errorMessage = "Invalid input",
  testId,
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const isPassword = type === "password";
  
  const inputType = isPassword 
    ? (showPassword ? "text" : "password") 
    : type;

  return (
    <>
      <label style={{ display: "block", marginBottom: "0.5rem" }}>
        {label}
      </label>
      <div style={{ position: "relative", marginBottom: "1.25rem" }}>
        <input
          data-testid={testId}
          type={inputType}
          value={value}
          onChange={onChange}
          className={`form-control ${hasError ? "is-invalid" : ""}`}
          placeholder={placeholder}
        />
        {hasError && (
          <div className="invalid-feedback">{errorMessage}</div>
        )}

        {isPassword && (
          <div
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              top: hasError ? "30%" : "50%",
              right: hasError ? "2.25rem" : "0.75rem",
              transform: "translateY(-50%)",
              cursor: "pointer",
              color: "#94a3b8",
              zIndex: 2,
            }}
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
          </div>
        )}
      </div>
    </>
  );
};

export default AuthInput;
