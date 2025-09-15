"use client";
export const dynamic = "force-dynamic";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Footer from "../../../../components/Footer";
import axios from "axios";
import { MapPin, Star, StarHalf, Star as StarOutline } from "lucide-react";

export default function ReservationPage() {
  const searchParams = useSearchParams();
  const [listing, setListing] = useState(null);
  const [error, setError] = useState(null);

  const [guestInfo, setGuestInfo] = useState({
    name: "",
    email: "",
    phone: "",
    paymentMethod: "bank_transfer",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // --- Fetch car details ---
  useEffect(() => {
    const id = searchParams.get("id");
    if (!id) return;

    const fetchCar = async () => {
      try {
        const res = await axios.get(
          `https://bluenile.onrender.com/admin/properties/${id}`
        );

        const baseUrl = "https://bluenile.onrender.com";
        const firstImage =
          Array.isArray(res.data.imageUrl) && res.data.imageUrl.length > 0
            ? res.data.imageUrl[0]
            : typeof res.data.imageUrl === "string"
            ? res.data.imageUrl
            : null;

        const imageSrc = firstImage
          ? firstImage.startsWith("http")
            ? firstImage
            : `${baseUrl}${firstImage.startsWith("/") ? "" : "/"}${firstImage}`
          : null;

        setListing({ ...res.data, imageUrl: imageSrc });
      } catch (err) {
        console.error("❌ Error fetching car:", err);
        setError("Car not found or failed to load.");
      }
    };

    fetchCar();
  }, [searchParams]);

  // Auto-hide messages
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGuestInfo((prev) => ({ ...prev, [name]: value }));
  };

  // --- Submit reservation ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!listing) return;

    setLoading(true);
    try {
      const response = await axios.post("https://bluenile.onrender.com/sales", {
        name: guestInfo.name,
        email: guestInfo.email,
        phone: guestInfo.phone,
        car: listing.carName || listing.propertyName,
        amount: listing.price,
        paymentMethod: guestInfo.paymentMethod,
      });

      setSuccessMessage(
        `✅ Successfully reserved ${
          listing.carName || listing.propertyName
        }. Price: ${listing.price} birr.`
      );

      setGuestInfo({
        name: "",
        email: "",
        phone: "",
        paymentMethod: "bank_transfer",
      });
    } catch (error) {
      console.error("❌ Reservation failed:", error.response?.data || error);
      setErrorMessage(
        error.response?.data?.message || "Reservation failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ⭐ Stars
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i)
        stars.push(<Star key={i} className="h-5 w-5 text-yellow-400" />);
      else if (rating >= i - 0.5)
        stars.push(<StarHalf key={i} className="h-5 w-5 text-yellow-400" />);
      else
        stars.push(<StarOutline key={i} className="h-5 w-5 text-gray-400" />);
    }
    return stars;
  };

  if (!listing) {
    return (
      <>
        <main className="flex items-center justify-center min-h-screen p-4">
          <p className="text-lg sm:text-xl text-red-600">
            {error || "Loading car..."}
          </p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 flex justify-center relative">
        {(successMessage || errorMessage) && (
          <div
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-4 sm:px-6 py-2 sm:py-3 rounded shadow-lg text-sm sm:text-base z-50 ${
              successMessage
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            {successMessage || errorMessage}
          </div>
        )}

        <div className="max-w-6xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 p-4 sm:p-6">
          {/* Left: Car Info */}
          <section className="md:col-span-2 flex flex-col gap-4 sm:gap-6">
            <img
              src={listing.imageUrl}
              alt={listing.carName || listing.propertyName}
              className="rounded-lg w-full h-56 sm:h-80 object-cover shadow"
            />
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white">
                {listing.carName || listing.propertyName}
              </h1>

              <p className="flex items-center text-blue-600 dark:text-blue-400 text-sm mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                {listing.location || listing.address}
              </p>

              {/* ⭐ Visual Rating */}
              <div className="flex items-center mt-2 space-x-2">
                {renderStars(listing.rating || 0)}
                <span className="text-sm text-gray-500 dark:text-gray-300">
                  ({listing.rating?.toFixed(1) || "N/A"})
                </span>
              </div>

              <p className="mt-3 sm:mt-4 text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                {listing.description}
              </p>
            </div>

            {/* Features */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mt-4 sm:mt-6 mb-2 sm:mb-3 text-gray-900 dark:text-white">
                Car Features
              </h2>
              <ul className="grid grid-cols-2 gap-2 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
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
              <h2 className="text-lg sm:text-xl font-semibold mt-4 sm:mt-6 mb-2 sm:mb-3 text-gray-900 dark:text-white">
                Location
              </h2>
              <iframe
                title="Map"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  listing.location || listing.address || "Ethiopia"
                )}&output=embed`}
                className="w-full h-48 sm:h-60 rounded-lg shadow"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </section>

          {/* Right: Reservation Form */}
          <aside className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 sm:p-6 flex flex-col justify-between shadow-lg">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3 sm:gap-4"
            >
              <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 text-gray-900 dark:text-white">
                Your Reservation
              </h2>

              {/* Guest Info */}
              {["name", "email", "phone"].map((field) => (
                <div key={field}>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1 text-sm sm:text-base font-medium capitalize">
                    {field === "name"
                      ? "Full Name"
                      : field === "email"
                      ? "Email Address"
                      : "Phone Number"}
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
                    required
                    className="w-full p-2 sm:p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm sm:text-base"
                  />
                </div>
              ))}

              {/* Payment Method */}
              <fieldset className="border border-gray-300 dark:border-gray-600 rounded-md p-3 sm:p-4 max-h-40 sm:max-h-48 overflow-auto">
                <legend className="text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base mb-1 sm:mb-2">
                  Payment Method
                </legend>
                {[
                  { value: "bank_transfer", label: "Bank Transfer" },
                  { value: "cash_cheque", label: "Cash / Cheque" },
                ].map(({ value, label }) => (
                  <label
                    key={value}
                    className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={value}
                      checked={guestInfo.paymentMethod === value}
                      onChange={handleChange}
                      className="form-radio text-blue-600"
                      required
                    />
                    <span className="text-sm sm:text-base">{label}</span>
                  </label>
                ))}
              </fieldset>

              {/* Price */}
              <div className="border-t border-gray-300 dark:border-gray-600 pt-3 sm:pt-4 mt-3 sm:mt-4">
                <div className="font-bold text-green-700 dark:text-green-400 text-base sm:text-lg text-center">
                  Car Price = {listing.price} birr
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-4 sm:mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 sm:py-3 rounded-md transition duration-200 text-sm sm:text-base"
              >
                {loading ? "Processing..." : "Confirm Reservation"}
              </button>
            </form>

            {/* Help Section */}
            <div className="mt-4 sm:mt-6 text-xs sm:text-sm text-gray-600 dark:text-gray-300 text-center">
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
      <Footer />
    </>
  );
}
