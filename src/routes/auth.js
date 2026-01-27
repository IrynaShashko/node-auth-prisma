const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");
const authenticateToken = require("../middleware/auth");
const {
  validate,
  registerSchema,
  loginSchema,
} = require("../middleware/validators");
const crypto = require("crypto"); 
const transporter = require("../lib/mailer");

// Register
router.post("/register", validate(registerSchema), async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { email, name, password: hashedPassword },
    });

    res.status(201).json({
      message: "User registered successfully",
      user: { id: newUser.id, email: newUser.email, name: newUser.name },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login
router.post("/login", validate(loginSchema), async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, email: true, name: true, createdAt: true },
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile." });
  }
});

router.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Change Password
router.post("/change-password", authenticateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Old password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Forgot Password
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 3600000);

    await prisma.user.update({
      where: { email },
      data: { resetToken: token, resetTokenExpiry: expiry },
    });

    const resetUrl = `http://localhost:3000/api/auth/reset-password/${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: "Скидання пароля",
      html: `
        <h1>Вітаємо!</h1>
        <p>Ви отримали цей лист, бо зробили запит на зміну пароля.</p>
        <a href="${resetUrl}">Натисніть тут, щоб змінити пароль</a>
        <p>Це посилання дійсне 1 годину.</p>
      `,
    });

    res.json({ message: "Reset link sent to email" });
  } catch (error) {
    res.status(500).json({ error: "Error sending email" });
  }
});

// Reset Password
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    res.json({ message: "Password updated successfully. You can now log in." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Logout Route
router.post("/logout", (req, res) => {
  res.json({ message: "Logged out successfully. Please delete your token." });
});

module.exports = router;
