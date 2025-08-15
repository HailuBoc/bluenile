"use client";

import { useState } from "react";
import Image from "next/image";

export default function TourBooking() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    tourDate: "",
    numberOfPeople: "",
    message: "",
    vipService: false,
    paymentMethod: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Booking submitted:", formData);
    alert("Your booking has been submitted successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg max-w-3xl w-full p-6 md:p-10">
        <h1 className="text-2xl md:text-3xl font-bold text-green-700 dark:text-green-300 mb-6 text-center">
          Book a Tour
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* Tour Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tour Date
            </label>
            <input
              type="date"
              name="tourDate"
              value={formData.tourDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* Number of People */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Number of People
            </label>
            <input
              type="number"
              name="numberOfPeople"
              value={formData.numberOfPeople}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* VIP Service */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="vipService"
              checked={formData.vipService}
              onChange={handleChange}
              className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Add VIP Service (Exclusive access, premium guide, and luxury
              transport)
            </span>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Additional Requests
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
            ></textarea>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Payment Method
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { name: "Chapa", logo: "/chapa.png" },
                { name: "CBE Bank", logo: "/cbe.png" },
                { name: "Telebirr", logo: "/telebirr.png" },
                { name: "Bank of Abyssinia", logo: "/abysinnia.png" },
                { name: "Dashen Bank", logo: "/dashen.png" },
                { name: "Awash Bank", logo: "/awash.png" },
              ].map((pm) => (
                <label
                  key={pm.name}
                  className={`border rounded-lg p-3 flex items-center gap-3 cursor-pointer transition hover:border-green-500 ${
                    formData.paymentMethod === pm.name
                      ? "border-green-500 ring-2 ring-green-400"
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
                  <Image
                    src={pm.logo}
                    alt={pm.name}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    {pm.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition w-full"
          >
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
}
