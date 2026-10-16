const studentRoutes = require("./routes/students");

require("dotenv").config();

const express = require("express");
const pool = require("./config/database");

const app = express();
const PORT = 5000;

app.use(express.json());
app.use("/api/students", studentRoutes);

// Welcome route
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to Greenfield School Management System API!",
        status: "Server is running successfully",
    });
});

// Database health-check route
app.get("/api/health", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT current_database() AS database"
        );

        res.json({
            status: "healthy",
            database: result.rows[0].database,
            message: "Greenfield API is connected to PostgreSQL.",
        });
    } catch (error) {
        console.error("Health-check failed:", error.message);

        res.status(500).json({
            status: "unhealthy",
            message: "Unable to connect to the database.",
        });
    }
});

app.listen(PORT, () => {
    console.log(
        `Greenfield backend running at http://localhost:${PORT}`
    );
});
