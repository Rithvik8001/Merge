import { Server as HTTPServer } from "http";
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { saveMessageToDb, getOrCreateConversation } from "./message-service.ts";

interface AuthenticatedSocket extends Socket {
  userId?: string;
  email?: string;
}

// Store active user connections
export const userConnections: Map<string, string> = new Map(); // userId -> socketId

const JWT_SECRET = process.env.JWT_SECRET_KEY;

export const initializeSocket = (httpServer: HTTPServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true, // Allow credentials (cookies) in CORS
    },
  });

  // Middleware for JWT authentication via httpOnly cookie
  io.use((socket, next) => {
    try {
      // Get token from httpOnly cookie
      const cookies = socket.handshake.headers.cookie;

      if (!cookies) {
        return next(new Error("Authentication cookie not provided"));
      }

      // Parse cookie string to extract token
      const tokenMatch = cookies.match(/token=([^;]*)/);
      const token = tokenMatch ? tokenMatch[1] : null;

      if (!token) {
        return next(new Error("Authentication token not found in cookies"));
      }

      const decoded = jwt.verify(token, JWT_SECRET!) as JwtPayload;
      (socket as AuthenticatedSocket).userId = decoded.userId;
      (socket as AuthenticatedSocket).email = decoded.email;

      next();
    } catch (error) {
      console.error("Socket auth error:", error);
      next(new Error("Invalid authentication token"));
    }
  });

  // Connection event
  io.on("connection", (socket: AuthenticatedSocket) => {
    // Store user connection
    if (socket.userId) {
      userConnections.set(socket.userId, socket.id);
    }

    // Join user's personal room for direct messages
    if (socket.userId) {
      socket.join(`user:${socket.userId}`);
    }

    // Send message event
    socket.on("send_message", async (data) => {
      try {
        const { conversationId, content, recipientId } = data;

        if (!content || !recipientId) {
          socket.emit("error", "Missing required fields");
          return;
        }

        let convId = conversationId;

        // If no conversation ID, create one
        if (!convId) {
          const conversation = await getOrCreateConversation(
            socket.userId!,
            recipientId,
          );
          convId = conversation._id.toString();
        }

        // Save message to database
        const savedMessage = await saveMessageToDb(
          convId,
          socket.userId!,
          content,
        );

        // Message data to broadcast
        const messageData = {
          id: savedMessage._id,
          conversationId: convId,
          senderId: socket.userId,
          senderName: socket.email?.split("@")[0] || "User",
          content,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isOwn: false,
          isRead: false,
        };

        // Send to recipient's personal room
        io.to(`user:${recipientId}`).emit("receive_message", messageData);

        // Send confirmation to sender
        socket.emit("message_sent", {
          id: savedMessage._id,
          conversationId: convId,
          content,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isOwn: true,
        });
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("error", "Failed to send message");
      }
    });

    // Typing indicator event
    socket.on("typing", (data) => {
      const { conversationId, recipientId } = data;

      if (recipientId && conversationId) {
        io.to(`user:${recipientId}`).emit("user_typing", {
          conversationId,
          userId: socket.userId,
        });
      }
    });

    // Stop typing event
    socket.on("stop_typing", (data) => {
      const { conversationId, recipientId } = data;

      if (recipientId && conversationId) {
        io.to(`user:${recipientId}`).emit("user_stop_typing", {
          conversationId,
          userId: socket.userId,
        });
      }
    });

    // Disconnect event
    socket.on("disconnect", () => {
      if (socket.userId) {
        userConnections.delete(socket.userId);
      }
    });
  });

  return io;
};

export default initializeSocket;
