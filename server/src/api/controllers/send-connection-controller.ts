import type { Request, Response } from "express";
import mongoose from "mongoose";
import Connection from "../../db/models/connection.ts";
import User from "../../db/models/user.ts";
import AppError from "../../utils/AppError.ts";
import handleZodError from "../../utils/zodErrorHandler.ts";
import { validateSendConnectionRequest } from "../validations/connection-validation.ts";

const sendConnectionController = async (req: Request, res: Response) => {
  try {
    const fromUserId = req.userId;
    const { userId: toUserId, status } = req.params;

    const result = await validateSendConnectionRequest({
      userId: toUserId,
      status,
    });

    if (!result.success) {
      handleZodError(result.error);
      return;
    }

    if (fromUserId === toUserId) {
      throw new AppError(
        "You cannot send a connection request to yourself",
        400,
        true,
      );
    }

    const [fromUser, toUser] = await Promise.all([
      User.findById(fromUserId),
      User.findById(toUserId),
    ]);

    if (!fromUser) {
      throw new AppError("User not found", 404, true);
    }

    if (!toUser) {
      throw new AppError("Target user not found", 404, true);
    }

    const existingConnection = await Connection.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existingConnection) {
      throw new AppError(
        "Connection request already exists between these users",
        409,
        true,
      );
    }

    const connection = new Connection({
      fromUserId: new mongoose.Types.ObjectId(fromUserId),
      toUserId: new mongoose.Types.ObjectId(toUserId),
      status: result.data.status,
      actionAt: new Date(),
    });

    await connection.save();

    res.status(201).json({
      message: `Connection request sent with status: ${result.data.status}`,
      data: {
        connectionId: connection._id,
        fromUserId: connection.fromUserId,
        toUserId: connection.toUserId,
        status: connection.status,
        createdAt: connection.createdAt,
      },
    });
  } catch (error) {
    throw error;
  }
};

export default sendConnectionController;
