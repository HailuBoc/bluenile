"use client";
import { Car, CheckCircle, XCircle } from "lucide-react";
import { useState, useEffect, use } from "react";
import { fleet } from "../../../data/fleet";

export default function TransportDetailPage({ params }) {
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;

  const transport =
    fleet.find((item) => String(item.id) === String(id)) || fleet[0];

  const serviceOptions = {
    Chauffeur: 500,
    "Fuel Included": 800,
    "Air Conditioning": 300,
    "Wedding Decoration": 600,
    "Music System": 400,
    "Extra Hours": 700,
  };

  const paymentOptions = [
    { name: "Chapa", logo: "/chapa.png" },
    { name: "Telebirr", logo: "/telebirr.png" },
    { name: "CBE Birr", logo: "/cbebirr.png" },
  ];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    guests: "",
    specialRequests: "",
    selectedServices: [],
    paymentMethod: "",
  });

  const [message, setMessage] = useState({ text: "", type: "" });
  const [total, setTotal] = useState(transport.price || 0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let sum = Number(transport.price) || 0;
    formData.selectedServices.forEach((s) => {
      sum += serviceOptions[s] || 0;
    });
    setTotal(sum);
  }, [formData.selectedServices, transport.price]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleServiceChange = (service) => {
    setFormData((prev) => {
      const selected = prev.selectedServices.includes(service)
        ? prev.selectedServices.filter((s) => s !== service)
        : [...prev.selectedServices, service];
      return { ...prev, selectedServices: selected };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.date ||
      !formData.guests ||
      !formData.paymentMethod
    ) {
      setMessage({
        text: "❌ Please fill in all required fields.",
        type: "error",
      });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await fetch("https://bluenile.onrender.com/transports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          car: transport.title,
          amount: total,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit booking");

      setMessage({
        text: `✅ Booking submitted! Confirmation sent to your email.`,
        type: "success",
      });

      if (formData.paymentMethod === "Chapa" && data.redirectUrl) {
        window.location.href = data.redirectUrl;
        return;
      }

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        date: "",
        guests: "",
        specialRequests: "",
        selectedServices: [],
        paymentMethod: "",
      });
    } catch (err) {
      setMessage({ text: `❌ ${err.message}`, type: "error" });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ text: "", type: "" }), 5000);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 text-center px-4">
        <Car className="w-12 h-12 mx-auto mb-4" />
        <h1 className="text-4xl font-bold">{transport.title}</h1>
        <p className="mt-3 text-lg max-w-2xl mx-auto">
          {transport.description}
        </p>
        <p className="mt-2 font-semibold">Base Price: {transport.price} Birr</p>
      </header>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="text-center mb-8">
            <Car className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold">Book Your Car</h2>
            <p className="mt-2 text-gray-600">
              Reserve your preferred car with extra services for your event.
            </p>
          </div>

          {message.text && (
            <div
              className={`flex items-center gap-2 p-3 rounded-lg text-sm mb-4 ${
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

          <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl mx-auto">
            <input
              type="text"
              value={transport.title}
              readOnly
              className="w-full border rounded px-4 py-2 bg-gray-100 font-semibold text-black"
            />

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2 text-black"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2 text-black"
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2 text-black"
              required
            />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2 text-black"
              required
            />
            <input
              type="number"
              name="guests"
              placeholder="Number of Passengers"
              value={formData.guests}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2 text-black"
              required
            />

            <div>
              <h3 className="font-semibold mb-2">Select Extra Services</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.keys(serviceOptions).map((service) => (
                  <label
                    key={service}
                    className="flex items-center space-x-2 border rounded px-3 py-2 cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={formData.selectedServices.includes(service)}
                      onChange={() => handleServiceChange(service)}
                      className="accent-green-600"
                    />
                    <span className="text-black">
                      {service} (+{serviceOptions[service]} Birr)
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Select Payment Method</h3>
              <div className="flex gap-4">
                {paymentOptions.map((method) => (
                  <label
                    key={method.name}
                    className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer ${
                      formData.paymentMethod === method.name
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300"
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
                      className="w-10 h-10"
                    />
                    {method.name}
                  </label>
                ))}
              </div>
            </div>

            <p className="text-lg font-bold text-center text-black">
              Total: {total} Birr
            </p>

            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition w-full sm:w-auto"
            >
              {loading ? "Processing..." : "Submit Booking"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
