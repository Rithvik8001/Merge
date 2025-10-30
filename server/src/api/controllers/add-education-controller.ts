import type { Request, Response } from "express";
import User from "../../db/models/user.js";
import AppError from "../../utils/AppError.js";
import { educationValidation } from "../validations/profile-validation.js";
import handleZodError from "../../utils/zodErrorHandler.js";

const addEducationController = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const result = await educationValidation(req.body);

    if (!result.success) {
      handleZodError(result.error);
      return;
    }

    const user = await User.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404, true, "USER_NOT_FOUND");
    }

    const eduData = result.data;

    // Add new education to the array
    user.education.push({
      school: eduData.school,
      degree: eduData.degree,
      fieldOfStudy: eduData.fieldOfStudy,
      startDate: new Date(eduData.startDate),
      endDate: eduData.endDate ? new Date(eduData.endDate) : undefined,
      isCurrentlyStudying: eduData.isCurrentlyStudying,
      description: eduData.description,
    } as any);

    await user.save();

    const lastEducation = user.education[user.education.length - 1];

    return res.status(201).json({
      success: true,
      message: "Education added successfully",
      data: {
        id: lastEducation._id,
        school: lastEducation.school,
        degree: lastEducation.degree,
        fieldOfStudy: lastEducation.fieldOfStudy,
        startDate: lastEducation.startDate,
        endDate: lastEducation.endDate,
        isCurrentlyStudying: lastEducation.isCurrentlyStudying,
        description: lastEducation.description,
      },
    });
  } catch (error) {
    throw error;
  }
};

export default addEducationController;
