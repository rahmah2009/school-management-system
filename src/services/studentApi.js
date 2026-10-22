const API_URL = "http://localhost:5000/api/students";

// Convert the backend student shape into the format
// your existing React Students page expects.
function normalizeStudent(student) {
    return {
        dbId: student.id,
        id: student.studentId,
        name: student.name,
        className: student.className,
        department: student.department || "",
        createdAt: student.createdAt
            ? String(student.createdAt).slice(0, 10)
            : "",
    };
}

async function request(endpoint = "", options = {}) {
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    const data = await response.json();

    if (!response.ok || data.success === false) {
        throw new Error(
            data.message || "The student request failed."
        );
    }

    return data;
}

// Fetch all students.
export async function getStudents() {
    const data = await request();
    return data.students.map(normalizeStudent);
}

// Register a student.
export async function createStudent(student) {
    const data = await request("", {
        method: "POST",
        body: JSON.stringify(student),
    });

    return normalizeStudent(data.student);
}

// Update a student using its numeric database ID.
export async function updateStudent(dbId, student) {
    const data = await request(`/${dbId}`, {
        method: "PUT",
        body: JSON.stringify(student),
    });

    return normalizeStudent(data.student);
}

// Delete a student using its numeric database ID.
export async function deleteStudent(dbId) {
    return request(`/${dbId}`, {
        method: "DELETE",
    });
}
