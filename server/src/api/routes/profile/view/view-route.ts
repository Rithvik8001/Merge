import { Router, type Router as ExpressRouter } from "express";
import viewProfileController from "../../../controllers/view-profile-controller.ts";

const viewRoute: ExpressRouter = Router();

viewRoute.get("/view/:userId", viewProfileController);

export default viewRoute;
