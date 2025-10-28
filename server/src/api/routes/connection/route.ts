import { Router, type Router as ExpressRouter } from "express";
import authMiddleware from "../../middlewares/auth.ts";
import sendRouter from "./send/send-route.ts";
import receiveRouter from "./receive/receive-route.ts";
import receivedRequestsRouter from "./received-requests/received-requests-route.ts";
import acceptedConnectionsRouter from "./accepted-connections/accepted-connections-route.ts";
import userFeedRouter from "./user-feed/user-feed-route.ts";
import { connectionRateLimiter } from "../../middlewares/rateLimiter.ts";

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
