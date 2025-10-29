import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export interface SearchUser {
  id: string;
  email: string;
  userName?: string;
  age?: number;
  gender?: string;
  about?: string;
  skills?: string[];
  photoUrl?: string;
  createdAt: string;
}

export interface PaginationData {
  currentPage: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface SearchResponse {
  success: boolean;
  message: string;
  data: SearchUser[];
  pagination: PaginationData;
}

interface UseSearchReturn {
  users: SearchUser[];
  pagination: PaginationData;
  isLoading: boolean;
  error: string | null;
  search: (
    searchTerm: string,
    skills: string,
    gender: string,
    sortBy: string,
    page: number,
  ) => Promise<void>;
  clearSearch: () => void;
}

const defaultPagination: PaginationData = {
  currentPage: 1,
  limit: 20,
  totalCount: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

export const useSearch = (): UseSearchReturn => {
  const [users, setUsers] = useState<SearchUser[]>([]);
  const [pagination, setPagination] =
    useState<PaginationData>(defaultPagination);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (
    searchTerm: string = "",
    skills: string = "",
    gender: string = "",
    sortBy: string = "newest",
    page: number = 1,
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (skills) params.append("skills", skills);
      if (gender) params.append("gender", gender);
      params.append("sortBy", sortBy);
      params.append("page", page.toString());
      params.append("limit", "20");

      const response = await apiClient.get<SearchResponse>(
        `/api/v1/connection/user/search?${params.toString()}`,
      );

      if (response.data.success) {
        setUsers(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to search users";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const clearSearch = () => {
    setUsers([]);
    setPagination(defaultPagination);
    setError(null);
  };

  return {
    users,
    pagination,
    isLoading,
    error,
    search,
    clearSearch,
  };
};
