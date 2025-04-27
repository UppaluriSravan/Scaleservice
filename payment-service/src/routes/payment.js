const express = require("express");
const Payment = require("../models/payment");
const router = express.Router();

// Create a payment
router.post("/", async (req, res) => {
  try {
    const payment = new Payment(req.body);
    await payment.save();
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
