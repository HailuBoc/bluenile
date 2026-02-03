"use client";
export const dynamic = "force-dynamic";

import { useSearchParams } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Footer from "../../../../components/Footer";
import { motion } from "framer-motion";
import { Home, MapPin, Sparkles, Star, StarHalf, Star as StarOutline, Heart } from "lucide-react";
import Link from "next/link";
import AnimatedCard from "../../../../components/AnimatedCard";
import CustomButton from "../../../../components/CustomButton";
import DarkModeToggle from "../../../../components/DarkModeToggle";
import { DarkModeProvider } from "../../../../contexts/DarkModeContext";
import LikeButton from "../../../../components/LikeButton";
import axios from "axios";

function SaleCarReservationContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "https://bluenile.onrender.com";

  const [listing, setListing] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [error, setError] = useState(null);
  const [guestInfo, setGuestInfo] = useState({
    name: "",
    email: "",
    phone: "",
    paymentMethod: "bank_transfer",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch car details
  useEffect(() => {
    const id = searchParams.get("id");
    if (!id) return;

    const fetchCar = async () => {
      try {
        const res = await axios.get(`${backendUrl}/admin/properties/${id}`);
        const rawImages = Array.isArray(res.data.imageUrl)
          ? res.data.imageUrl
          : typeof res.data.imageUrl === "string" && res.data.imageUrl
          ? [res.data.imageUrl]
          : [];

        const images = rawImages
          .filter(Boolean)
          .map((img) =>
            img.startsWith("http")
              ? img
              : `${backendUrl}${img.startsWith("/") ? "" : "/"}${img}`
          );

        setListing({ ...res.data, imageUrl: images[0] || null, images });
        
        // Fetch like status if user is logged in
        if (session?.user?.id) {
          try {
            const likeRes = await axios.get(`${backendUrl}/carsalelike/${id}?userId=${session.user.id}`);
            setLiked(likeRes.data.userLiked || false);
            setLikesCount(likeRes.data.likes || 0);
          } catch (likeErr) {
            console.error("❌ Error fetching like status:", likeErr);
            setLiked(false);
            setLikesCount(res.data.likes || 0);
          }
        } else {
          setLiked(false);
          setLikesCount(res.data.likes || 0);
        }
        setActiveImageIndex(0);
      } catch (err) {
        console.error("❌ Error fetching car:", err);
        setError("Car not found or failed to load.");
      }
    };

    fetchCar();
  }, [searchParams, backendUrl, session?.user?.id]); // Added session dependency

  // Toggle like function
  const handleToggleLike = async () => {
    if (!listing) return;
    
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

      const res = await axios.post(`${backendUrl}/carsalelike/${id}/like`, {
        userId: session.user.id,
      });

      setLiked(res.data.userLiked ?? newLiked);
      setLikesCount(
        res.data.likes ?? (newLiked ? likesCount + 1 : likesCount - 1)
      );
    } catch (err) {
      console.error("❌ Failed to toggle car sale like:", err);
      // rollback
      setLiked((prev) => !prev);
      setLikesCount((prev) => (liked ? Math.max(prev - 1, 0) : prev + 1));
    }
  };

  // Auto-hide messages
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGuestInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!listing) return;

    setLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/sales`, {
        name: guestInfo.name,
        email: guestInfo.email,
        phone: guestInfo.phone,
        car: listing.carName || listing.propertyName,
        amount: listing.price,
        paymentMethod: guestInfo.paymentMethod,
      });

      setSuccessMessage(
        `✅ Successfully reserved ${
          listing.carName || listing.propertyName
        }. Price: ${listing.price} birr.`
      );

      setGuestInfo({
        name: "",
        email: "",
        phone: "",
        paymentMethod: "bank_transfer",
      });
    } catch (error) {
      console.error("❌ Reservation failed:", error.response?.data || error);
      setErrorMessage(
        error.response?.data?.message || "Reservation failed. Try again."
      );
    } finally {
      setLoading(false);
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

  const imageUrls = useMemo(() => {
    if (!listing) return [];
    if (Array.isArray(listing.images) && listing.images.length > 0)
      return listing.images;
    return listing.imageUrl ? [listing.imageUrl] : [];
  }, [listing]);

  const activeImage = imageUrls[activeImageIndex] || imageUrls[0] || null;

  if (!listing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        <main className="flex items-center justify-center min-h-[70vh] p-4">
          <p className="text-lg sm:text-xl text-red-600">
            {error || "Loading car..."}
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <motion.nav
        className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Reserve Car
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
              <DarkModeToggle />
            </div>
          </div>
        </div>
      </motion.nav>

      <motion.header
        className="relative overflow-hidden py-12 sm:py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:via-purple-500/20 dark:to-indigo-500/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            {listing.carName || listing.propertyName}
          </h2>
          <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>{listing.location || listing.address}</span>
            </div>
            <div className="flex items-center gap-1">
              {renderStars(listing.rating || 0)}
              <span className="text-sm">({listing.rating?.toFixed(1) || "N/A"})</span>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {(successMessage || errorMessage) && (
          <div
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg text-sm sm:text-base z-50 border ${
              successMessage
                ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-200 border-green-200 dark:border-green-700"
                : "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-200 border-red-200 dark:border-red-700"
            }`}
          >
            {successMessage || errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <section className="lg:col-span-7 space-y-6">
            <AnimatedCard className="p-4 sm:p-5" hoverEffect={false}>
              <div className="relative rounded-xl overflow-hidden">
                {imageUrls.map((src, idx) => (
                  <button
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
                      className="w-full h-14 object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </button>
                ))}
              </div>
            </AnimatedCard>

            {listing.description && (
              <AnimatedCard className="p-6" hoverEffect={false}>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Description
                </h3>
                <p className="mt-3 text-gray-700 dark:text-gray-300 leading-relaxed">
                  {listing.description}
                </p>
              </AnimatedCard>
            )}

            <AnimatedCard className="p-6" hoverEffect={false}>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Car Features
              </h3>
              <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                <li>✔ Low Mileage</li>
                <li>✔ Accident Free</li>
                <li>✔ Full Service History</li>
                <li>✔ Fuel Efficient</li>
                <li>✔ Air Conditioning</li>
                <li>✔ Modern Safety Features</li>
              </ul>
            </AnimatedCard>

            <AnimatedCard className="p-6" hoverEffect={false}>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Location
              </h3>
              <div className="mt-3 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <iframe
                  title="Map"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    listing.location || listing.address || "Ethiopia"
                  )}&output=embed`}
                  className="w-full h-56"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </AnimatedCard>
          </section>

          <aside className="lg:col-span-5">
            <div className="lg:sticky lg:top-24 space-y-6">
              <AnimatedCard className="p-6" hoverEffect={false}>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Car Price
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {listing.price} birr
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  {["name", "email", "phone"].map((field) => (
                    <div key={field} className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {field === "name"
                          ? "Full Name"
                          : field === "email"
                          ? "Email Address"
                          : "Phone Number"}
                      </label>
                      <input
                        type={
                          field === "email"
                            ? "email"
                            : field === "phone"
                            ? "tel"
                            : "text"
                        }
                        name={field}
                        value={guestInfo[field]}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white"
                      />
                    </div>
                  ))}

                  <fieldset className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 max-h-56 overflow-auto">
                    <legend className="px-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Payment Method
                    </legend>
                    <div className="mt-2 space-y-2">
                      {[
                        { value: "bank_transfer", label: "Bank Transfer" },
                        { value: "cash_cheque", label: "Cash / Cheque" },
                      ].map(({ value, label }) => (
                        <label
                          key={value}
                          className="flex items-center gap-3 cursor-pointer text-gray-700 dark:text-gray-200"
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={value}
                            checked={guestInfo.paymentMethod === value}
                            onChange={handleChange}
                            required
                            className="accent-blue-600"
                          />
                          <span>{label}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <CustomButton
                    type="submit"
                    disabled={loading}
                    variant="primary"
                    size="lg"
                    className="w-full"
                  >
                    {loading ? "Processing..." : "Confirm Reservation"}
                  </CustomButton>
                </form>
              </AnimatedCard>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ReservationPage() {
  return (
    <DarkModeProvider>
      <SaleCarReservationContent />
    </DarkModeProvider>
  );
}
