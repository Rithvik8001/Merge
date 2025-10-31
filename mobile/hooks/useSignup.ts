import { useState } from "react";
import { useRouter } from "expo-router";
import { apiClient } from "../lib/api";

interface SignupData {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignupResponse {
  message: string;
  data: {
    userId: string;
    email: string;
    userName: string;
  };
}

interface UseSignupReturn {
  isLoading: boolean;
  error: string | null;
  signup: (data: SignupData) => Promise<boolean>;
}

const validatePassword = (
  password: string
): { valid: boolean; message: string } => {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  // Server allows: @$!%*?&
  const hasSpecialChar = /[@$!%*?&]/.test(password);
  const isLongEnough = password.length >= 8;

  if (!isLongEnough) {
    return {
      valid: false,
      message: "Password must be at least 8 characters long",
    };
  }
  if (!hasUpperCase) {
    return {
      valid: false,
      message: "Password must contain an uppercase letter",
    };
  }
  if (!hasLowerCase) {
    return {
      valid: false,
      message: "Password must contain a lowercase letter",
    };
  }
  if (!hasNumber) {
    return {
      valid: false,
      message: "Password must contain a number",
    };
  }
  if (!hasSpecialChar) {
    return {
      valid: false,
      message: "Password must include uppercase, lowercase, number, and special character (@$!%*?&)",
    };
  }

  return { valid: true, message: "" };
};

export const useSignup = (): UseSignupReturn => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signup = async (data: SignupData): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      // Validate inputs
      if (!data.userName || !data.email || !data.password) {
        throw new Error("All fields are required");
      }

      if (data.password !== data.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      // Validate username
      if (data.userName.length < 6 || data.userName.length > 15) {
        throw new Error("Username must be between 6 and 15 characters");
      }

      if (!/^[a-zA-Z0-9_]+$/.test(data.userName)) {
        throw new Error(
          "Username can only contain letters, numbers, and underscores"
        );
      }

      // Validate password strength
      const passwordValidation = validatePassword(data.password);
      if (!passwordValidation.valid) {
        throw new Error(passwordValidation.message);
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new Error("Please enter a valid email address");
      }

      // Note: Server doesn't accept confirmPassword, only validate on client
      const response = await apiClient.post<SignupResponse>(
        "/api/v1/auth/signup",
        {
          userName: data.userName,
          email: data.email,
          password: data.password,
        }
      );

      setIsLoading(false);
      // Navigate to email verification screen with email as param
      router.push({
        pathname: "/(auth)/verify-email",
        params: { email: data.email },
      });
      return true;
    } catch (err: any) {
      setIsLoading(false);

      let errorMessage = "Signup failed - please check your input and try again";

      // Log the full error for debugging
      console.error("Signup error:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.data?.errors) {
        // Handle validation errors array
        const errors = err.response.data.errors;
        if (Array.isArray(errors)) {
          errorMessage = errors.map((e: any) => e.message).join(", ");
        } else {
          errorMessage = JSON.stringify(errors);
        }
      } else if (err.response?.status === 400) {
        errorMessage = "Invalid signup data - please check all fields";
      } else if (err.response?.status === 409) {
        errorMessage = "Email or username already exists";
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      return false;
    }
  };

  return {
    isLoading,
    error,
    signup,
  };
};
