import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import signupValidation from "../validations/signup-validation.js";
import User from "../../db/models/user.js";
import AppError from "../../utils/AppError.js";
import handleZodError from "../../utils/zodErrorHandler.js";
import { sendOTPEmail } from "../../services/emailService.js";

const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const signupController = async (req: Request, res: Response) => {
  try {
    const result = await signupValidation(req.body);
    if (!result.success) {
      handleZodError(result.error);
      return;
    }

    const { email, password, ...optionalData } = result.data;
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      throw new AppError(
        "This email is already registered. Please use a different email or try logging in.",
        409,
        true,
        "EMAIL_ALREADY_EXISTS"
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const plainOTP = generateOTP();
    const otpHash = crypto.createHash("sha256").update(plainOTP).digest("hex");
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const newUser = await User.create({
      email,
      password: hashedPassword,
      isEmailVerified: false,
      emailVerificationOTP: otpHash,
      emailVerificationOtpExpiry: otpExpiry,
      otpAttempts: 0,
      otpLockedUntil: null,
      ...optionalData,
    });

    // Log OTP in development, send email in production
    if (process.env.NODE_ENV === "development") {
      console.log("📧 Email Verification OTP:");
      console.log("Email:", email);
      console.log("OTP:", plainOTP);
      console.log("Expires at:", otpExpiry);
    } else {
      // Send OTP email
      try {
        await sendOTPEmail(email, plainOTP);
      } catch (err) {
        console.error("Failed to send OTP email:", err);
        // Don't fail signup, but log the error
      }
    }

    return res.status(201).json({
      success: true,
      message: "User registered successfully. Please verify your email with the OTP.",
      data: {
        id: newUser._id,
        email: newUser.email,
        userName: newUser.userName || undefined,
      },
    });
  } catch (error) {
    throw error;
  }
};

export default signupController;
