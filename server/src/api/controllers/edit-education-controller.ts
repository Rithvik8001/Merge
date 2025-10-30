import type { Request, Response } from "express";
import User from "../../db/models/user.js";
import AppError from "../../utils/AppError.js";
import { educationValidation } from "../validations/profile-validation.js";
import handleZodError from "../../utils/zodErrorHandler.js";

const editEducationController = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { educationId } = req.params;

    const result = await educationValidation(req.body);

    if (!result.success) {
      handleZodError(result.error);
      return;
    }

    const user = await User.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404, true, "USER_NOT_FOUND");
    }

    // Find the education by ID
    const educationIndex = user.education.findIndex(
      (edu) => edu._id?.toString() === educationId
    );

    if (educationIndex === -1) {
      throw new AppError(
        "Education not found",
        404,
        true,
        "EDUCATION_NOT_FOUND"
      );
    }

    const eduData = result.data;

    // Update the education
    user.education[educationIndex] = {
      ...user.education[educationIndex],
      school: eduData.school,
      degree: eduData.degree,
      fieldOfStudy: eduData.fieldOfStudy,
      startDate: new Date(eduData.startDate),
      endDate: eduData.endDate ? new Date(eduData.endDate) : undefined,
      isCurrentlyStudying: eduData.isCurrentlyStudying,
      description: eduData.description,
    } as any;

    await user.save();

    const updatedEducation = user.education[educationIndex];

    return res.status(200).json({
      success: true,
      message: "Education updated successfully",
      data: {
        id: updatedEducation._id,
        school: updatedEducation.school,
        degree: updatedEducation.degree,
        fieldOfStudy: updatedEducation.fieldOfStudy,
        startDate: updatedEducation.startDate,
        endDate: updatedEducation.endDate,
        isCurrentlyStudying: updatedEducation.isCurrentlyStudying,
        description: updatedEducation.description,
      },
    });
  } catch (error) {
    throw error;
  }
};

export default editEducationController;
