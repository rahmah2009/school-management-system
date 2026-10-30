
const express = require("express");
const pool = require("../config/database");
const { authenticateAdmin, requireRole } = require("../middleware/auth");

const router = express.Router();

// Select fields returned by teacher queries.
const teacherColumns = `
    id,
    teacher_id AS "teacherId",
    name,
    subject,
    department,
    description,
    email,
    phone,
    created_at AS "createdAt"
`;

// Read and sanitize teacher input.
function readTeacherInput(body = {}) {
    const fields = [
        "teacherId",
        "name",
        "subject",
        "department",
        "email",
        "phone",
    ];

    const teacher = {};

    for (const field of fields) {
        teacher[field] =
            typeof body[field] === "string"
                ? body[field].trim()
                : "";
    }

    teacher.description =
        typeof body.description === "string"
            ? body.description.trim()
            : "";

    return teacher;
}

// Validate teacher information.
function validateTeacher(teacher) {
    const requiredFields = [
        teacher.teacherId,
        teacher.name,
        teacher.subject,
        teacher.department,
        teacher.email,
        teacher.phone,
    ];

    if (requiredFields.some((value) => !value)) {
        return "Teacher ID, name, subject, department, email, and phone are required.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(teacher.email)) {
        return "Please provide a valid teacher email.";
    }

    if (
        teacher.teacherId.length > 50 ||
        teacher.name.length > 150 ||
        teacher.subject.length > 150 ||
        teacher.department.length > 150 ||
        teacher.email.length > 255 ||
        teacher.phone.length > 30
    ) {
        return "One or more fields are too long.";
    }

    return null;
}

// Check that the database ID is valid.
function isValidDatabaseId(id) {
    return /^\d+$/.test(id);
}

/* =====================================================
   PUBLIC ROUTES
   Anyone can view teachers without logging in.
===================================================== */

// GET ALL TEACHERS
router.get("/", async (_req, res) => {
    try {
        const result = await pool.query(
            `SELECT ${teacherColumns}
             FROM teachers
             ORDER BY id ASC`
        );

        return res.status(200).json({
            success: true,
            count: result.rowCount,
            teachers: result.rows,
        });
    } catch (error) {
        console.error("Fetch teachers error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch teachers.",
        });
    }
});

// GET ONE TEACHER
router.get("/:id", async (req, res) => {
    if (!isValidDatabaseId(req.params.id)) {
        return res.status(400).json({
            success: false,
            message: "A valid numeric database ID is required.",
        });
    }

    try {
        const result = await pool.query(
            `SELECT ${teacherColumns}
             FROM teachers
             WHERE id = $1`,
            [req.params.id]
        );

        if (!result.rowCount) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found.",
            });
        }

        return res.status(200).json({
            success: true,
            teacher: result.rows[0],
        });
    } catch (error) {
        console.error("Fetch teacher error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch teacher.",
        });
    }
});

/* =====================================================
   PROTECTED ROUTES
   Only super_admin can add, edit or delete teachers.
===================================================== */

// ADD TEACHER
router.post(
    "/",
    authenticateAdmin,
    requireRole("super_admin"),
    async (req, res) => {
        const teacher = readTeacherInput(req.body);
        const validationError = validateTeacher(teacher);

        if (validationError) {
            return res.status(400).json({
                success: false,
                message: validationError,
            });
        }

        try {
            const result = await pool.query(
                `INSERT INTO teachers (
                    teacher_id,
                    name,
                    subject,
                    department,
                    description,
                    email,
                    phone
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING ${teacherColumns}`,
                [
                    teacher.teacherId,
                    teacher.name,
                    teacher.subject,
                    teacher.department,
                    teacher.description,
                    teacher.email.toLowerCase(),
                    teacher.phone,
                ]
            );

            return res.status(201).json({
                success: true,
                message: "Teacher added successfully.",
                teacher: result.rows[0],
            });
        } catch (error) {
            if (error.code === "23505") {
                return res.status(409).json({
                    success: false,
                    message: "Teacher ID or email already exists.",
                });
            }

            console.error("Create teacher error:", error.message);

            return res.status(500).json({
                success: false,
                message: "Unable to add teacher.",
            });
        }
    }
);

// UPDATE TEACHER
router.put(
    "/:id",
    authenticateAdmin,
    requireRole("super_admin"),
    async (req, res) => {
        if (!isValidDatabaseId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "A valid numeric database ID is required.",
            });
        }

        const teacher = readTeacherInput(req.body);
        const validationError = validateTeacher(teacher);

        if (validationError) {
            return res.status(400).json({
                success: false,
                message: validationError,
            });
        }

        try {
            const result = await pool.query(
                `UPDATE teachers
                 SET teacher_id = $1,
                     name = $2,
                     subject = $3,
                     department = $4,
                     description = $5,
                     email = $6,
                     phone = $7
                 WHERE id = $8
                 RETURNING ${teacherColumns}`,
                [
                    teacher.teacherId,
                    teacher.name,
                    teacher.subject,
                    teacher.department,
                    teacher.description,
                    teacher.email.toLowerCase(),
                    teacher.phone,
                    req.params.id,
                ]
            );

            if (!result.rowCount) {
                return res.status(404).json({
                    success: false,
                    message: "Teacher not found.",
                });
            }

            return res.status(200).json({
                success: true,
                message: "Teacher updated successfully.",
                teacher: result.rows[0],
            });
        } catch (error) {
            if (error.code === "23505") {
                return res.status(409).json({
                    success: false,
                    message: "Teacher ID or email already exists.",
                });
            }

            console.error("Update teacher error:", error.message);

            return res.status(500).json({
                success: false,
                message: "Unable to update teacher.",
            });
        }
    }
);

// DELETE TEACHER
router.delete(
    "/:id",
    authenticateAdmin,
    requireRole("super_admin"),
    async (req, res) => {
        if (!isValidDatabaseId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "A valid numeric database ID is required.",
            });
        }

        try {
            const result = await pool.query(
                `DELETE FROM teachers
                 WHERE id = $1
                 RETURNING id, teacher_id AS "teacherId", name`,
                [req.params.id]
            );

            if (!result.rowCount) {
                return res.status(404).json({
                    success: false,
                    message: "Teacher not found.",
                });
            }

            return res.status(200).json({
                success: true,
                message: "Teacher deleted successfully.",
                teacher: result.rows[0],
            });
        } catch (error) {
            console.error("Delete teacher error:", error.message);

            return res.status(500).json({
                success: false,
                message: "Unable to delete teacher.",
            });
        }
    }
);

module.exports = router;
