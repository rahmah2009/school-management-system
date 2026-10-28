const { Pool } = require("pg");
require("dotenv").config();

const connectionString = process.env.DATABASE_URL;
const shouldUseSSL =
    process.env.DATABASE_SSL === "true" ||
    (process.env.DATABASE_SSL !== "false" && process.env.NODE_ENV === "production");

const pool = new Pool({
    ...(connectionString ? { connectionString } : {}),
    ...(shouldUseSSL ? { ssl: { rejectUnauthorized: false } } : {}),
    max: Number(process.env.PGPOOL_MAX) || 10,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
});

pool.on("error", (error) => {
    console.error("Unexpected PostgreSQL pool error:", error.message);
});

module.exports = pool;
