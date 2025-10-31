import axios, { AxiosError } from "axios";
import AppError from "./AppError";

export interface ApiErrorResponse {
  message?: string;
  error?: string;
  errors?: Array<{ path?: string; message: string }>;
  errorCode?: string;
  statusCode?: number;
}

export const parseApiError = (error: unknown): AppError => {
  // Handle axios errors
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const status = axiosError.response?.status || 500;
    const data = axiosError.response?.data;

    // Handle validation errors (Zod)
    if (status === 400 && data?.errors && Array.isArray(data.errors)) {
      const fieldErrors: Record<string, string[]> = {};
      data.errors.forEach((err: any) => {
        const field = err.path || "general";
        if (!fieldErrors[field]) {
          fieldErrors[field] = [];
        }
        fieldErrors[field].push(err.message);
      });
      return new AppError(
        data.message || "Validation failed",
        status,
        true,
        "VALIDATION_ERROR",
        fieldErrors,
      );
    }

    // Handle other API errors
    if (data?.message) {
      return new AppError(data.message, status, true, data.errorCode);
    }

    if (data?.error) {
      return new AppError(data.error, status, true);
    }

    // Handle specific status codes
    switch (status) {
      case 400:
        return new AppError(
          "Invalid request - please check your input",
          400,
          true,
          "INVALID_REQUEST",
        );
      case 401:
        return new AppError("Invalid credentials", 401, true, "UNAUTHORIZED");
      case 403:
        return new AppError("Access denied", 403, true, "FORBIDDEN");
      case 409:
        return new AppError(
          "Email or username already exists",
          409,
          true,
          "CONFLICT",
        );
      case 429:
        return new AppError(
          "Too many requests. Please try again later",
          429,
          true,
          "RATE_LIMITED",
        );
      case 500:
        return new AppError(
          "Server error. Please try again later",
          500,
          true,
          "SERVER_ERROR",
        );
      default:
        return new AppError(
          axiosError.message || "An error occurred",
          status,
          true,
        );
    }
  }

  // Handle network errors
  if (error instanceof Error) {
    if (
      error.message.includes("Network") ||
      error.message === "Network Error"
    ) {
      return new AppError(
        "Network error - please check your connection",
        0,
        true,
        "NETWORK_ERROR",
      );
    }

    if (error.message.includes("timeout")) {
      return new AppError(
        "Request timeout - please try again",
        0,
        true,
        "TIMEOUT",
      );
    }

    return new AppError(
      error.message || "An unexpected error occurred",
      500,
      true,
    );
  }

  // Handle unknown errors
  return new AppError("An unexpected error occurred", 500, false);
};

/**
 * Gets the user-friendly error message
 */
export const getErrorMessage = (error: unknown): string => {
  const appError = parseApiError(error);
  return appError.message;
};

/**
 * Gets field-specific errors from validation failures
 */
export const getFieldErrors = (
  error: unknown,
): Record<string, string[]> | undefined => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    if (
      axiosError.response?.status === 400 &&
      axiosError.response?.data?.errors
    ) {
      const fieldErrors: Record<string, string[]> = {};
      axiosError.response.data.errors.forEach((err: any) => {
        const field = err.path || "general";
        if (!fieldErrors[field]) {
          fieldErrors[field] = [];
        }
        fieldErrors[field].push(err.message);
      });
      return fieldErrors;
    }
  }
  return undefined;
};

/**
 * Check if error is a specific type
 */
export const isErrorType = (error: unknown, errorCode: string): boolean => {
  const appError = parseApiError(error);
  return appError.errorCode === errorCode;
};

export default {
  parseApiError,
  getErrorMessage,
  getFieldErrors,
  isErrorType,
};
