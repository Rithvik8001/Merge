import { Router, type Router as ExpressRouter } from "express";
import authMiddleware from "../../middlewares/auth.js";
import viewRoute from "./view/view-route.js";
import editRoute from "./edit/edit-route.js";
import passwordRoute from "./password/password-route.js";
import photoRoute from "./photo/photo-route.js";
import { profileRateLimiter } from "../../middlewares/rateLimiter.js";

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
