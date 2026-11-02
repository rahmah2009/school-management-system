
import { Link, useNavigate } from "react-router-dom";
import { Home, ArrowLeft, LayoutDashboard, GraduationCap } from "lucide-react";

function NotFound() {
    const navigate = useNavigate();

    const admin = (() => {
        try {
            return JSON.parse(
                sessionStorage.getItem("greenfield_admin") || "null"
            );
        } catch {
            return null;
        }
    })();

    const isLoggedIn = Boolean(
        sessionStorage.getItem("greenfield_admin_token")
    );

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-green-950 via-green-900 to-green-950 px-6 py-12">

            {/* Decorative background */}
            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-yellow-400/10 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-yellow-400/10 blur-3xl" />

            <div className="relative z-10 mx-auto w-full max-w-2xl text-center">

                {/* School icon */}
                <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl border border-yellow-400/30 bg-white/10 text-yellow-400 shadow-xl backdrop-blur">
                    <GraduationCap size={42} strokeWidth={1.5} />
                </div>

                {/* 404 */}
                <h1 className="text-8xl font-black tracking-tight text-yellow-400 sm:text-9xl">
                    404
                </h1>

                <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-yellow-400" />

                {/* Message */}
                <h2 className="mt-8 text-2xl font-bold text-white sm:text-3xl">
                    Oops! Page Not Found
                </h2>

                <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-green-100/80 sm:text-base">
                    The page you're looking for may have been moved,
                    deleted, or doesn't exist. Don't worry, let's
                    get you back on track.
                </p>

                {/* Actions */}
                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">

                    <Link
                        to="/"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-7 py-3.5 font-bold text-green-950 shadow-lg transition hover:-translate-y-1 hover:bg-yellow-300 sm:w-auto"
                    >
                        <Home size={19} />
                        Back to Home
                    </Link>

                    {isLoggedIn && (
                        <Link
                            to="/login"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 font-semibold text-white transition hover:bg-white/20 sm:w-auto"
                        >
                            <LayoutDashboard size={19} />
                            Dashboard
                        </Link>
                    )}

                    {!isLoggedIn && (
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/30 px-7 py-3.5 font-semibold text-white transition hover:bg-white/10 sm:w-auto"
                        >
                            <ArrowLeft size={19} />
                            Go Back
                        </button>
                    )}
                </div>

                {/* Footer */}
                <p className="mt-16 text-xs tracking-wide text-green-100/50">
                    © {new Date().getFullYear()} Greenfield School.
                    All rights reserved.
                </p>
            </div>
        </main>
    );
}

export default NotFound;
