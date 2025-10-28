import { Router, type Router as ExpressRouter } from "express";
import authMiddleware from "../../middlewares/auth";
import sendRouter from "./send/send-route";
import receiveRouter from "./receive/receive-route";
import receivedRequestsRouter from "./received-requests/received-requests-route";
import acceptedConnectionsRouter from "./accepted-connections/accepted-connections-route";
import userFeedRouter from "./user-feed/user-feed-route";
import { connectionRateLimiter } from "../../middlewares/rateLimiter";

const connectionRouter: ExpressRouter = Router();

connectionRouter.use(authMiddleware);

// Apply rate limiting to connection endpoints
// Prevents spam of connection requests
connectionRouter.use(connectionRateLimiter);

connectionRouter.use("/", sendRouter);
connectionRouter.use("/", receiveRouter);
connectionRouter.use("/user", receivedRequestsRouter);
connectionRouter.use("/user", acceptedConnectionsRouter);
connectionRouter.use("/user", userFeedRouter);

export default connectionRouter;
