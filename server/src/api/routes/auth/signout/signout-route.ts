import { Router } from "express";
import signoutController from "../../../controllers/signout-controller";

const signout: Router = Router();

signout.post("/signout", signoutController);

export default signout;
