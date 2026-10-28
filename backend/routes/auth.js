const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/database");
const { authenticateAdmin } = require("../middleware/auth");

const router = express.Router();

function publicAdmin(admin) {
    return {
        id: String(admin.id),
        name: admin.name,
        email: admin.email,
        role: admin.role,
    };
}

router.post("/login", async (req, res) => {
    try {
        const email = typeof req.body.email === "string"
            ? req.body.email.trim().toLowerCase()
            : "";
        const password = typeof req.body.password === "string"
            ? req.body.password
            : "";

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter your email and password.",
            });
        }

        const result = await pool.query(
            `SELECT id, name, email, password_hash, role
             FROM admins WHERE email = $1`,
            [email]
        );
        const admin = result.rows[0];

        if (!admin || !(await bcrypt.compare(password, admin.password_hash))) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
            console.error("JWT_SECRET is missing or too short.");
            return res.status(500).json({
                success: false,
                message: "Authentication is not configured correctly.",
            });
        }

        const token = jwt.sign(
            { adminId: String(admin.id) },
            process.env.JWT_SECRET,
            { expiresIn: "8h", issuer: "greenfield-school-api" }
        );

        return res.json({
            success: true,
            message: "Login successful.",
            token,
            admin: publicAdmin(admin),
        });
    } catch (error) {
        console.error("Login error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Unable to log in right now. Please try again.",
        });
    }
});

// Public signup can only create a regular staff account; it cannot assign roles.
router.post(["/signup", "/register"], async (req, res) => {
    try {
        const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
        const email = typeof req.body.email === "string"
            ? req.body.email.trim().toLowerCase()
            : "";
        const password = typeof req.body.password === "string" ? req.body.password : "";

        if (name.length < 2 || name.length > 150) {
            return res.status(400).json({
                success: false,
                message: "Name must be between 2 and 150 characters.",
            });
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address.",
            });
        }
        if (password.length < 6 || password.length > 32) {
            return res.status(400).json({
                success: false,
                message: "Password must be between 12 and 128 characters.",
            });
        }

        const passwordHash = await bcrypt.hash(password, 12);
        const result = await pool.query(
            `INSERT INTO admins (name, email, password_hash, role)
             VALUES ($1, $2, $3, 'staff')
             ON CONFLICT (email) DO NOTHING
             RETURNING id, name, email, role`,
            [name, email, passwordHash]
        );

        if (result.rowCount === 0) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists.",
            });
        }

        return res.status(201).json({
            success: true,
            message: "Account created. A super administrator must grant elevated access.",
            admin: publicAdmin(result.rows[0]),
        });
    } catch (error) {
        console.error("Signup error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Unable to create your account right now.",
        });
    }
});

router.get("/me", authenticateAdmin, (req, res) => {
    res.json({ success: true, admin: req.admin });
});

module.exports = router;
