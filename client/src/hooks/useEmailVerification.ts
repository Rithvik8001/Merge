import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

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
  verifyEmailOtp: (email: string, otp: string) => Promise<void>;
  resendVerificationOtp: (email: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useEmailVerification = (): UseEmailVerificationReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyEmailOtp = async (email: string, otp: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.post<VerifyEmailOtpResponse>(
        "/api/v1/auth/verify-email-otp",
        { email, otp }
      );

      toast.success(response.data.message);
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to verify email";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerificationOtp = async (email: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.post<ResendOtpResponse>(
        "/api/v1/auth/resend-verification-otp",
        { email }
      );

      toast.success(response.data.message);
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to resend OTP";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    verifyEmailOtp,
    resendVerificationOtp,
    isLoading,
    error,
  };
};
