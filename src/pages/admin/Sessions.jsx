import { useState, useEffect } from "react";

function Sessions() {
    const [activeSession, setActiveSession] = useState(() => {
        return (
            localStorage.getItem("greenfield_active_session") ||
            "2026/2027"
        );
    });

    useEffect(() => {
        localStorage.setItem(
            "greenfield_active_session",
            activeSession
        );
    }, [activeSession]);

    const sessions = [
        "2022/2023",
        "2023/2024",
        "2024/2025",
        "2025/2026",
        "2026/2027",
        "2027/2028",
        "2028/2029",
    ];

    return (
        <div>
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-green-950">
                    Sessions
                </h1>

                <p className="mt-2 text-gray-600">
                    Manage academic sessions here.
                </p>
            </div>

            {/* Session Cards */}
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {sessions.map((session) => {
                    const isActive = session === activeSession;
                    const isFuture = session > activeSession;

                    return (
                        <div
                            key={session}
                            className="rounded-2xl border border-green-100 bg-white p-6 shadow-md"
                        >
                            {/* Session Name */}
                            <h2 className="text-xl font-bold text-green-950">
                                {session}
                            </h2>

                            {/* Session Status */}
                            <p
                                className={`mt-3 inline-block rounded-full px-3 py-1 text-sm font-semibold ${
                                    isActive
                                        ? "bg-green-100 text-green-800"
                                        : isFuture
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-gray-100 text-gray-600"
                                }`}
                            >
                                {isActive
                                    ? "Active"
                                    : isFuture
                                        ? "Upcoming"
                                        : "Completed"}
                            </p>

                            {/* Set Active Button */}
                            {!isActive && (
                                <button
                                    onClick={() =>
                                        setActiveSession(session)
                                    }
                                    className="mt-5 block rounded-full bg-green-950 px-5 py-2 font-semibold text-white transition hover:bg-green-800"
                                >
                                    Set Active
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Sessions;