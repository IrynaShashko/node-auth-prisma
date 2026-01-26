require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs"); 
const prisma = require("./lib/prisma");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post("/register", async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      message: "User registered successfully",
      user: { id: newUser.id, email: newUser.email, name: newUser.name },
    });
    
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
