"use client";

import { useState } from "react";
import Image from "next/image";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Optional: dynamic backend URL for production/local
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:10000";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to send message");
      }

      setSuccessMessage("✅ Your message has been sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      setErrorMessage(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full h-[420px] md:h-[520px] lg:h-[620px]">
        <div className="absolute inset-0">
          <Image
            src="/vict.jpg"
            alt="Contact Background"
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent dark:from-black/60 dark:via-black/40 rounded-b-xl" />
        </div>

        <div className="relative z-10 flex items-center justify-center h-full px-4">
          <div className="text-center max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg">
              Get in Touch
            </h1>
            <p className="mt-3 text-sm sm:text-base md:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
              We’d love to hear from you! Fill out the form below to reach out.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="max-w-5xl w-full mx-auto px-6 py-16 md:py-20 flex-1">
        <div className="bg-gray-700 dark:bg-gray-800 rounded-lg shadow-xl p-6 md:p-10">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-100 text-center">
            Contact Us
          </h2>

          {/* Alert messages */}
          {successMessage && (
            <div className="mb-4 text-green-500 text-center font-medium">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="mb-4 text-red-500 text-center font-medium">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="p-3 rounded-md border border-gray-500 bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="p-3 rounded-md border border-gray-500 bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="5"
              className="p-3 rounded-md border border-gray-500 bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="mt-4 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-md transition duration-200 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <svg
                    className="w-5 h-5 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Sending...
                </>
              ) : (
                "Send Message"
              )}
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-center py-6 mt-auto">
        <p>© {new Date().getFullYear()} Blue Nile plc. All rights reserved.</p>
      </footer>
    </div>
  );
}
