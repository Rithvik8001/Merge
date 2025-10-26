import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../../db/models/user.ts";
import AppError from "../../utils/AppError.ts";
import { passwordChangeValidation } from "../validations/profile-validation.ts";
import handleZodError from "../../utils/zodErrorHandler.ts";

const passwordChangeController = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const result = await passwordChangeValidation(req.body);

    if (!result.success) {
      handleZodError(result.error);
      return;
    }

    const { currentPassword, newPassword } = result.data;

    const user = await User.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404, true, "USER_NOT_FOUND");
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isCurrentPasswordValid) {
      throw new AppError(
        "Current password is incorrect",
        401,
        true,
        "INVALID_CURRENT_PASSWORD"
      );
    }

    if (currentPassword === newPassword) {
      throw new AppError(
        "New password must be different from current password",
        400,
        true,
        "SAME_PASSWORD"
      );
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(userId, {
      password: hashedNewPassword,
    });

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
      data: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    throw error;
  }
};

export default passwordChangeController;
