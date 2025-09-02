"use client";
import React, { useState } from "react";

export default function ListPropertyPage() {
  const [listingType, setListingType] = useState("");
  const [propertyName, setPropertyName] = useState("");
  const [formData, setFormData] = useState({});
  const [facilities, setFacilities] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const facilityOptions = [
    "WiFi",
    "Parking",
    "Air Conditioning",
    "Swimming Pool",
    "Gym",
    "Garden",
  ];

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFacilities((prev) =>
        checked ? [...prev, name] : prev.filter((f) => f !== name)
      );
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const propertyData = {
      listingType,
      propertyName,
      ...formData,
      facilities,
    };

    try {
      const res = await fetch("http://localhost:10000/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(propertyData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to post property");
      }

      setSuccessMessage("✅ Your property has been posted successfully!");
      setErrorMessage("");
      // Reset form
      setFormData({});
      setFacilities([]);
      setListingType("");
      setPropertyName("");
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      console.error(err);
      setErrorMessage("❌ " + err.message);
    }
  };

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
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10">
        {/* Left: Form */}
        <div className="bg-gray-800 p-8 rounded-2xl shadow text-white">
          <h2 className="text-xl font-semibold mb-6">
            Tell us about your property
          </h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Listing Purpose */}
            {/* User Email */}
            <div>
              <label className="block mb-2 font-medium">Your Email</label>
              <input
                type="email"
                name="userEmail"
                placeholder="Enter your email"
                value={formData.userEmail || ""}
                onChange={handleChange}
                className="w-full border border-gray-500 bg-gray-900 rounded p-3 text-white mb-4"
                required
              />
            </div>

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

            {/* Property Type & Address */}
            <div>
              <label className="block mb-2 font-medium">Property Type</label>
              <select
                className="w-full border border-gray-500 bg-gray-900 text-gray-300 rounded p-3 mb-4"
                value={propertyName}
                onChange={(e) => setPropertyName(e.target.value)}
              >
                <option value="">Select Property</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="guesthouse">Guesthouse</option>
                <option value="car">Car</option>
                <option value="land">Land</option>
                <option value="office">Office Space</option>
                <option value="shop">Shop</option>
              </select>

              <input
                type="text"
                name="address"
                placeholder="Address / Location"
                value={formData.address || ""}
                onChange={handleChange}
                className="w-full border border-gray-500 bg-gray-900 rounded p-3 text-white mb-4"
              />
            </div>

            {/* Conditional Fields for Rooms */}
            {["apartment", "house", "villa", "guesthouse"].includes(
              propertyName
            ) && (
              <>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Rooms</h3>
                  <input
                    type="number"
                    name="bedrooms"
                    placeholder="Number of Bedrooms"
                    value={formData.bedrooms || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-500 bg-gray-900 rounded p-3 text-white mb-3"
                  />
                  <input
                    type="number"
                    name="bathrooms"
                    placeholder="Number of Bathrooms"
                    value={formData.bathrooms || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-500 bg-gray-900 rounded p-3 text-white"
                  />
                </div>

                {/* Facilities */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Facilities</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {facilityOptions.map((facility, i) => (
                      <label key={i} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name={facility}
                          checked={facilities.includes(facility)}
                          onChange={handleChange}
                          className="accent-blue-600"
                        />
                        <span>{facility}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Additional conditional fields for Car, Land, Rent Term, Pricing */}
            {/* You can keep your existing input structure here */}
            {propertyName === "car" && (
              <>
                <input
                  type="text"
                  name="carModel"
                  placeholder="Car Model"
                  value={formData.carModel || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-500 bg-gray-900 rounded p-3 text-white mb-3"
                />
                <input
                  type="number"
                  name="year"
                  placeholder="Year"
                  value={formData.year || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-500 bg-gray-900 rounded p-3 text-white mb-3"
                />
                <input
                  type="number"
                  name="mileage"
                  placeholder="Mileage (km)"
                  value={formData.mileage || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-500 bg-gray-900 rounded p-3 text-white mb-3"
                />
                <select
                  name="fuelType"
                  value={formData.fuelType || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-500 bg-gray-900 text-gray-300 rounded p-3"
                >
                  <option value="" disabled>
                    Fuel Type
                  </option>
                  <option>Petrol</option>
                  <option>Diesel</option>
                  <option>Electric</option>
                  <option>Hybrid</option>
                </select>
              </>
            )}

            {propertyName === "land" && (
              <input
                type="number"
                name="landSize"
                placeholder="Land Size (sq. meters)"
                value={formData.landSize || ""}
                onChange={handleChange}
                className="w-full border border-gray-500 bg-gray-900 rounded p-3 text-white"
              />
            )}

            {listingType === "rent" && (
              <select
                name="rentTerm"
                value={formData.rentTerm || ""}
                onChange={handleChange}
                className="w-full border border-gray-500 bg-gray-900 text-gray-300 rounded p-3"
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

            <div>
              <h3 className="text-lg font-semibold mb-3">Pricing</h3>
              <input
                type="number"
                name="price"
                placeholder={
                  listingType === "sale" ? "Sale Price (BIRR)" : "Price (Birr)"
                }
                value={formData.price || ""}
                onChange={handleChange}
                className="w-full border border-gray-500 bg-gray-900 rounded p-3 text-white"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Post Property
            </button>

            {/* Success / Error Messages */}
            {successMessage && (
              <p className="mt-4 text-green-400 font-semibold text-center">
                {successMessage}
              </p>
            )}
            {errorMessage && (
              <p className="mt-4 text-red-400 font-semibold text-center">
                {errorMessage}
              </p>
            )}
          </form>
        </div>

        {/* Right Side Info */}
        <aside className="bg-gray-100 p-8 rounded-2xl shadow text-gray-900 flex flex-col justify-between">
          <div>
            <h3 className="text-lg text-blue-950 font-semibold mb-4">
              Why list with us?
            </h3>
            <ul className="space-y-3">
              <li>✔ Reach millions of guests worldwide</li>
              <li>✔ Secure and reliable payments</li>
              <li>✔ Easy-to-use property management tools</li>
              <li>✔ 24/7 customer support</li>
            </ul>
          </div>
          <div className="mt-8 flex justify-center">
            <img
              src="/oppp.jpg"
              alt="Promo"
              className="rounded-xl shadow-md w-11/12 lg:w-3/4"
            />
          </div>
        </aside>
      </main>
    </div>
  );
}
