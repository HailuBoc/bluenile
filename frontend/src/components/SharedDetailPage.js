"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Heart,
  Home,
  MapPin,
  Sparkles,
  Star,
  StarHalf,
  Star as StarOutline,
  Wallet,
  Phone,
  Mail,
  User,
  CreditCard,
  Upload,
  Check,
  AlertCircle,
  Clock,
  Shield,
  Award,
  Users,
  ChevronLeft,
  Share2,
  Bookmark,
  Eye,
} from "lucide-react";
import Link from "next/link";
import AnimatedCard from "./AnimatedCard";
import CustomButton from "./CustomButton";
import DarkModeToggle from "./DarkModeToggle";
import { DarkModeProvider } from "../contexts/DarkModeContext";
import SkeletonLoader from "./SkeletonLoader";
import { cn } from "../utils/cn";

export default function SharedDetailPage({
  type, // 'saleCar', 'tourism', 'rentalCar'
  itemId,
  apiEndpoint,
  title,
  breadcrumbs = [],
}) {
  const { data: session } = useSession();
  const [item, setItem] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [guestInfo, setGuestInfo] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: "",
    paymentMethod: "chapa",
    paymentEvidence: null,
  });

  const [dates, setDates] = useState({
    checkIn: new Date().toISOString().split("T")[0],
    checkOut: new Date(Date.now() + (type === 'rentalCar' ? 2 : 1) * 86400000).toISOString().split("T")[0],
  });

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://bluenile.onrender.com";

  // Fetch item details
  useEffect(() => {
    if (!itemId) return;

    const fetchItem = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${backendUrl}${apiEndpoint}${itemId}`);
        if (!res.ok) throw new Error("Item not found");
        
        const data = await res.json();
        setItem(data);
        setLikesCount(data.likes || 0);
        setError(null);
      } catch (err) {
        console.error(`❌ Error fetching ${type}:`, err);
        setError("Failed to load item details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [itemId, apiEndpoint, type, backendUrl]);

  // Image URLs
  const imageUrls = useMemo(() => {
    if (!item) return [];
    if (Array.isArray(item.images) && item.images.length > 0)
      return item.images;
    if (Array.isArray(item.imageUrl) && item.imageUrl.length > 0)
      return item.imageUrl;
    if (item.imageUrl && typeof item.imageUrl === "string")
      return [item.imageUrl];
    return [];
  }, [item]);

  const activeImage = imageUrls[activeImageIndex] || imageUrls[0] || null;

  // Calculate pricing
  const pricing = useMemo(() => {
    if (!item) return { total: 0, nights: 1, daily: 0 };
    
    const checkInDate = new Date(dates.checkIn);
    const checkOutDate = new Date(dates.checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const daily = item.price || 0;
    const total = nights * daily;

    return { total, nights: Math.max(1, nights), daily };
  }, [item, dates]);

  // Render stars
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<StarHalf key={i} className="h-5 w-5 text-yellow-400 fill-current" />);
      } else {
        stars.push(<StarOutline key={i} className="h-5 w-5 text-gray-400" />);
      }
    }
    return stars;
  };

  // Handle like toggle
  const handleLike = async () => {
    try {
      const newLikedState = !liked;
      setLiked(newLikedState);
      setLikesCount(prev => newLikedState ? prev + 1 : prev - 1);

      // API call to update likes
      await fetch(`${backendUrl}/api/like/${type}/${itemId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("❌ Error updating like:", err);
      // Revert on error
      setLiked(!liked);
      setLikesCount(prev => liked ? prev - 1 : prev + 1);
    }
  };

  // Handle booking
  const handleBooking = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Validation
    if (!guestInfo.name || !guestInfo.email || !guestInfo.phone) {
      return setErrorMessage("Please fill in all required fields.");
    }

    if (type !== 'saleCar' && (!dates.checkIn || !dates.checkOut)) {
      return setErrorMessage("Please select check-in and check-out dates.");
    }

    setLoading(true);
    try {
      const payload = {
        [type]: itemId,
        name: guestInfo.name,
        email: guestInfo.email,
        phone: guestInfo.phone,
        paymentMethod: guestInfo.paymentMethod,
        ...(type !== 'saleCar' && {
          checkIn: dates.checkIn,
          checkOut: dates.checkOut,
          nights: pricing.nights,
          amount: pricing.total,
        }),
        paymentEvidence: guestInfo.paymentEvidence?.name || "",
      };

      const res = await fetch(`${backendUrl}/api/book/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Booking failed");

      setSuccessMessage("🎉 Booking successful! We'll contact you soon.");
      setShowBookingForm(false);
    } catch (err) {
      setErrorMessage("❌ " + (err.message || "Booking failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DarkModeProvider>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          {/* Loading skeleton */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7">
                <SkeletonLoader.SkeletonCard className="h-96 mb-6" />
                <SkeletonLoader.SkeletonCard className="h-64 mb-6" />
                <SkeletonLoader.SkeletonCard className="h-48" />
              </div>
              <div className="lg:col-span-5">
                <SkeletonLoader.SkeletonCard className="h-80" />
              </div>
            </div>
          </div>
        </div>
      </DarkModeProvider>
    );
  }

  if (error || !item) {
    return (
      <DarkModeProvider>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Item Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error || "The requested item could not be found."}
            </p>
            <Link href="/">
              <CustomButton icon={<Home className="w-4 h-4" />}>
                Back to Home
              </CustomButton>
            </Link>
          </div>
        </div>
      </DarkModeProvider>
    );
  }

  return (
    <DarkModeProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Navigation */}
        <motion.nav
          className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <motion.div
                className="flex items-center gap-4"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Link href="/" className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Link>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  {breadcrumbs.map((crumb, index) => (
                    <span key={index}>
                      {crumb}
                      {index < breadcrumbs.length - 1 && " / "}
                    </span>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex items-center gap-3"
              >
                <button
                  onClick={() => navigator.share?.({ title: item.title, url: window.location.href })}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Share2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={() => setLiked(!liked)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Heart className={cn("w-4 h-4", liked ? "text-red-500 fill-current" : "text-gray-600 dark:text-gray-400")} />
                </button>
                <DarkModeToggle />
              </motion.div>
            </div>
          </div>
        </motion.nav>

        {/* Success/Error Messages */}
        <AnimatePresence>
          {(successMessage || errorMessage) && (
            <motion.div
              className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg text-sm sm:text-base max-w-md"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                background: successMessage 
                  ? "linear-gradient(to right, #10b981, #059669)" 
                  : "linear-gradient(to right, #ef4444, #dc2626)",
                color: "white",
              }}
            >
              {successMessage || errorMessage}
            </motion.div>
          )}
        </AnimatePresence>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content */}
            <section className="lg:col-span-7 space-y-6">
              {/* Image Gallery */}
              <AnimatedCard className="p-4 sm:p-5" hoverEffect={false}>
                <div className="relative rounded-xl overflow-hidden">
                  {activeImage ? (
                    <img
                      src={activeImage.startsWith('http') ? activeImage : `${backendUrl}/uploads/${activeImage}`}
                      alt={item.title}
                      className="w-full h-96 object-cover"
                    />
                  ) : (
                    <div className="w-full h-96 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                      <Home className="w-16 h-16 text-gray-400 dark:text-gray-500" />
                    </div>
                  )}

                  {/* Like Button */}
                  <motion.button
                    onClick={handleLike}
                    className="absolute top-4 right-4 p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Heart className={cn("w-5 h-5", liked ? "text-red-500 fill-current" : "text-gray-600 dark:text-gray-400")} />
                  </motion.button>

                  {/* Image Counter */}
                  {imageUrls.length > 1 && (
                    <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-sm">
                      {activeImageIndex + 1} / {imageUrls.length}
                    </div>
                  )}
                </div>

                {/* Thumbnail Gallery */}
                {imageUrls.length > 1 && (
                  <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                    {imageUrls.map((src, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={cn(
                          "flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300",
                          idx === activeImageIndex
                            ? "border-blue-500 scale-105"
                            : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                        )}
                      >
                        <img
                          src={src.startsWith('http') ? src : `${backendUrl}/uploads/${src}`}
                          alt={`View ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </AnimatedCard>

              {/* Title and Basic Info */}
              <AnimatedCard className="p-6" hoverEffect={false}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {item.title}
                    </h1>
                    <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{item.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {renderStars(item.rating || 0)}
                        <span className="text-sm">({item.rating?.toFixed(1) || "N/A"})</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
                      ${pricing.daily}
                      {type !== 'saleCar' && <span className="text-sm text-gray-500">/day</span>}
                    </div>
                    {type !== 'saleCar' && (
                      <div className="text-sm text-gray-500">
                        ${pricing.total} total ({pricing.nights} {pricing.nights === 1 ? 'day' : 'days'})
                      </div>
                    )}
                  </div>
                </div>
              </AnimatedCard>

              {/* Description */}
              {item.description && (
                <AnimatedCard className="p-6" hoverEffect={false}>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Description
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {item.description}
                  </p>
                </AnimatedCard>
              )}

              {/* Features */}
              <AnimatedCard className="p-6" hoverEffect={false}>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Features & Amenities
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {item.features?.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  )) || (
                    // Default features if none provided
                    ['High Quality', 'Verified Owner', '24/7 Support', 'Secure Booking'].map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))
                  )}
                </div>
              </AnimatedCard>

              {/* Location */}
              {item.location && (
                <AnimatedCard className="p-6" hoverEffect={false}>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Location
                  </h3>
                  <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                    <iframe
                      title="Location"
                      src={`https://www.google.com/maps?q=${encodeURIComponent(item.location)}&output=embed`}
                      className="w-full h-64"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-4">
                    <CustomButton
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location)}`}
                      variant="ghost"
                      size="md"
                      className="w-full"
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Open in Google Maps
                    </CustomButton>
                  </div>
                </AnimatedCard>
              )}
            </section>

            {/* Sidebar */}
            <aside className="lg:col-span-5">
              <div className="lg:sticky lg:top-24 space-y-6">
                {/* Booking Card */}
                <AnimatedCard className="p-6" hoverEffect={false}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {type === 'saleCar' ? 'Purchase Information' : 'Book This ' + (type === 'rentalCar' ? 'Car' : 'Tour')}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Eye className="w-4 h-4" />
                      {item.views || 0} views
                    </div>
                  </div>

                  {!showBookingForm ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-gray-600 dark:text-gray-400">
                          {type === 'saleCar' ? 'Price' : 'Daily Rate'}
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          ${pricing.daily}
                        </span>
                      </div>

                      {type !== 'saleCar' && (
                        <>
                          <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                            <span className="text-gray-600 dark:text-gray-400">
                              {pricing.nights} {pricing.nights === 1 ? 'Day' : 'Days'}
                            </span>
                            <span className="font-semibold text-gray-900 dark:text-white">
                              ${pricing.total}
                            </span>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Check-in Date
                              </label>
                              <input
                                type="date"
                                value={dates.checkIn}
                                onChange={(e) => setDates(prev => ({ ...prev, checkIn: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                min={new Date().toISOString().split('T')[0]}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Check-out Date
                              </label>
                              <input
                                type="date"
                                value={dates.checkOut}
                                onChange={(e) => setDates(prev => ({ ...prev, checkOut: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                min={dates.checkIn}
                              />
                            </div>
                          </div>
                        </>
                      )}

                      <CustomButton
                        onClick={() => setShowBookingForm(true)}
                        variant="primary"
                        size="lg"
                        className="w-full"
                      >
                        {type === 'saleCar' ? 'Contact Seller' : 'Proceed to Booking'}
                      </CustomButton>
                    </div>
                  ) : (
                    <form onSubmit={handleBooking} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          <User className="w-4 h-4 inline mr-1" />
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={guestInfo.name}
                          onChange={(e) => setGuestInfo(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          <Mail className="w-4 h-4 inline mr-1" />
                          Email
                        </label>
                        <input
                          type="email"
                          value={guestInfo.email}
                          onChange={(e) => setGuestInfo(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          <Phone className="w-4 h-4 inline mr-1" />
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={guestInfo.phone}
                          onChange={(e) => setGuestInfo(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          <CreditCard className="w-4 h-4 inline mr-1" />
                          Payment Method
                        </label>
                        <select
                          value={guestInfo.paymentMethod}
                          onChange={(e) => setGuestInfo(prev => ({ ...prev, paymentMethod: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        >
                          <option value="chapa">Chapa (Ethiopia)</option>
                          <option value="telebirr">TeleBirr</option>
                          <option value="cbe-birr">CBE Birr</option>
                          <option value="mpesa">M-Pesa</option>
                          <option value="bank_transfer">Bank Transfer</option>
                        </select>
                      </div>

                      {["telebirr", "cbe-birr", "mpesa"].includes(guestInfo.paymentMethod) && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            <Upload className="w-4 h-4 inline mr-1" />
                            Payment Evidence
                          </label>
                          <input
                            type="file"
                            onChange={(e) => setGuestInfo(prev => ({ ...prev, paymentEvidence: e.target.files[0] }))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            accept="image/*"
                          />
                        </div>
                      )}

                      <div className="flex gap-3 pt-4">
                        <CustomButton
                          type="button"
                          onClick={() => setShowBookingForm(false)}
                          variant="ghost"
                          size="md"
                          className="flex-1"
                        >
                          Cancel
                        </CustomButton>
                        <CustomButton
                          type="submit"
                          variant="primary"
                          size="md"
                          className="flex-1"
                          disabled={loading}
                        >
                          {loading ? 'Processing...' : (type === 'saleCar' ? 'Send Inquiry' : 'Complete Booking')}
                        </CustomButton>
                      </div>
                    </form>
                  )}
                </AnimatedCard>

                {/* Trust Badges */}
                <AnimatedCard className="p-6" hoverEffect={false}>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Why Book With Us?
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-blue-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Secure Payment</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-green-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Verified Listings</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-purple-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">24/7 Support</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-orange-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Instant Confirmation</span>
                    </div>
                  </div>
                </AnimatedCard>

                {/* Contact */}
                <AnimatedCard className="p-6" hoverEffect={false}>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Need Help?
                  </h3>
                  <div className="space-y-3">
                    <a href="tel:+251911234567" className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">+251 911 234 567</span>
                    </a>
                    <a href="mailto:info@bluenileplc.com" className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">info@bluenileplc.com</span>
                    </a>
                  </div>
                </AnimatedCard>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </DarkModeProvider>
  );
}
