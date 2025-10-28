import type { Request, Response } from "express";
import Message from "../../db/models/message.ts";
import Conversation from "../../db/models/conversation.ts";
import AppError from "../../utils/AppError.ts";
import { markMessagesAsReadValidation } from "../validations/chat-validation.ts";
import handleZodError from "../../utils/zodErrorHandler.ts";

const markMessagesAsReadController = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { conversationId } = req.params;

    const result = await markMessagesAsReadValidation({
      conversationId,
    });

    if (!result.success) {
      handleZodError(result.error);
      return;
    }

    if (!userId) {
      throw new AppError("User ID not found in request", 401, true);
    }

    const { conversationId: convId } = result.data;

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

    // Mark all unread messages from other participants as read
    await Message.updateMany(
      {
        conversationId: convId,
        senderId: { $ne: userId },
        isRead: false,
      },
      { isRead: true },
    );

    res.status(200).json({
      success: true,
      message: "Messages marked as read",
    });
  } catch (error) {
    throw error;
  }
};

export default markMessagesAsReadController;
