import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ukFlag from "../assets/pics/ukflag.png";
import ksaFlag from "../assets/pics/ksa.webp";
import { FaSearch, FaShoppingCart } from "react-icons/fa";

const images = import.meta.glob("../assets/product_pictures/*", {
  eager: true,
});

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [cart, setCart] = useState(() => {
    const userId = localStorage.getItem("userId");
    return JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
  });
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const userId = localStorage.getItem("userId");

  const toggleLanguage = () => {
    setCurrentLanguage((prev) => (prev === "en" ? "ar" : "en"));
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem(`cart_${userId}`);
    navigate("/signin");
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
  }, [API_BASE_URL]);

  const filteredProducts = products.filter((product) => {
    const name = currentLanguage === "en" ? product.name : product.name_ar;
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getImage = (imagePath) => {
    const imageName = imagePath.split("/").pop();
    const match = Object.keys(images).find((key) => key.includes(imageName));
    return match ? images[match].default : "";
  };

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item._id === product._id);
    let updatedCart;

    if (existingItem) {
      updatedCart = cart.map((item) =>
        item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }

    setCart(updatedCart);
    localStorage.setItem(`cart_${userId}`, JSON.stringify(updatedCart));
  };

  const getProductQuantity = (productId) => {
    const item = cart.find((item) => item._id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <>
      {/* Navbar */}
      <nav className="bg-[#11454A] text-white p-4 sticky top-0 shadow-md z-50">
        <div className="w-full flex flex-wrap items-center justify-between gap-y-4 gap-x-6">
          <div>
            <h1 className="text-[24px] sm:text-[28px] md:text-[36px] font-bold italic" style={{ fontFamily: "Poppins, sans-serif" }}>
              Retail Connect
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3 justify-end">
            <button onClick={toggleLanguage} className="text-sm sm:text-base font-medium bg-white text-[#11454A] px-3 py-1 rounded-full hover:bg-gray-200">
              <motion.span key={currentLanguage} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
                {currentLanguage === "en" ? "ع" : "En"}
              </motion.span>
            </button>

            <motion.img
              key={currentLanguage}
              src={currentLanguage === "en" ? ksaFlag : ukFlag}
              alt={currentLanguage === "en" ? "UK Flag" : "KSA Flag"}
              className="w-7 h-7 rounded-full"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            />

            <button onClick={() => navigate("/cart" )} className="text-sm sm:text-base bg-yellow-500 text-white px-3 py-2 rounded-full hover:bg-yellow-600 flex items-center gap-2">
              <FaShoppingCart />
              <span>Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
            </button>

            <button onClick={handleSignOut} className="text-sm sm:text-base bg-red-600 text-white px-3 py-2 rounded-full hover:bg-red-700">
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Search Bar */}
      <div className="w-full max-w-2xl mx-auto px-4 py-4">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            className="w-full text-sm sm:text-base px-4 py-2 pl-10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
          />
          <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      {/* Product List or Loading Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 px-4 pb-10">
        {loading ? (
          Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="animate-pulse bg-white rounded-lg p-4 shadow-md">
              <div className="w-full h-24 bg-gray-300 rounded mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-green-300 rounded w-full"></div>
            </div>
          ))
        ) : (
          filteredProducts.map((product) => (
            <motion.div
              key={product._id}
              className="relative flex flex-col items-center border rounded-lg shadow-md p-4 bg-white hover:shadow-lg transition"
              whileHover={{ scale: 1.05, transition: { duration: 0.3, ease: "easeInOut" } }}
            >
              <img
                src={getImage(product.image)}
                alt={product.name}
                className="w-20 h-20 sm:w-24 sm:h-24 object-contain mb-4 rounded"
              />
              <h2 className="text-center text-sm sm:text-base font-semibold">
                {currentLanguage === "en" ? product.name : product.name_ar}
              </h2>
              <p className="font-bold text-blue-600 mt-2 text-sm sm:text-base">
                SAR {product.price}
              </p>
              <button
                onClick={() => addToCart(product)}
                className="mt-2 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
              >
                Add to Cart
              </button>
              {getProductQuantity(product._id) > 0 && (
                <span className="absolute bottom-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                  {getProductQuantity(product._id)} 
                </span>
              )}
            </motion.div>
          ))
        )}
      </div>
    </>
  );
};

export default Home;
