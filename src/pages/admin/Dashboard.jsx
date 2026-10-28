import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    Users,
    GraduationCap,
    School,
    ClipboardCheck,
    FileText,
    ArrowRight,
    UserPlus,
    BookOpen,
} from "lucide-react";

import StatCard from "../../components/common/StatCard";
import classesData from "../../data/classes";
import { getStudents } from "../../services/studentApi";

const TEACHERS_KEY = "greenfield_school_teachers";
const RESULTS_KEY = "greenfield_school_results";

function readStorage(key) {
    try {
        const savedData = localStorage.getItem(key);

        if (!savedData) {
            return [];
        }

        const parsedData = JSON.parse(savedData);

        return Array.isArray(parsedData) ? parsedData : [];
    } catch (error) {
        console.error(`Unable to read ${key} from localStorage:`, error);
        return [];
    }
}

function formatDate(dateValue) {
    if (!dateValue) {
        return "Date unavailable";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "Date unavailable";
    }

    return date.toLocaleDateString("en-NG", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function getStudentName(student) {
    if (student.name) {
        return student.name;
    }

    return [
        student.firstName,
        student.middleName,
        student.lastName,
    ]
        .filter(Boolean)
        .join(" ") || "Unnamed Student";
}

function getStudentDate(student) {
    return student.createdAt || student.created_at || null;
}

function Dashboard() {
    const [students, setStudents] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [results, setResults] = useState([]);

    const [studentsLoading, setStudentsLoading] = useState(true);
    const [studentsError, setStudentsError] = useState("");

    const refreshDashboard = useCallback(async () => {
        // These records still use localStorage for now.
        setTeachers(readStorage(TEACHERS_KEY));
        setResults(readStorage(RESULTS_KEY));

        setStudentsLoading(true);
        setStudentsError("");

        try {
            const backendStudents = await getStudents();

            setStudents(
                Array.isArray(backendStudents) ? backendStudents : []
            );
        } catch (error) {
            console.error("Dashboard student fetch failed:", error);

            setStudentsError(
                error.message || "Unable to load student records."
            );
        } finally {
            setStudentsLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshDashboard();

        const handleStorageChange = (event) => {
            if (
                !event ||
                !event.key ||
                [TEACHERS_KEY, RESULTS_KEY].includes(event.key)
            ) {
                refreshDashboard();
            }
        };

        const handleDashboardUpdate = () => {
            refreshDashboard();
        };

        window.addEventListener("focus", handleDashboardUpdate);
        window.addEventListener("storage", handleStorageChange);

        window.addEventListener(
            "greenfield-results-updated",
            handleDashboardUpdate
        );

        window.addEventListener(
            "greenfield-students-updated",
            handleDashboardUpdate
        );

        window.addEventListener(
            "greenfield-teachers-updated",
            handleDashboardUpdate
        );

        window.addEventListener(
            "greenfield-classes-updated",
            handleDashboardUpdate
        );

        return () => {
            window.removeEventListener("focus", handleDashboardUpdate);
            window.removeEventListener("storage", handleStorageChange);

            window.removeEventListener(
                "greenfield-results-updated",
                handleDashboardUpdate
            );

            window.removeEventListener(
                "greenfield-students-updated",
                handleDashboardUpdate
            );

            window.removeEventListener(
                "greenfield-teachers-updated",
                handleDashboardUpdate
            );

            window.removeEventListener(
                "greenfield-classes-updated",
                handleDashboardUpdate
            );
        };
    }, [refreshDashboard]);

    const today = new Date().toLocaleDateString("en-NG", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const recentStudents = useMemo(() => {
        return [...students]
            .sort((a, b) => {
                const dateA = getStudentDate(a);
                const dateB = getStudentDate(b);

                const timeA = dateA ? new Date(dateA).getTime() : 0;
                const timeB = dateB ? new Date(dateB).getTime() : 0;

                return (
                    (Number.isNaN(timeB) ? 0 : timeB) -
                    (Number.isNaN(timeA) ? 0 : timeA)
                );
            })
            .slice(0, 5);
    }, [students]);

    const resultStatistics = useMemo(() => {
        const submitted = results.filter(
            (result) =>
                String(result.status || "draft").toLowerCase() ===
                "submitted"
        ).length;

        const approved = results.filter(
            (result) =>
                String(result.status || "draft").toLowerCase() ===
                "approved"
        ).length;

        return {
            total: results.length,
            submitted,
            approved,
        };
    }, [results]);

    const totalClasses = Array.isArray(classesData)
        ? classesData.length
        : 0;

    return (
        <div className="space-y-8">
            {/* Page heading */}
            <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-wider text-yellow-600">
                        School Administration
                    </p>

                    <h1 className="mt-1 text-3xl font-bold text-green-950">
                        Dashboard
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Welcome to Greenfield School&apos;s management
                        dashboard.
                    </p>
                </div>

                <div className="rounded-xl border border-green-100 bg-white px-4 py-3 shadow-sm">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Today
                    </p>

                    <p className="mt-1 font-semibold text-green-950">
                        {today}
                    </p>
                </div>
            </section>

            {/* Main statistics */}
            <section>
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-green-950">
                        School Overview
                    </h2>

                    <span className="text-sm text-gray-500">
                        Current records
                    </span>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        title="TOTAL STUDENTS"
                        value={
                            studentsError
                                ? "—"
                                : studentsLoading && students.length === 0
                                  ? "..."
                                  : students.length
                        }
                        icon={<Users />}
                        link="/admin/students"
                    />

                    <StatCard
                        title="TOTAL TEACHERS"
                        value={teachers.length}
                        icon={<GraduationCap />}
                        link="/admin/teachers"
                    />

                    <StatCard
                        title="TOTAL CLASSES"
                        value={totalClasses}
                        icon={<School />}
                        link="/admin/classes"
                    />

                    <StatCard
                        title="AWAITING REVIEW"
                        value={resultStatistics.submitted}
                        icon={<ClipboardCheck />}
                        link="/admin/results"
                    />
                </div>
            </section>

            {/* Results overview */}
            <section className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="text-xl font-bold text-green-950">
                            Results Overview
                        </h2>

                        <p className="mt-1 text-sm text-gray-600">
                            Track recorded results and approval progress.
                        </p>
                    </div>

                    <Link
                        to="/admin/results"
                        className="inline-flex items-center gap-2 self-start font-semibold text-green-800 hover:text-yellow-700 sm:self-auto"
                    >
                        Manage Results
                        <ArrowRight size={17} />
                    </Link>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl bg-green-50 p-5">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-white p-2 text-green-800 shadow-sm">
                                <FileText size={20} />
                            </div>

                            <p className="text-sm font-medium text-gray-600">
                                Saved Result Records
                            </p>
                        </div>

                        <p className="mt-4 text-3xl font-bold text-green-950">
                            {resultStatistics.total}
                        </p>
                    </div>

                    <div className="rounded-xl bg-yellow-50 p-5">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-white p-2 text-yellow-700 shadow-sm">
                                <ClipboardCheck size={20} />
                            </div>

                            <p className="text-sm font-medium text-gray-600">
                                Awaiting Review
                            </p>
                        </div>

                        <p className="mt-4 text-3xl font-bold text-green-950">
                            {resultStatistics.submitted}
                        </p>
                    </div>

                    <div className="rounded-xl bg-blue-50 p-5">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-white p-2 text-blue-700 shadow-sm">
                                <GraduationCap size={20} />
                            </div>

                            <p className="text-sm font-medium text-gray-600">
                                Approved Results
                            </p>
                        </div>

                        <p className="mt-4 text-3xl font-bold text-green-950">
                            {resultStatistics.approved}
                        </p>
                    </div>
                </div>
            </section>

            {/* Quick actions */}
            <section className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
                <div>
                    <h2 className="text-xl font-bold text-green-950">
                        Quick Actions
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                        Jump straight to the tasks you handle most often.
                    </p>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <Link
                        to="/admin/students"
                        className="group flex items-center gap-4 rounded-xl border border-green-100 p-4 transition hover:-translate-y-1 hover:border-green-300 hover:shadow-md"
                    >
                        <div className="rounded-xl bg-green-50 p-3 text-green-800 transition group-hover:bg-green-100">
                            <UserPlus size={23} />
                        </div>

                        <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-green-950">
                                Manage Students
                            </h3>
                            <p className="mt-1 text-sm text-gray-600">
                                Student records
                            </p>
                        </div>

                        <ArrowRight
                            size={17}
                            className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-green-800"
                        />
                    </Link>

                    <Link
                        to="/admin/teachers"
                        className="group flex items-center gap-4 rounded-xl border border-green-100 p-4 transition hover:-translate-y-1 hover:border-green-300 hover:shadow-md"
                    >
                        <div className="rounded-xl bg-green-50 p-3 text-green-800 transition group-hover:bg-green-100">
                            <GraduationCap size={23} />
                        </div>

                        <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-green-950">
                                Manage Teachers
                            </h3>
                            <p className="mt-1 text-sm text-gray-600">
                                Staff records
                            </p>
                        </div>

                        <ArrowRight
                            size={17}
                            className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-green-800"
                        />
                    </Link>

                    <Link
                        to="/admin/classes"
                        className="group flex items-center gap-4 rounded-xl border border-green-100 p-4 transition hover:-translate-y-1 hover:border-green-300 hover:shadow-md"
                    >
                        <div className="rounded-xl bg-green-50 p-3 text-green-800 transition group-hover:bg-green-100">
                            <School size={23} />
                        </div>

                        <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-green-950">
                                Manage Classes
                            </h3>
                            <p className="mt-1 text-sm text-gray-600">
                                Class information
                            </p>
                        </div>

                        <ArrowRight
                            size={17}
                            className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-green-800"
                        />
                    </Link>

                    <Link
                        to="/admin/results"
                        className="group flex items-center gap-4 rounded-xl border border-green-100 p-4 transition hover:-translate-y-1 hover:border-green-300 hover:shadow-md"
                    >
                        <div className="rounded-xl bg-green-50 p-3 text-green-800 transition group-hover:bg-green-100">
                            <BookOpen size={23} />
                        </div>

                        <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-green-950">
                                Manage Results
                            </h3>
                            <p className="mt-1 text-sm text-gray-600">
                                Record and approve
                            </p>
                        </div>

                        <ArrowRight
                            size={17}
                            className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-green-800"
                        />
                    </Link>
                </div>
            </section>

            {/* Recent students */}
            <section className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-bold text-green-950">
                            Recent Students
                        </h2>

                        <p className="mt-1 text-sm text-gray-600">
                            The latest student records available.
                        </p>
                    </div>

                    <Link
                        to="/admin/students"
                        className="inline-flex shrink-0 items-center gap-1 font-semibold text-green-800 hover:text-yellow-700"
                    >
                        View All
                        <ArrowRight size={16} />
                    </Link>
                </div>

                {studentsLoading && students.length === 0 ? (
                    <p className="mt-6 rounded-xl bg-green-50 p-6 text-center text-gray-600">
                        Loading student records...
                    </p>
                ) : studentsError ? (
                    <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5">
                        <p className="font-semibold text-red-800">
                            Unable to load students
                        </p>

                        <p className="mt-2 text-sm text-red-700">
                            {studentsError}
                        </p>

                        <button
                            type="button"
                            onClick={refreshDashboard}
                            className="mt-4 rounded-lg bg-green-950 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
                        >
                            Try Again
                        </button>
                    </div>
                ) : recentStudents.length === 0 ? (
                    <div className="mt-6 rounded-xl border border-dashed border-green-200 bg-green-50/50 px-5 py-10 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-green-800 shadow-sm">
                            <Users size={24} />
                        </div>

                        <h3 className="mt-4 font-bold text-green-950">
                            No students yet
                        </h3>

                        <p className="mx-auto mt-2 max-w-sm text-sm text-gray-600">
                            Student records will appear here after they have
                            been added to the system.
                        </p>

                        <Link
                            to="/admin/students"
                            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-green-950 px-4 py-2.5 font-semibold text-white transition hover:bg-green-800"
                        >
                            Manage Students
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                ) : (
                    <div className="mt-5 space-y-3">
                        {recentStudents.map((student, index) => (
                            <div
                                key={
                                    student.dbId ||
                                    student.studentId ||
                                    student.id ||
                                    `${getStudentName(student)}-${index}`
                                }
                                className="flex flex-col gap-3 rounded-xl border border-green-50 bg-green-50/50 p-4 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-100 font-bold text-green-900">
                                        {getStudentName(student)
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate font-semibold text-green-950">
                                            {getStudentName(student)}
                                        </p>

                                        <p className="mt-1 text-sm text-gray-600">
                                            {student.className ||
                                                student.class ||
                                                "Class not specified"}
                                        </p>
                                    </div>
                                </div>

                                <div className="sm:text-right">
                                    {student.studentId || student.id ? (
                                        <p className="text-sm font-medium text-green-900">
                                            {student.studentId || student.id}
                                        </p>
                                    ) : null}

                                    <p className="mt-1 text-sm text-gray-500">
                                        Added:{" "}
                                        {formatDate(getStudentDate(student))}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default Dashboard;
