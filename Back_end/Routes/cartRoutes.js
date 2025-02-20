const express = require("express");
const Cart = require("../models/Cart");
const auth = require("../middleware/auth");

const router = express.Router();

// Get user's cart
router.get("/", auth, async (req, res) => {
  try {
    const userCart = await Cart.findOne({ user: req.user.id }).populate("items.productId");
    res.status(200).json({ cart: userCart ? userCart.items : [] });
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart", error });
  }
});

// Add item to cart
router.post("/add", auth, async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    let userCart = await Cart.findOne({ user: req.user.id });

    if (!userCart) {
      userCart = new Cart({ user: req.user.id, items: [] });
    }

    const itemIndex = userCart.items.findIndex((item) => item.productId.toString() === productId);

    if (itemIndex > -1) {
      userCart.items[itemIndex].quantity += quantity;
    } else {
      userCart.items.push({ productId, quantity });
    }

    await userCart.save();
    res.status(200).json({ message: "Item added to cart", cart: userCart.items });
  } catch (error) {
    res.status(500).json({ message: "Error adding item to cart", error });
  }
});

// Remove item from cart
router.delete("/remove/:productId", auth, async (req, res) => {
  try {
    const userCart = await Cart.findOne({ user: req.user.id });

    if (userCart) {
      userCart.items = userCart.items.filter((item) => item.productId.toString() !== req.params.productId);
      await userCart.save();
    }

    res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    res.status(500).json({ message: "Error removing item from cart", error });
  }
});

module.exports = router;
