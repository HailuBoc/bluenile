"use client";

import { Cake, Home, CheckCircle, XCircle, Star, StarHalf, Star as StarOutline } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

function BirthdayBookingContent() {
  const eventName = "Birthday Party";
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  const servicesList = [
    { name: "Hall", price: 5000 },
    { name: "Photography & Videography", price: 4000 },
    { name: "Catering", price: 300 },
    { name: "Decoration", price: 2500 },
    { name: "DJ", price: 2000 },
    { name: "Car Service", price: 1500 },
    { name: "Guest Management", price: 1000 },
  ];

  const paymentMethods = [
    { name: "Chapa", logo: "/chapa.png" },
    { name: "Telebirr", logo: "/telebirr.png" },
    { name: "CBE Birr", logo: "/cbebirr.png" },
  ];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    birthdayDate: "",
    guests: "",
    selectedServices: [],
    specialRequests: "",
    paymentMethod: "",
    paymentEvidence: null,
  });

  const [status, setStatus] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  // Calculate total dynamically
  useEffect(() => {
    const servicesTotal = formData.selectedServices.reduce((acc, sName) => {
      const service = servicesList.find((s) => s.name === sName);
      if (!service) return acc;
      if (service.name === "Catering") {
        return acc + (parseInt(formData.guests) || 0) * service.price;
      }
      return acc + service.price;
    }, 0);
    setTotalAmount(servicesTotal);
  }, [formData.selectedServices, formData.guests]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) =>
    setFormData({ ...formData, paymentEvidence: e.target.files[0] });

  const toggleService = (service) => {
    setFormData((prev) => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(service)
        ? prev.selectedServices.filter((s) => s !== service)
        : [...prev.selectedServices, service],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ text: "", type: "" });

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("email", formData.email);
      payload.append("phone", formData.phone || "");
      payload.append("birthdayDate", formData.birthdayDate);
      payload.append("guests", formData.guests);
      payload.append("specialRequests", formData.specialRequests || "");
      payload.append("amount", totalAmount);
      payload.append(
        "selectedServices",
        JSON.stringify(formData.selectedServices)
      );
      payload.append("paymentMethod", formData.paymentMethod);

      if (
        formData.paymentEvidence &&
        ["Telebirr", "CBE Birr"].includes(formData.paymentMethod)
      ) {
        payload.append("paymentEvidence", formData.paymentEvidence);
      }

      const res = await fetch(`${BASE_URL}/birthdays`, {
        method: "POST",
        body: payload,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed");

      setStatus({
        text: "✅ Booking submitted successfully!",
        type: "success",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        birthdayDate: "",
        guests: "",
        selectedServices: [],
        specialRequests: "",
        paymentMethod: "",
        paymentEvidence: null,
      });
      setTotalAmount(0);
    } catch (err) {
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
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <Cake className="w-5 h-5 text-white" />
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
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-orange-500/10 to-amber-500/10 dark:from-yellow-400/20 dark:via-orange-500/20 dark:to-amber-500/20" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Birthday Party Celebration
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Fun, festive, and unforgettable celebrations 🎉
            </p>
            <div className="mt-4 flex justify-center gap-1">
              {renderStars(4.7)}
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                (4.7) • 1,820+ happy birthdays
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8">
          <h3 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
            Book Your Birthday Party
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
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                />
                <input
                  type="date"
                  name="birthdayDate"
                  value={formData.birthdayDate}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <input
                type="number"
                name="guests"
                placeholder="Number of Guests"
                value={formData.guests}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                Select Services
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {servicesList.map((service) => {
                  const selected = formData.selectedServices.includes(service.name);
                  return (
                    <div
                      key={service.name}
                      onClick={() => toggleService(service.name)}
                      className={`flex justify-between items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        selected
                          ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
                          : "border-gray-300 dark:border-gray-600 hover:border-yellow-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded border-2 ${selected ? "bg-yellow-500 border-yellow-500" : "border-gray-300 dark:border-gray-600"}`}>
                          {selected && (
                            <svg className="w-full h-full text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {service.name}
                        </span>
                      </div>
                      <span className="text-yellow-600 dark:text-yellow-400 font-semibold">
                        {service.name === "Catering"
                          ? `${service.price} ETB / guest`
                          : `${service.price} ETB`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Total Amount */}
            {totalAmount > 0 && (
              <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    💰 Total Payment
                  </span>
                  <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
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
                      required
                    />
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
                        {method.name.toUpperCase().slice(0, 3)}
                      </span>
                    </div>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {method.name}
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
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            )}

            {/* Special Requests */}
            <div>
              <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                Special Requests (Optional)
              </h4>
              <textarea
                name="specialRequests"
                placeholder="Tell us about your dream birthday party..."
                value={formData.specialRequests}
                onChange={handleChange}
                rows={4}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-4 rounded-xl font-bold hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? "Processing..." : "Submit Birthday Booking"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default function BirthdaysPage() {
  return <BirthdayBookingContent />;
}
