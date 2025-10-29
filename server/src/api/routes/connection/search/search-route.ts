import { Router, type Router as ExpressRouter } from "express";
import searchUsersController from "../../../controllers/search-users-controller.js";

const searchRouter: ExpressRouter = Router();

searchRouter.get("/search", searchUsersController);

export default searchRouter;
