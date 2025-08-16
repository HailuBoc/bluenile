"use client";
import { Heart } from "lucide-react";
import { useState } from "react";

export default function WeddingsPage() {
  const services = [
    "Wedding Hall",
    "Photography & Videography",
    "Catering (Food & Drinks)",
    "Decoration",
    "DJ & Entertainment",
    "Car Service (Wedding Transportation)",
    "Guest Management",
  ];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: "",
    guests: "",
    specialRequests: "",
    selectedServices: [],
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `Wedding booking submitted for ${
        formData.name
      }!\nSelected Services: ${formData.selectedServices.join(", ")}`
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <header className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-16 text-center">
        <Heart className="w-12 h-12 mx-auto mb-4" />
        <h1 className="text-4xl font-bold">Weddings</h1>
        <p className="mt-3 text-lg max-w-xl mx-auto">
          Celebrate your special day with elegance and unforgettable moments.
        </p>
      </header>

      {/* Services Section */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Our Wedding Services</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          {services.map((service, i) => (
            <li key={i}>{service}</li>
          ))}
        </ul>
      </section>

      {/* Registration Form */}
      <section className="bg-white py-12 px-4 max-w-3xl mx-auto shadow-lg rounded-lg mt-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          Book Your Wedding
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Personal Details */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
            required
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
            required
          />
          <input
            type="number"
            name="guests"
            placeholder="Number of Guests"
            value={formData.guests}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
            required
          />

          {/* Service Selection */}
          <div>
            <h3 className="font-semibold mb-2">Select Services</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {services.map((service, i) => (
                <label
                  key={i}
                  className="flex items-center space-x-2 border rounded px-3 py-2 cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={formData.selectedServices.includes(service)}
                    onChange={() => handleServiceToggle(service)}
                    className="accent-pink-600"
                  />
                  <span>{service}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Special Requests */}
          <textarea
            name="specialRequests"
            placeholder="Special Requests"
            value={formData.specialRequests}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
          />

          {/* Submit */}
          <button
            type="submit"
            className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700 transition w-full sm:w-auto"
          >
            Submit Booking
          </button>
        </form>
      </section>
    </div>
  );
}
