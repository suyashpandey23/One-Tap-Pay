const mongoose = require("mongoose");
const User = require("./userModel");
const transactionSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    // ref: `${User}`,
    ref: "User",
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    // ref: `${User}`,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "completed",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    default: "Money transfer",
  },
});
// Add indexes for better query performance
transactionSchema.index({ senderId: 1, timestamp: -1 });
transactionSchema.index({ receiverId: 1, timestamp: -1 });

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
