import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Users, GraduationCap, School } from "lucide-react";
import StatCard from "../../components/common/StatCard"
// import studentsData from "../../data/students"
import teachersData from "../../data/teachers";
import classesData from "../../data/classes";

function Dashboard() {

    const [students, setStudents] = useState([]);
    const [teachers, setTeachers] = useState([]);

    useEffect(() => {
        const loadDashboardData = () => {
            const savedStudents = localStorage.getItem(
                "greenfield_school_students"
            );

            const savedTeachers = localStorage.getItem(
                "greenfield_school_teachers"
            );

            setStudents(
                savedStudents ? JSON.parse(savedStudents) : []
            );

            setTeachers(
                savedTeachers ? JSON.parse(savedTeachers) : []
            );
        };

        loadDashboardData();
    }, []);

    const today = new Date().toLocaleDateString("en-NG", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const recentStudents = [...students]
        .sort(
            (a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt)
        )
        .slice(0, 4);
    return (
        <div>
            <div>
                <h1 className="text-3xl font-bold text-green-950">
                    Dashboard
                </h1>

                <p className="mt-2 text-gray-600">
                    Welcome to Greenfield School's management dashboard.
                </p>

                <p className="mt-1 text-sm font-medium text-gray-500">
                    {today}
                </p>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard
                    title="TOTAL STUDENTS"
                    value={students.length}
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
                    value={classesData.length}
                    icon={<School />}
                    link="/admin/classes"
                />
            </div>

            <div className="mt-8 rounded-2xl border border-green-100 bg-white p-6 shadow-md">
                <h2 className="text-xl font-bold text-green-950">
                    Quick Overview
                </h2>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Link
                        to="/admin/students"
                        className="rounded-xl border border-green-100 p-4 transition hover:-translate-y-1 hover:shadow-md"
                    >
                        <h3 className="font-bold text-green-950">
                            Manage Students
                        </h3>

                        <p className="mt-1 text-sm text-gray-600">
                            View and manage student records.
                        </p>
                    </Link>

                    <Link
                        to="/admin/teachers"
                        className="rounded-xl border border-green-100 p-4 transition hover:-translate-y-1 hover:shadow-md"
                    >
                        <h3 className="font-bold text-green-950">
                            Manage Teachers
                        </h3>

                        <p className="mt-1 text-sm text-gray-600">
                            View and manage teacher records.
                        </p>
                    </Link>

                    <Link
                        to="/admin/classes"
                        className="rounded-xl border border-green-100 p-4 transition hover:-translate-y-1 hover:shadow-md"
                    >
                        <h3 className="font-bold text-green-950">
                            Manage Classes
                        </h3>

                        <p className="mt-1 text-sm text-gray-600">
                            View and manage school classes.
                        </p>
                    </Link>
                </div>
            </div>
            <div className="mt-8 rounded-2xl border border-green-100 bg-white p-6 shadow-md">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-green-950">
                        Recent Students
                    </h2>

                    <Link
                        to="/admin/students"
                        className="font-semibold text-green-950 hover:underline"
                    >
                        View All
                    </Link>
                </div>

                <div className="mt-5 space-y-3">
                    {recentStudents.map((student) => (
                        <div
                            key={student.id}
                            className="flex items-center justify-between rounded-xl bg-green-50 p-4"
                        >
                            <div>
                                <p className="font-semibold text-green-950">
                                    {student.name}
                                </p>

                                <p className="mt-1 text-sm text-gray-600">
                                    {student.className}
                                </p>
                            </div>

                            <p className="text-sm text-gray-500">
                                {student.createdAt}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Dashboard