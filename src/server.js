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

const swaggerOptions = {
  swaggerOptions: {
    url: "/api-docs/swagger.json",
  },
  customCssUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css",
  customJs: [
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js",
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js",
  ],
};

app.get("/api-docs/swagger.json", (req, res) => res.json(swaggerSpecs));

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(null, swaggerOptions),
);
app.use("/api/auth", authRoutes);

app.get("/api/profile", authenticateToken, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    select: { id: true, email: true, name: true },
  });
  res.json(user);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API Documentation available at /api-docs`);
});

module.exports = app;