require("dotenv").config();

const fs = require("fs");
const path = require("path");
const pool = require("../config/database");

async function main() {
    const schemaPath = path.join(__dirname, "..", "database", "schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");
    await pool.query(schema);
    console.log("Database schema applied successfully.");
}

main()
    .catch((error) => {
        console.error("Could not apply database schema:", error.message);
        process.exitCode = 1;
    })
    .finally(() => pool.end());
