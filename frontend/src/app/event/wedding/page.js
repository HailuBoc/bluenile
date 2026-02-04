"use client";

import { Heart, Home, CheckCircle, XCircle, MapPin, Star, StarHalf, Star as StarOutline } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";

function WeddingBookingContent() {
  const eventName = "Wedding Booking";
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:10000";

  const marriageTypes = {
    Modern: [
      { name: "Luxury Venue", price: 8000 },
      { name: "Premium Decoration", price: 5000 },
      { name: "Photography & Videography", price: 4000 },
      { name: "Gourmet Catering", price: 600 },
      { name: "DJ & Entertainment", price: 3500 },
    ],
    Traditional: [
      { name: "Cultural Venue", price: 6000 },
      { name: "Traditional Decoration", price: 4000 },
      { name: "Cultural Band", price: 3000 },
      { name: "Traditional Food & Catering", price: 400 },
      { name: "Outfit Rental", price: 2500 },
    ],
    Religious: [
      { name: "Religious Hall / Church", price: 5000 },
      { name: "Decoration & Floral Setup", price: 3500 },
      { name: "Choir & Ceremony Music", price: 2500 },
      { name: "Catering & Reception", price: 500 },
      { name: "Photography", price: 3000 },
    ],
  };

  const paymentMethods = [
    { name: "chapa", logo: "/chapa.png" },
    { name: "telebirr", logo: "/telebirr.png" },
    { name: "mpesa", logo: "/mpesa.png" },
  ];

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    guests: "",
    marriageType: "",
    selectedServices: [],
    specialRequests: "",
    paymentMethod: "",
  });

  const [status, setStatus] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  // Calculate total
  useEffect(() => {
    if (!formData.marriageType) return;
    const selectedOptions = marriageTypes[formData.marriageType] || [];

    const total = formData.selectedServices.reduce((acc, sName) => {
      const service = selectedOptions.find((s) => s.name === sName);
      if (!service) return acc;
      if (service.name.toLowerCase().includes("catering")) {
        return acc + (parseInt(formData.guests) || 0) * service.price;
      }
      return acc + service.price;
    }, 0);

    setTotalAmount(total);
  }, [formData.selectedServices, formData.guests, formData.marriageType]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const toggleService = (service) => {
    setFormData((prev) => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(service)
        ? prev.selectedServices.filter((s) => s !== service)
        : [...prev.selectedServices, service],
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = "Full name is required";
    if (!formData.phone) errors.phone = "Phone number is required";
    if (!formData.email) errors.email = "Email is required";
    if (!formData.date) errors.date = "Date is required";
    if (!formData.guests) errors.guests = "Number of guests is required";
    if (!formData.marriageType) errors.marriageType = "Choose marriage type";
    if (!formData.selectedServices.length)
      errors.services = "Select at least one service";
    if (!formData.paymentMethod)
      errors.paymentMethod = "Payment method is required";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setStatus({ text: "❌ Please fill all required fields.", type: "error" });
      return;
    }

    setLoading(true);
    setStatus({ text: "", type: "" });

    try {
      // 1️⃣ Create booking
      const bookingRes = await axios.post(`${BASE_URL}/vip/weddings`, {
        ...formData,
        selectedServices: formData.selectedServices,
        totalAmount,
      });

      const booking = bookingRes.data.booking;
      const bookingId = booking._id;

      // 2️⃣ Trigger payment
      const method = formData.paymentMethod.toLowerCase();
      const payRes = await axios.post(`${BASE_URL}/bookings/pay/${method}`, {
        amount: totalAmount,
        currency: "ETB",
        email: formData.email,
        fullName: formData.name,
        bookingId,
        phone: formData.phone,
      });

      const payData = payRes.data;
      if (payData?.checkout_url) {
        setStatus({ text: "✅ Redirecting to payment...", type: "success" });
        window.location.href = payData.checkout_url;
      } else {
        throw new Error("Failed to start payment");
      }
    } catch (err) {
      console.error("Booking error:", err);
      setStatus({
        text: `❌ ${err.response?.data?.message || err.message}`,
        type: "error",
      });
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {eventName}
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

      {/* Header */}
      <header className="relative overflow-hidden py-10 sm:py-12">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-red-500/10 to-rose-500/10 dark:from-pink-500/20 dark:via-red-500/20 dark:to-rose-500/20" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Plan Your Dream Wedding
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Elegant packages for unforgettable celebrations 💍
            </p>
            <div className="mt-4 flex justify-center gap-1">
              {renderStars(4.8)}
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                (4.8) • 2,450+ happy couples
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8">
          <h3 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
            Book Your Wedding
          </h3>

          {status.text && (
            <div
              className={`flex items-center gap-2 p-3 rounded-lg text-sm mb-4 ${
                status.type === "success"
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-red-100 text-red-700 border border-red-300"
              }`}
            >
              {status.type === "success" ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <XCircle className="w-5 h-5" />
              )}
              {status.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                Personal Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                />
              </div>
              <input
                type="number"
                name="guests"
                placeholder="Number of Guests"
                value={formData.guests}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Marriage Type */}
            <div>
              <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                Marriage Type
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {Object.keys(marriageTypes).map((type) => (
                  <label
                    key={type}
                    className={`px-4 py-3 border-2 rounded-lg cursor-pointer transition-all text-center font-medium ${
                      formData.marriageType === type
                        ? "border-pink-500 bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300"
                        : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-pink-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="marriageType"
                      value={type}
                      checked={formData.marriageType === type}
                      onChange={handleChange}
                      className="hidden"
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            {/* Services */}
            {formData.marriageType && (
              <div>
                <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                  Select Services
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {marriageTypes[formData.marriageType].map((service) => (
                    <label
                      key={service.name}
                      className={`flex items-center justify-between p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.selectedServices.includes(service.name)
                          ? "border-pink-500 bg-pink-50 dark:bg-pink-900/20"
                          : "border-gray-300 dark:border-gray-600 hover:border-pink-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={formData.selectedServices.includes(service.name)}
                          onChange={() => toggleService(service.name)}
                          className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
                        />
                        <span className="text-gray-900 dark:text-white font-medium">
                          {service.name}
                        </span>
                      </div>
                      <span className="text-pink-600 dark:text-pink-400 font-semibold">
                        {service.name.toLowerCase().includes("catering")
                          ? `${service.price} ETB / guest`
                          : `${service.price} ETB`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Total Amount */}
            {totalAmount > 0 && (
              <div className="p-4 bg-gradient-to-r from-pink-50 to-red-50 dark:from-pink-900/20 dark:to-red-900/20 border border-pink-200 dark:border-pink-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    💰 Total Payment
                  </span>
                  <span className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                    {totalAmount} ETB
                  </span>
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div>
              <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                Payment Method
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {paymentMethods.map((method) => (
                  <label
                    key={method.name}
                    className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.paymentMethod === method.name
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                        : "border-gray-300 dark:border-gray-600 hover:border-green-300"
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
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
                        {method.name.toUpperCase().slice(0, 3)}
                      </span>
                    </div>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {method.name.toUpperCase()}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Special Requests */}
            <div>
              <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                Special Requests (Optional)
              </h4>
              <textarea
                name="specialRequests"
                placeholder="Tell us about your dream wedding..."
                value={formData.specialRequests}
                onChange={handleChange}
                rows={4}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-4 rounded-xl font-bold hover:from-pink-600 hover:to-red-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? "Processing..." : "Submit Wedding Booking"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default function WeddingBookingPage() {
  return <WeddingBookingContent />;
}
