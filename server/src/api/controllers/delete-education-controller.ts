import type { Request, Response } from "express";
import User from "../../db/models/user.js";
import AppError from "../../utils/AppError.js";

const deleteEducationController = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { educationId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404, true, "USER_NOT_FOUND");
    }

    const educationIndex = user.education.findIndex(
      (edu) => edu._id?.toString() === educationId
    );

    if (educationIndex === -1) {
      throw new AppError("Education not found", 404, true, "EDUCATION_NOT_FOUND");
    }

    user.education.splice(educationIndex, 1);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Education deleted successfully",
    });
  } catch (error) {
    throw error;
  }
};

export default deleteEducationController;
