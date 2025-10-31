import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  setUser: (user) => {
    if (user) {
      AsyncStorage.setItem("user", JSON.stringify(user)).catch((err) =>
        console.error("Failed to store user:", err),
      );
    }
    set({
      user,
      isAuthenticated: !!user,
      error: null,
    });
  },

  setError: (error) =>
    set({
      error,
    }),

  logout: async () => {
    try {
      await AsyncStorage.removeItem("user");
      set({
        user: null,
        isAuthenticated: false,
        error: null,
      });
    } catch (err) {
      console.error("Failed to logout:", err);
    }
  },
}));
