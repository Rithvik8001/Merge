import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, ArrowLeft } from "lucide-react";
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
      <div className="flex-1 flex items-center justify-center bg-muted/10">
        <div className="text-center text-muted-foreground">
          <p className="text-lg font-medium mb-2">Select a conversation</p>
          <p className="text-sm">Choose someone to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Avatar className="w-10 h-10">
            {selectedUser.photoUrl ? (
              <AvatarImage src={selectedUser.photoUrl} alt={selectedUser.userName} />
            ) : null}
            <AvatarFallback className="text-sm font-semibold">
              {selectedUser.userName?.[0]?.toUpperCase() ||
                selectedUser.email[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-foreground">
              {selectedUser.userName || selectedUser.email.split("@")[0]}
            </p>
            <p className="text-xs text-muted-foreground">{selectedUser.email}</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4 pb-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <p className="text-sm">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground py-12">
              <p className="text-sm">No messages yet. Start the conversation!</p>
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

                <div
                  className={cn(
                    "max-w-xs px-4 py-2 rounded-lg",
                    message.isOwn
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  )}
                >
                  <p className="text-sm break-words">{message.content}</p>
                  <p
                    className={cn(
                      "text-xs mt-1 opacity-70",
                      message.isOwn
                        ? "text-primary-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={scrollRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border">
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
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={isSending || !messageInput.trim()}
            size="sm"
            className="gap-2"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
