"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Footer from "../../../../components/Footer";
import { MapPin, Star, StarHalf, Star as StarOutline } from "lucide-react";

export default function ReservationPage() {
  const params = useSearchParams();
  const id = params.get("id");

  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
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
    new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0]
  );
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch product details
  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(
          `https://bluenile.onrender.com/admin/properties/${id}`
        );
        if (!res.ok)
          throw new Error(`Failed to fetch product (status ${res.status})`);
        const data = await res.json();

        const baseUrl = "https://bluenile.onrender.com";
        let firstImage =
          Array.isArray(data.imageUrl) && data.imageUrl.length > 0
            ? data.imageUrl[0]
            : typeof data.imageUrl === "string"
            ? data.imageUrl
            : null;

        const imageSrc = firstImage
          ? firstImage.startsWith("http")
            ? firstImage
            : `${baseUrl}${firstImage.startsWith("/") ? "" : "/"}${firstImage}`
          : null;

        const location =
          data.location || data.address || data.city || "No location";

        setProduct({ ...data, imageUrl: imageSrc, location });
      } catch (err) {
        setError(err.message);
      }
    }
    if (id) fetchProduct();
  }, [id]);

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

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <p className="text-xl text-red-600">❌ {error}</p>
      </div>
    );

  if (!product)
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <p className="text-xl text-gray-600">Loading product...</p>
      </div>
    );

  const daysDiff = Math.max(
    1,
    Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))
  );
  const pricePerNight = Number(product.price) || 0;
  const totalPrice = pricePerNight * daysDiff;

  function handleChange(e) {
    const { name, value, files } = e.target;
    if (files) {
      setGuestInfo((prev) => ({ ...prev, paymentEvidence: files[0] }));
    } else {
      setGuestInfo((prev) => ({ ...prev, [name]: value }));
    }
  }

  function validateForm() {
    if (!guestInfo.name || !guestInfo.email || !guestInfo.phone)
      return "Please fill in name, email, and phone.";
    if (!checkIn || !checkOut)
      return "Please select check-in and check-out dates.";
    if (!guestInfo.paymentMethod) return "Please select a payment method.";
    if (
      ["telebirr", "cbe-birr", "mpesa"].includes(guestInfo.paymentMethod) &&
      !guestInfo.paymentEvidence
    )
      return "Please upload payment evidence.";
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSuccessMessage("");
    const err = validateForm();
    if (err) return setSuccessMessage("❌ " + err);

    setLoading(true);
    try {
      const payload = {
        product: product._id,
        name: guestInfo.name,
        email: guestInfo.email,
        phone: guestInfo.phone,
        checkIn: new Date(checkIn).toISOString(),
        checkOut: new Date(checkOut).toISOString(),
        nights: daysDiff,
        amount: totalPrice,
        paymentMethod: guestInfo.paymentMethod,
        paymentEvidence: guestInfo.paymentEvidence
          ? guestInfo.paymentEvidence.name
          : "",
      };

      // 1️⃣ Create reservation
      const res = await fetch(
        "https://bluenile.onrender.com/products/reservations",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok)
        throw new Error(data?.error || `Failed to create reservation`);

      const reservationId = data?.reservation?._id;

      // 2️⃣ Initialize Chapa payment if selected
      if (guestInfo.paymentMethod === "chapa") {
        const payRes = await fetch(
          "https://bluenile.onrender.com/bookings/pay/chapa",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              amount: totalPrice,
              email: guestInfo.email,
              fullName: guestInfo.name,
              bookingId: reservationId,
            }),
          }
        );
        const payData = await payRes.json();

        if (payData.checkout_url) {
          // Redirect to Chapa checkout
          window.location.href = payData.checkout_url;
          return;
        } else {
          setSuccessMessage("❌ Failed to initialize Chapa payment.");
          return;
        }
      }

      setSuccessMessage(
        `✅ Reservation submitted! Payment of ${totalPrice} birr via ${guestInfo.paymentMethod} will be reviewed.`
      );

      setGuestInfo({
        name: "",
        email: "",
        phone: "",
        paymentMethod: "chapa",
        paymentEvidence: null,
      });
    } catch (err) {
      setSuccessMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <main className="max-w-6xl mx-auto p-6">
        {successMessage && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded shadow-lg z-50">
            {successMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          {/* Left: Product Info */}
          <section className="md:col-span-2 flex flex-col gap-6">
            <img
              src={product.imageUrl}
              alt={product.propertyName}
              className="rounded-lg w-full h-80 object-cover shadow"
            />
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
                {product.propertyName}
              </h1>

              {/* Location */}
              <p className="flex items-center text-blue-600 dark:text-blue-400 text-sm mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                {product.location}
              </p>

              {/* Rating */}
              <div className="flex items-center mt-2 space-x-1">
                {renderStars(product.rating || 0)}
                <span className="text-sm text-gray-500 dark:text-gray-300">
                  ({product.rating?.toFixed(1) || "N/A"})
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-semibold mt-4 sm:mt-6 mb-2 sm:mb-3 text-gray-900 dark:text-white">
                Stay Highlights
              </h2>
              <ul className="grid grid-cols-2 gap-2 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                <li>✔ Free Wi-Fi</li>
                <li>✔ Spacious Living Area</li>
                <li>✔ Fully Equipped Kitchen</li>
                <li>✔ Private Balcony / Terrace</li>
                <li>✔ Air Conditioning</li>
                <li>✔ 24/7 Support</li>
              </ul>

              {/* Map */}
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                  Location
                </h2>
                <iframe
                  title="Map"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    product.location
                  )}&output=embed`}
                  className="w-full h-48 rounded-lg shadow"
                  allowFullScreen
                  loading="lazy"
                />
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    product.location
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View Larger Map
                </a>
              </div>
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
                  min={new Date().toISOString().split("T")[0]}
                  required
                  className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
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
                  min={checkIn}
                  required
                  className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              {/* Guest Info */}
              {["name", "email", "phone"].map((field) => (
                <div key={field}>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">
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
                    className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              ))}

              {/* Payment Methods */}
              <fieldset className="border border-gray-300 dark:border-gray-600 rounded-md p-4 max-h-48 overflow-auto">
                <legend className="text-gray-700 dark:text-gray-300 font-medium mb-2">
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
                    className="flex items-center gap-3 mb-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={value}
                      checked={guestInfo.paymentMethod === value}
                      onChange={handleChange}
                      required
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </fieldset>

              {/* Upload evidence */}
              {["telebirr", "cbe-birr", "mpesa"].includes(
                guestInfo.paymentMethod
              ) && (
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">
                    Upload Payment Proof
                  </label>
                  <input
                    type="file"
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                    accept="image/*"
                  />
                </div>
              )}

              {/* Price summary */}
              <div className="border-t border-gray-300 dark:border-gray-600 pt-4 mt-4">
                <div className="flex justify-between font-semibold text-gray-900 dark:text-white mb-2">
                  <span>
                    {daysDiff} {daysDiff === 1 ? "night" : "nights"} ×{" "}
                    {pricePerNight} birr
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
                disabled={loading}
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition duration-200"
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
