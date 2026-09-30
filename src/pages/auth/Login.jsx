import { Link } from "react-router-dom";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

function Login() {
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

                <form className="mt-8 space-y-5">

                    <Input
                        label="Email"
                        type="email"
                        placeholder="Enter your email"
                    />

                    <Input
                        label="Password"
                        type="password"
                        placeholder="Enter your password"
                    />

                    <Button
                        type="submit"
                        className="w-full"
                    >
                        Login
                    </Button>

                </form>

                <div className="mt-6 text-center">
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