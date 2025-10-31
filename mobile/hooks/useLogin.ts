import { useState } from "react";
import { useRouter } from "expo-router";
import { apiClient, setAuthToken } from "../lib/api";
import { useAuthStore } from "../store/authStore";

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  data: {
    userId: string;
    email: string;
    userName?: string;
    photoUrl?: string;
  };
}

interface UseLoginReturn {
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
}

export const useLogin = (): UseLoginReturn => {
  const router = useRouter();
  const { setUser, setError: setStoreError } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      setStoreError(null);

      // Validate inputs
      if (!credentials.email || !credentials.password) {
        throw new Error("Email and password are required");
      }

      const response = await apiClient.post<LoginResponse>(
        "/api/v1/auth/login",
        credentials,
      );

      const userData = response.data.data;

      // Store JWT token
      const token = response.headers["authorization"];
      if (token) {
        await setAuthToken(token);
      }

      setUser({
        userId: userData.userId,
        email: userData.email,
        userName: userData.userName,
        photoUrl: userData.photoUrl,
      });

      setIsLoading(false);
      return true;
    } catch (err: any) {
      setIsLoading(false);

      let errorMessage = "Login failed";

      console.error("Login error:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.status === 401) {
        errorMessage = "Invalid email or password";
      } else if (err.response?.status === 403) {
        errorMessage = "Email not verified. Please verify your email first.";
      } else if (err.message === "Network Error" || !err.response) {
        errorMessage = "Network error - check your connection";
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setStoreError(errorMessage);
      return false;
    }
  };

  return {
    isLoading,
    error,
    login,
  };
};
