import { Router } from "express";
import signupRouter from "./signup/signup-route.ts";
import loginRouter from "./login/login-route.ts";
import signoutRouter from "./signout/signout-route.ts";

const router: Router = Router();

router.use("/", signupRouter);
router.use("/", loginRouter);
router.use("/", signoutRouter);

export default router;
