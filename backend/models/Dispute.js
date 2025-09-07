const mongoose = require("mongoose");

const DisputeSchema = new mongoose.Schema(
  {
    stripeDisputeId: { type: String, required: true },
    paymentIntentId: { type: String },
    reason: { type: String },
    status: { type: String, default: "open" },
    amount: { type: Number },
    currency: { type: String },
    evidence: { type: Object },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Dispute", DisputeSchema);
