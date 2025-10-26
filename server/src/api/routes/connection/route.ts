import { Router, type Router as ExpressRouter } from "express";
import authMiddleware from "../../middlewares/auth.ts";
import sendRouter from "./send/send-route.ts";
import receiveRouter from "./receive/receive-route.ts";

const connectionRouter: ExpressRouter = Router();

connectionRouter.use(authMiddleware);

connectionRouter.use("/", sendRouter);
connectionRouter.use("/", receiveRouter);

export default connectionRouter;
