"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Star,
  StarHalf,
  Star as StarOutline,
  Heart,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import Footer from "../../../components/Footer";
import axios from "axios";

export default function HouseDetailPage() {
  const searchParams = useSearchParams();
  const idParam = searchParams.get("id");

  const [selectedHouse, setSelectedHouse] = useState(null);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!idParam) {
      setSelectedHouse(null);
      setLoading(false);
      return;
    }

    const fetchHouse = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:10000/admin/properties/${idParam}`
        );
        const house = res.data;

        const baseUrl = "http://localhost:10000";
        let firstImage =
          Array.isArray(house.imageUrl) && house.imageUrl.length > 0
            ? house.imageUrl[0]
            : typeof house.imageUrl === "string"
            ? house.imageUrl
            : null;

        const imageSrc = firstImage
          ? firstImage.startsWith("http")
            ? firstImage
            : `${baseUrl}${firstImage.startsWith("/") ? "" : "/"}${firstImage}`
          : null;

        setSelectedHouse({ ...house, imageUrl: imageSrc });
        setError(null);
      } catch (err) {
        console.error("❌ Error fetching house:", err);
        setError("Failed to load house.");
        setSelectedHouse(null);
      } finally {
        setLoading(false);
      }
    };

    fetchHouse();
  }, [idParam]);

  // ⭐ Render visual stars
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i)
        stars.push(<Star key={i} className="h-5 w-5 text-yellow-400" />);
      else if (rating >= i - 0.5)
        stars.push(<StarHalf key={i} className="h-5 w-5 text-yellow-400" />);
      else
        stars.push(<StarOutline key={i} className="h-5 w-5 text-gray-400" />);
    }
    return stars;
  };

  if (loading)
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <p className="text-lg">Loading house...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );

  if (!selectedHouse) {
    return (
      <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <main className="flex-grow flex items-center justify-center">
          <p className="text-lg">House not found.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <main className="flex-grow p-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left side - Image */}
          <div className="md:w-1/2 relative rounded-xl overflow-hidden shadow-lg">
            <img
              src={selectedHouse.imageUrl}
              alt={selectedHouse.propertyName || "House"}
              className="w-full h-full object-cover rounded-xl"
              style={{ minHeight: "400px" }}
            />
            <button
              onClick={() => setLiked(!liked)}
              className="absolute top-4 right-4 bg-white dark:bg-gray-800 p-2 rounded-full shadow"
              aria-pressed={liked}
              aria-label={liked ? "Unlike house" : "Like house"}
            >
              <Heart
                className={`w-6 h-6 ${
                  liked ? "text-red-500 fill-red-500" : "text-gray-500"
                }`}
              />
            </button>
            {selectedHouse.guestFavorite && (
              <div className="absolute top-4 left-4 text-sm bg-blue-600 text-white px-3 py-1 rounded-full shadow">
                Top Pick
              </div>
            )}
          </div>

          {/* Right side - Details */}
          <div className="md:w-1/2 flex flex-col justify-start">
            <h1 className="text-3xl font-bold mb-2">
              {selectedHouse.propertyName}
            </h1>

            {/* ⭐ Location */}
            <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
              <MapPin className="h-5 w-5 mr-1 text-gray-400" />
              <span>{selectedHouse.address || "No address"}</span>
            </div>

            {/* ⭐ Visual Rating */}
            <div className="flex items-center mb-2 space-x-1">
              {renderStars(selectedHouse.rating || 0)}
              <span className="text-sm text-gray-500 dark:text-gray-300">
                ({selectedHouse.rating?.toFixed(1) || "N/A"})
              </span>
            </div>

            {/* ⭐ Price */}
            <div className="text-xl font-semibold mb-4">
              {selectedHouse.offerPrice
                ? `${selectedHouse.offerPrice} Br`
                : "Price not available"}
            </div>

            {/* ⭐ House Features */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mt-4 sm:mt-6 mb-2 sm:mb-3 text-gray-900 dark:text-white">
                House Features
              </h2>
              <ul className="grid grid-cols-2 gap-2 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                <li>✔ Spacious Bedrooms</li>
                <li>✔ Modern Kitchen</li>
                <li>✔ Private Garden</li>
                <li>✔ Secure Neighborhood</li>
                <li>✔ Nearby Schools & Shops</li>
                <li>✔ Parking / Garage</li>
              </ul>
            </div>

            {/* ⭐ Reserve Button */}
            <Link
              href={`/sections/houses/reserveHouse?id=${selectedHouse._id}`}
            >
              <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition duration-200">
                Reserve Now
              </button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
