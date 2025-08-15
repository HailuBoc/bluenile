"use client";

import { useState } from "react";
import Image from "next/image";
import { Crown, Calendar, Map, Car, User, List } from "lucide-react";

export default function VIPTourBooking() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    travelDates: "",
    numberOfPeople: "",
    itinerary: "",
    transportType: "",
    activities: "",
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
    console.log("VIP Booking submitted:", formData);
    alert("Your VIP booking request has been submitted successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full grid md:grid-cols-2 overflow-hidden">
        {/* Left Section - Form */}
        <div className="p-6 md:p-10">
          <div className="flex items-center gap-2 mb-6">
            <Crown className="w-6 h-6 text-yellow-600" />
            <h1 className="text-2xl md:text-3xl font-bold text-yellow-700">
              VIP Custom Tour Booking
            </h1>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            Create your personalized Ethiopian luxury travel experience. Select
            your preferences and our team will handle every detail.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-yellow-500 outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-yellow-500 outline-none"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-yellow-500 outline-none"
              />
            </div>

            {/* Flexible Travel Dates */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Preferred Travel Dates
              </label>
              <input
                type="text"
                name="travelDates"
                value={formData.travelDates}
                onChange={handleChange}
                placeholder="Flexible dates allowed"
                required
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-yellow-500 outline-none"
              />
            </div>

            {/* Number of People */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Number of People
              </label>
              <input
                type="number"
                name="numberOfPeople"
                value={formData.numberOfPeople}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-yellow-500 outline-none"
              />
            </div>

            {/* Custom Itinerary */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Custom Itinerary
              </label>
              <textarea
                name="itinerary"
                value={formData.itinerary}
                onChange={handleChange}
                placeholder="Destinations, pickup time, transportation, activities..."
                rows="3"
                required
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-yellow-500 outline-none"
              ></textarea>
            </div>

            {/* Transport Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Preferred VIP Transport
              </label>
              <select
                name="transportType"
                value={formData.transportType}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-yellow-500 outline-none"
              >
                <option value="">Select transport option</option>
                <option value="Private Car">Private Car</option>
                <option value="Limo">Limousine</option>
                <option value="Luxury Bus">Luxury Bus</option>
                <option value="Helicopter">Helicopter (if available)</option>
              </select>
            </div>

            {/* Activities */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Preferred Activities
              </label>
              <textarea
                name="activities"
                value={formData.activities}
                onChange={handleChange}
                placeholder="Cultural tours, nature, adventure, relaxation..."
                rows="2"
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-yellow-500 outline-none"
              ></textarea>
            </div>

            {/* Special Requests */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Special Requests
              </label>
              <textarea
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleChange}
                rows="2"
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-yellow-500 outline-none"
              ></textarea>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    className={`border rounded-lg p-3 flex items-center gap-3 cursor-pointer transition hover:border-yellow-500 ${
                      formData.paymentMethod === pm.name
                        ? "border-yellow-500 ring-2 ring-yellow-400"
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
                    <span className="text-gray-700 font-medium">{pm.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition w-full"
            >
              Confirm VIP Booking
            </button>
          </form>
        </div>

        {/* Right Section - VIP Benefits */}
        <div className="bg-yellow-50 p-6 md:p-10 flex flex-col justify-center">
          <h2 className="text-xl font-bold text-yellow-700 mb-4 flex items-center gap-2">
            <Crown className="w-5 h-5" /> VIP Tourism Benefits
          </h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-2">
              <Map className="w-5 h-5 text-yellow-600 mt-0.5" /> Create your own
              custom itinerary.
            </li>
            <li className="flex items-start gap-2">
              <Calendar className="w-5 h-5 text-yellow-600 mt-0.5" /> Flexible
              travel dates & destinations.
            </li>
            <li className="flex items-start gap-2">
              <Car className="w-5 h-5 text-yellow-600 mt-0.5" /> VIP transport:
              private car, limo, luxury bus, or helicopter.
            </li>
            <li className="flex items-start gap-2">
              <User className="w-5 h-5 text-yellow-600 mt-0.5" /> Personal tour
              guide / concierge.
            </li>
            <li className="flex items-start gap-2">
              <List className="w-5 h-5 text-yellow-600 mt-0.5" /> Private
              booking management by our team.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
