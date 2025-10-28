import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, ArrowLeft, Check, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderPhoto?: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
  isRead?: boolean;
}

interface ChatUser {
  id: string;
  userName: string;
  email: string;
  photoUrl?: string;
}

interface ChatWindowProps {
  selectedUser: ChatUser | null;
  messages: Message[];
  isLoading?: boolean;
  isUserOnline?: boolean;
  isUserTyping?: boolean;
  hasMoreMessages?: boolean;
  onSendMessage: (content: string) => void;
  onBack: () => void;
  onLoadMoreMessages?: () => void;
  onTyping?: () => void;
}

export const ChatWindow = ({
  selectedUser,
  messages,
  isLoading = false,
  isUserOnline = false,
  isUserTyping = false,
  hasMoreMessages = false,
  onSendMessage,
  onBack,
  onLoadMoreMessages,
  onTyping,
}: ChatWindowProps) => {
  const [messageInput, setMessageInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  // Handle scroll for pagination
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const isAtTop = element.scrollTop < 100;

    if (isAtTop && hasMoreMessages && !isLoading && onLoadMoreMessages) {
      onLoadMoreMessages();
    }
  };

  const handleSend = () => {
    if (!messageInput.trim()) return;

    setIsSending(true);
    onSendMessage(messageInput);
    setMessageInput("");
    setIsSending(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
    onTyping?.();
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-background to-muted/5">
        <div className="text-center text-muted-foreground max-w-sm px-4">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-muted-foreground/50" />
          </div>
          <p className="text-lg font-semibold text-foreground mb-2">No conversation selected</p>
          <p className="text-sm">Choose a conversation from the left sidebar or start a new one</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Header */}
      <div className="p-3 sm:p-4 border-b border-border flex items-center gap-3 justify-between bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <button
            onClick={onBack}
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Avatar className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
            {selectedUser.photoUrl ? (
              <AvatarImage src={selectedUser.photoUrl} alt={selectedUser.userName} />
            ) : null}
            <AvatarFallback className="text-xs sm:text-sm font-semibold">
              {selectedUser.userName?.[0]?.toUpperCase() ||
                selectedUser.email[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground text-sm sm:text-base truncate">
              {selectedUser.userName || "Developer"}
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className={cn(
                "w-1.5 h-1.5 rounded-full",
                isUserOnline ? "bg-green-500" : "bg-muted-foreground/40"
              )} />
              {isUserOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4" ref={messagesContainerRef} onScroll={handleScroll}>
        <div className="space-y-3 sm:space-y-4 pb-4">
          {/* Load more indicator */}
          {hasMoreMessages && (
            <div className="flex justify-center py-2">
              <button
                onClick={onLoadMoreMessages}
                disabled={isLoading}
                className="text-xs text-primary hover:text-primary/80 disabled:opacity-50"
              >
                {isLoading ? "Loading earlier messages..." : "Load earlier messages"}
              </button>
            </div>
          )}

          {isLoading && messages.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-full border-2 border-muted-foreground border-t-primary animate-spin" />
                <p className="text-sm">Loading messages...</p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground py-12">
              <div className="text-center max-w-sm px-4">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                  <Send className="w-6 h-6 text-muted-foreground/50" />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">No messages yet</p>
                <p className="text-xs">Start the conversation by sending your first message!</p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.isOwn ? "justify-end" : "justify-start"
                )}
              >
                {!message.isOwn && (
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    {message.senderPhoto ? (
                      <AvatarImage src={message.senderPhoto} alt={message.senderName} />
                    ) : null}
                    <AvatarFallback className="text-xs">
                      {message.senderName?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                )}

                <div className="flex flex-col gap-1">
                  <div
                    className={cn(
                      "max-w-xs px-4 py-2 rounded-lg",
                      message.isOwn
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    )}
                  >
                    <p className="text-sm break-words">{message.content}</p>
                  </div>
                  <div
                    className={cn(
                      "flex items-center gap-1 text-xs",
                      message.isOwn ? "justify-end" : "justify-start",
                      message.isOwn
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    )}
                  >
                    <span>{message.timestamp}</span>
                    {message.isOwn && (
                      <div className="ml-1">
                        {message.isRead ? (
                          <CheckCheck className="w-3 h-3 text-blue-500" />
                        ) : (
                          <Check className="w-3 h-3" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Typing indicator */}
          {isUserTyping && (
            <div className="flex gap-3">
              <Avatar className="w-8 h-8 flex-shrink-0">
                {selectedUser.photoUrl ? (
                  <AvatarImage src={selectedUser.photoUrl} alt={selectedUser.userName} />
                ) : null}
                <AvatarFallback className="text-xs">
                  {selectedUser.userName?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-end gap-1 px-4 py-2 rounded-lg bg-muted text-muted-foreground">
                <span className="text-xs">typing</span>
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0s" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0.2s" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0.4s" }} />
                </span>
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-3 sm:p-4 border-t border-border bg-background/80 backdrop-blur-sm">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={messageInput}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={isSending}
            className="flex-1 text-sm sm:text-base"
          />
          <Button
            onClick={handleSend}
            disabled={isSending || !messageInput.trim()}
            size="sm"
            className="gap-2 px-3 sm:px-4"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
