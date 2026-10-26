
const { Pool } = require("pg");
require("dotenv").config();

const connectionString = process.env.DATABASE_URL;
console.log("DATABASE_URL exists:", Boolean(connectionString));
console.log(
    "DATABASE_URL starts correctly:",
    connectionString?.startsWith("postgresql://") ||
    connectionString?.startsWith("postgres://")
);

const pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false,
    },
});

pool.on("error", (error) => {
    console.error("Unexpected PostgreSQL connection error:", error.message);
});

module.exports = pool;
