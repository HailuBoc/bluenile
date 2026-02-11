"use client";

import { CheckCircle, XCircle, ShoppingBag } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

export default function SalesPurchasePage() {
  const { id } = useParams();
  const API_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:10000";

  const [item, setItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    paymentMethod: "",
    specialRequests: "",
  });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const paymentOptions = [
    { name: "Chapa", logo: "/chapa.png" },
    { name: "Telebirr", logo: "/telebirr.png" },
    { name: "CBE Birr", logo: "/cbebirr.png" },
  ];

  // Fetch product
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await axios.get(`${API_URL}/salepost/${id}`);
        setItem(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch item", err);
        setMessage({ text: "❌ Failed to load item.", type: "error" });
      }
    };
    fetchItem();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
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
      const res = await fetch(`${API_URL}/sale`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          itemTitle: item.title,
          amount: item.price,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit order");

      setMessage({
        text: "✅ Purchase submitted successfully!",
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
        paymentMethod: "",
        specialRequests: "",
      });
    } catch (err) {
      setMessage({ text: `❌ ${err.message}`, type: "error" });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ text: "", type: "" }), 5000);
    }
  };

  if (!item) return <p className="text-center mt-10">Loading item...</p>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-16 text-center px-4">
        <ShoppingBag className="w-12 h-12 mx-auto mb-4" />
        <h1 className="text-4xl font-bold">{item.title}</h1>
        <p className="mt-3 text-lg max-w-2xl mx-auto">{item.category}</p>
        <p className="mt-2 font-semibold">{item.price} Birr</p>
      </header>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="text-center mb-8">
            <ShoppingBag className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold">Purchase This Item</h2>
            <p className="mt-2 text-gray-600">
              Complete the form below to confirm your purchase.
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
              value={item.title}
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

            <textarea
              name="specialRequests"
              placeholder="Special Requests (Optional)"
              value={formData.specialRequests}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2 text-black"
            />

            {/* Payment Method */}
            <div>
              <h3 className="font-semibold mb-2">Select Payment Method</h3>
              <div className="flex gap-4 flex-wrap">
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

            <button
              type="submit"
              disabled={loading}
              className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600 transition w-full sm:w-auto"
            >
              {loading ? "Processing..." : "Submit Purchase"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
