"use client";

import { useSearchParams } from "next/navigation";
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
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import AnimatedCard from "../../../components/AnimatedCard";
import CustomButton from "../../../components/CustomButton";
import DarkModeToggle from "../../../components/DarkModeToggle";
import Footer from "../../../components/Footer";
import { DarkModeProvider } from "../../../contexts/DarkModeContext";
import { useSession } from "next-auth/react";
import axios from "axios";

function CarDetailContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const idParam = searchParams.get("id");
  const priceParam = searchParams.get("price");
  const BASE_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "https://bluenile.onrender.com";

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch product details
  useEffect(() => {
    if (!idParam) {
      setSelectedProduct(null);
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/admin/properties/${idParam}`);
        const product = res.data;

        const rawImages = Array.isArray(product.imageUrl)
          ? product.imageUrl
          : typeof product.imageUrl === "string" && product.imageUrl
          ? [product.imageUrl]
          : [];

        const images = rawImages
          .filter(Boolean)
          .map((img) =>
            img.startsWith("http")
              ? img
              : `${BASE_URL}${img.startsWith("/") ? "" : "/"}${img}`
          );

        const imageSrc = images[0] || null;

        setSelectedProduct({
          ...product,
          imageUrl: imageSrc,
          images,
          name: product.carName || product.propertyName || "Car",
          location: product.location || product.address || product.city || "No location",
        });
        setActiveImageIndex(0);

        if (session?.user?.id) {
          try {
            const likeRes = await axios.get(
              `${BASE_URL}/carslike/${idParam}?userId=${session.user.id}`
            );
            setLiked(likeRes.data.userLiked || false);
            setLikesCount(likeRes.data.likes || 0);
          } catch (likeErr) {
            console.error("❌ Error fetching like status:", likeErr);
            setLiked(false);
            setLikesCount(product.likes || 0);
          }
        } else {
          setLiked(false);
          setLikesCount(product.likes || 0);
        }

        setError(null);
      } catch (err) {
        console.error("❌ Error fetching product:", err);
        setError("Failed to load product.");
        setSelectedProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [idParam, BASE_URL, session?.user?.id]);

  // Handle like toggle
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
      setLikesCount((prev) => (newLiked ? prev + 1 : Math.max(prev - 1, 0)));

      const res = await axios.post(`${BASE_URL}/carslike/${idParam}/like`, {
        userId: session.user.id,
      });

      setLiked(res.data.userLiked ?? newLiked);
      setLikesCount(
        res.data.likes ?? (newLiked ? likesCount + 1 : likesCount - 1)
      );
    } catch (err) {
      console.error("❌ Failed to like car:", err);
      setLiked((prev) => !prev);
      setLikesCount((prev) => (liked ? Math.max(prev - 1, 0) : prev + 1));
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch (err) {
      console.error("❌ Failed to copy link:", err);
    }
  };

  const imageUrls = useMemo(() => {
    if (!selectedProduct) return [];
    if (
      Array.isArray(selectedProduct.images) &&
      selectedProduct.images.length > 0
    )
      return selectedProduct.images;
    return selectedProduct.imageUrl ? [selectedProduct.imageUrl] : [];
  }, [selectedProduct]);

  const activeImage = imageUrls[activeImageIndex] || imageUrls[0] || null;

  const displayedPrice =
    priceParam ||
    selectedProduct?.offerPrice ||
    selectedProduct?.price ||
    "Price not available";

  // Render stars
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
        <p className="text-lg">Loading car...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );

  if (!selectedProduct) {
    return (
      <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <main className="flex-grow flex items-center justify-center">
          <p className="text-lg">Product not found.</p>
        </main>
        <Footer />
      </div>
    );
  }

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
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Car Details
              </h1>
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-center gap-3"
            >
              <Link
                href="/"
                className="hidden sm:flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Home className="w-4 h-4" />
                Home
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
              {selectedProduct.name}
            </h2>
            <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm sm:text-base">
                  {selectedProduct.location}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {renderStars(selectedProduct.rating || 0)}
                <span className="text-sm">({selectedProduct.rating?.toFixed(1) || "N/A"})</span>
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
                    alt={selectedProduct.name}
                    className="w-full h-44 sm:h-64 object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="w-full h-44 sm:h-64 bg-gray-100 dark:bg-gray-800" />
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
                    onClick={handleLike}
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

                {selectedProduct.guestFavorite && (
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
                {selectedProduct.description || "No description available."}
              </p>
            </AnimatedCard>

            <AnimatedCard className="p-4" hoverEffect={false}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Car Rental Highlights
              </h3>
              <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                <li className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400 flex-shrink-0" />
                  <span>Unlimited Mileage</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400 flex-shrink-0" />
                  <span>Comprehensive Insurance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400 flex-shrink-0" />
                  <span>Roadside Assistance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400 flex-shrink-0" />
                  <span>Flexible Booking Options</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400 flex-shrink-0" />
                  <span>Free Cancellation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400 flex-shrink-0" />
                  <span>Latest Car Models</span>
                </li>
              </ul>
            </AnimatedCard>
          </div>

          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24 space-y-5">
              <AnimatedCard className="p-4" hoverEffect={false}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Price
                    </div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                      {typeof displayedPrice === "string"
                        ? displayedPrice
                        : `${displayedPrice} Br`}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {selectedProduct.serviceType || selectedProduct.listingType || ""}
                  </div>
                </div>

                <div className="mt-4">
                  <CustomButton
                    href={`/sections/rentalCars/reserveRental?id=${selectedProduct._id}&price=${encodeURIComponent(
                      String(displayedPrice)
                    )}`}
                    variant="primary"
                    size="sm"
                    className="w-full"
                  >
                    Rent Now
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
                      selectedProduct.location || "Ethiopia"
                    )}&output=embed`}
                    className="w-full h-48"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
                <div className="mt-3">
                  <CustomButton
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      selectedProduct.location || "Ethiopia"
                    )}`}
                    variant="ghost"
                    size="sm"
                    className="w-full"
                  >
                    Open in Google Maps
                  </CustomButton>
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

export default function CarDetailPage() {
  return (
    <DarkModeProvider>
      <CarDetailContent />
    </DarkModeProvider>
  );
}
