import type { Request, Response } from "express";
import User from "../../db/models/user.ts";
import AppError from "../../utils/AppError.ts";
import { editProfileValidation } from "../validations/profile-validation.ts";
import handleZodError from "../../utils/zodErrorHandler.ts";

const editProfileController = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const result = await editProfileValidation(req.body);

    if (!result.success) {
      handleZodError(result.error);
      return;
    }

    const user = await User.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404, true, "USER_NOT_FOUND");
    }

    const updateData = result.data;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password -__v");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        id: updatedUser?._id,
        email: updatedUser?.email,
        userName: updatedUser?.userName || undefined,
        age: updatedUser?.age || undefined,
        gender: updatedUser?.gender || undefined,
        about: updatedUser?.about,
        updatedAt: updatedUser?.updatedAt,
      },
    });
  } catch (error) {
    throw error;
  }
};

export default editProfileController;
