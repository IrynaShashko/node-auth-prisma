import express from "express";
import authenticateToken from "../middleware/auth.js";
import {
  loginSchema,
  registerSchema,
  validate,
} from "../middleware/validators.js";
const router = express.Router();

import {
  register,
  login,
  profile,
  healthCheck,
  changePassword,
  forgotPassword,
  resetPassword,
  logout,
  verifyEmail,
} from "../controllers/authController.js";

// Register
router.post("/register", validate(registerSchema), register);

// Email Verification
router.get("/verify-email/:token", verifyEmail)

// Login
router.post("/login", validate(loginSchema), login);

//Profile
router.get("/profile", authenticateToken, profile);

// Health Check
router.get("/health", healthCheck);

// Change Password
router.post("/change-password", authenticateToken, changePassword);

// Forgot Password
router.post("/forgot-password", forgotPassword);

// Reset Password
router.post("/reset-password/:token", resetPassword);

// Logout Route
router.post("/logout", logout);

export default router;
