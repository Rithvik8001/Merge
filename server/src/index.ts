import express from "express";
import type { Express } from "express";
import cookieParser from "cookie-parser";
import "dotenv/config";
import { connectDb } from "./db/config/connection.ts";
import authRouter from "../src/api/routes/auth/route.ts";
import connectionRouter from "../src/api/routes/connection/route.ts";
import profileRouter from "../src/api/routes/profile/route.ts";
import errorHandler from "./api/middlewares/errorHandler.ts";

const app: Express = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/connection", connectionRouter);
app.use("/api/v1/profile", profileRouter);

app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDb();
    console.log("Connected to Database");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
