"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Footer from "../../../../components/Footer";
import { MapPin } from "lucide-react";

export default function HouseSaleReservationPage() {
  const params = useSearchParams();
  const id = params.get("id");

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "https://bluenile.onrender.com";

  const [house, setHouse] = useState(null);
  const [error, setError] = useState("");
  const [guestInfo, setGuestInfo] = useState({
    name: "",
    email: "",
    phone: "",
    appointmentDate: new Date().toISOString().split("T")[0],
    paymentMethod: "cash",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch house details
  useEffect(() => {
    async function fetchHouse() {
      try {
        const res = await fetch(`${API_URL}/admin/properties/${id}`);
        if (!res.ok)
          throw new Error(`Failed to fetch house (status ${res.status})`);
        const data = await res.json();

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

        const location =
          data.location || data.address || data.city || "No location";
        const houseName = data.houseTitle || data.propertyName || "House";

        setHouse({ ...data, imageUrl: imageSrc, location, houseName });
      } catch (err) {
        setError(err.message);
      }
    }

    if (id) fetchHouse();
  }, [id, API_URL]);

  function handleChange(e) {
    const { name, value } = e.target;
    setGuestInfo((prev) => ({ ...prev, [name]: value }));
  }

  function validateForm() {
    if (!guestInfo.name || !guestInfo.email || !guestInfo.phone)
      return "Please fill in name, email, and phone.";
    if (!guestInfo.appointmentDate) return "Please select appointment date.";
    if (!guestInfo.paymentMethod) return "Please select a payment method.";
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
        houseId: house._id,
        houseName: house.houseName,
        name: guestInfo.name,
        email: guestInfo.email,
        phone: guestInfo.phone,
        appointmentDate: guestInfo.appointmentDate,
        paymentMethod: guestInfo.paymentMethod,
      };

      const res = await fetch(`${API_URL}/houses/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data?.message || "Failed to book appointment");

      setSuccessMessage(
        `✅ Appointment for ${house.houseName} successfully booked!`
      );
      setGuestInfo({
        name: "",
        email: "",
        phone: "",
        appointmentDate: new Date().toISOString().split("T")[0],
        paymentMethod: "cash",
      });
    } catch (err) {
      setSuccessMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  }

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <p className="text-xl text-red-600">❌ {error}</p>
      </div>
    );

  if (!house)
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <p className="text-xl text-gray-600">Loading house details...</p>
      </div>
    );

  return (
    <>
      <main className="max-w-6xl mx-auto p-6">
        {successMessage && (
          <div
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded shadow-lg z-50 ${
              successMessage.startsWith("✅")
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            {successMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          {/* Left: House Info */}
          <section className="md:col-span-2 flex flex-col gap-6">
            {house.imageUrl && (
              <img
                src={house.imageUrl}
                alt={house.houseName}
                className="rounded-lg w-full h-80 object-cover shadow"
              />
            )}

            <div>
              <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
                {house.houseName}
              </h1>

              <p className="flex items-center text-blue-600 dark:text-blue-400 text-sm mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                {house.location}
              </p>

              <div className="mt-4 text-gray-700 dark:text-gray-300">
                {house.description || "No description available."}
              </div>

              <h2 className="text-xl font-semibold mt-4 mb-2 text-gray-900 dark:text-white">
                House Features
              </h2>
              <ul className="grid grid-cols-2 gap-2 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                <li>✔ Spacious Bedrooms</li>
                <li>✔ Modern Kitchen</li>
                <li>✔ Private Garden</li>
                <li>✔ Secure Neighborhood</li>
                <li>✔ Nearby Schools & Shops</li>
                <li>✔ Parking / Garage</li>
              </ul>

              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                  Location
                </h2>
                <iframe
                  title="House Location"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    house.location
                  )}&output=embed`}
                  className="w-full h-48 rounded-lg shadow"
                  allowFullScreen
                  loading="lazy"
                />
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    house.location
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

          {/* Right: Appointment Form */}
          <aside className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 flex flex-col justify-between shadow-lg">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Book an Appointment for {house.houseName}
              </h2>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">
                  Appointment Date
                </label>
                <input
                  type="date"
                  name="appointmentDate"
                  value={guestInfo.appointmentDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  required
                  className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              {["name", "email", "phone"].map((field) => (
                <div key={field}>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium capitalize">
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

              <fieldset className="border border-gray-300 dark:border-gray-600 rounded-md p-4">
                <legend className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                  Payment Method
                </legend>
                {[
                  { value: "cash", label: "Cash" },
                  { value: "bank-transfer", label: "Bank Transfer" },
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

              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition duration-200"
              >
                {loading ? "Processing..." : "Book Appointment"}
              </button>
            </form>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
