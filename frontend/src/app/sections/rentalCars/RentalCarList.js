"use client";

import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import {
  Heart,
  Home,
  Link as LinkIcon,
  MapPin,
  Sparkles,
  Star,
  Star as StarOutline,
  StarHalf,
  Car,
  Calendar,
  Clock,
  Fuel,
  Settings,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import AnimatedCard from "../../../components/AnimatedCard";
import CustomButton from "../../../components/CustomButton";
import DarkModeToggle from "../../../components/DarkModeToggle";
import Footer from "../../../components/Footer";
import { DarkModeProvider } from "../../../contexts/DarkModeContext";
import axios from "axios";

function RentalCarDetailContent() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const idParam = searchParams.get("id");
  const BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://bluenile.onrender.com";

  const [selectedCar, setSelectedCar] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch car details
  useEffect(() => {
    if (!idParam) {
      setSelectedCar(null);
      setLoading(false);
      return;
    }

    const fetchCar = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/admin/properties/${idParam}`);
        const car = res.data;

        const rawImages = Array.isArray(car.imageUrl)
          ? car.imageUrl
          : typeof car.imageUrl === "string"
          ? [car.imageUrl]
          : [];

        const images = rawImages
          .filter(Boolean)
          .map((img) =>
            img.startsWith("http")
              ? img
              : `${BASE_URL}${img.startsWith("/") ? "" : "/"}${img}`
          );

        const imageSrc = images[0] || null;

        setSelectedCar({
          ...car,
          imageUrl: imageSrc,
          images,
        });
        setActiveImageIndex(0);
        setError(null);
      } catch (err) {
        console.error("❌ Error fetching rental car:", err);
        setError("Failed to load car details.");
        setSelectedCar(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [idParam, BASE_URL]);

  // Fetch likes
  useEffect(() => {
    if (!idParam) return;

    const fetchLikes = async () => {
      try {
        const userId = session?.user?.id;
        const query = userId ? `?userId=${userId}` : "";
        const res = await axios.get(`${BASE_URL}/rentalcarlike/${idParam}${query}`);
        setLikesCount(res.data.likes || 0);
        setLiked(res.data.userLiked || false);
      } catch (err) {
        console.error("❌ Failed to fetch rental car likes:", err);
      }
    };

    fetchLikes();
  }, [idParam, BASE_URL, session]);

  // Toggle like function
  const handleToggleLike = async () => {
    if (!selectedCar) return;
    
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
      setLikesCount((prev) => (newLiked ? prev + 1 : Math.max(prev - 1, 0)));

      const res = await axios.post(`${BASE_URL}/rentalcarlike/${idParam}/like`, {
        userId: session.user.id,
      });

      setLiked(res.data.userLiked ?? newLiked);
      setLikesCount(
        res.data.likes ?? (newLiked ? likesCount + 1 : likesCount - 1)
      );
    } catch (err) {
      console.error("❌ Failed to toggle rental car like:", err);
      // rollback
      setLiked((prev) => !prev);
      setLikesCount((prev) => (liked ? Math.max(prev - 1, 0) : prev + 1));
    }
  };

  // Render stars
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (rating >= i)
            stars.push(<Star key={i} className="h-5 w-5 text-yellow-400" />);
        else if (rating >= i - 0.5)
            stars.push(<StarHalf key={i} className="h-5 w-5 text-yellow-400" />);
        else stars.push(<StarOutline key={i} className="h-5 w-5 text-gray-400" />);
    }
    return stars;
  };

  const imageUrls = useMemo(() => {
    if (!selectedCar) return [];
    if (Array.isArray(selectedCar.images) && selectedCar.images.length > 0)
      return selectedCar.images;
    return selectedCar.imageUrl ? [selectedCar.imageUrl] : [];
  }, [selectedCar]);

  const activeImage = imageUrls[activeImageIndex] || imageUrls[0] || null;

  const displayedPrice =
    selectedCar?.offerPrice ||
    selectedCar?.price ||
    "Price not available";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch (err) {
      console.error("❌ Failed to copy link:", err);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col min-h-screen items-center justify-center p-4">
        <p className="text-lg">Loading rental car details...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col min-h-screen items-center justify-center p-4">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );

  if (!selectedCar)
    return (
      <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <main className="flex-grow flex items-center justify-center">
          <p className="text-lg">Rental car not found.</p>
        </main>
        <Footer />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <motion.nav
        className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-3">
            <motion.div
              className="flex items-center gap-3"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Car Rental Details
              </h1>
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-center gap-3"
            >
              <Link
                href="/transport"
                className="hidden sm:flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Home className="w-4 h-4" />
                Back to Transport
              </Link>
              <DarkModeToggle />
            </motion.div>
          </div>
        </div>
      </motion.nav>

      <motion.header
        className="relative overflow-hidden py-10 sm:py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-emerald-500/10 dark:from-blue-500/20 dark:via-purple-500/20 dark:to-emerald-500/20" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.25 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {selectedCar.propertyName || selectedCar.name}
            </h2>
            <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm sm:text-base">
                  {selectedCar.address || "No address"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {renderStars(selectedCar.rating || 0)}
                <span className="text-sm">
                  ({selectedCar.rating?.toFixed(1) || "N/A"})
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.header>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7 space-y-5">
            <AnimatedCard className="p-3 sm:p-4" hoverEffect={false}>
              <div className="relative rounded-xl overflow-hidden">
                {activeImage ? (
                  <img
                    src={activeImage}
                    alt={selectedCar.propertyName || selectedCar.name || "Rental Car"}
                    className="w-full h-44 sm:h-64 object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="w-full h-44 sm:h-64 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <Car className="w-16 h-16 text-gray-400" />
                  </div>
                )}

                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <button
                    onClick={handleCopyLink}
                    className="bg-white/90 hover:bg-white text-gray-800 p-1.5 rounded-full shadow"
                    aria-label="Copy link"
                    type="button"
                  >
                    <LinkIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleToggleLike}
                    className="bg-white/90 hover:bg-white p-1.5 rounded-full shadow flex items-center"
                    aria-pressed={liked}
                    aria-label={liked ? "Unlike" : "Like"}
                    type="button"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        liked ? "text-red-500 fill-red-500" : "text-gray-500"
                      }`}
                    />
                    <span className="ml-1 text-xs font-semibold text-gray-700">
                      {likesCount}
                    </span>
                  </button>
                </div>

                {selectedCar.guestFavorite && (
                  <div className="absolute top-3 left-3 text-xs bg-blue-600 text-white px-2 py-1 rounded-full shadow">
                    Top Pick
                  </div>
                )}
              </div>

              {imageUrls.length > 1 && (
                <div className="mt-4 grid grid-cols-5 sm:grid-cols-6 gap-2">
                  {imageUrls.slice(0, 6).map((src, idx) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`rounded-lg overflow-hidden border transition ${
                        idx === activeImageIndex
                          ? "border-blue-500"
                          : "border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                      }`}
                      aria-label={`View image ${idx + 1}`}
                    >
                      <img
                        src={src}
                        alt=""
                        className="w-full h-9 object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </button>
                  ))}
                </div>
              )}
            </AnimatedCard>

            <AnimatedCard className="p-4" hoverEffect={false}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Overview
              </h3>
              <p className="mt-3 text-gray-700 dark:text-gray-300 leading-relaxed">
                {selectedCar.description || "No description available."}
              </p>
            </AnimatedCard>

            <AnimatedCard className="p-4" hoverEffect={false}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Car Features
              </h3>
              <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                {(Array.isArray(selectedCar.facilities) &&
                selectedCar.facilities.length > 0
                  ? selectedCar.facilities
                  : [
                      "✔ Air conditioning",
                      "✔ GPS navigation",
                      "✔ Bluetooth connectivity",
                      "✔ USB charging ports",
                      "✔ Insurance included",
                      "✔ 24/7 roadside assistance",
                    ]
                ).map((f, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400 flex-shrink-0" />
                    <span>{String(f).replace(/^\s*[✔•\-]\s*/, "")}</span>
                  </li>
                ))}
              </ul>
            </AnimatedCard>

            <AnimatedCard className="p-4" hoverEffect={false}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Vehicle Specifications
              </h3>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300 text-sm">
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4" />
                  <span className="font-medium">Make:</span>
                  <span>{selectedCar.make || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  <span className="font-medium">Model:</span>
                  <span>{selectedCar.model || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">Year:</span>
                  <span>{selectedCar.year || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Fuel className="w-4 h-4" />
                  <span className="font-medium">Fuel Type:</span>
                  <span>{selectedCar.fuelType || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  <span className="font-medium">Transmission:</span>
                  <span>{selectedCar.transmission || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span className="font-medium">Seats:</span>
                  <span>{selectedCar.seats || "N/A"}</span>
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard className="p-4" hoverEffect={false}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Rental Terms
              </h3>
              <div className="mt-3 space-y-3 text-gray-700 dark:text-gray-300 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">Minimum Rental:</span>
                  <span>{selectedCar.minRental || "1 day"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Fuel className="w-4 h-4" />
                  <span className="font-medium">Fuel Policy:</span>
                  <span>{selectedCar.fuelPolicy || "Full-to-full"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span className="font-medium">Insurance:</span>
                  <span>{selectedCar.insurance || "Included"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span className="font-medium">Mileage Limit:</span>
                  <span>{selectedCar.mileageLimit || "Unlimited"}</span>
                </div>
              </div>
            </AnimatedCard>
          </div>

          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24 space-y-5">
              <AnimatedCard className="p-4" hoverEffect={false}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Daily Rate
                    </div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                      {typeof displayedPrice === "string"
                        ? displayedPrice
                        : `${displayedPrice} Br`}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      per day
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {selectedCar.serviceType ||
                      selectedCar.listingType ||
                      "For Rent"}
                  </div>
                </div>

                <div className="mt-4">
                  <CustomButton
                    href={`/sections/rentalCars/reserveRental?id=${selectedCar._id}`}
                    variant="primary"
                    size="sm"
                    className="w-full"
                  >
                    Book Now
                  </CustomButton>
                </div>
              </AnimatedCard>

              <AnimatedCard className="p-4" hoverEffect={false}>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  Location
                </h3>
                <div className="mt-3 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                  <iframe
                    title="Car Location"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(
                      selectedCar.address || "Ethiopia"
                    )}&output=embed`}
                    className="w-full h-48"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
                <div className="mt-3">
                  <CustomButton
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      selectedCar.address || "Ethiopia"
                    )}`}
                    variant="ghost"
                    size="sm"
                    className="w-full"
                  >
                    Open in Google Maps
                  </CustomButton>
                </div>
              </AnimatedCard>

              <AnimatedCard className="p-4" hoverEffect={false}>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  Rental Information
                </h3>
                <div className="mt-3 space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Free cancellation up to 24h</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>No hidden fees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Comprehensive insurance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>24/7 customer support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Multiple payment options</span>
                  </div>
                </div>
              </AnimatedCard>

              <AnimatedCard className="p-4" hoverEffect={false}>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  Owner Information
                </h3>
                <div className="mt-3 space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Verified Owner</span>
                    <span className="text-green-500">✓</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Response Time:</span>
                    <span>Usually within 30 minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Member Since:</span>
                    <span>{new Date(selectedCar.createdAt).getFullYear()}</span>
                  </div>
                </div>
              </AnimatedCard>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function RentalCarPage() {
  return (
    <DarkModeProvider>
      <RentalCarDetailContent />
    </DarkModeProvider>
  );
}
