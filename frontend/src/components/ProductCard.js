"use client";

import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { useState } from "react";

export default function ProductCard({
  id,
  img,
  title,
  location,
  price,
  rating,
  guestFavorite,
}) {
  const [liked, setLiked] = useState(false);

  return (
    <Link
      href={`/products?id=${id}`}
      className="block transform scale-90 sm:scale-100" // Smaller on mobile, normal on desktop
    >
      <div className="relative bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl shadow hover:shadow-lg transition-all overflow-hidden group cursor-pointer">
        {guestFavorite && (
          <div className="absolute top-2 left-2 text-xs bg-rose-100 dark:bg-rose-800 text-rose-500 dark:text-white px-2 py-0.5 rounded-full z-10 shadow-sm">
            Guest Favorite
          </div>
        )}
        <button
          onClick={(e) => {
            e.preventDefault(); // prevent Link navigation on like toggle
            setLiked(!liked);
          }}
          className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-900 rounded-full z-10 shadow-sm"
          aria-label={liked ? "Unlike" : "Like"}
        >
          <Heart
            className={`h-5 w-5 ${
              liked ? "text-red-500 fill-red-500" : "text-gray-500"
            }`}
          />
        </button>

        <img
          src={img}
          alt={title}
          className="w-full h-32 sm:h-40 object-cover group-hover:scale-105 transition-transform" // shorter image on mobile
        />

        <div className="p-3 sm:p-4">
          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-300">
            {location}
          </div>
          <div className="font-semibold text-sm sm:text-base truncate">
            {title}
          </div>
          <div className="flex items-center text-xs sm:text-sm mt-1">
            <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400" />
            <span className="ml-1">{rating}</span>
          </div>
          <div className="mt-1 sm:mt-2 font-bold text-sm sm:text-base">
            {price}
          </div>
        </div>
      </div>
    </Link>
  );
}
