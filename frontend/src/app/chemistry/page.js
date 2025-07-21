"use client";
import { useState } from "react";

export default function Page() {
  const [formData, setFormData] = useState({
    fullName: "",
    subjectNames: ["Chemistry"],
    daysAvailable: [],
    timeSlot: "",
    phoneNumber: "",
    mode: "Online",
  });

  const [message, setMessage] = useState({ text: "", type: "" });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim())
      newErrors.fullName = "Full name is required.";
    if (formData.daysAvailable.length === 0)
      newErrors.daysAvailable = "Select available days.";
    if (!formData.timeSlot) newErrors.timeSlot = "Time slot is required.";
    if (!formData.phoneNumber.trim())
      newErrors.phoneNumber = "Phone number is required.";
    else if (!/^\d+$/.test(formData.phoneNumber))
      newErrors.phoneNumber = "Phone number must be numeric.";
    if (!formData.mode) newErrors.mode = "Please select a mode.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCheckboxChange = (day) => {
    setFormData((prev) => {
      const updated = prev.daysAvailable.includes(day)
        ? prev.daysAvailable.filter((d) => d !== day)
        : [...prev.daysAvailable, day];
      return { ...prev, daysAvailable: updated };
    });
    setErrors((prev) => ({ ...prev, daysAvailable: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await fetch("http://localhost:10000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage({
          text: "🎉 Subject registered successfully!",
          type: "success",
        });
        setFormData({
          fullName: "",
          subjectNames: ["Chemistry"],
          daysAvailable: [],
          timeSlot: "",
          phoneNumber: "",
          mode: "Online",
        });
      } else {
        setMessage({
          text: "❌ Registration failed. Please try again.",
          type: "error",
        });
      }

      setTimeout(() => setMessage({ text: "", type: "" }), 4000);
    } catch (err) {
      console.error("Submission error:", err);
      setMessage({
        text: "⚠️ Network error. Check connection and try again.",
        type: "error",
      });
      setTimeout(() => setMessage({ text: "", type: "" }), 4000);
    }
  };

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <form
      onSubmit={handleSubmit}
      className="min-h-screen bg-[#0c0c0c] text-white flex items-center justify-center px-4 py-12"
    >
      <div className="w-full max-w-2xl bg-[#1a1a1a] p-8 rounded-2xl shadow-lg border border-gray-700 space-y-6">
        <h2 className="text-3xl font-bold text-center text-green-400">
          Register for Chemistry Tutoring
        </h2>

        {/* Full Name */}
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-[#111] border border-gray-600 focus:ring-2 focus:ring-green-500"
        />
        {errors.fullName && (
          <p className="text-red-400 text-sm">{errors.fullName}</p>
        )}

        {/* Display selected subject */}
        <p className="text-lg font-medium text-green-300">Subject: Chemistry</p>

        {/* Days Available */}
        <div>
          <p className="font-medium text-lg mb-2">Days Available:</p>
          <div className="flex flex-wrap gap-3">
            {days.map((day) => (
              <label
                key={day}
                className="flex items-center gap-2 bg-[#111] p-2 rounded-lg border border-gray-600 hover:border-green-400 transition"
              >
                <input
                  type="checkbox"
                  checked={formData.daysAvailable.includes(day)}
                  onChange={() => handleCheckboxChange(day)}
                  className="accent-green-500"
                />
                <span className="text-sm">{day}</span>
              </label>
            ))}
          </div>
          {errors.daysAvailable && (
            <p className="text-red-400 text-sm">{errors.daysAvailable}</p>
          )}
        </div>

        {/* Time Slot */}
        <select
          name="timeSlot"
          value={formData.timeSlot}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-[#111] border border-gray-600 focus:ring-2 focus:ring-green-500"
        >
          <option value="" disabled>
            Select Time Slot
          </option>
          <option value="1 Hour a Day">1 Hour a Day</option>
          <option value="2 Hours a Day">2 Hours a Day</option>
          <option value="3 Hours a Day">3 Hours a Day</option>
          <option value="4 Hours a Day">4 Hours a Day</option>
          <option value="Flexible">Flexible</option>
        </select>
        {errors.timeSlot && (
          <p className="text-red-400 text-sm">{errors.timeSlot}</p>
        )}

        {/* Phone Number */}
        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-[#111] border border-gray-600 focus:ring-2 focus:ring-green-500"
        />
        {errors.phoneNumber && (
          <p className="text-red-400 text-sm">{errors.phoneNumber}</p>
        )}

        {/* Mode */}
        <div>
          <p className="font-medium text-lg mb-2">Preferred Mode:</p>
          <div className="flex gap-6">
            {["Online", "In-Person", "Both"].map((mode) => (
              <label key={mode} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="mode"
                  value={mode}
                  checked={formData.mode === mode}
                  onChange={handleChange}
                  className="accent-green-500"
                />
                {mode}
              </label>
            ))}
          </div>
          {errors.mode && <p className="text-red-400 text-sm">{errors.mode}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 p-3 rounded-lg text-white font-semibold transition duration-300"
        >
          Register for Chemistry
        </button>

        {/* Feedback Message */}
        {message.text && (
          <div
            className={`w-full p-4 rounded-lg text-sm font-medium transition-all duration-300 ${
              message.type === "success" ? "bg-green-500" : "bg-red-500"
            } text-white`}
          >
            {message.text}
          </div>
        )}
      </div>
    </form>
  );
}
