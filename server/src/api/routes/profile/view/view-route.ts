import { Router, type Router as ExpressRouter } from "express";
import viewProfileController from "../../../controllers/view-profile-controller";

const viewRoute: ExpressRouter = Router();

viewRoute.get("/:userId", viewProfileController);

export default viewRoute;
