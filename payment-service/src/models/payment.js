const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    orderId: {type: String, required: true},
    userId: {type: String, required: true},
    amount: {type: Number, required: true},
    status: {type: String, default: "pending"},
    method: {type: String, required: true},
  },
  {timestamps: true}
);

module.exports = mongoose.model("Payment", paymentSchema);
