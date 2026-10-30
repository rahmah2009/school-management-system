
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { apiRequest } from "../../services/api";

function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const token = searchParams.get("token") || "";

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setSuccess("");

        if (!token) {
            setError("Your password reset link is invalid or missing.");
            return;
        }

        if (password.length < 6 || password.length > 32) {
            setError("Password must be between 6 and 32 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Your passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const data = await apiRequest("/auth/reset-password", {
                method: "POST",
                body: JSON.stringify({ token, password }),
            });

            setSuccess(data.message);

            // Allow the user to read the confirmation before returning to login.
            window.setTimeout(() => {
                navigate("/login", { replace: true });
            }, 2000);
        } catch (err) {
            setError(err.message || "Unable to reset your password.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-green-50 px-6 py-12">
            <div className="w-full max-w-md rounded-2xl border border-green-100 bg-white p-8 shadow-xl">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-green-950">
                        Reset Password
                    </h1>
                    <p className="mt-3 text-gray-600">
                        Create a new password for your Greenfield administrator account.
                    </p>
                </div>

                {!token && (
                    <p role="alert" className="mt-6 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                        Your password reset link is invalid or missing.
                    </p>
                )}

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <Input
                        label="New Password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your new password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                    />

                    <Input
                        label="Confirm New Password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm your new password"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        required
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword((current) => !current)}
                        className="text-sm font-semibold text-green-950 hover:underline"
                    >
                        {showPassword ? "Hide passwords" : "Show passwords"}
                    </button>

                    {error && (
                        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                            {error}
                        </p>
                    )}

                    {success && (
                        <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-800">
                            {success}
                        </p>
                    )}

                    <Button
                        type="submit"
                        className="w-full disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={loading || !token || Boolean(success)}
                    >
                        {loading ? "Updating Password..." : "Reset Password"}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <Link
                        to="/login"
                        className="font-semibold text-green-950 hover:underline"
                    >
                        ← Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
