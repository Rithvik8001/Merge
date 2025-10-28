import Message from "../db/models/message.ts";
import Conversation from "../db/models/conversation.ts";

export const saveMessageToDb = async (
  conversationId: string,
  senderId: string,
  content: string
) => {
  try {
    // Create message in database
    const message = new Message({
      conversationId,
      senderId,
      content,
      isRead: false,
    });

    await message.save();

    // Update conversation with last message info
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: content,
      lastMessageAt: new Date(),
      lastMessageSenderId: senderId,
    });

    return message;
  } catch (error) {
    console.error("Error saving message to database:", error);
    throw error;
  }
};

export const getOrCreateConversation = async (
  userId1: string,
  userId2: string
) => {
  try {
    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      participants: {
        $all: [userId1, userId2],
      },
    });

    // If not, create new conversation
    if (!conversation) {
      conversation = new Conversation({
        participants: [userId1, userId2],
      });

      await conversation.save();
    }

    return conversation;
  } catch (error) {
    console.error("Error getting or creating conversation:", error);
    throw error;
  }
};
