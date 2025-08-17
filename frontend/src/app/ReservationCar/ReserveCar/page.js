"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import carlisting from "../../../components/listingCar";
import Footer from "../../../components/Footer"; // ✅ Import Footer

export default function ReservationPages() {
  const params = useSearchParams();
  const id = parseInt(params.get("id"), 10);
  const listing = carlisting.find((item) => item.id === id);

  const [guestInfo, setGuestInfo] = useState({
    name: "",
    email: "",
    phone: "",
    paymentMethod: "chapa",
  });
  const [checkIn, setCheckIn] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [checkOut, setCheckOut] = useState(
    new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0]
  );
  const [successMessage, setSuccessMessage] = useState("");

  if (!listing) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <p className="text-xl text-red-600">Listing not found.</p>
      </div>
    );
  }

  const daysDiff = Math.max(
    1,
    Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))
  );
  const pricePerNight = parseInt(listing.price.split(" ")[0], 10);
  const totalPrice = pricePerNight * daysDiff;

  function handleChange(e) {
    const { name, value } = e.target;
    setGuestInfo((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSuccessMessage(
      `Successfully reserved ${listing.title} from ${checkIn} to ${checkOut}. Total: ${totalPrice} birr.`
    );
  }

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  return (
    <>
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 flex justify-center relative">
        {successMessage && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded shadow-lg z-50">
            {successMessage}
          </div>
        )}

        <div className="max-w-6xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-3 gap-8 p-6">
          {/* Left: Listing Info */}
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
                  Guest Favorite
                </span>
              </div>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                {listing.description}
              </p>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900 dark:text-white">
                Amenities & Features
              </h2>
              <ul className="grid grid-cols-2 gap-2 text-gray-700 dark:text-gray-300">
                <li>✔ Low Mileage</li>
                <li>✔ Accident Free</li>
                <li>✔ Full Service History</li>
                <li>✔ Fuel Efficient</li>
                <li>✔ Air Conditioning</li>
                <li>✔ Modern Safety Features</li>
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

          {/* Right: Reservation Form */}
          <aside className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 flex flex-col justify-between shadow-lg">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Your Reservation
              </h2>

              {/* Dates */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">
                  Check-in
                </label>
                <input
                  type="date"
                  name="checkIn"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  required
                  className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">
                  Check-out
                </label>
                <input
                  type="date"
                  name="checkOut"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  required
                  className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  min={checkIn}
                />
              </div>

              {/* Guest Info */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={guestInfo.name}
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
                  value={guestInfo.email}
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
                  value={guestInfo.phone}
                  onChange={handleChange}
                  placeholder="+251 9XX XXX XXX"
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
                  { value: "chapa", label: "Chapa" },
                  { value: "sentimpay", label: "SentiMPay" },
                  { value: "cbe", label: "Commercial Bank of Ethiopia (CBE)" },
                  { value: "abyssinia", label: "Abyssinia Bank" },
                  { value: "awash", label: "Awash Bank" },
                  { value: "telebirr", label: "Tele Birr" },
                  { value: "mpesa", label: "M-Pesa" },
                  { value: "soon", label: "Soon (coming)", disabled: true },
                ].map(({ value, label, disabled }) => (
                  <label
                    key={value}
                    className={`flex items-center gap-3 mb-2 cursor-pointer ${
                      disabled
                        ? "cursor-not-allowed text-gray-400 dark:text-gray-500"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={value}
                      checked={guestInfo.paymentMethod === value}
                      onChange={handleChange}
                      disabled={disabled}
                      className="form-radio text-blue-600"
                      required
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </fieldset>

              {/* Price Summary */}
              <div className="border-t border-gray-300 dark:border-gray-600 pt-4 mt-4">
                <div className="flex justify-between font-semibold text-gray-900 dark:text-white mb-2">
                  <span>
                    {daysDiff} {daysDiff === 1 ? "night" : "nights"} ×{" "}
                    {listing.price}
                  </span>
                  <span>{totalPrice} birr</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-green-700 dark:text-green-400">
                  <span>Total</span>
                  <span>{totalPrice} birr</span>
                </div>
              </div>

              <button
                type="submit"
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition duration-200"
              >
                Confirm Reservation
              </button>
            </form>

            {/* Help Section */}
            <div className="mt-6 text-sm text-gray-600 dark:text-gray-300 text-center">
              <p>Need help with your booking?</p>
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

      {/* ✅ Added Footer */}
      <Footer />
    </>
  );
}
