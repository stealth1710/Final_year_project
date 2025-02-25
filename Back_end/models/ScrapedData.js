const mongoose = require("mongoose");

const scrapedDataSchema = new mongoose.Schema({
  product_name: { type: String, required: true },
  source: { type: String, required: true },
  price: { type: String, required: true },
  updated_at: { type: String, required: true },
});


const ScrapedData = mongoose.model("ScrapedData", scrapedDataSchema, "scraped_prices");

module.exports = ScrapedData;
