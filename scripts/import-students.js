const fs = require("fs");
const path = require("path");
const pool = require("../config/database");

async function importStudents() {
    const filePath = path.join(
        __dirname,
        "..",
        "greenfield-students-migration.json"
    );

    const students = JSON.parse(
        fs.readFileSync(filePath, "utf8")
    );

    if (!Array.isArray(students)) {
        throw new Error("Migration file must contain an array.");
    }

    let imported = 0;
    let skipped = 0;
    let invalid = 0;

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        for (let index = 0; index < students.length; index++) {
            const student = students[index];

            const studentId =
                typeof student.id === "string" ? student.id.trim() : "";

            const fullName =
                typeof student.name === "string"
                    ? student.name.trim()
                    : "";

            const nameParts = fullName
                .split(/\s+/)
                .filter(Boolean);

            const className =
                typeof student.className === "string"
                    ? student.className.trim()
                    : "";

            const department =
                typeof student.department === "string"
                    ? student.department.trim()
                    : "";

            const createdAt = student.createdAt;

            const validDate =
                typeof createdAt === "string" &&
                /^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(createdAt) &&
                !Number.isNaN(Date.parse(createdAt)) &&
                new Date(createdAt).toISOString().startsWith(
                    createdAt.slice(0, 10)
                );

            if (
                !/^GfSP-\d+$/.test(studentId) ||
                nameParts.length < 2 ||
                !className ||
                !validDate
            ) {
                console.log(
                    `Skipped invalid record #${index + 1}.`
                );
                invalid++;
                continue;
            }

            const firstName = nameParts[0];
            const lastName = nameParts[nameParts.length - 1];
            const middleName =
                nameParts.length > 2
                    ? nameParts.slice(1, -1).join(" ")
                    : null;

            const result = await client.query(
                `
                    INSERT INTO students (
                        student_id,
                        first_name,
                        middle_name,
                        last_name,
                        class_name,
                        department,
                        created_at
                    )
                    VALUES ($1, $2, $3, $4, $5, $6, $7)
                    ON CONFLICT (student_id) DO NOTHING
                    RETURNING student_id
                `,
                [
                    studentId,
                    firstName,
                    middleName,
                    lastName,
                    className,
                    department,
                    createdAt,
                ]
            );

            if (result.rowCount === 1) {
                imported++;
            } else {
                skipped++;
            }
        }

        await client.query("COMMIT");

        console.log("\nMigration finished:");
        console.log(`Imported: ${imported}`);
        console.log(`Already existed: ${skipped}`);
        console.log(`Invalid records: ${invalid}`);
        console.log(`Total checked: ${students.length}`);
    } catch (error) {
        await client.query("ROLLBACK").catch(() => {});
        throw error;
    } finally {
        client.release();
    }
}

importStudents()
    .catch((error) => {
        console.error("Migration failed:", error.message);
        process.exitCode = 1;
    })
    .finally(() => pool.end());

