import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export interface WorkExperienceItem {
  id?: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  isCurrentlyWorking: boolean;
  description?: string;
}

export interface EducationItem {
  id?: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  isCurrentlyStudying: boolean;
  description?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  userName?: string;
  age?: number;
  gender?: string;
  about?: string;
  skills?: string[];
  photoUrl?: string;
  workExperience?: WorkExperienceItem[];
  education?: EducationItem[];
  createdAt: string;
  updatedAt: string;
}

interface ViewProfileResponse {
  success: boolean;
  message: string;
  data: UserProfile;
}

interface EditProfilePayload {
  userName?: string;
  age?: number;
  gender?: string;
  about?: string;
  skills?: string[];
}

interface EditProfileResponse {
  success: boolean;
  message: string;
  data: UserProfile;
}

interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ChangePasswordResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    email: string;
  };
}

interface UseProfileReturn {
  viewProfile: (userId: string) => Promise<UserProfile>;
  editProfile: (data: EditProfilePayload) => Promise<UserProfile>;
  changePassword: (data: ChangePasswordPayload) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useProfile = (): UseProfileReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const viewProfile = async (userId: string): Promise<UserProfile> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.get<ViewProfileResponse>(
        `/api/v1/profile/view/${userId}`
      );

      return response.data.data;
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to load profile";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const editProfile = async (
    data: EditProfilePayload
  ): Promise<UserProfile> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.post<EditProfileResponse>(
        "/api/v1/profile/edit",
        data
      );

      toast.success("Profile updated successfully!");
      return response.data.data;
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to update profile";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (data: ChangePasswordPayload): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      await apiClient.post<ChangePasswordResponse>(
        "/api/v1/profile/password",
        data
      );

      toast.success("Password changed successfully!");
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to change password";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    viewProfile,
    editProfile,
    changePassword,
    isLoading,
    error,
  };
};
