
import { useEffect, useMemo, useState } from "react";
import subjectsData from "../../data/subjects";

const RESULTS_KEY = "greenfield_school_results";
const STUDENTS_KEY = "greenfield_school_students";
const SESSIONS_KEY = "greenfield_school_sessions";

const TERMS = ["First Term", "Second Term", "Third Term"];

function readArray(key) {
    try {
        const data = localStorage.getItem(key);
        const parsed = data ? JSON.parse(data) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function notifyResultsUpdated() {
    window.dispatchEvent(new Event("greenfield-results-updated"));
}

function getStatus(result) {
    return result?.status || "draft";
}

function getStatusLabel(status) {
    const labels = {
        draft: "Draft",
        submitted: "Submitted for review",
        approved: "Approved",
        returned: "Returned for correction",
    };

    return labels[status] || "Draft";
}

function getStatusClasses(status) {
    const classes = {
        draft: "bg-amber-100 text-amber-800",
        submitted: "bg-blue-100 text-blue-800",
        approved: "bg-green-100 text-green-800",
        returned: "bg-red-100 text-red-800",
    };

    return classes[status] || classes.draft;
}

function ResultRecordingSheet() {
    const [students, setStudents] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [savedResults, setSavedResults] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState("");
    const [selectedSession, setSelectedSession] = useState("");
    const [selectedTerm, setSelectedTerm] = useState("First Term");
    const [marks, setMarks] = useState({});
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");

    useEffect(() => {
        const loadedStudents = readArray(STUDENTS_KEY);
        const loadedSessions = readArray(SESSIONS_KEY);
        const loadedResults = readArray(RESULTS_KEY);

        setStudents(loadedStudents);
        setSessions(loadedSessions);
        setSavedResults(loadedResults);

        if (loadedStudents.length > 0) {
            setSelectedStudent(String(loadedStudents[0].id));
        }

        const activeSession = loadedSessions.find(
            (session) => session.isActive
        );

        if (activeSession) {
            setSelectedSession(String(activeSession.id));
        } else if (loadedSessions.length > 0) {
            setSelectedSession(String(loadedSessions[0].id));
        }
    }, []);

    useEffect(() => {
        function refresh() {
            setStudents(readArray(STUDENTS_KEY));
            setSessions(readArray(SESSIONS_KEY));
            setSavedResults(readArray(RESULTS_KEY));
        }

        window.addEventListener("focus", refresh);
        window.addEventListener("storage", refresh);
        window.addEventListener("greenfield-results-updated", refresh);

        return () => {
            window.removeEventListener("focus", refresh);
            window.removeEventListener("storage", refresh);
            window.removeEventListener("greenfield-results-updated", refresh);
        };
    }, []);

    const student = students.find(
        (item) => String(item.id) === selectedStudent
    );

    const selectedSessionData = sessions.find(
        (item) => String(item.id) === selectedSession
    );

    const availableSubjects = useMemo(() => {
        if (!student) return [];

        const className = String(student.className || "").toUpperCase();

        if (className.startsWith("JSS")) {
            return subjectsData.JSS;
        }

        return subjectsData.SS[student.department] || [];
    }, [student]);

    const existingResult = savedResults.find(
        (result) =>
            String(result.studentId) === selectedStudent &&
            String(result.sessionId) === selectedSession &&
            result.term === selectedTerm
    );

    const status = getStatus(existingResult);

    const isLocked =
        status === "submitted" || status === "approved";

    useEffect(() => {
        const result = savedResults.find(
            (item) =>
                String(item.studentId) === selectedStudent &&
                String(item.sessionId) === selectedSession &&
                item.term === selectedTerm
        );

        if (result) {
            const nextMarks = {};

            Object.entries(result.marks || {}).forEach(([subject, score]) => {
                nextMarks[subject] = {
                    ca: score?.ca ?? "",
                    exam: score?.exam ?? "",
                };
            });

            setMarks(nextMarks);
        } else {
            setMarks({});
        }

        setMessage("");
    }, [selectedStudent, selectedSession, selectedTerm, savedResults]);

    function updateMark(subject, field, value) {
        if (isLocked) return;

        if (value !== "") {
            const number = Number(value);
            const maximum = field === "ca" ? 20 : 80;

            if (!Number.isFinite(number) || number < 0 || number > maximum) {
                return;
            }
        }

        setMarks((current) => ({
            ...current,
            [subject]: {
                ca: current[subject]?.ca ?? "",
                exam: current[subject]?.exam ?? "",
                [field]: value,
            },
        }));

        setMessage("");
    }

    function calculateTotal(subject) {
        const score = marks[subject];

        if (!score || score.ca === "" || score.exam === "") {
            return "—";
        }

        return Number(score.ca) + Number(score.exam);
    }

    function getGrade(total) {
        if (total >= 70) return "A";
        if (total >= 60) return "B";
        if (total >= 50) return "C";
        if (total >= 45) return "D";
        if (total >= 40) return "E";
        return "F";
    }

    function saveResult(nextStatus) {
        if (!student || !selectedSessionData || !selectedTerm) {
            setMessageType("error");
            setMessage("Please select a student, session and term.");
            return;
        }

        if (isLocked) {
            setMessageType("error");
            setMessage(
                "This result is locked. Submitted results must be returned before editing, and approved results require authorized reopening."
            );
            return;
        }

        if (availableSubjects.length === 0) {
            setMessageType("error");
            setMessage(
                "No subjects were found for this student's class or department."
            );
            return;
        }

        for (const subject of availableSubjects) {
            const score = marks[subject];

            if (
                !score ||
                score.ca === "" ||
                score.exam === "" ||
                !Number.isFinite(Number(score.ca)) ||
                !Number.isFinite(Number(score.exam))
            ) {
                setMessageType("error");
                setMessage(
                    `Enter both CA and exam marks for ${subject}.`
                );
                return;
            }

            if (
                Number(score.ca) < 0 ||
                Number(score.ca) > 20 ||
                Number(score.exam) < 0 ||
                Number(score.exam) > 80
            ) {
                setMessageType("error");
                setMessage(
                    `Check the marks for ${subject}. CA must be 0–20 and exam must be 0–80.`
                );
                return;
            }
        }

        const oldResult = savedResults.find(
            (result) =>
                String(result.studentId) === selectedStudent &&
                String(result.sessionId) === selectedSession &&
                result.term === selectedTerm
        );

        const result = {
            ...(oldResult || {}),
            studentId: student.id,
            sessionId: selectedSessionData.id,
            term: selectedTerm,
            marks: Object.fromEntries(
                availableSubjects.map((subject) => [
                    subject,
                    {
                        ca: Number(marks[subject].ca),
                        exam: Number(marks[subject].exam),
                    },
                ])
            ),
            status: nextStatus,
            reviewNote: "",
            updatedAt: new Date().toISOString(),
            ...(nextStatus === "submitted"
                ? { submittedAt: new Date().toISOString() }
                : {}),
        };

        const updatedResults = [
            ...savedResults.filter(
                (item) =>
                    !(
                        String(item.studentId) === selectedStudent &&
                        String(item.sessionId) === selectedSession &&
                        item.term === selectedTerm
                    )
            ),
            result,
        ];

        try {
            localStorage.setItem(RESULTS_KEY, JSON.stringify(updatedResults));
            setSavedResults(updatedResults);
            notifyResultsUpdated();

            setMessageType("success");
            setMessage(
                nextStatus === "submitted"
                    ? "Results submitted successfully for review."
                    : "Draft saved successfully."
            );
        } catch {
            setMessageType("error");
            setMessage(
                "Could not save the result. Check available browser storage."
            );
        }
    }

    const completedSubjects = availableSubjects.filter((subject) => {
        const score = marks[subject];

        return (
            score &&
            score.ca !== "" &&
            score.exam !== "" &&
            Number.isFinite(Number(score.ca)) &&
            Number.isFinite(Number(score.exam))
        );
    }).length;

    return (
        <div className="space-y-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h3 className="text-lg font-bold text-green-950">
                        Student Result Entry
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                        CA: 20 marks · Examination: 80 marks · Total: 100 marks
                    </p>
                </div>

                <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(status)}`}
                >
                    {getStatusLabel(status)}
                </span>
            </div>

            {isLocked && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
                    {status === "approved"
                        ? "This result has been approved and is locked against normal editing."
                        : "This result has been submitted and is awaiting review. Editing is disabled."}
                </div>
            )}

            {status === "returned" && existingResult?.reviewNote && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-900">
                    <strong>Reviewer feedback:</strong>{" "}
                    {existingResult.reviewNote}
                </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Student
                    </label>
                    <select
                        value={selectedStudent}
                        onChange={(event) =>
                            setSelectedStudent(event.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-700"
                    >
                        <option value="">Select student</option>
                        {students.map((item) => (
                            <option key={item.id} value={String(item.id)}>
                                {item.name} — {item.className}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Academic Session
                    </label>
                    <select
                        value={selectedSession}
                        onChange={(event) =>
                            setSelectedSession(event.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-700"
                    >
                        <option value="">Select session</option>
                        {sessions.map((item) => (
                            <option key={item.id} value={String(item.id)}>
                                {item.name}
                                {item.isActive ? " (Active)" : ""}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Term
                    </label>
                    <select
                        value={selectedTerm}
                        onChange={(event) => setSelectedTerm(event.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-700"
                    >
                        {TERMS.map((term) => (
                            <option key={term} value={term}>
                                {term}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {student && (
                <div className="rounded-lg bg-green-50 p-3 text-sm text-green-950">
                    <strong>{student.name}</strong>
                    {" · "}
                    {student.className}
                    {student.department ? ` · ${student.department}` : ""}
                </div>
            )}

            {availableSubjects.length > 0 ? (
                <>
                    <div className="overflow-x-auto rounded-xl border border-gray-200">
                        <table className="w-full min-w-[650px] text-left text-sm">
                            <thead className="bg-green-950 text-white">
                                <tr>
                                    <th className="px-4 py-3">Subject</th>
                                    <th className="px-4 py-3">CA / 20</th>
                                    <th className="px-4 py-3">Exam / 80</th>
                                    <th className="px-4 py-3">Total / 100</th>
                                    <th className="px-4 py-3">Grade</th>
                                </tr>
                            </thead>
                            <tbody>
                                {availableSubjects.map((subject) => {
                                    const total = calculateTotal(subject);

                                    return (
                                        <tr
                                            key={subject}
                                            className="border-t border-gray-100"
                                        >
                                            <td className="px-4 py-3 font-medium text-gray-800">
                                                {subject}
                                            </td>
                                            <td className="px-4 py-3">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="20"
                                                    step="1"
                                                    value={marks[subject]?.ca ?? ""}
                                                    disabled={isLocked}
                                                    onChange={(event) =>
                                                        updateMark(
                                                            subject,
                                                            "ca",
                                                            event.target.value
                                                        )
                                                    }
                                                    className="w-20 rounded-md border border-gray-300 px-2 py-1.5 disabled:bg-gray-100"
                                                    aria-label={`${subject} CA mark`}
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="80"
                                                    step="1"
                                                    value={marks[subject]?.exam ?? ""}
                                                    disabled={isLocked}
                                                    onChange={(event) =>
                                                        updateMark(
                                                            subject,
                                                            "exam",
                                                            event.target.value
                                                        )
                                                    }
                                                    className="w-20 rounded-md border border-gray-300 px-2 py-1.5 disabled:bg-gray-100"
                                                    aria-label={`${subject} exam mark`}
                                                />
                                            </td>
                                            <td className="px-4 py-3 font-semibold text-green-950">
                                                {total}
                                            </td>
                                            <td className="px-4 py-3 font-bold">
                                                {total === "—"
                                                    ? "—"
                                                    : getGrade(total)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <p className="text-sm text-gray-500">
                        Completed subjects: {completedSubjects} of{" "}
                        {availableSubjects.length}
                    </p>
                </>
            ) : (
                <p className="rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
                    Select a student with a recognised class and department to
                    load the correct subjects.
                </p>
            )}

            {message && (
                <div
                    role="status"
                    className={`rounded-lg p-3 text-sm ${
                        messageType === "success"
                            ? "bg-green-50 text-green-800"
                            : "bg-red-50 text-red-800"
                    }`}
                >
                    {message}
                </div>
            )}

            {!isLocked && (
                <div className="flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={() => saveResult("draft")}
                        className="rounded-lg border border-green-800 px-4 py-2.5 font-semibold text-green-900 transition hover:bg-green-50"
                    >
                        Save Draft
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            if (
                                window.confirm(
                                    "Submit these results for review? You will not be able to edit them unless they are returned for correction."
                                )
                            ) {
                                saveResult("submitted");
                            }
                        }}
                        className="rounded-lg bg-green-800 px-4 py-2.5 font-semibold text-white transition hover:bg-green-900"
                    >
                        Submit for Review
                    </button>
                </div>
            )}
        </div>
    );
}

export default ResultRecordingSheet;
