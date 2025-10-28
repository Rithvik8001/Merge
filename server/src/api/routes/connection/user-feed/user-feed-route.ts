import { Router, type Router as ExpressRouter } from "express";
import userFeedController from "../../../controllers/user-feed-controller";

const userFeedRouter: ExpressRouter = Router();

userFeedRouter.get("/feed", userFeedController);

export default userFeedRouter;
