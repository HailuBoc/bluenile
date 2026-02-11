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
  StarHalf,
  Star as StarOutline,
} from "lucide-react";
import Link from "next/link";
import axios from "axios";

function SpecialOfferDetailContent() {
  // ALL HOOKS - ALWAYS CALLED IN SAME ORDER, NO EXCEPTIONS
  const searchParams = useSearchParams();
  const idParam = searchParams.get("id");
  const priceParam = searchParams.get("price");
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:10000";

  // State hooks - ALWAYS CALLED
  const [offer, setOffer] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoized values - ALWAYS CALLED
  const imageUrls = useMemo(() => {
    if (!offer) return [];
    if (Array.isArray(offer.images) && offer.images.length > 0) return offer.images;
    return offer.imageUrl ? [offer.imageUrl] : [];
  }, [offer]);

  const activeImage = imageUrls[activeImageIndex] || imageUrls[0] || null;
  const displayedPrice = priceParam || offer?.offerPrice || offer?.price || "Price not available";

  // Effects - ALWAYS CALLED
  useEffect(() => {
    if (!idParam) return;

    const fetchOffer = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/api/special-offers/${idParam}`);
        const data = res.data;

        const rawImages = Array.isArray(data.imageUrl)
          ? data.imageUrl
          : typeof data.imageUrl === "string" && data.imageUrl
          ? [data.imageUrl]
          : [];

        const images = rawImages
          .filter(Boolean)
          .map((img) =>
            img.startsWith("http")
              ? img
              : `${BASE_URL}${img.startsWith("/") ? "" : "/"}${img}`
          );

        const imageSrc = images[0] || null;

        setOffer({
          ...data,
          imageUrl: imageSrc,
          images,
          name: data.propertyName || data.name || "Special Offer",
          location: data.address || data.location || data.city || "No address",
        });
        setActiveImageIndex(0);
        setError(null);
      } catch (err) {
        console.error("❌ Error fetching special offer:", err);
        setError("Failed to load special offer.");
        setOffer(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOffer();
  }, [idParam, BASE_URL]);

  // Event handlers - ALWAYS DEFINED
  const handleToggleLike = async () => {
    if (!offer) return;
    
    try {
      const newLiked = !liked;
      setLiked(newLiked);
      setLikesCount((prev) => (newLiked ? prev + 1 : Math.max(prev - 1, 0)));
      console.log("Toggle like for:", offer._id);
    } catch (err) {
      console.error("❌ Failed to toggle special offer like:", err);
      setLiked((prev) => !prev);
      setLikesCount((prev) => (liked ? Math.max(prev - 1, 0) : prev + 1));
    }
  };

  const handleCopyLink = async () => {
    try {
      const url = typeof window !== "undefined" ? window.location.href : "";
      if (!url) return;
      await navigator.clipboard.writeText(url);
    } catch (e) {
      console.error("Failed to copy link:", e);
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

  // Early returns - AFTER ALL HOOKS
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <p className="text-lg text-gray-700 dark:text-gray-200">Loading special offer...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        <main className="flex items-center justify-center min-h-[70vh] px-4">
          <p className="text-lg text-gray-700 dark:text-gray-200">Special offer not found.</p>
        </main>
      </div>
    );
  }

  // Main render - NO MOTION, NO COMPONENTS WITH HOOKS
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Special Offer
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="hidden sm:flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Home className="w-4 h-4" />
                Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <header className="relative overflow-hidden py-10 sm:py-12">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-emerald-500/10 dark:from-blue-500/20 dark:via-purple-500/20 dark:to-emerald-500/20" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {offer.name}
            </h2>
            <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm sm:text-base">
                  {offer.location}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {renderStars(offer.rating || 0)}
                <span className="text-sm">
                  ({offer.rating?.toFixed(1) || "N/A"})
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7 space-y-5">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden p-4">
              <div className="relative rounded-xl overflow-hidden">
                {activeImage ? (
                  <img
                    src={activeImage}
                    alt={offer.name || "Special Offer"}
                    className="w-full h-44 sm:h-64 object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="w-full h-44 sm:h-64 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <Sparkles className="w-16 h-16 text-gray-400" />
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

                {offer.guestFavorite && (
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
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Overview
              </h3>
              <p className="mt-3 text-gray-700 dark:text-gray-300 leading-relaxed">
                {offer.description || "No description available."}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Offer Details
              </h3>
              <div className="mt-3 space-y-3 text-gray-700 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Discount:</span>
                  <span className="text-green-600 font-semibold">
                    {offer.discount || "N/A"}% OFF
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Valid Until:</span>
                  <span>{offer.validUntil || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Availability:</span>
                  <span className="text-orange-600">
                    {offer.availability || "Limited"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Features
              </h3>
              <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                {(Array.isArray(offer.features) && offer.features.length > 0
                  ? offer.features
                  : [
                      "✔ Limited time offer",
                      "✔ Exclusive discount",
                      "✔ Premium quality",
                      "✔ Verified seller",
                      "✔ Customer support",
                      "✔ Easy booking",
                    ]
                ).map((f, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400 flex-shrink-0" />
                    <span>{String(f).replace(/^\s*[✔•\-]\s*/, "")}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24 space-y-5">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Special Price
                    </div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                      {typeof displayedPrice === "string"
                        ? displayedPrice
                        : `${displayedPrice} Br`}
                    </div>
                    {offer.originalPrice && (
                      <div className="text-sm text-gray-500 line-through">
                        Original: {offer.originalPrice} Br
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {offer.category || "Special Offer"}
                  </div>
                </div>

                <div className="mt-4">
                  <Link
                    href={`/sections/specialOffer/reserveSpecialOffer?id=${offer._id}`}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-center block"
                  >
                    Book Now
                  </Link>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  Location
                </h3>
                <div className="mt-3 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                  <iframe
                    title="Offer Location"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(
                      offer.location || "Ethiopia"
                    )}&output=embed`}
                    className="w-full h-48"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
                <div className="mt-3">
                  <Link
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      offer.location || "Ethiopia"
                    )}`}
                    className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded-lg text-center block hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Open in Google Maps
                  </Link>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  Terms & Conditions
                </h3>
                <div className="mt-3 space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Valid for limited time only</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Subject to availability</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Non-refundable after booking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>ID verification required</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function SpecialOfferPage() {
  return <SpecialOfferDetailContent />;
}
