import type { Request, Response } from "express";
import crypto from "crypto";
import User from "../../db/models/user.js";
import AppError from "../../utils/AppError.js";

const verifyResetTokenController = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;

    if (!token || typeof token !== "string") {
      throw new AppError("Reset token is required", 400, true, "INVALID_TOKEN");
    }

    // Hash the provided token to compare with stored hash
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    console.log("🔍 Verifying reset token:");
    console.log("Provided token hash:", tokenHash);

    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: tokenHash,
      resetPasswordTokenExpiry: { $gt: new Date() },
    });

    console.log("User found:", user ? `Yes (${user.email})` : "No");

    if (!user) {
      throw new AppError(
        "Invalid or expired reset token",
        400,
        true,
        "INVALID_RESET_TOKEN"
      );
    }

    return res.status(200).json({
      success: true,
      message: "Reset token is valid",
      isValid: true,
    });
  } catch (error) {
    throw error;
  }
};

export default verifyResetTokenController;
