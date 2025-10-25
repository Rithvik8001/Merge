import { Router } from "express";
import signupRouter from "./signup/signup-route";

const router: Router = Router();

router.use("/auth", signupRouter);

export default router;
