import type { Request, Response } from "express";
import AppError from "../../utils/AppError";

interface ErrorResponse {
  message: string;
  errors?: Array<{ field: string; message: string }>;
  error?: string;
}

export const errorHandler = (err: Error, req: Request, res: Response) => {
  console.error("[Error]", {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  let response: ErrorResponse = { message: "Internal server error" };
  let statusCode = 500;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    response.message = err.message;

    const customErr = err as any;
    if (customErr.validationErrors) {
      response.errors = customErr.validationErrors;
    }

    if (process.env.NODE_ENV === "development") {
      response.error = err.message;
    }
  } else {
    statusCode = 500;
    response.message = "Internal server error";

    if (process.env.NODE_ENV === "development") {
      response.error = err.message;
    }
  }

  return res.status(statusCode).json(response);
};

export default errorHandler;
