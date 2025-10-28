import { Router } from "express";
import signupController from "../../../controllers/signup-controller";

const signup: Router = Router();

signup.post("/signup", signupController);

export default signup;
