require("dotenv").config();
const express = require("express");
const authRoutes = require("./routes/auth");
const authenticateToken = require("./middleware/auth");
const prisma = require("./lib/prisma");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./swagger");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

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
  console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
});
