import { Router, type Router as ExpressRouter } from "express";
import receiveConnectionController from "../../../controllers/receive-connection-controller.ts";

const receive: ExpressRouter = Router();

/**
 * POST /api/v1/connection/request/recieve/:status/:requestId
 * Respond to a received connection request
 * Status: "accepted" (accept match) or "rejected" (decline)
 * Note: Using "recieve" spelling as per requirements (intentional typo in endpoint)
 */
receive.post(
  "/request/recieve/:status/:requestId",
  receiveConnectionController,
);

export default receive;
