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
  onSendMessage: (content: string) => void;
  onBack: () => void;
}

export const ChatWindow = ({
  selectedUser,
  messages,
  isLoading = false,
  onSendMessage,
  onBack,
}: ChatWindowProps) => {
  const [messageInput, setMessageInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  const handleSend = () => {
    if (!messageInput.trim()) return;

    setIsSending(true);
    onSendMessage(messageInput);
    setMessageInput("");
    setIsSending(false);
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
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4">
        <div className="space-y-3 sm:space-y-4 pb-4">
          {isLoading ? (
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
          <div ref={scrollRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-3 sm:p-4 border-t border-border bg-background/80 backdrop-blur-sm">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
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
