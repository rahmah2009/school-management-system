
import { Link, useNavigate } from "react-router-dom";
import { ServerCrash } from "lucide-react";

function ServerError() {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-lg">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
                    <ServerCrash className="h-10 w-10 text-red-600" />
                </div>

                <p className="mb-2 text-sm font-bold uppercase tracking-widest text-green-700">
                    Greenfield School
                </p>

                <h1 className="mb-2 text-6xl font-extrabold text-gray-900">
                    500
                </h1>

                <h2 className="mb-3 text-xl font-bold text-gray-800">
                    Something Went Wrong
                </h2>

                <p className="mb-8 text-sm leading-6 text-gray-500">
                    We're experiencing a technical problem.
                    Please try again in a few moments.
                </p>

                <div className="flex flex-col justify-center gap-3 sm:flex-row">
                    <button
                        onClick={() => window.location.reload()}
                        className="rounded-lg bg-green-800 px-6 py-3 font-semibold text-white hover:bg-green-900"
                    >
                        Try Again
                    </button>

                    <button
                        onClick={() => navigate("/")}
                        className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-100"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ServerError;
