import { Router } from "express";
import forgotPasswordController from "../../../controllers/forgot-password-controller.js";

const forgotPassword: Router = Router();

forgotPassword.post("/forgot-password", forgotPasswordController);

export default forgotPassword;
