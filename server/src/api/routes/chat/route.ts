import { Router, type Router as ExpressRouter } from "express";
import authMiddleware from "../../middlewares/auth.ts";
import conversationsRoute from "./conversations/conversations-route.ts";
import messagesRoute from "./messages/messages-route.ts";
import { chatRateLimiter } from "../../middlewares/rateLimiter.ts";

const chatRouter: ExpressRouter = Router();

// All chat routes require authentication
chatRouter.use(authMiddleware);

chatRouter.use(chatRateLimiter);

// Chat sub-routes
chatRouter.use("/conversations", conversationsRoute);
chatRouter.use("/messages", messagesRoute);

export default chatRouter;
