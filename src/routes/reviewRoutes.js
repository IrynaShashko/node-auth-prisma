import express from "express";

import { addReview, getAllReviews } from "../controllers/reviewController.js";

import authenticateToken from "../middleware/authenticateToken.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { addReviewSchema } from "../validators/reviewValidators.js";

const router = express.Router();

router.post(
  "/",
  authenticateToken,
  validateRequest(addReviewSchema),
  addReview,
);

router.get("/", getAllReviews);

export default router;
