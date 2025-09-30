"use client";
export const dynamic = "force-dynamic";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Footer from "../../../../components/Footer";
import axios from "axios";
import { MapPin, Star, StarHalf, Star as StarOutline } from "lucide-react";

export default function ReserveOfferPage() {
  const searchParams = useSearchParams();
  const [offer, setOffer] = useState(null);
  const [error, setError] = useState(null);

  const [guestInfo, setGuestInfo] = useState({
    name: "",
    email: "",
    phone: "",
    paymentMethod: "chapa",
    paymentEvidence: null,
  });

  const [checkIn, setCheckIn] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [checkOut, setCheckOut] = useState(
    new Date(Date.now() + 1 * 86400000).toISOString().split("T")[0]
  );

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "https://bluenile.onrender.com";

  // ✅ Fetch special offer details
  useEffect(() => {
    const id = searchParams.get("id");
    if (!id) return;

    const fetchOffer = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/special-offers/${id}`);

        const firstImage =
          Array.isArray(res.data.imageUrl) && res.data.imageUrl.length > 0
            ? res.data.imageUrl[0]
            : typeof res.data.imageUrl === "string"
            ? res.data.imageUrl
            : null;

        const imageSrc = firstImage
          ? firstImage.startsWith("http")
            ? firstImage
            : `${API_URL}${firstImage.startsWith("/") ? "" : "/"}${firstImage}`
          : null;

        setOffer({ ...res.data, imageUrl: imageSrc });
      } catch (err) {
        console.error("❌ Error fetching offer:", err);
        setError("Special offer not found or failed to load.");
      }
    };

    fetchOffer();
  }, [searchParams, API_URL]);

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
    const { name, value, files } = e.target;
    if (files) {
      setGuestInfo((prev) => ({ ...prev, paymentEvidence: files[0] }));
    } else {
      setGuestInfo((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!offer) {
      setErrorMessage("❌ Offer info missing.");
      return;
    }

    const daysDiff = Math.max(
      1,
      Math.ceil(
        (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
      )
    );
    const totalPrice = Number(offer.price || 0) * daysDiff;

    setLoading(true);

    try {
      const reservationData = {
        offerId: offer._id,
        offerTitle: offer.propertyName || offer.name,
        startDate: new Date(checkIn).toISOString(),
        endDate: new Date(checkOut).toISOString(),
        days: daysDiff,
        amount: totalPrice,
        name: guestInfo.name,
        email: guestInfo.email,
        phone: guestInfo.phone,
        paymentMethod: guestInfo.paymentMethod,
      };

      const res = await axios.post(
        `${API_URL}/specialoffers/reservations`,
        reservationData,
        { headers: { "Content-Type": "application/json" } }
      );

      const reservationId = res.data?.reservation?._id;

      if (guestInfo.paymentMethod === "chapa" && reservationId) {
        try {
          const payRes = await axios.post(`${API_URL}/bookings/pay/chapa`, {
            amount: totalPrice,
            email: guestInfo.email,
            fullName: guestInfo.name,
            bookingId: reservationId,
          });
          if (payRes.data.checkout_url) {
            window.location.href = payRes.data.checkout_url;
            return;
          } else {
            setErrorMessage("❌ Failed to initialize Chapa payment.");
            return;
          }
        } catch (err) {
          console.error("❌ Chapa error:", err);
          setErrorMessage("Chapa payment error: " + err.message);
          return;
        }
      }

      setSuccessMessage(
        `✅ Successfully reserved ${
          offer.propertyName || offer.name
        }. Total: ${totalPrice} birr via ${guestInfo.paymentMethod}.`
      );

      // Reset form
      setGuestInfo({
        name: "",
        email: "",
        phone: "",
        paymentMethod: "chapa",
        paymentEvidence: null,
      });
    } catch (err) {
      console.error("❌ Reservation failed:", err);
      setErrorMessage(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

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

  if (!offer) {
    return (
      <>
        <main className="flex items-center justify-center min-h-screen p-4">
          <p className="text-lg sm:text-xl text-red-600">
            {error || "Loading..."}
          </p>
        </main>
        <Footer />
      </>
    );
  }

  const daysDiff = Math.max(
    1,
    Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))
  );
  const totalPrice = Number(offer.price || 0) * daysDiff;

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
          <section className="md:col-span-2 flex flex-col gap-4 sm:gap-6">
            <img
              src={offer.imageUrl}
              alt={offer.propertyName || offer.name}
              className="rounded-lg w-full h-56 sm:h-80 object-cover shadow"
            />
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white">
                {offer.propertyName || offer.name}
              </h1>

              <p className="flex items-center text-blue-600 dark:text-blue-400 text-sm mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                {offer.address}
              </p>

              <div className="flex items-center mt-2 space-x-2">
                {renderStars(offer.rating || 0)}
                <span className="text-sm text-gray-500 dark:text-gray-300">
                  ({offer.rating?.toFixed(1) || "N/A"})
                </span>
              </div>

              <div>
                <h2 className="text-lg sm:text-xl font-semibold mt-4 sm:mt-6 mb-2 sm:mb-3 text-gray-900 dark:text-white">
                  Offer Highlights
                </h2>
                <ul className="grid grid-cols-2 gap-2 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                  {(offer.highlights && offer.highlights.length > 0
                    ? offer.highlights
                    : [
                        "✔ Exclusive Deals",
                        "✔ Limited-Time Discounts",
                        "✔ Premium Experience",
                        "✔ Special Packages",
                      ]
                  ).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Location
                </h2>
                <iframe
                  title="Map"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    offer.address || "Ethiopia"
                  )}&output=embed`}
                  className="w-full h-48 sm:h-60 rounded-lg shadow"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          </section>

          <aside className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 sm:p-6 flex flex-col justify-between shadow-lg">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3 sm:gap-4"
            >
              <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 text-gray-900 dark:text-white">
                Reserve {offer.propertyName || offer.name}
              </h2>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1 text-sm sm:text-base font-medium">
                  Start Date
                </label>
                <input
                  type="date"
                  name="checkIn"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  required
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full p-2 sm:p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1 text-sm sm:text-base font-medium">
                  End Date
                </label>
                <input
                  type="date"
                  name="checkOut"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  required
                  min={checkIn}
                  className="w-full p-2 sm:p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm sm:text-base"
                />
              </div>

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

              <fieldset className="border border-gray-300 dark:border-gray-600 rounded-md p-3 sm:p-4 max-h-40 sm:max-h-48 overflow-auto">
                <legend className="text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base mb-1 sm:mb-2">
                  Payment Method
                </legend>
                {[
                  { value: "chapa", label: "Chapa" },
                  { value: "cbe-birr", label: "CBE Birr" },
                  { value: "telebirr", label: "Tele Birr" },
                  { value: "mpesa", label: "M-Pesa" },
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

              {["telebirr", "cbe-birr", "mpesa"].includes(
                guestInfo.paymentMethod
              ) && (
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium text-sm sm:text-base">
                    Upload Payment Proof
                  </label>
                  <input
                    type="file"
                    onChange={handleChange}
                    className="w-full border rounded p-2 text-sm sm:text-base"
                    accept="image/*"
                  />
                </div>
              )}

              <div className="border-t border-gray-300 dark:border-gray-600 pt-3 sm:pt-4 mt-3 sm:mt-4 text-center">
                <div className="font-bold text-green-700 dark:text-green-400 text-base sm:text-lg">
                  {daysDiff} {daysDiff === 1 ? "day" : "days"} × {offer.price}{" "}
                  birr = {totalPrice} birr
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
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
