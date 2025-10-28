import type { Request, Response } from "express";
import Connection from "../../db/models/connection";
import AppError from "../../utils/AppError";
import handleZodError from "../../utils/zodErrorHandler";
import { validateReceiveConnectionRequest } from "../validations/connection-validation";

const receiveConnectionController = async (req: Request, res: Response) => {
  try {
    const userId = req.userId; // The user responding to the request
    const { requestId, status } = req.params;

    const result = await validateReceiveConnectionRequest({
      requestId,
      status,
    });

    if (!result.success) {
      handleZodError(result.error);
      return;
    }

    const connection = await Connection.findById(requestId).populate([
      "fromUserId",
      "toUserId",
    ]);

    if (!connection) {
      throw new AppError("Connection request not found", 404, true);
    }

    if (connection.toUserId._id.toString() !== userId) {
      throw new AppError(
        "You are not authorized to respond to this connection request",
        403,
        true,
      );
    }

    if (connection.status !== "interested") {
      throw new AppError(
        `Cannot respond to a request that is already ${connection.status}`,
        400,
        true,
      );
    }

    connection.status = result.data.status;
    connection.actionAt = new Date();

    await connection.save();

    res.status(200).json({
      message: `Connection request ${result.data.status}`,
      data: {
        connectionId: connection._id,
        fromUserId: connection.fromUserId._id,
        toUserId: connection.toUserId._id,
        status: connection.status,
        updatedAt: connection.updatedAt,
      },
    });
  } catch (error) {
    throw error;
  }
};

export default receiveConnectionController;
