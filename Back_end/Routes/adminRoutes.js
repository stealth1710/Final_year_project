const express = require("express");
const User = require("../models/User");

const router = express.Router();

// Get pending users
router.get("/pending-users", async (req, res) => {
  try {
    const pendingUsers = await User.find({ isApproved: false });
    res.status(200).json(pendingUsers);
  } catch (error) {
    res.status(500).json({ error: "Error fetching pending users." });
  }
});

// Approve user
router.put("/approve-user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndUpdate(id, { isApproved: true });
    res.status(200).json({ message: "User approved successfully." });
  } catch (error) {
    res.status(500).json({ error: "Error approving user." });
  }
});

module.exports = router;
