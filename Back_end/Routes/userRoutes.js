const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Sign Up Route
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isApproved: false, // Default to false, requires admin approval
    });

    // Save the user to the database
    await newUser.save();
    res.status(201).json({
      message: "Sign-up successful. Awaiting admin approval.",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during sign-up", error });
  }
});

// Sign In Route
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user is approved by admin
    if (!user.isApproved) {
      return res
        .status(403)
        .json({ message: "Account not approved by admin" });
    }

    // Verify the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    res.status(200).json({
      message: "Sign-in successful",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during sign-in", error });
  }
});

// Protected Route Example
router.get("/protected", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access Denied. No Token Provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({
      message: "You have accessed a protected route",
      user: decoded,
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token", error });
  }
});

module.exports = router;
