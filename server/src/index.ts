import express from "express";
import type { Express } from "express";
import "dotenv/config";
import { connectDb } from "./db/config/connection.ts";
import authRouter from "../src/api/routes/auth/route.ts";
import errorHandler from "./api/middlewares/errorHandler.ts";

const app: Express = express();
const PORT = process.env.PORT;

app.use(express.json());

// routes
app.use("/api/v1", authRouter);

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
