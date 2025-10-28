import { ZodError } from "zod";
import AppError from "./AppError.js";

export interface ValidationError {
  field: string;
  message: string;
}

export const handleZodError = (error: ZodError): never => {
  const validationErrors: ValidationError[] = error.issues.map((issue: any) => {
    const field = issue.path.join(".") || "root";
    let message = issue.message;

    if (issue.code === "invalid_string") {
      if (issue.validation === "email") {
        message = "Please enter a valid email address";
      } else if (issue.validation === "regex") {
        message =
          field === "password"
            ? "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
            : message;
      }
    } else if (issue.code === "too_small") {
      const minimum = issue.minimum;
      if (field === "password") {
        message = `Password must be at least ${minimum} characters long`;
      } else if (field === "userName") {
        message = `Username must be at least ${minimum} characters long`;
      } else {
        message = `${field} is too short (minimum ${minimum} characters)`;
      }
    } else if (issue.code === "too_big") {
      const maximum = issue.maximum;
      if (field === "userName") {
        message = `Username must be no more than ${maximum} characters long`;
      } else {
        message = `${field} is too long (maximum ${maximum} characters)`;
      }
    }

    return {
      field,
      message,
    };
  });

  const customError = new AppError(
    "Please check your input and try again",
    400,
  ) as any;
  customError.validationErrors = validationErrors;
  throw customError;
};

export default handleZodError;
