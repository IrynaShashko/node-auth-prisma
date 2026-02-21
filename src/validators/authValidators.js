import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(20, { message: "Name must be at most 20 characters long" }),

  email: z.email({ message: "Invalid email address" }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});
