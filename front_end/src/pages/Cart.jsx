import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId"); // Ensure unique cart per user
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");
   //Base URL
   const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Load cart from localStorage for the specific user
    const savedCart = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
    setCart(savedCart);
    setLoading(false);
  }, [userId]);

  // Update the quantity of a product
  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    const updatedCart = cart.map((item) =>
      item._id === productId ? { ...item, quantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem(`cart_${userId}`, JSON.stringify(updatedCart));
  };

  // Remove product from cart
  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item._id !== productId);
    setCart(updatedCart);
    localStorage.setItem(`cart_${userId}`, JSON.stringify(updatedCart));
  };

  // Calculate total price (Ensure correct floating point arithmetic)
  const totalAmount = parseFloat(
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)
  );

  // Handle order placement
  const placeOrder = async () => {
    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setPlacingOrder(true);
    setError("");

    // Format products for backend
    const formattedCart = cart.map((item) => ({
      productId: item._id, // Ensure product ID is sent correctly
      quantity: item.quantity,
    }));

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/orders/place-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          products: formattedCart,
          totalPrice: totalAmount, // Ensure it's a number
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Order placed successfully!");
        localStorage.removeItem(`cart_${userId}`); // Clear cart after placing order
        setCart([]);
        navigate("/"); // Redirect to home
      } else {
        setError(data.message || "Failed to place order.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading cart...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-center">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item._id} className="flex justify-between items-center border p-4 rounded-md shadow-md">
              <div>
                <h2 className="text-lg font-bold">{item.name}</h2>
                <p>SAR {item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  value={item.quantity}
                  min="1"
                  onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                  className="border px-2 py-1 w-16 text-center rounded"
                />
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* Total Price */}
          <div className="text-right text-xl font-bold">
            Total: SAR {totalAmount}
          </div>

          {/* Place Order Button */}
          {error && <p className="text-red-500 text-center">{error}</p>}
          <button
            onClick={placeOrder}
            disabled={placingOrder}
            className="w-full bg-green-600 text-white py-2 rounded-md mt-4 hover:bg-green-700 disabled:bg-gray-400"
          >
            {placingOrder ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
