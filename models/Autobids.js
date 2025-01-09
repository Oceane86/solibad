// models/Bids.js
import mongoose from "mongoose";

const autoBidSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    maxBudget: {
      type: Number,
      required: true,
    },
    increment: {
      type: Number,
      default: 1,
    },
    createdAt: {
      type: Date,
      default: Date.now,
        required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.AutoBids || mongoose.model("AutoBids", autoBidSchema);
