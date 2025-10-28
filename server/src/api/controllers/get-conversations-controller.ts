import type { Request, Response } from "express";
import Conversation from "../../db/models/conversation.ts";
import Message from "../../db/models/message.ts";
import AppError from "../../utils/AppError.ts";
import { getConversationsValidation } from "../validations/chat-validation.ts";
import handleZodError from "../../utils/zodErrorHandler.ts";

const getConversationsController = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { page: pageParam = "1", limit: limitParam = "20" } = req.query;

    const result = await getConversationsValidation({
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

    const { page, limit } = result.data;
    const skip = (page - 1) * limit;

    // Get conversations for this user
    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("participants", "userName email photoUrl")
      .populate("lastMessageSenderId", "userName")
      .sort({ lastMessageAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get unread message count for each conversation
    const conversationsWithUnread = await Promise.all(
      conversations.map(async (conversation) => {
        const unreadCount = await Message.countDocuments({
          conversationId: conversation._id,
          senderId: { $ne: userId },
          isRead: false,
        });

        // Get other participant (not the current user)
        const otherParticipant = (conversation.participants as any[]).find(
          (p) => p._id.toString() !== userId,
        );

        return {
          id: conversation._id,
          userId: otherParticipant?._id,
          userName: otherParticipant?.userName || "Developer",
          email: otherParticipant?.email,
          photoUrl: otherParticipant?.photoUrl,
          lastMessage: conversation.lastMessage || "No messages yet",
          lastMessageTime: conversation.lastMessageAt
            ? new Date(conversation.lastMessageAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Never",
          unreadCount,
        };
      }),
    );

    const totalCount = await Conversation.countDocuments({
      participants: userId,
    });

    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      success: true,
      message: "Conversations retrieved successfully",
      data: conversationsWithUnread,
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

export default getConversationsController;
