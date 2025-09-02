"use client";
import { GraduationCap, CheckCircle, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function GraduationsPage() {
  const serviceOptions = [
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
    { name: "CBE Birr", logo: "/cbe.png" },
  ];

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    guests: "",
    selectedServices: [],
    specialRequests: "",
    paymentMethod: "",
    paymentEvidence: null,
  });

  const [status, setStatus] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  // Calculate total
  useEffect(() => {
    const servicesTotal = formData.selectedServices.reduce((acc, sName) => {
      const service = serviceOptions.find((s) => s.name === sName);
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

  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = "Full name is required";
    if (!formData.phone) errors.phone = "Phone number is required";
    if (!formData.email) errors.email = "Email is required";
    if (!formData.date) errors.date = "Date is required";
    if (!formData.guests) errors.guests = "Number of guests is required";
    if (!formData.selectedServices.length)
      errors.services = "Select at least one service";
    if (!formData.paymentMethod)
      errors.paymentMethod = "Payment method is required";
    if (
      (formData.paymentMethod === "Telebirr" ||
        formData.paymentMethod === "CBE Birr") &&
      !formData.paymentEvidence
    ) {
      errors.paymentEvidence = "Please upload payment evidence";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setStatus({ text: "❌ Please fill all required fields.", type: "error" });
      return;
    }

    setLoading(true);
    setStatus({ text: "", type: "" });

    try {
      if (formData.paymentMethod === "Chapa") {
        // 1️⃣ Save booking first
        const payload = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (key === "selectedServices") {
            payload.append(key, JSON.stringify(value));
          } else if (value) {
            payload.append(key, value);
          }
        });
        payload.append("totalAmount", totalAmount);

        const res = await fetch("http://localhost:10000/graduations", {
          method: "POST",
          body: payload,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Booking failed");

        const bookingId = data.booking._id;

        // 2️⃣ Initialize Chapa payment (send full details like GeneralEventsPage)
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
        if (payData?.checkout_url) {
          window.location.href = payData.checkout_url; // redirect to Chapa
          return;
        } else {
          throw new Error("❌ Failed to start Chapa payment");
        }
      } else {
        // Telebirr / CBE Birr: submit with payment evidence
        const form = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (key === "selectedServices")
            form.append(key, JSON.stringify(value));
          else if (value) form.append(key, value);
        });
        form.append("totalAmount", totalAmount);

        const res = await fetch("http://localhost:10000/graduations", {
          method: "POST",
          body: form,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Booking failed");

        setStatus({
          text: "✅ Booking submitted! Please upload payment receipt.",
          type: "success",
        });
      }

      // Reset form
      setFormData({
        name: "",
        phone: "",
        email: "",
        date: "",
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
      <header className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-16 text-center px-4">
        <GraduationCap className="w-12 h-12 mx-auto mb-4" />
        <h1 className="text-4xl font-bold">Graduations</h1>
        <p className="mt-2 text-lg">
          Plan and book your graduation event with ease 🎓
        </p>
      </header>

      <section className="bg-white py-12 px-4 max-w-3xl mx-auto shadow-lg rounded-xl -mt-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          Book Your Graduation
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
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
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
            type="date"
            name="date"
            value={formData.date}
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

          <div className="space-y-2">
            <p className="font-medium">Select Services:</p>
            {serviceOptions.map((service) => (
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

          <div>
            <p className="font-medium mb-2">Select Payment Method:</p>
            <div className="flex gap-4">
              {paymentMethods.map((method) => (
                <label
                  key={method.name}
                  className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer ${
                    formData.paymentMethod === method.name
                      ? "border-green-500 bg-green-50"
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
            className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? "Processing..." : "Submit Booking"}
          </button>
        </form>
      </section>
    </div>
  );
}
