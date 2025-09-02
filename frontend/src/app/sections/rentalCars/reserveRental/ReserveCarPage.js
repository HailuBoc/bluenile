"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import listings from "../../../../components/listingsData";
import Footer from "../../../../components/Footer";

export default function ReservationPage() {
  const params = useSearchParams();
  const id = parseInt(params.get("id"), 10);
  const listing = listings.find((item) => item.id === id);

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
      return "Please upload payment evidence for the selected method.";
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSuccessMessage("");
    const err = validateForm();
    if (err) return setSuccessMessage("❌ " + err);

    setLoading(true);
    try {
      // Create reservation
      const formData = new FormData();
      formData.append("listingId", listing.id);
      formData.append("listingTitle", listing.title);
      formData.append("name", guestInfo.name);
      formData.append("email", guestInfo.email);
      formData.append("phone", guestInfo.phone);
      formData.append("checkIn", checkIn);
      formData.append("checkOut", checkOut);
      formData.append("nights", daysDiff);
      formData.append("amount", totalPrice);
      formData.append("paymentMethod", guestInfo.paymentMethod);
      if (guestInfo.paymentEvidence)
        formData.append("paymentEvidence", guestInfo.paymentEvidence);

      const createRes = await fetch(
        "http://localhost:10000/rentalCars/reservations",
        { method: "POST", body: formData }
      );
      const createData = await createRes.json();
      if (!createRes.ok)
        throw new Error(createData?.error || "Failed to create reservation");

      const reservationId = createData?.reservation?._id;

      // Chapa Payment
      if (guestInfo.paymentMethod === "chapa") {
        const payRes = await fetch(
          "http://localhost:10000/bookings/pay/chapa",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              amount: totalPrice,
              currency: "ETB",
              email: guestInfo.email,
              fullName: guestInfo.name,
              bookingId: reservationId,
            }),
          }
        );
        const payData = await payRes.json();
        const redirectUrl = payData?.checkout_url || payData?.checkoutUrl;
        if (redirectUrl) return (window.location.href = redirectUrl);
        throw new Error("Failed to start Chapa payment.");
      }

      // Non-Chapa Payment: show success
      setSuccessMessage(
        `✅ Reservation submitted! Payment of ${totalPrice} birr via ${guestInfo.paymentMethod} will be reviewed.`
      );

      // Reset form after 5s but keep dark/light theme intact
      setTimeout(() => {
        setGuestInfo({
          name: "",
          email: "",
          phone: "",
          paymentMethod: "chapa",
          paymentEvidence: null,
        });
      }, 5000);
    } catch (error) {
      setSuccessMessage("❌ " + error.message);
    } finally {
      setLoading(false);
    }
  }

  // Auto hide success messages
  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(""), 5000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  return (
    <>
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 flex justify-center relative">
        {successMessage && (
          <div
            className="fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded shadow-lg z-50 text-sm sm:text-base
            bg-green-600 text-white"
          >
            {successMessage}
          </div>
        )}

        <div className="max-w-6xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-3 gap-8 p-6">
          {/* Listing Info */}
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
            {/* Features */}
            <div>
              <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900 dark:text-white">
                Tourism Features
              </h2>
              <ul className="grid grid-cols-2 gap-2 text-gray-700 dark:text-gray-300">
                <li>✔ Guided Tours</li>
                <li>✔ Historical Site Access</li>
                <li>✔ Cultural Experiences</li>
                <li>✔ Transportation Included</li>
                <li>✔ Local Cuisine Tasting</li>
                <li>✔ Professional Tour Guide</li>
                <li>✔ Group & Private Options</li>
                <li>✔ Safety & Security</li>
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
              />
            </div>
          </section>

          {/* Reservation Form */}
          <aside className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 flex flex-col justify-between shadow-lg">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Your Reservation
              </h2>

              {/* Dates */}
              {["checkIn", "checkOut"].map((field) => (
                <div key={field}>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">
                    {field === "checkIn" ? "Check-in" : "Check-out"}
                  </label>
                  <input
                    type="date"
                    name={field}
                    value={field === "checkIn" ? checkIn : checkOut}
                    onChange={(e) =>
                      field === "checkIn"
                        ? setCheckIn(e.target.value)
                        : setCheckOut(e.target.value)
                    }
                    required
                    className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    min={
                      field === "checkIn"
                        ? new Date().toISOString().split("T")[0]
                        : checkIn
                    }
                  />
                </div>
              ))}

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
                    placeholder={
                      field === "name"
                        ? "John Doe"
                        : field === "email"
                        ? "john@example.com"
                        : "+251 9XX XXX XXX"
                    }
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
                      className="form-radio text-blue-600"
                      required
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </fieldset>

              {/* Upload evidence if needed */}
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
                disabled={loading}
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition duration-200"
              >
                {loading ? "Processing..." : "Confirm Reservation"}
              </button>
            </form>

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

      <Footer />
    </>
  );
}
