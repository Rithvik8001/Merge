import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export interface ConnectionRequest {
  requestId: string;
  fromUserId: {
    id: string;
    userName?: string;
    email: string;
    age?: number;
    gender?: string;
    about?: string;
    skills?: string[];
    photoUrl?: string;
    createdAt: string;
  };
  toUserId: string;
  status: "interested" | "rejected" | "accepted";
  createdAt: string;
}

export interface AcceptedConnection {
  connectionId: string;
  connectedUser: {
    id: string;
    userName?: string;
    email: string;
    age?: number;
    gender?: string;
    about?: string;
    skills?: string[];
    photoUrl?: string;
    createdAt: string;
  };
  status: "accepted";
  connectedAt: string;
}

interface SendConnectionResponse {
  message: string;
  data: {
    connectionId: string;
    fromUserId: string;
    toUserId: string;
    status: "interested" | "ignored";
    createdAt: string;
  };
}

interface RequestResponse {
  success: boolean;
  message: string;
  data: ConnectionRequest[];
  count: number;
}

interface ConnectionsResponse {
  success: boolean;
  message: string;
  data: AcceptedConnection[];
  count: number;
}

interface RespondToRequestResponse {
  message: string;
  data: {
    connectionId: string;
    fromUserId: string;
    toUserId: string;
    status: "accepted" | "rejected";
    updatedAt: string;
  };
}

interface UseConnectionReturn {
  sendConnectionRequest: (
    userId: string,
    status: "interested" | "ignored",
  ) => Promise<void>;
  getReceivedRequests: () => Promise<ConnectionRequest[]>;
  getAcceptedConnections: () => Promise<AcceptedConnection[]>;
  respondToRequest: (
    requestId: string,
    status: "accepted" | "rejected",
  ) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useConnection = (): UseConnectionReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendConnectionRequest = async (
    userId: string,
    status: "interested" | "ignored",
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      await apiClient.post<SendConnectionResponse>(
        `/api/v1/connection/request/send/${status}/${userId}`,
      );

      toast.success(
        status === "interested" ? "Connection request sent!" : "User ignored",
      );
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to send connection request";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getReceivedRequests = async (): Promise<ConnectionRequest[]> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.get<RequestResponse>(
        "/api/v1/connection/user/requests/received",
      );

      return response.data.data;
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to load requests";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getAcceptedConnections = async (): Promise<AcceptedConnection[]> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.get<ConnectionsResponse>(
        "/api/v1/connection/user/connections",
      );

      return response.data.data;
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to load connections";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const respondToRequest = async (
    requestId: string,
    status: "accepted" | "rejected",
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      await apiClient.post<RespondToRequestResponse>(
        `/api/v1/connection/request/recieve/${status}/${requestId}`,
      );

      toast.success(
        status === "accepted" ? "Connection accepted!" : "Connection rejected",
      );
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to respond to request";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendConnectionRequest,
    getReceivedRequests,
    getAcceptedConnections,
    respondToRequest,
    isLoading,
    error,
  };
};
