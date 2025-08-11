"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import listings from "../../components/listingsData";

export default function ReservationPage() {
  const params = useSearchParams();
  const id = parseInt(params.get("id"), 10);
  const listing = listings.find((item) => item.id === id);

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
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 flex justify-center">
      {/* Success Banner */}
      {successMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded shadow-lg text-sm sm:text-base z-50 text-center">
          {successMessage}
        </div>
      )}

      <div className="w-full max-w-6xl bg-white dark:bg-gray-800 rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 p-4 sm:p-6">
        {/* Left: Listing Info */}
        <section className="md:col-span-2 flex flex-col gap-4 sm:gap-6">
          <img
            src={listing.image}
            alt={listing.title}
            className="rounded-lg w-full max-h-72 sm:max-h-80 object-cover shadow"
          />
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white">
              {listing.title}
            </h1>
            <p className="text-blue-600 dark:text-blue-400 text-sm mt-1">
              {listing.location}
            </p>
            <div className="flex items-center mt-2 space-x-2 text-sm sm:text-base">
              <span className="text-yellow-400 font-semibold">
                {listing.rating} ★
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                Guest Favorite
              </span>
            </div>
            <p className="mt-3 sm:mt-4 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
              {listing.description}
            </p>
          </div>
        </section>

        {/* Right: Reservation Form */}
        <aside className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 sm:p-6 flex flex-col justify-between shadow-lg">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              Your Reservation
            </h2>

            {/* Dates */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium text-sm sm:text-base">
                Check-in
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                required
                className="w-full p-2 text-sm sm:text-base rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium text-sm sm:text-base">
                Check-out
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                required
                className="w-full p-2 text-sm sm:text-base rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                min={checkIn}
              />
            </div>

            {/* Guest Info */}
            {["name", "email", "phone"].map((field) => (
              <div key={field}>
                <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium text-sm sm:text-base capitalize">
                  {field === "phone" ? "Phone Number" : field}
                </label>
                <input
                  type={
                    field === "email"
                      ? "email"
                      : field === "phone"
                      ? "tel"
                      : "text"
                  }
                  name={field}
                  value={guestInfo[field]}
                  onChange={handleChange}
                  placeholder={
                    field === "phone"
                      ? "+251 9XX XXX XXX"
                      : field === "email"
                      ? "john@example.com"
                      : "John Doe"
                  }
                  required
                  className="w-full p-2 text-sm sm:text-base rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            ))}

            {/* Payment Methods */}
            <fieldset className="border border-gray-300 dark:border-gray-600 rounded-md p-3 sm:p-4 max-h-40 sm:max-h-48 overflow-auto">
              <legend className="text-gray-700 dark:text-gray-300 font-medium mb-2 text-sm sm:text-base">
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
                  className={`flex items-center gap-2 mb-2 text-sm sm:text-base ${
                    disabled
                      ? "cursor-not-allowed text-gray-400 dark:text-gray-500"
                      : "cursor-pointer"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={value}
                    checked={guestInfo.paymentMethod === value}
                    onChange={handleChange}
                    disabled={disabled}
                  />
                  {label}
                </label>
              ))}
            </fieldset>

            {/* Price Summary */}
            <div className="border-t border-gray-300 dark:border-gray-600 pt-3 sm:pt-4 mt-3 sm:mt-4 text-sm sm:text-base">
              <div className="flex justify-between font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">
                <span>
                  {daysDiff} {daysDiff === 1 ? "night" : "nights"} ×{" "}
                  {listing.price}
                </span>
                <span>{totalPrice} birr</span>
              </div>
              <div className="flex justify-between font-bold text-green-700 dark:text-green-400">
                <span>Total</span>
                <span>{totalPrice} birr</span>
              </div>
            </div>

            <button
              type="submit"
              className="mt-4 sm:mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 sm:py-3 rounded-md transition"
            >
              Confirm Reservation
            </button>
          </form>
        </aside>
      </div>
    </main>
  );
}
