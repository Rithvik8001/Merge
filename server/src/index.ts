import express from "express";
import type { Express } from "express";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import { connectDb } from "./db/config/connection.ts";
import authRouter from "../src/api/routes/auth/route.ts";
import connectionRouter from "../src/api/routes/connection/route.ts";
import profileRouter from "../src/api/routes/profile/route.ts";
import chatRouter from "../src/api/routes/chat/route.ts";
import errorHandler from "./api/middlewares/errorHandler.ts";
import initializeSocket from "./socket/socket-config.ts";
import { globalRateLimiter } from "./api/middlewares/rateLimiter.ts";

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
