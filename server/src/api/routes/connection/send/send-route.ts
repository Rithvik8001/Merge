import { Router, type Router as ExpressRouter } from "express";
import sendConnectionController from "../../../controllers/send-connection-controller.ts";

const send: ExpressRouter = Router();

/**
 * POST /api/v1/connection/request/send/:status/:userId
 * Send a connection request to a user
 * Status: "interested" (user wants to connect) or "ignored" (user is not interested)
 */
send.post("/request/send/:status/:userId", sendConnectionController);

export default send;
