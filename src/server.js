require("dotenv").config();
const express = require("express");
const authRoutes = require("./routes/auth");
const authenticateToken = require("./middleware/auth");
const prisma = require("./lib/prisma");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/auth", authRoutes); 

app.get("/api/profile", authenticateToken, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    select: { id: true, email: true, name: true },
  });
  res.json(user);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
