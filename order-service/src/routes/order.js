const express = require("express");
const Order = require("../models/order");
const router = express.Router();

// Create an order
router.post("/", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
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
