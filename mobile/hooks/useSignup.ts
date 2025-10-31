import { useRouter } from "expo-router";
import { apiClient } from "../lib/api";
import { useAuthStore } from "../store/authStore";
import { validateSignup, SignupData } from "../validations/signup";
import { parseApiError } from "../utils/errorHandler";

interface SignupResponse {
  message: string;
  success?: boolean;
  data: {
    id?: string;
    userId?: string;
    email: string;
    userName?: string;
  };
}

interface UseSignupReturn {
  isLoading: boolean;
  error: string | null;
  signup: (data: SignupData) => Promise<boolean>;
}

export const useSignup = (): UseSignupReturn => {
  const router = useRouter();
  const { setLoading, setError: setStoreError, setTempEmail } = useAuthStore();
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);

  const signup = async (data: SignupData): Promise<boolean> => {
    try {
      setLoading(true);
      setStoreError(null);

      // Validate inputs using Zod schema
      const validationResult = validateSignup(data);
      if (!validationResult.success) {
        const errors = validationResult.error.errors;
        const firstError = errors[0]?.message || "Validation failed";
        setStoreError(firstError);
        setLoading(false);
        return false;
      }

      // Send signup request - only send required fields
      const response = await apiClient.post<SignupResponse>(
        "/api/v1/auth/signup",
        {
          userName: data.userName,
          email: data.email,
          password: data.password,
        }
      );

      // Store email in Zustand for OTP verification screen
      setTempEmail(data.email);
      setLoading(false);

      // Navigate to email verification screen
      router.push({
        pathname: "/(auth)/verify-email",
        params: { email: data.email },
      });

      return true;
    } catch (err) {
      const appError = parseApiError(err);
      setStoreError(appError.message);
      setLoading(false);
      return false;
    }
  };

  return {
    isLoading,
    error,
    signup,
  };
};
