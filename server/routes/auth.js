import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

//signup
router.post("/signup", async (req, res) => {
    try {
        let { name, email, password } = req.body;

        email = email.toLowerCase();

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields required" });
        }

        // PASSWORD VALIDATION
        if (
            password.length < 8 ||
            !/[A-Z]/.test(password) ||
            !/[0-9]/.test(password)
        ) {
            return res.status(400).json({
                success: false,
                message: "Password must be 8+ chars, include uppercase and number"
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.save({
            name,
            email,
            password: hashedPassword,
            status: "user"
        });

        res.status(201).json({
            success: true,
            message: "Account created successfully"
        });

    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

//login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ success: false, message: "Incorrect email or password" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ success: false, message: "Incorrect email or password"});

        const token = jwt.sign ({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h"});

        console.log(`✅ User logged in: ${user.name} (${email})`);
        res.status(200).json({
            success: true,
            message: "Login successful!",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                status: user.status || "user"
            }
        });
    } catch (err) {
        console.error("❌ Login error:", err);
        res.status(500).json({ success: false, message: "Could not login. Please try again."});
    }
})

export default router;