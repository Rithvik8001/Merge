import { useRouter } from "expo-router";
import { apiClient, setAuthToken } from "../lib/api";
import { useAuthStore } from "../store/authStore";
import { validateLogin, LoginData } from "../validations/login";
import { parseApiError, getErrorMessage } from "../utils/errorHandler";

interface LoginResponse {
  message: string;
  data: {
    userId: string;
    email: string;
    userName?: string;
    photoUrl?: string;
  };
  token?: string;
}

interface UseLoginReturn {
  isLoading: boolean;
  error: string | null;
  login: (credentials: { email: string; password: string }) => Promise<boolean>;
}

export const useLogin = (): UseLoginReturn => {
  const router = useRouter();
  const { setUser, setLoading, setError: setStoreError } = useAuthStore();
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);

  const login = async (credentials: {
    email: string;
    password: string;
  }): Promise<boolean> => {
    try {
      setLoading(true);
      setStoreError(null);

      // Validate inputs
      const validationResult = validateLogin(credentials);
      if (!validationResult.success) {
        const errors = validationResult.error.errors;
        const firstError = errors[0]?.message || "Invalid email or password";
        setStoreError(firstError);
        setLoading(false);
        return false;
      }

      const response = await apiClient.post<LoginResponse>(
        "/api/v1/auth/login",
        credentials
      );

      if (__DEV__) {
        console.log("🔑 Login response:", {
          message: response.data.message,
          token: response.data.token ? "✓ Received" : "✗ Missing",
          fullResponse: response.data,
        });
      }

      const userData = response.data.data;
      const token = response.data.token;

      // Store JWT token from response body
      if (token) {
        if (__DEV__) console.log("💾 Storing token in SecureStore...");
        await setAuthToken(token);
        if (__DEV__) console.log("✅ Token stored");
      } else {
        if (__DEV__) console.warn("⚠️ No token in response!");
      }

      setUser({
        userId: userData.userId,
        email: userData.email,
        userName: userData.userName,
        photoUrl: userData.photoUrl,
      });

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
    isLoading,
    error,
    login,
  };
};
