import mongoose, { Schema } from "mongoose";

const connectionSchema = new Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: ["interested", "ignored", "accepted", "rejected"],
        message:
          "Status must be one of: interested, ignored, accepted, rejected",
      },
      default: "interested",
      required: true,
    },
    actionAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true },
);

connectionSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });
connectionSchema.index({ toUserId: 1, status: 1 });
connectionSchema.index({ fromUserId: 1, status: 1 });

const Connection = mongoose.model("Connection", connectionSchema);

export default Connection;
