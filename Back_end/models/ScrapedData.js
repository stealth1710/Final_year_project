const mongoose = require("mongoose");

const scrapedDataSchema = new mongoose.Schema({
  product_name: { type: String, required: true }, // Name of the product
  source: { type: String, required: true },       // Website/source of the data
  price: { type: String, required: true },        // Price of the product
  scraped_at: { type: Date, default: Date.now },  // Timestamp of when the data was scraped
});

// Create the model
const ScrapedData = mongoose.model("ScrapedData", scrapedDataSchema);

module.exports = ScrapedData;
