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
import LikeButton from "../../../components/LikeButton";
import { useSession } from "next-auth/react";
import axios from "axios";

export default function TourismPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const idParam = searchParams.get("id");
  const BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:10000";

  const [tourism, setTourism] = useState(null);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tourism details
  useEffect(() => {
    if (!idParam) return;

    const fetchTourism = async () => {
      try {
        setLoading(true);
        // Fetch tourism property details
        const res = await axios.get(`${BASE_URL}/admin/properties/${idParam}`);
        const data = res.data;

        const firstImage =
          Array.isArray(data.imageUrl) && data.imageUrl.length > 0
            ? data.imageUrl[0]
            : typeof data.imageUrl === "string"
            ? data.imageUrl
            : null;

        const imageSrc = firstImage
          ? firstImage.startsWith("http")
            ? firstImage
            : `${BASE_URL}${firstImage.startsWith("/") ? "" : "/"}${firstImage}`
          : null;

        setTourism({ ...data, imageUrl: imageSrc });
        setError(null);
      } catch (err) {
        console.error("❌ Error fetching tourism:", err);
        setError("Failed to load tourism.");
        setTourism(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTourism();
  }, [idParam, BASE_URL]);

  // Fetch likes for this tourism property
  useEffect(() => {
    if (!idParam) return;

    const fetchLikes = async () => {
      try {
        const userId = session?.user?.id;
        const query = userId ? `?userId=${userId}` : "";
        const res = await axios.get(`${BASE_URL}/tourismlike/${idParam}${query}`);
        setLikes(res.data.likes || 0);
        setLiked(res.data.userLiked || false);
      } catch (err) {
        console.error("❌ Failed to fetch tourism likes:", err);
      }
    };

    fetchLikes();
  }, [idParam, BASE_URL, session]);

  // Toggle like
  const handleLike = async () => {
    // Check if user is authenticated
    if (!session?.user?.id) {
      // Redirect to login with return URL
      const currentPath = window.location.pathname + window.location.search;
      window.location.href = `/auth/login?callbackUrl=${encodeURIComponent(currentPath)}`;
      return;
    }
    
    try {
      const newLiked = !liked;
      setLiked(newLiked);
      setLikes((prev) => (newLiked ? prev + 1 : Math.max(prev - 1, 0)));

      const res = await axios.post(`${BASE_URL}/tourismlike/${idParam}/like`, {
        userId: session.user.id,
      });

      setLikes(res.data.likes);
      setLiked(res.data.userLiked);
    } catch (err) {
      console.error("❌ Failed to like tourism:", err);
      setLiked((prev) => !prev);
      setLikes((prev) => (liked ? Math.max(prev - 1, 0) : prev + 1));
    }
  };

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

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <p className="text-lg">Loading tourism...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  if (!tourism) {
    return (
      <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <main className="flex-grow flex items-center justify-center">
          <p className="text-lg">Tourism not found.</p>
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
              src={tourism.imageUrl}
              alt={tourism.propertyName || "Tourism"}
              className="w-full h-full object-cover rounded-xl"
              style={{ minHeight: "400px" }}
            />
            <button
              onClick={handleLike}
              className="absolute top-4 right-4 bg-white dark:bg-gray-800 p-2 rounded-full shadow hover:scale-105 transition-transform"
              aria-pressed={liked}
              aria-label={liked ? "Unlike tourism" : "Like tourism"}
            >
              <Heart
                className={`w-6 h-6 ${
                  liked ? "text-red-500 fill-red-500" : "text-gray-500"
                }`}
              />
              <span className="ml-1 text-sm font-semibold">{likes}</span>
            </button>
            {tourism.guestFavorite && (
              <div className="absolute top-4 left-4 text-sm bg-rose-200 dark:bg-rose-800 text-rose-700 dark:text-white px-3 py-1 rounded-full shadow">
                Guest Favorite
              </div>
            )}
          </div>

          {/* Right side - Details */}
          <div className="md:w-1/2 flex flex-col justify-start">
            <h1 className="text-3xl font-bold mb-2">{tourism.propertyName}</h1>
            <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
              <MapPin className="h-5 w-5 mr-1 text-gray-400" />
              <span>{tourism.address || "No address"}</span>
            </div>
            <div className="flex items-center mb-2 space-x-1">
              {renderStars(tourism.rating || 0)}
              <span className="text-sm text-gray-500 dark:text-gray-300">
                ({tourism.rating?.toFixed(1) || "N/A"})
              </span>
            </div>
            <div className="text-xl font-semibold mb-4">
              {tourism.price ? `${tourism.price} Br` : "Price not available"}
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-semibold mt-4 sm:mt-6 mb-2 sm:mb-3 text-gray-900 dark:text-white">
                Tour Highlights
              </h2>
              <ul className="grid grid-cols-2 gap-2 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                <li>✔ Guided Tours</li>
                <li>✔ Local Cuisine Experiences</li>
                <li>✔ Cultural Activities</li>
                <li>✔ Scenic Views</li>
                <li>✔ Transportation Included</li>
                <li>✔ 24/7 Travel Support</li>
              </ul>
            </div>

            <Link href={`/sections/tourism/reserveTour?id=${tourism._id}`}>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition duration-200 mt-6">
                Book Now
              </button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
