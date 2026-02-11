"use client";
export const dynamic = "force-dynamic";

import { useSearchParams } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Footer from "../../../../components/Footer";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Calendar,
  Home,
  MapPin,
  Star,
  StarHalf,
  Star as StarOutline,
  CheckCircle,
  XCircle,
  Heart,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import AnimatedCard from "../../../../components/AnimatedCard";
import CustomButton from "../../../../components/CustomButton";
import DarkModeToggle from "../../../../components/DarkModeToggle";
import { DarkModeProvider } from "../../../../contexts/DarkModeContext";

export default function ReserveOfferPage() {
  return (
    <DarkModeProvider>
      <ReserveOfferContent />
    </DarkModeProvider>
  );
}

function ReserveOfferContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const priceParam = searchParams.get("price");
  const [offer, setOffer] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const minDate = useMemo(() => new Date().toISOString().split("T")[0], []);

  const displayedPrice = useMemo(
    () => priceParam || offer?.offerPrice || offer?.price || "Price not available",
    [priceParam, offer?.offerPrice, offer?.price]
  );

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "https://bluenile.onrender.com";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    checkIn: new Date().toISOString().split("T")[0],
    checkOut: new Date(Date.now() + 1 * 86400000).toISOString().split("T")[0],
    paymentMethod: "",
  });

  const paymentOptions = [
    { name: "Chapa", logo: "/chapa.png" },
    { name: "Telebirr", logo: "/telebirr.png" },
    { name: "CBE Birr", logo: "/cbebirr.png" },
    { name: "Mpesa", logo: "/mpesa.png" },
  ];

  // Fetch offer by ID
  useEffect(() => {
    if (!id) return;

    const fetchOffer = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/special-offers/${id}`);
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
            : `${API_URL}${firstImage.startsWith("/") ? "" : "/"}${firstImage}`
          : null;

        setOffer({ ...data, imageUrl: imageSrc });

        // Fetch like status if user is logged in
        if (session?.user?.id) {
          try {
            const likeRes = await axios.get(`${API_URL}/specialofferlike/${id}?userId=${session.user.id}`);
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
      } catch (err) {
        console.error("❌ Error fetching offer:", err);
        setMessage({ text: "❌ Failed to load special offer.", type: "error" });
      }
    };

    fetchOffer();
  }, [searchParams, API_URL, session?.user?.id]); // Added session dependency

  // Toggle like function
  const handleToggleLike = async () => {
    if (!offer) return;

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

      const res = await axios.post(`${API_URL}/specialofferlike/${id}/like`, {
        userId: session.user.id,
      });

      setLiked(res.data.userLiked ?? newLiked);
      setLikesCount(
        res.data.likes ?? (newLiked ? likesCount + 1 : likesCount - 1)
      );
    } catch (err) {
      console.error("❌ Failed to toggle special offer like:", err);
      // rollback
      setLiked((prev) => !prev);
      setLikesCount((prev) => (liked ? Math.max(prev - 1, 0) : prev + 1));
    }
  };

  // Helper for star rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i)
        stars.push(<Star key={i} className="h-5 w-5 text-yellow-400" />);
      else if (rating >= i - 0.5)
        stars.push(<StarHalf key={i} className="h-5 w-5 text-yellow-400" />);
      else
        stars.push(
          <StarOutline
            key={i}
            className="h-5 w-5 text-gray-400 dark:text-gray-500"
          />
        );
    }
    return stars;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!offer) return;

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.checkIn ||
      !formData.checkOut ||
      !formData.paymentMethod
    ) {
      setMessage({
        text: "❌ Please fill in all required fields.",
        type: "error",
      });
      return;
    }

    const daysDiff = Math.max(
      1,
      Math.ceil(
        (new Date(formData.checkOut) - new Date(formData.checkIn)) /
          (1000 * 60 * 60 * 24)
      )
    );
    const totalPrice = Number(offer.price || 0) * daysDiff;

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await fetch(`${API_URL}/specialreservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offerId: offer._id,
          offerTitle: offer.propertyName || offer.name,
          startDate: formData.checkIn,
          endDate: formData.checkOut,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          paymentMethod: formData.paymentMethod,
          amount: totalPrice,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Reservation failed");

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl; // ✅ redirect for payment
        return;
      }

      setMessage({
        text: `✅ Reservation confirmed for ${
          offer.propertyName || offer.name
        } (${totalPrice} Birr) via ${formData.paymentMethod}.`,
        type: "success",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        checkIn: new Date().toISOString().split("T")[0],
        checkOut: new Date(Date.now() + 1 * 86400000)
          .toISOString()
          .split("T")[0],
        paymentMethod: "",
      });
    } catch (err) {
      console.error("❌ Reservation error:", err);
      setMessage({ text: `❌ ${err.message}`, type: "error" });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ text: "", type: "" }), 5000);
    }
  };

  if (!offer)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        <p className="text-lg text-gray-700 dark:text-gray-200">Loading offer...</p>
      </div>
    );

  const daysDiff = Math.max(
    1,
    Math.ceil(
      (new Date(formData.checkOut) - new Date(formData.checkIn)) /
        (1000 * 60 * 60 * 24)
    )
  );
  const totalPrice = Number(offer.price || 0) * daysDiff;

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
                Reserve Offer
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
            {offer.propertyName || offer.name}
          </h2>
          <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>{offer.address || "No address"}</span>
            </div>
            <div className="flex items-center gap-1">
              {renderStars(offer.rating || 0)}
              <span className="text-sm">({offer.rating?.toFixed(1) || "N/A"})</span>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pb-12">
        {message.text && (
          <div
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg z-50 text-sm sm:text-base border ${
              message.type === "success"
                ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-200 border-green-200 dark:border-green-700"
                : "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-200 border-red-200 dark:border-red-700"
            }`}
          >
            <div className="flex items-center gap-2">
              {message.type === "success" ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <XCircle className="w-5 h-5" />
              )}
              <span>{message.text}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <section className="lg:col-span-7 space-y-5">
            <AnimatedCard className="p-3 sm:p-4" hoverEffect={false}>
              <div className="relative">
                <img
                  src={offer.imageUrl}
                  alt={offer.propertyName || offer.name}
                  className="rounded-xl w-full h-44 sm:h-64 object-cover"
                  loading="lazy"
                  decoding="async"
                />
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
                  About this offer
                </h3>
                <p className="mt-2 text-gray-700 dark:text-gray-300 leading-relaxed">
                  {offer.description || "No description available."}
                </p>
              </div>
            </AnimatedCard>

            <AnimatedCard className="p-5" hoverEffect={false}>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Offer Highlights
              </h3>
              <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                {(offer.highlights && offer.highlights.length > 0
                  ? offer.highlights
                  : [
                      "✔ Exclusive Deals",
                      "✔ Limited-Time Discounts",
                      "✔ Premium Experience",
                      "✔ Special Packages",
                    ]
                ).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </AnimatedCard>

            <AnimatedCard className="p-5" hoverEffect={false}>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Location
              </h3>
              <div className="mt-3 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <iframe
                  title="Offer Location"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    offer.address || "Ethiopia"
                  )}&output=embed`}
                  className="w-full h-56"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
              <div className="mt-3">
                <CustomButton
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    offer.address || "Ethiopia"
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
                      {typeof displayedPrice === "string"
                        ? displayedPrice
                        : `${displayedPrice} Br`}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {daysDiff} {daysDiff === 1 ? "day" : "days"}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3">
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Check-in
                    </div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formData.checkIn}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Check-out
                    </div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formData.checkOut}
                    </div>
                  </div>
                </div>

                <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex justify-between font-semibold text-gray-900 dark:text-white mb-2">
                    <span>
                      {daysDiff} {daysDiff === 1 ? "day" : "days"} × {Number(offer.price || 0)} birr
                    </span>
                    <span>{totalPrice} birr</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg text-green-700 dark:text-green-400">
                    <span>Total</span>
                    <span>{totalPrice} birr</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  {/* Input fields */}
                  {["name", "email", "phone"].map((f) => (
                    <input
                      key={f}
                      type={
                        f === "email" ? "email" : f === "phone" ? "tel" : "text"
                      }
                      name={f}
                      placeholder={
                        f === "name"
                          ? "Full Name"
                          : f === "email"
                          ? "Email Address"
                          : "Phone Number"
                      }
                      value={formData[f]}
                      onChange={handleChange}
                      required
                      className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ))}

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="date"
                      name="checkIn"
                      value={formData.checkIn}
                      onChange={handleChange}
                      min={minDate}
                      required
                      className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600"
                    />
                    <input
                      type="date"
                      name="checkOut"
                      value={formData.checkOut}
                      onChange={handleChange}
                      min={formData.checkIn}
                      required
                      className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600"
                    />
                  </div>

                  {/* Payment Method */}
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
                      Select Payment Method
                    </h3>
                    <div className="flex gap-3 flex-wrap">
                      {paymentOptions.map((method) => (
                        <label
                          key={method.name}
                          className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition ${
                            formData.paymentMethod === method.name
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-300 dark:border-gray-600"
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method.name}
                            checked={formData.paymentMethod === method.name}
                            onChange={handleChange}
                            className="hidden"
                          />
                          <img
                            src={method.logo}
                            alt={method.name}
                            className="w-8 h-8"
                          />
                          <span className="text-sm text-gray-900 dark:text-white">
                            {method.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <p className="text-lg font-bold text-center text-green-700 dark:text-green-400">
                    Total: {totalPrice} Birr
                  </p>

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
