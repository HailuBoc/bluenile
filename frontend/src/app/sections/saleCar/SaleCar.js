"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Star, Heart } from "lucide-react";
import Link from "next/link";
import Footer from "../../../components/Footer";
import carlisting from "../../../components/listingCar";

export default function CarsPage() {
  const searchParams = useSearchParams();
  const idParam = searchParams.get("id");

  const [selectedCar, setSelectedCar] = useState(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (idParam) {
      const car = carlisting.find((p) => p.id === parseInt(idParam));
      setSelectedCar(car || null);
      setLiked(false);
    } else {
      setSelectedCar(null);
    }
  }, [idParam]);

  if (!selectedCar) {
    return (
      <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <main className="flex-grow flex items-center justify-center">
          <p className="text-lg">Car not found.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Main Content */}
      <main className="flex-grow px-4 sm:px-6 lg:px-8 py-10 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left side - Car Image */}
          <div className="md:w-1/2 relative rounded-2xl overflow-hidden shadow-xl">
            <img
              src={selectedCar.img}
              alt={selectedCar.title}
              className="w-full h-full object-cover rounded-2xl"
              style={{ minHeight: "420px", maxHeight: "550px" }}
            />
            <button
              onClick={() => setLiked(!liked)}
              className="absolute top-4 right-4 bg-white dark:bg-gray-800 p-3 rounded-full shadow-md hover:scale-105 transition-transform"
              aria-pressed={liked}
              aria-label={liked ? "Unlike car" : "Like car"}
            >
              <Heart
                className={`w-7 h-7 ${
                  liked ? "text-red-500 fill-red-500" : "text-gray-500"
                }`}
              />
            </button>
            {selectedCar.guestFavorite && (
              <div className="absolute top-4 left-4 text-sm bg-rose-200 dark:bg-rose-800 text-rose-700 dark:text-white px-4 py-1.5 rounded-full shadow-md">
                Popular Choice
              </div>
            )}
          </div>

          {/* Right side - Car Details */}
          <div className="md:w-1/2 flex flex-col justify-start">
            <h1 className="text-4xl font-extrabold tracking-tight mb-3">
              {selectedCar.title}
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-300 mb-3">
              📍 {selectedCar.location}
            </p>
            <div className="flex items-center mb-3">
              <Star className="w-6 h-6 text-yellow-400" />
              <span className="ml-2 text-lg font-medium">
                {selectedCar.rating}
              </span>
            </div>
            <div className="text-2xl font-bold mb-5 text-green-600 dark:text-green-400">
              {selectedCar.price}
            </div>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
              {selectedCar.description}
            </p>

            <Link href={`/sections/saleCar/reserveSale?id=${selectedCar.id}`}>
              <button
                type="button"
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-xl shadow-md transition duration-200"
              >
                Buy Now
              </button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer always pinned at bottom */}
      <Footer />
    </div>
  );
}
