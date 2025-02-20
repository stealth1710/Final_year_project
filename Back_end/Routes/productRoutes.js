const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Update product price by ID
router.put("/update-price/:id", async (req, res) => {
  const { id } = req.params; // Product ID from the URL parameter
  const { price } = req.body; // New price from the request body

  if (!price) {
    return res.status(400).json({ error: "Price is required." });
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { price },
      { new: true } // Return the updated document
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.json({ message: "Price updated successfully", product: updatedProduct });
  } catch (error) {
    console.error("Error updating price:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;

