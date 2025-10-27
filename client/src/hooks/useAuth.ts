import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

interface User {
  userId: string;
  email: string;
  userName?: string;
}

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setIsLoading(false);
          return;
        }
        try {
          const response = await apiClient.get<User>("/api/v1/profile/view");
          setUser(response.data);
          // Save to localStorage for next time
          localStorage.setItem("user", JSON.stringify(response.data));
        } catch (error) {
          // JWT cookie is invalid or expired
          setUser(null);
          localStorage.removeItem("user");
        }
      } catch (error) {
        setUser(null);
        localStorage.removeItem("user");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = useCallback(async () => {
    try {
      // Call backend logout endpoint
      await apiClient.post("/api/v1/auth/signout");
    } catch (error) {
      // Error on logout is not critical, still clear local state
    } finally {
      // Clear local state
      setUser(null);
      localStorage.removeItem("user");
    }
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    logout,
  };
};
