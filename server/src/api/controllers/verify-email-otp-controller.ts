import type { Request, Response } from "express";
import crypto from "crypto";
import User from "../../db/models/user.js";
import AppError from "../../utils/AppError.js";
import { validateVerifyEmailOtp } from "../validations/email-verification-validation.js";
import handleZodError from "../../utils/zodErrorHandler.js";

const verifyEmailOtpController = async (req: Request, res: Response) => {
  const result = await validateVerifyEmailOtp(req.body);

  if (!result.success) {
    handleZodError(result.error);
    return;
  }

  const { email, otp } = result.data;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError("No account found with this email address", 404, true);
    }

    // Check if already verified
    if (user.isEmailVerified) {
      throw new AppError(
        "Email is already verified",
        400,
        true,
        "EMAIL_ALREADY_VERIFIED"
      );
    }

    // Check if account is locked
    if (user.otpLockedUntil && new Date() < user.otpLockedUntil) {
      const remainingSeconds = Math.ceil(
        (user.otpLockedUntil.getTime() - new Date().getTime()) / 1000
      );
      throw new AppError(
        `Too many failed attempts. Try again in ${remainingSeconds} seconds`,
        429,
        true,
        "OTP_LOCKED"
      );
    }

    // Check if OTP is expired
    if (
      !user.emailVerificationOtpExpiry ||
      new Date() > user.emailVerificationOtpExpiry
    ) {
      throw new AppError(
        "OTP has expired. Please request a new one",
        400,
        true,
        "OTP_EXPIRED"
      );
    }

    // Hash provided OTP and compare
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

    if (otpHash !== user.emailVerificationOTP) {
      // Increment attempts
      user.otpAttempts = (user.otpAttempts || 0) + 1;

      // Lock account after 5 failed attempts
      if (user.otpAttempts >= 5) {
        user.otpLockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minute lockout
        await user.save();
        throw new AppError(
          "Too many failed attempts. Account locked for 15 minutes",
          429,
          true,
          "OTP_LOCKED"
        );
      }

      await user.save();
      throw new AppError(
        "Invalid OTP. Please try again",
        400,
        true,
        "INVALID_OTP"
      );
    }

    // OTP is correct - verify email
    user.isEmailVerified = true;
    user.emailVerificationOTP = null as any;
    user.emailVerificationOtpExpiry = null as any;
    user.otpAttempts = 0;
    user.otpLockedUntil = null as any;

    await user.save();

    console.log("✅ Email verified for:", email);

    return res.status(200).json({
      success: true,
      message: "Email verified successfully!",
      data: {
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    throw error;
  }
};

export default verifyEmailOtpController;
