import { apiClient } from "../lib/api";
import { useAuthStore } from "../store/authStore";
import { validateOtp } from "../validations/otp";
import { parseApiError } from "../utils/errorHandler";

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
  const { setLoading, setError: setStoreError } = useAuthStore();
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);

  const verifyEmailOtp = async (
    email: string,
    otp: string
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setStoreError(null);

      // Validate inputs using Zod schema
      const validationResult = validateOtp({ otp, email });
      if (!validationResult.success) {
        const errors = validationResult.error.errors;
        const firstError = errors[0]?.message || "Invalid OTP";
        setStoreError(firstError);
        setLoading(false);
        return false;
      }

      const response = await apiClient.post<VerifyEmailOtpResponse>(
        "/api/v1/auth/verify-email-otp",
        { email, otp }
      );

      setLoading(false);
      return true;
    } catch (err) {
      const appError = parseApiError(err);
      setStoreError(appError.message);
      setLoading(false);
      return false;
    }
  };

  const resendVerificationOtp = async (email: string): Promise<boolean> => {
    try {
      setLoading(true);
      setStoreError(null);

      const response = await apiClient.post<ResendOtpResponse>(
        "/api/v1/auth/resend-verification-otp",
        { email }
      );

      setLoading(false);
      return true;
    } catch (err) {
      const appError = parseApiError(err);
      setStoreError(appError.message);
      setLoading(false);
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
