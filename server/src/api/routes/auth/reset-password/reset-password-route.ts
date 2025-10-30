import { Router } from "express";
import resetPasswordController from "../../../controllers/reset-password-controller.js";
import verifyResetTokenController from "../../../controllers/verify-reset-token-controller.js";

const resetPassword: Router = Router();

resetPassword.get("/verify-reset-token", verifyResetTokenController);
resetPassword.post("/reset-password", resetPasswordController);

export default resetPassword;
