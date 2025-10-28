import { Router, type Router as ExpressRouter } from "express";
import authMiddleware from "../../middlewares/auth";
import viewRoute from "./view/view-route";
import editRoute from "./edit/edit-route";
import passwordRoute from "./password/password-route";
import photoRoute from "./photo/photo-route";
import { profileRateLimiter } from "../../middlewares/rateLimiter";

const profileRouter: ExpressRouter = Router();

profileRouter.use(authMiddleware);

// Apply rate limiting to profile endpoints
// Prevents excessive profile updates and photo uploads
profileRouter.use(profileRateLimiter);

profileRouter.use("/view", viewRoute);
profileRouter.use("/", editRoute);
profileRouter.use("/", passwordRoute);
profileRouter.use("/photo", photoRoute);

export default profileRouter;
