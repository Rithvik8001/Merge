import { Router, type Router as ExpressRouter } from "express";
import getMessagesController from "../../../controllers/get-messages-controller";
import markMessagesAsReadController from "../../../controllers/mark-messages-read-controller";

const messagesRoute: ExpressRouter = Router();

// Get messages for a specific conversation
messagesRoute.get("/:conversationId", getMessagesController);

// Mark messages as read
messagesRoute.post("/read/:conversationId", markMessagesAsReadController);

export default messagesRoute;
