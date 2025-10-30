import type { Request, Response } from "express";
import User from "../../db/models/user.js";
import AppError from "../../utils/AppError.js";

const deleteWorkExperienceController = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { experienceId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404, true, "USER_NOT_FOUND");
    }

    const experienceIndex = user.workExperience.findIndex(
      (exp) => exp._id?.toString() === experienceId
    );

    if (experienceIndex === -1) {
      throw new AppError(
        "Work experience not found",
        404,
        true,
        "EXPERIENCE_NOT_FOUND"
      );
    }

    user.workExperience.splice(experienceIndex, 1);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Work experience deleted successfully",
    });
  } catch (error) {
    throw error;
  }
};

export default deleteWorkExperienceController;
