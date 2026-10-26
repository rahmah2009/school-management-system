
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./config/database");
const studentRoutes = require("./routes/students");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 5000;

// Allow the React frontend to communicate with the backend.
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://school-management-system-phi-lovat.vercel.app",
    ],
  })
);

app.use(express.json());

app.use("/api/students", studentRoutes);
app.use("/api/auth", authRoutes);

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
        console.error("Health-check failed:", error);

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
