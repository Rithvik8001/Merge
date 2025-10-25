import { Router } from "express";
import signoutController from "../../../controllers/signout-controller.ts";

const signout: Router = Router();

signout.post("/login", signoutController);

export default signout;
