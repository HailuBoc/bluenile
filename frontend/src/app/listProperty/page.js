// src/app/list-property/page.js

"use client";
import React, { useState } from "react";

export default function ListPropertyPage() {
  const [listingType, setListingType] = useState("");

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center">
      {/* Header */}
      <header className="w-full bg-blue-950 py-4 text-white">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">List Your Property</h1>
          <button className="bg-white text-blue-700 px-4 py-2 rounded hover:bg-gray-100">
            Help
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8">
        {/* Left: Form */}
        <div className="flex-1 bg-gray-800 p-8 rounded shadow text-white">
          <h2 className="text-xl font-semibold mb-6">
            Tell us about your property
          </h2>
          <form className="space-y-6">
            {/* Listing Purpose */}
            <div>
              <label className="block mb-2 font-medium">Listing Purpose</label>
              <select
                className="w-full border border-gray-500 bg-gray-900 rounded p-3 text-white"
                value={listingType}
                onChange={(e) => setListingType(e.target.value)}
              >
                <option value="">Select Purpose</option>
                <option value="rent">For Rent</option>
                <option value="sale">For Sale</option>
                <option value="lease">For Lease</option>
                <option value="auction">For Auction</option>
              </select>
            </div>

            {/* Property Info */}
            <div>
              <input
                type="text"
                placeholder="Property Name"
                className="w-full border border-gray-500 bg-gray-900 rounded p-3 text-white mb-4"
              />
              <input
                type="text"
                placeholder="Address"
                className="w-full border border-gray-500 bg-gray-900 rounded p-3 text-white mb-4"
              />
              <select
                className="w-full border border-gray-500 bg-gray-900 text-gray-300 rounded p-3"
                defaultValue=""
              >
                <option value="" disabled>
                  Property Type
                </option>
                <option>Hotel</option>
                <option>Apartment</option>
                <option>Guesthouse</option>
                <option>Villa</option>
              </select>
            </div>

            {/* Conditional Rent Term */}
            {listingType === "rent" && (
              <select
                className="w-full border border-gray-500 bg-gray-900 text-gray-300 rounded p-3"
                defaultValue=""
              >
                <option value="" disabled>
                  Rent Term
                </option>
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
                <option>Yearly</option>
              </select>
            )}

            {/* Rooms */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Rooms</h3>
              <input
                type="number"
                placeholder="Number of Bedrooms"
                className="w-full border border-gray-500 bg-gray-900 rounded p-3 text-white mb-3"
              />
              <input
                type="number"
                placeholder="Number of Bathrooms"
                className="w-full border border-gray-500 bg-gray-900 rounded p-3 text-white"
              />
            </div>

            {/* Facilities */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Facilities</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "WiFi",
                  "Parking",
                  "Air Conditioning",
                  "Swimming Pool",
                  "Gym",
                  "Garden",
                ].map((facility, i) => (
                  <label key={i} className="flex items-center space-x-2">
                    <input type="checkbox" className="accent-blue-600" />
                    <span>{facility}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Pricing</h3>
              <input
                type="number"
                placeholder={
                  listingType === "sale" ? "Sale Price (USD)" : "Price (USD)"
                }
                className="w-full border border-gray-500 bg-gray-900 rounded p-3 text-white"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Submit Property
            </button>
          </form>
        </div>

        {/* Right: Info / Benefits */}
        <aside className="lg:w-1/3 bg-gray-200 p-8 rounded shadow text-gray-900">
          <h3 className="text-lg text-blue-950 font-semibold mb-4">
            Why list with us?
          </h3>
          <ul className="space-y-3">
            <li>✔ Reach millions of guests worldwide</li>
            <li>✔ Secure and reliable payments</li>
            <li>✔ Easy-to-use property management tools</li>
            <li>✔ 24/7 customer support</li>
          </ul>
          <div className="mt-6">
            <img src="/oppp.jpg" alt="Promo" className="rounded shadow" />
          </div>
        </aside>
      </main>
    </div>
  );
}
