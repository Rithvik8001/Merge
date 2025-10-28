import type { Request, Response, NextFunction } from "express";
import AppError from "../../utils/AppError";

interface ErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  errors?: Array<{ field: string; message: string }>;
  errorCode?: string;
  timestamp?: string;
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const isDevelopment = process.env.NODE_ENV === "development";

  console.error("[Error]", {
    timestamp: new Date().toISOString(),
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: isDevelopment ? req.body : undefined,
  });

  let response: ErrorResponse = {
    success: false,
    statusCode: 500,
    message: "Something went wrong. Please try again later.",
    timestamp: new Date().toISOString(),
  };

  if (err instanceof AppError) {
    response.statusCode = err.statusCode;
    response.message = err.message;

    if (err.errorCode) {
      response.errorCode = err.errorCode;
    }

    const customErr = err as any;
    if (customErr.validationErrors) {
      response.errors = customErr.validationErrors;
    }
  } else if (err.name === "ValidationError") {
    response.statusCode = 400;
    response.message = "Validation error occurred";
    response.errorCode = "VALIDATION_ERROR";
  } else if (err.name === "MongoError" || err.name === "MongoServerError") {
    response.statusCode = 400;
    response.message = "Database error occurred";
    response.errorCode = "DATABASE_ERROR";
  } else {
    response.statusCode = 500;
    response.message = "Something went wrong. Please try again later.";
  }

  if (!isDevelopment) {
    delete (response as any).timestamp;
  }

  return res.status(response.statusCode).json(response);
};

export default errorHandler;
