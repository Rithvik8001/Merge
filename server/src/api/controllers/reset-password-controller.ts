import type { Request, Response } from "express";
import crypto from "crypto";
import bcrypt from "bcrypt";
import User from "../../db/models/user.js";
import AppError from "../../utils/AppError.js";
import { validateResetPassword } from "../validations/password-reset-validation.js";
import handleZodError from "../../utils/zodErrorHandler.js";

const resetPasswordController = async (req: Request, res: Response) => {
  const result = await validateResetPassword(req.body);

  if (!result.success) {
    handleZodError(result.error);
    return;
  }

  const { token, password } = result.data;

  try {
    // Hash the provided token to compare with stored hash
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: tokenHash,
      resetPasswordTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      throw new AppError(
        "Invalid or expired reset token",
        400,
        true,
        "INVALID_RESET_TOKEN"
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password and clear reset token
    user.password = hashedPassword;
    user.resetPasswordToken = null as any;
    user.resetPasswordTokenExpiry = null as any;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully. You can now log in with your new password.",
    });
  } catch (error) {
    throw error;
  }
};

export default resetPasswordController;
