"use client";

import Link from "next/link";
import { Star, StarHalf, MapPin } from "lucide-react";
import LikeButton from "./LikeButton";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react"; // Added for authentication

export default function HousesCard({
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
  const { data: session } = useSession();
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const [imageSrc, setImageSrc] = useState("/placeholder-house.jpg");
  const [imageError, setImageError] = useState(false);

  // Process image URL
  useEffect(() => {
    if (imageUrl) {
      const firstImage = Array.isArray(imageUrl) && imageUrl.length > 0 
        ? imageUrl[0] 
        : typeof imageUrl === "string" 
        ? imageUrl 
        : null;

      if (firstImage) {
        if (firstImage.startsWith("http")) {
          setImageSrc(firstImage);
        } else {
          const formattedBaseUrl = BASE_URL.endsWith("/") ? BASE_URL.slice(0, -1) : BASE_URL;
          const formattedImagePath = firstImage.startsWith("/") ? firstImage : `/${firstImage}`;
          setImageSrc(`${formattedBaseUrl}${formattedImagePath}`);
        }
      }
    }
  }, [imageUrl, BASE_URL]);

  // Star renderer function
  const renderStars = (ratingValue) => {
    const stars = [];
    const fullStars = Math.floor(ratingValue);
    const hasHalfStar = ratingValue % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star
            key={i}
            className="h-4 w-4 fill-yellow-400 text-yellow-400"
            size={16}
          />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <StarHalf
            key={i}
            className="h-4 w-4 fill-yellow-400 text-yellow-400"
            size={16}
          />
        );
      } else {
        stars.push(
          <Star
            key={i}
            className="h-4 w-4 text-gray-300 dark:text-gray-600"
            fill="none"
            size={16}
          />
        );
      }
    }
    return stars;
  };

  return (
    <Link
      href={`/sections/houses?id=${_id}`}
      className="block transform transition-transform hover:scale-[0.92] sm:hover:scale-[1.02] scale-90 sm:scale-100"
    >
      <div className="relative bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer w-full">
        {guestFavorite && (
          <div className="absolute top-2 left-2 text-xs font-semibold bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-100 px-2.5 py-1 rounded-full z-10 shadow-md">
            Top Pick
          </div>
        )}

        <LikeButton
          itemId={_id}
          itemType="property"
          initialLiked={liked}
          initialLikes={likes}
          className="absolute top-2 right-2 z-10"
        />

        {/* Image Container */}
        <div className="relative w-full h-40 sm:h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
          {!imageError ? (
            <img
              src={imageSrc}
              alt={propertyName || "House"}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-gray-400 dark:text-gray-500">
                <div className="text-center">
                  <div className="text-lg">🏠</div>
                  <div className="text-xs mt-1">No Image</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Details Container */}
        <div className="p-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-1">
            <MapPin className="h-4 w-4 mr-1.5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
            <span className="truncate">{address || "Address not available"}</span>
          </div>

          <h3 className="font-bold text-lg truncate mb-2">
            {propertyName || "Unnamed Property"}
          </h3>

          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {renderStars(rating)}
              <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                {rating.toFixed(1)}
              </span>
            </div>
          </div>

          {price && (
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
              <div className="font-bold text-xl text-gray-900 dark:text-white">
                {typeof price === "number" ? `${price.toLocaleString()} Br` : `${price} Br`}
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">per night</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}