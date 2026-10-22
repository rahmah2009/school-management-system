
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import classesData from "../../data/classes";

import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";

import {
    getStudents,
    createStudent,
    updateStudent,
    deleteStudent,
} from "../../services/studentApi";

function Students() {
    const [students, setStudents] = useState([]);
    const [isLoadingStudents, setIsLoadingStudents] = useState(true);
    const [apiError, setApiError] = useState("");
    const [isSaving, setIsSaving] = useState(false);

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

    // Load students from PostgreSQL when the page opens.
    useEffect(() => {
        let isMounted = true;

        async function loadStudents() {
            try {
                setApiError("");

                const savedStudents = await getStudents();

                if (isMounted) {
                    setStudents(savedStudents);
                }
            } catch (err) {
                if (isMounted) {
                    setApiError(
                        err.message ||
                            "Unable to load students from the server."
                    );
                }
            } finally {
                if (isMounted) {
                    setIsLoadingStudents(false);
                }
            }
        }

        loadStudents();

        return () => {
            isMounted = false;
        };
    }, []);

    const filteredStudents = students.filter((student) => {
        const matchesSearch = `${student.name} ${student.className || ""}`
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchesClass =
            !classFilter || student.className === classFilter;

        return matchesSearch && matchesClass;
    });

    const validateStudent = (name, selectedClass, selectedDepartment) => {
        if (!firstName.trim() || !lastName.trim() || !selectedClass) {
            return "Please enter the student's first and last names and select a class.";
        }

        if (
            selectedClass.startsWith("SS") &&
            !selectedDepartment
        ) {
            return "Please select a department for SS students.";
        }

        const namePattern = /^[A-Za-z]+(?: [A-Za-z]+)*$/;

        if (!namePattern.test(name)) {
            return "Please enter a valid name using letters and spaces only.";
        }

        if (name.length < 3) {
            return "Student name is too short.";
        }

        return "";
    };

    const resetForm = () => {
        setFirstName("");
        setMiddleName("");
        setLastName("");
        setStudentClass("");
        setDepartment("");
        setError("");
        setEditingStudent(null);
    };

    const closeForm = () => {
        setIsModalOpen(false);
        resetForm();
    };

    const handleAddStudent = async (e) => {
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
            return;
        }

        try {
            setIsSaving(true);
            setError("");
            setApiError("");

            const newStudent = await createStudent({
                firstName: firstName.trim(),
                middleName: middleName.trim(),
                lastName: lastName.trim(),
                className: studentClass,
                department: isSeniorSecondary ? department : "",
            });

            setStudents((currentStudents) => [
                ...currentStudents,
                newStudent,
            ]);

            closeForm();
        } catch (err) {
            setError(
                err.message || "Unable to register this student."
            );
        } finally {
            setIsSaving(false);
        }
    };

    const handleEditStudent = (student) => {
        const nameParts = student.name.trim().split(/\s+/);

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
        setStudentClass(student.className || "");
        setDepartment(student.department || "");
        setError("");
        setApiError("");
        setIsModalOpen(true);
    };

    const handleUpdateStudent = async (e) => {
        e.preventDefault();

        if (!editingStudent?.dbId) {
            setError("The database ID is missing. Reload the student list and try again.");
            return;
        }

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
            return;
        }

        try {
            setIsSaving(true);
            setError("");
            setApiError("");

            const updatedStudent = await updateStudent(
                editingStudent.dbId,
                {
                    firstName: firstName.trim(),
                    middleName: middleName.trim(),
                    lastName: lastName.trim(),
                    className: studentClass,
                    department: studentClass.startsWith("SS")
                        ? department
                        : "",
                }
            );

            setStudents((currentStudents) =>
                currentStudents.map((student) =>
                    student.dbId === updatedStudent.dbId
                        ? updatedStudent
                        : student
                )
            );

            closeForm();
        } catch (err) {
            setError(
                err.message || "Unable to update this student."
            );
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteStudent = async (student) => {
        if (!student?.dbId) {
            setApiError(
                "The database ID is missing. Reload the student list and try again."
            );
            return;
        }

        try {
            setApiError("");

            await deleteStudent(student.dbId);

            setStudents((currentStudents) =>
                currentStudents.filter(
                    (item) => item.dbId !== student.dbId
                )
            );

            setDeletingStudent(null);
        } catch (err) {
            setApiError(
                err.message || "Unable to delete this student."
            );
        }
    };

    const handleDeleteAllStudents = async () => {
        try {
            setIsSaving(true);
            setApiError("");

            // Delete each student from the database.
            await Promise.all(
                students.map((student) => {
                    if (!student.dbId) {
                        throw new Error(
                            "A student is missing its database ID. Reload the list and try again."
                        );
                    }

                    return deleteStudent(student.dbId);
                })
            );

            setStudents([]);
            setIsDeleteAllOpen(false);
        } catch (err) {
            setApiError(
                err.message ||
                    "Unable to delete all students. Please refresh and check the records."
            );

            // Refresh from the database in case some deletions succeeded.
            try {
                const savedStudents = await getStudents();
                setStudents(savedStudents);
            } catch {
                // Keep the existing list if refreshing also fails.
            }
        } finally {
            setIsSaving(false);
        }
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
                        type="button"
                        onClick={() => {
                            resetForm();
                            setApiError("");
                            setIsModalOpen(true);
                        }}
                    >
                        Add Student
                    </Button>

                    <Button
                        type="button"
                        variant="danger"
                        disabled={
                            students.length === 0 ||
                            isLoadingStudents ||
                            isSaving
                        }
                        onClick={() => setIsDeleteAllOpen(true)}
                    >
                        Delete All
                    </Button>
                </div>
            </div>

            {/* API ERROR */}
            {apiError && (
                <div
                    role="alert"
                    className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"
                >
                    {apiError}
                </div>
            )}

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
                                (student.className || "").startsWith("JSS")
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
                                (student.className || "").startsWith("SS")
                            ).length
                        }
                    </p>
                </Card>
            </div>

            {/* SEARCH AND STUDENT LIST */}
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

                <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {isLoadingStudents ? (
                        <div className="col-span-full rounded-xl bg-green-50 p-8 text-center">
                            <p className="font-semibold text-green-950">
                                Loading students...
                            </p>
                        </div>
                    ) : filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => (
                            <Card
                                key={student.dbId}
                                title={student.name}
                                description={`Class: ${student.className || "Not assigned"}`}
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
                onClose={closeForm}
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
                        onChange={(e) => setFirstName(e.target.value)}
                    />

                    <Input
                        label="Student Middle Name"
                        type="text"
                        placeholder="Enter student middle name"
                        value={middleName}
                        onChange={(e) => setMiddleName(e.target.value)}
                    />

                    <Input
                        label="Student Last Name"
                        type="text"
                        placeholder="Enter student last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />

                    {/* CLASS */}
                    <div className="w-full">
                        <label className="mb-2 block text-sm font-semibold text-green-950">
                            Class
                        </label>

                        <select
                            value={studentClass}
                            onChange={(e) => setStudentClass(e.target.value)}
                            required
                            className="w-full rounded-xl border border-green-100 bg-white px-4 py-3 outline-none transition focus:border-green-950 focus:ring-2 focus:ring-green-950/10"
                        >
                            <option value="">Select a class</option>

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
                                onChange={(e) => setDepartment(e.target.value)}
                                required
                                className="w-full rounded-xl border border-green-100 bg-white px-4 py-3 outline-none focus:border-green-950 focus:ring-2 focus:ring-green-950/10"
                            >
                                <option value="">Select department</option>
                                <option value="Science">Science</option>
                                <option value="Arts">Arts</option>
                                <option value="Commercial">Commercial</option>
                            </select>
                        </div>
                    )}

                    {error && (
                        <p
                            role="alert"
                            className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-600"
                        >
                            {error}
                        </p>
                    )}

                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            disabled={isSaving}
                            onClick={closeForm}
                        >
                            Cancel
                        </Button>

                        <Button type="submit" disabled={isSaving}>
                            {isSaving
                                ? "Saving..."
                                : editingStudent
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
                            onClick={() => setDeletingStudent(null)}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="button"
                            variant="danger"
                            onClick={() =>
                                handleDeleteStudent(deletingStudent)
                            }
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
                        This permanently deletes these student records from
                        the school database.
                    </p>

                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            disabled={isSaving}
                            onClick={() => setIsDeleteAllOpen(false)}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="button"
                            variant="danger"
                            disabled={isSaving}
                            onClick={handleDeleteAllStudents}
                        >
                            {isSaving ? "Deleting..." : "Delete All"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default Students;
