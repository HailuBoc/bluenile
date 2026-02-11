"use client";

import Link from "next/link";
import {
  Star,
  StarHalf,
  Star as StarOutline,
  Crown,
  MapPin,
} from "lucide-react";

export default function SpecialOfferCard({
  _id,
  imageUrl,
  propertyName,
  address,
  price,
  rating = 0,
}) {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  const imageSrc = imageUrl
    ? imageUrl.startsWith("http")
      ? imageUrl
      : `${BASE_URL}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`
    : "/placeholder-product.jpg";

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
      href={`/sections/specialOffer?id=${_id}`}
      className="block transform scale-90 sm:scale-100"
    >
      <div className="relative bg-gradient-to-br from-yellow-50 to-white dark:from-gray-800 dark:to-gray-900 text-gray-800 dark:text-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 ease-in-out overflow-hidden group cursor-pointer hover:-translate-y-1">
        {/* 🏆 Top badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1 text-xs font-bold bg-yellow-300 text-yellow-900 px-2 py-1 rounded-full z-10 shadow">
          <Crown className="h-4 w-4" /> Top Rated
        </div>

        {/* Image */}
        <img
          src={imageSrc}
          alt={propertyName || "Special Offer"}
          className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out ring-1 ring-yellow-300"
        />

        {/* Content */}
        <div className="p-4 sm:p-5">
          <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-300">
            <MapPin className="h-4 w-4 mr-1 text-gray-400" />{" "}
            {address || "No address"}
          </div>

          <div className="font-bold text-base sm:text-lg mt-2 text-yellow-800 dark:text-yellow-300 truncate">
            {propertyName || "Unnamed Property"}
          </div>

          <div className="flex items-center mt-2 space-x-1">
            {renderStars(rating)}
            <span className="text-xs text-gray-500 dark:text-gray-300 ml-1">
              ({rating.toFixed(1)})
            </span>
          </div>

          {price && (
            <div className="mt-3 font-extrabold text-lg sm:text-xl text-yellow-700 dark:text-yellow-200">
              {price} Br
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
