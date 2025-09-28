"use client";

import Link from "next/link";
import {
  Heart,
  Star,
  StarHalf,
  Star as StarOutline,
  Crown,
  MapPin,
} from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

export default function SpecialOfferCard({
  _id,
  imageUrl,
  img,
  propertyName,
  address,
  price,
  rating = 0,
}) {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  // ✅ Fetch initial likes
  useEffect(() => {
    async function fetchLikes() {
      try {
        const res = await axios.get(`${BASE_URL}/productlike/${_id}`);
        setLikes(res.data.likes || 0);
      } catch (err) {
        console.error("❌ Failed to fetch product likes:", err);
      }
    }
    fetchLikes();
  }, [_id, BASE_URL]);

  // ✅ Handle like/unlike
  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const newLiked = !liked;
      setLikes((prev) => (newLiked ? prev + 1 : Math.max(prev - 1, 0)));
      setLiked(newLiked);

      const res = await axios.post(`${BASE_URL}/productlike/${_id}/like`, {
        liked: newLiked,
      });
      setLikes(res.data.likes);
    } catch (err) {
      console.error("❌ Failed to like product:", err);
      setLiked((prev) => !prev);
      setLikes((prev) => (liked ? Math.max(prev - 1, 0) : prev + 1));
    }
  };

  // ✅ Handle image
  const firstImage =
    Array.isArray(imageUrl) && imageUrl.length > 0
      ? imageUrl[0]
      : typeof imageUrl === "string"
      ? imageUrl
      : null;

  const imageSrc = firstImage
    ? firstImage.startsWith("http")
      ? firstImage
      : `${BASE_URL}${firstImage.startsWith("/") ? "" : "/"}${firstImage}`
    : img || "/placeholder-product.jpg";

  // ✅ Render stars
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i)
        stars.push(<Star key={i} className="h-4 w-4 text-yellow-400" />);
      else if (rating >= i - 0.5)
        stars.push(<StarHalf key={i} className="h-4 w-4 text-yellow-400" />);
      else
        stars.push(<StarOutline key={i} className="h-4 w-4 text-gray-400" />);
    }
    return stars;
  };

  return (
    <Link href={`/sections/products?id=${_id}`} className="block">
      <div className="relative bg-gradient-to-br from-yellow-50 to-white dark:from-gray-800 dark:to-gray-900 text-gray-800 dark:text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all overflow-hidden border border-yellow-400">
        {/* ⭐ Special Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1 text-xs font-bold bg-yellow-300 text-yellow-900 px-2 py-1 rounded-full z-10 shadow">
          <Crown className="h-4 w-4" />
          Top Picked
        </div>

        {/* ❤️ Like Button */}
        <button
          onClick={handleLike}
          className="absolute top-3 right-3 p-2 bg-white dark:bg-gray-900 rounded-full z-10 shadow-md flex items-center gap-1"
        >
          <Heart
            className={`h-5 w-5 transition-colors duration-200 ${
              liked ? "text-red-500 fill-red-500" : "text-gray-500"
            }`}
          />
          <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
            {likes}
          </span>
        </button>

        {/* Product Image */}
        <img
          src={imageSrc}
          alt={propertyName || "Special Offer"}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform ring-2 ring-yellow-400"
        />

        {/* Details */}
        <div className="p-5">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <MapPin className="h-4 w-4 mr-1 text-gray-400" />
            {address || "No address"}
          </div>

          <div className="font-bold text-lg mt-2 text-yellow-800 dark:text-yellow-300 truncate">
            {propertyName || "Unnamed Property"}
          </div>

          <div className="flex items-center mt-2 space-x-1">
            {renderStars(rating)}
            <span className="text-xs text-gray-500 dark:text-gray-300 ml-1">
              ({rating.toFixed(1)})
            </span>
          </div>

          {price && (
            <div className="mt-3 font-extrabold text-xl text-yellow-700 dark:text-yellow-200">
              {price} Br
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
