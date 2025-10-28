import { z } from "zod";

// Send message validation
export const sendMessageValidation = async (data: any) => {
  const schema = z.object({
    conversationId: z.string().min(1, "Conversation ID is required"),
    content: z
      .string()
      .min(1, "Message cannot be empty")
      .max(1000, "Message cannot exceed 1000 characters"),
  });

  return schema.safeParseAsync(data);
};

// Get conversation messages validation
export const getConversationMessagesValidation = async (data: any) => {
  const schema = z.object({
    conversationId: z.string().min(1, "Conversation ID is required"),
    page: z.coerce.number().min(1, "Page must be at least 1").default(1),
    limit: z.coerce
      .number()
      .min(1, "Limit must be at least 1")
      .max(100, "Limit cannot exceed 100")
      .default(20),
  });

  return schema.safeParseAsync(data);
};

// Get conversations list validation
export const getConversationsValidation = async (data: any) => {
  const schema = z.object({
    page: z.coerce.number().min(1, "Page must be at least 1").default(1),
    limit: z.coerce
      .number()
      .min(1, "Limit must be at least 1")
      .max(50, "Limit cannot exceed 50")
      .default(20),
  });

  return schema.safeParseAsync(data);
};

// Mark messages as read validation
export const markMessagesAsReadValidation = async (data: any) => {
  const schema = z.object({
    conversationId: z.string().min(1, "Conversation ID is required"),
  });

  return schema.safeParseAsync(data);
};
