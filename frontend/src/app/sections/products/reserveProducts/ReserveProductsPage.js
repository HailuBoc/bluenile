"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Footer from "../../../../components/Footer";
import { motion } from "framer-motion";
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
} from "lucide-react";
import Link from "next/link";
import AnimatedCard from "../../../../components/AnimatedCard";
import CustomButton from "../../../../components/CustomButton";
import DarkModeToggle from "../../../../components/DarkModeToggle";
import { DarkModeProvider } from "../../../../contexts/DarkModeContext";
import axios from "axios";

export default function ReservationPage() {
  return (
    <DarkModeProvider>
      <ProductReservationContent />
    </DarkModeProvider>
  );
}

function ProductReservationContent() {
  const { data: session } = useSession();
  const params = useSearchParams();
  const id = params.get("id");
  const priceParam = params.get("price");

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "https://bluenile.onrender.com";

  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [guestInfo, setGuestInfo] = useState({
    name: "",
    email: "",
    phone: "",
    paymentMethod: "chapa",
    paymentEvidence: null,
  });

  const [checkIn, setCheckIn] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [checkOut, setCheckOut] = useState(
    new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0]
  );

  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const displayedPrice = useMemo(() => {
    const p = priceParam || product?.offerPrice || product?.price;
    return p ? `${p} birr` : "Price not available";
  }, [priceParam, product?.offerPrice, product?.price]);

  const minDate = useMemo(() => new Date().toISOString().split("T")[0], []);

  // Fetch product details
  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`${backendUrl}/admin/properties/${id}`);
        if (!res.ok)
          throw new Error(`Failed to fetch product (status ${res.status})`);
        const data = await res.json();

        let firstImage =
          Array.isArray(data.imageUrl) && data.imageUrl.length > 0
            ? data.imageUrl[0]
            : typeof data.imageUrl === "string"
            ? data.imageUrl
            : null;

        const imageSrc = firstImage
          ? firstImage.startsWith("http")
            ? firstImage
            : `${backendUrl}${
                firstImage.startsWith("/") ? "" : "/"
              }${firstImage}`
          : null;

        const location =
          data.location || data.address || data.city || "No location";

        setProduct({ ...data, imageUrl: imageSrc, location });

        // Fetch like status if user is logged in
        if (session?.user?.id) {
          try {
            const likeRes = await axios.get(
              `${backendUrl}/productlike/${id}?userId=${session.user.id}`
            );
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
        setError(err.message);
      }
    }
    if (id) fetchProduct();
  }, [id, backendUrl, session?.user?.id]);

  // Toggle like function
  const handleToggleLike = async () => {
    if (!product) return;
    
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

      const res = await axios.post(`${backendUrl}/productlike/${id}/like`, {
        userId: session.user.id,
      });

      setLiked(res.data.userLiked ?? newLiked);
      setLikesCount(
        res.data.likes ?? (newLiked ? likesCount + 1 : likesCount - 1)
      );
    } catch (err) {
      console.error("❌ Failed to toggle product like:", err);
      // rollback
      setLiked((prev) => !prev);
      setLikesCount((prev) => (liked ? Math.max(prev - 1, 0) : prev + 1));
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

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <p className="text-xl text-red-600">❌ {error}</p>
      </div>
    );

  if (!product)
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <p className="text-xl text-gray-600">Loading product...</p>
      </div>
    );

  const daysDiff = Math.max(
    1,
    Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))
  );
  const pricePerNight = Number(product.price) || 0;
  const totalPrice = pricePerNight * daysDiff;

  function handleChange(e) {
    const { name, value, files } = e.target;
    if (files) {
      setGuestInfo((prev) => ({ ...prev, paymentEvidence: files[0] }));
    } else {
      setGuestInfo((prev) => ({ ...prev, [name]: value }));
    }
  }

  function validateForm() {
    if (!guestInfo.name || !guestInfo.email || !guestInfo.phone)
      return "Please fill in name, email, and phone.";
    if (!checkIn || !checkOut)
      return "Please select check-in and check-out dates.";
    if (!guestInfo.paymentMethod) return "Please select a payment method.";
    if (
      ["telebirr", "cbe-birr", "mpesa"].includes(guestInfo.paymentMethod) &&
      !guestInfo.paymentEvidence
    )
      return "Please upload payment evidence.";
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
        product: product._id,
        name: guestInfo.name,
        email: guestInfo.email,
        phone: guestInfo.phone,
        checkIn: new Date(checkIn).toISOString(),
        checkOut: new Date(checkOut).toISOString(),
        nights: daysDiff,
        amount: totalPrice,
        paymentMethod: guestInfo.paymentMethod,
        paymentEvidence: guestInfo.paymentEvidence
          ? guestInfo.paymentEvidence.name
          : "",
      };

      const res = await fetch(`${backendUrl}/products/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data?.error || "Failed to create reservation");

      const reservationId = data?.reservation?._id;

      if (guestInfo.paymentMethod === "chapa") {
        const payRes = await fetch(`${backendUrl}/bookings/pay/chapa`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: totalPrice,
            email: guestInfo.email,
            fullName: guestInfo.name,
            bookingId: reservationId,
          }),
        });
        const payData = await payRes.json();

        if (payData.checkout_url) {
          window.location.href = payData.checkout_url;
          return;
        } else {
          setSuccessMessage("❌ Failed to initialize Chapa payment.");
          return;
        }
      }

      setSuccessMessage(
        `✅ Reservation submitted! Payment of ${totalPrice} birr via ${guestInfo.paymentMethod} will be reviewed.`
      );

      setGuestInfo({
        name: "",
        email: "",
        phone: "",
        paymentMethod: "chapa",
        paymentEvidence: null,
      });
    } catch (err) {
      setSuccessMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  }

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
                Reserve Product
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
            {product.propertyName || product.name}
          </h2>
          <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>{product.location}</span>
            </div>
            <div className="flex items-center gap-1">
              {renderStars(product.rating || 0)}
              <span className="text-sm">({product.rating?.toFixed(1) || "N/A"})</span>
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
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={product.propertyName || product.name}
                    className="rounded-xl w-full h-44 sm:h-64 object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                )}

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
                  About this product
                </h3>
                <p className="mt-2 text-gray-700 dark:text-gray-300 leading-relaxed">
                  {product.description || "No description available."}
                </p>
              </div>
            </AnimatedCard>

            <AnimatedCard className="p-5" hoverEffect={false}>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Product Highlights
              </h3>
              <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                <li>✔ High quality</li>
                <li>✔ Reliable service</li>
                <li>✔ Fast delivery</li>
                <li>✔ Secure payment</li>
                <li>✔ Verified seller</li>
                <li>✔ 24/7 Support</li>
              </ul>
            </AnimatedCard>

            <AnimatedCard className="p-5" hoverEffect={false}>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Location
              </h3>
              <div className="mt-3 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <iframe
                  title="Product Location"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    product.location
                  )}&output=embed`}
                  className="w-full h-56"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
              <div className="mt-3">
                <CustomButton
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    product.location
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
                    {checkIn}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3">
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Check-in
                    </div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {checkIn}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Check-out
                    </div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {checkOut}
                    </div>
                  </div>
                </div>
              </AnimatedCard>

              <AnimatedCard className="p-5" hoverEffect={false}>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Your Reservation
                </h3>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">

              {/* Dates */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">
                  Check-in
                </label>
                <input
                  type="date"
                  name="checkIn"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={minDate}
                  required
                  className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">
                  Check-out
                </label>
                <input
                  type="date"
                  name="checkOut"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn}
                  required
                  className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              {/* Guest Info */}
              {["name", "email", "phone"].map((field) => (
                <div key={field}>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">
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
                    className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              ))}

              {/* Payment Methods */}
              <fieldset className="border border-gray-300 dark:border-gray-600 rounded-md p-4 max-h-48 overflow-auto">
                <legend className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                  Payment Method
                </legend>
                {[
                  { value: "chapa", label: "Chapa" },
                  { value: "cbe-birr", label: "CBE Birr" },
                  { value: "telebirr", label: "Tele Birr" },
                  { value: "mpesa", label: "M-Pesa" },
                ].map(({ value, label }) => (
                  <label
                    key={value}
                    className="flex items-center gap-3 mb-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={value}
                      checked={guestInfo.paymentMethod === value}
                      onChange={handleChange}
                      required
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </fieldset>

              {/* Upload evidence */}
              {["telebirr", "cbe-birr", "mpesa"].includes(
                guestInfo.paymentMethod
              ) && (
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">
                    Upload Payment Proof
                  </label>
                  <input
                    type="file"
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                    accept="image/*"
                  />
                </div>
              )}

              {/* Price summary */}
              <div className="border-t border-gray-300 dark:border-gray-600 pt-4 mt-4">
                <div className="flex justify-between font-semibold text-gray-900 dark:text-white mb-2">
                  <span>
                    {daysDiff} {daysDiff === 1 ? "night" : "nights"} ×{" "}
                    {pricePerNight} birr
                  </span>
                  <span>{totalPrice} birr</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-green-700 dark:text-green-400">
                  <span>Total</span>
                  <span>{totalPrice} birr</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition duration-200"
              >
                {loading ? "Processing..." : "Confirm Reservation"}
              </button>
                </form>
              </AnimatedCard>

              <AnimatedCard className="p-5" hoverEffect={false}>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <Wallet className="w-4 h-4 text-gray-400" />
                  Secure checkout available
                </div>
              </AnimatedCard>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
