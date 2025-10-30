import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export interface Education {
  id?: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  isCurrentlyStudying: boolean;
  description?: string;
}

interface AddEducationResponse {
  success: boolean;
  message: string;
  data: Education;
}

interface UseEducationReturn {
  addEducation: (data: Education) => Promise<Education>;
  editEducation: (educationId: string, data: Education) => Promise<Education>;
  deleteEducation: (educationId: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useEducation = (): UseEducationReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addEducation = async (data: Education): Promise<Education> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.post<AddEducationResponse>(
        "/api/v1/profile/education",
        {
          school: data.school,
          degree: data.degree,
          fieldOfStudy: data.fieldOfStudy,
          startDate: new Date(data.startDate).toISOString(),
          endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
          isCurrentlyStudying: data.isCurrentlyStudying,
          description: data.description,
        }
      );

      toast.success("Education added successfully!");
      return response.data.data;
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to add education";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const editEducation = async (
    educationId: string,
    data: Education
  ): Promise<Education> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.put<AddEducationResponse>(
        `/api/v1/profile/education/${educationId}`,
        {
          school: data.school,
          degree: data.degree,
          fieldOfStudy: data.fieldOfStudy,
          startDate: new Date(data.startDate).toISOString(),
          endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
          isCurrentlyStudying: data.isCurrentlyStudying,
          description: data.description,
        }
      );

      toast.success("Education updated successfully!");
      return response.data.data;
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to update education";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEducation = async (educationId: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      await apiClient.delete(`/api/v1/profile/education/${educationId}`);

      toast.success("Education deleted successfully!");
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to delete education";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addEducation,
    editEducation,
    deleteEducation,
    isLoading,
    error,
  };
};
