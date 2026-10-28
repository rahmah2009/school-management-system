const express = require("express");
const pool = require("../config/database");
const { authenticateAdmin, requireRole } = require("../middleware/auth");

const router = express.Router();
router.use(authenticateAdmin);

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

function readTeacherInput(body) {
    const fields = ["teacherId", "name", "subject", "department", "email", "phone"];
    const value = {};
    for (const field of fields) {
        value[field] = typeof body[field] === "string" ? body[field].trim() : "";
    }
    value.description = typeof body.description === "string" ? body.description.trim() : "";
    return value;
}

function validateTeacher(t) {
    if (Object.values({
        teacherId: t.teacherId,
        name: t.name,
        subject: t.subject,
        department: t.department,
        email: t.email,
        phone: t.phone,
    }).some((v) => !v)) return "Teacher ID, name, subject, department, email, and phone are required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t.email)) return "Please provide a valid teacher email.";
    if (t.teacherId.length > 50 || t.name.length > 150 || t.email.length > 255) return "One or more fields are too long.";
    return null;
}

router.get("/", async (_req, res) => {
    try {
        const result = await pool.query(`SELECT ${teacherColumns} FROM teachers ORDER BY id DESC`);
        res.json({ success: true, count: result.rowCount, teachers: result.rows });
    } catch (error) {
        console.error("Fetch teachers error:", error.message);
        res.status(500).json({ success: false, message: "Unable to fetch teachers." });
    }
});

router.get("/:id", async (req, res) => {
    if (!/^\d+$/.test(req.params.id)) {
        return res.status(400).json({ success: false, message: "A valid numeric database ID is required." });
    }
    try {
        const result = await pool.query(`SELECT ${teacherColumns} FROM teachers WHERE id = $1`, [req.params.id]);
        if (!result.rowCount) return res.status(404).json({ success: false, message: "Teacher not found." });
        res.json({ success: true, teacher: result.rows[0] });
    } catch (error) {
        console.error("Fetch teacher error:", error.message);
        res.status(500).json({ success: false, message: "Unable to fetch teacher." });
    }
});

router.post("/", requireRole("super_admin"), async (req, res) => {
    const teacher = readTeacherInput(req.body);
    const validationError = validateTeacher(teacher);
    if (validationError) return res.status(400).json({ success: false, message: validationError });
    try {
        const result = await pool.query(
            `INSERT INTO teachers (teacher_id, name, subject, department, description, email, phone)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING ${teacherColumns}`,
            [teacher.teacherId, teacher.name, teacher.subject, teacher.department, teacher.description, teacher.email.toLowerCase(), teacher.phone]
        );
        res.status(201).json({ success: true, message: "Teacher added successfully.", teacher: result.rows[0] });
    } catch (error) {
        if (error.code === "23505") return res.status(409).json({ success: false, message: "Teacher ID or email already exists." });
        console.error("Create teacher error:", error.message);
        res.status(500).json({ success: false, message: "Unable to add teacher." });
    }
});

router.put("/:id", requireRole("super_admin"), async (req, res) => {
    if (!/^\d+$/.test(req.params.id)) {
        return res.status(400).json({ success: false, message: "A valid numeric database ID is required." });
    }
    const teacher = readTeacherInput(req.body);
    const validationError = validateTeacher(teacher);
    if (validationError) return res.status(400).json({ success: false, message: validationError });
    try {
        const result = await pool.query(
            `UPDATE teachers SET teacher_id=$1, name=$2, subject=$3, department=$4,
             description=$5, email=$6, phone=$7 WHERE id=$8 RETURNING ${teacherColumns}`,
            [teacher.teacherId, teacher.name, teacher.subject, teacher.department, teacher.description, teacher.email.toLowerCase(), teacher.phone, req.params.id]
        );
        if (!result.rowCount) return res.status(404).json({ success: false, message: "Teacher not found." });
        res.json({ success: true, message: "Teacher updated successfully.", teacher: result.rows[0] });
    } catch (error) {
        if (error.code === "23505") return res.status(409).json({ success: false, message: "Teacher ID or email already exists." });
        console.error("Update teacher error:", error.message);
        res.status(500).json({ success: false, message: "Unable to update teacher." });
    }
});

router.delete("/:id", requireRole("super_admin"), async (req, res) => {
    if (!/^\d+$/.test(req.params.id)) {
        return res.status(400).json({ success: false, message: "A valid numeric database ID is required." });
    }
    try {
        const result = await pool.query(
            `DELETE FROM teachers WHERE id=$1 RETURNING id, teacher_id AS "teacherId", name`,
            [req.params.id]
        );
        if (!result.rowCount) return res.status(404).json({ success: false, message: "Teacher not found." });
        res.json({ success: true, message: "Teacher deleted successfully.", teacher: result.rows[0] });
    } catch (error) {
        console.error("Delete teacher error:", error.message);
        res.status(500).json({ success: false, message: "Unable to delete teacher." });
    }
});

module.exports = router;
