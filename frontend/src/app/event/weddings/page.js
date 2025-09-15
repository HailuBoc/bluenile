"use client";
import { Heart, CheckCircle, XCircle } from "lucide-react";
import { useState, useEffect } from "react";

export default function WeddingsPage() {
  const serviceOptions = {
    Religion: [
      "Church / Mosque Venue",
      "Religious Ceremony Setup",
      "Choir / Spiritual Music",
      "Photography & Videography",
      "Catering (Traditional & Modern Food)",
      "Car Service (Wedding Transportation)",
      "Guest Management",
    ],
    Modern: [
      "Luxury Wedding Hall",
      "DJ & Entertainment",
      "Modern Decoration & Lighting",
      "Photography & Videography",
      "Catering (Buffet & Drinks)",
      "Car Service (Luxury Cars)",
      "Guest Management",
    ],
    Traditional: [
      "Traditional Venue & Setup",
      "Cultural Music & Dance",
      "Traditional Clothing & Styling",
      "Photography & Videography",
      "Traditional Catering",
      "Horse Carriage / Car Service",
      "Guest Management",
    ],
  };

  const paymentMethods = [
    { name: "Chapa", logo: "/chapa.png" },
    { name: "Telebirr", logo: "/telebirr.png" },
    { name: "CBE Bank", logo: "/cbebirr.png" },
  ];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    guests: "",
    marriageType: "",
    specialRequests: "",
    selectedServices: [],
    paymentMethod: "",
    paymentEvidence: "", // just filename or text
  });

  const [availableServices, setAvailableServices] = useState([]);
  const [status, setStatus] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    if (formData.marriageType) {
      setAvailableServices(serviceOptions[formData.marriageType]);
      setFormData((prev) => ({ ...prev, selectedServices: [] }));
    }
  }, [formData.marriageType]);

  useEffect(() => {
    const pricePerService = 1000;
    setTotalAmount(formData.selectedServices.length * pricePerService);
  }, [formData.selectedServices]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleServiceToggle = (service) => {
    setFormData((prev) => {
      const alreadySelected = prev.selectedServices.includes(service);
      return {
        ...prev,
        selectedServices: alreadySelected
          ? prev.selectedServices.filter((s) => s !== service)
          : [...prev.selectedServices, service],
      };
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setFormData({ ...formData, paymentEvidence: file.name });
    else setFormData({ ...formData, paymentEvidence: "" });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = true;
    if (!formData.email.trim()) errors.email = true;
    if (!formData.phone.trim()) errors.phone = true;
    if (!formData.date.trim()) errors.date = true;
    if (!formData.guests.trim()) errors.guests = true;
    if (!formData.marriageType.trim()) errors.marriageType = true;
    if (!formData.paymentMethod.trim()) errors.paymentMethod = true;

    if (
      ["Telebirr", "CBE Bank"].includes(formData.paymentMethod) &&
      !formData.paymentEvidence.trim()
    ) {
      errors.paymentEvidence = true;
    }

    if (Object.keys(errors).length > 0) {
      setStatus({
        text: "❌ Please fill in all required fields",
        type: "error",
      });
      return false;
    }

    setStatus({ text: "", type: "" });
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        date: formData.date,
        guests: Number(formData.guests),
        marriageType: formData.marriageType,
        selectedServices: formData.selectedServices,
        specialRequests: formData.specialRequests,
        paymentMethod: formData.paymentMethod,
        paymentEvidence: formData.paymentEvidence || "",
        totalAmount,
      };

      // Always send JSON
      const res = await fetch("http://localhost:10000/weddings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed");

      const bookingId = data.booking._id;

      // Chapa payment
      if (formData.paymentMethod === "Chapa") {
        const payRes = await fetch(
          "http://localhost:10000/weddings/pay/chapa",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              amount: totalAmount,
              currency: "ETB",
              email: formData.email,
              fullName: formData.name,
              bookingId,
            }),
          }
        );

        const payData = await payRes.json();
        if (payData.checkout_url) {
          window.location.href = payData.checkout_url;
          return;
        } else throw new Error("❌ Failed to start Chapa payment");
      }

      setStatus({
        text: `✅ Booking submitted! Your payment of ${totalAmount} ETB via ${formData.paymentMethod} is pending admin verification.`,
        type: "success",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        date: "",
        guests: "",
        marriageType: "",
        specialRequests: "",
        selectedServices: [],
        paymentMethod: "",
        paymentEvidence: "",
      });
      setAvailableServices([]);
      setTotalAmount(0);
    } catch (err) {
      setStatus({ text: `❌ ${err.message}`, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-16 text-center px-4">
        <Heart className="w-12 h-12 mx-auto mb-4" />
        <h1 className="text-4xl font-bold">Weddings</h1>
        <p className="mt-3 text-lg max-w-xl mx-auto">
          Celebrate your special day with elegance and unforgettable moments.
        </p>
      </header>

      <section className="bg-white py-12 px-4 max-w-3xl mx-auto shadow-lg rounded-xl mt-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          Book Your Wedding
        </h2>

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
          {/* Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
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
          </div>

          {/* Phone & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
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
          </div>

          {/* Guests & Marriage Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="number"
              name="guests"
              placeholder="Number of Guests"
              value={formData.guests}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2 text-black"
            />
            <select
              name="marriageType"
              value={formData.marriageType}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2 text-black"
            >
              <option value="">Select Type of Marriage</option>
              <option value="Religion">Religion</option>
              <option value="Modern">Modern</option>
              <option value="Traditional">Traditional</option>
            </select>
          </div>

          {/* Services */}
          {formData.marriageType && (
            <div>
              <h3 className="font-semibold mb-2">
                Select Services for {formData.marriageType} Wedding
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {availableServices.map((service, i) => (
                  <label
                    key={i}
                    className="flex items-center space-x-2 border rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-50 transition"
                  >
                    <input
                      type="checkbox"
                      checked={formData.selectedServices.includes(service)}
                      onChange={() => handleServiceToggle(service)}
                      className="accent-pink-600"
                    />
                    <span className="text-black">{service}</span>
                  </label>
                ))}
              </div>
              <p className="mt-2 font-semibold text-lg text-gray-700">
                Total Price: {totalAmount} ETB
              </p>
            </div>
          )}

          {/* Payment */}
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Select Payment Method</h3>
            <div className="flex gap-4 flex-wrap">
              {paymentMethods.map((method) => (
                <label
                  key={method.name}
                  className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition ${
                    formData.paymentMethod === method.name
                      ? "border-pink-600 bg-pink-50"
                      : "border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.name}
                    checked={formData.paymentMethod === method.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paymentMethod: e.target.value,
                      })
                    }
                    className="hidden"
                  />
                  <img
                    src={method.logo}
                    alt={method.name}
                    className="w-10 h-10"
                  />
                  <span className="text-sm sm:text-base">{method.name}</span>
                </label>
              ))}
            </div>

            {["Telebirr", "CBE Bank"].includes(formData.paymentMethod) && (
              <div className="mt-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full border rounded px-4 py-2"
                />
              </div>
            )}
          </div>

          {/* Special Requests */}
          <textarea
            name="specialRequests"
            placeholder="Special Requests"
            value={formData.specialRequests}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2 min-h-[100px] text-black"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition w-full sm:w-auto font-semibold"
          >
            {loading ? "Processing..." : "Submit Booking"}
          </button>
        </form>
      </section>
    </div>
  );
}
