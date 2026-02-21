import bcrypt from "bcryptjs";

import crypto from "crypto";

import {
  emailContactBody,
  emailVerificationBody,
  sendEmail,
} from "../lib/mailer.js";
import prisma from "../lib/prisma.js";
import { generateToken } from "../utils/generateToken.js";

const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exist
  const userExist = await prisma.user.findUnique({
    where: { email: email },
  });

  if (userExist) {
    return res
      .status(400)
      .json({ error: "User already exist with this email" });
  }

  // Hash Password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const verificationToken = crypto.randomBytes(32).toString("hex");

  // Create User
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      verificationToken,
    },
  });

  // Generate verification URL
  const verifyUrl = `${process.env.WEB_URL}/api/auth/verify-email/${verificationToken}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Підтвердження реєстрації",
      html: emailVerificationBody(verifyUrl),
    });

    res.status(201).json({
      status: "success",
      data: {
        user: {
          id: user.id,
          name,
          email,
          isVerified: user.isVerified,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to send verification email." });
  }
};

// Email Verification Handler
const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { verificationToken: token },
    });

    if (!user) return res.status(400).send("Invalid or expired token.");

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true, verificationToken: null },
    });

    generateToken(updatedUser.id, res);

    res.send(`
      <div style="text-align: center; font-family: sans-serif; padding-top: 50px;">
        <h1 style="color: green;">✅ Пошту успішно підтверджено!</h1>
        <p>Тепер ви автоматично залогінені в системі.</p>
        <a href="${process.env.WEB_URL}" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px;">
          Перейти на головну сторінку
        </a>
      </div>
    `);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // Check if user email exists in the table
  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  // Check if email is verified
  if (!user.isVerified) {
    return res.status(403).json({ error: "Please verify your email first." });
  }

  // Verify Password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  // Generate JWT Token
  const token = generateToken(user.id, res);

  res.status(200).json({
    status: "success",
    data: {
      user: {
        id: user.id,
        email,
      },
      token,
    },
  });
};

const logout = async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
};

const profile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, name: true, createdAt: true },
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile." });
  }
};

const healthCheck = (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
};

const changePassword = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ error: "Request body is missing" });
  }

  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res
      .status(400)
      .json({ error: "Both old and new passwords are required" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Old password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 3600000);

    await prisma.user.update({
      where: { email },
      data: { resetToken: token, resetTokenExpiry: expiry },
    });

    const resetUrl = `${process.env.WEB_URL}/api/auth/reset-password/${token}`;

    await sendEmail({
      email: user.email,
      subject: "Скидання пароля",
      html: emailContactBody(resetUrl),
    });

    res.json({ message: "Reset link sent to email" });
  } catch (error) {
    res.status(500).json({ error: "Error sending email" });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    res.json({ message: "Password updated successfully. You can now log in." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export {
  changePassword,
  forgotPassword,
  healthCheck,
  login,
  logout,
  profile,
  register,
  resetPassword,
  verifyEmail,
};
