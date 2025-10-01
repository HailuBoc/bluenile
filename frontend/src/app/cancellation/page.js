"use client";

import { useState } from "react";

export default function CancellationPage() {
  const [form, setForm] = useState({
    bookingType: "",
    phoneNumber: "",
    userEmail: "",
    reason: "",
  });

  const [message, setMessage] = useState(null);

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:10000";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.bookingType ||
      !form.phoneNumber ||
      !form.userEmail ||
      !form.reason
    ) {
      setMessage({ type: "error", text: "Please fill in all fields." });
      return;
    }

    try {
      const res = await fetch(`${backendUrl}/cancellations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to submit cancellation.");

      setMessage({ type: "success", text: "Cancellation request submitted!" });
      setForm({ bookingType: "", phoneNumber: "", userEmail: "", reason: "" });
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: err.message });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-6">Cancel Your Booking</h1>

      {message && (
        <div
          className={`mb-4 p-3 rounded ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md grid gap-4"
      >
        <label className="flex flex-col text-gray-700">
          Booking Type
          <select
            name="bookingType"
            value={form.bookingType}
            onChange={handleChange}
            className="border p-2 rounded mt-1"
          >
            <option value="">Select Type</option>
            <option value="Property Rental">Property Rental</option>
            <option value="Event">Event</option>
            <option value="Transport Service">Transport Service</option>
            <option value="Sales">Sales</option>
            <option value="Tourism">Tourism</option>
          </select>
        </label>

        <label className="flex flex-col text-gray-700">
          Phone Number
          <input
            type="text"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            placeholder="Enter your phone number"
            className="border p-2 rounded mt-1"
            required
          />
        </label>

        <label className="flex flex-col text-gray-700">
          Email
          <input
            type="email"
            name="userEmail"
            value={form.userEmail}
            onChange={handleChange}
            placeholder="Enter your email"
            className="border p-2 rounded mt-1"
            required
          />
        </label>

        <label className="flex flex-col text-gray-700">
          Reason for Cancellation
          <textarea
            name="reason"
            value={form.reason}
            onChange={handleChange}
            placeholder="Explain why you want to cancel"
            className="border p-2 rounded mt-1"
            rows={4}
            required
          />
        </label>

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          Submit Cancellation
        </button>
      </form>
    </div>
  );
}
