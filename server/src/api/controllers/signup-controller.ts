import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import signupValidation from "../validations/signup-validation";
import User from "../../db/models/user";
import AppError from "../../utils/AppError";
import handleZodError from "../../utils/zodErrorHandler";

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
      return res.status(400).json({
        message: "User already exists with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      ...optionalData,
    });

    return res.status(201).json({
      message: "User registered successfully",
      data: {
        id: newUser._id,
        email: newUser.email,
        ...optionalData,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        message: error.message,
        errors: (error as any).validationErrors,
      });
    }

    console.error("[Signup Controller Error]", error);
    return res.status(500).json({
      message: "Internal server error",
      error:
        process.env.NODE_ENV === "development"
          ? (error as Error).message
          : undefined,
    });
  }
};

export default signupController;
