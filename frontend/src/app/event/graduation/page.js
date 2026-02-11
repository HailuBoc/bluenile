"use client";

import { GraduationCap, Home, CheckCircle, XCircle, Star, StarHalf, Star as StarOutline } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

function GraduationBookingContent() {
  const eventName = "Graduation Event";
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  const serviceOptions = [
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
    { name: "CBE Birr", logo: "/cbe.png" },
  ];

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    guests: "",
    selectedServices: [],
    specialRequests: "",
    paymentMethod: "",
    paymentEvidence: null,
  });

  const [status, setStatus] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  // Calculate total
  useEffect(() => {
    const servicesTotal = formData.selectedServices.reduce((acc, sName) => {
      const service = serviceOptions.find((s) => s.name === sName);
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

  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = "Full name is required";
    if (!formData.phone) errors.phone = "Phone number is required";
    if (!formData.email) errors.email = "Email is required";
    if (!formData.date) errors.date = "Date is required";
    if (!formData.guests) errors.guests = "Number of guests is required";
    if (!formData.selectedServices.length)
      errors.services = "Select at least one service";
    if (!formData.paymentMethod)
      errors.paymentMethod = "Payment method is required";
    if (
      (formData.paymentMethod === "Telebirr" ||
        formData.paymentMethod === "CBE Birr") &&
      !formData.paymentEvidence
    ) {
      errors.paymentEvidence = "Please upload payment evidence";
    }
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
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "selectedServices") form.append(key, JSON.stringify(value));
        else if (value) form.append(key, value);
      });
      form.append("totalAmount", totalAmount);

      const res = await fetch(`${BASE_URL}/graduations`, {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed");

      const bookingId = data.booking._id;

      if (formData.paymentMethod === "Chapa") {
        const payRes = await fetch(`${BASE_URL}/bookings/pay/chapa`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: totalAmount,
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
          throw new Error("❌ Failed to start Chapa payment");
        }
      } else {
        setStatus({
          text: "✅ Booking submitted! Please upload payment receipt.",
          type: "success",
        });
      }

      // Reset form
      setFormData({
        name: "",
        phone: "",
        email: "",
        date: "",
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
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
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
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-teal-500/10 dark:from-green-500/20 dark:via-emerald-500/20 dark:to-teal-500/20" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Graduation Celebration
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Plan and book your graduation event with ease 🎓
            </p>
            <div className="mt-4 flex justify-center gap-1">
              {renderStars(4.9)}
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                (4.9) • 1,340+ successful graduations
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8">
          <h3 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
            Book Your Graduation
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
                Graduate Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>
              <input
                type="number"
                name="guests"
                placeholder="Number of Guests"
                value={formData.guests}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                Select Services
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {serviceOptions.map((service) => (
                  <label
                    key={service.name}
                    className={`flex items-center justify-between p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.selectedServices.includes(service.name)
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                        : "border-gray-300 dark:border-gray-600 hover:border-green-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.selectedServices.includes(service.name)}
                        onChange={() => toggleService(service.name)}
                        className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                      />
                      <span className="text-gray-900 dark:text-white font-medium">
                        {service.name}
                      </span>
                    </div>
                    <span className="text-green-600 dark:text-green-400 font-semibold">
                      {service.name === "Catering"
                        ? `${service.price} ETB / guest`
                        : `${service.price} ETB`}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Total Amount */}
            {totalAmount > 0 && (
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    💰 Total Payment
                  </span>
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
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
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
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
                placeholder="Tell us about your graduation celebration needs..."
                value={formData.specialRequests}
                onChange={handleChange}
                rows={4}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? "Processing..." : "Submit Graduation Booking"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default function GraduationsPage() {
  return <GraduationBookingContent />;
}
