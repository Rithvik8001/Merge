import { Router, type Router as ExpressRouter } from "express";
import passwordChangeController from "../../../controllers/password-change-controller.js";

const passwordRoute: ExpressRouter = Router();

passwordRoute.post("/password", passwordChangeController);

export default passwordRoute;
