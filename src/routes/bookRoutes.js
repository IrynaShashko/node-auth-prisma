import express from "express";

const router = express.Router();

import authenticateToken from "../middleware/auth.js";

import { createBooking } from "../controllers/bookController.js";

router.post("/book-service", authenticateToken, createBooking);

export default router;
