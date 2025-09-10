"use client";

import Link from "next/link";
import { Heart, Star, MapPin } from "lucide-react";
import { useState } from "react";

export default function CarCard({
  _id,
  imageUrl, // can be string, array, or undefined
  img, // fallback demo
  propertyName, // ✅ real name from admin (e.g. Land Cruiser)
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

  // ----------------------------
  // Build a safe image URL
  // ----------------------------
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
    : img || "/placeholder-car.jpg";

  return (
    <Link
      href={`/sections/saleCar?id=${_id}`}
      className="block transform scale-95 sm:scale-100"
    >
      <div className="relative bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl shadow hover:shadow-lg transition-all overflow-hidden group cursor-pointer">
        {guestFavorite && (
          <div className="absolute top-2 left-2 text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full z-10 shadow-sm">
            Top Pick
          </div>
        )}

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

        <div className="relative">
          <img
            src={imageSrc}
            alt={propertyName}
            className="w-full h-40 sm:h-52 object-cover group-hover:scale-105 transition-transform"
          />
          {price && (
            <div className="absolute bottom-2 left-2 bg-green-600 text-white text-xs sm:text-sm font-bold px-3 py-1 rounded-lg shadow-md">
              {price} Br
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-300">
            <MapPin className="h-4 w-4 mr-1 text-gray-400" />
            {address || "No address"}
          </div>
          {/* ✅ Show the real name (Land Cruiser) */}
          <div className="font-semibold text-base sm:text-lg truncate mt-1">
            {propertyName}
          </div>
          <div className="flex items-center text-xs sm:text-sm mt-2">
            <Star className="h-4 w-4 text-yellow-400" />
            <span className="ml-1">{rating}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
