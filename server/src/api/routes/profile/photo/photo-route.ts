import { Router, type Router as ExpressRouter } from "express";
import multer from "multer";
import photoUploadController from "../../../controllers/photo-upload-controller.js";

const photoRoute: ExpressRouter = Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

photoRoute.post("/upload", upload.single("photo"), photoUploadController);

export default photoRoute;
