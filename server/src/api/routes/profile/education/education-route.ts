import { Router, type Router as ExpressRouter } from "express";
import addEducationController from "../../../controllers/add-education-controller.js";
import deleteEducationController from "../../../controllers/delete-education-controller.js";
import editEducationController from "../../../controllers/edit-education-controller.js";

const educationRouter: ExpressRouter = Router();

educationRouter.post("/", addEducationController);
educationRouter.put("/:educationId", editEducationController);
educationRouter.delete("/:educationId", deleteEducationController);

export default educationRouter;
