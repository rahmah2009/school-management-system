
import { Link, useNavigate } from "react-router-dom";
import {
    ShieldX,
    ArrowLeft,
    LayoutDashboard,
    Home,
} from "lucide-react";

function AccessDenied() {
    const navigate = useNavigate();

    return (
        <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-950 via-green-900 to-green-950 px-6 py-12">
            <div className="w-full max-w-xl text-center">

                <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-3xl border border-yellow-400/30 bg-white/10 text-yellow-400">
                    <ShieldX size={42} strokeWidth={1.5} />
                </div>

                <h1 className="text-8xl font-black text-yellow-400 sm:text-9xl">
                    403
                </h1>

                <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-yellow-400" />

                <h2 className="mt-8 text-2xl font-bold text-white sm:text-3xl">
                    Access Denied
                </h2>

                <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-green-100/80 sm:text-base">
                    Sorry, you don't have permission to access this
                    page. Please contact your school administrator
                    if you believe this is a mistake.
                </p>

                <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">

                    <Link
                        to="/admin"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-7 py-3.5 font-bold text-green-950 transition hover:bg-yellow-300"
                    >
                        <LayoutDashboard size={19} />
                        Go to Dashboard
                    </Link>

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-7 py-3.5 font-semibold text-white transition hover:bg-white/10"
                    >
                        <ArrowLeft size={19} />
                        Go Back
                    </button>
                </div>

                <Link
                    to="/"
                    className="mt-8 inline-flex items-center gap-2 text-sm text-green-100/60 transition hover:text-yellow-400"
                >
                    <Home size={16} />
                    Return to Greenfield Website
                </Link>

                <p className="mt-12 text-xs text-green-100/40">
                    © {new Date().getFullYear()} Greenfield School.
                    All rights reserved.
                </p>
            </div>
        </main>
    );
}

export default AccessDenied;
