require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./config/database");
const studentRoutes = require("./routes/students");
const teacherRoutes = require("./routes/teachers");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = Number(process.env.PORT) || 5000;

const defaultOrigins = [
    "http://localhost:5173",
    "https://school-management-system-phi-lovat.vercel.app",
];
const configuredOrigins = (process.env.CORS_ORIGINS || process.env.FRONTEND_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
const allowedOrigins = new Set([...defaultOrigins, ...configuredOrigins]);

app.disable("x-powered-by");
app.use(cors({
    origin(origin, callback) {
        // Requests without Origin include curl/health checks and server-to-server calls.
        if (!origin || allowedOrigins.has(origin)) return callback(null, true);
        return callback(new Error("Origin is not allowed by CORS."));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
}));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false, limit: "1mb" }));

app.get("/", (_req, res) => {
    res.json({
        name: "Greenfield School Management System API",
        status: "running",
        health: "/api/health",
    });
});

app.get("/api/health", async (_req, res) => {
    try {
        const result = await pool.query("SELECT current_database() AS database");
        res.json({
            status: "healthy",
            database: result.rows[0].database,
            message: "Greenfield API is connected to PostgreSQL.",
        });
    } catch (error) {
        console.error("Health-check failed:", error.message);
        res.status(503).json({
            status: "unhealthy",
            message: "The API is running, but the database is unavailable.",
        });
    }
});

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);

app.use("/api", (_req, res) => {
    res.status(404).json({ success: false, message: "API endpoint not found." });
});

app.use((error, _req, res, _next) => {
    if (error.message === "Origin is not allowed by CORS.") {
        return res.status(403).json({ success: false, message: "This origin is not allowed." });
    }
    if (error instanceof SyntaxError && "body" in error) {
        return res.status(400).json({ success: false, message: "Request body contains invalid JSON." });
    }
    console.error("Unhandled API error:", error.message);
    return res.status(500).json({ success: false, message: "An unexpected server error occurred." });
});

const server = app.listen(PORT, () => {
    console.log(`Greenfield backend listening on port ${PORT}`);
});

async function shutdown(signal) {
    console.log(`${signal} received. Shutting down gracefully...`);
    server.close(async () => {
        try {
            await pool.end();
            process.exit(0);
        } catch (error) {
            console.error("Shutdown error:", error.message);
            process.exit(1);
        }
    });
    setTimeout(() => process.exit(1), 10000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

module.exports = app;
