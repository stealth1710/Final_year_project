const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const productRoutes = require("./Routes/productRoutes");
const userRoutes = require("./Routes/userRoutes");
const adminRoutes = require("./Routes/adminRoutes");
const scrapeRoutes = require("./Routes/scrapeRoutes");
const orderRoutes = require("./Routes/orderRoutes"); // Added Order Routes
const scrapeDataRoutes = require("./Routes/scrapedPrices");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// Routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/scraped-data", scrapeRoutes);
app.use("/api/orders", orderRoutes); // ✅ Added Order Routes
app.use("/api/scraped-products", scrapeDataRoutes);

// Default Route
app.get("/", (req, res) => {
  res.send("<h1>Bismillah</h1>");
});

// 404 Handler for Undefined Routes
app.use((req, res) => {
  res.status(404).send("<h1>404 - Page Not Found</h1>");
});

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
