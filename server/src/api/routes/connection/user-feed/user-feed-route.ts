import { Router, type Router as ExpressRouter } from "express";
import userFeedController from "../../../controllers/user-feed-controller.ts";

const userFeedRouter: ExpressRouter = Router();

userFeedRouter.get("/feed", userFeedController);

export default userFeedRouter;
