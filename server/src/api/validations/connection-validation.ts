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

export const receivedRequestsSchema = z.object({});

export type ReceivedRequestsData = z.infer<typeof receivedRequestsSchema>;

export const acceptedConnectionsSchema = z.object({});

export type AcceptedConnectionsData = z.infer<typeof acceptedConnectionsSchema>;

export const userFeedSchema = z.object({
  page: z
    .string()
    .optional()
    .default("1")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Page must be a positive number",
    })
    .transform((val) => Number(val)),
  limit: z
    .string()
    .optional()
    .default("20")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Limit must be a positive number",
    })
    .transform((val) => Number(val)),
});

export type UserFeedData = z.infer<typeof userFeedSchema>;

export const validateReceivedRequests = async (data: unknown) => {
  return await receivedRequestsSchema.safeParseAsync(data);
};

export const validateAcceptedConnections = async (data: unknown) => {
  return await acceptedConnectionsSchema.safeParseAsync(data);
};

export const validateUserFeed = async (data: unknown) => {
  return await userFeedSchema.safeParseAsync(data);
};
