"use client";

import Link from "next/link";
import {
  Star,
  StarHalf,
  Star as StarOutline,
  MapPin,
} from "lucide-react";
import LikeButton from "./LikeButton";

export default function CarsCard({
  _id,
  propertyName,
  address,
  imageUrl,
  price,
  rating = 0,
  guestFavorite,
  likes = 0,
  liked = false,
}) {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

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
    : "/placeholder-car.jpg";

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
    <Link
      href={`/sections/rentalCars?id=${_id}`}
      className="block transform scale-90 sm:scale-100"
    >
      <div className="relative bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl shadow hover:shadow-lg transition-all overflow-hidden group cursor-pointer">
        {guestFavorite && (
          <div className="absolute top-2 left-2 text-xs bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-white px-2 py-0.5 rounded-full z-10 shadow-sm">
            Top Pick
          </div>
        )}

        {/* ❤️ Like Button */}
        <LikeButton
          itemId={_id}
          itemType="car"
          initialLiked={liked}
          initialLikes={likes}
          className="absolute top-2 right-2 z-10"
        />

        {/* Car Image */}
        <img
          src={imageSrc}
          alt={propertyName || "Car"}
          className="w-full h-32 sm:h-40 object-cover group-hover:scale-105 transition-transform"
        />

        {/* Details */}
        <div className="p-3 sm:p-4">
          <div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-300">
            <MapPin className="h-4 w-4 mr-1 text-gray-400" />
            {address || "No address"}
          </div>

          <div className="font-semibold text-sm sm:text-base truncate mt-1">
            {propertyName || "Unnamed Car"}
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
