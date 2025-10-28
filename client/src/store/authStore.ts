import { create } from "zustand";
import axios from "axios";

export interface User {
  userId: string;
  email: string;
  userName?: string;
  photoUrl?: string;
}

export interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  setUser: (user: User | null) => void;
  setError: (error: string | null) => void;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      error: null,
    }),

  setError: (error) =>
    set({
      error,
    }),

  checkAuth: async () => {
    try {
      set({ isLoading: true, error: null });

      // First, check if we have user in sessionStorage from login
      const storedUser = sessionStorage.getItem("user");

      if (storedUser) {
        const user = JSON.parse(storedUser);

        // Verify with backend if we have userId
        if (user.userId) {
          try {
            const response = await apiClient.get<any>(
              `/api/v1/profile/view/${user.userId}`,
            );

            if (response.data?.data) {
              const userData: User = {
                userId: response.data.data.id || user.userId,
                email: response.data.data.email,
                userName: response.data.data.userName,
                photoUrl: response.data.data.photoUrl,
              };

              set({
                user: userData,
                isAuthenticated: true,
                error: null,
              });
              set({ isLoading: false });
              return;
            }
          } catch (err) {
            // Backend verification failed but we have stored user data
            // This might happen if JWT expired, so just use stored data for now
            // User will be fully verified on next API call with JWT
          }
        }

        // Use stored user data even if backend verification failed
        // The JWT cookie is what matters - it will be validated on actual API calls
        set({
          user,
          isAuthenticated: true,
          error: null,
        });
        set({ isLoading: false });
        return;
      }

      // No stored user, user is not authenticated
      set({
        user: null,
        isAuthenticated: false,
        error: null,
      });
    } catch (err) {
      set({
        user: null,
        isAuthenticated: false,
        error: null,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      await apiClient.post("/api/v1/auth/signout");
    } catch (err) {
      // Error on logout is not critical, still clear local state
    } finally {
      // Clear all storage
      sessionStorage.removeItem("user");
      set({
        user: null,
        isAuthenticated: false,
        error: null,
      });
    }
  },
}));
