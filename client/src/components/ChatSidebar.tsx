import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConversationPreview {
  id: string;
  userId: string;
  userName: string;
  email: string;
  photoUrl?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

interface ChatSidebarProps {
  conversations: ConversationPreview[];
  selectedConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
  isLoading?: boolean;
}

export const ChatSidebar = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
  isLoading = false,
}: ChatSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-80 bg-card border-r border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground mb-4">Messages</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-9"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <p className="text-sm">Loading conversations...</p>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <MessageSquare className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm text-center">
                {searchQuery
                  ? "No conversations found"
                  : "No conversations yet"}
              </p>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg mb-2 transition-all duration-200 group",
                  selectedConversationId === conversation.id
                    ? "bg-primary/10"
                    : "hover:bg-muted/50"
                )}
              >
                {/* Avatar */}
                <Avatar className="w-12 h-12 flex-shrink-0">
                  {conversation.photoUrl ? (
                    <AvatarImage src={conversation.photoUrl} alt={conversation.userName} />
                  ) : null}
                  <AvatarFallback className="text-sm font-semibold">
                    {conversation.userName?.[0]?.toUpperCase() ||
                      conversation.email[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {/* Message Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-semibold text-foreground truncate text-sm">
                      {conversation.userName || conversation.email.split("@")[0]}
                    </span>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {conversation.lastMessageTime}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {conversation.lastMessage}
                  </p>
                </div>

                {/* Unread Badge */}
                {conversation.unreadCount > 0 && (
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-xs text-primary-foreground font-semibold flex-shrink-0">
                    {conversation.unreadCount > 9 ? "9+" : conversation.unreadCount}
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
