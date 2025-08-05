"use client";
import { useState } from "react";
import { Heart, Star } from "lucide-react";

export default function ProductCard({
  image,
  title,
  location,
  price,
  rating,
  guestFavorite,
}) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="relative bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl shadow hover:shadow-lg transition-all overflow-hidden group">
      {/* Like Button */}
      <button
        onClick={() => setLiked(!liked)}
        className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-900 rounded-full z-10"
      >
        <Heart
          className={`h-5 w-5 ${
            liked ? "text-red-500 fill-red-500" : "text-gray-500"
          }`}
        />
      </button>

      <img
        src={image}
        alt={title}
        className="w-full h-40 object-cover group-hover:scale-105 transition-transform"
      />

      <div className="p-4">
        <div className="text-sm text-gray-500 dark:text-gray-300">
          {location}
        </div>
        <div className="font-semibold">{title}</div>
        <div className="flex items-center text-sm mt-1">
          <Star className="h-4 w-4 text-yellow-400" />
          <span className="ml-1">{rating}</span>
          {guestFavorite && (
            <span className="ml-2 text-xs bg-rose-100 dark:bg-rose-800 text-rose-500 dark:text-white px-2 py-0.5 rounded-full">
              Guest Favorite
            </span>
          )}
        </div>
        <div className="mt-2 font-bold">{price}</div>
      </div>
    </div>
  );
}
