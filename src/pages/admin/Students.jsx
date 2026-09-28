import { useState } from "react";
import studentsData from "../../data/students";

import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";

const schoolClasses = [
    "JSS 1",
    "JSS 2",
    "JSS 3",
    "SS 1",
    "SS 2",
    "SS 3",
]

function Students() {
    const [students, setStudents] = useState(studentsData);
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [studentName, setStudentName] = useState("");
    const [studentClass, setStudentClass] = useState("");
    const [error, setError] = useState("");

    const filteredStudents = students.filter((student) =>
        `${student.name} ${student.className}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const handleAddStudent = (e) => {
        e.preventDefault();

        const name = studentName.trim();

        // Check that both fields are filled
        if (!name || !studentClass) {
            setError("Please enter the student's name and select a class.");

            setTimeout(() => {
                setError("");
            }, 2000);

            return;
        }

        // Name must contain letters and spaces only
        const namePattern = /^[A-Za-z]+(?: [A-Za-z]+)+$/;

        if (!namePattern.test(name)) {
            setError("Please enter a valid full name using letters only.");

            setTimeout(() => {
                setError("");
            }, 2000);

            return;
        }

        // Name must be at least 3 characters long
        if (name.length < 3) {
            setError("Student name is too short.");

            setTimeout(() => {
                setError("");
            }, 2000);

            return;
        }

        const newStudent = {
            id: `GfS-${String(students.length + 1).padStart(3, "0")}`,
            name,
            className: studentClass,
            createdAt: new Date().toISOString().split("T")[0],
        };

        setStudents((currentStudents) => [
            ...currentStudents,
            newStudent,
        ]);

        setStudentName("");
        setStudentClass("");
        setError("");
        setIsModalOpen(false);
    };

    return (
        <div>

            {/* PAGE HEADER */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div>
                    <h1 className="text-3xl font-bold text-green-950">
                        Students
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Manage student records and information.
                    </p>
                </div>

                <Button onClick={() => setIsModalOpen(true)}>
                    Add Student
                </Button>

            </div>

            {/* STUDENT SUMMARY */}
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                <Card
                    title="Total Students"
                    description="Number of students currently registered."
                >
                    <p className="mt-4 text-3xl font-bold text-green-950">
                        {students.length}
                    </p>
                </Card>

                <Card
                    title="JSS Students"
                    description="Students currently in the junior secondary classes."
                >
                    <p className="mt-4 text-3xl font-bold text-green-950">
                        {
                            students.filter((student) =>
                                student.className.startsWith("JSS")
                            ).length
                        }
                    </p>
                </Card>

                <Card
                    title="SS Students"
                    description="Students currently in the senior secondary classes."
                >
                    <p className="mt-4 text-3xl font-bold text-green-950">
                        {
                            students.filter((student) =>
                                student.className.startsWith("SS")
                            ).length
                        }
                    </p>
                </Card>

            </div>

            {/* SEARCH */}
            <section className="mt-10 rounded-2xl border border-green-100 bg-white p-6 shadow-md">

                <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

                    <div>
                        <h2 className="text-xl font-bold text-green-950">
                            Student Records
                        </h2>

                        <p className="mt-1 text-sm text-gray-600">
                            Search students by name or class.
                        </p>
                    </div>

                    <div className="w-full md:max-w-sm">
                        <Input
                            type="text"
                            placeholder="Search students..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                </div>

                {/* STUDENT LIST */}
                <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                    {filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => (
                            <Card
                                key={student.id}
                                title={student.name}
                                description={`Class: ${student.className}`}
                            >
                                <div className="mt-4 border-t border-green-100 pt-4">

                                    <p className="text-sm text-gray-500">
                                        Student ID
                                    </p>

                                    <p className="mt-1 font-semibold text-green-950">
                                        #{student.id}
                                    </p>

                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full rounded-xl bg-green-50 p-8 text-center">
                            <p className="font-semibold text-green-950">
                                No students found.
                            </p>

                            <p className="mt-1 text-sm text-gray-600">
                                Try searching with a different name or class.
                            </p>
                        </div>
                    )}

                </div>

            </section>

            {/* ADD STUDENT MODAL */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setError("");
                }}
                title="Add Student"
            >
                <form
                    onSubmit={handleAddStudent}
                    className="space-y-5"
                >

                    <Input
                        label="Student Name"
                        type="text"
                        placeholder="Enter student name"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                    />

                    <div className="w-full">
                        <label className="mb-2 block text-sm font-semibold text-green-950">
                            Class
                        </label>

                        <select
                            value={studentClass}
                            onChange={(e) => setStudentClass(e.target.value)}
                            className="w-full rounded-xl border border-green-100 bg-white px-4 py-3 outline-none transition focus:border-green-950 focus:ring-2 focus:ring-green-950/10"
                        >
                            <option value="">Select a class</option>

                            {schoolClasses.map((schoolClass) => (
                                <option key={schoolClass} value={schoolClass}>
                                    {schoolClass}
                                </option>
                            ))}
                        </select>
                    </div>

                    {error && (
                        <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-600">
                            {error}
                        </p>
                    )}

                    <div className="flex justify-end gap-3">

                        <Button
                            type="button"
                            onClick={() => {
                                setIsModalOpen(false);
                                setError("");
                            }}
                        >
                            Cancel
                        </Button>

                        <Button type="submit">
                            Add Student
                        </Button>

                    </div>

                </form>
            </Modal>

        </div>
    );
}

export default Students;
var