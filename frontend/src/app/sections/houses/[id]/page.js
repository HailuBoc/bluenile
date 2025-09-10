"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { Star, Heart } from "lucide-react";
import Link from "next/link";
import Footer from "../../../../components/Footer";

export default function HouseDetailPage() {
  const { id } = useParams();
  const [house, setHouse] = useState(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (!id) return;

    axios
      .get(`http://localhost:10000/api/houses/${id}`) // ✅ correct URL
      .then((res) => setHouse(res.data))
      .catch((err) => console.error("Error fetching house:", err));
  }, [id]);

  if (!house) {
    return (
      <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <main className="flex-grow flex items-center justify-center">
          <p className="text-lg">House not found.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const baseUrl = "http://localhost:10000";
  const firstImage = Array.isArray(house.imageUrl)
    ? house.imageUrl[0]
    : house.imageUrl;
  const imageSrc = firstImage
    ? firstImage.startsWith("http")
      ? firstImage
      : `${baseUrl}/${firstImage}`
    : "/placeholder-house.jpg";

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <main className="flex-grow p-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/2 relative rounded-xl overflow-hidden shadow-lg">
            <img
              src={imageSrc}
              alt={house.houseTitle}
              className="w-full h-full object-cover rounded-xl"
              style={{ minHeight: "400px" }}
            />
            <button
              onClick={() => setLiked(!liked)}
              className="absolute top-4 right-4 bg-white dark:bg-gray-800 p-2 rounded-full shadow"
            >
              <Heart
                className={`w-6 h-6 ${
                  liked ? "text-red-500 fill-red-500" : "text-gray-500"
                }`}
              />
            </button>
          </div>

          <div className="md:w-1/2 flex flex-col justify-start">
            <h1 className="text-3xl font-bold mb-2">{house.houseTitle}</h1>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              {house.address}
            </p>
            <div className="flex items-center mb-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="ml-1">{house.rating || 4.5}</span>
            </div>
            <div className="text-xl font-semibold mb-4">
              {house.offerPrice} Br
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              {house.description}
            </p>

            <Link href={`/sections/houses/reserveHouse?id=${house._id}`}>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition duration-200">
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
