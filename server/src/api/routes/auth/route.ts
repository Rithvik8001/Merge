import { Router } from "express";
import signupRouter from "./signup/signup-route.ts";
import loginRouter from "./login/login-route.ts";
import signoutRouter from "./signout/signout-route.ts";
import { authRateLimiter } from "../../middlewares/rateLimiter.ts";

const router: Router = Router();

// Apply strict rate limiting to all auth endpoints
router.use(authRateLimiter);

router.use("/", signupRouter);
router.use("/", loginRouter);
router.use("/", signoutRouter);

export default router;
