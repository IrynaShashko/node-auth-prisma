import express from "express";

import { addReview, getAllReviews } from "../controllers/reviewController.js";

import { protect } from "../utils/authProtect.js";

import { validateRequest } from "../middleware/validateRequest.js";
import { addReviewSchema } from "../validators/reviewValidators.js";

const router = express.Router();

router.post("/", protect, validateRequest(addReviewSchema), addReview);

router.get("/", getAllReviews);

export default router;
