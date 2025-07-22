"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${baseUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true);
        setMessage(data.message || "Login successful.");
        setTimeout(() => {
          router.push("/HeaderCombined");
        }, 1000); // slight delay to let user see success
      } else {
        setIsSuccess(false);
        setMessage(data.message || "Login failed.");
      }
    } catch (error) {
      setIsSuccess(false);
      setMessage("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0d1117] px-4">
      <form
        onSubmit={handleLogin}
        className="bg-[#1f2937] p-10 rounded-2xl shadow-2xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-400">
          Hulu School Login
        </h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-3 bg-[#111827] text-white border border-gray-600 rounded-lg mb-4 placeholder-gray-400"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-3 bg-[#111827] text-white border border-gray-600 rounded-lg mb-4 placeholder-gray-400"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

        <div className="flex items-center justify-center my-4">
          <div className="border-t w-full border-gray-600" />
          <span className="px-2 text-sm text-gray-500">or</span>
          <div className="border-t w-full border-gray-600" />
        </div>

        {message && (
          <p
            className={`mt-4 text-center font-medium ${
              isSuccess ? "text-green-400" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-400">
            Don’t have an account?{" "}
            <Link
              href="/signup"
              className="text-blue-400 hover:text-blue-500 font-medium"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
