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

export default function CarsPage() {
  const searchParams = useSearchParams();
  const idParam = searchParams.get("id");
  const BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:10000";

  const [selectedCar, setSelectedCar] = useState(null);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [error, setError] = useState(null);

  // Fetch car details
  useEffect(() => {
    if (!idParam) return;

    const fetchCar = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/admin/properties/${idParam}`);
        const firstImage =
          Array.isArray(res.data.imageUrl) && res.data.imageUrl.length > 0
            ? res.data.imageUrl[0]
            : typeof res.data.imageUrl === "string"
            ? res.data.imageUrl
            : null;

        const imageSrc = firstImage
          ? firstImage.startsWith("http")
            ? firstImage
            : `${BASE_URL}${firstImage.startsWith("/") ? "" : "/"}${firstImage}`
          : null;

        setSelectedCar({ ...res.data, imageUrl: imageSrc });
        setError(null);
      } catch (err) {
        console.error("❌ Error fetching car:", err);
        setError("Car not found or failed to load.");
      }
    };

    fetchCar();
  }, [idParam, BASE_URL]);

  // Fetch likes
  useEffect(() => {
    if (!idParam) return;

    const fetchLikes = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/cars/${idParam}`);
        setLikes(res.data.likes || 0);
        setLiked(res.data.userLiked || false);
      } catch (err) {
        console.error("❌ Failed to fetch car likes:", err);
      }
    };

    fetchLikes();
  }, [idParam, BASE_URL]);

  // Handle like toggle
  const handleLike = async () => {
    try {
      const newLiked = !liked;
      setLiked(newLiked);
      setLikes((prev) => (newLiked ? prev + 1 : Math.max(prev - 1, 0)));

      const res = await axios.post(`${BASE_URL}/cars/${idParam}/like`, {
        liked: newLiked,
      });

      setLikes(res.data.likes);
      setLiked(res.data.userLiked);
    } catch (err) {
      console.error("❌ Failed to like car:", err);
      setLiked((prev) => !prev);
      setLikes((prev) => (liked ? Math.max(prev - 1, 0) : prev + 1));
    }
  };

  // Render stars
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i)
        stars.push(<Star key={i} className="h-6 w-6 text-yellow-400" />);
      else if (rating >= i - 0.5)
        stars.push(<StarHalf key={i} className="h-6 w-6 text-yellow-400" />);
      else
        stars.push(<StarOutline key={i} className="h-6 w-6 text-gray-400" />);
    }
    return stars;
  };

  if (!selectedCar) {
    return (
      <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <main className="flex-grow flex items-center justify-center">
          <p className="text-lg">{error || "Loading car..."}</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <main className="flex-grow px-4 sm:px-6 lg:px-8 py-10 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left - Car Image */}
          <div className="md:w-1/2 relative rounded-2xl overflow-hidden shadow-xl">
            <img
              src={selectedCar.imageUrl}
              alt={selectedCar.carName || selectedCar.propertyName}
              className="w-full h-full object-cover rounded-2xl"
              style={{ minHeight: "420px", maxHeight: "550px" }}
            />
            <button
              onClick={handleLike}
              className="absolute top-4 right-4 bg-white dark:bg-gray-800 p-3 rounded-full shadow-md hover:scale-105 transition-transform"
              aria-pressed={liked}
              aria-label={liked ? "Unlike car" : "Like car"}
            >
              <Heart
                className={`w-7 h-7 ${
                  liked ? "text-red-500 fill-red-500" : "text-gray-500"
                }`}
              />
              <span className="ml-1 text-sm font-semibold">{likes}</span>
            </button>
            {selectedCar.guestFavorite && (
              <div className="absolute top-4 left-4 text-sm bg-rose-200 dark:bg-rose-800 text-rose-700 dark:text-white px-4 py-1.5 rounded-full shadow-md">
                Popular Choice
              </div>
            )}
          </div>

          {/* Right - Car Details */}
          <div className="md:w-1/2 flex flex-col justify-start">
            <h1 className="text-4xl font-extrabold tracking-tight mb-3">
              {selectedCar.carName || selectedCar.propertyName}
            </h1>

            <div className="flex items-center text-gray-600 dark:text-gray-300 mb-3">
              <MapPin className="h-6 w-6 mr-2 text-gray-400" />
              <span>
                {selectedCar.location || selectedCar.address || "No location"}
              </span>
            </div>

            <div className="flex items-center mb-3 space-x-1">
              {renderStars(selectedCar.rating || 0)}
              <span className="text-lg font-medium text-gray-500 dark:text-gray-300">
                ({selectedCar.rating?.toFixed(1) || "N/A"})
              </span>
            </div>

            <div className="text-xl font-semibold mb-4">
              {selectedCar.price
                ? `${selectedCar.price} ETB`
                : "Price not available"}
            </div>

            {/* Car Features */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mt-4 sm:mt-6 mb-2 sm:mb-3 text-gray-900 dark:text-white">
                Car Features
              </h2>
              <ul className="grid grid-cols-2 gap-2 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                <li>✔ Low Mileage</li>
                <li>✔ Accident Free</li>
                <li>✔ Full Service History</li>
                <li>✔ Fuel Efficient</li>
                <li>✔ Air Conditioning</li>
                <li>✔ Modern Safety Features</li>
              </ul>
            </div>

            {/* Buy Button */}
            <Link href={`/sections/saleCar/reserveSale?id=${selectedCar._id}`}>
              <button className="mt-6 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl shadow-md transition duration-200">
                Buy Now
              </button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
