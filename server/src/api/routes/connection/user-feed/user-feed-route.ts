import { Router, type Router as ExpressRouter } from "express";
import userFeedController from "../../../controllers/user-feed-controller.js";

const userFeedRouter: ExpressRouter = Router();

userFeedRouter.get("/feed", userFeedController);

export default userFeedRouter;
