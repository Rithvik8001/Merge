import mongoose from "mongoose";

export const connectDb = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not set");
  }
  await mongoose.connect(process.env.MONGO_URI);
};
