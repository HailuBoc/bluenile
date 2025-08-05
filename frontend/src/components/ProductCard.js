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
    <div className="relative bg-white rounded-xl shadow-md hover:shadow-xl hover:scale-[1.02] transition-transform duration-300 overflow-hidden group">
      {/* Like Button */}
      <button
        onClick={() => setLiked(!liked)}
        className="absolute top-2 right-2 z-10 text-gray-700 hover:text-red-500 transition-colors duration-200"
      >
        <Heart
          className={`h-6 w-6 ${
            liked ? "fill-red-500 text-red-500" : "fill-transparent"
          } transition-all duration-300`}
        />
      </button>

      {/* Guest Favorite Badge */}
      {guestFavorite && (
        <div className="absolute top-2 left-2 bg-white text-xs text-red-500 px-2 py-1 rounded-full shadow font-semibold opacity-90 group-hover:opacity-100 transition-opacity duration-300">
          Guest favorite
        </div>
      )}

      {/* Image */}
      <img
        src={image}
        alt={title}
        className="w-full h-44 sm:h-52 object-cover group-hover:opacity-95 transition-opacity duration-300"
      />

      {/* Info Section */}
      <div className="p-3 sm:p-4 space-y-1">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-sm sm:text-base text-gray-800">
            {title}
          </h3>
          <div className="flex items-center gap-1 text-yellow-500 text-xs sm:text-sm">
            <Star className="h-4 w-4 fill-yellow-500" />
            <span className="text-gray-700">{rating}</span>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-gray-500">{location}</p>
        <p className="text-sm font-medium text-gray-900">{price}</p>
      </div>
    </div>
  );
}
