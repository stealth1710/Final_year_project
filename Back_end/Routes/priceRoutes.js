const express = require("express");
const router = express.Router();
const ScrapedData = require("../models/ScrapedData");

// Update product price by ID
router.put("/update-price/:id", async (req, res) => {
  const { id } = req.params;
  const { price } = req.body;

  if (!price) {
    return res.status(400).json({ error: "Price is required." });
  }

  try {
    const updatedProduct = await ScrapedData.findByIdAndUpdate(
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
    res.status(500).json({ error: "An error occurred while updating the price." });
  }
});

module.exports = router;
