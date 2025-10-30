import type { Request, Response } from "express";
import crypto from "crypto";
import User from "../../db/models/user.js";
import AppError from "../../utils/AppError.js";
import { validateForgotPassword } from "../validations/password-reset-validation.js";
import handleZodError from "../../utils/zodErrorHandler.js";

const forgotPasswordController = async (req: Request, res: Response) => {
  const result = await validateForgotPassword(req.body);

  if (!result.success) {
    handleZodError(result.error);
    return;
  }

  const { email } = result.data;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError("No account found with this email address", 404, true);
    }

    // Generate a secure reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Set token and expiry (10 minutes)
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordTokenExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await user.save();

    // In production, send email with reset link
    // For now, we'll return the token in the response (for testing)
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}&email=${email}`;

    // TODO: Send email with reset link
    // await sendPasswordResetEmail(email, resetLink);

    // Log reset link in development
    if (process.env.NODE_ENV === "development") {
      console.log("🔐 Password Reset Link (Development Only):");
      console.log("Reset Link:", resetLink);
      console.log("Token (plain):", resetToken);
      console.log("Token (hashed):", resetTokenHash);
      console.log("Expiry:", user.resetPasswordTokenExpiry);
    }

    return res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
      // For testing purposes only - remove in production
      resetLink: process.env.NODE_ENV === "development" ? resetLink : undefined,
    });
  } catch (error) {
    throw error;
  }
};

export default forgotPasswordController;
