const express = require("express");
const Order = require("../models/Order");
const auth = require("../middleware/auth"); // Middleware for user authentication
const adminAuth = require("../middleware/adminAuth"); // Middleware for admin authentication
const User = require("../models/User");

const router = express.Router();

/**
 * User Places an Order (Only Approved Users)
 * @route POST /api/orders/place-order
 * @access Protected (Only logged-in & approved users)
 */
router.post("/place-order", auth, async (req, res) => {
  try {
    const { products, totalPrice } = req.body;
    const userId = req.user.id; // Extracted from JWT

    //  Validate if cart has products
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Cart is empty. Please add products before ordering." });
    }

    //  Validate totalPrice
    if (!totalPrice || isNaN(totalPrice) || totalPrice <= 0) {
      return res.status(400).json({ message: "Invalid total price." });
    }

    //  Ensure each product has productId and quantity
    for (let product of products) {
      if (!product.productId || !product.quantity || product.quantity <= 0) {
        return res.status(400).json({ message: "Each product must have a valid productId and quantity." });
      }
    }

    //  Check if user exists and is approved
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    if (!user.isApproved) {
      return res.status(403).json({ message: "Your account is pending admin approval." });
    }

    //  Create new order
    const newOrder = new Order({
      user: userId,
      products,
      totalPrice,
      status: "Pending",
      createdAt: new Date(),
    });

    await newOrder.save();
    return res.status(201).json({ message: "Order placed successfully!", order: newOrder });

  } catch (error) {
    console.error(" Error placing order:", error);
    return res.status(500).json({ message: "Server error while placing order.", error: error.message });
  }
});

/**
 *  Admin Views All Orders
 * @route GET /api/orders/admin/orders
 * @access Admin Only
 */
router.get("/admin/orders", adminAuth, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email") // Fetch user details
      .populate("products.productId", "name price"); // Fetch product details

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found." });
    }

    return res.status(200).json(orders);
  } catch (error) {
    console.error("🚨 Error fetching orders:", error);
    return res.status(500).json({ message: "Server error while fetching orders.", error: error.message });
  }
});

/**
 *  Admin Updates Order Status
 * @route PUT /api/orders/admin/update-order/:id
 * @access Admin Only
 */
router.put("/admin/update-order/:id", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid order status. Choose from: ${validStatuses.join(", ")}` });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found." });
    }

    return res.status(200).json({ message: "Order status updated successfully.", order: updatedOrder });

  } catch (error) {
    console.error(" Error updating order status:", error);
    return res.status(500).json({ message: "Server error while updating order status.", error: error.message });
  }
});

module.exports = router;
