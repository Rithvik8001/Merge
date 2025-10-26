import { Router } from "express";
import signoutController from "../../../controllers/signout-controller.ts";

const signout: Router = Router();

signout.post("/signout", signoutController);

export default signout;
