import teachersData from "../../data/teachers";
import departmentsData from "../../data/departments";
import { useEffect, useState } from "react";
import { Edit, Plus, Search, Trash2, X } from "lucide-react";

function Teachers() {
    const [teachers, setTeachers] = useState(() => {
        const savedTeachers = localStorage.getItem(
            "greenfield_school_teachers"
        );

        if (savedTeachers) {
            const parsedTeachers = JSON.parse(savedTeachers);

            return parsedTeachers.map((savedTeacher) => {
                const originalTeacher = teachersData.find(
                    (teacher) => teacher.id === savedTeacher.id
                );

                return {
                    ...originalTeacher,
                    ...savedTeacher,
                    email: savedTeacher.email || originalTeacher?.email || "",
                    phone: savedTeacher.phone || originalTeacher?.phone || "",
                    description:
                        savedTeacher.description ||
                        originalTeacher?.description ||
                        "",
                };
            });
        }

        return teachersData;
    });

    const formatPhoneNumber = (phone) => {
        const cleaned = phone.replace(/\D/g, "");

        if (cleaned.startsWith("0") && cleaned.length === 11) {
            const international = "234" + cleaned.slice(1);

            return `+${international.slice(0, 3)} ${international.slice(3, 6)} ${international.slice(6, 9)} ${international.slice(9)}`;
        }

        if (cleaned.startsWith("234") && cleaned.length === 13) {
            return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
        }

        return phone;
    };

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("All");

    const [showForm, setShowForm] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState(null);

    const [teacherName, setTeacherName] = useState("");
    const [department, setDepartment] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [subject, setSubject] = useState("");
    const [description, setDescription] = useState("");

    const [error, setError] = useState("");

    const [teacherToDelete, setTeacherToDelete] = useState(null);
    const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);

    // const departments = [
    //     "Science & Mathematics",
    //     "Arts & Humanities",
    //     "Science & Technology",
    //     "Commercial Studies",
    //     "Languages",
    //     "Social Sciences",
    //     "Physical Education",
    // ];

    useEffect(() => {
        localStorage.setItem(
            "greenfield_school_teachers",
            JSON.stringify(teachers)
        );
    }, [teachers]);

    const generateTeacherId = (teacherList) => {
        const numbers = teacherList
            .map((teacher) =>
                Number(teacher.id.replace("TCH-", ""))
            )
            .filter((number) => !Number.isNaN(number));

        const nextNumber =
            numbers.length > 0
                ? Math.max(...numbers) + 1
                : 1;

        return `TCH-${String(nextNumber).padStart(3, "0")}`;
    };

    const resetForm = () => {
        setTeacherName("");
        setSubject("");
        setDescription("");
        setDepartment("");
        setEmail("");
        setPhone("");
        setError("");
        setEditingTeacher(null);
    };

    const handleOpenAddForm = () => {
        resetForm();
        setShowForm(true);
    };

    const handleCloseForm = () => {
        resetForm();
        setShowForm(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!teacherName.trim()) {
            setError("Please enter the teacher's name.");
            return;
        }

        if (!department) {
            setError("Please select a department.");
            return;
        }

        if (!email.trim()) {
            setError("Please enter the teacher's email.");
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email.trim())) {
            setError("Please enter a valid email address.");
            return;
        }

        if (!phone.trim()) {
            setError("Please enter the teacher's phone number.");
            return;
        }

        const phonePattern = /^(\+234|0)[789][01]\d{8}$/;

        if (!phonePattern.test(phone.trim())) {
            setError("Please enter a valid Nigerian phone number.");
            return;
        }

        if (!subject.trim()) {
            setError("Subject is required.");
            return;
        }

        if (!description.trim()) {
            setError("Description is required.");
            return;
        }

        if (editingTeacher) {
            setTeachers((currentTeachers) =>
                currentTeachers.map((teacher) =>
                    teacher.id === editingTeacher.id
                        ? {
                            ...teacher,
                            name: teacherName.trim(),
                            subject: subject.trim(),
                            description: description.trim(),
                            department,
                            email: email.trim(),
                            phone: formatPhoneNumber(phone.trim()),
                        }
                        : teacher
                )
            );
        } else {
            const newTeacher = {
                id: generateTeacherId(teachers),
                name: teacherName.trim(),
                subject: subject.trim(),
                description: description.trim(),
                department,
                email: email.trim(),
                phone: formatPhoneNumber(phone.trim()),
            };
            setTeachers((currentTeachers) => [
                ...currentTeachers,
                newTeacher,
            ]);
        }

        handleCloseForm();
    };

    const handleEdit = (teacher) => {
        setEditingTeacher(teacher);

        setTeacherName(teacher.name);
        setSubject(teacher.subject || "");
        setDescription(teacher.description || "");
        setDepartment(teacher.department);
        setEmail(teacher.email);
        setPhone(teacher.phone);

        setError("");
        setShowForm(true);
    };

    const handleDelete = () => {
        if (!teacherToDelete) return;

        setTeachers((currentTeachers) =>
            currentTeachers.filter(
                (teacher) => teacher.id !== teacherToDelete.id
            )
        );

        setTeacherToDelete(null);
    };

    const handleDeleteAll = () => {
        setTeachers([]);
        setShowDeleteAllModal(false);
    };

    const filteredTeachers = teachers.filter((teacher) => {
        const matchesSearch =
            teacher.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            teacher.id
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            teacher.email
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

        const matchesDepartment =
            selectedDepartment === "All" ||
            teacher.department === selectedDepartment;

        return matchesSearch && matchesDepartment;
    });

    return (
        <div>
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-green-950">
                        Teachers
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Manage teachers and their information.
                    </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                    {teachers.length > 0 && (
                        <button
                            onClick={() => setShowDeleteAllModal(true)}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700"
                        >
                            <Trash2 size={20} />
                            Delete All
                        </button>
                    )}

                    <button
                        onClick={handleOpenAddForm}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-950 px-5 py-3 font-semibold text-white transition hover:bg-green-800"
                    >
                        <Plus size={20} />
                        Add Teacher
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-gray-500">
                        Total Teachers
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-green-950">
                        {teachers.length}
                    </h2>
                </div>

                <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-gray-500">
                        Departments
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-green-950">
                        {
                            new Set(
                                teachers.map(
                                    (teacher) =>
                                        teacher.department
                                )
                            ).size
                        }
                    </h2>
                </div>

                <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-gray-500">
                        Showing
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-green-950">
                        {filteredTeachers.length}
                    </h2>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-green-100 bg-white p-5 shadow-sm md:flex-row">
                <div className="relative flex-1">
                    <Search
                        size={20}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) =>
                            setSearchTerm(e.target.value)
                        }
                        placeholder="Search teachers..."
                        className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
                    />
                </div>

                <select
                    value={selectedDepartment}
                    onChange={(e) =>
                        setSelectedDepartment(e.target.value)
                    }
                    className="rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
                >
                    <option value="All">
                        All Departments
                    </option>

                    {departmentsData.map((department) => (
                        <option key={department} value={department}>
                            {department}
                        </option>
                    ))}
                </select>
            </div>

            {/* Teachers List */}
            <div className="mt-8">
                {filteredTeachers.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-green-200 bg-white p-10 text-center">
                        <h2 className="text-xl font-bold text-green-950">
                            No teachers found
                        </h2>

                        <p className="mt-2 text-gray-600">
                            {teachers.length === 0
                                ? "Add your first teacher to get started."
                                : "Try changing your search or filter."}
                        </p>

                        {teachers.length === 0 && (
                            <button
                                onClick={handleOpenAddForm}
                                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-green-950 px-5 py-3 font-semibold text-white transition hover:bg-green-800"
                            >
                                <Plus size={20} />
                                Add Teacher
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-2xl border border-green-100 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[1200px]">
                                <thead className="bg-green-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-green-950">
                                            Teacher
                                        </th>

                                        <th className="px-6 py-4 text-left text-sm font-semibold text-green-950">
                                            Department
                                        </th>

                                        <th className="px-6 py-4 text-left text-sm font-semibold text-green-950">
                                            Subject
                                        </th>

                                        <th className="px-6 py-4 text-left text-sm font-semibold text-green-950">
                                            Description
                                        </th>

                                        <th className="px-6 py-4 text-left text-sm font-semibold text-green-950">
                                            Email
                                        </th>

                                        <th className="px-6 py-4 text-left text-sm font-semibold text-green-950">
                                            Phone
                                        </th>

                                        <th className="px-6 py-4 text-right text-sm font-semibold text-green-950">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100">
                                    {filteredTeachers.map(
                                        (teacher) => (
                                            <tr
                                                key={teacher.id}
                                                className="transition hover:bg-green-50/50"
                                            >
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-100 font-bold text-green-900">
                                                            {teacher.name
                                                                .split(" ")
                                                                .map(
                                                                    (
                                                                        word
                                                                    ) =>
                                                                        word[0]
                                                                )
                                                                .join("")
                                                                .slice(
                                                                    0,
                                                                    2
                                                                )
                                                                .toUpperCase()}
                                                        </div>

                                                        <div>
                                                            <p className="font-semibold text-green-950">
                                                                {
                                                                    teacher.name
                                                                }
                                                            </p>

                                                            <p className="text-sm text-gray-500">
                                                                {
                                                                    teacher.id
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-5 text-sm text-gray-700">
                                                    {
                                                        teacher.department
                                                    }
                                                </td>

                                                <td className="px-6 py-5 text-sm text-gray-700">
                                                    {teacher.subject}
                                                </td>

                                                <td className="px-6 py-5 text-sm text-gray-700">
                                                    <p className="max-w-xs">
                                                        {teacher.description}
                                                    </p>
                                                </td>

                                                <td className="px-6 py-5 text-sm text-gray-700">
                                                    {teacher.email}
                                                </td>

                                                <td className="px-6 py-5 text-sm text-gray-700">
                                                    {formatPhoneNumber(teacher.phone || "")}
                                                </td>

                                                <td className="px-6 py-5">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() =>
                                                                handleEdit(
                                                                    teacher
                                                                )
                                                            }
                                                            className="rounded-lg p-2 text-green-800 transition hover:bg-green-100"
                                                            aria-label={`Edit ${teacher.name}`}
                                                        >
                                                            <Edit
                                                                size={
                                                                    19
                                                                }
                                                            />
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                setTeacherToDelete(
                                                                    teacher
                                                                )
                                                            }
                                                            className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                                                            aria-label={`Delete ${teacher.name}`}
                                                        >
                                                            <Trash2
                                                                size={
                                                                    19
                                                                }
                                                            />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Add/Edit Teacher Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-green-950">
                                    {editingTeacher
                                        ? "Edit Teacher"
                                        : "Add Teacher"}
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    {editingTeacher
                                        ? "Update teacher information."
                                        : "Enter the teacher's information."}
                                </p>
                            </div>

                            <button
                                onClick={handleCloseForm}
                                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
                            >
                                <X size={22} />
                            </button>
                        </div>

                        {error && (
                            <div className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                                {error}
                            </div>
                        )}

                        <form
                            onSubmit={handleSubmit}
                            className="mt-6 space-y-5"
                        >
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Teacher Name
                                </label>

                                <input
                                    type="text"
                                    value={teacherName}
                                    onChange={(e) =>
                                        setTeacherName(
                                            e.target.value
                                        )
                                    }
                                    placeholder="e.g. Mr. Bidemi"
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Subject
                                </label>

                                <input
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="e.g. Mathematics"
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Description
                                </label>

                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Brief description about the teacher..."
                                    rows={4}
                                    className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Department
                                </label>

                                <select
                                    value={department}
                                    onChange={(e) =>
                                        setDepartment(
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
                                >
                                    <option value="">
                                        Select department
                                    </option>

                                    {departmentsData.map((department) => (
                                        <option
                                            key={department}
                                            value={department}
                                        >
                                            {department}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(
                                            e.target.value
                                        )
                                    }
                                    placeholder="teacher@example.com"
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Phone Number
                                </label>

                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) =>
                                        setPhone(
                                            e.target.value
                                        )
                                    }
                                    placeholder="+234 8012345678"
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
                                />
                            </div>

                            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                                <button type="button"
                                    onClick={handleCloseForm}
                                    className="rounded-xl border border-gray-200 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="rounded-xl bg-green-950 px-5 py-3 font-semibold text-white transition hover:bg-green-800"
                                >
                                    {editingTeacher
                                        ? "Save Changes"
                                        : "Add Teacher"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {teacherToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                        <h2 className="text-2xl font-bold text-green-950">
                            Delete Teacher?
                        </h2>

                        <p className="mt-3 text-gray-600">
                            Are you sure you want to delete{" "}
                            <span className="font-semibold text-gray-900">
                                {teacherToDelete.name}
                            </span>
                            ? This action cannot be undone.
                        </p>

                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                onClick={() =>
                                    setTeacherToDelete(null)
                                }
                                className="rounded-xl border border-gray-200 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleDelete}
                                className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700"
                            >
                                Delete Teacher
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete All Teachers Modal */}
            {showDeleteAllModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-green-950">
                                Delete All Teachers?
                            </h2>

                            <button
                                onClick={() => setShowDeleteAllModal(false)}
                                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
                            >
                                <X size={22} />
                            </button>
                        </div>

                        <p className="mt-4 text-gray-600">
                            Are you sure you want to delete all{" "}
                            <span className="font-semibold text-gray-900">
                                {teachers.length} teachers
                            </span>
                            ? This action cannot be undone.
                        </p>

                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                onClick={() => setShowDeleteAllModal(false)}
                                className="rounded-xl border border-gray-200 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleDeleteAll}
                                className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700"
                            >
                                Delete All Teachers
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Teachers;


