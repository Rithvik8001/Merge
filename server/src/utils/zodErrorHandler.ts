import { ZodError } from "zod";
import AppError from "./AppError";

export interface ValidationError {
  field: string;
  message: string;
}

export const handleZodError = (error: ZodError): never => {
  const validationErrors: ValidationError[] = error.issues.map((issue) => ({
    field: issue.path.join(".") || "root",
    message: issue.message,
  }));

  const customError = new AppError("Validation failed", 400) as any;
  customError.validationErrors = validationErrors;
  throw customError;
};

export default handleZodError;
