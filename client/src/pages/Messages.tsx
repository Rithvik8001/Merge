import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useChat } from "@/hooks/useChat";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatWindow } from "@/components/ChatWindow";

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
    sendMessage,
    clearSelection,
    emitTyping,
  } = useChat();

  const [showSidebar, setShowSidebar] = useState(!userNameParam);
  const selectedUserNameRef = useRef<string | null>(null);

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
    if (userNameParam && conversations.length > 0) {
      // Only select if this is a different user than currently selected
      if (selectedUserNameRef.current !== userNameParam.toLowerCase()) {
        const conversation = conversations.find(
          (conv) => conv.userName.toLowerCase() === userNameParam.toLowerCase()
        );
        if (conversation) {
          selectedUserNameRef.current = userNameParam.toLowerCase();
          selectConversation(conversation.id, {
            id: conversation.userId,
            userName: conversation.userName,
            email: conversation.email,
            photoUrl: conversation.photoUrl,
          });
          setShowSidebar(false);
        } else {
          // User not found in conversations, go back to sidebar
          navigate("/messages");
        }
      }
    }
  }, [userNameParam, conversations]);

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
