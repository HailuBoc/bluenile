"use client";
export const dynamic = "force-dynamic";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Footer from "../../../../components/Footer";
import axios from "axios";
import {
  MapPin,
  Star,
  StarHalf,
  Star as StarOutline,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function ReserveOfferPage() {
  const searchParams = useSearchParams();
  const [offer, setOffer] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "https://bluenile.onrender.com";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    checkIn: new Date().toISOString().split("T")[0],
    checkOut: new Date(Date.now() + 1 * 86400000).toISOString().split("T")[0],
    paymentMethod: "",
  });

  const paymentOptions = [
    { name: "Chapa", logo: "/chapa.png" },
    { name: "Telebirr", logo: "/telebirr.png" },
    { name: "CBE Birr", logo: "/cbebirr.png" },
    { name: "Mpesa", logo: "/mpesa.png" },
  ];

  // Fetch offer by ID
  useEffect(() => {
    const id = searchParams.get("id");
    if (!id) return;

    const fetchOffer = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/special-offers/${id}`);
        const data = res.data;
        const firstImage =
          Array.isArray(data.imageUrl) && data.imageUrl.length > 0
            ? data.imageUrl[0]
            : typeof data.imageUrl === "string"
            ? data.imageUrl
            : null;

        const imageSrc = firstImage
          ? firstImage.startsWith("http")
            ? firstImage
            : `${API_URL}${firstImage.startsWith("/") ? "" : "/"}${firstImage}`
          : null;

        setOffer({ ...data, imageUrl: imageSrc });
      } catch (err) {
        console.error("❌ Error fetching offer:", err);
        setMessage({ text: "❌ Failed to load special offer.", type: "error" });
      }
    };

    fetchOffer();
  }, [searchParams, API_URL]);

  // Helper for star rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i)
        stars.push(<Star key={i} className="h-5 w-5 text-yellow-400" />);
      else if (rating >= i - 0.5)
        stars.push(<StarHalf key={i} className="h-5 w-5 text-yellow-400" />);
      else
        stars.push(
          <StarOutline
            key={i}
            className="h-5 w-5 text-gray-400 dark:text-gray-500"
          />
        );
    }
    return stars;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!offer) return;

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.checkIn ||
      !formData.checkOut ||
      !formData.paymentMethod
    ) {
      setMessage({
        text: "❌ Please fill in all required fields.",
        type: "error",
      });
      return;
    }

    const daysDiff = Math.max(
      1,
      Math.ceil(
        (new Date(formData.checkOut) - new Date(formData.checkIn)) /
          (1000 * 60 * 60 * 24)
      )
    );
    const totalPrice = Number(offer.price || 0) * daysDiff;

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await fetch(`${API_URL}/specialreservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offerId: offer._id,
          offerTitle: offer.propertyName || offer.name,
          startDate: formData.checkIn,
          endDate: formData.checkOut,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          paymentMethod: formData.paymentMethod,
          amount: totalPrice,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Reservation failed");

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl; // ✅ redirect for payment
        return;
      }

      setMessage({
        text: `✅ Reservation confirmed for ${
          offer.propertyName || offer.name
        } (${totalPrice} Birr) via ${formData.paymentMethod}.`,
        type: "success",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        checkIn: new Date().toISOString().split("T")[0],
        checkOut: new Date(Date.now() + 1 * 86400000)
          .toISOString()
          .split("T")[0],
        paymentMethod: "",
      });
    } catch (err) {
      console.error("❌ Reservation error:", err);
      setMessage({ text: `❌ ${err.message}`, type: "error" });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ text: "", type: "" }), 5000);
    }
  };

  if (!offer)
    return (
      <main className="flex items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
        <p className="text-lg text-blue-600">Loading offer...</p>
      </main>
    );

  const daysDiff = Math.max(
    1,
    Math.ceil(
      (new Date(formData.checkOut) - new Date(formData.checkIn)) /
        (1000 * 60 * 60 * 24)
    )
  );
  const totalPrice = Number(offer.price || 0) * daysDiff;

  return (
    <>
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {/* Offer details */}
          <section className="md:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <img
              src={offer.imageUrl}
              alt={offer.propertyName || offer.name}
              className="rounded-lg w-full h-64 object-cover mb-6"
            />
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
              {offer.propertyName || offer.name}
            </h1>
            <p className="flex items-center text-blue-600 dark:text-blue-400 mt-2">
              <MapPin className="w-4 h-4 mr-1" /> {offer.address}
            </p>
            <div className="flex items-center mt-3 space-x-2">
              {renderStars(offer.rating || 0)}
              <span className="text-sm text-gray-500 dark:text-gray-300">
                ({offer.rating?.toFixed(1) || "N/A"})
              </span>
            </div>

            <h2 className="text-xl font-semibold mt-6 text-gray-900 dark:text-white">
              Offer Highlights
            </h2>
            <ul className="mt-2 grid grid-cols-2 gap-2 text-gray-700 dark:text-gray-300 text-sm">
              {(offer.highlights && offer.highlights.length > 0
                ? offer.highlights
                : [
                    "✔ Exclusive Deals",
                    "✔ Limited-Time Discounts",
                    "✔ Premium Experience",
                    "✔ Special Packages",
                  ]
              ).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>

            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Location
              </h2>
              <iframe
                title="Map"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  offer.address || "Ethiopia"
                )}&output=embed`}
                className="w-full h-60 rounded-lg shadow-sm"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </section>

          {/* Reservation form */}
          <aside className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 shadow-lg">
            {message.text && (
              <div
                className={`flex items-center gap-2 p-3 mb-4 rounded-lg text-sm ${
                  message.type === "success"
                    ? "bg-green-100 text-green-700 border border-green-300"
                    : "bg-red-100 text-red-700 border border-red-300"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <XCircle className="w-5 h-5" />
                )}
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Reserve Now
              </h2>

              {/* Input fields */}
              {["name", "email", "phone"].map((f) => (
                <input
                  key={f}
                  type={
                    f === "email" ? "email" : f === "phone" ? "tel" : "text"
                  }
                  name={f}
                  placeholder={
                    f === "name"
                      ? "Full Name"
                      : f === "email"
                      ? "Email Address"
                      : "Phone Number"
                  }
                  value={formData[f]}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ))}

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  name="checkIn"
                  value={formData.checkIn}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  required
                  className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600"
                />
                <input
                  type="date"
                  name="checkOut"
                  value={formData.checkOut}
                  onChange={handleChange}
                  min={formData.checkIn}
                  required
                  className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600"
                />
              </div>

              {/* Payment Method */}
              <div>
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
                  Select Payment Method
                </h3>
                <div className="flex gap-3 flex-wrap">
                  {paymentOptions.map((method) => (
                    <label
                      key={method.name}
                      className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition ${
                        formData.paymentMethod === method.name
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.name}
                        checked={formData.paymentMethod === method.name}
                        onChange={handleChange}
                        className="hidden"
                      />
                      <img
                        src={method.logo}
                        alt={method.name}
                        className="w-8 h-8"
                      />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {method.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <p className="text-lg font-bold text-center text-green-700 dark:text-green-400">
                Total: {totalPrice} Birr
              </p>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition disabled:opacity-50"
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
