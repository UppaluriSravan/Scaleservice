const express = require("express");
const Payment = require("../models/payment");
const amqp = require("amqplib"); // For RabbitMQ
const axios = require("axios"); // For order validation
const router = express.Router();

// Helper to publish message to RabbitMQ
async function publishPaymentApproved(orderId) {
  try {
    const conn = await amqp.connect("amqp://rabbitmq:5672");
    const channel = await conn.createChannel();
    const queue = "payment_approved";
    await channel.assertQueue(queue, {durable: false});
    channel.sendToQueue(queue, Buffer.from(JSON.stringify({orderId})));
    setTimeout(() => {
      channel.close();
      conn.close();
    }, 500);
  } catch (err) {
    console.error("RabbitMQ publish error:", err.message);
  }
}

// Create a payment
router.post("/", async (req, res) => {
  try {
    // Validate order existence
    const orderServiceUrl = `http://order-service:4002/api/orders/${req.body.orderId}`;
    let orderResponse;
    try {
      orderResponse = await axios.get(orderServiceUrl);
    } catch (orderErr) {
      return res
        .status(404)
        .json({error: "Order not found. Payment not processed."});
    }

    // Proceed if order exists
    const payment = new Payment(req.body);
    payment.status = "approved"; // Immediately approve for demo
    await payment.save();
    // Publish to payment_approved queue
    publishPaymentApproved(payment.orderId);
    res.status(201).json(payment);
  } catch (err) {
    res.status(400).json({error: err.message});
  }
});

// Get all payments
router.get("/", async (req, res) => {
  try {
    const payments = await Payment.find();
    res.json(payments);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

// Get a payment by ID
router.get("/:id", async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({error: "Payment not found"});
    res.json(payment);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

// Update a payment
router.put("/:id", async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!payment) return res.status(404).json({error: "Payment not found"});
    res.json(payment);
  } catch (err) {
    res.status(400).json({error: err.message});
  }
});

// Delete a payment
router.delete("/:id", async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) return res.status(404).json({error: "Payment not found"});
    res.json({message: "Payment deleted"});
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

module.exports = router;
