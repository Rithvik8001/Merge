import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export interface FeedUser {
  id: string;
  email: string;
  userName?: string;
  age?: number;
  gender?: string;
  about?: string;
  skills?: string[];
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

interface FeedResponse {
  success: boolean;
  message: string;
  data: FeedUser[];
  pagination: PaginationData;
}

interface UseFeedReturn {
  users: FeedUser[];
  pagination: PaginationData;
  isLoading: boolean;
  error: string | null;
  fetchFeed: (page: number) => Promise<void>;
  removeUserFromFeed: (userId: string) => void;
}

const defaultPagination: PaginationData = {
  currentPage: 1,
  limit: 20,
  totalCount: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

export const useFeed = (): UseFeedReturn => {
  const [users, setUsers] = useState<FeedUser[]>([]);
  const [pagination, setPagination] =
    useState<PaginationData>(defaultPagination);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeed = async (page: number) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.get<FeedResponse>(
        `/api/v1/connection/user/feed?page=${page}&limit=20`,
      );

      if (response.data.success) {
        setUsers(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to load feed";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const removeUserFromFeed = (userId: string) => {
    setUsers(users.filter((u) => u.id !== userId));
  };

  return {
    users,
    pagination,
    isLoading,
    error,
    fetchFeed,
    removeUserFromFeed,
  };
};
