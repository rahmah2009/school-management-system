
import { useCallback, useEffect, useState } from "react";

const RESULTS_KEY = "greenfield_school_results";
const STUDENTS_KEY = "greenfield_school_students";
const SESSIONS_KEY = "greenfield_school_sessions";

function readArray(key) {
    try {
        const parsed = JSON.parse(localStorage.getItem(key) || "[]");
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error(`Could not read ${key}:`, error);
        return [];
    }
}

function normalizeStatus(status) {
    return String(status || "draft").trim().toLowerCase();
}

function getResultKey(result) {
    if (result.id !== undefined && result.id !== null && String(result.id)) {
        return String(result.id);
    }

    return JSON.stringify([
        String(result.studentId ?? ""),
        String(result.sessionId ?? ""),
        String(result.term ?? ""),
    ]);
}

function createResultId() {
    return (
        globalThis.crypto?.randomUUID?.() ||
        `result-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
    );
}

// Give every result a permanent, unique ID.
// This also supports older results that did not have IDs.
function ensureResultIds(results) {
    const usedIds = new Set();
    let changed = false;

    const updatedResults = results.map((result) => {
        const existingId =
            result.id !== undefined && result.id !== null
                ? String(result.id)
                : "";

        if (existingId && !usedIds.has(existingId)) {
            usedIds.add(existingId);
            return result;
        }

        let id = createResultId();

        while (usedIds.has(id)) {
            id = createResultId();
        }

        usedIds.add(id);
        changed = true;

        return { ...result, id };
    });

    return { updatedResults, changed };
}

function notifyResultsUpdated() {
    window.dispatchEvent(new Event("greenfield-results-updated"));
}

function getValidMarks(score) {
    if (!score || typeof score !== "object") {
        return null;
    }

    if (
        score.ca === "" ||
        score.ca === undefined ||
        score.ca === null ||
        score.exam === "" ||
        score.exam === undefined ||
        score.exam === null
    ) {
        return null;
    }

    const ca = Number(score.ca);
    const exam = Number(score.exam);

    if (
        !Number.isFinite(ca) ||
        !Number.isFinite(exam) ||
        ca < 0 ||
        ca > 20 ||
        exam < 0 ||
        exam > 80
    ) {
        return null;
    }

    return { ca, exam, total: ca + exam };
}

function getGrade(total) {
    if (!Number.isFinite(total)) return "—";
    if (total >= 70) return "A";
    if (total >= 60) return "B";
    if (total >= 50) return "C";
    if (total >= 45) return "D";
    if (total >= 40) return "E";
    return "F";
}

function ResultApprovalPanel() {
    const [results, setResults] = useState([]);
    const [students, setStudents] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [feedback, setFeedback] = useState({});
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("info");
    const [savingKey, setSavingKey] = useState("");
    const [confirmAction, setConfirmAction] = useState(null);

    const refresh = useCallback(() => {
        const storedResults = readArray(RESULTS_KEY);
        const { updatedResults, changed } =
            ensureResultIds(storedResults);

        if (changed) {
            try {
                localStorage.setItem(
                    RESULTS_KEY,
                    JSON.stringify(updatedResults)
                );

                notifyResultsUpdated();
            } catch (error) {
                console.error("Could not save result IDs:", error);
                setMessage(
                    "Could not save permanent result IDs. Check browser storage."
                );
                setMessageType("error");
            }
        }

        setResults(updatedResults);
        setStudents(readArray(STUDENTS_KEY));
        setSessions(readArray(SESSIONS_KEY));
    }, []);

    useEffect(() => {
        refresh();

        function handleRefresh() {
            refresh();
        }

        window.addEventListener("focus", handleRefresh);
        window.addEventListener("storage", handleRefresh);
        window.addEventListener(
            "greenfield-results-updated",
            handleRefresh
        );

        return () => {
            window.removeEventListener("focus", handleRefresh);
            window.removeEventListener("storage", handleRefresh);
            window.removeEventListener(
                "greenfield-results-updated",
                handleRefresh
            );
        };
    }, [refresh]);

    const submittedResults = results.filter(
        (result) => normalizeStatus(result.status) === "submitted"
    );

    const approvedCount = results.filter(
        (result) => normalizeStatus(result.status) === "approved"
    ).length;

    const returnedCount = results.filter(
        (result) => normalizeStatus(result.status) === "returned"
    ).length;

    const draftCount = results.filter(
        (result) => normalizeStatus(result.status) === "draft"
    ).length;

    function showMessage(text, type = "info") {
        setMessage(text);
        setMessageType(type);
    }

    function getStudent(studentId) {
        return students.find(
            (student) => String(student.id) === String(studentId)
        );
    }

    function getSession(sessionId) {
        return sessions.find(
            (session) => String(session.id) === String(sessionId)
        );
    }

    function getSubjectCount(result) {
        return Object.keys(result.marks || {}).length;
    }

    function getAverage(result) {
        const scores = Object.values(result.marks || {})
            .map(getValidMarks)
            .filter(Boolean)
            .map((score) => score.total);

        if (scores.length === 0) return "—";

        return (
            scores.reduce((sum, score) => sum + score, 0) /
            scores.length
        ).toFixed(1);
    }

    function validateResult(result) {
        const entries = Object.entries(result.marks || {});

        if (entries.length === 0) {
            return "This result has no subject marks. It cannot be approved.";
        }

        const invalidSubjects = entries
            .filter(([, marks]) => !getValidMarks(marks))
            .map(([subject]) => subject);

        if (invalidSubjects.length > 0) {
            return `Check the marks for: ${invalidSubjects.join(", ")}. Each subject needs a valid CA score (0–20) and exam score (0–80).`;
        }

        return "";
    }

    function updateResult(resultKey, action) {
        if (savingKey) return;

        if (!["approve", "return"].includes(action)) {
            showMessage("Invalid review action.", "error");
            return;
        }

        const note = String(feedback[resultKey] || "").trim();

        if (action === "return" && !note) {
            showMessage(
                "Enter a correction reason before returning this result.",
                "error"
            );
            return;
        }

        setSavingKey(resultKey);
        showMessage("");

        try {
            // Read the latest stored data instead of relying on
            // potentially stale React state.
            const currentResults = readArray(RESULTS_KEY);

            const target = currentResults.find(
                (result) => getResultKey(result) === resultKey
            );

            if (!target) {
                showMessage(
                    "Result not found. Refresh the page and try again.",
                    "error"
                );
                refresh();
                return;
            }

            if (normalizeStatus(target.status) !== "submitted") {
                showMessage(
                    "This result is no longer awaiting review. The list has been refreshed.",
                    "error"
                );
                refresh();
                return;
            }

            if (action === "approve") {
                const validationError = validateResult(target);

                if (validationError) {
                    showMessage(validationError, "error");
                    return;
                }
            }

            const now = new Date().toISOString();

            const updatedResults = currentResults.map((result) => {
                if (getResultKey(result) !== resultKey) {
                    return result;
                }

                if (action === "approve") {
                    return {
                        ...result,
                        status: "approved",
                        reviewNote: "",
                        approvedAt: now,
                        returnedAt: null,
                        reviewedAt: now,
                    };
                }

                return {
                    ...result,
                    status: "returned",
                    reviewNote: note,
                    approvedAt: null,
                    returnedAt: now,
                    reviewedAt: now,
                };
            });

            localStorage.setItem(
                RESULTS_KEY,
                JSON.stringify(updatedResults)
            );

            // Verify that the intended status was saved.
            const savedResults = readArray(RESULTS_KEY);

            const savedTarget = savedResults.find(
                (result) => getResultKey(result) === resultKey
            );

            const expectedStatus =
                action === "approve" ? "approved" : "returned";

            if (
                !savedTarget ||
                normalizeStatus(savedTarget.status) !== expectedStatus
            ) {
                throw new Error(
                    "The saved result status could not be verified."
                );
            }

            setResults(savedResults);

            setFeedback((current) => {
                const next = { ...current };
                delete next[resultKey];
                return next;
            });

            showMessage(
                action === "approve"
                    ? "Result approved successfully."
                    : "Result returned for correction.",
                "success"
            );

            // Update the notification badge and other listeners.
            notifyResultsUpdated();
        } catch (error) {
            console.error("Could not update result:", error);

            showMessage(
                "Unable to save this result. Check browser storage and try again.",
                "error"
            );

            refresh();
        } finally {
            setSavingKey("");
        }
    }

    function openConfirmation(result, action) {
        const resultKey = getResultKey(result);
        const note = String(feedback[resultKey] || "").trim();

        if (action === "return" && !note) {
            showMessage(
                "Enter a correction reason before returning this result.",
                "error"
            );
            return;
        }

        if (action === "approve") {
            const validationError = validateResult(result);

            if (validationError) {
                showMessage(validationError, "error");
                return;
            }
        }

        showMessage("");

        setConfirmAction({
            type: action,
            resultKey,
            studentName:
                getStudent(result.studentId)?.name || "this student",
            sessionName:
                getSession(result.sessionId)?.name || "Unknown session",
            term: result.term || "Unknown term",
        });
    }

    function confirmReviewAction() {
        if (!confirmAction || savingKey) return;

        const { resultKey, type } = confirmAction;

        setConfirmAction(null);
        updateResult(resultKey, type);
    }

    return (
        <section className="space-y-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <div>
                <h2 className="text-xl font-bold text-green-950">
                    Results Review &amp; Approval
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Inspect individual subject marks before approving
                    results or requesting corrections.
                </p>
            </div>

            {/* STATUS COUNTERS */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl bg-blue-50 p-4">
                    <p className="text-sm text-blue-800">
                        Awaiting Review
                    </p>
                    <p className="mt-1 text-2xl font-bold text-blue-950">
                        {submittedResults.length}
                    </p>
                </div>

                <div className="rounded-xl bg-green-50 p-4">
                    <p className="text-sm text-green-800">Approved</p>
                    <p className="mt-1 text-2xl font-bold text-green-950">
                        {approvedCount}
                    </p>
                </div>

                <div className="rounded-xl bg-amber-50 p-4">
                    <p className="text-sm text-amber-800">
                        Returned for Correction
                    </p>
                    <p className="mt-1 text-2xl font-bold text-amber-950">
                        {returnedCount}
                    </p>
                </div>

                <div className="rounded-xl bg-gray-100 p-4">
                    <p className="text-sm text-gray-700">Drafts</p>
                    <p className="mt-1 text-2xl font-bold text-gray-950">
                        {draftCount}
                    </p>
                </div>
            </div>

            {/* FEEDBACK */}
            {message && (
                <div
                    role="status"
                    aria-live="polite"
                    className={`rounded-lg p-3 text-sm ${
                        messageType === "error"
                            ? "bg-red-50 text-red-800"
                            : messageType === "success"
                              ? "bg-green-50 text-green-800"
                              : "bg-gray-100 text-gray-800"
                    }`}
                >
                    {message}
                </div>
            )}

            {/* SUBMITTED RESULTS */}
            {submittedResults.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
                    <div className="mb-2 text-3xl text-green-800">✓</div>

                    <h3 className="font-semibold text-gray-800">
                        No results awaiting review
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                        Submitted results will appear here. Returned
                        results must be corrected and resubmitted before
                        they appear in this list again.
                    </p>
                </div>
            ) : (
                <div className="space-y-5">
                    {submittedResults.map((result) => {
                        const student = getStudent(result.studentId);
                        const session = getSession(result.sessionId);
                        const resultKey = getResultKey(result);
                        const isSaving = savingKey === resultKey;
                        const subjectEntries = Object.entries(
                            result.marks || {}
                        );
                        const average = getAverage(result);

                        return (
                            <article
                                key={resultKey}
                                className="rounded-xl border border-gray-200 p-4 sm:p-5"
                            >
                                {/* STUDENT DETAILS */}
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <h3 className="font-bold text-green-950">
                                            {student?.name ||
                                                result.studentName ||
                                                "Unknown student"}
                                        </h3>

                                        <p className="mt-1 text-sm text-gray-600">
                                            {student?.className ||
                                                result.className ||
                                                "Class unknown"}
                                            {student?.department
                                                ? ` · ${student.department}`
                                                : ""}
                                        </p>
                                    </div>

                                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                                        Submitted for review
                                    </span>
                                </div>

                                {/* RESULT SUMMARY */}
                                <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                                    <div>
                                        <p className="text-gray-500">Session</p>
                                        <p className="font-medium text-gray-900">
                                            {session?.name ||
                                                result.session ||
                                                "Unknown session"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-gray-500">Term</p>
                                        <p className="font-medium text-gray-900">
                                            {result.term || "Unknown term"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-gray-500">Subjects</p>
                                        <p className="font-medium text-gray-900">
                                            {subjectEntries.length}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-gray-500">
                                            Average subject score
                                        </p>
                                        <p className="font-medium text-gray-900">
                                            {average}
                                            {average !== "—" ? "%" : ""}
                                        </p>
                                    </div>
                                </div>

                                {/* SUBJECT MARKS */}
                                <div className="mt-5">
                                    <h4 className="mb-3 font-semibold text-green-950">
                                        Subject Marks for Review
                                    </h4>

                                    {subjectEntries.length === 0 ? (
                                        <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                                            No subject marks were found.
                                            This result cannot be approved
                                            until valid marks are recorded.
                                        </p>
                                    ) : (
                                        <div className="overflow-x-auto rounded-lg border border-gray-200">
                                            <table className="w-full min-w-[520px] text-left text-sm">
                                                <thead className="bg-green-950 text-white">
                                                    <tr>
                                                        <th className="px-3 py-3 font-semibold">
                                                            Subject
                                                        </th>
                                                        <th className="px-3 py-3 text-center font-semibold">
                                                            CA / 20
                                                        </th>
                                                        <th className="px-3 py-3 text-center font-semibold">
                                                            Exam / 80
                                                        </th>
                                                        <th className="px-3 py-3 text-center font-semibold">
                                                            Total / 100
                                                        </th>
                                                        <th className="px-3 py-3 text-center font-semibold">
                                                            Grade
                                                        </th>
                                                    </tr>
                                                </thead>

                                                <tbody className="divide-y divide-gray-100">
                                                    {subjectEntries.map(
                                                        ([subject, marks]) => {
                                                            const score =
                                                                getValidMarks(marks);

                                                            return (
                                                                <tr
                                                                    key={subject}
                                                                    className="even:bg-gray-50"
                                                                >
                                                                    <td className="px-3 py-3 font-medium text-gray-900">
                                                                        {subject}
                                                                    </td>

                                                                    <td className="px-3 py-3 text-center text-gray-700">
                                                                        {score
                                                                            ? score.ca
                                                                            : "—"}
                                                                    </td>

                                                                    <td className="px-3 py-3 text-center text-gray-700">
                                                                        {score
                                                                            ? score.exam
                                                                            : "—"}
                                                                    </td>

                                                                    <td className="px-3 py-3 text-center font-semibold text-gray-900">
                                                                        {score
                                                                            ? score.total
                                                                            : "—"}
                                                                    </td>

                                                                    <td className="px-3 py-3 text-center">
                                                                        <span
                                                                            className={`inline-flex min-w-8 justify-center rounded-md px-2 py-1 font-bold ${
                                                                                !score
                                                                                    ? "bg-gray-100 text-gray-500"
                                                                                    : score.total >= 50
                                                                                      ? "bg-green-100 text-green-800"
                                                                                      : score.total >= 40
                                                                                        ? "bg-amber-100 text-amber-800"
                                                                                        : "bg-red-100 text-red-800"
                                                                            }`}
                                                                        >
                                                                            {score
                                                                                ? getGrade(score.total)
                                                                                : "—"}
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        }
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    <p className="mt-2 text-xs leading-5 text-gray-500">
                                        Grades: A = 70–100, B = 60–69,
                                        C = 50–59, D = 45–49, E = 40–44,
                                        F = below 40.
                                    </p>
                                </div>

                                {/* CORRECTION REASON */}
                                <div className="mt-5">
                                    <label
                                        htmlFor={`feedback-${resultKey}`}
                                        className="mb-1 block text-sm font-medium text-gray-700"
                                    >
                                        Correction reason (required to return)
                                    </label>

                                    <textarea
                                        id={`feedback-${resultKey}`}
                                        rows={2}
                                        value={feedback[resultKey] || ""}
                                        disabled={Boolean(savingKey)}
                                        onChange={(event) => {
                                            setFeedback((current) => ({
                                                ...current,
                                                [resultKey]: event.target.value,
                                            }));

                                            setMessage("");
                                        }}
                                        placeholder="Explain what needs to be corrected..."
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100 disabled:bg-gray-100"
                                    />
                                </div>

                                {/* ACTION BUTTONS */}
                                <div className="mt-4 flex flex-wrap gap-3">
                                    <button
                                        type="button"
                                        disabled={Boolean(savingKey)}
                                        onClick={() =>
                                            openConfirmation(result, "approve")
                                        }
                                        className="rounded-lg bg-green-800 px-4 py-2 font-semibold text-white transition hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {isSaving
                                            ? "Saving..."
                                            : "Approve Result"}
                                    </button>

                                    <button
                                        type="button"
                                        disabled={Boolean(savingKey)}
                                        onClick={() =>
                                            openConfirmation(result, "return")
                                        }
                                        className="rounded-lg border border-red-300 px-4 py-2 font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {isSaving
                                            ? "Saving..."
                                            : "Return for Correction"}
                                    </button>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}

            <p className="text-xs leading-5 text-gray-500">
                This browser-based version is for development and testing.
                Approval controls are not protected by server-side user
                roles until the .NET backend is implemented.
            </p>

            {/* CONFIRMATION MODAL */}
            {confirmAction && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
                    onMouseDown={(event) => {
                        if (
                            event.target === event.currentTarget &&
                            !savingKey
                        ) {
                            setConfirmAction(null);
                        }
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="confirm-modal-title"
                        aria-describedby="confirm-modal-description"
                        className="w-full max-w-md overflow-hidden rounded-2xl border border-green-100 bg-white shadow-2xl"
                    >
                        <div className="bg-green-950 px-6 py-5 text-white">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-yellow-400/15 text-xl text-yellow-300">
                                    {confirmAction.type === "approve"
                                        ? "✓"
                                        : "↻"}
                                </div>

                                <div>
                                    <h3
                                        id="confirm-modal-title"
                                        className="text-lg font-bold"
                                    >
                                        {confirmAction.type === "approve"
                                            ? "Approve Results?"
                                            : "Return for Correction?"}
                                    </h3>

                                    <p className="mt-1 text-sm text-green-100">
                                        Greenfield School · Results Management
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 p-6">
                            <p
                                id="confirm-modal-description"
                                className="text-sm leading-6 text-gray-700"
                            >
                                {confirmAction.type === "approve"
                                    ? `Are you sure you want to approve ${confirmAction.studentName}'s results?`
                                    : `Are you sure you want to return ${confirmAction.studentName}'s results to the teacher for correction?`}
                            </p>

                            <div className="grid grid-cols-1 gap-3 rounded-xl bg-gray-50 p-3 text-sm sm:grid-cols-2">
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Session
                                    </p>
                                    <p className="font-semibold text-gray-800">
                                        {confirmAction.sessionName}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500">
                                        Term
                                    </p>
                                    <p className="font-semibold text-gray-800">
                                        {confirmAction.term}
                                    </p>
                                </div>
                            </div>

                            {confirmAction.type === "return" && (
                                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                                    <p className="text-xs font-bold uppercase tracking-wide text-amber-900">
                                        Correction reason
                                    </p>

                                    <p className="mt-1 whitespace-pre-wrap break-words text-sm text-amber-800">
                                        {feedback[confirmAction.resultKey]}
                                    </p>
                                </div>
                            )}

                            <p className="text-xs leading-5 text-gray-500">
                                {confirmAction.type === "approve"
                                    ? "Verify all marks before approving. This changes the result status."
                                    : "The correction reason will be saved with the result."}
                            </p>
                        </div>

                        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                disabled={Boolean(savingKey)}
                                onClick={() => setConfirmAction(null)}
                                className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                disabled={Boolean(savingKey)}
                                onClick={confirmReviewAction}
                                className={`rounded-xl px-5 py-2.5 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                    confirmAction.type === "approve"
                                        ? "bg-green-800 hover:bg-green-900"
                                        : "bg-red-700 hover:bg-red-800"
                                }`}
                            >
                                {savingKey === confirmAction.resultKey
                                    ? "Saving..."
                                    : confirmAction.type === "approve"
                                      ? "Yes, Approve"
                                      : "Yes, Return"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

export default ResultApprovalPanel;
