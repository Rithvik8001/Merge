import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";

// Create axios instance with credentials enabled
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  data: {
    userId: string;
    email: string;
  };
}

interface UseLoginReturn {
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
}

export const useLogin = (): UseLoginReturn => {
  const navigate = useNavigate();
  const { setUser, setError: setStoreError } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);

      // Validate inputs
      if (!credentials.email || !credentials.password) {
        throw new Error("Email and password are required");
      }

      const response = await apiClient.post<LoginResponse>(
        "/api/v1/auth/login",
        {
          email: credentials.email,
          password: credentials.password,
        }
      );

      // Extract user data from response
      if (response.data?.data) {
        const userData = {
          userId: response.data.data.userId,
          email: response.data.data.email,
        };

        // Save to sessionStorage for use on page refresh
        sessionStorage.setItem("user", JSON.stringify(userData));

        // Token is stored in httpOnly cookie automatically by the server
        // No need to store it in sessionStorage - Socket.io will use the cookie

        // Update Zustand store with user data
        setUser(userData);
      }

      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : err instanceof Error
          ? err.message
          : "Login failed. Please try again.";

      setError(errorMessage);
      setStoreError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, login };
};
