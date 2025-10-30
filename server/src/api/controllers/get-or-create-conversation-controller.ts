import type { Request, Response } from "express";
import AppError from "../../utils/AppError.js";
import Message from "../../db/models/message.js";
import User from "../../db/models/user.js";
import { getOrCreateConversation } from "../../socket/message-service.js";

const getOrCreateConversationController = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.userId;
    const { recipientId } = req.params;

    if (!userId) {
      throw new AppError("User ID not found in request", 401, true);
    }

    if (!recipientId) {
      throw new AppError("Recipient ID is required", 400, true);
    }

    // Get or create conversation
    const conversation = await getOrCreateConversation(userId, recipientId);

    // Get unread message count
    const unreadCount = await Message.countDocuments({
      conversationId: conversation._id,
      senderId: { $ne: userId },
      isRead: false,
    });

    // Get recipient user details
    const recipientUser = await User.findById(recipientId).select(
      "userName email photoUrl"
    );

    // Get last message time
    const lastMessage = await Message.findOne({
      conversationId: conversation._id,
    })
      .sort({ createdAt: -1 })
      .select("content createdAt");

    res.status(200).json({
      success: true,
      message: "Conversation retrieved or created successfully",
      data: {
        id: conversation._id.toString(),
        userId: recipientId,
        userName: recipientUser?.userName || "Developer",
        email: recipientUser?.email,
        photoUrl: recipientUser?.photoUrl,
        lastMessage: lastMessage?.content || "No messages yet",
        lastMessageTime: lastMessage?.createdAt
          ? new Date(lastMessage.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "Never",
        unreadCount: unreadCount,
      },
    });
  } catch (error) {
    throw error;
  }
};

export default getOrCreateConversationController;
