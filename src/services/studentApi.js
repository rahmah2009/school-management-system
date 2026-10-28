import { apiRequest } from "./api";

// Convert the API student shape into the format used by the existing page.
function normalizeStudent(student) {
    return {
        dbId: student.id,
        id: student.studentId,
        name: student.name || [
            student.firstName,
            student.middleName,
            student.lastName,
        ].filter(Boolean).join(" "),
        className: student.className,
        department: student.department || "",
        createdAt: student.createdAt ? String(student.createdAt).slice(0, 10) : "",
    };
}

export async function getStudents() {
    const data = await apiRequest("/students");
    return (data.students || []).map(normalizeStudent);
}

export async function createStudent(student) {
    const data = await apiRequest("/students", {
        method: "POST",
        body: JSON.stringify(student),
    });
    return normalizeStudent(data.student);
}

export async function updateStudent(dbId, student) {
    const data = await apiRequest(`/students/${dbId}`, {
        method: "PUT",
        body: JSON.stringify(student),
    });
    return normalizeStudent(data.student);
}

export async function deleteStudent(dbId) {
    return apiRequest(`/students/${dbId}`, { method: "DELETE" });
}
