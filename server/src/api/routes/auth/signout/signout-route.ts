import { Router } from "express";
import signoutController from "../../../controllers/signout-controller.js";

const signout: Router = Router();

signout.post("/signout", signoutController);

export default signout;
