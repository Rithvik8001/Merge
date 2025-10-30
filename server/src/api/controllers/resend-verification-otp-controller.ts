import type { Request, Response } from "express";
import crypto from "crypto";
import User from "../../db/models/user.js";
import AppError from "../../utils/AppError.js";
import { validateResendVerificationOtp } from "../validations/email-verification-validation.js";
import handleZodError from "../../utils/zodErrorHandler.js";
import { sendOTPEmail } from "../../services/emailService.js";

const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const resendVerificationOtpController = async (req: Request, res: Response) => {
  const result = await validateResendVerificationOtp(req.body);

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

    // Check if OTP still valid - if yes, don't generate new one
    if (
      user.emailVerificationOtpExpiry &&
      new Date() < user.emailVerificationOtpExpiry
    ) {
      throw new AppError(
        "OTP is still valid. Use the existing OTP or wait for it to expire",
        400,
        true,
        "OTP_STILL_VALID"
      );
    }

    // Generate new OTP
    const plainOTP = generateOTP();
    const otpHash = crypto.createHash("sha256").update(plainOTP).digest("hex");
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.emailVerificationOTP = otpHash;
    user.emailVerificationOtpExpiry = otpExpiry;
    user.otpAttempts = 0; // Reset attempts on resend
    user.otpLockedUntil = null as any;

    await user.save();

    // Log OTP in development and send email
    if (process.env.NODE_ENV === "development") {
      console.log("📧 Email Verification OTP (Resend):");
      console.log("Email:", email);
      console.log("OTP:", plainOTP);
      console.log("Expires at:", otpExpiry);
    }

    // Always send OTP email (works in both dev and production)
    try {
      await sendOTPEmail(email, plainOTP);
    } catch (err) {
      console.error("Failed to send OTP email:", err);
      // Don't fail the request, but log the error
    }

    return res.status(200).json({
      success: true,
      message: "New OTP sent to your email",
    });
  } catch (error) {
    throw error;
  }
};

export default resendVerificationOtpController;
