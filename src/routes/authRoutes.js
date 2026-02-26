import express from "express";
import {
  loginSchema,
  registerSchema,
  validate,
} from "../middleware/validators.js";

import authenticateToken from "../middleware/authenticateToken.js";

import {
  changePassword,
  forgotPassword,
  googleLogin,
  healthCheck,
  login,
  logout,
  profile,
  register,
  resetPassword,
  updateProfile,
  verifyEmail,
} from "../controllers/authController.js";

const router = express.Router();

// Register
router.post("/register", validate(registerSchema), register);

// Email Verification
router.get("/verify-email/:token", verifyEmail);

// Login
router.post("/login", validate(loginSchema), login);

// Google Login
router.post("/google", googleLogin);

//Profile
router.get("/profile", authenticateToken, profile);
router.put("/profile", authenticateToken, updateProfile);

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
