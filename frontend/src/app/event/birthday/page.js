"use client";
import { Cake, CheckCircle, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function BirthdaysPage() {
  const servicesList = [
    { name: "Hall", price: 5000 },
    { name: "Photography & Videography", price: 4000 },
    { name: "Catering", price: 300 }, // per guest
    { name: "Decoration", price: 2500 },
    { name: "DJ", price: 2000 },
    { name: "Car Service", price: 1500 },
    { name: "Guest Management", price: 1000 },
  ];

  const paymentMethods = [
    { name: "Chapa", logo: "/chapa.png" },
    { name: "Telebirr", logo: "/telebirr.png" },
    { name: "CBE Birr", logo: "/cbebirr.png" },
  ];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    birthdayDate: "",
    guests: "",
    selectedServices: [],
    specialRequests: "",
    paymentMethod: "",
    paymentEvidence: null,
  });

  const [status, setStatus] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  // Calculate total dynamically
  useEffect(() => {
    const servicesTotal = formData.selectedServices.reduce((acc, sName) => {
      const service = servicesList.find((s) => s.name === sName);
      if (!service) return acc;
      if (service.name === "Catering") {
        return acc + (parseInt(formData.guests) || 0) * service.price;
      }
      return acc + service.price;
    }, 0);
    setTotalAmount(servicesTotal);
  }, [formData.selectedServices, formData.guests]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) =>
    setFormData({ ...formData, paymentEvidence: e.target.files[0] });

  const toggleService = (service) => {
    setFormData((prev) => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(service)
        ? prev.selectedServices.filter((s) => s !== service)
        : [...prev.selectedServices, service],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.birthdayDate ||
      !formData.guests ||
      !formData.selectedServices.length ||
      !formData.paymentMethod
    ) {
      setStatus({ text: "❌ Missing required fields", type: "error" });
      return;
    }

    if (
      (formData.paymentMethod === "Telebirr" ||
        formData.paymentMethod === "CBE Birr") &&
      !formData.paymentEvidence
    ) {
      setStatus({ text: "❌ Please upload payment proof", type: "error" });
      return;
    }

    setLoading(true);
    setStatus({ text: "", type: "" });

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("email", formData.email);
      payload.append("phone", formData.phone);
      payload.append("birthdayDate", formData.birthdayDate);
      payload.append("guests", String(formData.guests));
      payload.append("specialRequests", formData.specialRequests || "");
      payload.append("paymentMethod", formData.paymentMethod);
      payload.append("amount", String(totalAmount));
      payload.append(
        "selectedServices",
        JSON.stringify(formData.selectedServices)
      );

      if (
        formData.paymentEvidence &&
        (formData.paymentMethod === "Telebirr" ||
          formData.paymentMethod === "CBE Birr")
      ) {
        payload.append("paymentEvidence", formData.paymentEvidence);
      }

      const res = await fetch("http://localhost:10000/birthdays", {
        method: "POST",
        body: payload,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed");

      const bookingId = data.booking?._id;

      // Handle Chapa Payment
      if (formData.paymentMethod === "Chapa" && bookingId) {
        const payRes = await fetch(
          "http://localhost:10000/bookings/pay/chapa",
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
        } else {
          throw new Error("❌ Failed to start Chapa payment");
        }
      }

      setStatus({
        text: `✅ Booking submitted successfully!`,
        type: "success",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        birthdayDate: "",
        guests: "",
        selectedServices: [],
        specialRequests: "",
        paymentMethod: "",
        paymentEvidence: null,
      });
      setTotalAmount(0);
    } catch (err) {
      setStatus({ text: `❌ ${err.message}`, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-16 text-center px-4">
        <Cake className="w-12 h-12 mx-auto mb-4" />
        <h1 className="text-4xl font-bold">Birthday Parties</h1>
        <p className="mt-2 text-lg">
          Fun, festive, and unforgettable celebrations 🎉
        </p>
      </header>

      <section className="bg-white py-12 px-4 max-w-3xl mx-auto shadow-lg rounded-xl -mt-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          Book Your Birthday
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
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg text-black"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg text-black"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg text-black"
          />
          <input
            type="date"
            name="birthdayDate"
            value={formData.birthdayDate}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg text-black"
          />
          <input
            type="number"
            name="guests"
            placeholder="Number of Guests"
            value={formData.guests}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg text-black"
          />

          {/* Services */}
          <div className="space-y-2">
            <p className="font-medium">Select Services:</p>
            {servicesList.map((service) => (
              <label
                key={service.name}
                className="flex items-center gap-2 border p-2 rounded-lg cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.selectedServices.includes(service.name)}
                  onChange={() => toggleService(service.name)}
                />
                {service.name} —{" "}
                {service.name === "Catering"
                  ? `${service.price} ETB / guest`
                  : `${service.price} ETB`}
              </label>
            ))}
          </div>

          {totalAmount > 0 && (
            <div className="p-4 bg-yellow-100 border border-yellow-300 rounded-lg text-black font-semibold">
              💰 Total Payment: {totalAmount} ETB
            </div>
          )}

          {/* Payment */}
          <div>
            <p className="font-medium mb-2">Select Payment Method:</p>
            <div className="flex gap-4 flex-wrap">
              {paymentMethods.map((method) => (
                <label
                  key={method.name}
                  className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition ${
                    formData.paymentMethod === method.name
                      ? "border-yellow-500 bg-yellow-50"
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

          {(formData.paymentMethod === "Telebirr" ||
            formData.paymentMethod === "CBE Birr") && (
            <input
              type="file"
              name="paymentEvidence"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border rounded-lg"
            />
          )}

          <textarea
            name="specialRequests"
            placeholder="Special Requests (Optional)"
            value={formData.specialRequests}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg text-black"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 text-white py-3 rounded-lg font-bold hover:bg-yellow-600 transition disabled:opacity-50"
          >
            {loading ? "Processing..." : "Submit Booking"}
          </button>
        </form>
      </section>
    </div>
  );
}
