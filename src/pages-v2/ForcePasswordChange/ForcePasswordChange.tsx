import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AssetIcon from "../../components-v2/AssetIcon/AssetIcon";
import AssetImage from "../../components-v2/AssetImage/AssetImage";
import { apiClient } from "../../API";
import toast from "react-hot-toast";
import "./ForcePasswordChange.css";

const ForcePasswordChange: React.FC = () => {
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isChecking, setIsChecking] = useState(true);

    // Check authentication and password reset requirement on mount
    useEffect(() => {
        const token = localStorage.getItem("token");
        const userStr = localStorage.getItem("user");

        if (!token || !userStr) {
            // Not authenticated, redirect to login
            navigate("/login", { replace: true });
            return;
        }

        try {
            const user = JSON.parse(userStr);
            if (!user.require_password_change) {
                // Doesn't need password change, redirect to home
                navigate("/", { replace: true });
                return;
            }
        } catch {
            // Invalid user data, redirect to login
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login", { replace: true });
            return;
        }

        setIsChecking(false);
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters");
            setIsLoading(false);
            return;
        }

        try {
            await apiClient.api.adminV2SettingsPasswordUpdate({
                currentPassword: "", // Not required for forced reset
                newPassword: newPassword,
            });

            toast.success("Password updated successfully");

            // Update local user data to remove the flag
            const userStr = localStorage.getItem("user");
            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    user.require_password_change = false;
                    localStorage.setItem("user", JSON.stringify(user));
                } catch (e) {
                    console.error("Failed to update local user data", e);
                }
            }

            // Force reload to ensure all app state (like auth hooks) is fresh
            window.location.href = "/";
        } catch (err: any) {
            console.error("Password update failed:", err);
            setError(err?.response?.data?.message || "Failed to update password.");
        } finally {
            setIsLoading(false);
        }
    };

    // Show nothing while checking authentication
    if (isChecking) {
        return null;
    }

    return (
        <main
            className="force-password-change"
            data-testid="force-password-change-page"
        >
            <div className="login-container">
                <div className="login-form-wrapper">
                    <div className="login-logo">
                        <AssetIcon name="logo-walky-white" />
                    </div>

                    <form className="login-form" onSubmit={handleSubmit} data-testid="force-password-change-form">
                        <div className="form-header">
                            <h2>Set New Password</h2>
                            <p>For security, please create a new password for your account.</p>
                        </div>

                        {error && (
                            <div className="error-message" style={{ color: "red", marginBottom: "1rem" }}>
                                {error}
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="newPassword">New Password</label>
                            <input
                                id="newPassword"
                                type="password"
                                className="form-input"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                minLength={8}
                                data-testid="new-password-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                id="confirmPassword"
                                type="password"
                                className="form-input"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={8}
                                data-testid="confirm-password-input"
                            />
                        </div>

                        <button
                            type="submit"
                            className="submit-button"
                            disabled={isLoading}
                            data-testid="force-password-change-submit-btn"
                        >
                            {isLoading ? "Updating..." : "Set Password"}
                        </button>
                    </form>
                </div>
            </div>

            <div className="login-decoration">
                <AssetImage
                    name="login-placeholder"
                    alt="Decorative illustration"
                    className="decoration-image"
                />
            </div>
        </main>
    );
};

export default ForcePasswordChange;
