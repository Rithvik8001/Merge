import { useEffect, useState, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";
import axios from "axios";
import { toast } from "sonner";

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderPhoto?: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
  isRead: boolean;
}

interface Conversation {
  id: string;
  userId: string;
  userName: string;
  email: string;
  photoUrl?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

interface ChatUser {
  id: string;
  userName: string;
  email: string;
  photoUrl?: string;
}

interface UseChatReturn {
  conversations: Conversation[];
  messages: Message[];
  isLoadingConversations: boolean;
  isLoadingMessages: boolean;
  selectedConversationId: string | null;
  selectedUser: ChatUser | null;
  isConnected: boolean;
  isUserOnline: boolean;
  isUserTyping: boolean;
  hasMoreMessages: boolean;
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string, page?: number) => Promise<void>;
  selectConversation: (conversationId: string, user: ChatUser) => void;
  sendMessage: (content: string, recipientId: string) => void;
  markMessagesAsRead: (conversationId: string) => Promise<void>;
  emitTyping: (recipientId: string) => void;
  clearSelection: () => void;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

export const useChat = (): UseChatReturn => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isUserOnline, setIsUserOnline] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Socket.io connection
  useEffect(() => {
    // Socket.io will automatically send httpOnly cookies with the connection
    // withCredentials must be true to send cookies with WebSocket
    socketRef.current = io(SOCKET_URL, {
      withCredentials: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    // Connection events
    socketRef.current.on("connect", () => {
      setIsConnected(true);
    });

    socketRef.current.on("disconnect", () => {
      setIsConnected(false);
    });

    socketRef.current.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    // Message events
    socketRef.current.on("receive_message", (messageData) => {
      setMessages((prev) => [...prev, messageData]);

      // Update conversation's last message
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === messageData.conversationId
            ? {
                ...conv,
                lastMessage: messageData.content,
                lastMessageTime: messageData.timestamp,
                unreadCount: conv.unreadCount + 1,
              }
            : conv,
        ),
      );
    });

    socketRef.current.on("message_sent", (data) => {
      setMessages((prev) => [...prev, { ...data, isRead: false }]);
    });

    socketRef.current.on("error", (error) => {
      console.error("Socket error:", error);
      toast.error(error);
    });

    // Online status events
    socketRef.current.on("user_online", (data) => {
      setIsUserOnline(true);
    });

    socketRef.current.on("user_offline", (data) => {
      setIsUserOnline(false);
    });

    // Typing indicators
    socketRef.current.on("user_typing", (data) => {
      setIsUserTyping(true);
    });

    socketRef.current.on("user_stop_typing", (data) => {
      setIsUserTyping(false);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Fetch conversations from API
  const fetchConversations = useCallback(async () => {
    try {
      setIsLoadingConversations(true);
      const response = await axios.get(`${API_URL}/api/v1/chat/conversations`, {
        withCredentials: true,
      });

      if (response.data?.data) {
        setConversations(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
      toast.error("Failed to fetch conversations");
    } finally {
      setIsLoadingConversations(false);
    }
  }, []);

  // Fetch messages for a conversation
  const fetchMessages = useCallback(
    async (conversationId: string, page: number = 1) => {
      try {
        setIsLoadingMessages(true);
        const response = await axios.get(
          `${API_URL}/api/v1/chat/messages/${conversationId}?page=${page}`,
          {
            withCredentials: true,
          },
        );

        if (response.data?.data) {
          if (page === 1) {
            // First page - replace all messages
            setMessages(response.data.data);
          } else {
            // Subsequent pages - prepend to existing messages
            setMessages((prev) => [...response.data.data, ...prev]);
          }

          // Check if there are more messages
          setHasMoreMessages(response.data.data.length > 0);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast.error("Failed to fetch messages");
      } finally {
        setIsLoadingMessages(false);
      }
    },
    [],
  );

  // Select a conversation
  const selectConversation = useCallback(
    (conversationId: string, user: ChatUser) => {
      setSelectedConversationId(conversationId);
      setSelectedUser(user);
      fetchMessages(conversationId);

      // Mark messages as read
      markMessagesAsRead(conversationId);
    },
    [fetchMessages],
  );

  // Send message via Socket.io
  const sendMessage = useCallback(
    (content: string, recipientId: string) => {
      if (!socketRef.current) {
        toast.error("Chat not initialized. Please refresh the page.");
        return;
      }

      if (!socketRef.current.connected) {
        toast.error("Not connected to chat server");
        return;
      }

      socketRef.current.emit("send_message", {
        conversationId: selectedConversationId,
        content,
        recipientId,
      });
    },
    [selectedConversationId],
  );

  // Mark messages as read
  const markMessagesAsRead = useCallback(async (conversationId: string) => {
    try {
      await axios.post(
        `${API_URL}/api/v1/chat/messages/read/${conversationId}`,
        {},
        {
          withCredentials: true,
        },
      );

      // Update local messages state
      setMessages((prev) =>
        prev.map((msg) => ({
          ...msg,
          isRead: true,
        })),
      );

      // Update conversations unread count
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv,
        ),
      );
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  }, []);

  // Clear selection (for mobile back button)
  const clearSelection = useCallback(() => {
    setSelectedConversationId(null);
    setSelectedUser(null);
    setMessages([]);
    setIsUserTyping(false);
    setIsUserOnline(false);
  }, []);

  // Emit typing event with debounce
  const emitTyping = useCallback(
    (recipientId: string) => {
      if (!socketRef.current || !socketRef.current.connected) return;

      socketRef.current.emit("typing", { recipientId });

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set new timeout to emit stop_typing after 1 second of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        if (socketRef.current && socketRef.current.connected) {
          socketRef.current.emit("stop_typing", { recipientId });
        }
      }, 1000);
    },
    [],
  );

  return {
    conversations,
    messages,
    isLoadingConversations,
    isLoadingMessages,
    selectedConversationId,
    selectedUser,
    isConnected,
    isUserOnline,
    isUserTyping,
    hasMoreMessages,
    fetchConversations,
    fetchMessages,
    selectConversation,
    sendMessage,
    markMessagesAsRead,
    emitTyping,
    clearSelection,
  };
};

export type { Message, Conversation, ChatUser };
