import { useEffect, useMemo, useState } from "react";
import subjectsData from "../../data/subjects";
import { getStudents } from "../../services/studentApi";

const RESULTS_KEY = "greenfield_school_results";
const STUDENTS_KEY = "greenfield_school_students";
const SESSIONS_KEY = "greenfield_school_sessions";
const SETTINGS_KEY = "greenfield_school_settings";

const TERMS = ["First Term", "Second Term", "Third Term"];

const DEFAULT_GRADING_SCALE = [
    { grade: "A", minScore: 70, remark: "Excellent" },
    { grade: "B", minScore: 60, remark: "Very Good" },
    { grade: "C", minScore: 50, remark: "Good" },
    { grade: "D", minScore: 45, remark: "Fair" },
    { grade: "E", minScore: 40, remark: "Pass" },
    { grade: "F", minScore: 0, remark: "Fail" },
];

function readArray(key) {
    try {
        const data = localStorage.getItem(key);
        const parsed = data ? JSON.parse(data) : [];

        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error(`Could not read ${key}:`, error);
        return [];
    }
}

function normalizeStudent(student) {
    const firstName = student.first_name || student.firstName || "";
    const middleName = student.middle_name || student.middleName || "";
    const lastName = student.last_name || student.lastName || "";

    return {
        ...student,
        id: student.id,
        studentId: student.student_id || student.studentId || "",
        name:
            student.name ||
            [firstName, middleName, lastName]
                .filter(Boolean)
                .join(" "),
        className:
            student.className ||
            student.class_name ||
            student.class ||
            "",
        department: student.department || "",
    };
}

// Read the grading scale saved in Admin Settings.
function readGradingScale() {
    try {
        const data = localStorage.getItem(SETTINGS_KEY);

        if (!data) {
            return DEFAULT_GRADING_SCALE.map((item) => ({ ...item }));
        }

        const settings = JSON.parse(data);
        const scale = settings?.gradingScale;

        if (
            !Array.isArray(scale) ||
            scale.length !== DEFAULT_GRADING_SCALE.length
        ) {
            return DEFAULT_GRADING_SCALE.map((item) => ({ ...item }));
        }

        const validScale = scale.every((item, index) => {
            const score = Number(item?.minScore);

            return (
                item?.grade === DEFAULT_GRADING_SCALE[index].grade &&
                Number.isInteger(score) &&
                score >= 0 &&
                score <= 100 &&
                typeof item.remark === "string" &&
                item.remark.trim() !== "" &&
                (
                    index === 0 ||
                    score < Number(scale[index - 1].minScore)
                )
            );
        });

        if (!validScale || Number(scale[5].minScore) !== 0) {
            return DEFAULT_GRADING_SCALE.map((item) => ({ ...item }));
        }

        return scale.map((item) => ({
            grade: item.grade,
            minScore: Number(item.minScore),
            remark: item.remark.trim(),
        }));
    } catch (error) {
        console.error("Could not read grading scale:", error);

        return DEFAULT_GRADING_SCALE.map((item) => ({ ...item }));
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

    // Load the current grading scale from Admin Settings.
    const [gradingScale, setGradingScale] = useState(readGradingScale);

    const [selectedStudent, setSelectedStudent] = useState("");
    const [selectedSession, setSelectedSession] = useState("");
    const [selectedTerm, setSelectedTerm] = useState("First Term");

    const [marks, setMarks] = useState({});
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");

    const [showSubmitConfirmation, setShowSubmitConfirmation] =
        useState(false);

    const [showDraftConfirmation, setShowDraftConfirmation] =
        useState(false);

    // Load students from the backend and other records from localStorage.
    useEffect(() => {
        let isMounted = true;

        async function loadSchoolData() {
            try {
                const [backendStudents] = await Promise.all([
                    getStudents(),
                ]);

                if (!isMounted) return;

                const loadedStudents = Array.isArray(backendStudents)
                    ? backendStudents.map(normalizeStudent)
                    : [];

                const loadedSessions = readArray(SESSIONS_KEY);
                const loadedResults = readArray(RESULTS_KEY);

                setStudents(loadedStudents);
                setSessions(loadedSessions);
                setSavedResults(loadedResults);
                setGradingScale(readGradingScale());

                if (loadedStudents.length > 0) {
                    setSelectedStudent((current) => {
                        const stillExists = loadedStudents.some(
                            (student) => String(student.id) === current
                        );

                        return stillExists
                            ? current
                            : String(loadedStudents[0].id);
                    });
                }

                const activeSession = loadedSessions.find(
                    (session) => session.isActive
                );

                if (activeSession) {
                    setSelectedSession(String(activeSession.id));
                } else if (loadedSessions.length > 0) {
                    setSelectedSession((current) => {
                        const stillExists = loadedSessions.some(
                            (session) => String(session.id) === current
                        );

                        return stillExists
                            ? current
                            : String(loadedSessions[0].id);
                    });
                }
            } catch (error) {
                console.error("Could not load result recording data:", error);
            }
        }

        loadSchoolData();

        return () => {
            isMounted = false;
        };
    }, []);

    // Refresh backend students and locally stored result/session data.
    useEffect(() => {
        let isMounted = true;

        async function refresh() {
            try {
                const backendStudents = await getStudents();

                if (!isMounted) return;

                const loadedStudents = Array.isArray(backendStudents)
                    ? backendStudents.map(normalizeStudent)
                    : [];

                setStudents(loadedStudents);

                setSessions(readArray(SESSIONS_KEY));
                setSavedResults(readArray(RESULTS_KEY));
                setGradingScale(readGradingScale());

                setSelectedStudent((current) => {
                    if (
                        loadedStudents.some(
                            (student) => String(student.id) === current
                        )
                    ) {
                        return current;
                    }

                    return String(loadedStudents[0]?.id || "");
                });
            } catch (error) {
                console.error("Could not refresh result recording data:", error);
            }
        }

        const handleRefresh = () => {
            refresh();
        };

        window.addEventListener("focus", handleRefresh);
        window.addEventListener("storage", handleRefresh);

        window.addEventListener(
            "greenfield-results-updated",
            handleRefresh
        );

        window.addEventListener(
            "greenfield-settings-updated",
            handleRefresh
        );

        window.addEventListener(
            "greenfield-students-updated",
            handleRefresh
        );

        return () => {
            isMounted = false;

            window.removeEventListener("focus", handleRefresh);
            window.removeEventListener("storage", handleRefresh);

            window.removeEventListener(
                "greenfield-results-updated",
                handleRefresh
            );

            window.removeEventListener(
                "greenfield-settings-updated",
                handleRefresh
            );

            window.removeEventListener(
                "greenfield-students-updated",
                handleRefresh
            );
        };
    }, []);

    // Close either confirmation modal with Escape.
    useEffect(() => {
        if (!showSubmitConfirmation && !showDraftConfirmation) {
            return;
        }

        function handleKeyDown(event) {
            if (event.key === "Escape") {
                setShowSubmitConfirmation(false);
                setShowDraftConfirmation(false);
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [showSubmitConfirmation, showDraftConfirmation]);

    const student = students.find(
        (item) => String(item.id) === selectedStudent
    );

    const selectedSessionData = sessions.find(
        (item) => String(item.id) === selectedSession
    );

    const availableSubjects = useMemo(() => {
        if (!student) return [];

        const className = String(
            student.className || ""
        ).toUpperCase();

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

    // Load marks when the selected result changes.
    useEffect(() => {
        const result = savedResults.find(
            (item) =>
                String(item.studentId) === selectedStudent &&
                String(item.sessionId) === selectedSession &&
                item.term === selectedTerm
        );

        if (result) {
            const nextMarks = {};

            Object.entries(result.marks || {}).forEach(
                ([subject, score]) => {
                    nextMarks[subject] = {
                        ca: score?.ca ?? "",
                        exam: score?.exam ?? "",
                    };
                }
            );

            setMarks(nextMarks);
        } else {
            setMarks({});
        }

        setMessage("");
    }, [
        selectedStudent,
        selectedSession,
        selectedTerm,
        savedResults,
    ]);

    function updateMark(subject, field, value) {
        if (isLocked) return;

        if (value !== "") {
            const number = Number(value);
            const maximum = field === "ca" ? 20 : 80;

            if (
                !Number.isFinite(number) ||
                number < 0 ||
                number > maximum
            ) {
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

        if (
            !score ||
            score.ca === "" ||
            score.exam === ""
        ) {
            return "—";
        }

        return Number(score.ca) + Number(score.exam);
    }

    // Calculate grades using the scale saved in Admin Settings.
    function getGrade(total) {
        const score = Number(total);

        const matchedGrade = gradingScale.find(
            (item) => score >= item.minScore
        );

        return matchedGrade?.grade || "F";
    }

    // Save a draft or submit results using the existing storage workflow.
    function saveResult(nextStatus) {
        if (
            !student ||
            !selectedSessionData ||
            !selectedTerm
        ) {
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

        const now = new Date().toISOString();

        const result = {
            ...(oldResult || {}),

            id:
                oldResult?.id ||
                (
                    globalThis.crypto?.randomUUID?.() ??
                    `result-${Date.now()}-${Math.random()
                        .toString(36)
                        .slice(2, 9)}`
                ),

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
            updatedAt: now,

            ...(nextStatus === "submitted"
                ? {
                    submittedAt: now,
                    approvedAt: null,
                    returnedAt: null,
                    reviewedAt: null,
                }
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
            localStorage.setItem(
                RESULTS_KEY,
                JSON.stringify(updatedResults)
            );

            setSavedResults(updatedResults);
            notifyResultsUpdated();

            setMessageType("success");
            setMessage(
                nextStatus === "submitted"
                    ? "Results submitted successfully for review."
                    : "Draft saved successfully."
            );
        } catch (error) {
            console.error("Could not save result:", error);

            setMessageType("error");
            setMessage(
                "Could not save the result. Check available browser storage."
            );
        }
    }

    // Open the draft confirmation.
    function handleSaveDraft() {
        setMessage("");

        if (
            !student ||
            !selectedSessionData ||
            !selectedTerm
        ) {
            setMessageType("error");
            setMessage("Please select a student, session and term.");
            return;
        }

        if (isLocked) {
            setMessageType("error");
            setMessage("This result is locked and cannot be edited.");
            return;
        }

        setShowDraftConfirmation(true);
    }

    function confirmSaveDraft() {
        setShowDraftConfirmation(false);
        saveResult("draft");
    }

    // Open the submission confirmation.
    function handleSubmitForReview() {
        setMessage("");

        if (
            !student ||
            !selectedSessionData ||
            !selectedTerm
        ) {
            setMessageType("error");
            setMessage("Please select a student, session and term.");
            return;
        }

        if (isLocked) {
            setMessageType("error");
            setMessage(
                "This result is locked and cannot be submitted again."
            );
            return;
        }

        setShowSubmitConfirmation(true);
    }

    function confirmSubmitForReview() {
        setShowSubmitConfirmation(false);
        saveResult("submitted");
    }

    const completedSubjects = availableSubjects.filter(
        (subject) => {
            const score = marks[subject];

            return (
                score &&
                score.ca !== "" &&
                score.exam !== "" &&
                Number.isFinite(Number(score.ca)) &&
                Number.isFinite(Number(score.exam))
            );
        }
    ).length;

    // Shared details used in both confirmation modals.
    function ResultDetails() {
        return (
            <div className="divide-y divide-gray-200 rounded-xl border border-gray-200 bg-gray-50 px-4">
                <div className="flex items-start justify-between gap-4 py-3">
                    <span className="text-sm text-gray-500">
                        Student
                    </span>
                    <span className="max-w-[65%] text-right text-sm font-semibold text-green-950">
                        {student?.name || "Not selected"}
                    </span>
                </div>

                <div className="flex items-start justify-between gap-4 py-3">
                    <span className="text-sm text-gray-500">
                        Class
                    </span>
                    <span className="text-right text-sm font-semibold text-gray-900">
                        {student?.className || "—"}
                    </span>
                </div>

                <div className="flex items-start justify-between gap-4 py-3">
                    <span className="text-sm text-gray-500">
                        Academic session
                    </span>
                    <span className="text-right text-sm font-semibold text-gray-900">
                        {selectedSessionData?.name || "Not selected"}
                    </span>
                </div>

                <div className="flex items-start justify-between gap-4 py-3">
                    <span className="text-sm text-gray-500">
                        Term
                    </span>
                    <span className="text-right text-sm font-semibold text-gray-900">
                        {selectedTerm}
                    </span>
                </div>

                <div className="flex items-start justify-between gap-4 py-3">
                    <span className="text-sm text-gray-500">
                        Completed subjects
                    </span>
                    <span className="text-right text-sm font-semibold text-gray-900">
                        {completedSubjects} of {availableSubjects.length}
                    </span>
                </div>
            </div>
        );
    }

    function ModalCloseButton({ onClick, label }) {
        return (
            <button
                type="button"
                onClick={onClick}
                className="rounded-lg p-2 text-green-100 transition hover:bg-white/10 hover:text-white"
                aria-label={label}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-5 w-5"
                    aria-hidden="true"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m6 6 12 12M18 6 6 18"
                    />
                </svg>
            </button>
        );
    }

    function ModalHeader({ title, description, onClose }) {
        return (
            <div className="bg-green-950 px-6 py-5 text-white sm:px-7">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-yellow-300/30 bg-yellow-400/15 text-yellow-300">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-7 w-7"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 3.75h14v16.5H5zM8 3.75v5h8v-5M8 20.25v-7h8v7"
                            />
                        </svg>
                    </div>

                    <div className="min-w-0 flex-1">
                        <h2 className="text-xl font-bold sm:text-2xl">
                            {title}
                        </h2>
                        <p className="mt-1 text-sm text-green-100">
                            {description}
                        </p>
                    </div>

                    <ModalCloseButton
                        onClick={onClose}
                        label="Close confirmation"
                    />
                </div>
            </div>
        );
    }

    function ConfirmationModal({
        type,
        title,
        description,
        body,
        noticeTitle,
        notice,
        confirmText,
        onClose,
        onConfirm,
    }) {
        const isDraft = type === "draft";
        const titleId = `${type}-confirmation-title`;
        const descriptionId = `${type}-confirmation-description`;

        return (
            <div
                className="fixed inset-0 z-[110] flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
                onMouseDown={(event) => {
                    if (event.target === event.currentTarget) {
                        onClose();
                    }
                }}
            >
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={titleId}
                    aria-describedby={descriptionId}
                    className="my-auto w-full max-w-lg overflow-hidden rounded-2xl border border-green-100 bg-white shadow-2xl"
                >
                    <div className="bg-green-950 px-6 py-5 text-white sm:px-7">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-yellow-300/30 bg-yellow-400/15 text-yellow-300">
                                {isDraft ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        className="h-7 w-7"
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M5 3.75h14v16.5H5zM8 3.75v5h8v-5M8 20.25v-7h8v7"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        className="h-7 w-7"
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M8 4.75h8A2.25 2.25 0 0 1 18.25 7v13.25H5.75V7A2.25 2.25 0 0 1 8 4.75Z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9 4.75V3.5h6v1.25M8.5 11h7M8.5 14.5h7M8.5 18h4"
                                        />
                                    </svg>
                                )}
                            </div>

                            <div className="min-w-0 flex-1">
                                <h2
                                    id={titleId}
                                    className="text-xl font-bold sm:text-2xl"
                                >
                                    {title}
                                </h2>
                                <p className="mt-1 text-sm text-green-100">
                                    Greenfield School · Results Management
                                </p>
                            </div>

                            <ModalCloseButton
                                onClick={onClose}
                                label="Close confirmation"
                            />
                        </div>
                    </div>

                    <div className="space-y-5 p-5 sm:p-7">
                        <p
                            id={descriptionId}
                            className="text-sm leading-6 text-gray-600"
                        >
                            {description}
                        </p>

                        {body}

                        <ResultDetails />

                        <div
                            className={`flex gap-3 rounded-xl border p-4 ${isDraft
                                ? "border-blue-200 bg-blue-50"
                                : "border-amber-200 bg-amber-50"
                                }`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                className={`mt-0.5 h-5 w-5 shrink-0 ${isDraft
                                    ? "text-blue-700"
                                    : "text-amber-700"
                                    }`}
                                aria-hidden="true"
                            >
                                <circle cx="12" cy="12" r="9" />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 11v5m0-8h.01"
                                />
                            </svg>

                            <div>
                                <p
                                    className={`text-sm font-semibold ${isDraft
                                        ? "text-blue-950"
                                        : "text-amber-950"
                                        }`}
                                >
                                    {noticeTitle}
                                </p>
                                <p
                                    className={`mt-1 text-sm leading-5 ${isDraft
                                        ? "text-blue-900"
                                        : "text-amber-900"
                                        }`}
                                >
                                    {notice}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-xl border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={onConfirm}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-800 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m5 12 4 4L19 6"
                                    />
                                </svg>
                                {confirmText}
                            </button>
                        </div>
                    </div>

                    <div className="h-1.5 bg-yellow-400" />
                </div>
            </div>
        );
    }

    return (
        <>
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

                {status === "returned" &&
                    existingResult?.reviewNote && (
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
                            onChange={(event) => setSelectedStudent(event.target.value)}
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-700"
                        >
                            <option value="">Select student</option>

                            {students.map((item) => (
                                <option
                                    key={item.id}
                                    value={String(item.id)}
                                >
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
                                <option
                                    key={item.id}
                                    value={String(item.id)}
                                >
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
                            onChange={(event) =>
                                setSelectedTerm(event.target.value)
                            }
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
                        Select a student with a recognised class and
                        department to load the correct subjects.
                    </p>
                )}

                {message && (
                    <div
                        role="status"
                        aria-live="polite"
                        className={`rounded-lg p-3 text-sm ${messageType === "success"
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
                            onClick={handleSaveDraft}
                            className="rounded-lg border border-green-800 px-4 py-2.5 font-semibold text-green-900 transition hover:bg-green-50"
                        >
                            Save Draft
                        </button>

                        <button
                            type="button"
                            onClick={handleSubmitForReview}
                            className="rounded-lg bg-green-800 px-4 py-2.5 font-semibold text-white transition hover:bg-green-900"
                        >
                            Submit for Review
                        </button>
                    </div>
                )}
            </div>

            {/* SAVE DRAFT CONFIRMATION MODAL */}
            {showDraftConfirmation && (
                <ConfirmationModal
                    type="draft"
                    title="Save Results as Draft?"
                    description="Would you like to save the current marks as a draft? Review the details below before continuing."
                    body={null}
                    noticeTitle="Draft mode"
                    notice="Saving a draft does not submit the result for approval. You can return to it later to continue editing."
                    confirmText="Yes, Save Draft"
                    onClose={() => setShowDraftConfirmation(false)}
                    onConfirm={confirmSaveDraft}
                />
            )}

            {/* SUBMIT FOR REVIEW CONFIRMATION MODAL */}
            {showSubmitConfirmation && (
                <ConfirmationModal
                    type="submit"
                    title="Submit Results for Review?"
                    description="Are you sure you want to submit these results? Please review the details below before continuing."
                    body={null}
                    noticeTitle="Before you submit"
                    notice="Check that all marks are correct. After submission, the result will be locked until it is returned for correction."
                    confirmText="Yes, Submit"
                    onClose={() => setShowSubmitConfirmation(false)}
                    onConfirm={confirmSubmitForReview}
                />
            )}
        </>
    );
}

export default ResultRecordingSheet;
