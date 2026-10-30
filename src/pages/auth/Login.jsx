
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { apiRequest } from "../../services/api";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");

        if (!email.trim() || !password) {
            setError("Please enter your email and password.");
            return;
        }

        setLoading(true);

        try {
            const data = await apiRequest("/auth/login", {
                method: "POST",
                body: JSON.stringify({
                    email: email.trim(),
                    password,
                }),
            });

            if (!data.token || !data.admin) {
                throw new Error("The server returned an incomplete login response.");
            }

            sessionStorage.setItem("greenfield_admin_token", data.token);
            sessionStorage.setItem("greenfield_admin", JSON.stringify(data.admin));
            navigate("/admin", { replace: true });
        } catch (error) {
            console.error("Login request failed:", error);
            setError(error.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-green-50 px-6 py-12">
            <div className="w-full max-w-md rounded-2xl border border-green-100 bg-white p-8 shadow-xl">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-green-950">
                        Welcome Back
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Sign in to access the Greenfield School dashboard.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <Input
                        label="Email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />

                    <div>
                        <Input
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            required
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword((current) => !current)}
                            className="mt-2 text-sm font-semibold text-green-950 hover:underline"
                        >
                            {showPassword ? "Hide password" : "Show password"}
                        </button>

                        <div className="mt-2 text-right">
                            <Link
                                to="/forgot-password"
                                className="text-sm font-semibold text-green-800 hover:text-green-950 hover:underline"
                            >
                                Forgot Password?
                            </Link>
                        </div>
                    </div>

                    {error && (
                        <p
                            role="alert"
                            className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
                        >
                            {error}
                        </p>
                    )}

                    <Button
                        type="submit"
                        className="w-full disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Login"}
                    </Button>
                </form>


                <div className="mt-6 space-y-4 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an admin account?{" "}
                        <Link
                            to="/register"
                            className="font-bold text-green-950 hover:underline"
                        >
                            Create Account
                        </Link>
                    </p>

                    <Link
                        to="/"
                        className="font-semibold text-green-950 hover:underline"
                    >
                        ← Back to School Website
                    </Link>
                </div>

            </div>
        </div>
    );
}

export default Login;
