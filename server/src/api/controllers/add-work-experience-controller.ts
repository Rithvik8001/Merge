import type { Request, Response } from "express";
import User from "../../db/models/user.js";
import AppError from "../../utils/AppError.js";
import { workExperienceValidation } from "../validations/profile-validation.js";
import handleZodError from "../../utils/zodErrorHandler.js";

const addWorkExperienceController = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const result = await workExperienceValidation(req.body);

    if (!result.success) {
      handleZodError(result.error);
      return;
    }

    const user = await User.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404, true, "USER_NOT_FOUND");
    }

    const workData = result.data;

    // Add new work experience to the array
    user.workExperience.push({
      company: workData.company,
      position: workData.position,
      startDate: new Date(workData.startDate),
      endDate: workData.endDate ? new Date(workData.endDate) : undefined,
      isCurrentlyWorking: workData.isCurrentlyWorking,
      description: workData.description,
    } as any);

    await user.save();

    const lastExperience = user.workExperience[user.workExperience.length - 1];

    return res.status(201).json({
      success: true,
      message: "Work experience added successfully",
      data: {
        id: lastExperience._id,
        company: lastExperience.company,
        position: lastExperience.position,
        startDate: lastExperience.startDate,
        endDate: lastExperience.endDate,
        isCurrentlyWorking: lastExperience.isCurrentlyWorking,
        description: lastExperience.description,
      },
    });
  } catch (error) {
    throw error;
  }
};

export default addWorkExperienceController;
