const fs = require("fs");
const path = require("path");
const pool = require("../config/database");

async function seedTeachers() {
    const filePath = path.join(__dirname, "../data/teachers.json");
    const teachers = JSON.parse(fs.readFileSync(filePath, "utf8"));

    if (!Array.isArray(teachers) || teachers.length === 0) {
        throw new Error("Teachers data is empty or invalid.");
    }

    const client = await pool.connect();

    let inserted = 0;
    let skipped = 0;

    try {
        await client.query("BEGIN");

        for (const teacher of teachers) {
            const {
                id,
                name,
                subject,
                department,
                description,
                email,
                phone,
            } = teacher;

            if (!id || !name || !subject || !department || !email || !phone) {
                throw new Error(`A required field is missing for teacher: ${id || "unknown"}`);
            }

            const result = await client.query(
                `INSERT INTO teachers
                    (teacher_id, name, subject, department, description, email, phone)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)
                 ON CONFLICT DO NOTHING`,
                [
                    id,
                    name,
                    subject,
                    department,
                    description || "",
                    email,
                    phone,
                ]
            );

            if (result.rowCount === 1) {
                inserted++;
            } else {
                skipped++;
            }
        }

        await client.query("COMMIT");

        console.log("Teacher seeding completed!");
        console.log(`Total in data file: ${teachers.length}`);
        console.log(`Inserted: ${inserted}`);
        console.log(`Skipped: ${skipped}`);
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

seedTeachers().catch((error) => {
    console.error("Teacher seeding failed:", error.message);
    process.exitCode = 1;
});