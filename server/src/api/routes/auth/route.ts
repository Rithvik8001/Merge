import { Router } from "express";
import signupRouter from "./signup/signup-route.ts";
import loginRouter from "./login/login-route.ts";
import signoutRouter from "./signout/signout-route.ts";

const router: Router = Router();

router.use("/auth", signupRouter);
router.use("/auth", loginRouter);
router.use("/auth", signoutRouter);

export default router;
