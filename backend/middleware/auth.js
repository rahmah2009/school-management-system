
const jwt = require("jsonwebtoken");
const pool = require("../config/database");

async function authenticateAdmin(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Authentication required.",
        });
    }

    if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET is not configured.");

        return res.status(500).json({
            success: false,
            message: "Authentication is not configured correctly.",
        });
    }

    const token = authHeader.slice(7);

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET, {
            issuer: "greenfield-school-api",
        });

        if (
            typeof payload.adminId !== "string" ||
            !/^\d+$/.test(payload.adminId)
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid authentication token.",
            });
        }

        const result = await pool.query(
            `SELECT id, name, email, role
             FROM admins
             WHERE id = $1`,
            [payload.adminId]
        );

        if (result.rowCount === 0) {
            return res.status(401).json({
                success: false,
                message: "Admin account not found.",
            });
        }

        req.admin = {
            id: result.rows[0].id.toString(),
            name: result.rows[0].name,
            email: result.rows[0].email,
            role: result.rows[0].role,
        };

        next();
    } catch (error) {
        if (
            error.name === "JsonWebTokenError" ||
            error.name === "TokenExpiredError" ||
            error.name === "NotBeforeError"
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired authentication token.",
            });
        }

        console.error("Authentication error details:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to verify authentication.",
        });
    }
}

function requireRole(...allowedRoles) {
    return (req, res, next) => {
        if (!req.admin) {
            return res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
        }

        if (!allowedRoles.includes(req.admin.role)) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to perform this action.",
            });
        }

        next();
    };
}

module.exports = {
    authenticateAdmin,
    requireRole,
};
