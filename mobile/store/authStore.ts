import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

export interface User {
  userId: string;
  email: string;
  userName?: string;
  photoUrl?: string;
}

export interface AuthStore {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isHydrating: boolean;
  tempEmail?: string; // Temporary email for OTP verification flow

  // Actions
  setUser: (user: User | null) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  setTempEmail: (email: string | undefined) => void;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      isHydrating: true,
      tempEmail: undefined,

      setUser: (user) => {
        // Persist middleware will automatically save to AsyncStorage
        // No need to manually save here
        set({
          user,
          isAuthenticated: !!user,
          error: null,
        });

        if (__DEV__) {
          console.log("👤 User set:", user ? `${user.email}` : "null");
          console.log("isAuthenticated:", !!user);
        }
      },

      setError: (error) =>
        set({
          error,
        }),

      setLoading: (loading) =>
        set({
          isLoading: loading,
        }),

      setTempEmail: (email) =>
        set({
          tempEmail: email,
        }),

      logout: async () => {
        try {
          await AsyncStorage.removeItem("user");
          await SecureStore.deleteItemAsync("jwt_token");
          set({
            user: null,
            isAuthenticated: false,
            error: null,
            tempEmail: undefined,
          });
        } catch (err) {
          if (__DEV__) console.error("Failed to logout:", err);
        }
      },

      hydrate: async () => {
        try {
          if (__DEV__) console.log("🔐 Starting auth hydration...");

          // Wait a tick to ensure persist middleware has finished rehydrating
          await new Promise((resolve) => setTimeout(resolve, 0));

          // Check if JWT token exists in SecureStore
          const token = await SecureStore.getItemAsync("jwt_token");

          if (__DEV__) {
            console.log("Token in SecureStore:", token ? "✓ Found" : "✗ Not found");
          }

          // Get current state from Zustand (persist middleware should have rehydrated it)
          const currentState = useAuthStore.getState();

          if (__DEV__) {
            console.log("User in store:", currentState.user ? `✓ ${currentState.user.email}` : "✗ Not found");
            console.log("isAuthenticated in store:", currentState.isAuthenticated);
            console.log("Full state:", {
              user: currentState.user,
              isAuthenticated: currentState.isAuthenticated,
              token: token ? "exists" : "missing",
            });
          }

          // If user & isAuthenticated are set but no token, clear them (orphaned data)
          if (!token && currentState.isAuthenticated) {
            if (__DEV__) {
              console.warn("⚠️ Token missing but user is marked authenticated");
              console.warn("   This happens when:");
              console.warn("   1. Server wasn't restarted after code changes");
              console.warn("   2. SecureStore is not working properly");
              console.warn("   3. Token was manually deleted");
              console.warn("   Clearing session for security...");
            }
            await AsyncStorage.removeItem("auth-store");
            set({
              user: null,
              isAuthenticated: false,
              error: null,
            });
          }

          // If token exists but no user, clear token (orphaned token)
          if (token && !currentState.isAuthenticated) {
            if (__DEV__) console.warn("⚠️ Token found but no user - clearing orphaned token");
            await SecureStore.deleteItemAsync("jwt_token");
          }

          if (__DEV__) console.log("✅ Auth hydration complete");
        } catch (err) {
          if (__DEV__) console.error("Failed to hydrate auth store:", err);
          set({
            user: null,
            isAuthenticated: false,
            error: null,
          });
        } finally {
          set({ isHydrating: false });
        }
      },
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          if (__DEV__) console.error("❌ Failed to rehydrate auth store from AsyncStorage:", error);
        } else {
          if (__DEV__) {
            console.log("📦 AsyncStorage rehydration complete");
            console.log("   User:", state?.user ? `✓ ${state.user.email}` : "✗");
            console.log("   isAuthenticated:", state?.isAuthenticated);
          }
        }
      },
    }
  )
);
