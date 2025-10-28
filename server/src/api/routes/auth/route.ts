import { Router } from "express";
import signupRouter from "./signup/signup-route";
import loginRouter from "./login/login-route";
import signoutRouter from "./signout/signout-route";
import { authRateLimiter } from "../../middlewares/rateLimiter";

const router: Router = Router();

// Apply strict rate limiting to all auth endpoints
router.use(authRateLimiter);

router.use("/", signupRouter);
router.use("/", loginRouter);
router.use("/", signoutRouter);

export default router;
