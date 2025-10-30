import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  resetLink?: string;
}

interface UseForgotPasswordReturn {
  requestPasswordReset: (email: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useForgotPassword = (): UseForgotPasswordReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestPasswordReset = async (email: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.post<ForgotPasswordResponse>(
        "/api/v1/auth/forgot-password",
        { email }
      );

      toast.success(response.data.message);
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to request password reset";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    requestPasswordReset,
    isLoading,
    error,
  };
};
