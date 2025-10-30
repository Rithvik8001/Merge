import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { useChat } from "@/hooks/useChat";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatWindow } from "@/components/ChatWindow";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface UserSearchResult {
  id: string;
  userName: string;
  email: string;
  photoUrl?: string;
}

export const Messages = () => {
  const navigate = useNavigate();
  const { userName: userNameParam } = useParams<{ userName?: string }>();
  const { isAuthenticated } = useAuthStore();
  const {
    conversations,
    messages,
    selectedConversationId,
    selectedUser,
    isLoadingConversations,
    isLoadingMessages,
    isUserOnline,
    isUserTyping,
    hasMoreMessages,
    fetchConversations,
    fetchMessages,
    selectConversation,
    getOrCreateConversation,
    sendMessage,
    clearSelection,
    emitTyping,
  } = useChat();

  const [showSidebar, setShowSidebar] = useState(!userNameParam);
  const selectedUserNameRef = useRef<string | null>(null);
  const searchInitiatedRef = useRef<Set<string>>(new Set());

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations();
  }, []);

  // Handle route parameter change - select conversation if userName provided
  useEffect(() => {
    if (userNameParam) {
      // Only process if this is a different user than currently selected
      if (selectedUserNameRef.current !== userNameParam.toLowerCase()) {
        selectedUserNameRef.current = userNameParam.toLowerCase();

        // First, try to find in existing conversations
        const conversation = conversations.find(
          (conv) => conv.userName.toLowerCase() === userNameParam.toLowerCase()
        );

        if (conversation) {
          // Found in existing conversations
          selectConversation(conversation.id, {
            id: conversation.userId,
            userName: conversation.userName,
            email: conversation.email,
            photoUrl: conversation.photoUrl,
          });
          setShowSidebar(false);
        } else {
          // User not found in conversations
          // Try to fetch/create conversation by searching for user
          const lowerUserName = userNameParam.toLowerCase();

          if (!searchInitiatedRef.current.has(lowerUserName)) {
            searchInitiatedRef.current.add(lowerUserName);

            // Search for user by userName to get their ID
            axios
              .get(
                `${API_URL}/api/v1/connection/user/search?searchTerm=${encodeURIComponent(
                  userNameParam
                )}`,
                { withCredentials: true }
              )
              .then((response) => {
                if (
                  Array.isArray(response.data?.data) &&
                  response.data.data.length > 0
                ) {
                  const user = response.data.data.find(
                    (u: UserSearchResult) =>
                      u.userName.toLowerCase() === lowerUserName
                  );

                  if (user) {
                    // Now create or get conversation with this user
                    getOrCreateConversation(user.id).then((conv) => {
                      if (conv) {
                        selectConversation(conv.id, {
                          id: user.id,
                          userName: user.userName,
                          email: user.email,
                          photoUrl: user.photoUrl,
                        });
                        setShowSidebar(false);
                      } else {
                        // Failed to create conversation
                        navigate("/messages");
                      }
                    });
                  } else {
                    // User not found in search results
                    navigate("/messages");
                  }
                } else {
                  // No users found
                  navigate("/messages");
                }
              })
              .catch(() => {
                // Error searching for user
                navigate("/messages");
              });
          }
        }
      }
    }
  }, [userNameParam, conversations, selectConversation, getOrCreateConversation, navigate]);

  const handleSelectConversation = (conversationId: string) => {
    const conversation = conversations.find((c) => c.id === conversationId);
    if (conversation) {
      selectConversation(conversationId, {
        id: conversation.userId,
        userName: conversation.userName,
        email: conversation.email,
        photoUrl: conversation.photoUrl,
      });
      // Navigate to the dynamic route
      navigate(`/messages/${conversation.userName}`);
      setShowSidebar(false);
      setCurrentPage(1); // Reset pagination
    }
  };

  const handleSendMessage = (content: string) => {
    if (selectedUser) {
      sendMessage(content, selectedUser.id);
    }
  };

  const handleBackFromChat = () => {
    clearSelection();
    navigate("/messages");
    setShowSidebar(true);
  };

  const [currentPage, setCurrentPage] = useState(1);

  const handleLoadMoreMessages = () => {
    if (selectedConversationId) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchMessages(selectedConversationId, nextPage);
    }
  };

  const handleTyping = () => {
    if (selectedUser) {
      emitTyping(selectedUser.id);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="flex-1 flex bg-background h-full">
        {/* Desktop - Show sidebar on left */}
        <div className="hidden md:flex flex-1 h-full">
          <ChatSidebar
            conversations={conversations}
            selectedConversationId={selectedConversationId}
            onSelectConversation={handleSelectConversation}
            isLoading={isLoadingConversations}
          />
          <ChatWindow
            selectedUser={selectedUser}
            messages={messages}
            isLoading={isLoadingMessages}
            isUserOnline={isUserOnline}
            isUserTyping={isUserTyping}
            hasMoreMessages={hasMoreMessages}
            onSendMessage={handleSendMessage}
            onBack={handleBackFromChat}
            onLoadMoreMessages={handleLoadMoreMessages}
            onTyping={handleTyping}
          />
        </div>

        {/* Mobile - Show either sidebar or chat */}
        <div className="flex-1 md:hidden h-full">
          {showSidebar ? (
            <ChatSidebar
              conversations={conversations}
              selectedConversationId={selectedConversationId}
              onSelectConversation={handleSelectConversation}
              isLoading={isLoadingConversations}
            />
          ) : (
            <ChatWindow
              selectedUser={selectedUser}
              messages={messages}
              isLoading={isLoadingMessages}
              isUserOnline={isUserOnline}
              isUserTyping={isUserTyping}
              hasMoreMessages={hasMoreMessages}
              onSendMessage={handleSendMessage}
              onBack={handleBackFromChat}
              onLoadMoreMessages={handleLoadMoreMessages}
              onTyping={handleTyping}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
