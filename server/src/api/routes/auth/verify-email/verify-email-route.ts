import { Router } from "express";
import verifyEmailOtpController from "../../../controllers/verify-email-otp-controller.js";
import resendVerificationOtpController from "../../../controllers/resend-verification-otp-controller.js";

const verifyEmailRouter: Router = Router();

verifyEmailRouter.post("/verify-email-otp", verifyEmailOtpController);
verifyEmailRouter.post("/resend-verification-otp", resendVerificationOtpController);

export default verifyEmailRouter;
