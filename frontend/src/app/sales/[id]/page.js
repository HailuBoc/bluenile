"use client";
import { useParams } from "next/navigation";
import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function SalesPurchaseForm() {
  const params = useParams();
  const { id } = params;

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "https://bluenile.onrender.com";

  const listings = [
    {
      title: "Modern 3-Bedroom Apartment",
      category: "Apartment",
      price: 150000,
      location: "Downtown, New York",
    },
    {
      title: "Luxury Beachfront Villa",
      category: "House",
      price: 120000,
      location: "Malibu, California",
    },
    {
      title: "5 Acres of Prime Land",
      category: "Land",
      price: 300000,
      location: "Nairobi, Kenya",
    },
    {
      title: "2023 Luxury SUV",
      category: "Vehicle",
      price: 80000,
      location: "Dubai, UAE",
    },
  ];

  const paymentMethods = [
    { name: "Chapa", logo: "/chapa.png" },
    { name: "Telebirr", logo: "/telebirr.png" },
    { name: "CBE Birr", logo: "/cbebirr.png" },
  ];

  const item = listings[id];
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    paymentMethod: "",
    paymentEvidence: null,
    specialRequests: "",
  });

  const [status, setStatus] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-bold">
        Listing not found ❌
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, paymentEvidence: e.target.files[0] });
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.phone)
      return "Please fill all required fields.";
    if (!formData.paymentMethod) return "Please select a payment method.";
    if (
      !formData.paymentEvidence &&
      (formData.paymentMethod === "CBE Birr" ||
        formData.paymentMethod === "Telebirr")
    )
      return "Please upload payment evidence for selected payment method.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ text: "", type: "" });

    const errorMsg = validateForm();
    if (errorMsg) {
      setStatus({ text: `❌ ${errorMsg}`, type: "error" });
      return;
    }

    setLoading(true);

    try {
      const formPayload = new FormData();
      formPayload.append("name", formData.name);
      formPayload.append("email", formData.email);
      formPayload.append("phone", formData.phone);
      formPayload.append("paymentMethod", formData.paymentMethod);
      formPayload.append("itemTitle", item.title);
      formPayload.append("amount", item.price);
      formPayload.append("specialRequests", formData.specialRequests);
      if (formData.paymentEvidence) {
        formPayload.append("paymentEvidence", formData.paymentEvidence);
      }

      // Step 1: Create booking
      const bookingRes = await fetch(`${backendUrl}/sale`, {
        method: "POST",
        body: formPayload,
      });

      const bookingData = await bookingRes.json();
      if (!bookingRes.ok)
        throw new Error(bookingData.message || "Failed to create booking");

      const bookingId = bookingData.booking?._id;

      // Step 2: Handle Chapa payment
      if (formData.paymentMethod === "Chapa") {
        const payRes = await fetch(`${backendUrl}/bookings/pay/chapa`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: item.price,
            currency: "ETB",
            email: formData.email,
            fullName: formData.name,
            bookingId,
          }),
        });

        const payData = await payRes.json();
        if (payData?.checkout_url) {
          window.location.href = payData.checkout_url;
          return;
        } else {
          throw new Error("Failed to start Chapa payment.");
        }
      }

      // Telebirr or CBE
      setStatus({
        text: `✅ Booking submitted! Your payment of ${item.price} ETB via ${formData.paymentMethod} will be reviewed.`,
        type: "success",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        paymentMethod: "",
        paymentEvidence: null,
        specialRequests: "",
      });
    } catch (err) {
      setStatus({ text: `❌ ${err.message}`, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6">
      <motion.div
        className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-lg"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
          {item.title}
        </h1>
        <p className="text-gray-600 mb-2">Category: {item.category}</p>
        <p className="text-gray-600 mb-2">Location: {item.location}</p>
        <p className="text-yellow-600 font-bold text-lg mb-6">
          💰 {item.price} ETB
        </p>

        {status.text && (
          <div
            className={`flex items-center gap-2 p-3 rounded-lg text-sm mb-4 ${
              status.type === "success"
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}
          >
            {status.type === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
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
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />

          <div>
            <p className="font-medium mb-2">Select Payment Method:</p>
            <div className="flex gap-4 flex-wrap">
              {paymentMethods.map((method) => (
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
                  <Image
                    src={method.logo}
                    alt={method.name}
                    width={40}
                    height={40}
                  />
                  {method.name}
                </label>
              ))}
            </div>
          </div>

          {(formData.paymentMethod === "CBE Birr" ||
            formData.paymentMethod === "Telebirr") && (
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-2 border rounded-lg"
              />
            </div>
          )}

          <textarea
            name="specialRequests"
            placeholder="Special Requests (Optional)"
            value={formData.specialRequests}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 text-white py-3 rounded-lg font-bold hover:bg-yellow-600 transition disabled:opacity-50"
          >
            {loading ? "Processing..." : "Confirm Purchase"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
