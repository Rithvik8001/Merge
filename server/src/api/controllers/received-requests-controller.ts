import type { Request, Response } from "express";
import Connection from "../../db/models/connection";
import AppError from "../../utils/AppError";
import { validateReceivedRequests } from "../validations/connection-validation";
import handleZodError from "../../utils/zodErrorHandler";

const receivedRequestsController = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const result = await validateReceivedRequests({});

    if (!result.success) {
      handleZodError(result.error);
      return;
    }

    if (!userId) {
      throw new AppError("User ID not found in request", 401, true);
    }

    const receivedRequests = await Connection.find({
      toUserId: userId,
      status: "interested",
    })
      .populate(
        "fromUserId",
        "userName email age gender about skills photoUrl createdAt",
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Received connection requests retrieved successfully",
      data: receivedRequests.map((request) => ({
        requestId: request._id,
        fromUserId: request.fromUserId,
        toUserId: request.toUserId,
        status: request.status,
        createdAt: request.createdAt,
      })),
      count: receivedRequests.length,
    });
  } catch (error) {
    throw error;
  }
};

export default receivedRequestsController;
