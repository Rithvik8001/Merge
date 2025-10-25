import { Router } from "express";
import signupRouter from "./signup/signup-route.ts";
import loginRouter from "./login/login-route.ts";

const router: Router = Router();

router.use("/auth", signupRouter);
router.use("/auth", loginRouter);

export default router;
