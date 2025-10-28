import { Router } from "express";
import signupRouter from "./signup/signup-route.js";
import loginRouter from "./login/login-route.js";
import signoutRouter from "./signout/signout-route.js";
import { authRateLimiter } from "../../middlewares/rateLimiter.js";

const router: Router = Router();

// Apply strict rate limiting to all auth endpoints
router.use(authRateLimiter);

router.use("/", signupRouter);
router.use("/", loginRouter);
router.use("/", signoutRouter);

export default router;
