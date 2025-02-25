const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");
const ScrapedData = require("../models/ScrapedData");

// ✅ Fetch all scraped prices (Admin only)
router.get("/", adminAuth, async (req, res) => {
  try {
    const scrapedPrices = await ScrapedData.find().sort({ scraped_at: -1 });
    res.json(scrapedPrices);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
