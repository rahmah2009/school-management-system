import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import classesData from "../../data/classes";

function Classes() {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const savedStudents = localStorage.getItem(
            "greenfield_school_students"
        );

        if (savedStudents) {
            setStudents(JSON.parse(savedStudents));
        }
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold text-green-950">
                Classes
            </h1>

            <p className="mt-2 text-gray-600">
                Manage school classes here.
            </p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {classesData.map((schoolClass) => {
                    const studentCount = students.filter(
                        (student) =>
                            student.className === schoolClass.name
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
                                {studentCount}{" "}
                                {studentCount === 1
                                    ? "Student"
                                    : "Students"}
                            </p>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

export default Classes;