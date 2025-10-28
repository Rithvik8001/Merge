import type { Request, Response } from "express";
import User from "../../db/models/user.ts";
import AppError from "../../utils/AppError.ts";
import { viewProfileValidation } from "../validations/profile-validation.ts";
import handleZodError from "../../utils/zodErrorHandler.ts";

const viewProfileController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const result = await viewProfileValidation({ userId });

    if (!result.success) {
      handleZodError(result.error);
      return;
    }

    const user = await User.findById(userId).select("-password -__v");

    if (!user) {
      throw new AppError("User not found", 404, true, "USER_NOT_FOUND");
    }

    return res.status(200).json({
      success: true,
      message: "Profile retrieved successfully",
      data: {
        id: user._id,
        email: user.email,
        userName: user.userName || undefined,
        age: user.age || undefined,
        gender: user.gender || undefined,
        about: user.about,
        skills: user.skills || [],
        photoUrl: user.photoUrl || undefined,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    throw error;
  }
};

export default viewProfileController;
