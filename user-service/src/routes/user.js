const express = require("express");
const User = require("../models/user");
const router = express.Router();

// Create a user
router.post("/", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
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
