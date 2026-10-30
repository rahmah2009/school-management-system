
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { Resend } = require("resend");
const pool = require("../config/database");
const { authenticateAdmin } = require("../middleware/auth");

const router = express.Router();

const RESET_TOKEN_MINUTES = 30;

function publicAdmin(admin) {
    return {
        id: String(admin.id),
        name: admin.name,
        email: admin.email,
        role: admin.role,
    };
}

function normalizeEmail(email) {
    return typeof email === "string" ? email.trim().toLowerCase() : "";
}

function hashResetToken(token) {
    return crypto.createHash("sha256").update(token).digest("hex");
}

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const email = normalizeEmail(req.body?.email);
        const password = typeof req.body?.password === "string"
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

// SIGNUP
// Public signup can only create a regular staff account.
router.post(["/signup", "/register"], async (req, res) => {
    try {
        const name = typeof req.body?.name === "string"
            ? req.body.name.trim()
            : "";
        const email = normalizeEmail(req.body?.email);
        const password = typeof req.body?.password === "string"
            ? req.body.password
            : "";

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
                message: "Password must be between 6 and 32 characters.",
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

// FORGOT PASSWORD
router.post("/forgot-password", async (req, res) => {
    try {
        const email = normalizeEmail(req.body?.email);

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address.",
            });
        }

        const genericMessage =
            "If an account exists with that email, a password reset link will be sent.";

        const result = await pool.query(
            "SELECT id, email FROM admins WHERE email = $1",
            [email]
        );

        // Do not reveal whether an account exists.
        if (result.rowCount === 0) {
            return res.json({
                success: true,
                message: genericMessage,
            });
        }

        if (!process.env.RESEND_API_KEY) {
            console.error("RESEND_API_KEY is not configured.");
            return res.status(503).json({
                success: false,
                message: "Password recovery email is temporarily unavailable.",
            });
        }

        const frontendUrl = process.env.FRONTEND_URL;

        if (!frontendUrl) {
            console.error("FRONTEND_URL is not configured.");
            return res.status(500).json({
                success: false,
                message: "Password recovery is not configured correctly.",
            });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const tokenHash = hashResetToken(resetToken);

        const expiresAt = new Date(
            Date.now() + RESET_TOKEN_MINUTES * 60 * 1000
        );

        // Invalidate any previous unused reset links for this account.
        await pool.query(
            `DELETE FROM password_reset_tokens
             WHERE email = $1`,
            [email]
        );

        await pool.query(
            `INSERT INTO password_reset_tokens
             (email, token_hash, expires_at)
             VALUES ($1, $2, $3)`,
            [email, tokenHash, expiresAt]
        );

        const resetUrl = new URL("/reset-password", frontendUrl);
        resetUrl.searchParams.set("token", resetToken);

        const resend = new Resend(process.env.RESEND_API_KEY);

        const { error } = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || "Greenfield School <onboarding@resend.dev>",
            to: [email],
            subject: "Reset your Greenfield School password",
            text: `We received a request to reset your Greenfield School password.

Open this link to choose a new password:
${resetUrl.toString()}

This link expires in ${RESET_TOKEN_MINUTES} minutes and can only be used once.

If you did not request this, you can ignore this email.`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 560px; margin: auto; padding: 24px; color: #24352b;">
                    <h2 style="color: #14532d;">Greenfield School</h2>
                    <h3>Password reset request</h3>
                    <p>We received a request to reset your account password.</p>
                    <p>
                        <a href="${resetUrl.toString()}"
                           style="display: inline-block; background: #14532d; color: white; padding: 12px 22px; text-decoration: none; border-radius: 6px;">
                            Reset Password
                        </a>
                    </p>
                    <p>This link expires in ${RESET_TOKEN_MINUTES} minutes and can only be used once.</p>
                    <p>If you did not request this, you can ignore this email.</p>
                </div>
            `,
        });

        if (error) {
            console.error("Resend email error:", error.message);

            await pool.query(
                "DELETE FROM password_reset_tokens WHERE token_hash = $1",
                [tokenHash]
            );
        }

        return res.json({
            success: true,
            message: genericMessage,
        });
    } catch (error) {
        console.error("Forgot-password error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Unable to process your request right now. Please try again.",
        });
    }
});

// RESET PASSWORD
router.post("/reset-password", async (req, res) => {
    const resetToken = typeof req.body?.token === "string"
        ? req.body.token.trim()
        : "";
    const newPassword = typeof req.body?.password === "string"
        ? req.body.password
        : "";

    if (!/^[a-f0-9]{64}$/i.test(resetToken)) {
        return res.status(400).json({
            success: false,
            message: "This password reset link is invalid or expired.",
        });
    }

    if (newPassword.length < 6 || newPassword.length > 32) {
        return res.status(400).json({
            success: false,
            message: "Password must be between 6 and 32 characters.",
        });
    }

    const tokenHash = hashResetToken(resetToken);
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const tokenResult = await client.query(
            `SELECT id, email, expires_at, used_at
             FROM password_reset_tokens
             WHERE token_hash = $1
             FOR UPDATE`,
            [tokenHash]
        );

        const resetRecord = tokenResult.rows[0];

        if (
            !resetRecord ||
            resetRecord.used_at ||
            new Date(resetRecord.expires_at) <= new Date()
        ) {
            await client.query("ROLLBACK");

            return res.status(400).json({
                success: false,
                message: "This password reset link is invalid or expired.",
            });
        }

        const passwordHash = await bcrypt.hash(newPassword, 12);

        const updateResult = await client.query(
            `UPDATE admins
             SET password_hash = $1
             WHERE email = $2
             RETURNING id`,
            [passwordHash, resetRecord.email]
        );

        if (updateResult.rowCount === 0) {
            await client.query("ROLLBACK");

            return res.status(400).json({
                success: false,
                message: "This password reset link is invalid or expired.",
            });
        }

        await client.query(
            `UPDATE password_reset_tokens
             SET used_at = CURRENT_TIMESTAMP
             WHERE id = $1`,
            [resetRecord.id]
        );

        // Invalidate any other reset links for this account.
        await client.query(
            `DELETE FROM password_reset_tokens
             WHERE email = $1 AND id <> $2`,
            [resetRecord.email, resetRecord.id]
        );

        await client.query("COMMIT");

        return res.json({
            success: true,
            message: "Your password has been reset successfully. Please log in.",
        });
    } catch (error) {
        await client.query("ROLLBACK").catch(() => {});
        console.error("Reset-password error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to reset your password right now. Please try again.",
        });
    } finally {
        client.release();
    }
});

// CURRENT ADMIN
router.get("/me", authenticateAdmin, (req, res) => {
    res.json({ success: true, admin: req.admin });
});

module.exports = router;
