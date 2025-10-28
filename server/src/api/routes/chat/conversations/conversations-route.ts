import { Router, type Router as ExpressRouter } from "express";
import getConversationsController from "../../../controllers/get-conversations-controller.js";
import getOrCreateConversationController from "../../../controllers/get-or-create-conversation-controller.js";

const conversationsRoute: ExpressRouter = Router();

// Get all conversations for the logged-in user
conversationsRoute.get("/", getConversationsController);

// Get or create conversation with a specific user
conversationsRoute.post("/with/:recipientId", getOrCreateConversationController);

export default conversationsRoute;
