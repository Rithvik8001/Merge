import type { Request, Response } from "express";
import AppError from "../../utils/AppError.ts";

const signoutController = async (req: Request, res: Response) => {
  try {
    if (!req.cookies.token) {
      throw new AppError("Please login.", 401, true);
    }
    res.clearCookie("token");
    return res.status(200).json({
      message: "Signout successful.",
    });
  } catch (error) {
    throw Error;
  }
};

export default signoutController;
