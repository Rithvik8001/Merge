import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

interface VerifyTokenResponse {
  success: boolean;
  isValid: boolean;
  message: string;
}

interface UseResetPasswordReturn {
  verifyResetToken: (token: string) => Promise<boolean>;
  resetPassword: (
    token: string,
    password: string,
    confirmPassword: string
  ) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useResetPassword = (): UseResetPasswordReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyResetToken = async (token: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.get<VerifyTokenResponse>(
        "/api/v1/auth/verify-reset-token",
        {
          params: { token },
        }
      );

      return response.data.isValid;
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Invalid or expired reset token";
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (
    token: string,
    password: string,
    confirmPassword: string
  ): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.post<ResetPasswordResponse>(
        "/api/v1/auth/reset-password",
        {
          token,
          password,
          confirmPassword,
        }
      );

      toast.success(response.data.message);
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to reset password";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    verifyResetToken,
    resetPassword,
    isLoading,
    error,
  };
};
