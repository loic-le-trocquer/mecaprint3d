// backend/models/Order.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    quoteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quote",
    },

    stripeSessionId: String,
    paymentIntentId: String,

    customerEmail: String,
    amount: Number,
    currency: {
      type: String,
      default: "eur",
    },

    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);