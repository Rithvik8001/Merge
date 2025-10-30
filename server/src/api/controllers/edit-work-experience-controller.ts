import type { Request, Response } from "express";
import User from "../../db/models/user.js";
import AppError from "../../utils/AppError.js";
import { workExperienceValidation } from "../validations/profile-validation.js";
import handleZodError from "../../utils/zodErrorHandler.js";

const editWorkExperienceController = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { experienceId } = req.params;

    const result = await workExperienceValidation(req.body);

    if (!result.success) {
      handleZodError(result.error);
      return;
    }

    const user = await User.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404, true, "USER_NOT_FOUND");
    }

    // Find the experience by ID
    const experienceIndex = user.workExperience.findIndex(
      (exp) => exp._id?.toString() === experienceId
    );

    if (experienceIndex === -1) {
      throw new AppError("Work experience not found", 404, true, "EXPERIENCE_NOT_FOUND");
    }

    const workData = result.data;

    // Update the work experience
    user.workExperience[experienceIndex] = {
      ...user.workExperience[experienceIndex],
      company: workData.company,
      position: workData.position,
      startDate: new Date(workData.startDate),
      endDate: workData.endDate ? new Date(workData.endDate) : undefined,
      isCurrentlyWorking: workData.isCurrentlyWorking,
      description: workData.description,
    } as any;

    await user.save();

    const updatedExperience = user.workExperience[experienceIndex];

    return res.status(200).json({
      success: true,
      message: "Work experience updated successfully",
      data: {
        id: updatedExperience._id,
        company: updatedExperience.company,
        position: updatedExperience.position,
        startDate: updatedExperience.startDate,
        endDate: updatedExperience.endDate,
        isCurrentlyWorking: updatedExperience.isCurrentlyWorking,
        description: updatedExperience.description,
      },
    });
  } catch (error) {
    throw error;
  }
};

export default editWorkExperienceController;
