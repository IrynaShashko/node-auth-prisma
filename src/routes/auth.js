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

module.exports = router;
