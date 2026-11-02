
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import classesData from "../../data/classes";
import { getStudents } from "../../services/studentApi";

function Classes() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        async function fetchStudents() {
            try {
                setLoading(true);
                setError("");

                const backendStudents = await getStudents();

                if (isMounted) {
                    setStudents(
                        Array.isArray(backendStudents)
                            ? backendStudents
                            : []
                    );
                }
            } catch (err) {
                console.error("Failed to fetch students:", err);

                if (isMounted) {
                    setError(
                        err.message || "Unable to load student records."
                    );
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchStudents();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold text-green-950">
                Classes
            </h1>

            <p className="mt-2 text-gray-600">
                Manage school classes here.
            </p>

            {error && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
                    <p className="font-medium text-red-700">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="mt-3 text-sm font-semibold text-green-800 hover:underline"
                    >
                        Try Again
                    </button>
                </div>
            )}

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {classesData.map((schoolClass) => {
                    const studentCount = students.filter(
                        (student) =>
                            String(student.className || "").trim().toLowerCase() ===
                            String(schoolClass.name || "").trim().toLowerCase()
                    ).length;

                    return (
                        <Link
                            key={schoolClass.id}
                            to={`/admin/students?class=${encodeURIComponent(
                                schoolClass.name
                            )}`}
                            className="block rounded-2xl border border-green-100 bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-lg"
                        >
                            <p className="text-sm font-semibold text-yellow-600">
                                {schoolClass.id}
                            </p>

                            <h2 className="mt-2 text-xl font-bold text-green-950">
                                {schoolClass.name}
                            </h2>

                            <p className="mt-2 text-sm font-medium text-green-800">
                                {schoolClass.section}
                            </p>

                            <p className="mt-2 text-sm text-gray-600">
                                {schoolClass.description}
                            </p>

                            <p className="mt-4 font-semibold text-green-950">
                                {loading
                                    ? "Loading..."
                                    : `${studentCount} ${
                                        studentCount === 1
                                            ? "Student"
                                            : "Students"
                                    }`}
                            </p>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

export default Classes;
