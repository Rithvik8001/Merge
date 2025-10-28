import { Router } from "express";
import signupController from "../../../controllers/signup-controller.js";

const signup: Router = Router();

signup.post("/signup", signupController);

export default signup;
