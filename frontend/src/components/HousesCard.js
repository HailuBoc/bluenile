"use client";

import Link from "next/link";
import {
  Heart,
  Star,
  StarHalf,
  Star as StarOutline,
  MapPin,
} from "lucide-react";
import { useLike } from "../../lib/useLike";

export default function HouseCard({
  _id,
  imageUrl,
  img,
  propertyName,
  address,
  price,
  rating = 0,
  guestFavorite,
}) {
  const { liked, likes, toggleLike } = useLike(0, _id);

  const baseUrl = "https://bluenile.onrender.com";
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
    : img || "/placeholder-house.jpg";

  // ⭐ Render stars visually
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
          <div className="absolute top-2 left-2 text-xs bg-rose-100 dark:bg-rose-800 text-rose-500 dark:text-white px-2 py-0.5 rounded-full z-10 shadow-sm">
            Guest Favorite
          </div>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            toggleLike();
          }}
          className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-900 rounded-full z-10 shadow-sm flex items-center gap-1"
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
          alt={propertyName || "House"}
          className="w-full h-32 sm:h-40 object-cover group-hover:scale-105 transition-transform"
        />

        <div className="p-3 sm:p-4">
          <div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-300">
            <MapPin className="h-4 w-4 mr-1 text-gray-400" />
            {address || "No address"}
          </div>

          <div className="font-semibold text-sm sm:text-base truncate">
            {propertyName || "Unnamed House"}
          </div>

          {/* ⭐ Visual star rating */}
          <div className="flex items-center mt-1 space-x-1">
            {renderStars(rating)}
            <span className="text-xs text-gray-500 dark:text-gray-300 ml-1">
              ({rating.toFixed(1)})
            </span>
          </div>

          <div className="mt-1 sm:mt-2 font-bold text-sm sm:text-base">
            {price} Br
          </div>
        </div>
      </div>
    </Link>
  );
}
