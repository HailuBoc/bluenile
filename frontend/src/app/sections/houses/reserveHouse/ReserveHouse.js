"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { useSession } from "next-auth/react"; // Added for authentication
import Footer from "../../../../components/Footer";
import { motion } from "framer-motion";
import {
  Calendar,
  Heart, // Added Heart icon
  Home,
  MapPin,
  Sparkles,
  Star,
  StarHalf,
  Star as StarOutline,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import AnimatedCard from "../../../../components/AnimatedCard";
import CustomButton from "../../../../components/CustomButton";
import DarkModeToggle from "../../../../components/DarkModeToggle";
import { DarkModeProvider } from "../../../../contexts/DarkModeContext";
import axios from "axios"; // Added for API calls

function HouseSaleReservationContent() {
  const params = useSearchParams();
  const { data: session } = useSession(); // Added session
  const id = params.get("id");
  const priceParam = params.get("price");

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "https://bluenile.onrender.com";

  const [house, setHouse] = useState(null);
  const [liked, setLiked] = useState(false); // Added like state
  const [likesCount, setLikesCount] = useState(0); // Added likes count
  const [error, setError] = useState("");
  const [guestInfo, setGuestInfo] = useState({
    name: "",
    email: "",
    phone: "",
    appointmentDate: new Date().toISOString().split("T")[0],
    appointmentTime: "10:00",
    notes: "",
    paymentMethod: "cash",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const timeOptions = useMemo(
    () => ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00"],
    []
  );

  const displayedPrice = useMemo(() => {
    const p = priceParam || house?.offerPrice || house?.price;
    return p ? `${p} Br` : "Price not available";
  }, [priceParam, house?.offerPrice, house?.price]);

  const minDate = useMemo(() => new Date().toISOString().split("T")[0], []);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i)
        stars.push(<Star key={i} className="h-4 w-4 text-yellow-400" />);
      else if (rating >= i - 0.5)
        stars.push(<StarHalf key={i} className="h-4 w-4 text-yellow-400" />);
      else
        stars.push(<StarOutline key={i} className="h-4 w-4 text-gray-400" />);
    }
    return stars;
  };

  // Fetch house details
  useEffect(() => {
    async function fetchHouse() {
      try {
        const res = await fetch(`${API_URL}/admin/properties/${id}`);
        if (!res.ok)
          throw new Error(`Failed to fetch house (status ${res.status})`);
        const data = await res.json();

        const firstImage =
          Array.isArray(data.imageUrl) && data.imageUrl.length > 0
            ? data.imageUrl[0]
            : typeof data.imageUrl === "string"
            ? data.imageUrl
            : null;

        const imageSrc = firstImage
          ? firstImage.startsWith("http")
            ? firstImage
            : `${API_URL}${firstImage.startsWith("/") ? "" : "/"}${firstImage}`
          : null;

        const location =
          data.location || data.address || data.city || "No location";
        const houseName = data.houseTitle || data.propertyName || "House";

        setHouse({ ...data, imageUrl: imageSrc, location, houseName });
        
        // Fetch like status if user is logged in
        if (session?.user?.id) {
          try {
            const likeRes = await axios.get(`${API_URL}/houselike/${id}?userId=${session.user.id}`);
            setLiked(likeRes.data.userLiked || false);
            setLikesCount(likeRes.data.likes || 0);
          } catch (likeErr) {
            console.error("❌ Error fetching like status:", likeErr);
            setLiked(false);
            setLikesCount(data.likes || 0);
          }
        } else {
          setLiked(false);
          setLikesCount(data.likes || 0);
        }
        
        setError("");
      } catch (err) {
        console.error("❌ Error fetching house:", err);
        setError("Failed to load house details.");
        setHouse(null);
      }
    }

    if (id) fetchHouse();
  }, [id, API_URL, session?.user?.id]); // Added session dependency

  function handleChange(e) {
    const { name, value } = e.target;
    setGuestInfo((prev) => ({ ...prev, [name]: value }));
  }

  // Toggle like function
  const handleToggleLike = async () => {
    if (!house) return;
    
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

      const res = await axios.post(`${API_URL}/houselike/${id}/like`, {
        userId: session.user.id,
      });

      setLiked(res.data.userLiked ?? newLiked);
      setLikesCount(
        res.data.likes ?? (newLiked ? likesCount + 1 : likesCount - 1)
      );
    } catch (err) {
      console.error("❌ Failed to toggle house like:", err);
      // rollback
      setLiked((prev) => !prev);
      setLikesCount((prev) => (liked ? Math.max(prev - 1, 0) : prev + 1));
    }
  };

  function validateForm() {
    if (!guestInfo.name || !guestInfo.email || !guestInfo.phone)
      return "Please fill in name, email, and phone.";
    if (!guestInfo.appointmentDate) return "Please select appointment date.";
    if (!guestInfo.appointmentTime) return "Please select appointment time.";
    if (!guestInfo.paymentMethod) return "Please select a payment method.";
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSuccessMessage("");
    const err = validateForm();
    if (err) return setSuccessMessage("❌ " + err);

    setLoading(true);
    try {
      const payload = {
        houseId: house._id,
        houseName: house.houseName,
        name: guestInfo.name,
        email: guestInfo.email,
        phone: guestInfo.phone,
        appointmentDate: guestInfo.appointmentDate,
        appointmentTime: guestInfo.appointmentTime,
        notes: guestInfo.notes,
        paymentMethod: guestInfo.paymentMethod,
      };

      const res = await fetch(`${API_URL}/houses/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data?.message || "Failed to book appointment");

      setSuccessMessage(
        `✅ Appointment for ${house.houseName} successfully booked!`
      );
      setGuestInfo({
        name: "",
        email: "",
        phone: "",
        appointmentDate: new Date().toISOString().split("T")[0],
        appointmentTime: "10:00",
        notes: "",
        paymentMethod: "cash",
      });
    } catch (err) {
      setSuccessMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  }

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <p className="text-xl text-red-600">❌ {error}</p>
      </div>
    );

  if (!house)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        <p className="text-lg text-gray-700 dark:text-gray-200">Loading house details...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <motion.nav
        className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Reserve House
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
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-emerald-500/10 dark:from-blue-500/20 dark:via-purple-500/20 dark:to-emerald-500/20" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {house.houseName}
          </h2>
          <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>{house.location}</span>
            </div>
            <div className="flex items-center gap-1">
              {renderStars(house.rating || 0)}
              <span className="text-sm">({house.rating?.toFixed(1) || "N/A"})</span>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pb-12">
        {successMessage && (
          <div
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg z-50 text-sm sm:text-base border ${
              successMessage.startsWith("✅")
                ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-200 border-green-200 dark:border-green-700"
                : "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-200 border-red-200 dark:border-red-700"
            }`}
          >
            {successMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <section className="lg:col-span-7 space-y-5">
            <AnimatedCard className="p-3 sm:p-4" hoverEffect={false}>
              <div className="relative">
                {house.imageUrl && (
                  <img
                    src={house.imageUrl}
                    alt={house.houseName}
                    className="rounded-xl w-full h-44 sm:h-64 object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                )}
                
                {/* Like Button */}
                <button
                  onClick={handleToggleLike}
                  className="absolute top-3 right-3 bg-white/90 hover:bg-white p-1.5 rounded-full shadow flex items-center"
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

              <div className="mt-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  About this house
                </h3>
                <p className="mt-2 text-gray-700 dark:text-gray-300 leading-relaxed">
                  {house.description || "No description available."}
                </p>
              </div>
            </AnimatedCard>

            <AnimatedCard className="p-5" hoverEffect={false}>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                House Features
              </h3>
              <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                {(Array.isArray(house.facilities) && house.facilities.length > 0
                  ? house.facilities
                  : [
                      "✔ Spacious Bedrooms",
                      "✔ Modern Kitchen",
                      "✔ Private Garden",
                      "✔ Secure Neighborhood",
                      "✔ Nearby Schools & Shops",
                      "✔ Parking / Garage",
                    ]
                ).map((f, idx) => (
                  <li key={idx}>{f}</li>
                ))}
              </ul>
            </AnimatedCard>

            <AnimatedCard className="p-5" hoverEffect={false}>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Location
              </h3>
              <div className="mt-3 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <iframe
                  title="House Location"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    house.location
                  )}&output=embed`}
                  className="w-full h-56"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
              <div className="mt-3">
                <CustomButton
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    house.location
                  )}`}
                  variant="ghost"
                  size="md"
                  className="w-full"
                >
                  Open in Google Maps
                </CustomButton>
              </div>
            </AnimatedCard>
          </section>

          <aside className="lg:col-span-5">
            <div className="lg:sticky lg:top-24 space-y-6">
              <AnimatedCard className="p-5" hoverEffect={false}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Price
                    </div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                      {displayedPrice}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {guestInfo.appointmentDate}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3">
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Date
                    </div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {guestInfo.appointmentDate}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Time
                    </div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {guestInfo.appointmentTime}
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Appointment Date
                    </label>
                    <input
                      type="date"
                      name="appointmentDate"
                      value={guestInfo.appointmentDate}
                      onChange={handleChange}
                      min={minDate}
                      required
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Appointment Time
                    </label>
                    <select
                      name="appointmentTime"
                      value={guestInfo.appointmentTime}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white"
                    >
                      {timeOptions.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

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

                  <fieldset className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                    <legend className="px-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Payment Method
                    </legend>
                    <div className="mt-2 space-y-2">
                      {[
                        { value: "cash", label: "Cash" },
                        { value: "bank-transfer", label: "Bank Transfer" },
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
                          <span className="flex items-center gap-2">
                            <Wallet className="w-4 h-4 text-gray-400" />
                            {label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Note (optional)
                    </label>
                    <textarea
                      name="notes"
                      value={guestInfo.notes}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white resize-none"
                      placeholder="Any preferences (time flexibility, call before arrival, etc.)"
                    />
                  </div>

                  <CustomButton
                    type="submit"
                    disabled={loading}
                    variant="primary"
                    size="sm"
                    className="w-full"
                  >
                    {loading ? "Processing..." : "Book Appointment"}
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

export default function HouseSaleReservationPage() {
  return (
    <DarkModeProvider>
      <HouseSaleReservationContent />
    </DarkModeProvider>
  );
}
