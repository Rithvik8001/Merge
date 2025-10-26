import type { Request, Response } from "express";
import Connection from "../../db/models/connection.ts";
import AppError from "../../utils/AppError.ts";
import { validateAcceptedConnections } from "../validations/connection-validation.ts";
import handleZodError from "../../utils/zodErrorHandler.ts";

const acceptedConnectionsController = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const result = await validateAcceptedConnections({});

    if (!result.success) {
      handleZodError(result.error);
      return;
    }

    if (!userId) {
      throw new AppError("User ID not found in request", 401, true);
    }

    const acceptedConnections = await Connection.find({
      $or: [
        { fromUserId: userId, status: "accepted" },
        { toUserId: userId, status: "accepted" },
      ],
    })
      .populate(
        "fromUserId",
        "userName email age gender about skills createdAt",
      )
      .populate("toUserId", "userName email age gender about skills createdAt")
      .sort({ actionAt: -1 });

    const formattedConnections = acceptedConnections.map((connection) => {
      const connectedUser =
        connection.fromUserId._id.toString() === userId
          ? connection.toUserId
          : connection.fromUserId;

      return {
        connectionId: connection._id,
        connectedUser: connectedUser,
        status: connection.status,
        connectedAt: connection.actionAt,
      };
    });

    res.status(200).json({
      success: true,
      message: "Accepted connections retrieved successfully",
      data: formattedConnections,
      count: formattedConnections.length,
    });
  } catch (error) {
    throw error;
  }
};

export default acceptedConnectionsController;
