import { Router, type Router as ExpressRouter } from "express";
import sendConnectionController from "../../../controllers/send-connection-controller.js";

const send: ExpressRouter = Router();

send.post("/request/send/:status/:userId", sendConnectionController);

export default send;
