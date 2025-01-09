// models/Transactions.js
import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
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
    amount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["credit_card", "paypal", "bank_transfer"], 
      required: true,
    },
    paymentDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    stripePaymentId: {
      type: String, // Si c'est un ID Stripe
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Transactions || mongoose.model("Transactions", transactionSchema);
