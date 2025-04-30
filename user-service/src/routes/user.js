const express = require("express");
const User = require("../models/user");
const amqp = require("amqplib"); // For RabbitMQ
const router = express.Router();

// Helper to publish message to RabbitMQ
async function publishUserRegistered(user) {
  try {
    const conn = await amqp.connect("amqp://rabbitmq:5672");
    const channel = await conn.createChannel();
    const queue = "user_registered";
    await channel.assertQueue(queue, {durable: false});
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(user)));
    setTimeout(() => {
      channel.close();
      conn.close();
    }, 500);
  } catch (err) {
    console.error("RabbitMQ publish error:", err.message);
  }
}

// Create a user
router.post("/", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    // Publish to RabbitMQ after registration
    publishUserRegistered({id: user._id, email: user.email, name: user.name});
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({error: err.message});
  }
});

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

// Get a user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({error: "User not found"});
    res.json(user);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

// Update a user
router.put("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) return res.status(404).json({error: "User not found"});
    res.json(user);
  } catch (err) {
    res.status(400).json({error: err.message});
  }
});

// Delete a user
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({error: "User not found"});
    res.json({message: "User deleted"});
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

module.exports = router;
