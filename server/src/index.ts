import express from "express";
import type { Express } from "express";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import { connectDb } from "./db/config/connection.js";
import authRouter from "./api/routes/auth/route.js";
import connectionRouter from "./api/routes/connection/route.js";
import profileRouter from "./api/routes/profile/route.js";
import chatRouter from "./api/routes/chat/route.js";
import errorHandler from "./api/middlewares/errorHandler.js";
import initializeSocket from "./socket/socket-config.js";
import { globalRateLimiter } from "./api/middlewares/rateLimiter.js";

const app: Express = express();
const httpServer = createServer(app);

// Initialize Socket.io
initializeSocket(httpServer);

const PORT = process.env.PORT;

// CORS configuration
const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Apply global rate limiting to all requests
app.use(globalRateLimiter);

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/connection", connectionRouter);
app.use("/api/v1/profile", profileRouter);
app.use("/api/v1/chat", chatRouter);

app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDb();
    console.log("Connected to Database");

    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`WebSocket (Socket.io) ready`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
