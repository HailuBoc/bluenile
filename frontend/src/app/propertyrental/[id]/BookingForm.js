"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

export default function BookingPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loadingProperty, setLoadingProperty] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    numberOfGuests: 1,
    specialRequests: "",
    paymentMethod: "",
  });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const paymentMethods = [
    { name: "Chapa", logo: "/chapa.png" },
    { name: "Telebirr", logo: "/telebirr.png" },
    { name: "CBE Birr", logo: "/cbebirr.png" },
    { name: "M-Pesa", logo: "/mpesa.png" },
  ];

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:10000";

  // Fetch property from backend API
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch(`${backendUrl}/propertyrental/${id}`);
        if (!res.ok) throw new Error("Failed to fetch property");
        const data = await res.json();

        if (data.img) {
          data.img = `${backendUrl}/uploads/${data.img}`;
        }

        setProperty(data);
      } catch (err) {
        console.error(err);
        setProperty(null);
      } finally {
        setLoadingProperty(false);
      }
    };
    fetchProperty();
  }, [id, backendUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateNights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    const diffTime = outDate - inDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!property) return;

    const nights = calculateNights(formData.checkIn, formData.checkOut);

    // Validate required fields (no file uploads required)
    if (
      !formData.fullName ||
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

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      // Create booking (send JSON payload, no file upload)
      const bookingPayload = {
        listingId: property._id,
        listingTitle: property.title,
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        nights,
        amount: property.price || 0,
        paymentMethod: formData.paymentMethod,
        paymentStatus:
          formData.paymentMethod === "Chapa" ? "pending" : "completed",
        specialRequests: formData.specialRequests || "",
        numberOfGuests: formData.numberOfGuests || 1,
      };

      const createRes = await fetch(`${backendUrl}/propertyrental`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload),
      });

      const createData = await createRes.json();

      if (!createRes.ok || !createData?.booking?._id) {
        // Accept old shape as well (some backends return booking directly)
        const bookingId = createData?.booking?._id || createData?._id;
        if (!bookingId) {
          throw new Error(createData.error || "Booking creation failed.");
        }
      }

      const bookingId = createData?.booking?._id || createData?._id;

      // Initiate payment process (if backend supports checkout endpoint)
      const method = formData.paymentMethod.toLowerCase();
      setMessage({
        text: `Initializing ${formData.paymentMethod} payment...`,
        type: "success",
      });

      const paymentRes = await fetch(`${backendUrl}/bookings/pay/${method}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          amount: bookingPayload.amount,
          currency: "ETB",
          email: formData.email,
          fullName: formData.fullName,
          phone: formData.phone,
        }),
      });

      const paymentData = await paymentRes.json();

      // If backend returns a checkout URL, redirect
      if (paymentData?.checkout_url) {
        setMessage({ text: "Redirecting to payment...", type: "success" });
        setTimeout(() => {
          window.location.href = paymentData.checkout_url;
        }, 1200);
        return;
      }

      // If payment endpoint not available or returns success, show success message
      if (paymentRes.ok) {
        setMessage({
          text: "✅ Booking created. Follow the instructions sent to your email to complete payment (if required).",
          type: "success",
        });
      } else {
        throw new Error(paymentData?.message || "Failed to initiate payment.");
      }
    } catch (err) {
      console.error(err);
      setMessage({
        text: `❌ ${err.message || "Server error. Please try again later."}`,
        type: "error",
      });
    } finally {
      setLoading(false);
      // keep form values to allow retry or clear if desired
    }
  };

  if (loadingProperty)
    return <p className="text-center mt-10">Loading property...</p>;
  if (!property)
    return (
      <p className="text-center mt-10 text-red-600">Property not found.</p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 bg-white transition-colors duration-300 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full p-6 md:p-10">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-700 mb-2 text-center">
          Book: {property.title}
        </h1>
        <p className="text-center text-gray-600 mb-6">📍 {property.location}</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border text-black"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border text-black"
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border text-black"
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="date"
              name="checkIn"
              value={formData.checkIn}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border text-black"
              required
            />
            <input
              type="date"
              name="checkOut"
              value={formData.checkOut}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border text-black"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Payment Method
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {paymentMethods.map((pm) => (
                <label
                  key={pm.name}
                  className={`border rounded-lg p-3 flex items-center gap-3 cursor-pointer ${
                    formData.paymentMethod === pm.name
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={pm.name}
                    checked={formData.paymentMethod === pm.name}
                    onChange={handleChange}
                    className="hidden"
                    required
                  />
                  <img
                    src={pm.logo}
                    alt={pm.name}
                    className="w-10 h-10 object-contain"
                  />
                  <span>{pm.name}</span>
                </label>
              ))}
            </div>
          </div>

          <textarea
            name="specialRequests"
            placeholder="Special Requests (optional)"
            value={formData.specialRequests}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 rounded-lg border text-black"
          />

          {message.text && (
            <div
              className={`p-3 rounded-lg text-sm ${
                message.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg w-full"
          >
            {loading ? "Submitting..." : "Confirm Booking & Pay"}
          </button>
        </form>
      </div>
    </div>
  );
}
