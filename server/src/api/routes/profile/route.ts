import { Router, type Router as ExpressRouter } from "express";
import authMiddleware from "../../middlewares/auth.ts";
import viewRoute from "./view/view-route.ts";
import editRoute from "./edit/edit-route.ts";
import passwordRoute from "./password/password-route.ts";

const profileRouter: ExpressRouter = Router();

profileRouter.use(authMiddleware);
profileRouter.use("/view", viewRoute);
profileRouter.use("/", editRoute);
profileRouter.use("/", passwordRoute);

export default profileRouter;
