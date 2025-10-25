import { Router } from "express";
import loginController from "../../../controllers/login-controller.ts";

const login: Router = Router();

login.post("/login", loginController);

export default login;
