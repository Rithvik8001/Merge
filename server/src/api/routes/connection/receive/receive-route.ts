import { Router, type Router as ExpressRouter } from "express";
import receiveConnectionController from "../../../controllers/receive-connection-controller.js";

const receive: ExpressRouter = Router();

receive.post(
  "/request/recieve/:status/:requestId",
  receiveConnectionController,
);

export default receive;
