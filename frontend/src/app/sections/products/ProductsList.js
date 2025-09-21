"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Star, StarHalf, Heart, MapPin } from "lucide-react";
import Link from "next/link";
import Footer from "../../../components/Footer";
import axios from "axios";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const idParam = searchParams.get("id");
  const BASE_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:10000";

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch product details
  useEffect(() => {
    if (!idParam) {
      setSelectedProduct(null);
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/admin/properties/${idParam}`);
        const product = res.data;

        let firstImage =
          Array.isArray(product.imageUrl) && product.imageUrl.length > 0
            ? product.imageUrl[0]
            : typeof product.imageUrl === "string"
            ? product.imageUrl
            : null;

        const imageSrc = firstImage
          ? firstImage.startsWith("http")
            ? firstImage
            : `${BASE_URL}${firstImage.startsWith("/") ? "" : "/"}${firstImage}`
          : null;

        setSelectedProduct({ ...product, imageUrl: imageSrc });
        setError(null);
      } catch (err) {
        console.error("❌ Error fetching product:", err);
        setError("Failed to load product.");
        setSelectedProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [idParam, BASE_URL]);

  // Fetch likes
  useEffect(() => {
    if (!idParam) return;

    const fetchLikes = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/productlike/${idParam}`);
        setLikes(res.data.likes || 0);
        setLiked(res.data.userLiked || false);
      } catch (err) {
        console.error("❌ Failed to fetch product likes:", err);
      }
    };

    fetchLikes();
  }, [idParam, BASE_URL]);

  // Handle like toggle
  const handleLike = async () => {
    try {
      const newLiked = !liked;
      setLiked(newLiked);
      setLikes((prev) => (newLiked ? prev + 1 : Math.max(prev - 1, 0)));

      const res = await axios.post(`${BASE_URL}/productlike/${idParam}/like`, {
        liked: newLiked,
      });

      setLikes(res.data.likes);
      setLiked(res.data.userLiked);
    } catch (err) {
      console.error("❌ Failed to like product:", err);
      setLiked((prev) => !prev);
      setLikes((prev) => (liked ? Math.max(prev - 1, 0) : prev + 1));
    }
  };

  // Render stars
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i)
        stars.push(<Star key={i} className="h-5 w-5 text-yellow-400" />);
      else if (rating >= i - 0.5)
        stars.push(<StarHalf key={i} className="h-5 w-5 text-yellow-400" />);
      else stars.push(<Star key={i} className="h-5 w-5 text-gray-400" />);
    }
    return stars;
  };

  if (loading)
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <p className="text-lg">Loading product...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );

  if (!selectedProduct)
    return (
      <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <main className="flex-grow flex items-center justify-center">
          <p className="text-lg">Product not found.</p>
        </main>
        <Footer />
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <main className="flex-grow p-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left side - Image */}
          <div className="md:w-1/2 relative rounded-xl overflow-hidden shadow-lg">
            {selectedProduct.imageUrl && (
              <img
                src={selectedProduct.imageUrl}
                alt={selectedProduct.propertyName || "Property"}
                className="w-full h-full object-cover rounded-xl"
                style={{ minHeight: "400px" }}
              />
            )}

            <button
              onClick={handleLike}
              className="absolute top-4 right-4 bg-white dark:bg-gray-800 p-2 rounded-full shadow flex items-center gap-1"
            >
              <Heart
                className={`w-6 h-6 ${
                  liked ? "text-red-500 fill-red-500" : "text-gray-500"
                }`}
              />
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded-full">
                {likes}
              </span>
            </button>

            {selectedProduct.guestFavorite && (
              <div className="absolute top-4 left-4 text-sm bg-rose-200 dark:bg-rose-800 text-rose-700 dark:text-white px-3 py-1 rounded-full shadow">
                Guest Favorite
              </div>
            )}
          </div>

          {/* Right side - Details */}
          <div className="md:w-1/2 flex flex-col justify-start">
            <h1 className="text-3xl font-bold mb-2">
              {selectedProduct.propertyName}
            </h1>

            {/* Location */}
            <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
              <MapPin className="h-5 w-5 mr-1 text-gray-400" />
              <span>{selectedProduct.address || "No address"}</span>
            </div>

            {/* Rating */}
            <div className="flex items-center mb-2 space-x-1">
              {renderStars(selectedProduct.rating || 0)}
              <span className="text-sm text-gray-500 dark:text-gray-300">
                ({selectedProduct.rating?.toFixed(1) || "N/A"})
              </span>
            </div>

            {/* Price */}
            <div className="text-xl font-semibold mb-4">
              {selectedProduct.price
                ? `${selectedProduct.price} Br`
                : "Price not available"}
            </div>

            {/* Description */}
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              {selectedProduct.description || "No description available."}
            </p>

            {/* Highlights */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mt-4 sm:mt-6 mb-2 sm:mb-3 text-gray-900 dark:text-white">
                Stay Highlights
              </h2>
              <ul className="grid grid-cols-2 gap-2 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                <li>✔ Free Wi-Fi</li>
                <li>✔ Spacious Living Area</li>
                <li>✔ Fully Equipped Kitchen</li>
                <li>✔ Private Balcony / Terrace</li>
                <li>✔ Air Conditioning</li>
                <li>✔ 24/7 Support</li>
              </ul>
            </div>

            <Link
              href={`/sections/products/reserveProducts?id=${selectedProduct._id}`}
            >
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition duration-200 mt-6">
                Reserve Now
              </button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
