import { Router } from "express";
import signupRouter from "./signup/signup-route.js";
import loginRouter from "./login/login-route.js";
import signoutRouter from "./signout/signout-route.js";
import forgotPasswordRouter from "./forgot-password/forgot-password-route.js";
import resetPasswordRouter from "./reset-password/reset-password-route.js";
import { authRateLimiter } from "../../middlewares/rateLimiter.js";

const router: Router = Router();

// Apply strict rate limiting to all auth endpoints
router.use(authRateLimiter);

router.use("/", signupRouter);
router.use("/", loginRouter);
router.use("/", signoutRouter);
router.use("/", forgotPasswordRouter);
router.use("/", resetPasswordRouter);

export default router;
