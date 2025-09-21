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

  // ✅ Fetch initial likes from backend
  useEffect(() => {
    async function fetchLikes() {
      try {
        const res = await axios.get(`${BASE_URL}/houselike/${_id}`);
        setLikes(res.data.likes || 0);
        setLiked(res.data.userLiked || false); // in case backend supports it later
      } catch (err) {
        console.error("❌ Failed to fetch house likes:", err);
      }
    }
    fetchLikes();
  }, [_id, BASE_URL]);

  // ✅ Handle like click
  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const newLiked = !liked;

      // Optimistic UI update
      setLikes((prev) => (newLiked ? prev + 1 : Math.max(prev - 1, 0)));
      setLiked(newLiked);

      // Send to backend
      const res = await axios.post(`${BASE_URL}/houselike/${_id}/like`, {
        liked: newLiked,
      });

      // Sync with backend response
      setLikes(res.data.likes);
      setLiked(res.data.userLiked ?? newLiked);
    } catch (err) {
      console.error("❌ Failed to like house:", err);

      // rollback if failed
      setLiked((prev) => !prev);
      setLikes((prev) => (liked ? Math.max(prev - 1, 0) : prev + 1));
    }
  };

  // ✅ Handle image (string or array)
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
      className="block relative transform scale-95 sm:scale-100"
    >
      {guestFavorite && (
        <div className="absolute top-2 left-2 text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full z-10 shadow-sm">
          Top Pick
        </div>
      )}

      {/* ❤️ Like Button */}
      <button
        onClick={handleLike}
        className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-900 rounded-full z-10 shadow-md flex items-center gap-1"
      >
        <Heart
          className={`h-5 w-5 ${liked ? "text-red-500" : "text-gray-500"}`}
          fill={liked ? "red" : "none"}
          strokeWidth={2}
        />
        <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
          {likes}
        </span>
      </button>

      {/* 🏠 Image */}
      <img
        src={imageSrc}
        alt={propertyName}
        className="w-full h-40 sm:h-52 object-cover group-hover:scale-105 transition-transform"
      />

      {/* 📋 Details */}
      <div className="p-4">
        <div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-300">
          <MapPin className="h-4 w-4 mr-1 text-gray-400" />
          {address}
        </div>

        <div className="font-semibold text-base sm:text-lg truncate mt-1">
          {propertyName}
        </div>

        <div className="flex items-center mt-2 space-x-1">
          {renderStars(rating)}
          <span className="text-xs text-gray-500 dark:text-gray-300 ml-1">
            ({rating.toFixed(1)})
          </span>
        </div>

        {price && (
          <div className="mt-2 font-bold text-sm sm:text-base">{price} Br</div>
        )}
      </div>
    </Link>
  );
}
