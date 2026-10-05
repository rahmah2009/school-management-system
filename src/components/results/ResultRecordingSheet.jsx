import { useEffect, useState } from "react";

function ResultRecordingSheet() {
    const [students, setStudents] = useState([]);
    const [sessions, setSessions] = useState([]);

    const [selectedStudent, setSelectedStudent] = useState("");
    const [selectedSession, setSelectedSession] = useState("");

    useEffect(() => {
        const savedStudents = localStorage.getItem(
            "greenfield_school_students"
        );

        if (savedStudents) {
            setStudents(JSON.parse(savedStudents));
        }

        const savedSessions = localStorage.getItem(
            "greenfield_school_sessions"
        );

        if (savedSessions) {
            setSessions(JSON.parse(savedSessions));
        }
    }, []);

    const selectedStudentData = students.find(
        (student) => student.id === selectedStudent
    );

    const studentClass = selectedStudentData?.className || "";

    return (
        <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-md">
            <div>
                <h2 className="text-2xl font-bold text-green-950">
                    Result Recording Sheet
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Record academic results for a student.
                </p>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">

                {/* STUDENT */}
                <div>
                    <label className="mb-2 block text-sm font-semibold text-green-950">
                        Student
                    </label>

                    <select
                        value={selectedStudent}
                        onChange={(e) =>
                            setSelectedStudent(e.target.value)
                        }
                        className="w-full rounded-xl border border-green-100 bg-white px-4 py-3 outline-none focus:border-green-950 focus:ring-2 focus:ring-green-950/10"
                    >
                        <option value="">
                            Select student
                        </option>

                        {students.map((student) => (
                            <option
                                key={student.id}
                                value={student.id}
                            >
                                {student.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* CLASS */}
                <div>
                    <label className="mb-2 block text-sm font-semibold text-green-950">
                        Class
                    </label>

                    <select
                        value={studentClass}
                        disabled={!selectedStudent}
                        className="w-full rounded-xl border border-green-100 bg-gray-50 px-4 py-3 text-gray-700 outline-none disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        <option value="">
                            {selectedStudent
                                ? "Student's class"
                                : "Select a student first"}
                        </option>

                        {studentClass && (
                            <option value={studentClass}>
                                {studentClass}
                            </option>
                        )}
                    </select>
                </div>

                {/* SESSION */}
                <div>
                    <label className="mb-2 block text-sm font-semibold text-green-950">
                        Session
                    </label>

                    <select
                        value={selectedSession}
                        onChange={(e) =>
                            setSelectedSession(e.target.value)
                        }
                        className="w-full rounded-xl border border-green-100 bg-white px-4 py-3 outline-none focus:border-green-950 focus:ring-2 focus:ring-green-950/10"
                    >
                        <option value="">
                            Select session
                        </option>

                        {sessions
                            .filter(
                                (session) =>
                                    session.isActive
                            )
                            .map((session) => (
                                <option
                                    key={session.id}
                                    value={session.id}
                                >
                                    {session.name}
                                </option>
                            ))}
                    </select>
                </div>

                {/* TERM */}
                <div>
                    <label className="mb-2 block text-sm font-semibold text-green-950">
                        Term
                    </label>

                    <select className="w-full rounded-xl border border-green-100 bg-white px-4 py-3 outline-none focus:border-green-950 focus:ring-2 focus:ring-green-950/10">
                        <option value="">
                            Select term
                        </option>

                        <option value="First Term">
                            First Term
                        </option>

                        <option value="Second Term">
                            Second Term
                        </option>

                        <option value="Third Term">
                            Third Term
                        </option>
                    </select>
                </div>

            </div>
        </div>
    );
}

export default ResultRecordingSheet;