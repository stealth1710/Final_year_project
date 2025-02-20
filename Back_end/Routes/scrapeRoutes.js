const express = require("express");
const ScrapedData = require("../models/ScrapedData");

const router = express.Router();

// Fetch all scraped data
router.get("/", async (req, res) => {
  try {
    const data = await ScrapedData.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching scraped data", error });
  }
});

module.exports = router;
