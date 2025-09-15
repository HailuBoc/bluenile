"use client";

import Link from "next/link";
import {
  Heart,
  Star,
  StarHalf,
  Star as StarOutline,
  MapPin,
} from "lucide-react";
import { useState } from "react";
import axios from "axios";

export default function CarsCard({
  _id,
  imageUrl,
  propertyName,
  address,
  price,
  rating = 0,
  guestFavorite,
  initialLikes = 0,
}) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);

  const toggleLike = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`http://localhost:10000/cars/${_id}/like`);
      setLikes(res.data.likes); // update likes count from backend
      setLiked(!liked);
    } catch (err) {
      console.error("Failed to like car:", err);
    }
  };

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
    : "/placeholder-car.jpg";

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
      className="block relative transform scale-95 sm:scale-100"
    >
      {guestFavorite && (
        <div className="absolute top-2 left-2 text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full z-10 shadow-sm">
          Top Pick
        </div>
      )}

      <button
        onClick={toggleLike}
        className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-900 rounded-full z-10 shadow-md flex items-center gap-1"
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

      <img
        src={imageSrc}
        alt={propertyName}
        className="w-full h-40 sm:h-52 object-cover group-hover:scale-105 transition-transform"
      />

      <div className="p-4">
        <div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-300">
          <MapPin className="h-4 w-4 mr-1 text-gray-400" />
          {address}
        </div>

        <div className="font-semibold text-base sm:text-lg truncate mt-1">
          {propertyName}
        </div>

        <div className="flex items-center mt-2 space-x-1">
          {renderStars(rating)}
          <span className="text-xs text-gray-500 dark:text-gray-300 ml-1">
            ({rating.toFixed(1)})
          </span>
        </div>

        {price && (
          <div className="mt-2 font-bold text-sm sm:text-base">{price} Br</div>
        )}
      </div>
    </Link>
  );
}
