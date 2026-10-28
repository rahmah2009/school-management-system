
import { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { apiRequest } from "../../services/api";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setMessage("");

        if (!name.trim() || !email.trim() || !password || !confirmPassword) {
            setError("Please complete all fields.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            const data = await apiRequest("/auth/register", {
                method: "POST",
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim(),
                    password,
                }),
            });
            setMessage(data.message || "Account created successfully. You can now log in.");
            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
        } catch (requestError) {
            setError(requestError.message || "Unable to create your account.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-green-50 px-4 py-10 sm:px-6">
            <div className="w-full max-w-md rounded-2xl border border-green-100 bg-white p-6 shadow-xl sm:p-8">
                <div className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-950 text-3xl text-yellow-400 shadow-md">
                        🎓
                    </div>

                    <h1 className="mt-5 text-3xl font-bold text-green-950">
                        Create Account
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                        Join the Greenfield School Management System.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <Input
                        label="Full Name"
                        type="text"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        required
                    />

                    <Input
                        label="Email Address"
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
                            placeholder="Create a password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                        />

                        <Input
                            label="Confirm Password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password again"
                            value={confirmPassword}
                            onChange={(event) =>
                                setConfirmPassword(event.target.value)
                            }
                            required
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowPassword((current) => !current)
                            }
                            className="mt-2 text-sm font-semibold text-green-950 hover:underline"
                        >
                            {showPassword ? "Hide passwords" : "Show passwords"}
                        </button>
                    </div>

                    {error && (
                        <p
                            role="alert"
                            className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
                        >
                            {error}
                        </p>
                    )}

                    {message && (
                        <p
                            role="status"
                            className="rounded-lg bg-green-50 p-3 text-sm text-green-800"
                        >
                            {message}
                        </p>
                    )}

                    <Button type="submit" className="w-full">
                        Create Account
                    </Button>
                </form>

                <div className="mt-6 space-y-4 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-bold text-green-950 hover:underline"
                        >
                            Login
                        </Link>
                    </p>

                    <Link
                        to="/"
                        className="inline-block text-sm font-semibold text-green-950 hover:underline"
                    >
                        ← Back to School Website
                    </Link>
                </div>

                <p className="mt-8 text-center text-xs text-gray-400">
                    Greenfield School Management System
                </p>
            </div>
        </div>
    );
}

export default Register;
