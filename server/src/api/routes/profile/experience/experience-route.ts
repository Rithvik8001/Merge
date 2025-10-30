import { Router, type Router as ExpressRouter } from "express";
import addWorkExperienceController from "../../../controllers/add-work-experience-controller.js";
import deleteWorkExperienceController from "../../../controllers/delete-work-experience-controller.js";
import editWorkExperienceController from "../../../controllers/edit-work-experience-controller.js";

const experienceRouter: ExpressRouter = Router();

experienceRouter.post("/", addWorkExperienceController);
experienceRouter.put("/:experienceId", editWorkExperienceController);
experienceRouter.delete("/:experienceId", deleteWorkExperienceController);

export default experienceRouter;
