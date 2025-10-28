import type { Request, Response } from "express";
import User from "../../db/models/user.js";
import Connection from "../../db/models/connection.js";
import AppError from "../../utils/AppError.js";
import { validateUserFeed } from "../validations/connection-validation.js";
import handleZodError from "../../utils/zodErrorHandler.js";

const userFeedController = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { page: pageParam = "1", limit: limitParam = "20" } = req.query;

    const result = await validateUserFeed({
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

    // Get all connections involving this user (any status)
    const userConnections = await Connection.find({
      $or: [{ fromUserId: userId }, { toUserId: userId }],
    }).select("fromUserId toUserId");

    // Extract user IDs to exclude (people already connected, sent request to, or received request from)
    const excludedUserIds = new Set([userId]);
    userConnections.forEach((conn) => {
      excludedUserIds.add(conn.fromUserId.toString());
      excludedUserIds.add(conn.toUserId.toString());
    });

    // Get total count of available users
    const totalCount = await User.countDocuments({
      _id: { $nin: Array.from(excludedUserIds) },
    });

    // Get paginated users except excluded ones
    const feedUsers = await User.find({
      _id: { $nin: Array.from(excludedUserIds) },
    })
      .select("-password -__v")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      success: true,
      message: "User feed retrieved successfully",
      data: feedUsers.map((user) => ({
        id: user._id,
        email: user.email,
        userName: user.userName || undefined,
        age: user.age || undefined,
        gender: user.gender || undefined,
        about: user.about,
        skills: user.skills || [],
        photoUrl: user.photoUrl || undefined,
        createdAt: user.createdAt,
      })),
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

export default userFeedController;
