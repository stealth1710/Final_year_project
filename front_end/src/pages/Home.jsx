import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ukFlag from "../assets/pics/ukflag.png";
import ksaFlag from "../assets/pics/ksa.webp";
import { FaSearch, FaShoppingCart } from "react-icons/fa";

// Import all images from the folder
const images = import.meta.glob("../assets/product_pictures/*", {
  eager: true,
});

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  //Base URL
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  // Get logged-in user ID from localStorage
  const userId = localStorage.getItem("userId");

  // Toggle Language
  const toggleLanguage = () => {
    setCurrentLanguage((prev) => (prev === "en" ? "ar" : "en"));
  };

  // Sign-Out Functionality
  const handleSignOut = () => {
    localStorage.removeItem("token"); // Clear token
    localStorage.removeItem(`cart_${userId}`); // Clear cart on logout
    navigate("/signin"); // Redirect to Sign-In page
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/products`);
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();

    // Load user-specific cart from localStorage
    if (userId) {
      const savedCart =
        JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
      setCart(savedCart);
    }
  }, [userId]);

  const filteredProducts = products.filter((product) => {
    const name = currentLanguage === "en" ? product.name : product.name_ar;
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getImage = (imagePath) => {
    const imageName = imagePath.split("/").pop();
    const match = Object.keys(images).find((key) => key.includes(imageName));
    return match ? images[match].default : "";
  };

  // Add product to user-specific cart
  const addToCart = (product) => {
    const existingItem = cart.find((item) => item._id === product._id);

    let updatedCart;
    if (existingItem) {
      // If product is already in cart, increase quantity
      updatedCart = cart.map((item) =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      // Add new product with quantity 1
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }

    setCart(updatedCart);
    localStorage.setItem(`cart_${userId}`, JSON.stringify(updatedCart)); // Store per user
  };

  if (loading) {
    return <p className="text-center mt-10">Loading products...</p>;
  }

  return (
    <>
      {/* Navbar */}
      <nav className="bg-[#11454A] text-white h-[100px] p-4 sticky top-0 shadow-md z-50">
        <div className="w-full flex items-center justify-between">
          {/* Left Title */}
          <div className="pl-2">
            <h1
              className="text-[20px] md:text-[30px] lg:text-[40px] font-bold italic"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Retail Connect
            </h1>
          </div>

          {/* Right Options */}
          <div className="flex items-center space-x-4">
            {/* Language Toggle Button */}
            <button
              onClick={toggleLanguage}
              className="text-[16px] font-medium bg-white text-[#11454A] px-3 py-1 rounded-full hover:bg-gray-200"
            >
              <motion.span
                key={currentLanguage}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {currentLanguage === "en" ? "ع" : "En"}
              </motion.span>
            </button>

            {/* Flag */}
            <motion.img
              key={currentLanguage}
              src={currentLanguage === "en" ? ksaFlag : ukFlag}
              alt={currentLanguage === "en" ? "UK Flag" : "KSA Flag"}
              className="w-8 h-8 rounded-full"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />

            {/* Cart Button */}
            <button
              onClick={() => navigate("/cart")}
              className="text-[16px] font-medium bg-yellow-500 text-white px-4 py-2 rounded-full hover:bg-yellow-600 flex items-center space-x-2"
            >
              <FaShoppingCart />
              <span>
                Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
              </span>
            </button>

            {/* Sign-Out Button */}
            <button
              onClick={handleSignOut}
              className="text-[16px] font-medium bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Search Bar */}
      <div className="container mx-auto p-4">
        <div className="flex justify-center mb-6">
          <div className="relative w-full md:w-64 lg:w-96">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="text-black w-full px-4 py-2 pl-10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
            />
            <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Product List */}
        <motion.div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <motion.div
              key={product._id}
              className="flex flex-col items-center border rounded-lg shadow-md p-4 bg-white hover:shadow-lg transition"
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.3, ease: "easeInOut" },
              }}
            >
              <img
                src={getImage(product.image)}
                alt={product.name}
                className="w-24 h-24 object-contain mb-4 rounded"
              />
              <h2 className="text-lg font-bold text-center">
                {currentLanguage === "en" ? product.name : product.name_ar}
              </h2>
              <p className="font-bold text-blue-600 mt-2">
                SAR {product.price}
              </p>
              <button
                onClick={() => addToCart(product)}
                className="mt-2 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                Add to Cart
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </>
  );
};

export default Home;
