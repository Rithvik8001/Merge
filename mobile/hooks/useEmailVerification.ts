import { useState } from "react";
import { apiClient } from "../lib/api";

interface VerifyEmailOtpResponse {
  success: boolean;
  message: string;
  data?: {
    email: string;
    isEmailVerified: boolean;
  };
}

interface ResendOtpResponse {
  success: boolean;
  message: string;
}

interface UseEmailVerificationReturn {
  verifyEmailOtp: (email: string, otp: string) => Promise<boolean>;
  resendVerificationOtp: (email: string) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

export const useEmailVerification = (): UseEmailVerificationReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyEmailOtp = async (
    email: string,
    otp: string,
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      // Validate OTP format (6 digits)
      if (!otp || otp.length !== 6) {
        throw new Error("OTP must be 6 digits");
      }

      if (!/^\d{6}$/.test(otp)) {
        throw new Error("OTP must contain only numbers");
      }

      const response = await apiClient.post<VerifyEmailOtpResponse>(
        "/api/v1/auth/verify-email-otp",
        { email, otp },
      );

      setIsLoading(false);
      console.log("Email verified:", response.data.message);
      return true;
    } catch (err: any) {
      setIsLoading(false);

      let errorMessage = "Failed to verify email";

      console.error("Email verification error:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      return false;
    }
  };

  const resendVerificationOtp = async (email: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.post<ResendOtpResponse>(
        "/api/v1/auth/resend-verification-otp",
        { email },
      );

      setIsLoading(false);
      console.log("OTP resent:", response.data.message);
      return true;
    } catch (err: any) {
      setIsLoading(false);

      let errorMessage = "Failed to resend OTP";

      console.error("Resend OTP error:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      return false;
    }
  };

  return {
    verifyEmailOtp,
    resendVerificationOtp,
    isLoading,
    error,
  };
};
