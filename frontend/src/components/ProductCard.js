"use client";

import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { useState } from "react";

export default function ProductCard({
  _id,
  imageUrl, // string, array, or undefined
  img,
  propertyName,
  address,
  price,
  rating = 4.5,
  guestFavorite,
  initialLikes = 0,
}) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);

  const toggleLike = (e) => {
    e.preventDefault();
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
    setLiked(!liked);
  };

  const baseUrl = "http://localhost:10000";
  const firstImage =
    Array.isArray(imageUrl) && imageUrl.length > 0
      ? imageUrl[0]
      : typeof imageUrl === "string"
      ? imageUrl
      : null;

  const imageSrc = firstImage
    ? firstImage.startsWith("http")
      ? firstImage
      : `${baseUrl}${firstImage.startsWith("/") ? "" : "/"}${firstImage}`
    : img || "/placeholder-product.jpg";

  return (
    <Link
      href={`/sections/products?id=${_id}`}
      className="block transform scale-90 sm:scale-100"
    >
      <div className="relative bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl shadow hover:shadow-lg transition-all overflow-hidden group cursor-pointer">
        {guestFavorite && (
          <div className="absolute top-2 left-2 text-xs bg-rose-100 dark:bg-rose-800 text-rose-500 dark:text-white px-2 py-0.5 rounded-full z-10 shadow-sm">
            Guest Favorite
          </div>
        )}

        <button
          onClick={toggleLike}
          className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-900 rounded-full z-10 shadow-sm flex items-center gap-1"
          aria-label={liked ? "Unlike" : "Like"}
        >
          <Heart
            className={`h-5 w-5 transition-colors duration-200 ${
              liked ? "text-red-500 fill-red-500" : "text-gray-500"
            }`}
          />
          <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded-full">
            {likes}
          </span>
        </button>

        <img
          src={imageSrc}
          alt={propertyName || "Product"}
          className="w-full h-32 sm:h-40 object-cover group-hover:scale-105 transition-transform"
        />

        <div className="p-3 sm:p-4">
          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-300">
            {address || "No address"}
          </div>
          {/* ✅ Show real property name */}
          <div className="font-semibold text-sm sm:text-base truncate">
            {propertyName || "Unnamed Property"}
          </div>
          <div className="flex items-center text-xs sm:text-sm mt-1">
            <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400" />
            <span className="ml-1">{rating}</span>
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
