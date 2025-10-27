import { Navigate } from "react-router-dom";
import { useAuthState } from "@/hooks/useAuthState";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute component to guard routes that require authentication
 * If user is not authenticated, they are redirected to /login
 * While checking auth, a loading screen is shown
 *
 * Usage:
 * <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
 */
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuthState();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // User is authenticated, show the component
  return <>{children}</>;
};
