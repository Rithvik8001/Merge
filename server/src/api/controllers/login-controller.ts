import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import loginValidation from "../validations/login-validation";
import handleZodError from "../../utils/zodErrorHandler";
import User from "../../db/models/user";
import AppError from "../../utils/AppError";

const loginController = async (req: Request, res: Response) => {
  const result = await loginValidation(req.body);

  if (!result.success) {
    handleZodError(result.error);
    return;
  }

  const { email, password } = result.data;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError("No account found with this email address", 401, true);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError("Email or password is invalid", 401, true);
    }

    const resultData = {
      userId: user._id,
      email: user.email,
    };

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "7d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
      sameSite: "strict", // CSRF protection
      expires: new Date(Date.now() + 8 * 3600000),
    });

    res.status(200).json({
      message: "Login Successfull.",
      data: resultData,
    });
  } catch (error) {
    throw error;
  }
};

export default loginController;
