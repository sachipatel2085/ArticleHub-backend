import mongoose from "mongoose";

const authorReportSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    reason: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "reviewed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("AuthorReport", authorReportSchema);