"use client";

import Link from "next/link";
import { Heart, Star, MapPin } from "lucide-react";
import { useState } from "react";

export default function CarCard({
  id,
  img,
  title,
  location,
  price,
  rating,
  guestFavorite,
  initialLikes = 0,
}) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);

  const toggleLike = (e) => {
    e.preventDefault(); // prevent Link navigation
    if (liked) {
      setLikes((prev) => prev - 1);
    } else {
      setLikes((prev) => prev + 1);
    }
    setLiked(!liked);
  };

  return (
    <Link
      href={`/sections/saleCar?id=${id}`}
      className="block transform scale-95 sm:scale-100"
    >
      <div className="relative bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl shadow hover:shadow-lg transition-all overflow-hidden group cursor-pointer">
        {/* Top Pick Badge */}
        {guestFavorite && (
          <div className="absolute top-2 left-2 text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full z-10 shadow-sm">
            Top Pick
          </div>
        )}

        {/* Like button */}
        <button
          onClick={toggleLike}
          className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-900 rounded-full z-10 shadow-md flex items-center gap-1"
          aria-label={liked ? "Unlike" : "Like"}
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

        {/* Car Image with Price Tag */}
        <div className="relative">
          <img
            src={img}
            alt={title}
            className="w-full h-40 sm:h-52 object-cover group-hover:scale-105 transition-transform"
          />
          <div className="absolute bottom-2 left-2 bg-green-600 text-white text-xs sm:text-sm font-bold px-3 py-1 rounded-lg shadow-md">
            {price}
          </div>
        </div>

        {/* Car Info */}
        <div className="p-4">
          <div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-300">
            <MapPin className="h-4 w-4 mr-1 text-gray-400" />
            {location}
          </div>
          <div className="font-semibold text-base sm:text-lg truncate mt-1">
            {title}
          </div>

          {/* Rating */}
          <div className="flex items-center text-xs sm:text-sm mt-2">
            <Star className="h-4 w-4 text-yellow-400" />
            <span className="ml-1">{rating}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
