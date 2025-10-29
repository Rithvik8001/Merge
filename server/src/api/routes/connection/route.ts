import { Router, type Router as ExpressRouter } from "express";
import authMiddleware from "../../middlewares/auth.js";
import sendRouter from "./send/send-route.js";
import receiveRouter from "./receive/receive-route.js";
import receivedRequestsRouter from "./received-requests/received-requests-route.js";
import acceptedConnectionsRouter from "./accepted-connections/accepted-connections-route.js";
import userFeedRouter from "./user-feed/user-feed-route.js";
import searchRouter from "./search/search-route.js";
import { connectionRateLimiter } from "../../middlewares/rateLimiter.js";

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
connectionRouter.use("/user", searchRouter);

export default connectionRouter;
