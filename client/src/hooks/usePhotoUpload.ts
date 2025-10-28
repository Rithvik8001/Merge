import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

interface PhotoUploadResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    email: string;
    userName?: string;
    age?: number;
    gender?: string;
    about: string;
    skills: string[];
    photoUrl: string;
    updatedAt: string;
  };
}

export const usePhotoUpload = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadPhoto = async (file: File): Promise<string | null> => {
    try {
      setIsLoading(true);
      setError(null);

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        const err = "File size exceeds 5MB limit";
        setError(err);
        toast.error(err);
        return null;
      }

      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      if (!allowedTypes.includes(file.type)) {
        const err = "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed";
        setError(err);
        toast.error(err);
        return null;
      }

      // Create FormData
      const formData = new FormData();
      formData.append("photo", file);

      // Upload to backend
      const response = await axios.post<PhotoUploadResponse>(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"}/api/v1/profile/photo/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Photo uploaded successfully");
        return response.data.data.photoUrl;
      } else {
        throw new Error("Upload failed");
      }
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || "Failed to upload photo"
        : "Failed to upload photo";

      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    uploadPhoto,
    isLoading,
    error,
  };
};

export type { PhotoUploadResponse };
