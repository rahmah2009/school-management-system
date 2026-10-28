
require("dotenv").config();

const bcrypt = require("bcryptjs");
const readline = require("readline");
const pool = require("../config/database");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function ask(question) {
    return new Promise((resolve) => {
        rl.question(question, resolve);
    });
}

async function main() {
    try {
        const name = (await ask("Admin name: ")).trim();
        const email = (await ask("Admin email: ")).trim().toLowerCase();
        const password = await ask("Admin password (minimum 12 characters): ");

        if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new Error("Please enter a valid name and email.");
        }

        if (password.length < 12) {
            throw new Error("Password must be at least 12 characters.");
        }

        const existing = await pool.query(
            "SELECT id FROM admins WHERE email = $1",
            [email]
        );

        if (existing.rowCount > 0) {
            throw new Error("An admin with this email already exists.");
        }

        const passwordHash = await bcrypt.hash(password, 12);

        await pool.query(
            `INSERT INTO admins (name, email, password_hash, role)
             VALUES ($1, $2, $3, 'super_admin')`,
            [name, email, passwordHash]
        );

        console.log("Admin account created successfully.");
    } catch (error) {
        console.error("Could not create admin:", error.message);
        process.exitCode = 1;
    } finally {
        rl.close();
        await pool.end();
    }
}

main();
