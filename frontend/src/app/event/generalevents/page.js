"use client";

import { Calendar, Home, CheckCircle, XCircle, Star, StarHalf, Star as StarOutline } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

function GeneralEventsContent() {
  const eventName = "General Events";
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  const serviceOptions = [
    "Event Hall / Meeting Room",
    "Audio-Visual Setup",
    "Photography & Videography",
    "Catering",
    "Decoration & Branding",
    "Event Coordinator & Staff Support",
    "Transportation Service",
    "Guest Management & Registration Desk",
  ];

  const paymentMethods = [
    { name: "Chapa", logo: "/chapa.png" },
    { name: "CBE Birr", logo: "/cbebirr.png" },
    { name: "Telebirr", logo: "/telebirr.png" },
  ];

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    guests: "",
    services: [],
    specialRequests: "",
    paymentMethod: "",
    paymentEvidence: null,
  });

  const [amount, setAmount] = useState(0);
  const [status, setStatus] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  // Calculate total dynamically
  useEffect(() => {
    const guestCost = formData.guests ? parseInt(formData.guests) * 200 : 0;
    const serviceCost = formData.services.length * 500; // adjust per service
    setAmount(guestCost + serviceCost);
  }, [formData.guests, formData.services]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (service) => {
    setFormData((prev) => {
      const exists = prev.services.includes(service);
      return {
        ...prev,
        services: exists
          ? prev.services.filter((s) => s !== service)
          : [...prev.services, service],
      };
    });
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, paymentEvidence: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = [];
    if (!formData.name) errors.push("Full Name");
    if (!formData.phone) errors.push("Phone Number");
    if (!formData.email) errors.push("Email");
    if (!formData.date) errors.push("Date");
    if (!formData.guests) errors.push("Number of Guests");
    if (!formData.paymentMethod) errors.push("Payment Method");

    if (
      (formData.paymentMethod === "Telebirr" ||
        formData.paymentMethod === "CBE Birr") &&
      !formData.paymentEvidence
    ) {
      setStatus({ text: "❌ Please upload payment evidence.", type: "error" });
      return;
    }

    if (errors.length > 0) {
      setStatus({
        text: `❌ Missing required fields: ${errors.join(", ")}`,
        type: "error",
      });
      return;
    }

    if (amount <= 0) {
      setStatus({ text: "❌ Amount must be greater than 0.", type: "error" });
      return;
    }

    setLoading(true);
    setStatus({ text: "", type: "" });

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "services") payload.append(key, JSON.stringify(value));
        else if (value) payload.append(key, value);
      });
      payload.append("amount", amount);

      // Save booking
      const res = await fetch(`${BASE_URL}/general-events`, {
        method: "POST",
        body: payload,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Booking failed");

      const bookingId = data.booking._id;

      // Handle Chapa payment
      if (formData.paymentMethod === "Chapa") {
        const payRes = await fetch(`${BASE_URL}/general-events/pay/chapa`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount,
            currency: "ETB",
            email: formData.email,
            fullName: formData.name,
            bookingId,
          }),
        });

        const payData = await payRes.json();
        if (payData?.checkout_url) {
          window.location.href = payData.checkout_url;
          return;
        } else {
          setStatus({
            text: "❌ Failed to start Chapa payment",
            type: "error",
          });
        }
      } else {
        setStatus({
          text: `✅ Booking submitted! Please pay ${amount} ETB via ${formData.paymentMethod} and upload evidence.`,
          type: "success",
        });
      }

      // Reset
      setFormData({
        name: "",
        phone: "",
        email: "",
        date: "",
        guests: "",
        services: [],
        specialRequests: "",
        paymentMethod: "",
        paymentEvidence: null,
      });
      setAmount(0);
    } catch (err) {
      console.error(err);
      setStatus({ text: `❌ ${err.message}`, type: "error" });
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
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
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
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-blue-500/20 dark:via-indigo-500/20 dark:to-purple-500/20" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              General Events & Conferences
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Organize conferences, workshops, and special gatherings with ease
            </p>
            <div className="mt-4 flex justify-center gap-1">
              {renderStars(4.6)}
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                (4.6) • 980+ successful events
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8">
          <h3 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
            Book Your Event
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
                Event Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <input
                type="number"
                name="guests"
                placeholder="Number of Guests"
                value={formData.guests}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                Select Services
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {serviceOptions.map((service, i) => (
                  <label
                    key={i}
                    className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.services.includes(service)
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-300 dark:border-gray-600 hover:border-blue-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.services.includes(service)}
                      onChange={() => handleServiceChange(service)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-900 dark:text-white font-medium">
                      {service}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Special Requests */}
            <div>
              <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                Special Requests
              </h4>
              <textarea
                name="specialRequests"
                placeholder="Tell us about your event requirements..."
                value={formData.specialRequests}
                onChange={handleChange}
                rows={4}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            {/* Total Amount */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  💰 Total Amount
                </span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {amount} ETB
                </span>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                Payment Method
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {paymentMethods.map((pm) => (
                  <label
                    key={pm.name}
                    className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.paymentMethod === pm.name
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                        : "border-gray-300 dark:border-gray-600 hover:border-green-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={pm.name}
                      checked={formData.paymentMethod === pm.name}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
                        {pm.name.toUpperCase().slice(0, 3)}
                      </span>
                    </div>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {pm.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Payment Evidence */}
            {(formData.paymentMethod === "Telebirr" ||
              formData.paymentMethod === "CBE Birr") && (
              <div>
                <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                  Upload Payment Receipt
                </h4>
                <input
                  type="file"
                  name="paymentEvidence"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-xl font-bold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? "Processing..." : "Submit Booking & Pay"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default function GeneralEventsPage() {
  return <GeneralEventsContent />;
}
