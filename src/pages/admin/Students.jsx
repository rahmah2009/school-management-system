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
    const [editingStudent, setEditingStudent] = useState(null);
    const [deletingStudent, setDeletingStudent] = useState(null);

    const filteredStudents = students.filter((student) =>
        `${student.name} ${student.className}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const validateStudent = (name, studentClass) => {
        if (!name || !studentClass) {
            return "Please enter the student's name and select a class.";
        }

        const namePattern = /^[A-Za-z]+(?: [A-Za-z]+)+$/;

        if (!namePattern.test(name)) {
            return "Please enter a valid full name using letters only.";
        }

        if (name.length < 3) {
            return "Student name is too short.";
        }

        return "";
    };

    const handleAddStudent = (e) => {
        e.preventDefault();

        const name = studentName.trim();

        const validationError = validateStudent(name, studentClass);

        if (validationError) {
            setError(validationError);

            setTimeout(() => {
                setError("");
            }, 2000);

            return;
        }

        console.log("New student:", name, studentClass);
        console.log("Existing students:", students);

        const duplicateStudent = students.some(
            (student) =>
                student.name.toLowerCase() === name.toLowerCase() &&
                student.className === studentClass
        );

        if (duplicateStudent) {
            setError("A student with this name already exists in this class.");

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

    const handleEditStudent = (student) => {
        setEditingStudent(student);
        setStudentName(student.name);
        setStudentClass(student.className);
        setError("");
        setIsModalOpen(true);
    };

    const handleUpdateStudent = (e) => {
        e.preventDefault();

        const name = studentName.trim();

        const validationError = validateStudent(name, studentClass);

        if (validationError) {
            setError(validationError);

            setTimeout(() => {
                setError("");
            }, 2000);

            return;
        }

        setStudents((currentStudents) =>
            currentStudents.map((student) =>
                student.id === editingStudent.id
                    ? {
                        ...student,
                        name,
                        className: studentClass,
                    }
                    : student
            )
        );

        setStudentName("");
        setStudentClass("");
        setEditingStudent(null);
        setError("");
        setIsModalOpen(false);
    };

    const handleDeleteStudent = (studentId) => {
        setStudents((currentStudents) =>
            currentStudents.filter((student) => student.id !== studentId)
        );
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

                <Button
                    onClick={() => {
                        setEditingStudent(null);
                        setStudentName("");
                        setStudentClass("");
                        setError("");
                        setIsModalOpen(true);
                    }}
                >
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

                                    <div className="mt-4 flex justify-end gap-2">
                                        <Button
                                            type="button"
                                            onClick={() => handleEditStudent(student)}
                                        >
                                            Edit
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="danger"
                                            onClick={() => setDeletingStudent(student)}
                                        >
                                            Delete
                                        </Button>
                                    </div>

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
                title={editingStudent ? "Edit Student" : "Add Student"}
            >


                <form
                    onSubmit={editingStudent ? handleUpdateStudent : handleAddStudent}
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
                                setEditingStudent(null);
                                setError("");
                            }}
                        >
                            Cancel
                        </Button>

                        <Button type="submit">
                            {editingStudent ? "Save Changes" : "Add Student"}
                        </Button>

                    </div>

                </form>
            </Modal>

            <Modal
                isOpen={Boolean(deletingStudent)}
                onClose={() => setDeletingStudent(null)}
                title="Delete Student"
            >
                <div className="space-y-5">

                    <p className="text-gray-600">
                        Are you sure you want to delete{" "}
                        <span className="font-semibold text-green-950">
                            {deletingStudent?.name}
                        </span>
                        ?
                    </p>

                    <div className="flex justify-end gap-3">

                        <Button
                            type="button"
                            onClick={() => setDeletingStudent(null)}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="button"
                            variant="danger"
                            onClick={() => {
                                handleDeleteStudent(deletingStudent.id);
                                setDeletingStudent(null);
                            }}
                        >
                            Delete
                        </Button>

                    </div>

                </div>
            </Modal>
        </div>
    );
}

export default Students;
