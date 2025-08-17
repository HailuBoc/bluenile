"use client";
import { Heart, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";

export default function WeddingsPage() {
  // Service options based on marriage type
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

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: "",
    guests: "",
    marriageType: "",
    specialRequests: "",
    selectedServices: [],
  });

  const [availableServices, setAvailableServices] = useState([]);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Update available services when marriage type changes
  useEffect(() => {
    if (formData.marriageType) {
      setAvailableServices(serviceOptions[formData.marriageType]);
      setFormData((prev) => ({ ...prev, selectedServices: [] })); // reset selected
    }
  }, [formData.marriageType]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // clear error as user types
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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.date.trim()) newErrors.date = "Date is required";
    if (!formData.guests.trim())
      newErrors.guests = "Number of guests is required";
    if (!formData.marriageType.trim())
      newErrors.marriageType = "Marriage type is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSuccessMessage(`🎉 Wedding booking submitted for ${formData.name}!`);

    // Auto-hide success message after 3s
    setTimeout(() => setSuccessMessage(""), 3000);

    // Reset form
    setFormData({
      name: "",
      email: "",
      date: "",
      guests: "",
      marriageType: "",
      specialRequests: "",
      selectedServices: [],
    });
    setAvailableServices([]);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <header className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-16 text-center px-4">
        <Heart className="w-12 h-12 mx-auto mb-4" />
        <h1 className="text-4xl font-bold">Weddings</h1>
        <p className="mt-3 text-lg max-w-xl mx-auto">
          Celebrate your special day with elegance and unforgettable moments.
        </p>
      </header>

      {/* Registration Form */}
      <section className="bg-white py-12 px-4 max-w-3xl mx-auto shadow-lg rounded-xl mt-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          Book Your Wedding
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Personal Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full border rounded px-4 py-2 ${
                  errors.name ? "border-red-500" : ""
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className={`w-full border rounded px-4 py-2 ${
                  errors.email ? "border-red-500" : ""
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`w-full border rounded px-4 py-2 ${
                  errors.date ? "border-red-500" : ""
                }`}
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date}</p>
              )}
            </div>
            <div>
              <input
                type="number"
                name="guests"
                placeholder="Number of Guests"
                value={formData.guests}
                onChange={handleChange}
                className={`w-full border rounded px-4 py-2 ${
                  errors.guests ? "border-red-500" : ""
                }`}
              />
              {errors.guests && (
                <p className="text-red-500 text-sm mt-1">{errors.guests}</p>
              )}
            </div>
          </div>

          {/* Marriage Type */}
          <div>
            <select
              name="marriageType"
              value={formData.marriageType}
              onChange={handleChange}
              className={`w-full border rounded px-4 py-2 ${
                errors.marriageType ? "border-red-500" : ""
              }`}
            >
              <option value="">Select Type of Marriage</option>
              <option value="Religion">Religion</option>
              <option value="Modern">Modern</option>
              <option value="Traditional">Traditional</option>
            </select>
            {errors.marriageType && (
              <p className="text-red-500 text-sm mt-1">{errors.marriageType}</p>
            )}
          </div>

          {/* Dynamic Service Selection */}
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
                    <span className="text-sm sm:text-base">{service}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Special Requests */}
          <textarea
            name="specialRequests"
            placeholder="Special Requests"
            value={formData.specialRequests}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2 min-h-[100px]"
          />

          {/* Success Message */}
          {successMessage && (
            <div className="flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-3 rounded-lg shadow">
              <CheckCircle className="w-5 h-5" />
              <p>{successMessage}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition w-full sm:w-auto font-semibold"
          >
            Submit Booking
          </button>
        </form>
      </section>
    </div>
  );
}
