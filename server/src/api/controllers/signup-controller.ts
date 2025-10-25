import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import signupValidation from "../validations/signup-validation.ts";
import User from "../../db/models/user.ts";
import AppError from "../../utils/AppError.ts";
import handleZodError from "../../utils/zodErrorHandler.ts";

const signupController = async (req: Request, res: Response) => {
  try {
    const result = await signupValidation(req.body);
    if (!result.success) {
      handleZodError(result.error);
      return;
    }

    const { email, password, ...optionalData } = result.data;
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      throw new AppError(
        "This email is already registered. Please use a different email or try logging in.",
        409,
        true,
        "EMAIL_ALREADY_EXISTS",
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      ...optionalData,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: newUser._id,
        email: newUser.email,
        userName: newUser.userName || undefined,
      },
    });
  } catch (error) {
    throw error;
  }
};

export default signupController;
