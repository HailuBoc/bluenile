"use client";

import Link from "next/link";
import {
  Star,
  StarHalf,
  Star as StarOutline,
  MapPin,
} from "lucide-react";
import LikeButton from "./LikeButton";

export default function ProductCard({
  _id,
  imageUrl,
  img,
  propertyName,
  address,
  price,
  rating = 0,
  guestFavorite,
  liked = false,
  likes = 0,
}) {

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
    : img || "/placeholder-product.jpg";

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
      href={`/sections/products?id=${_id}`}
      className="block transform scale-90 sm:scale-100"
    >
      <div className="relative bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl shadow hover:shadow-lg transition-all overflow-hidden group cursor-pointer">
        {guestFavorite && (
          <div className="absolute top-2 left-2 text-xs bg-rose-100 dark:bg-rose-800 text-rose-500 dark:text-white px-2 py-0.5 rounded-full z-10 shadow-sm">
            Guest Favorite
          </div>
        )}

        {/* ❤️ Like Button */}
        <LikeButton
          itemId={_id}
          itemType="product"
          initialLiked={liked}
          initialLikes={likes}
          size="small"
          className="absolute top-2 right-2 z-10"
        />

        {/* Product Image */}
        <img
          src={imageSrc}
          alt={propertyName || "Product"}
          className="w-full h-32 sm:h-40 object-cover group-hover:scale-105 transition-transform"
        />

        {/* Details */}
        <div className="p-3 sm:p-4">
          <div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-300">
            <MapPin className="h-4 w-4 mr-1 text-gray-400" />
            {address || "No address"}
          </div>

          <div className="font-semibold text-sm sm:text-base truncate mt-1">
            {propertyName || "Unnamed Property"}
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
