import type { Request, Response } from "express";
import User from "../../db/models/user.js";
import Connection from "../../db/models/connection.js";
import AppError from "../../utils/AppError.js";
import { validateSearchUsers } from "../validations/connection-validation.js";
import handleZodError from "../../utils/zodErrorHandler.js";

const searchUsersController = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { search, skills, gender, sortBy, page: pageParam = "1", limit: limitParam = "20" } = req.query;

    const result = await validateSearchUsers({
      search,
      skills,
      gender,
      sortBy,
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

    const { search: searchTerm, skills: skillsFilter, gender: genderFilter, sortBy: sort, page, limit } = result.data;
    const skip = (page - 1) * limit;

    // Get all connections involving this user (any status)
    const userConnections = await Connection.find({
      $or: [{ fromUserId: userId }, { toUserId: userId }],
    }).select("fromUserId toUserId");

    // Extract user IDs to exclude
    const excludedUserIds = new Set([userId]);
    userConnections.forEach((conn) => {
      excludedUserIds.add(conn.fromUserId.toString());
      excludedUserIds.add(conn.toUserId.toString());
    });

    // Build search filter
    const searchFilter: any = {
      _id: { $nin: Array.from(excludedUserIds) },
    };

    // Search by username or skills
    if (searchTerm && searchTerm.trim()) {
      searchFilter.$or = [
        { userName: { $regex: searchTerm, $options: "i" } },
        { skills: { $in: [new RegExp(searchTerm, "i")] } },
      ];
    }

    // Filter by gender
    if (genderFilter && genderFilter.trim()) {
      searchFilter.gender = genderFilter;
    }

    // Filter by skills (comma-separated)
    if (skillsFilter && skillsFilter.trim()) {
      const skillsArray = skillsFilter
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter((s) => s.length > 0);

      if (skillsArray.length > 0) {
        searchFilter.skills = {
          $in: skillsArray.map((s) => new RegExp(`^${s}$`, "i")),
        };
      }
    }

    // Get total count
    const totalCount = await User.countDocuments(searchFilter);

    // Determine sort order - type-safe for mongoose
    let sortOrder: any = { createdAt: -1 };
    if (sort === "alphabetical") {
      sortOrder = { userName: 1 };
    }

    // Get paginated users
    const searchResults = await User.find(searchFilter)
      .select("-password -__v")
      .sort(sortOrder)
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      success: true,
      message: "Search results retrieved successfully",
      data: searchResults.map((user) => ({
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

export default searchUsersController;
