
const express = require("express");
const pool = require("../config/database");

const router = express.Router();

// GET /api/students — Fetch all students
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                id,
                student_id AS "studentId",
                first_name AS "firstName",
                middle_name AS "middleName",
                last_name AS "lastName",
                class_name AS "className",
                department,
                created_at AS "createdAt"
            FROM students
            ORDER BY id DESC
        `);

        const students = result.rows.map((student) => ({
            ...student,
            name: [
                student.firstName,
                student.middleName,
                student.lastName,
            ]
                .filter(Boolean)
                .join(" "),
        }));

        res.json({
            success: true,
            count: students.length,
            students,
        });
    } catch (error) {
        console.error("Failed to fetch students:", error.message);

        res.status(500).json({
            success: false,
            message: "Unable to fetch students.",
        });
    }
});

// POST /api/students — Register a student
router.post("/", async (req, res) => {
    const firstName = req.body.firstName?.trim();
    const middleName = req.body.middleName?.trim() || null;
    const lastName = req.body.lastName?.trim();
    const className = req.body.className?.trim();
    const department = req.body.department?.trim() || "";

    if (!firstName || !lastName || !className) {
        return res.status(400).json({
            success: false,
            message: "First name, last name, and class are required.",
        });
    }

    const client = await pool.connect();
    let transactionStarted = false;

    try {
        await client.query("BEGIN");
        transactionStarted = true;

        // Serialize student ID generation across registrations.
        await client.query(
            "SELECT pg_advisory_xact_lock($1)",
            [20261016]
        );

        const numberResult = await client.query(`
            SELECT COALESCE(
                MAX(SUBSTRING(student_id FROM 6)::INTEGER),
                0
            ) + 1 AS next_number
            FROM students
            WHERE student_id ~ '^GfSP-[0-9]+$'
        `);

        const nextNumber = Number(numberResult.rows[0].next_number);
        const studentId = `GfSP-${String(nextNumber).padStart(3, "0")}`;

        const result = await client.query(
            `
                INSERT INTO students (
                    student_id,
                    first_name,
                    middle_name,
                    last_name,
                    class_name,
                    department
                )
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING
                    id,
                    student_id AS "studentId",
                    first_name AS "firstName",
                    middle_name AS "middleName",
                    last_name AS "lastName",
                    class_name AS "className",
                    department,
                    created_at AS "createdAt"
            `,
            [
                studentId,
                firstName,
                middleName,
                lastName,
                className,
                department,
            ]
        );

        await client.query("COMMIT");
        transactionStarted = false;

        const student = result.rows[0];

        res.status(201).json({
            success: true,
            message: "Student registered successfully.",
            student: {
                ...student,
                name: [
                    student.firstName,
                    student.middleName,
                    student.lastName,
                ]
                    .filter(Boolean)
                    .join(" "),
            },
        });
    } catch (error) {
        if (transactionStarted) {
            await client.query("ROLLBACK").catch(() => { });
        }

        console.error("Failed to register student:", error.message);

        res.status(500).json({
            success: false,
            message: "Unable to register student.",
        });
    } finally {
        client.release();
    }
});


const studentColumns = `
    id,
    student_id AS "studentId",
    first_name AS "firstName",
    middle_name AS "middleName",
    last_name AS "lastName",
    class_name AS "className",
    department,
    created_at AS "createdAt"
`;

function formatStudent(student) {
    return {
        ...student,
        name: [
            student.firstName,
            student.middleName,
            student.lastName,
        ]
            .filter(Boolean)
            .join(" "),
    };
}

// GET /api/students/:id — Get one student by database ID
router.get("/:id", async (req, res) => {
    const { id } = req.params;

    if (!/^\d+$/.test(id)) {
        return res.status(400).json({
            success: false,
            message: "A valid numeric database ID is required.",
        });
    }

    try {
        const result = await pool.query(
            `SELECT ${studentColumns}
             FROM students
             WHERE id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Student not found.",
            });
        }

        res.json({
            success: true,
            student: formatStudent(result.rows[0]),
        });
    } catch (error) {
        console.error("Failed to fetch student:", error.message);

        res.status(500).json({
            success: false,
            message: "Unable to fetch student.",
        });
    }
});

// PUT /api/students/:id — Update a student's details
router.put("/:id", async (req, res) => {
    const { id } = req.params;

    if (!/^\d+$/.test(id)) {
        return res.status(400).json({
            success: false,
            message: "A valid numeric database ID is required.",
        });
    }

    const firstName = req.body.firstName?.trim();
    const middleName = req.body.middleName?.trim() || null;
    const lastName = req.body.lastName?.trim();
    const className = req.body.className?.trim();
    const department = req.body.department?.trim() || "";

    if (!firstName || !lastName || !className) {
        return res.status(400).json({
            success: false,
            message: "First name, last name, and class are required.",
        });
    }

    try {
        const result = await pool.query(
            `
                UPDATE students
                SET
                    first_name = $1,
                    middle_name = $2,
                    last_name = $3,
                    class_name = $4,
                    department = $5
                WHERE id = $6
                RETURNING ${studentColumns}
            `,
            [
                firstName,
                middleName,
                lastName,
                className,
                department,
                id,
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Student not found.",
            });
        }

        res.json({
            success: true,
            message: "Student updated successfully.",
            student: formatStudent(result.rows[0]),
        });
    } catch (error) {
        console.error("Failed to update student:", error.message);

        res.status(500).json({
            success: false,
            message: "Unable to update student.",
        });
    }
});


// DELETE /api/students/:id — Delete a student
router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    if (!/^\d+$/.test(id)) {
        return res.status(400).json({
            success: false,
            message: "A valid numeric database ID is required.",
        });
    }

    try {
        const result = await pool.query(
            `
                DELETE FROM students
                WHERE id = $1
                RETURNING
                    id,
                    student_id AS "studentId",
                    first_name AS "firstName",
                    middle_name AS "middleName",
                    last_name AS "lastName",
                    class_name AS "className"
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Student not found.",
            });
        }

        res.json({
            success: true,
            message: "Student deleted successfully.",
            student: result.rows[0],
        });
    } catch (error) {
        console.error("Failed to delete student:", error.message);

        res.status(500).json({
            success: false,
            message: "Unable to delete student.",
        });
    }
});



module.exports = router;