import { Router, type Router as ExpressRouter } from "express";
import receivedRequestsController from "../../../controllers/received-requests-controller";

const receivedRequestsRouter: ExpressRouter = Router();

receivedRequestsRouter.get("/requests/received", receivedRequestsController);

export default receivedRequestsRouter;
