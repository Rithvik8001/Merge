import { Router, type Router as ExpressRouter } from "express";
import passwordChangeController from "../../../controllers/password-change-controller";

const passwordRoute: ExpressRouter = Router();

passwordRoute.post("/password", passwordChangeController);

export default passwordRoute;
