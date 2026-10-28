import { apiRequest } from "./api";

function normalizeTeacher(teacher) {
    return {
        dbId: teacher.id,
        id: teacher.teacherId,
        name: teacher.name,
        subject: teacher.subject || "",
        department: teacher.department || "",
        description: teacher.description || "",
        email: teacher.email || "",
        phone: teacher.phone || "",
        createdAt: teacher.createdAt || "",
    };
}

export async function getTeachers() {
    const data = await apiRequest("/teachers");
    return (data.teachers || []).map(normalizeTeacher);
}
export async function createTeacher(teacher) {
    const data = await apiRequest("/teachers", { method: "POST", body: JSON.stringify(teacher) });
    return normalizeTeacher(data.teacher);
}
export async function updateTeacher(dbId, teacher) {
    const data = await apiRequest(`/teachers/${dbId}`, { method: "PUT", body: JSON.stringify(teacher) });
    return normalizeTeacher(data.teacher);
}
export async function deleteTeacher(dbId) {
    return apiRequest(`/teachers/${dbId}`, { method: "DELETE" });
}
