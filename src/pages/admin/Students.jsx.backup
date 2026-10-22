import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import classesData from "../../data/classes";

import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";

const generateStudentId = (students) => {
    const numbers = students
        .map((student) => {
            const match = student.id.match(/(\d+)$/);
            return match ? Number(match[1]) : NaN;
        })
        .filter((number) => !Number.isNaN(number));

    const nextNumber =
        numbers.length > 0
            ? Math.max(...numbers) + 1
            : 1;

    return `GfSP-${String(nextNumber).padStart(3, "0")}`;
};

function Students() {
    const [students, setStudents] = useState(() => {
        const savedStudents = localStorage.getItem(
            "greenfield_school_students"
        );

        return savedStudents ? JSON.parse(savedStudents) : [];
    });

    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [studentClass, setStudentClass] = useState("");
    const [department, setDepartment] = useState("");

    const [error, setError] = useState("");
    const [editingStudent, setEditingStudent] = useState(null);
    const [deletingStudent, setDeletingStudent] = useState(null);
    const [isDeleteAllOpen, setIsDeleteAllOpen] = useState(false);

    const [searchParams] = useSearchParams();
    const classFilter = searchParams.get("class");

    const isSeniorSecondary = studentClass.startsWith("SS");

    useEffect(() => {
        localStorage.setItem(
            "greenfield_school_students",
            JSON.stringify(students)
        );
    }, [students]);

    const filteredStudents = students.filter((student) => {
        const matchesSearch = `${student.name} ${student.className}`
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchesClass =
            !classFilter || student.className === classFilter;

        return matchesSearch && matchesClass;
    });

    const validateStudent = (name, studentClass, department) => {
        if (!name || !studentClass) {
            return "Please enter the student's name and select a class.";
        }

        if (studentClass.startsWith("SS") && !department) {
            return "Please select a department for SS students.";
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

        const name = `${firstName} ${middleName} ${lastName}`
            .trim()
            .replace(/\s+/g, " ");

        const validationError = validateStudent(
            name,
            studentClass,
            department
        );

        if (validationError) {
            setError(validationError);

            setTimeout(() => {
                setError("");
            }, 2000);

            return;
        }

        const newStudent = {
            id: generateStudentId(students),
            name,
            className: studentClass,
            department: isSeniorSecondary ? department : "",
            createdAt: new Date().toISOString().split("T")[0],
        };

        setStudents((currentStudents) => [
            ...currentStudents,
            newStudent,
        ]);

        setFirstName("");
        setMiddleName("");
        setLastName("");
        setStudentClass("");
        setDepartment("");
        setError("");
        setIsModalOpen(false);
    };

    const handleEditStudent = (student) => {
        const nameParts = student.name.split(" ");

        setFirstName(nameParts[0] || "");

        setMiddleName(
            nameParts.length > 2
                ? nameParts.slice(1, -1).join(" ")
                : ""
        );

        setLastName(
            nameParts.length > 1
                ? nameParts[nameParts.length - 1]
                : ""
        );

        setEditingStudent(student);
        setStudentClass(student.className);
        setDepartment(student.department || "");
        setError("");
        setIsModalOpen(true);
    };

    const handleUpdateStudent = (e) => {
        e.preventDefault();

        const name = `${firstName} ${middleName} ${lastName}`
            .trim()
            .replace(/\s+/g, " ");

        const validationError = validateStudent(
            name,
            studentClass,
            department
        );

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
                        department: studentClass.startsWith("SS")
                            ? department
                            : "",
                    }
                    : student
            )
        );

        setFirstName("");
        setMiddleName("");
        setLastName("");
        setStudentClass("");
        setDepartment("");
        setEditingStudent(null);
        setError("");
        setIsModalOpen(false);
    };

    const handleDeleteStudent = (studentId) => {
        setStudents((currentStudents) =>
            currentStudents.filter(
                (student) => student.id !== studentId
            )
        );
    };

    const handleDeleteAllStudents = () => {
        setStudents([]);
        setIsDeleteAllOpen(false);
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

                <div className="flex flex-wrap gap-3">
                    <Button
                        onClick={() => {
                            setEditingStudent(null);
                            setFirstName("");
                            setMiddleName("");
                            setLastName("");
                            setStudentClass("");
                            setDepartment("");
                            setError("");
                            setIsModalOpen(true);
                        }}
                    >
                        Add Student
                    </Button>

                    <Button
                        type="button"
                        variant="danger"
                        disabled={students.length === 0}
                        onClick={() => setIsDeleteAllOpen(true)}
                    >
                        Delete All
                    </Button>
                </div>

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

                                    {student.department && (
                                        <p className="mt-2 text-sm text-gray-600">
                                            Department:{" "}
                                            <span className="font-semibold text-green-950">
                                                {student.department}
                                            </span>
                                        </p>
                                    )}

                                    <div className="mt-4 flex justify-end gap-2">
                                        <Button
                                            type="button"
                                            onClick={() =>
                                                handleEditStudent(student)
                                            }
                                        >
                                            Edit
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="danger"
                                            onClick={() =>
                                                setDeletingStudent(student)
                                            }
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

            {/* ADD / EDIT STUDENT MODAL */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingStudent(null);
                    setError("");
                }}
                title={editingStudent ? "Edit Student" : "Add Student"}
            >

                <form
                    onSubmit={
                        editingStudent
                            ? handleUpdateStudent
                            : handleAddStudent
                    }
                    className="space-y-5"
                >

                    <Input
                        label="Student First Name"
                        type="text"
                        placeholder="Enter student first name"
                        value={firstName}
                        onChange={(e) =>
                            setFirstName(e.target.value)
                        }
                    />

                    <Input
                        label="Student Middle Name"
                        type="text"
                        placeholder="Enter student middle name"
                        value={middleName}
                        onChange={(e) =>
                            setMiddleName(e.target.value)
                        }
                    />

                    <Input
                        label="Student Last Name"
                        type="text"
                        placeholder="Enter student last name"
                        value={lastName}
                        onChange={(e) =>
                            setLastName(e.target.value)
                        }
                    />

                    {/* CLASS */}
                    <div className="w-full">
                        <label className="mb-2 block text-sm font-semibold text-green-950">
                            Class
                        </label>

                        <select
                            value={studentClass}
                            onChange={(e) =>
                                setStudentClass(e.target.value)
                            }
                            className="w-full rounded-xl border border-green-100 bg-white px-4 py-3 outline-none transition focus:border-green-950 focus:ring-2 focus:ring-green-950/10"
                        >
                            <option value="">
                                Select a class
                            </option>

                            {classesData.map((schoolClass) => (
                                <option
                                    key={schoolClass.id}
                                    value={schoolClass.name}
                                >
                                    {schoolClass.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* DEPARTMENT */}
                    {isSeniorSecondary && (
                        <div className="w-full">
                            <label className="mb-2 block text-sm font-semibold text-green-950">
                                Department
                            </label>

                            <select
                                value={department}
                                onChange={(e) =>
                                    setDepartment(e.target.value)
                                }
                                className="w-full rounded-xl border border-green-100 bg-white px-4 py-3 outline-none focus:border-green-950 focus:ring-2 focus:ring-green-950/10"
                            >
                                <option value="">
                                    Select department
                                </option>

                                <option value="Science">
                                    Science
                                </option>

                                <option value="Arts">
                                    Arts
                                </option>

                                <option value="Commercial">
                                    Commercial
                                </option>
                            </select>
                        </div>
                    )}

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
                                setFirstName("");
                                setMiddleName("");
                                setLastName("");
                                setStudentClass("");
                                setDepartment("");
                                setError("");
                            }}
                        >
                            Cancel
                        </Button>

                        <Button type="submit">
                            {editingStudent
                                ? "Save Changes"
                                : "Add Student"}
                        </Button>

                    </div>

                </form>
            </Modal>

            {/* DELETE STUDENT MODAL */}
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
                            onClick={() =>
                                setDeletingStudent(null)
                            }
                        >
                            Cancel
                        </Button>

                        <Button
                            type="button"
                            variant="danger"
                            onClick={() => {
                                handleDeleteStudent(
                                    deletingStudent.id
                                );
                                setDeletingStudent(null);
                            }}
                        >
                            Delete
                        </Button>

                    </div>

                </div>
            </Modal>

            {/* DELETE ALL STUDENTS MODAL */}
            <Modal
                isOpen={isDeleteAllOpen}
                onClose={() => setIsDeleteAllOpen(false)}
                title="Delete All Students"
            >
                <div className="space-y-5">

                    <p className="text-gray-600">
                        Are you sure you want to delete{" "}
                        <span className="font-semibold text-red-600">
                            all {students.length} students
                        </span>
                        ?
                    </p>

                    <p className="text-sm text-gray-500">
                        This will permanently remove all student records
                        from this browser.
                    </p>

                    <div className="flex justify-end gap-3">

                        <Button
                            type="button"
                            onClick={() =>
                                setIsDeleteAllOpen(false)
                            }
                        >
                            Cancel
                        </Button>

                        <Button
                            type="button"
                            variant="danger"
                            onClick={handleDeleteAllStudents}
                        >
                            Delete All
                        </Button>

                    </div>

                </div>
            </Modal>

        </div>
    );
}

export default Students;