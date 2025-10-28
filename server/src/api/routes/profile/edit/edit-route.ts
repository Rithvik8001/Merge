import { Router, type Router as ExpressRouter } from "express";
import editProfileController from "../../../controllers/edit-profile-controller.js";

const editRoute: ExpressRouter = Router();

editRoute.post("/edit", editProfileController);

export default editRoute;
