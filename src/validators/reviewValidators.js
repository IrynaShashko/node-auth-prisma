import { z } from "zod";

export const addReviewSchema = z.object({
  rating: z
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
  comment: z.string().optional(),
  userId: z.string(),
});
