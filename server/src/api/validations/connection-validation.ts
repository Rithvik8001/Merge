import { z } from "zod";
import mongoose from "mongoose";

const isValidObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id);

export const sendConnectionRequestSchema = z.object({
  userId: z
    .string()
    .refine(isValidObjectId, {
      message: "Invalid user ID format",
    })
    .describe("Target user ID"),
  status: z
    .enum(["interested", "ignored"])
    .describe("Connection status: interested or ignored"),
});

export const receiveConnectionRequestSchema = z.object({
  requestId: z
    .string()
    .refine(isValidObjectId, {
      message: "Invalid request ID format",
    })
    .describe("Connection request ID"),
  status: z
    .enum(["accepted", "rejected"])
    .describe("Connection response: accepted or rejected"),
});

export type SendConnectionRequest = z.infer<typeof sendConnectionRequestSchema>;

export type ReceiveConnectionRequest = z.infer<
  typeof receiveConnectionRequestSchema
>;

export const validateSendConnectionRequest = async (data: unknown) => {
  return await sendConnectionRequestSchema.safeParseAsync(data);
};

export const validateReceiveConnectionRequest = async (data: unknown) => {
  return await receiveConnectionRequestSchema.safeParseAsync(data);
};
