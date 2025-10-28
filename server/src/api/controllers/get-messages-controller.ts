import type { Request, Response } from "express";
import Message from "../../db/models/message";
import Conversation from "../../db/models/conversation";
import AppError from "../../utils/AppError";
import { getConversationMessagesValidation } from "../validations/chat-validation";
import handleZodError from "../../utils/zodErrorHandler";

const getMessagesController = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { conversationId } = req.params;
    const {
      page: pageParam = "1",
      limit: limitParam = "20",
    } = req.query;

    const result = await getConversationMessagesValidation({
      conversationId,
      page: pageParam,
      limit: limitParam,
    });

    if (!result.success) {
      handleZodError(result.error);
      return;
    }

    if (!userId) {
      throw new AppError("User ID not found in request", 401, true);
    }

    const { conversationId: convId, page, limit } = result.data;

    // Check if conversation exists and user is a participant
    const conversation = await Conversation.findById(convId);

    if (!conversation) {
      throw new AppError(
        "Conversation not found",
        404,
        true,
        "CONVERSATION_NOT_FOUND",
      );
    }

    const isParticipant = (conversation.participants as any[]).some(
      (p) => p.toString() === userId,
    );

    if (!isParticipant) {
      throw new AppError(
        "You are not a participant in this conversation",
        403,
        true,
        "NOT_AUTHORIZED",
      );
    }

    const skip = (page - 1) * limit;

    // Get messages with sender info
    const messages = await Message.find({
      conversationId: convId,
    })
      .populate("senderId", "userName email photoUrl")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await Message.countDocuments({
      conversationId: convId,
    });

    const totalPages = Math.ceil(totalCount / limit);

    // Format messages
    const formattedMessages = messages.reverse().map((message) => {
      const sender = message.senderId as any;
      return {
        id: message._id,
        conversationId: message.conversationId,
        senderId: sender._id,
        senderName: sender.userName || "Developer",
        senderPhoto: sender.photoUrl,
        content: message.content,
        timestamp: new Date(message.createdAt!).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isRead: message.isRead,
        isOwn: sender._id.toString() === userId,
      };
    });

    res.status(200).json({
      success: true,
      message: "Messages retrieved successfully",
      data: formattedMessages,
      pagination: {
        currentPage: page,
        limit: limit,
        totalCount: totalCount,
        totalPages: totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    throw error;
  }
};

export default getMessagesController;
