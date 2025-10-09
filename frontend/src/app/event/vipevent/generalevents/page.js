"use client";

import { Briefcase, CheckCircle, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";

export default function GeneralEventsReservationPage() {
  const eventName = "Luxury Corporate & General Events";
  const eventIcon = (
    <Briefcase className="w-12 h-12 mx-auto mb-4 text-blue-500" />
  );

  const serviceOptions = [
    { name: "Luxury Event Hall / Meeting Room", price: 10000 },
    { name: "Audio-Visual Setup", price: 5000 },
    { name: "Professional Photography & Videography", price: 5000 },
    { name: "Gourmet Catering", price: 500 }, // per guest
    { name: "Luxury Decoration & Branding", price: 6000 },
    { name: "Event Coordinator & VIP Staff", price: 3000 },
    { name: "VIP Transportation Service", price: 2500 },
    { name: "Guest Management & Registration", price: 2000 },
  ];

  const paymentMethods = [
    { name: "Chapa", logo: "/chapa.png" },
    { name: "Telebirr", logo: "/telebirr.png" },
    { name: "M-Pesa", logo: "/mpesa.png" },
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
  });

  const [status, setStatus] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  // Calculate total amount dynamically
  useEffect(() => {
    const total = formData.selectedServices.reduce((acc, sName) => {
      const service = serviceOptions.find((s) => s.name === sName);
      if (!service) return acc;
      if (service.name.includes("Catering")) {
        return acc + (parseInt(formData.guests) || 0) * service.price;
      }
      return acc + service.price;
    }, 0);
    setTotalAmount(total);
  }, [formData.selectedServices, formData.guests]);

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
      const bookingRes = await axios.post(`${API_BASE}/vip/generalevents`, {
        ...formData,
        selectedServices: formData.selectedServices,
        totalAmount,
      });

      const booking = bookingRes.data.booking;
      const bookingId = booking._id;

      // 2️⃣ Trigger selected payment
      const payRes = await axios.post(
        `${API_BASE}/bookings/pay/${formData.paymentMethod.toLowerCase()}`,
        {
          amount: totalAmount,
          currency: "ETB",
          email: formData.email,
          fullName: formData.name,
          bookingId,
          phone: formData.phone,
        }
      );

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
        text: `❌ ${err.response?.data?.error || err.message}`,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 text-center px-4">
        {eventIcon}
        <h1 className="text-4xl font-bold">{eventName}</h1>
        <p className="mt-2 text-lg">
          Plan and book your VIP event with ease 🎉
        </p>
      </header>

      <section className="bg-white py-12 px-4 max-w-3xl mx-auto shadow-lg rounded-xl -mt-8">
        <h2 className="text-2xl font-bold text-center mb-6">Book Your Event</h2>

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

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg text-black"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg text-black"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg text-black"
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg text-black"
          />
          <input
            type="number"
            name="guests"
            placeholder="Number of Guests"
            value={formData.guests}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg text-black"
          />

          {/* Services */}
          <div className="space-y-2">
            <p className="font-medium text-black">Select Services:</p>
            {serviceOptions.map((service) => (
              <label
                key={service.name}
                className="flex items-center gap-2 border p-2 rounded-lg cursor-pointer text-black"
              >
                <input
                  type="checkbox"
                  checked={formData.selectedServices.includes(service.name)}
                  onChange={() => toggleService(service.name)}
                />
                {service.name} —{" "}
                {service.name.includes("Catering")
                  ? `${service.price} ETB / guest`
                  : `${service.price} ETB`}
              </label>
            ))}
          </div>

          {totalAmount > 0 && (
            <div className="p-4 bg-yellow-100 border border-yellow-300 rounded-lg text-black font-semibold">
              💰 Total Payment: {totalAmount} ETB
            </div>
          )}

          {/* Payment */}
          <div>
            <p className="font-medium mb-2">Select Payment Method:</p>
            <div className="flex gap-4">
              {paymentMethods.map((method) => (
                <label
                  key={method.name}
                  className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer ${
                    formData.paymentMethod === method.name
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300"
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
                  <Image
                    src={method.logo}
                    alt={method.name}
                    width={40}
                    height={40}
                  />
                  {method.name}
                </label>
              ))}
            </div>
          </div>

          <textarea
            name="specialRequests"
            placeholder="Special Requests (Optional)"
            value={formData.specialRequests}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg text-black"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Processing..." : "Submit Booking"}
          </button>
        </form>
      </section>
    </div>
  );
}
