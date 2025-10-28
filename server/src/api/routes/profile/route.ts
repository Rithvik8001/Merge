import { Router, type Router as ExpressRouter } from "express";
import authMiddleware from "../../middlewares/auth.ts";
import viewRoute from "./view/view-route.ts";
import editRoute from "./edit/edit-route.ts";
import passwordRoute from "./password/password-route.ts";
import photoRoute from "./photo/photo-route.ts";
import { profileRateLimiter } from "../../middlewares/rateLimiter.ts";

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
