import { Router, type Router as ExpressRouter } from "express";
import acceptedConnectionsController from "../../../controllers/accepted-connections-controller";

const acceptedConnectionsRouter: ExpressRouter = Router();

acceptedConnectionsRouter.get("/connections", acceptedConnectionsController);

export default acceptedConnectionsRouter;
