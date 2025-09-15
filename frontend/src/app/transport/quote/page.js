"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TransportBookingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    start: "",
    end: "",
    date: "",
    passengers: 1,
    name: "",
    email: "",
    phone: "",
    specialRequests: "",
  });

  const [status, setStatus] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.start.trim()) errors.start = "Start point is required";
    if (!formData.end.trim()) errors.end = "End point is required";
    if (!formData.date.trim()) errors.date = "Date is required";
    if (!formData.name.trim()) errors.name = "Full name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ text: "", type: "" });

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setStatus({ text: Object.values(errors).join(", "), type: "error" });
      return;
    }

    setLoading(true);

    try {
      // Replace URL with your backend endpoint if needed
      const res = await fetch(
        "https://bluenile.onrender.com/transport/bookings",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Booking failed");

      setStatus({
        text: "✅ Booking request submitted successfully!",
        type: "success",
      });

      setFormData({
        start: "",
        end: "",
        date: "",
        passengers: 1,
        name: "",
        email: "",
        phone: "",
        specialRequests: "",
      });
    } catch (err) {
      setStatus({ text: `❌ ${err.message}`, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Book Your Transport
      </h1>

      {status.text && (
        <div
          className={`p-3 rounded mb-4 w-full max-w-md text-sm ${
            status.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {status.text}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md space-y-4"
      >
        <input
          type="text"
          name="start"
          placeholder="Start Point"
          value={formData.start}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded text-black"
        />
        <input
          type="text"
          name="end"
          placeholder="End Point"
          value={formData.end}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded text-black"
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded text-black"
        />
        <input
          type="number"
          name="passengers"
          min="1"
          value={formData.passengers}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded text-black"
        />
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded text-black"
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded text-black"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded text-black"
        />
        <textarea
          name="specialRequests"
          placeholder="Special Requests (optional)"
          value={formData.specialRequests}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 border rounded text-black"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded"
        >
          {loading ? "Submitting..." : "Submit Booking"}
        </button>
      </form>
    </div>
  );
}
