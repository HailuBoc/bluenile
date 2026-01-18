"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Footer from "../../../../components/Footer";
import { motion } from "framer-motion";
import { Calendar, Home, MapPin, Sparkles, Star, StarHalf, Star as StarOutline, Heart } from "lucide-react";
import Link from "next/link";
import AnimatedCard from "../../../../components/AnimatedCard";
import CustomButton from "../../../../components/CustomButton";
import DarkModeToggle from "../../../../components/DarkModeToggle";
import { DarkModeProvider } from "../../../../contexts/DarkModeContext";
import axios from "axios";

function CarRentalReservationContent() {
  const { data: session } = useSession();
  const params = useSearchParams();
  const id = params.get("id");
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "https://bluenile.onrender.com";

  const [car, setCar] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [error, setError] = useState("");
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

  const minDate = useMemo(() => new Date().toISOString().split("T")[0], []);

  // Fetch car details
  useEffect(() => {
    async function fetchCar() {
      try {
        const res = await fetch(`${backendUrl}/admin/properties/${id}`);
        if (!res.ok)
          throw new Error(`Failed to fetch car (status ${res.status})`);
        const data = await res.json();

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
              : `${backendUrl}${img.startsWith("/") ? "" : "/"}${img}`
          );

        const imageSrc = images[0] || null;

        setCar({
          ...data,
          imageUrl: imageSrc,
          images,
          name: data.carName || data.propertyName || "Car",
          location: data.location || data.address || "No location",
        });
        setActiveImageIndex(0);

        // Fetch like status if user is logged in
        if (session?.user?.id) {
          try {
            const likeRes = await axios.get(`${backendUrl}/carslike/${id}?userId=${session.user.id}`);
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
    if (id) fetchCar();
  }, [id, backendUrl, session?.user?.id]); // Added session dependency

  // Toggle like function
  const handleToggleLike = async () => {
    if (!car) return;
    
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

      const res = await axios.post(`${backendUrl}/carslike/${id}/like`, {
        userId: session.user.id,
      });

      setLiked(res.data.userLiked ?? newLiked);
      setLikesCount(
        res.data.likes ?? (newLiked ? likesCount + 1 : likesCount - 1)
      );
    } catch (err) {
      console.error("❌ Failed to toggle car like:", err);
      // rollback
      setLiked((prev) => !prev);
      setLikesCount((prev) => (liked ? Math.max(prev - 1, 0) : prev + 1));
    }
  };

  const imageUrls = useMemo(() => {
    if (!car) return [];
    if (Array.isArray(car.images) && car.images.length > 0) return car.images;
    return car.imageUrl ? [car.imageUrl] : [];
  }, [car]);

  const activeImage = imageUrls[activeImageIndex] || imageUrls[0] || null;

  // Render visual stars
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

  if (!car)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        <p className="text-lg text-gray-700 dark:text-gray-200">Loading car...</p>
      </div>
    );

  const daysDiff = Math.max(
    1,
    Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))
  );
  const pricePerDay = Number(car.price) || 0;
  const totalPrice = pricePerDay * daysDiff;

  function handleChange(e) {
    const { name, value, files } = e.target;
    if (files) setGuestInfo((prev) => ({ ...prev, paymentEvidence: files[0] }));
    else setGuestInfo((prev) => ({ ...prev, [name]: value }));
  }

  function validateForm() {
    if (!guestInfo.name || !guestInfo.email || !guestInfo.phone)
      return "Please fill in name, email, and phone.";
    if (!checkIn || !checkOut)
      return "Please select pick-up and drop-off dates.";
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
        carId: car._id,
        name: guestInfo.name,
        email: guestInfo.email,
        phone: guestInfo.phone,
        checkIn: new Date(checkIn).toISOString(),
        checkOut: new Date(checkOut).toISOString(),
        days: daysDiff,
        amount: totalPrice,
        paymentMethod: guestInfo.paymentMethod,
        paymentEvidence: guestInfo.paymentEvidence?.name || "",
      };

      const res = await fetch(`${backendUrl}/rentalCars/reservations`, {
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
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-emerald-500/10 dark:from-blue-500/20 dark:via-purple-500/20 dark:to-emerald-500/20" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {car.name}
          </h2>
          <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>{car.location}</span>
            </div>
            <div className="flex items-center gap-1">
              {renderStars(car.rating || 0)}
              <span className="text-sm">({car.rating?.toFixed(1) || "N/A"})</span>
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
              <div className="relative rounded-xl overflow-hidden">
                {activeImage ? (
                  <img
                    src={activeImage}
                    alt={car.name}
                    className="w-full h-44 sm:h-64 object-cover"
                  />
                ) : (
                  <div className="w-full h-44 sm:h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400">
                      No image available
                    </span>
                  </div>
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
            </AnimatedCard>

            <AnimatedCard className="p-5" hoverEffect={false}>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Car Rental Benefits
              </h3>
              <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                <li>✔ Unlimited Mileage</li>
                <li>✔ Comprehensive Insurance</li>
                <li>✔ Roadside Assistance</li>
                <li>✔ Flexible Booking Options</li>
                <li>✔ Free Cancellation</li>
                <li>✔ Latest Car Models</li>
              </ul>
            </AnimatedCard>

            {car.location && (
              <AnimatedCard className="p-5" hoverEffect={false}>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Location
                </h3>
                <div className="mt-3 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                  <iframe
                    title="Car Location"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(
                      car.location
                    )}&output=embed`}
                    className="w-full h-56"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
                <div className="mt-3">
                  <CustomButton
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      car.location
                    )}`}
                    variant="ghost"
                    size="md"
                    className="w-full"
                  >
                    Open in Google Maps
                  </CustomButton>
                </div>
              </AnimatedCard>
            )}
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
                      {pricePerDay} birr/day
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
                      Pick-up
                    </div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {checkIn}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Drop-off
                    </div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {checkOut}
                    </div>
                  </div>
                </div>

                <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex justify-between font-semibold text-gray-900 dark:text-white mb-2">
                    <span>
                      {daysDiff} {daysDiff === 1 ? "day" : "days"} × {pricePerDay} birr
                    </span>
                    <span>{totalPrice} birr</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg text-green-700 dark:text-green-400">
                    <span>Total</span>
                    <span>{totalPrice} birr</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Pick-up
                      </label>
                      <input
                        type="date"
                        name="checkIn"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        required
                        min={minDate}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Drop-off
                      </label>
                      <input
                        type="date"
                        name="checkOut"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        required
                        min={checkIn}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white"
                      />
                    </div>
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

                  <fieldset className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 max-h-56 overflow-auto">
                    <legend className="px-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Payment Method
                    </legend>
                    <div className="mt-2 space-y-2">
                      {[
                        { value: "chapa", label: "Chapa" },
                        { value: "cbe-birr", label: "CBE Birr" },
                        { value: "telebirr", label: "Tele Birr" },
                        { value: "mpesa", label: "M-Pesa" },
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

                  {["telebirr", "cbe-birr", "mpesa"].includes(
                    guestInfo.paymentMethod
                  ) && (
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Upload Payment Proof
                      </label>
                      <input
                        type="file"
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white"
                        accept="image/*"
                      />
                    </div>
                  )}

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

export default function CarRentalReservationPage() {
  return (
    <DarkModeProvider>
      <CarRentalReservationContent />
    </DarkModeProvider>
  );
}
