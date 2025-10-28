import { Router } from "express";
import loginController from "../../../controllers/login-controller.js";

const login: Router = Router();

login.post("/login", loginController);

export default login;
