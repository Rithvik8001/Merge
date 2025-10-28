import type { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import User from "../../db/models/user.js";
import AppError from "../../utils/AppError.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const photoUploadController = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!req.file) {
      throw new AppError("No file provided", 400, true, "NO_FILE");
    }

    // Check file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (req.file.size > maxSize) {
      throw new AppError("File size exceeds 5MB limit", 400, true, "FILE_TOO_LARGE");
    }

    // Check file type
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedMimeTypes.includes(req.file.mimetype)) {
      throw new AppError("Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed", 400, true, "INVALID_FILE_TYPE");
    }

    // Upload to Cloudinary
    const uploadStream = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "merge/user-photos",
          quality: "auto",
          fetch_format: "auto",
          resource_type: "auto",
          width: 400,
          height: 400,
          crop: "fill",
          gravity: "face",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      stream.end(req.file!.buffer);
    });

    const photoUrl = (uploadStream as any).secure_url;

    // Update user profile with photo URL
    const user = await User.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404, true, "USER_NOT_FOUND");
    }

    // If user already has a photo, delete the old one from Cloudinary
    if (user.photoUrl) {
      const publicId = user.photoUrl.split("/").slice(-1)[0].split(".")[0];
      const fullPublicId = `merge/user-photos/${publicId}`;
      await cloudinary.uploader.destroy(fullPublicId).catch(() => {
        // Silently fail if old photo doesn't exist
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { photoUrl },
      { new: true, runValidators: true }
    ).select("-password -__v");

    return res.status(200).json({
      success: true,
      message: "Photo uploaded successfully",
      data: {
        id: updatedUser?._id,
        email: updatedUser?.email,
        userName: updatedUser?.userName || undefined,
        age: updatedUser?.age || undefined,
        gender: updatedUser?.gender || undefined,
        about: updatedUser?.about,
        skills: updatedUser?.skills || [],
        photoUrl: updatedUser?.photoUrl,
        updatedAt: updatedUser?.updatedAt,
      },
    });
  } catch (error) {
    throw error;
  }
};

export default photoUploadController;
