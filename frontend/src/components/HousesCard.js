"use client";

import Link from "next/link";
import {
  Heart,
  Star,
  StarHalf,
  Star as StarOutline,
  MapPin,
} from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

export default function HousesCard({
  _id,
  propertyName,
  address,
  imageUrl,
  price,
  rating = 0,
  guestFavorite,
}) {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  // ✅ Fetch initial likes
  useEffect(() => {
    async function fetchLikes() {
      try {
        const res = await axios.get(`${BASE_URL}/houselike/${_id}`);
        setLikes(res.data.likes || 0);
        setLiked(res.data.userLiked || false);
      } catch (err) {
        console.error("❌ Failed to fetch house likes:", err);
      }
    }
    fetchLikes();
  }, [_id, BASE_URL]);

  // ✅ Handle like toggle
  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const newLiked = !liked;
      setLikes((prev) => (newLiked ? prev + 1 : Math.max(prev - 1, 0)));
      setLiked(newLiked);

      const res = await axios.post(`${BASE_URL}/houselike/${_id}/like`, {
        liked: newLiked,
      });

      setLikes(res.data.likes);
      setLiked(res.data.userLiked ?? newLiked);
    } catch (err) {
      console.error("❌ Failed to like house:", err);
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
    : "/placeholder-house.jpg";

  // ✅ Star renderer
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
    <Link
      href={`/sections/houses?id=${_id}`}
      className="block transform scale-90 sm:scale-100"
    >
      <div className="relative bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl shadow hover:shadow-lg transition-all overflow-hidden group cursor-pointer">
        {guestFavorite && (
          <div className="absolute top-2 left-2 text-xs bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-white px-2 py-0.5 rounded-full z-10 shadow-sm">
            Top Pick
          </div>
        )}

        {/* ❤️ Like Button */}
        <button
          onClick={handleLike}
          className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-900 rounded-full z-10 shadow-sm flex items-center gap-1"
        >
          <Heart
            className={`h-5 w-5 transition-colors duration-200 ${
              liked ? "text-red-500 fill-red-500" : "text-gray-500"
            }`}
          />
          <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded-full">
            {likes}
          </span>
        </button>

        {/* 🏠 Image */}
        <img
          src={imageSrc}
          alt={propertyName || "House"}
          className="w-full h-32 sm:h-40 object-cover group-hover:scale-105 transition-transform"
        />

        {/* 📋 Details */}
        <div className="p-3 sm:p-4">
          <div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-300">
            <MapPin className="h-4 w-4 mr-1 text-gray-400" />
            {address || "No address"}
          </div>

          <div className="font-semibold text-sm sm:text-base truncate mt-1">
            {propertyName || "Unnamed House"}
          </div>

          <div className="flex items-center mt-2 space-x-1">
            {renderStars(rating)}
            <span className="text-xs text-gray-500 dark:text-gray-300 ml-1">
              ({rating.toFixed(1)})
            </span>
          </div>

          {price && (
            <div className="mt-1 sm:mt-2 font-bold text-sm sm:text-base">
              {price} Br
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
