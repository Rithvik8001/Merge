import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AppError from "../../utils/AppError.ts";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      throw new AppError("Authentication token is required", 401, true);
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as {
      userId: string;
    };

    req.userId = decoded.userId;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError("Invalid authentication token", 401, true);
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError("Authentication token has expired", 401, true);
    }
    throw error;
  }
};

export default authMiddleware;
