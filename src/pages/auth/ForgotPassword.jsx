
import { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { apiRequest } from "../../services/api";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setMessage("");

        if (!email.trim()) {
            setError("Please enter your email address.");
            return;
        }

        setLoading(true);

        try {
            const data = await apiRequest("/auth/forgot-password", {
                method: "POST",
                body: JSON.stringify({ email: email.trim() }),
            });

            setMessage(data.message);
        } catch (err) {
            setError(err.message || "Unable to process your request.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-green-50 px-6 py-12">
            <div className="w-full max-w-md rounded-2xl border border-green-100 bg-white p-8 shadow-xl">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-green-950">
                        Forgot Password?
                    </h1>
                    <p className="mt-3 text-gray-600">
                        Enter the email address associated with your Greenfield
                        administrator account. We'll send a password reset link
                        if an account exists.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="Enter your registered email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />

                    {error && (
                        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                            {error}
                        </p>
                    )}

                    {message && (
                        <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-800">
                            {message}
                        </p>
                    )}

                    <Button
                        type="submit"
                        className="w-full disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={loading}
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
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

export default ForgotPassword;
