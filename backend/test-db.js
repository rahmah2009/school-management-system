
require("dotenv").config();

const pool = require("./config/database");

async function testDatabaseConnection() {
    try {
        const result = await pool.query(
            "SELECT current_database() AS database, current_user AS user"
        );

        console.log("Database connection successful!");
        console.log("Database:", result.rows[0].database);
        console.log("Connected as:", result.rows[0].user);
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
}

testDatabaseConnection();
