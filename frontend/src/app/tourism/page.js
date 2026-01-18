"use client";
import { useMemo, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Map,
  Landmark,
  Building,
  Calendar,
  Crown,
  CheckCircle,
  Search,
  Shield,
  BedDouble,
  Plane,
  Car,
  User,
  Sparkles,
  Home,
} from "lucide-react";
import Link from "next/link";
import Footer from "../../components/Footer";
import DarkModeToggle from "../../components/DarkModeToggle";
import AnimatedCard from "../../components/AnimatedCard";
import CustomButton from "../../components/CustomButton";
import { DarkModeProvider } from "../../contexts/DarkModeContext";

const iconMap = { Map, Landmark, Building, Calendar, Shield, BedDouble };

export default function TourismPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:10000";

  const [activeTab, setActiveTab] = useState("regular");
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    destination: "",
    date: "",
    extras: [],
    notes: "",
    paymentMethod: "",
    phone: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [vipPosts, setVipPosts] = useState([]);
  const [regularTours, setRegularTours] = useState([]);
  const [paymentInstructions, setPaymentInstructions] = useState("");

  // ✅ Fetch VIP posts
  useEffect(() => {
    const fetchVipPosts = async () => {
      try {
        const res = await fetch(`${API_URL}/vip-post`);
        if (!res.ok) throw new Error("Failed to fetch VIP posts");
        const data = await res.json();
        setVipPosts(data);
      } catch (err) {
        console.error("Error fetching VIP posts:", err);
        setMessage({ type: "error", text: "Failed to fetch VIP posts" });
      }
    };
    fetchVipPosts();
  }, []);

  // ✅ Fetch Regular tours
  useEffect(() => {
    const fetchRegularTours = async () => {
      try {
        const res = await fetch(`${API_URL}/regular-post`);
        if (!res.ok) throw new Error("Failed to fetch regular tours");
        const data = await res.json();
        setRegularTours(data);
      } catch (err) {
        console.error("Error fetching regular tours:", err);
        setMessage({ type: "error", text: "Failed to fetch regular tours" });
      }
    };
    fetchRegularTours();
  }, []);

  const handleCheckboxChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      extras: prev.extras.includes(value)
        ? prev.extras.filter((e) => e !== value)
        : [...prev.extras, value],
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.paymentMethod) {
      setMessage({ type: "error", text: "⚠️ Please select a payment method!" });
      return;
    }

    if (!formData.phone || !formData.email) {
      setMessage({
        type: "error",
        text: "⚠️ Please provide your phone number and email!",
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`${API_URL}/vip-bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Booking failed");

      // ✅ Handle payment flow
      if (formData.paymentMethod === "Chapa" && data.paymentUrl) {
        // Redirect user to Chapa gateway
        window.location.href = data.paymentUrl;
      } else if (formData.paymentMethod === "Mpesa") {
        setMessage({
          type: "success",
          text: "✅ Booking submitted! Please complete payment using M-Pesa and wait for confirmation email.",
        });
      } else if (formData.paymentMethod === "Bank Transfer") {
        setMessage({
          type: "success",
          text: "🏦 Booking submitted! Please complete payment by bank transfer using the provided details.",
        });
      } else if (formData.paymentMethod === "Cash") {
        setMessage({
          type: "success",
          text: "💵 Booking submitted! You can pay in cash on arrival or at our office.",
        });
      } else {
        setMessage({
          type: "success",
          text: "🎉 Booking submitted successfully!",
        });
      }

      // Reset form
      setFormData({
        destination: "",
        date: "",
        extras: [],
        notes: "",
        paymentMethod: "",
        phone: "",
        email: "",
      });
    } catch (err) {
      setMessage({ type: "error", text: "❌ " + err.message });
    } finally {
      setLoading(false);
    }
  };

  const filteredRegularTours = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return regularTours;
    return regularTours.filter((tour) =>
      (tour.category || "").toLowerCase().includes(q)
    );
  }, [regularTours, search]);

  return (
    <DarkModeProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        <motion.nav
          className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
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
                  Tourism Services
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
          className="relative overflow-hidden py-16 xs:py-20 sm:py-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-green-500/10 dark:from-yellow-500/20 dark:via-orange-500/20 dark:to-green-500/20" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-yellow-600 via-orange-600 to-green-600 bg-clip-text text-transparent mb-4">
                Explore Ethiopian Tourism
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Choose between Regular and VIP tourism packages to plan your
                perfect Ethiopian journey.
              </p>
            </motion.div>
          </div>
        </motion.header>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <motion.div
            className="max-w-6xl mx-auto mb-10"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <AnimatedCard className="p-6 sm:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <CustomButton
                    onClick={() => setActiveTab("regular")}
                    variant={activeTab === "regular" ? "accent" : "secondary"}
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    Regular Tourism
                  </CustomButton>
                  <CustomButton
                    onClick={() => setActiveTab("vip")}
                    variant={activeTab === "vip" ? "accent" : "secondary"}
                    size="sm"
                    className="w-full sm:w-auto"
                    icon={<Crown className="w-4 h-4" />}
                  >
                    VIP Tourism
                  </CustomButton>
                </div>

                {activeTab === "regular" && (
                  <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3">
                    <Search className="w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search regular packages..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    />
                  </div>
                )}
              </div>
            </AnimatedCard>
          </motion.div>

          <div className="max-w-6xl mx-auto">
        {activeTab === "regular" && (
          <div>
            {regularTours.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <AnimatePresence>
                  {filteredRegularTours.map((tour, idx) => {
                    const IconComponent = iconMap[tour.icon] || Map;
                    return (
                      <AnimatedCard key={tour._id} delay={idx * 0.05}>
                        <div className="p-5">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 shadow-lg">
                              <IconComponent className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">
                              {tour.category}
                            </h3>
                          </div>
                          {tour.destinations && (
                            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 text-sm md:text-base">
                              {tour.destinations.map((d, i) => (
                                <li key={i}>{d}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </AnimatedCard>
                    );
                  })}
                </AnimatePresence>
              </div>
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400">
                No regular tours available.
              </p>
            )}
          </div>
        )}

        {/* ✅ VIP Tours */}
        {activeTab === "vip" && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12">
              {vipPosts.length > 0 ? (
                <AnimatePresence>
                  {vipPosts.map((tour, idx) => (
                    <AnimatedCard key={tour._id} delay={idx * 0.05} className="relative overflow-hidden">
                      <div className="relative">
                        <div className="absolute top-3 left-3 bg-yellow-500 text-white px-3 py-1 rounded-full flex items-center gap-1 text-xs font-semibold shadow-lg z-10">
                          <Crown className="w-4 h-4" /> VIP Tour
                        </div>

                        {tour.image && (
                          <img
                            src={`${API_URL}/uploads/${tour.image}`}
                            alt={tour.name}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-56 md:h-64 object-cover"
                          />
                        )}

                        <div className="p-5">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                              {tour.name}
                            </h2>
                            <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                              <Calendar className="w-4 h-4 mr-1 text-yellow-600" />
                              {tour.date}
                            </div>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base mb-4">
                            {tour.description}
                          </p>
                          <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm md:text-base">
                            {tour.highlights?.map((item, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <CheckCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </AnimatedCard>
                  ))}
                </AnimatePresence>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 col-span-2">
                  No VIP posts available.
                </p>
              )}
            </div>

            {/* ✅ Clean VIP Booking Form */}
            <AnimatedCard className="p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4">
                VIP Tour Customization Form
              </h3>

              {message && (
                <div
                  className={`mb-4 p-3 rounded-lg text-sm font-medium ${
                    message.type === "success"
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : "bg-red-100 text-red-700 border border-red-300"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Destination */}
                <div>
                  <label className="block font-semibold mb-1 text-sm text-gray-900 dark:text-gray-200">
                    Choose Destination
                  </label>
                  <select
                    value={formData.destination}
                    onChange={(e) =>
                      setFormData({ ...formData, destination: e.target.value })
                    }
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="">-- Select a place --</option>
                    <option value="lalibela">Lalibela</option>
                    <option value="axum">Axum</option>
                    <option value="gondar">Gondar</option>
                    <option value="omo_valley">Omo Valley</option>
                    <option value="sof_omar">Sof Omar Caves</option>
                    <option value="rift_valley">Rift Valley</option>
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="block font-semibold mb-1 text-sm text-gray-900 dark:text-gray-200">
                    Travel Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block font-semibold mb-1 text-sm text-gray-900 dark:text-gray-200">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block font-semibold mb-1 text-sm text-gray-900 dark:text-gray-200">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                {/* Extras */}
                <div>
                  <label className="block font-semibold mb-1 text-sm text-gray-900 dark:text-gray-200">
                    Select VIP Extras
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-900 dark:text-gray-200">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.extras.includes("private_car")}
                        onChange={() => handleCheckboxChange("private_car")}
                        className="accent-yellow-600"
                      />
                      <Car className="w-4 h-4" /> Private Car / SUV
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.extras.includes("airplane")}
                        onChange={() => handleCheckboxChange("airplane")}
                        className="accent-yellow-600"
                      />
                      <Plane className="w-4 h-4" /> Airplane Ride
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.extras.includes("personal_guide")}
                        onChange={() => handleCheckboxChange("personal_guide")}
                        className="accent-yellow-600"
                      />
                      <User className="w-4 h-4" /> Personal Guide
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.extras.includes("luxury_lodge")}
                        onChange={() => handleCheckboxChange("luxury_lodge")}
                        className="accent-yellow-600"
                      />
                      <BedDouble className="w-4 h-4" /> Luxury Lodge Stay
                    </label>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block font-semibold mb-1 text-sm text-gray-900 dark:text-gray-200">
                    Additional Notes / Requests
                  </label>
                  <textarea
                    rows="4"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Enter special requests here..."
                  />
                </div>

                {/* Payment Method */}
                {/* Payment Method */}
                <div>
                  <label className="block font-semibold mb-1 text-sm text-gray-900 dark:text-gray-200">
                    Payment Method
                  </label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({ ...formData, paymentMethod: value });

                      // 🧭 Show payment-specific instructions
                      switch (value) {
                        case "Chapa":
                          setPaymentInstructions(
                            "You’ll be redirected to Chapa’s secure payment gateway after submitting."
                          );
                          break;
                        case "Mpesa":
                          setPaymentInstructions(
                            "📱 Please send your payment via M-Pesa to number: +254 7XX XXX XXX and keep your transaction ID handy."
                          );
                          break;
                        case "Bank Transfer":
                          setPaymentInstructions(
                            "🏦 Please transfer the total amount to Bank of Abyssinia, Account: 123456789, Name: Explore Ethiopia Tours."
                          );
                          break;
                        case "Cash":
                          setPaymentInstructions(
                            "💵 You can pay in cash upon arrival at our main office or to your assigned tour guide."
                          );
                          break;
                        default:
                          setPaymentInstructions("");
                      }
                    }}
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg p-2"
                  >
                    <option value="">Select Payment Method</option>
                    <option value="Chapa">Chapa</option>
                    <option value="Tele-Birr">Mpesa</option>
                    <option value="Mpesa">Bank Transfer</option>
                    <option value="Cbe-Birr">Cash</option>
                  </select>

                  {paymentInstructions && (
                    <p className="text-gray-700 dark:text-gray-200 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-2 mt-2 text-sm">
                      {paymentInstructions}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <CustomButton
                  disabled={loading}
                  variant="accent"
                  size="md"
                  className="w-full"
                >
                  {loading ? "Submitting..." : "Submit VIP Request"}
                </CustomButton>
              </form>
            </AnimatedCard>
          </div>
        )}
          </div>

          <motion.div
            className="flex justify-center mt-12"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <CustomButton href={"/tourism/Booktour"} variant="primary" size="lg">
              Book Now
            </CustomButton>
          </motion.div>
        </section>

        <Footer />
      </div>
    </DarkModeProvider>
  );
}
