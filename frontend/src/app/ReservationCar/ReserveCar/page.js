"use client";

// Tell Next.js to render this page dynamically (no prerender)
export const dynamic = "force-dynamic";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import carlisting from "../../../components/listingCar";
import Footer from "../../../components/Footer";

export default function ReservationPages() {
  const searchParams = useSearchParams();
  const [id, setId] = useState(null);
  const [listing, setListing] = useState(null);

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

  useEffect(() => {
    if (searchParams) {
      const paramId = parseInt(searchParams.get("id"), 10);
      setId(paramId);
      const foundListing = carlisting.find((item) => item.id === paramId);
      setListing(foundListing || null);
    }
  }, [searchParams]);

  if (!listing) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <p className="text-lg sm:text-xl text-red-600">Listing not found.</p>
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
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 flex justify-center relative">
        {successMessage && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded shadow-lg text-sm sm:text-base z-50">
            {successMessage}
          </div>
        )}

        <div className="max-w-6xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 p-4 sm:p-6">
          {/* Left: Listing Info */}
          <section className="md:col-span-2 flex flex-col gap-4 sm:gap-6">
            <img
              src={listing.img}
              alt={listing.title}
              className="rounded-lg w-full h-56 sm:h-80 object-cover shadow"
            />

            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white">
                {listing.title}
              </h1>
              <p className="text-blue-600 dark:text-blue-400 text-sm mt-1">
                {listing.location}
              </p>
              <div className="flex items-center mt-2 space-x-2">
                <span className="text-yellow-400 font-semibold text-sm sm:text-base">
                  {listing.rating} ★
                </span>
                <span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                  Guest Favorite
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
                  listing.location
                )}&output=embed`}
                className="w-full h-40 sm:h-48 rounded-lg shadow"
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </section>

          {/* Right: Reservation Form */}
          <aside className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 sm:p-6 flex flex-col justify-between shadow-lg">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3 sm:gap-4"
            >
              {/* ...rest of your form remains unchanged */}
            </form>
          </aside>
        </div>
      </main>

      <Footer />
    </>
  );
}
