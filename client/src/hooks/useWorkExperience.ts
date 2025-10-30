import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export interface WorkExperience {
  id?: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  isCurrentlyWorking: boolean;
  description?: string;
}

interface AddWorkExperienceResponse {
  success: boolean;
  message: string;
  data: WorkExperience;
}

interface UseWorkExperienceReturn {
  addWorkExperience: (data: WorkExperience) => Promise<WorkExperience>;
  editWorkExperience: (experienceId: string, data: WorkExperience) => Promise<WorkExperience>;
  deleteWorkExperience: (experienceId: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useWorkExperience = (): UseWorkExperienceReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addWorkExperience = async (
    data: WorkExperience
  ): Promise<WorkExperience> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.post<AddWorkExperienceResponse>(
        "/api/v1/profile/experience",
        {
          company: data.company,
          position: data.position,
          startDate: new Date(data.startDate).toISOString(),
          endDate: data.endDate
            ? new Date(data.endDate).toISOString()
            : null,
          isCurrentlyWorking: data.isCurrentlyWorking,
          description: data.description,
        }
      );

      toast.success("Work experience added successfully!");
      return response.data.data;
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to add work experience";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const editWorkExperience = async (
    experienceId: string,
    data: WorkExperience
  ): Promise<WorkExperience> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.put<AddWorkExperienceResponse>(
        `/api/v1/profile/experience/${experienceId}`,
        {
          company: data.company,
          position: data.position,
          startDate: new Date(data.startDate).toISOString(),
          endDate: data.endDate
            ? new Date(data.endDate).toISOString()
            : null,
          isCurrentlyWorking: data.isCurrentlyWorking,
          description: data.description,
        }
      );

      toast.success("Work experience updated successfully!");
      return response.data.data;
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to update work experience";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteWorkExperience = async (experienceId: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      await apiClient.delete(`/api/v1/profile/experience/${experienceId}`);

      toast.success("Work experience deleted successfully!");
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to delete work experience";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addWorkExperience,
    editWorkExperience,
    deleteWorkExperience,
    isLoading,
    error,
  };
};
