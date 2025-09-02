"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import listings from "../../../../components/listingsData";
import Footer from "../../../../components/Footer";

export default function HouseSalePage() {
  const params = useSearchParams();
  const id = parseInt(params.get("id"), 10);
  const listing = listings.find((item) => item.id === id);

  const [buyerInfo, setBuyerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    paymentMethod: "bank-transfer",
  });
  const [offerPrice, setOfferPrice] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  if (!listing) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <p className="text-xl text-red-600">House not found.</p>
      </div>
    );
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setBuyerInfo((prev) => ({ ...prev, [name]: value }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      listingId: listing.id,
      listingTitle: listing.title,
      ...buyerInfo,
      offerPrice,
    };

    try {
      const res = await fetch("http://localhost:10000/houses/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("❌ Server did not return JSON: " + text);
      }

      if (!res.ok) {
        throw new Error(data.error || data.message || "Submission failed");
      }

      setSuccessMessage("✅ Interest submitted successfully!");
      setErrorMessage("");

      // Reset form after submission
      setBuyerInfo({
        name: "",
        email: "",
        phone: "",
        paymentMethod: "bank-transfer",
      });
      setOfferPrice("");
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message);
      setSuccessMessage("");
    }
  };

  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  return (
    <>
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 flex justify-center relative">
        {/* Floating Messages */}
        {successMessage && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded shadow-lg z-50">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded shadow-lg z-50">
            {errorMessage}
          </div>
        )}

        <div className="max-w-6xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-3 gap-8 p-6">
          {/* Left: House Info */}
          <section className="md:col-span-2 flex flex-col gap-6">
            <img
              src={listing.img}
              alt={listing.title}
              className="rounded-lg w-full h-80 object-cover shadow"
            />

            <div>
              <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
                {listing.title}
              </h1>
              <p className="text-blue-600 dark:text-blue-400 text-sm mt-1">
                {listing.location}
              </p>
              <div className="flex items-center mt-2 space-x-2">
                <span className="text-yellow-400 font-semibold">
                  {listing.rating} ★
                </span>
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  Popular Listing
                </span>
              </div>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                {listing.description}
              </p>
            </div>

            {/* Property Details */}
            <div>
              <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900 dark:text-white">
                Property Details
              </h2>
              <ul className="grid grid-cols-2 gap-2 text-gray-700 dark:text-gray-300">
                <li>✔ 3 Bedrooms</li>
                <li>✔ 2 Bathrooms</li>
                <li>✔ Spacious Living Room</li>
                <li>✔ Modern Kitchen</li>
                <li>✔ Private Garage</li>
                <li>✔ Large Backyard</li>
                <li>✔ Balcony with View</li>
                <li>✔ Secure Neighborhood</li>
              </ul>
            </div>

            {/* Map */}
            <div>
              <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900 dark:text-white">
                Location
              </h2>
              <iframe
                title="Map"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  listing.location
                )}&output=embed`}
                className="w-full h-48 rounded-lg shadow"
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </section>

          {/* Right: Buyer Form */}
          <aside className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 flex flex-col justify-between shadow-lg">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Express Interest
              </h2>

              {/* Buyer Info */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={buyerInfo.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={buyerInfo.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                  className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={buyerInfo.phone}
                  onChange={handleChange}
                  placeholder="+251 9XX XXX XXX"
                  required
                  className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              {/* Offer Price */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">
                  Your Offer (ETB)
                </label>
                <input
                  type="number"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                  placeholder={listing.price}
                  required
                  className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              {/* Payment Methods */}
              <fieldset className="border border-gray-300 dark:border-gray-600 rounded-md p-4 max-h-48 overflow-auto">
                <legend className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                  Payment Method
                </legend>
                {[
                  { value: "bank-transfer", label: "Bank Transfer" },
                  { value: "cash", label: "Cheque" },
                ].map(({ value, label }) => (
                  <label
                    key={value}
                    className="flex items-center gap-3 mb-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={value}
                      checked={buyerInfo.paymentMethod === value}
                      onChange={handleChange}
                      className="form-radio text-blue-600"
                      required
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </fieldset>

              <button
                type="submit"
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition duration-200"
              >
                Submit Interest
              </button>
            </form>

            {/* Help Section */}
            <div className="mt-6 text-sm text-gray-600 dark:text-gray-300 text-center">
              <p>Need help with this property?</p>
              <p>
                Call us at{" "}
                <a
                  href="tel:+251900000000"
                  className="text-blue-600 dark:text-blue-400 underline"
                >
                  +251 900 000 000
                </a>
              </p>
              <p>
                or email{" "}
                <a
                  href="mailto:support@example.com"
                  className="text-blue-600 dark:text-blue-400 underline"
                >
                  support@example.com
                </a>
              </p>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </>
  );
}
