import { useEffect, useState } from "react";

function Sessions() {
    const defaultSessions = [
        {
            id: "SES-001",
            name: "2022/2023",
            isActive: false,
        },
        {
            id: "SES-002",
            name: "2023/2024",
            isActive: false,
        },
        {
            id: "SES-003",
            name: "2024/2025",
            isActive: false,
        },
        {
            id: "SES-004",
            name: "2025/2026",
            isActive: false,
        },
        {
            id: "SES-005",
            name: "2026/2027",
            isActive: true,
        },
        {
            id: "SES-006",
            name: "2027/2028",
            isActive: false,
        },
        {
            id: "SES-007",
            name: "2028/2029",
            isActive: false,
        },
    ];

    const [sessions, setSessions] = useState(() => {
        const savedSessions = localStorage.getItem(
            "greenfield_school_sessions"
        );

        return savedSessions
            ? JSON.parse(savedSessions)
            : defaultSessions;
    });

    useEffect(() => {
        localStorage.setItem(
            "greenfield_school_sessions",
            JSON.stringify(sessions)
        );
    }, [sessions]);

    const setActiveSession = (id) => {
        const updatedSessions = sessions.map((session) => ({
            ...session,
            isActive: session.id === id,
        }));

        setSessions(updatedSessions);
    };

    return (
        <div>
            <div>
                <h1 className="text-3xl font-bold text-green-950">
                    Sessions
                </h1>

                <p className="mt-2 text-gray-600">
                    Manage school academic sessions.
                </p>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {sessions.map((session) => (
                    <div
                        key={session.id}
                        className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-green-950">
                                {session.name}
                            </h2>

                            {session.isActive && (
                                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                                    Active
                                </span>
                            )}
                        </div>

                        <p className="mt-2 text-sm text-gray-500">
                            Academic Session
                        </p>

                        {!session.isActive && (
                            <button
                                onClick={() =>
                                    setActiveSession(session.id)
                                }
                                className="mt-5 rounded-xl bg-green-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-900"
                            >
                                Set Active
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Sessions;