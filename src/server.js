import dotenv from "dotenv";
dotenv.config();

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";

import prisma from "./lib/prisma.js";
import authenticateToken from "./middleware/authenticateToken.js";

import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

import swaggerSpecs from "./swagger.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: "https://massage-maria-glushenko.netlify.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(cookieParser());
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

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(null, swaggerOptions));

app.use("/api/auth", authRoutes);

app.use("/api", bookRoutes);

app.use("/api/reviews", reviewRoutes);

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

export default app;
