import { useAuthStore } from "@/store/authStore";

/**
 * Hook to access authentication state and actions
 * This is a convenient wrapper around the Zustand store
 *
 * Usage:
 * const { user, isAuthenticated, isLoading, logout } = useAuthState();
 */
export const useAuthState = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const logout = useAuthStore((state) => state.logout);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    logout,
  };
};
