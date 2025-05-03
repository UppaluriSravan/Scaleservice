const express = require("express");
const Order = require("../models/order");
const axios = require("axios"); // Added for interservice communication
const router = express.Router();

// Create an order
router.post("/", async (req, res) => {
  try {
    // User validation: check if user exists in user-service
    const userServiceUrl = `http://user-service:4003/api/users/${req.body.userId}`;
    try {
      await axios.get(userServiceUrl);
    } catch (userErr) {
      return res
        .status(404)
        .json({error: "User not found. Order not created."});
    }

    const order = new Order(req.body);
    await order.save();

    // Interservice call to payment-service
    try {
      await axios.post("http://payment-service:4004/api/payments", {
        orderId: order._id,
        userId: order.userId,
        amount: order.total,
        method: req.body.method || "card", // Default to 'card' if not provided
      });
    } catch (paymentErr) {
      // Log payment service error but do not block order creation
      console.error("Payment service error:", paymentErr.message);
    }

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({error: err.message});
  }
});

// Get all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

// Get an order by ID
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({error: "Order not found"});
    res.json(order);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

// Update an order
router.put("/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!order) return res.status(404).json({error: "Order not found"});
    res.json(order);
  } catch (err) {
    res.status(400).json({error: err.message});
  }
});

// Delete an order
router.delete("/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({error: "Order not found"});
    res.json({message: "Order deleted"});
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

module.exports = router;
