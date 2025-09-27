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
    paymentEvidence: null,
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

  // ✅ Fetch property from backend API
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch(`${backendUrl}/propertyrental/${id}`);
        if (!res.ok) throw new Error("Failed to fetch property");
        const data = await res.json();

        // Add full image URL
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
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
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

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.checkIn ||
      !formData.checkOut ||
      !formData.paymentMethod ||
      (["Telebirr", "CBE Birr", "M-Pesa"].includes(formData.paymentMethod) &&
        !formData.paymentEvidence)
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
      const payload = new FormData();
      payload.append("listingId", property._id);
      payload.append("listingTitle", property.title);
      payload.append("name", formData.fullName);
      payload.append("email", formData.email);
      payload.append("phone", formData.phone);
      payload.append("checkIn", formData.checkIn);
      payload.append("checkOut", formData.checkOut);
      payload.append("nights", nights);
      payload.append("amount", property.price || 0);
      payload.append("paymentMethod", formData.paymentMethod);
      payload.append(
        "paymentStatus",
        formData.paymentMethod === "Chapa" ? "pending" : "completed"
      );
      payload.append("specialRequests", formData.specialRequests || "");
      if (["Telebirr", "CBE Birr", "M-Pesa"].includes(formData.paymentMethod)) {
        payload.append("paymentEvidence", formData.paymentEvidence);
      }

      const res = await fetch(`${backendUrl}/propertyrental`, {
        method: "POST",
        body: payload,
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({
          text: `❌ ${data.error || "Failed to create booking"}`,
          type: "error",
        });
        setLoading(false);
        return;
      }

      setMessage({
        text: `✅ Reservation ${
          formData.paymentMethod === "Chapa" ? "pending payment" : "completed"
        } successfully!`,
        type: "success",
      });

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        checkIn: "",
        checkOut: "",
        numberOfGuests: 1,
        specialRequests: "",
        paymentMethod: "",
        paymentEvidence: null,
      });
    } catch (err) {
      console.error(err);
      setMessage({
        text: "❌ Server error. Please try again later.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingProperty)
    return <p className="text-center mt-10">Loading property...</p>;
  if (!property)
    return (
      <p className="text-center mt-10 text-red-600">Property not found.</p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
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
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border text-black"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border text-black"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="date"
              name="checkIn"
              value={formData.checkIn}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border text-black"
            />
            <input
              type="date"
              name="checkOut"
              value={formData.checkOut}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border text-black"
            />
          </div>
          <textarea
            name="specialRequests"
            placeholder="Special Requests (optional)"
            value={formData.specialRequests}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 rounded-lg border text-black"
          />

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Payment Method
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {paymentMethods.map((pm) => (
                <label
                  key={pm.name}
                  className={`border rounded-lg p-3 flex items-center gap-3 cursor-pointer ${
                    formData.paymentMethod === pm.name
                      ? "border-blue-500 ring-2 ring-blue-400"
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

          {["Telebirr", "CBE Birr", "M-Pesa"].includes(
            formData.paymentMethod
          ) && (
            <div className="mt-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Upload Payment Evidence
              </label>
              <input
                type="file"
                name="paymentEvidence"
                onChange={handleChange}
                accept="image/*,application/pdf"
              />
            </div>
          )}

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
