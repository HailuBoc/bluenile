"use client";
import { Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function GeneralEventsPage() {
  const serviceOptions = [
    "Event Hall / Meeting Room",
    "Audio-Visual Setup",
    "Photography & Videography",
    "Catering",
    "Decoration & Branding",
    "Event Coordinator & Staff Support",
    "Transportation Service",
    "Guest Management & Registration Desk",
  ];

  const paymentMethods = [
    { name: "Chapa", logo: "/chapa.png" },
    { name: "CBE Birr", logo: "/cbebirr.png" },
    { name: "Telebirr", logo: "/telebirr.png" },
  ];

  const [formData, setFormData] = useState({
    name: "",
    phone: "", // NEW
    email: "",
    date: "",
    guests: "",
    services: [],
    specialRequests: "",
    paymentMethod: "",
    paymentEvidence: null,
  });

  const [amount, setAmount] = useState(0);
  const [status, setStatus] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  // Calculate total dynamically
  useEffect(() => {
    const guestCost = formData.guests ? parseInt(formData.guests) * 200 : 0;
    const serviceCost = formData.services.length * 500; // adjust per service
    setAmount(guestCost + serviceCost);
  }, [formData.guests, formData.services]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (service) => {
    setFormData((prev) => {
      const exists = prev.services.includes(service);
      return {
        ...prev,
        services: exists
          ? prev.services.filter((s) => s !== service)
          : [...prev.services, service],
      };
    });
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, paymentEvidence: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const errors = [];
    if (!formData.name) errors.push("Full Name");
    if (!formData.phone) errors.push("Phone Number"); // NEW
    if (!formData.email) errors.push("Email");
    if (!formData.date) errors.push("Date");
    if (!formData.guests) errors.push("Number of Guests");
    if (!formData.paymentMethod) errors.push("Payment Method");

    if (
      (formData.paymentMethod === "Telebirr" ||
        formData.paymentMethod === "CBE Birr") &&
      !formData.paymentEvidence
    ) {
      setStatus({ text: "❌ Please upload payment evidence.", type: "error" });
      return;
    }

    if (errors.length > 0) {
      setStatus({
        text: `❌ Missing required fields: ${errors.join(", ")}`,
        type: "error",
      });
      return;
    }

    if (amount <= 0) {
      setStatus({ text: "❌ Amount must be greater than 0.", type: "error" });
      return;
    }

    setLoading(true);
    setStatus({ text: "", type: "" });

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "services") payload.append(key, JSON.stringify(value));
        else if (value) payload.append(key, value);
      });
      payload.append("amount", amount);

      // Save booking
      const res = await fetch("https://bluenile.onrender.com/general-events", {
        method: "POST",
        body: payload,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Booking failed");

      const bookingId = data.booking._id;

      // Handle Chapa payment
      if (formData.paymentMethod === "Chapa") {
        const payRes = await fetch(
          "https://bluenile.onrender.com/general-events/pay/chapa",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              amount,
              currency: "ETB",
              email: formData.email,
              fullName: formData.name,
              bookingId,
            }),
          }
        );

        const payData = await payRes.json();
        if (payData?.checkout_url) {
          window.location.href = payData.checkout_url;
          return;
        } else {
          setStatus({
            text: "❌ Failed to start Chapa payment",
            type: "error",
          });
        }
      } else {
        setStatus({
          text: `✅ Booking submitted! Please pay ${amount} ETB via ${formData.paymentMethod} and upload evidence.`,
          type: "success",
        });
      }

      // Reset
      setFormData({
        name: "",
        phone: "",
        email: "",
        date: "",
        guests: "",
        services: [],
        specialRequests: "",
        paymentMethod: "",
        paymentEvidence: null,
      });
      setAmount(0);
    } catch (err) {
      console.error(err);
      setStatus({ text: `❌ ${err.message}`, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-16 text-center">
        <Calendar className="w-12 h-12 mx-auto mb-4" />
        <h1 className="text-4xl font-bold">General Events</h1>
        <p className="mt-3 text-lg max-w-xl mx-auto px-4">
          Organize conferences, workshops, and special gatherings with ease.
        </p>
      </header>

      <section className="bg-white py-12 px-4 max-w-3xl mx-auto shadow-lg rounded-lg mt-8">
        <h2 className="text-2xl font-bold text-center mb-6">Book Your Event</h2>

        {status.text && (
          <div
            className={`mb-4 p-3 rounded-lg text-center font-medium ${
              status.type === "success"
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}
          >
            {status.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2 text-black"
          />
          <input
            type="text"
            name="phone" // NEW
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2 text-black"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2 text-black"
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2 text-black"
          />
          <input
            type="number"
            name="guests"
            placeholder="Number of Guests"
            value={formData.guests}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2 text-black"
          />

          <div>
            <h3 className="font-semibold mb-2">Select Services</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {serviceOptions.map((service, i) => (
                <label key={i} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.services.includes(service)}
                    onChange={() => handleServiceChange(service)}
                    className="w-4 h-4"
                  />
                  <span className="text-black">{service}</span>
                </label>
              ))}
            </div>
          </div>

          <textarea
            name="specialRequests"
            placeholder="Special Requests"
            value={formData.specialRequests}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2 text-black"
          />

          <div className="text-lg font-semibold text-gray-800">
            Total Amount: <span className="text-yellow-600">{amount} ETB</span>
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Payment Method
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {paymentMethods.map((pm) => (
                <label
                  key={pm.name}
                  className={`border rounded-lg p-3 flex items-center gap-3 cursor-pointer ${
                    formData.paymentMethod === pm.name
                      ? "border-blue-500 ring-2 ring-blue-300"
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={pm.name}
                    checked={formData.paymentMethod === pm.name}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <Image src={pm.logo} alt={pm.name} width={40} height={40} />
                  <span>{pm.name}</span>
                </label>
              ))}
            </div>
          </div>

          {(formData.paymentMethod === "Telebirr" ||
            formData.paymentMethod === "CBE Birr") && (
            <input
              type="file"
              name="paymentEvidence"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border rounded px-4 py-2"
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition w-full sm:w-auto"
          >
            {loading ? "Processing..." : "Submit Booking & Pay"}
          </button>
        </form>
      </section>
    </div>
  );
}
