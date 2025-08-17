"use client";

import { useState } from "react";
import Image from "next/image";

export default function PropertyBooking() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    propertyType: "",
    checkInDate: "",
    checkOutDate: "",
    numberOfGuests: "",
    specialRequests: "",
    paymentMethod: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Property rental booking submitted:", formData);
    alert("Your property booking has been submitted successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg max-w-3xl w-full p-6 md:p-10">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-700 dark:text-blue-300 mb-6 text-center">
          Book a Property Rental
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
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
              className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
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
              className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
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
              className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Property Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Property Type
            </label>
            <select
              name="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select property type</option>
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
              <option value="Villa">Villa</option>
              <option value="Condo">Condo</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Check-in Date
              </label>
              <input
                type="date"
                name="checkInDate"
                value={formData.checkInDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Check-out Date
              </label>
              <input
                type="date"
                name="checkOutDate"
                value={formData.checkOutDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Guests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Number of Guests
            </label>
            <input
              type="number"
              name="numberOfGuests"
              value={formData.numberOfGuests}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Special Requests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Special Requests
            </label>
            <textarea
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
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
                  className={`border rounded-lg p-3 flex items-center gap-3 cursor-pointer transition hover:border-blue-500 ${
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
            className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition w-full"
          >
            Confirm Rental Booking
          </button>
        </form>
      </div>
    </div>
  );
}
