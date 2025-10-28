import type { Request, Response } from "express";
import Connection from "../../db/models/connection";
import AppError from "../../utils/AppError";
import { validateAcceptedConnections } from "../validations/connection-validation";
import handleZodError from "../../utils/zodErrorHandler";

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
        "userName email age gender about skills photoUrl createdAt",
      )
      .populate("toUserId", "userName email age gender about skills photoUrl createdAt")
      .sort({ actionAt: -1 });

    const formattedConnections = acceptedConnections.map((connection) => {
      const connectedUser =
        (connection.fromUserId as any)._id.toString() === userId
          ? (connection.toUserId as any)
          : (connection.fromUserId as any);

      return {
        connectionId: connection._id,
        connectedUser: {
          id: connectedUser._id.toString(),
          userName: connectedUser.userName,
          email: connectedUser.email,
          age: connectedUser.age,
          gender: connectedUser.gender,
          about: connectedUser.about,
          skills: connectedUser.skills,
          photoUrl: connectedUser.photoUrl,
          createdAt: connectedUser.createdAt,
        },
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
