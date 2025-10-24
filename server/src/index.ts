import express from "express";
import type { Express } from "express";
import "dotenv/config";
import { connectDb } from "./db/config/connection.ts";

const app: Express = express();

const PORT = process.env.PORT;

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
