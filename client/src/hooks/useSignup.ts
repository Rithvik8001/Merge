import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

interface SignupData {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignupResponse {
  userId: string;
  email: string;
  userName: string;
}

interface UseSignupReturn {
  isLoading: boolean;
  error: string | null;
  signup: (data: SignupData) => Promise<void>;
}

const validatePassword = (
  password: string
): { valid: boolean; message: string } => {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};:'"|,.<>/?\\]/.test(password);
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
    return { valid: false, message: "Password must contain a number" };
  }
  if (!hasSpecialChar) {
    return {
      valid: false,
      message: "Password must contain a special character",
    };
  }

  return { valid: true, message: "" };
};

const validateUsername = (
  userName: string
): { valid: boolean; message: string } => {
  const isValidLength = userName.length >= 6 && userName.length <= 15;
  const isValidFormat = /^[a-zA-Z0-9_]+$/.test(userName);

  if (!isValidLength) {
    return { valid: false, message: "Username must be 6-15 characters" };
  }
  if (!isValidFormat) {
    return {
      valid: false,
      message: "Username can only contain letters, numbers, and underscores",
    };
  }

  return { valid: true, message: "" };
};

export const useSignup = (): UseSignupReturn => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signup = async (data: SignupData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Validate all fields
      if (
        !data.userName ||
        !data.email ||
        !data.password ||
        !data.confirmPassword
      ) {
        throw new Error("All fields are required");
      }

      // Validate username
      const userNameValidation = validateUsername(data.userName);
      if (!userNameValidation.valid) {
        throw new Error(userNameValidation.message);
      }

      // Validate password
      const passwordValidation = validatePassword(data.password);
      if (!passwordValidation.valid) {
        throw new Error(passwordValidation.message);
      }

      // Validate password confirmation
      if (data.password !== data.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new Error("Please enter a valid email address");
      }

      const response = await apiClient.post<SignupResponse>(
        "/api/v1/auth/signup",
        {
          userName: data.userName,
          email: data.email,
          password: data.password,
        }
      );

      // Account created successfully - redirect to login
      toast.success(
        "Account created successfully! Please login with your credentials."
      );
      navigate("/login");
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : err instanceof Error
          ? err.message
          : "Signup failed. Please try again.";

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, signup };
};
