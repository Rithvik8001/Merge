import { Router, type Router as ExpressRouter } from "express";
import getConversationsController from "../../../controllers/get-conversations-controller.ts";

const conversationsRoute: ExpressRouter = Router();

// Get all conversations for the logged-in user
conversationsRoute.get("/", getConversationsController);

export default conversationsRoute;
