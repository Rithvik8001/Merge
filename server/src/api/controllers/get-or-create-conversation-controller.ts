import type { Request, Response } from "express";
import AppError from "../../utils/AppError";
import { getOrCreateConversation } from "../../socket/message-service";

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

    res.status(200).json({
      success: true,
      message: "Conversation retrieved or created successfully",
      data: {
        id: conversation._id.toString(),
      },
    });
  } catch (error) {
    throw error;
  }
};

export default getOrCreateConversationController;
